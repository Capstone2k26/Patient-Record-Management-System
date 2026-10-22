from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.utils.validators import validate_required_fields
from datetime import datetime
from bson import ObjectId

bp = Blueprint('health_metrics', __name__, url_prefix='/api/health-metrics')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_health_metrics():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user['role'] == 'patient':
        patient_id = user_id
    else:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return jsonify({'error': 'patient_id required'}), 400
    
    metric_type = request.args.get('type')
    query = {'patient_id': patient_id}
    
    if metric_type:
        query['metric_type'] = metric_type
    
    limit = int(request.args.get('limit', 30))
    
    metrics = list(current_app.db.health_metrics.find(query).sort('recorded_at', -1).limit(limit))
    
    for metric in metrics:
        metric['_id'] = str(metric['_id'])
    
    return jsonify({'metrics': metrics}), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_health_metric():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    required = ['metric_type', 'value']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400
    
    metric_data = {
        'patient_id': user_id if user['role'] == 'patient' else data.get('patient_id'),
        'metric_type': data['metric_type'],
        'value': data['value'],
        'unit': data.get('unit', ''),
        'notes': data.get('notes', ''),
        'recorded_by': user_id,
        'recorded_at': data.get('recorded_at', datetime.utcnow()),
        'created_at': datetime.utcnow()
    }
    
    result = current_app.db.health_metrics.insert_one(metric_data)
    metric_data['_id'] = str(result.inserted_id)
    
    return jsonify({
        'message': 'Health metric recorded successfully',
        'metric': metric_data
    }), 201

@bp.route('/chart-data', methods=['GET'])
@jwt_required()
def get_chart_data():
    user_id = get_jwt_identity()
    user = User.find_by_id(current_app.db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    patient_id = user_id if user['role'] == 'patient' else request.args.get('patient_id')
    metric_type = request.args.get('type', 'blood_pressure')
    
    metrics = list(current_app.db.health_metrics.find({
        'patient_id': patient_id,
        'metric_type': metric_type
    }).sort('recorded_at', 1).limit(30))
    
    chart_data = {
        'labels': [],
        'datasets': []
    }
    
    for metric in metrics:
        chart_data['labels'].append(metric['recorded_at'].strftime('%Y-%m-%d'))
        
        if 'datasets' not in chart_data or len(chart_data['datasets']) == 0:
            chart_data['datasets'] = [{
                'label': metric_type.replace('_', ' ').title(),
                'data': []
            }]
        
        chart_data['datasets'][0]['data'].append(metric['value'])
    
    return jsonify({'chart_data': chart_data}), 200
