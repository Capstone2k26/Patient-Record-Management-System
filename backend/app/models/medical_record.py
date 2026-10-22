from datetime import datetime
from bson import ObjectId

class MedicalRecord:
    @staticmethod
    def create(db, data):
        record_data = {
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
            'visit_date': data.get('visit_date', datetime.utcnow()),
            'facility': data.get('facility', ''),
            'doctor_name': data.get('doctor_name', ''),
            'created_by': data.get('created_by'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'status': data.get('status', 'active')
        }
        
        result = db.medical_records.insert_one(record_data)
        record_data['_id'] = str(result.inserted_id)
        return record_data
    
    @staticmethod
    def find_by_patient(db, patient_id, limit=None):
        query = {'patient_id': patient_id, 'status': 'active'}
        cursor = db.medical_records.find(query).sort('visit_date', -1)
        
        if limit:
            cursor = cursor.limit(limit)
        
        records = []
        for record in cursor:
            record['_id'] = str(record['_id'])
            records.append(record)
        return records
    
    @staticmethod
    def find_by_id(db, record_id):
        record = db.medical_records.find_one({'_id': ObjectId(record_id)})
        if record:
            record['_id'] = str(record['_id'])
        return record
    
    @staticmethod
    def update(db, record_id, data):
        data['updated_at'] = datetime.utcnow()
        result = db.medical_records.update_one(
            {'_id': ObjectId(record_id)},
            {'$set': data}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete(db, record_id):
        result = db.medical_records.update_one(
            {'_id': ObjectId(record_id)},
            {'$set': {'status': 'deleted', 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
