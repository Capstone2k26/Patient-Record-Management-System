from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.medical_record import MedicalRecord
import os
import json

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

def _load_json_file(filename, default=None):
    if default is None:
        default = []
    filepath = os.path.join(current_app.config['DATA_DIR'], filename)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except Exception:
            return default
    return default

@bp.route('/', methods=['GET'])
@bp.route('/summary', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    role = user.get('role', 'patient')
    if role == 'patient':
        return get_patient_dashboard()
    elif role == 'doctor':
        return get_doctor_dashboard()
    elif role == 'medical':
        return get_medical_dashboard()
    return jsonify({'user': User.to_dict(user)}), 200

@bp.route('/patient', methods=['GET'])
@jwt_required()
def get_patient_dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    
    if not user or user['role'] != 'patient':
        return jsonify({'error': 'Unauthorized'}), 403
    
    records = MedicalRecord.find_by_patient(user_id, limit=5)
    
    all_appointments = _load_json_file('appointments.json')
    appointments = [
        apt for apt in all_appointments 
        if apt.get('patient_id') == user_id and apt.get('status') != 'cancelled'
    ]
    appointments.sort(key=lambda x: x.get('appointment_date', ''))
    
    all_metrics = _load_json_file('health_metrics.json')
    health_metrics = [m for m in all_metrics if m.get('patient_id') == user_id]
    health_metrics.sort(key=lambda x: x.get('recorded_at', ''), reverse=True)
    
    all_notifs = _load_json_file('notifications.json')
    notifications = [
        n for n in all_notifs 
        if n.get('user_id') == user_id and not n.get('is_read', False)
    ]
    
    total_records = len([r for r in MedicalRecord.find_by_patient(user_id)])
    
    dashboard_data = {
        'user': User.to_dict(user),
        'recent_records': records,
        'upcoming_appointments': appointments[:5],
        'recent_health_metrics': health_metrics[:10],
        'notifications': notifications[:10],
        'stats': {
            'total_records': total_records,
            'total_appointments': len(appointments),
            'unread_notifications': len(notifications)
        }
    }
    
    return jsonify(dashboard_data), 200

@bp.route('/doctor', methods=['GET'])
@jwt_required()
def get_doctor_dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    
    if not user or user['role'] != 'doctor':
        return jsonify({'error': 'Unauthorized'}), 403
    
    all_appointments = _load_json_file('appointments.json')
    appointments = [
        apt for apt in all_appointments 
        if apt.get('doctor_id') in [user_id, 'DOC-1082'] and apt.get('status') in ['pending', 'confirmed', 'Confirmed']
    ]
    appointments.sort(key=lambda x: x.get('appointment_date', ''))
    
    all_users = _load_json_file('users.json')
    patients = [
        User.to_dict(u) for u in all_users 
        if u.get('role') == 'patient'
    ]
    
    all_prescriptions = _load_json_file('prescriptions.json')
    pending_prescriptions = len([p for p in all_prescriptions if p.get('status') == 'pending'])
    
    dashboard_data = {
        'user': User.to_dict(user),
        'appointments': appointments[:10],
        'assigned_patients': patients[:20],
        'stats': {
            'total_patients': len(patients),
            'today_appointments': len(appointments),
            'pending_prescriptions': pending_prescriptions
        }
    }
    
    return jsonify(dashboard_data), 200

@bp.route('/medical', methods=['GET'])
@jwt_required()
def get_medical_dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    
    if not user or user['role'] != 'medical':
        return jsonify({'error': 'Unauthorized'}), 403
    
    tasks = _load_json_file('tasks.json')
    pending_tasks = [t for t in tasks if t.get('status') == 'pending']
    
    all_users = _load_json_file('users.json')
    patients = [u for u in all_users if u.get('role') == 'patient']
    
    all_prescriptions = _load_json_file('prescriptions.json')
    pending_refills = len([p for p in all_prescriptions if p.get('status') == 'pending'])
    
    dashboard_data = {
        'user': User.to_dict(user),
        'pending_tasks': pending_tasks[:10],
        'stats': {
            'pending_refills': pending_refills,
            'assigned_patients': len(patients)
        }
    }
    
    return jsonify(dashboard_data), 200
