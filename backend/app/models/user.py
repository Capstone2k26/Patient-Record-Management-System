from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User:
    ROLES = ['patient', 'medical', 'doctor']
    
    @staticmethod
    def create(db, data):
        if User.find_by_username(db, data['username']):
            return None
        
        user_data = {
            'username': data['username'],
            'password_hash': generate_password_hash(data['password']),
            'role': data['role'],
            'name': data['name'],
            'user_id': data.get('user_id', f"{data['role'].upper()[:3]}-{datetime.now().strftime('%Y%m%d%H%M%S')}"),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'date_of_birth': data.get('date_of_birth'),
            'gender': data.get('gender'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        }
        
        result = db.users.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
        return user_data
    
    @staticmethod
    def find_by_username(db, username):
        user = db.users.find_one({'username': username})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def find_by_id(db, user_id):
        user = db.users.find_one({'user_id': user_id})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def verify_password(user, password):
        return check_password_hash(user['password_hash'], password)
    
    @staticmethod
    def to_dict(user):
        return {
            'user_id': user['user_id'],
            'username': user['username'],
            'role': user['role'],
            'name': user['name'],
            'email': user.get('email'),
            'phone': user.get('phone'),
            'date_of_birth': user.get('date_of_birth'),
            'gender': user.get('gender')
        }
