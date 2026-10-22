from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.medical_record import MedicalRecord

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/patient', methods=['GET'])
@jwt_required()
def get_patient_dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user or user['role'] != 'patient':
        return jsonify({'error': 'Unauthorized'}), 403
    
    records = MedicalRecord.find_by_patient(current_app.db, user_id, limit=5)
    
    appointments = list(current_app.db.appointments.find(
        {'patient_id': user_id, 'status': {'$ne': 'cancelled'}}
    ).sort('appointment_date', 1).limit(5))
    
    for apt in appointments:
        apt['_id'] = str(apt['_id'])
    
    health_metrics = list(current_app.db.health_metrics.find(
        {'patient_id': user_id}
    ).sort('recorded_at', -1).limit(10))
    
    for metric in health_metrics:
        metric['_id'] = str(metric['_id'])
    
    notifications = list(current_app.db.notifications.find(
        {'user_id': user_id, 'is_read': False}
    ).sort('created_at', -1).limit(10))
    
    for notif in notifications:
        notif['_id'] = str(notif['_id'])
    
    dashboard_data = {
        'user': User.to_dict(user),
        'recent_records': records,
        'upcoming_appointments': appointments,
        'recent_health_metrics': health_metrics,
        'notifications': notifications,
        'stats': {
            'total_records': current_app.db.medical_records.count_documents({'patient_id': user_id, 'status': 'active'}),
            'total_appointments': current_app.db.appointments.count_documents({'patient_id': user_id}),
            'unread_notifications': len(notifications)
        }
    }
    
    return jsonify(dashboard_data), 200

@bp.route('/doctor', methods=['GET'])
@jwt_required()
def get_doctor_dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user or user['role'] != 'doctor':
        return jsonify({'error': 'Unauthorized'}), 403
    
    appointments = list(current_app.db.appointments.find(
        {'doctor_id': user_id, 'status': {'$in': ['pending', 'confirmed']}}
    ).sort('appointment_date', 1).limit(10))
    
    for apt in appointments:
        apt['_id'] = str(apt['_id'])
    
    patients = list(current_app.db.users.find(
        {'role': 'patient', 'assigned_doctor': user_id}
    ).limit(20))
    
    for patient in patients:
        patient['_id'] = str(patient['_id'])
    
    dashboard_data = {
        'user': User.to_dict(user),
        'appointments': appointments,
        'assigned_patients': patients,
        'stats': {
            'total_patients': len(patients),
            'today_appointments': sum(1 for apt in appointments if apt.get('appointment_date', '').startswith('2026')),
            'pending_prescriptions': current_app.db.prescriptions.count_documents({'doctor_id': user_id, 'status': 'pending'})
        }
    }
    
    return jsonify(dashboard_data), 200

@bp.route('/medical', methods=['GET'])
@jwt_required()
def get_medical_dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user or user['role'] != 'medical':
        return jsonify({'error': 'Unauthorized'}), 403
    
    pending_tasks = list(current_app.db.tasks.find(
        {'assigned_to': user_id, 'status': 'pending'}
    ).limit(10))
    
    for task in pending_tasks:
        task['_id'] = str(task['_id'])
    
    dashboard_data = {
        'user': User.to_dict(user),
        'pending_tasks': pending_tasks,
        'stats': {
            'pending_refills': current_app.db.prescriptions.count_documents({'status': 'pending'}),
            'assigned_patients': current_app.db.users.count_documents({'role': 'patient'})
        }
    }
    
    return jsonify(dashboard_data), 200
