# PRMS Backend API

Patient Record Management System - Flask Backend with MongoDB

## 📋 Features

- ✅ User Authentication (JWT)
- ✅ Medical Records Management (CRUD)
- ✅ Appointments Scheduling
- ✅ Health Metrics Tracking
- ✅ Role-Based Access Control (Patient, Medical Staff, Doctor)
- ✅ File Upload Support
- ✅ Dashboard APIs

## 🚀 Installation

### Prerequisites
- Python 3.8+
- MongoDB (local or Atlas)

### Setup Steps

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Configure environment:**
```bash
copy .env.example .env
```

Edit `.env` and update:
- `SECRET_KEY` - Your Flask secret key
- `JWT_SECRET_KEY` - Your JWT secret key
- `MONGO_URI` - Your MongoDB connection string
- `DB_NAME` - Database name (default: prms_database)

6. **Initialize database with demo data:**
```bash
python init_db.py
```

7. **Run the server:**
```bash
python run.py
```

Server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Medical Records
- `GET /api/records` - Get patient records
- `GET /api/records/<id>` - Get specific record
- `POST /api/records` - Create new record (doctor/medical only)
- `PUT /api/records/<id>` - Update record (doctor/medical only)
- `DELETE /api/records/<id>` - Delete record (doctor only)
- `POST /api/records/upload` - Upload medical document

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/<id>` - Update appointment
- `DELETE /api/appointments/<id>` - Cancel appointment

### Health Metrics
- `GET /api/health-metrics` - Get health metrics
- `POST /api/health-metrics` - Record new metric
- `GET /api/health-metrics/chart-data` - Get chart data

### Dashboard
- `GET /api/dashboard/summary` - Role-routed dashboard overview
- `GET /api/dashboard/patient` - Patient dashboard data
- `GET /api/dashboard/doctor` - Doctor dashboard data
- `GET /api/dashboard/medical` - Medical staff dashboard data

### AI Services
- `POST /api/ai/report-explainer` - Explain lab reports in plain English
- `POST /api/ai/chat` - Healthcare chatbot & symptom emergency triage
- `POST /api/ai/health-insights` - Automated health insights & biomarker patterns
- `GET /api/ai/health-graph-insights` - Vital sign trajectory analysis

## 🧪 Automated Testing

Run the full automated integration test suite:
```bash
python test_integration.py
```

Expected output:
```
Ran 8 tests in 1.25s
OK
[PASS] Health check passed
[PASS] Auth login passed for all three clinical roles
[PASS] /api/auth/me token identity verified
[PASS] Patient, Doctor, and Medical dashboard APIs passed
[PASS] Medical records CRUD operations verified
[PASS] Appointments CRUD operations verified
[PASS] Health metrics and chart data APIs verified
[PASS] AI services (Explainer, Chatbot, Insights, Graph Analysis) verified
```

## 🔑 Demo Credentials

```
Patient:
  Username: patient
  Password: patient123
  ID: PRMS-84920

Medical Staff:
  Username: medical
  Password: medical123
  ID: MED-4029

Doctor:
  Username: doctor
  Password: doctor123
  ID: DOC-1082
```

## 🗄️ Database Collections

- `users` - User accounts
- `medical_records` - Patient medical records
- `appointments` - Scheduled appointments
- `health_metrics` - Health measurements
- `notifications` - User notifications

## 🔒 Security Features

- JWT-based authentication
- Password hashing (Werkzeug)
- Role-based access control
- File upload validation
- CORS configuration
- Input validation

## 📝 MongoDB Schema Examples

### User
```json
{
  "username": "patient",
  "password_hash": "...",
  "role": "patient",
  "name": "Sarah Jenkins",
  "user_id": "PRMS-84920",
  "email": "sarah@example.com",
  "created_at": "2026-10-22T10:00:00Z"
}
```

### Medical Record
```json
{
  "patient_id": "PRMS-84920",
  "title": "Annual Checkup",
  "diagnosis": "Healthy",
  "medications": ["Aspirin 81mg"],
  "visit_date": "2026-10-22T10:00:00Z",
  "doctor_name": "Dr. Robert Chen",
  "status": "active"
}
```

## 🛠️ Development

To enable debug mode, set in `.env`:
```
FLASK_ENV=development
```

## ⚠️ Important Notes

- Change `SECRET_KEY` and `JWT_SECRET_KEY` in production
- Never commit `.env` file
- Configure MongoDB with proper authentication in production
- Implement rate limiting for production
- Add HTTPS in production
- Configure proper CORS origins for production

## 📦 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── models/
│   │   ├── user.py
│   │   └── medical_record.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── records.py
│   │   ├── dashboard.py
│   │   ├── appointments.py
│   │   ├── health_metrics.py
│   │   └── ai.py
│   ├── services/
│   │   └── ai_service.py
│   └── utils/
│       ├── validators.py
│       └── security.py
├── data/
├── uploads/
├── .env.example
├── requirements.txt
├── run.py
├── init_db.py
├── test_integration.py
└── README.md
```

## 🤝 Support

For issues or questions, please open an issue in the repository.
