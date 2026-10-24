from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.find_by_id(user_id)
            
            if not user or user['role'] not in allowed_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def can_access_patient_data(current_user_id, patient_id):
    current_user = User.find_by_id(current_user_id)
    
    if not current_user:
        return False
    
    if current_user['role'] == 'patient':
        return current_user_id == patient_id
    
    if current_user['role'] in ['doctor', 'medical']:
        return True
    
    return False
