from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.utils.validators import validate_required_fields
from datetime import datetime, timezone
import json
import os
import uuid

bp = Blueprint('health_metrics', __name__, url_prefix='/api/health-metrics')

def _get_data_file():
    return os.path.join(current_app.config['DATA_DIR'], 'health_metrics.json')

def _load():
    with open(_get_data_file(), 'r') as f:
        return json.load(f)

def _save(data):
    with open(_get_data_file(), 'w') as f:
        json.dump(data, f, indent=2)

@bp.route('/', methods=['GET'])
@jwt_required()
def get_health_metrics():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user['role'] == 'patient':
        patient_id = user_id
    else:
        patient_id = request.args.get('patient_id')
        if not patient_id:
            return jsonify({'error': 'patient_id required'}), 400

    metric_type = request.args.get('type')
    limit = int(request.args.get('limit', 30))

    metrics = _load()
    metrics = [m for m in metrics if m.get('patient_id') == patient_id]

    if metric_type:
        metrics = [m for m in metrics if m.get('metric_type') == metric_type]

    metrics.sort(key=lambda x: x.get('recorded_at', ''), reverse=True)
    return jsonify({'metrics': metrics[:limit]}), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_health_metric():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    required = ['metric_type', 'value']
    is_valid, error = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({'error': error}), 400

    metric_data = {
        'id': str(uuid.uuid4()),
        'patient_id': user_id if user['role'] == 'patient' else data.get('patient_id', user_id),
        'metric_type': data['metric_type'],
        'value': data['value'],
        'unit': data.get('unit', ''),
        'notes': data.get('notes', ''),
        'recorded_by': user_id,
        'recorded_at': data.get('recorded_at', datetime.now(timezone.utc).isoformat()),
        'created_at': datetime.now(timezone.utc).isoformat()
    }

    metrics = _load()
    metrics.append(metric_data)
    _save(metrics)

    return jsonify({
        'message': 'Health metric recorded successfully',
        'metric': metric_data
    }), 201

@bp.route('/chart-data', methods=['GET'])
@jwt_required()
def get_chart_data():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    patient_id = user_id if user['role'] == 'patient' else request.args.get('patient_id', user_id)
    metric_type = request.args.get('type', 'blood_pressure')

    metrics = _load()
    filtered = [m for m in metrics if m.get('patient_id') == patient_id and m.get('metric_type') == metric_type]
    filtered.sort(key=lambda x: x.get('recorded_at', ''))
    filtered = filtered[:30]

    chart_data = {
        'labels': [m.get('recorded_at', '')[:10] for m in filtered],
        'datasets': [{
            'label': metric_type.replace('_', ' ').title(),
            'data': [m.get('value') for m in filtered]
        }]
    }

    return jsonify({'chart_data': chart_data, 'metric_type': metric_type}), 200

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    patient_id = user_id if user['role'] == 'patient' else request.args.get('patient_id', user_id)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    metrics = _load()
    metrics = [m for m in metrics if m.get('patient_id') == patient_id]

    if start_date:
        metrics = [m for m in metrics if m.get('recorded_at', '') >= start_date]
    if end_date:
        metrics = [m for m in metrics if m.get('recorded_at', '') <= end_date + 'Z']

    metrics.sort(key=lambda x: x.get('recorded_at', ''))
    return jsonify({'history': metrics}), 200
