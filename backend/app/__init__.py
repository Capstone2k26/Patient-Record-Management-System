from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
import json

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:*", "http://127.0.0.1:*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"]
        }
    })
    
    jwt = JWTManager(app)
    
    # Initialize JSON storage
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    app.config['DATA_DIR'] = data_dir
    
    # Initialize data files
    init_data_files(data_dir)
    
    from app.routes import auth, records, dashboard, appointments, health_metrics
    app.register_blueprint(auth.bp)
    app.register_blueprint(records.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(appointments.bp)
    app.register_blueprint(health_metrics.bp)
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'PRMS Backend API is running'}, 200
    
    return app

def init_data_files(data_dir):
    files = {
        'users.json': [],
        'medical_records.json': [],
        'appointments.json': [],
        'health_metrics.json': [],
        'notifications.json': []
    }
    
    for filename, default_data in files.items():
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            with open(filepath, 'w') as f:
                json.dump(default_data, f, indent=2)
