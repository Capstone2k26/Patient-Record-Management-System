from werkzeug.security import generate_password_hash
from datetime import datetime
import json
import os

# Initialize demo data
data_dir = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(data_dir, exist_ok=True)

print("\nInitializing PRMS Data Storage...")

# Demo users
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
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
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
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
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
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
        'is_active': True
    }
]

# Demo medical records
demo_records = [
    {
        'id': 'rec-001',
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
        'visit_date': '2026-08-14T10:00:00Z',
        'facility': 'Quest Diagnostics',
        'doctor_name': 'Dr. Robert Chen',
        'created_by': 'DOC-1082',
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
        'status': 'active'
    }
]

# Demo appointments
demo_appointments = [
    {
        'id': 'apt-001',
        'patient_id': 'PRMS-84920',
        'doctor_id': 'DOC-1082',
        'appointment_date': '2026-08-24',
        'appointment_time': '10:30 AM',
        'type': 'PRMS Telehealth (Video)',
        'notes': 'Review quarterly metabolic panel and fasting glucose trajectory.',
        'status': 'confirmed',
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat()
    }
]

# Demo health metrics
demo_metrics = [
    {
        'id': 'met-001',
        'patient_id': 'PRMS-84920',
        'metric_type': 'blood_glucose',
        'value': 92,
        'unit': 'mg/dL',
        'notes': 'Fasting glucose',
        'recorded_by': 'PRMS-84920',
        'recorded_at': '2026-08-14T08:00:00Z',
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 'met-002',
        'patient_id': 'PRMS-84920',
        'metric_type': 'blood_pressure',
        'value': '120/78',
        'unit': 'mmHg',
        'notes': 'Morning reading',
        'recorded_by': 'PRMS-84920',
        'recorded_at': '2026-08-14T08:15:00Z',
        'created_at': datetime.utcnow().isoformat()
    }
]

# Demo notifications
demo_notifications = [
    {
        'id': 'not-001',
        'user_id': 'PRMS-84920',
        'type': 'info',
        'title': 'Appointment Reminder',
        'message': 'Cardiology follow-up consultation with Dr. Robert Chen is on Aug 24, 10:30 AM.',
        'is_read': False,
        'created_at': datetime.utcnow().isoformat()
    }
]

# Save to JSON files
with open(os.path.join(data_dir, 'users.json'), 'w') as f:
    json.dump(demo_users, f, indent=2)
print("[OK] Demo users created")

with open(os.path.join(data_dir, 'medical_records.json'), 'w') as f:
    json.dump(demo_records, f, indent=2)
print("[OK] Demo medical records created")

with open(os.path.join(data_dir, 'appointments.json'), 'w') as f:
    json.dump(demo_appointments, f, indent=2)
print("[OK] Demo appointments created")

with open(os.path.join(data_dir, 'health_metrics.json'), 'w') as f:
    json.dump(demo_metrics, f, indent=2)
print("[OK] Demo health metrics created")

with open(os.path.join(data_dir, 'notifications.json'), 'w') as f:
    json.dump(demo_notifications, f, indent=2)
print("[OK] Demo notifications created")

print("\n" + "="*60)
print("Data initialization complete!")
print("="*60)
print("\nDemo Credentials:")
print("   Patient: username=patient, password=patient123")
print("   Medical Staff: username=medical, password=medical123")
print("   Doctor: username=doctor, password=doctor123\n")
