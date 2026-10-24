from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
import os
from flask import current_app

class User:
    ROLES = ['patient', 'medical', 'doctor']
    
    @staticmethod
    def _get_data_file():
        return os.path.join(current_app.config['DATA_DIR'], 'users.json')
    
    @staticmethod
    def _load_users():
        with open(User._get_data_file(), 'r') as f:
            return json.load(f)
    
    @staticmethod
    def _save_users(users):
        with open(User._get_data_file(), 'w') as f:
            json.dump(users, f, indent=2)
    
    @staticmethod
    def create(data):
        users = User._load_users()
        
        if User.find_by_username(data['username']):
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
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'is_active': True
        }
        
        users.append(user_data)
        User._save_users(users)
        return user_data
    
    @staticmethod
    def find_by_username(username):
        users = User._load_users()
        query = str(username).strip().lower()
        return next((u for u in users if u['username'].lower() == query or u.get('user_id', '').lower() == query or u.get('email', '').lower() == query), None)
    
    @staticmethod
    def find_by_id(user_id):
        users = User._load_users()
        return next((u for u in users if u['user_id'] == user_id), None)
    
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
