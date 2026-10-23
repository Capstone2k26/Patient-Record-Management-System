from datetime import datetime
import json
import os
from flask import current_app
import uuid

class MedicalRecord:
    @staticmethod
    def _get_data_file():
        return os.path.join(current_app.config['DATA_DIR'], 'medical_records.json')
    
    @staticmethod
    def _load_records():
        with open(MedicalRecord._get_data_file(), 'r') as f:
            return json.load(f)
    
    @staticmethod
    def _save_records(records):
        with open(MedicalRecord._get_data_file(), 'w') as f:
            json.dump(records, f, indent=2)
    
    @staticmethod
    def create(data):
        records = MedicalRecord._load_records()
        
        record_data = {
            'id': str(uuid.uuid4()),
            'patient_id': data['patient_id'],
            'record_type': data.get('record_type', 'general'),
            'title': data['title'],
            'description': data.get('description', ''),
            'diagnosis': data.get('diagnosis', ''),
            'medications': data.get('medications', []),
            'allergies': data.get('allergies', []),
            'test_results': data.get('test_results', {}),
            'vital_signs': data.get('vital_signs', {}),
            'doctor_notes': data.get('doctor_notes', ''),
            'attachments': data.get('attachments', []),
            'visit_date': data.get('visit_date', datetime.now().isoformat()),
            'facility': data.get('facility', ''),
            'doctor_name': data.get('doctor_name', ''),
            'created_by': data.get('created_by'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'status': data.get('status', 'active')
        }
        
        records.append(record_data)
        MedicalRecord._save_records(records)
        return record_data
    
    @staticmethod
    def find_by_patient(patient_id, limit=None):
        records = MedicalRecord._load_records()
        patient_records = [r for r in records if r['patient_id'] == patient_id and r['status'] == 'active']
        patient_records.sort(key=lambda x: x.get('visit_date', ''), reverse=True)
        
        if limit:
            return patient_records[:limit]
        return patient_records
    
    @staticmethod
    def find_by_id(record_id):
        records = MedicalRecord._load_records()
        return next((r for r in records if r['id'] == record_id), None)
    
    @staticmethod
    def update(record_id, data):
        records = MedicalRecord._load_records()
        for i, record in enumerate(records):
            if record['id'] == record_id:
                data['updated_at'] = datetime.now().isoformat()
                records[i].update(data)
                MedicalRecord._save_records(records)
                return True
        return False
    
    @staticmethod
    def delete(record_id):
        records = MedicalRecord._load_records()
        for i, record in enumerate(records):
            if record['id'] == record_id:
                records[i]['status'] = 'deleted'
                records[i]['updated_at'] = datetime.now().isoformat()
                MedicalRecord._save_records(records)
                return True
        return False
