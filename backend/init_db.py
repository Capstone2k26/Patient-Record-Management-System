from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
db_name = os.getenv('DB_NAME', 'prms_database')

print(f"Connecting to MongoDB: {mongo_uri}")
client = MongoClient(mongo_uri)
db = client[db_name]

print("\n🗄️  Initializing PRMS Database...")

db.users.delete_many({})
db.medical_records.delete_many({})
db.appointments.delete_many({})
db.health_metrics.delete_many({})
db.notifications.delete_many({})

demo_users = [
    {
        'username': 'patient',
        'password_hash': generate_password_hash('patient123'),
        'role': 'patient',
        'name': 'Sarah Jenkins',
        'user_id': 'PRMS-84920',
        'email': 'sarah.jenkins@example.com',
        'phone': '+1-555-0101',
        'date_of_birth': '1992-03-15',
        'gender': 'Female',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'is_active': True
    },
    {
        'username': 'medical',
        'password_hash': generate_password_hash('medical123'),
        'role': 'medical',
        'name': 'Elena Vance, RN',
        'user_id': 'MED-4029',
        'email': 'elena.vance@prms.hospital',
        'phone': '+1-555-0102',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'is_active': True
    },
    {
        'username': 'doctor',
        'password_hash': generate_password_hash('doctor123'),
        'role': 'doctor',
        'name': 'Dr. Robert Chen, MD',
        'user_id': 'DOC-1082',
        'email': 'robert.chen@prms.hospital',
        'phone': '+1-555-0103',
        'specialization': 'Cardiology',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'is_active': True
    }
]

db.users.insert_many(demo_users)
print("✅ Demo users created (patient, medical, doctor)")

demo_records = [
    {
        'patient_id': 'PRMS-84920',
        'record_type': 'lab_report',
        'title': 'Comprehensive Metabolic Panel',
        'description': 'Routine metabolic panel including glucose, electrolytes, and kidney function',
        'diagnosis': 'Type 2 Diabetes - Well Controlled',
        'medications': ['Metformin HCl 500mg', 'Atorvastatin 10mg'],
        'allergies': ['Penicillin'],
        'test_results': {
            'glucose': '92 mg/dL',
            'eGFR': '>90',
            'creatinine': '0.9 mg/dL',
            'cholesterol': '176 mg/dL'
        },
        'vital_signs': {
            'blood_pressure': '120/78',
            'heart_rate': '72 bpm',
            'temperature': '98.6°F'
        },
        'doctor_notes': 'All metabolic indices within optimal limits. Continue current dietary regimen.',
        'visit_date': datetime(2026, 8, 14),
        'facility': 'Quest Diagnostics',
        'doctor_name': 'Dr. Robert Chen',
        'created_by': 'DOC-1082',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'status': 'active'
    }
]

db.medical_records.insert_many(demo_records)
print("✅ Demo medical records created")

demo_appointments = [
    {
        'patient_id': 'PRMS-84920',
        'doctor_id': 'DOC-1082',
        'appointment_date': '2026-08-24',
        'appointment_time': '10:30 AM',
        'type': 'PRMS Telehealth (Video)',
        'notes': 'Review quarterly metabolic panel and fasting glucose trajectory.',
        'status': 'confirmed',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
]

db.appointments.insert_many(demo_appointments)
print("✅ Demo appointments created")

demo_metrics = [
    {
        'patient_id': 'PRMS-84920',
        'metric_type': 'blood_glucose',
        'value': 92,
        'unit': 'mg/dL',
        'notes': 'Fasting glucose',
        'recorded_by': 'PRMS-84920',
        'recorded_at': datetime(2026, 8, 14, 8, 0),
        'created_at': datetime.utcnow()
    },
    {
        'patient_id': 'PRMS-84920',
        'metric_type': 'blood_pressure',
        'value': '120/78',
        'unit': 'mmHg',
        'notes': 'Morning reading',
        'recorded_by': 'PRMS-84920',
        'recorded_at': datetime(2026, 8, 14, 8, 15),
        'created_at': datetime.utcnow()
    }
]

db.health_metrics.insert_many(demo_metrics)
print("✅ Demo health metrics created")

demo_notifications = [
    {
        'user_id': 'PRMS-84920',
        'type': 'info',
        'title': 'Appointment Reminder',
        'message': 'Cardiology follow-up consultation with Dr. Robert Chen is on Aug 24, 10:30 AM.',
        'is_read': False,
        'created_at': datetime.utcnow()
    }
]

db.notifications.insert_many(demo_notifications)
print("✅ Demo notifications created")

db.users.create_index('username', unique=True)
db.users.create_index('user_id', unique=True)
db.medical_records.create_index('patient_id')
db.appointments.create_index([('patient_id', 1), ('appointment_date', -1)])
db.health_metrics.create_index([('patient_id', 1), ('recorded_at', -1)])
print("✅ Database indexes created")

print(f"\n{'='*60}")
print("✅ Database initialization complete!")
print(f"{'='*60}")
print("\n📋 Demo Credentials:")
print("   Patient: username=patient, password=patient123")
print("   Medical Staff: username=medical, password=medical123")
print("   Doctor: username=doctor, password=doctor123\n")

client.close()
