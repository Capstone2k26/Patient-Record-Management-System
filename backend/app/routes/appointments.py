from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.utils.validators import validate_required_fields
from datetime import datetime
import json
import os
import uuid

bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_appointments():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    query = {}
    if user['role'] == 'patient':
        query['patient_id'] = user_id
    elif user['role'] == 'doctor':
        query['doctor_id'] = user_id
    
    appointments = list(current_app.db.appointments.find(query).sort('appointment_date', -1))
    
    for apt in appointments:
        apt['_id'] = str(apt['_id'])
    
    return jsonify({'appointments': appointments}), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_appointment():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    required = ['appointment_date', 'appointment_time', 'type']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400
    
    appointment_data = {
        'patient_id': user_id if user['role'] == 'patient' else data.get('patient_id'),
        'doctor_id': data.get('doctor_id'),
        'appointment_date': data['appointment_date'],
        'appointment_time': data['appointment_time'],
        'type': data['type'],
        'notes': data.get('notes', ''),
        'status': 'pending',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    result = current_app.db.appointments.insert_one(appointment_data)
    appointment_data['_id'] = str(result.inserted_id)
    
    return jsonify({
        'message': 'Appointment created successfully',
        'appointment': appointment_data
    }), 201

@bp.route('/<appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    appointment = current_app.db.appointments.find_one({'_id': ObjectId(appointment_id)})
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    if user['role'] == 'patient' and appointment['patient_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    data['updated_at'] = datetime.utcnow()
    
    result = current_app.db.appointments.update_one(
        {'_id': ObjectId(appointment_id)},
        {'$set': data}
    )
    
    if result.modified_count == 0:
        return jsonify({'error': 'Update failed'}), 500
    
    return jsonify({'message': 'Appointment updated successfully'}), 200

@bp.route('/<appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    appointment = current_app.db.appointments.find_one({'_id': ObjectId(appointment_id)})
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    if user['role'] == 'patient' and appointment['patient_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = current_app.db.appointments.update_one(
        {'_id': ObjectId(appointment_id)},
        {'$set': {'status': 'cancelled', 'updated_at': datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        return jsonify({'error': 'Cancellation failed'}), 500
    
    return jsonify({'message': 'Appointment cancelled successfully'}), 200
