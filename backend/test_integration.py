"""
PRMS Full Automated Backend & Integration Test Suite
Validates all endpoints, role-based access, and CRUD operations.
"""
import unittest
import json
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from init_db import *

class PRMSIntegrationTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def get_token(self, username, password):
        resp = self.client.post('/api/auth/login', json={
            'username': username,
            'password': password
        })
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode('utf-8'))
        return data['token']

    def test_01_health_check(self):
        resp = self.client.get('/api/health')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode('utf-8'))
        self.assertEqual(data.get('status'), 'healthy')
        print("[PASS] Health check passed")

    def test_02_auth_logins(self):
        # Patient
        p_token = self.get_token('patient', 'patient123')
        self.assertTrue(len(p_token) > 20)

        # Doctor
        d_token = self.get_token('doctor', 'doctor123')
        self.assertTrue(len(d_token) > 20)

        # Medical
        m_token = self.get_token('medical', 'medical123')
        self.assertTrue(len(m_token) > 20)
        print("[PASS] Auth login passed for all three clinical roles")

    def test_03_auth_me(self):
        token = self.get_token('patient', 'patient123')
        resp = self.client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode('utf-8'))
        self.assertEqual(data['user']['role'], 'patient')
        print("[PASS] /api/auth/me token identity verified")

    def test_04_dashboards(self):
        # Patient dashboard
        p_token = self.get_token('patient', 'patient123')
        p_resp = self.client.get('/api/dashboard/patient', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(p_resp.status_code, 200)
        p_data = json.loads(p_resp.data.decode('utf-8'))
        self.assertIn('recent_records', p_data)
        self.assertIn('stats', p_data)

        # Doctor dashboard
        d_token = self.get_token('doctor', 'doctor123')
        d_resp = self.client.get('/api/dashboard/doctor', headers={'Authorization': f'Bearer {d_token}'})
        self.assertEqual(d_resp.status_code, 200)

        # Medical dashboard
        m_token = self.get_token('medical', 'medical123')
        m_resp = self.client.get('/api/dashboard/medical', headers={'Authorization': f'Bearer {m_token}'})
        self.assertEqual(m_resp.status_code, 200)

        # Summary endpoint
        s_resp = self.client.get('/api/dashboard/summary', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(s_resp.status_code, 200)
        print("[PASS] Patient, Doctor, and Medical dashboard APIs passed")

    def test_05_medical_records_crud(self):
        d_token = self.get_token('doctor', 'doctor123')
        p_token = self.get_token('patient', 'patient123')

        # 1. Create record as doctor
        create_resp = self.client.post('/api/records/', headers={'Authorization': f'Bearer {d_token}'}, json={
            'patient_id': 'PRMS-84920',
            'title': 'Lipid Panel Follow-up',
            'record_type': 'lab_report',
            'facility': 'Central Lab',
            'description': 'HDL / LDL evaluation'
        })
        self.assertEqual(create_resp.status_code, 201)
        record = json.loads(create_resp.data.decode('utf-8'))['record']
        record_id = record['id']

        # 2. Patient view own records
        get_all_resp = self.client.get('/api/records/', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(get_all_resp.status_code, 200)
        records = json.loads(get_all_resp.data.decode('utf-8'))['records']
        self.assertTrue(any(r['id'] == record_id for r in records))

        # 3. View single record
        get_one_resp = self.client.get(f'/api/records/{record_id}', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(get_one_resp.status_code, 200)

        # 4. Update record as doctor
        update_resp = self.client.put(f'/api/records/{record_id}', headers={'Authorization': f'Bearer {d_token}'}, json={
            'doctor_notes': 'Optimal response to medication.'
        })
        self.assertEqual(update_resp.status_code, 200)

        # 5. Delete record as doctor
        del_resp = self.client.delete(f'/api/records/{record_id}', headers={'Authorization': f'Bearer {d_token}'})
        self.assertEqual(del_resp.status_code, 200)
        print("[PASS] Medical records CRUD operations verified")

    def test_06_appointments_crud(self):
        p_token = self.get_token('patient', 'patient123')

        # Create
        create_resp = self.client.post('/api/appointments/', headers={'Authorization': f'Bearer {p_token}'}, json={
            'appointment_date': '2026-09-01',
            'appointment_time': '11:00 AM',
            'type': 'Follow-up Consultation',
            'notes': 'Discussion on quarterly lab results'
        })
        self.assertEqual(create_resp.status_code, 201)
        apt = json.loads(create_resp.data.decode('utf-8'))['appointment']
        apt_id = apt['id']

        # List
        list_resp = self.client.get('/api/appointments/', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(list_resp.status_code, 200)

        # Update
        update_resp = self.client.put(f'/api/appointments/{apt_id}', headers={'Authorization': f'Bearer {p_token}'}, json={
            'notes': 'Updated consultation notes'
        })
        self.assertEqual(update_resp.status_code, 200)

        # Cancel
        cancel_resp = self.client.delete(f'/api/appointments/{apt_id}', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(cancel_resp.status_code, 200)
        print("[PASS] Appointments CRUD operations verified")

    def test_07_health_metrics(self):
        p_token = self.get_token('patient', 'patient123')

        # Create metric
        create_resp = self.client.post('/api/health-metrics/', headers={'Authorization': f'Bearer {p_token}'}, json={
            'metric_type': 'blood_glucose',
            'value': 95,
            'unit': 'mg/dL'
        })
        self.assertEqual(create_resp.status_code, 201)

        # Chart data
        chart_resp = self.client.get('/api/health-metrics/chart-data?type=blood_glucose', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(chart_resp.status_code, 200)
        chart_data = json.loads(chart_resp.data.decode('utf-8'))['chart_data']
        self.assertIn('labels', chart_data)
        self.assertIn('datasets', chart_data)

        # History
        hist_resp = self.client.get('/api/health-metrics/history', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(hist_resp.status_code, 200)
        print("[PASS] Health metrics and chart data APIs verified")

    def test_08_ai_endpoints(self):
        p_token = self.get_token('patient', 'patient123')

        # Report explainer
        rep_resp = self.client.post('/api/ai/report-explainer', headers={'Authorization': f'Bearer {p_token}'}, json={
            'report_text': 'Fasting Blood Glucose: 92 mg/dL. Total Cholesterol: 176 mg/dL. Blood Pressure: 120/78 mmHg.',
            'report_type': 'Comprehensive Metabolic Panel'
        })
        self.assertEqual(rep_resp.status_code, 200)
        rep_data = json.loads(rep_resp.data.decode('utf-8'))
        self.assertIn('summary', rep_data)

        # Chat
        chat_resp = self.client.post('/api/ai/chat', headers={'Authorization': f'Bearer {p_token}'}, json={
            'message': 'What does a fasting glucose of 92 mg/dL indicate?'
        })
        self.assertEqual(chat_resp.status_code, 200)
        chat_data = json.loads(chat_resp.data.decode('utf-8'))
        self.assertIn('reply', chat_data)

        # Health insights
        ins_resp = self.client.post('/api/ai/health-insights', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(ins_resp.status_code, 200)

        # Graph insights
        graph_resp = self.client.get('/api/ai/health-graph-insights?type=blood_glucose', headers={'Authorization': f'Bearer {p_token}'})
        self.assertEqual(graph_resp.status_code, 200)
        print("[PASS] AI services (Explainer, Chatbot, Insights, Graph Analysis) verified")

if __name__ == '__main__':
    unittest.main()
