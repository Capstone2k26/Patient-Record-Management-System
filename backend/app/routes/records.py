from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.utils.validators import validate_required_fields
from werkzeug.utils import secure_filename
import os

bp = Blueprint('records', __name__, url_prefix='/api/records')

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/', methods=['GET'])
@jwt_required()
def get_records():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user['role'] == 'patient':
        records = MedicalRecord.find_by_patient(current_app.db, user_id)
    elif user['role'] in ['doctor', 'medical']:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return jsonify({'error': 'patient_id required for staff access'}), 400
        records = MedicalRecord.find_by_patient(current_app.db, patient_id)
    else:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({'records': records}), 200

@bp.route('/<record_id>', methods=['GET'])
@jwt_required()
def get_record(record_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    record = MedicalRecord.find_by_id(current_app.db, record_id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404
    
    if user['role'] == 'patient' and record['patient_id'] != user_id:
        return jsonify({'error': 'Unauthorized access to this record'}), 403
    
    return jsonify({'record': record}), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_record():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user['role'] not in ['doctor', 'medical']:
        return jsonify({'error': 'Only medical staff can create records'}), 403
    
    data = request.get_json()
    
    required = ['patient_id', 'title']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400
    
    data['created_by'] = user_id
    record = MedicalRecord.create(current_app.db, data)
    
    return jsonify({
        'message': 'Medical record created successfully',
        'record': record
    }), 201

@bp.route('/<record_id>', methods=['PUT'])
@jwt_required()
def update_record(record_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user['role'] not in ['doctor', 'medical']:
        return jsonify({'error': 'Only medical staff can update records'}), 403
    
    record = MedicalRecord.find_by_id(current_app.db, record_id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404
    
    data = request.get_json()
    updated = MedicalRecord.update(current_app.db, record_id, data)
    
    if not updated:
        return jsonify({'error': 'Update failed'}), 500
    
    return jsonify({'message': 'Record updated successfully'}), 200

@bp.route('/<record_id>', methods=['DELETE'])
@jwt_required()
def delete_record(record_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user['role'] != 'doctor':
        return jsonify({'error': 'Only doctors can delete records'}), 403
    
    record = MedicalRecord.find_by_id(current_app.db, record_id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404
    
    deleted = MedicalRecord.delete(current_app.db, record_id)
    
    if not deleted:
        return jsonify({'error': 'Delete failed'}), 500
    
    return jsonify({'message': 'Record deleted successfully'}), 200

@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
    
    filename = secure_filename(file.filename)
    upload_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    filepath = os.path.join(upload_folder, f"{user_id}_{filename}")
    file.save(filepath)
    
    return jsonify({
        'message': 'File uploaded successfully',
        'filename': filename,
        'filepath': filepath
    }), 201
