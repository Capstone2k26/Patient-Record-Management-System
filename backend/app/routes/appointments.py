from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.utils.validators import validate_required_fields
from datetime import datetime, timezone
import json
import os
import uuid

bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')

def _get_data_file():
    return os.path.join(current_app.config['DATA_DIR'], 'appointments.json')

def _load():
    with open(_get_data_file(), 'r') as f:
        return json.load(f)

def _save(data):
    with open(_get_data_file(), 'w') as f:
        json.dump(data, f, indent=2)

@bp.route('/', methods=['GET'])
@jwt_required()
def get_appointments():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    appointments = _load()

    if user['role'] == 'patient':
        appointments = [a for a in appointments if a.get('patient_id') == user_id]
    elif user['role'] == 'doctor':
        appointments = [a for a in appointments if a.get('doctor_id') == user_id]

    appointments.sort(key=lambda x: x.get('appointment_date', ''), reverse=True)
    return jsonify({'appointments': appointments}), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_appointment():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    required = ['appointment_date', 'appointment_time', 'type']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400

    appointment_data = {
        'id': str(uuid.uuid4()),
        'patient_id': user_id if user['role'] == 'patient' else data.get('patient_id'),
        'doctor_id': data.get('doctor_id', 'DOC-1082'),
        'appointment_date': data['appointment_date'],
        'appointment_time': data['appointment_time'],
        'type': data['type'],
        'notes': data.get('notes', ''),
        'status': 'pending',
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat()
    }

    appointments = _load()
    appointments.append(appointment_data)
    _save(appointments)

    return jsonify({
        'message': 'Appointment created successfully',
        'appointment': appointment_data
    }), 201

@bp.route('/<appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    appointments = _load()
    appointment = next((a for a in appointments if a.get('id') == appointment_id), None)

    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404

    if user['role'] == 'patient' and appointment.get('patient_id') != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    data['updated_at'] = datetime.now(timezone.utc).isoformat()

    for i, a in enumerate(appointments):
        if a.get('id') == appointment_id:
            appointments[i].update(data)
            break

    _save(appointments)
    return jsonify({'message': 'Appointment updated successfully'}), 200

@bp.route('/<appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    appointments = _load()
    appointment = next((a for a in appointments if a.get('id') == appointment_id), None)

    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404

    if user['role'] == 'patient' and appointment.get('patient_id') != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    for i, a in enumerate(appointments):
        if a.get('id') == appointment_id:
            appointments[i]['status'] = 'cancelled'
            appointments[i]['updated_at'] = datetime.now(timezone.utc).isoformat()
            break

    _save(appointments)
    return jsonify({'message': 'Appointment cancelled successfully'}), 200
