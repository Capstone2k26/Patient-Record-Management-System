from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.utils.validators import validate_required_fields

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    required = ['username', 'password', 'role', 'name']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400
    
    if data['role'] not in User.ROLES:
        return jsonify({'error': f"Invalid role. Must be one of: {', '.join(User.ROLES)}"}), 400
    
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    user = User.create(current_app.db, data)
    if not user:
        return jsonify({'error': 'Username already exists'}), 409
    
    access_token = create_access_token(identity=user['user_id'])
    
    return jsonify({
        'message': 'Registration successful',
        'token': access_token,
        'user': User.to_dict(user)
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    required = ['username', 'password']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400
    
    user = User.find_by_username(current_app.db, data['username'])
    
    if not user or not User.verify_password(user, data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if not user.get('is_active', True):
        return jsonify({'error': 'Account is disabled'}), 403
    
    access_token = create_access_token(identity=user['user_id'])
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': User.to_dict(user)
    }), 200

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': User.to_dict(user)}), 200

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logout successful'}), 200
