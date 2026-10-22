from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from datetime import timedelta
import os

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
    
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    client = MongoClient(mongo_uri)
    app.db = client[os.getenv('DB_NAME', 'prms_database')]
    
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
