# PRMS — Patient Record Management System

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-green.svg)](https://flask.palletsprojects.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://flask-jwt-extended.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An enterprise-ready, AI-powered **Patient Record Management System (PRMS)** designed to streamline clinical workflows, empower patients with personalized biomarker analysis, and provide secure role-based portals for **Patients**, **Doctors**, and **Medical Staff**.

---

## 🌟 Key Features

- **Multi-Portal Architecture**: Dedicated interfaces tailored for Patients, Doctors, and Medical Staff.
- **Secure Authentication & RBAC**: Stateless JWT authentication with role-based access control and patient-level record isolation.
- **Electronic Health Records (EHR)**: Complete CRUD APIs for medical histories, laboratory test reports, diagnoses, and prescriptions.
- **Biomarker Trends & Interactive Charts**: Real-time tracking of glucose, blood pressure, cholesterol, and vital signs with chronological graph APIs.
- **AI-Powered Clinical Services**:
  - **AI Medical Report Explainer**: Translates complex lab values into plain-English summaries with actionable wellness recommendations.
  - **Healthcare Chatbot & Symptom Triage**: 24/7 conversational health guidance with automatic emergency triage detection.
  - **Automated Health Insights**: Detects biomarker patterns and summarizes preventative health status.
  - **Graph Trend Insights**: Analyzes historical vital sign trajectories against clinical thresholds.
- **HIPAA-Compliant Design**: Zero plaintext passwords (Werkzeug PBKDF2 hashing), protected file uploads, minimal data exposure, and strict CORS policies.

---

## 🏗️ Project Architecture

```
med3/
├── index.html                   # Landing & Sign-in Portal
├── signin.html                  # Role-based Authentication Page
├── patient-dashboard.html       # Patient Health & Biomarker Portal
├── doctor-dashboard.html        # Physician Clinical EHR Portal
├── medical-dashboard.html       # Clinical Staff & Pharmacy Refill Portal
├── css/
│   └── styles.css               # Design system & responsive styles
├── js/
│   ├── api.js                   # Unified PRMS API Client
│   ├── auth-integration.js      # Sign-in & Authentication Handler
│   ├── dashboard-integration.js # Live Data & Session Binder
│   └── app.js                   # UI Animations & View Switchers
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask App Factory & CORS Setup
│   │   ├── models/
│   │   │   ├── user.py          # User Model & Password Verification
│   │   │   └── medical_record.py# Medical Record Model
│   │   ├── routes/
│   │   │   ├── auth.py          # /api/auth (Login, Register, Me)
│   │   │   ├── records.py       # /api/records (CRUD & Uploads)
│   │   │   ├── appointments.py  # /api/appointments (Scheduling)
│   │   │   ├── health_metrics.py# /api/health-metrics (Vitals & Charts)
│   │   │   ├── dashboard.py     # /api/dashboard (Role Views)
│   │   │   └── ai.py            # /api/ai (Explainer, Chat, Insights)
│   │   ├── services/
│   │   │   └── ai_service.py    # OpenAI Provider + Clinical Triage Engine
│   │   └── utils/
│   │       ├── security.py      # Decorators & Authorization Checks
│   │       └── validators.py    # Input Validation Helpers
│   ├── data/                    # Storage (JSON persistence / Mongo ready)
│   ├── uploads/                 # Uploaded clinical documents
│   ├── init_db.py               # Database Seeding Script
│   ├── test_integration.py      # Automated Test Suite (8/8 Passing)
│   ├── run.py                   # Flask Server Runner
│   ├── requirements.txt         # Python Dependencies
│   └── .env.example             # Configuration Template
├── INTEGRATION_GUIDE.md         # Full Setup & Testing Checklist
└── README.md                    # Root Documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Python 3.8+** (Tested up to Python 3.13)
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Optional: OpenAI API Key (for external LLM inference; robust fallback engine included)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env   # On Windows
cp .env.example .env     # On macOS/Linux
```

### 3. Initialize Database & Seed Demo Data

```bash
python init_db.py
```

Expected output:
```
Initializing PRMS Data Storage...
[OK] Demo users created
[OK] Demo medical records created
[OK] Demo appointments created
[OK] Demo health metrics created
[OK] Demo notifications created
[OK] Demo prescriptions created
[OK] Demo tasks created
============================================================
Data initialization complete!
============================================================
```

### 4. Run Automated Test Suite

Verify all APIs, authentication, and AI services before starting the server:

```bash
python test_integration.py
```

Result:
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

### 5. Launch Backend Server

```bash
python run.py
```

The Flask server will start at:
- **API Base:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

---

### 6. Launch Frontend

You can run the frontend using any static file server:

- **Option A (VS Code Live Server):** Right-click `signin.html` or `index.html` and choose **"Open with Live Server"** (usually runs at `http://127.0.0.1:5500`).
- **Option B (Python HTTP Server):**
  ```bash
  # From the project root (med3/)
  python -m http.server 8000
  ```
  Open `http://localhost:8000/signin.html` in your browser.

---

## 🔑 Demo Credentials

Quick autofill buttons are available on the Sign-In page, or use these credentials:

| Role | Username | Password | User ID | Portal Landing |
|------|----------|----------|---------|----------------|
| **Patient** | `patient` | `patient123` | `PRMS-84920` | `patient-dashboard.html` |
| **Doctor** | `doctor` | `doctor123` | `DOC-1082` | `doctor-dashboard.html` |
| **Medical Staff** | `medical` | `medical123` | `MED-4029` | `medical-dashboard.html` |

---

## 📡 Complete REST API Reference

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate & receive JWT token | No |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |
| `POST` | `/api/auth/logout` | Terminate session | Yes (JWT) |

### 📋 Medical Records
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`    | `/api/records/` | Get records (patient or doctor view) | Yes (JWT) |
| `GET`    | `/api/records/<id>` | Retrieve specific medical record | Yes (JWT) |
| `POST`   | `/api/records/` | Create record (Doctor/Staff only) | Yes (Doctor/Staff) |
| `PUT`    | `/api/records/<id>` | Update record (Doctor/Staff only) | Yes (Doctor/Staff) |
| `DELETE` | `/api/records/<id>` | Delete record (Doctor only) | Yes (Doctor) |
| `POST`   | `/api/records/upload` | Upload diagnostic PDF/Image | Yes (JWT) |

### 📅 Appointments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`    | `/api/appointments/` | List user appointments | Yes (JWT) |
| `POST`   | `/api/appointments/` | Schedule new appointment | Yes (JWT) |
| `PUT`    | `/api/appointments/<id>` | Modify appointment details | Yes (JWT) |
| `DELETE` | `/api/appointments/<id>` | Cancel appointment | Yes (JWT) |

### 📊 Health Metrics & Graphs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/health-metrics/` | Fetch historical health logs | Yes (JWT) |
| `POST` | `/api/health-metrics/` | Record new vital sign measurement | Yes (JWT) |
| `GET`  | `/api/health-metrics/chart-data` | Formatted chart dataset | Yes (JWT) |
| `GET`  | `/api/health-metrics/history` | Filterable date-range history | Yes (JWT) |

### 📈 Dashboards
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/dashboard/summary` | Role-routed overview data | Yes (JWT) |
| `GET` | `/api/dashboard/patient` | Patient records, vitals & stats | Yes (Patient) |
| `GET` | `/api/dashboard/doctor` | Clinic appointments & patient list | Yes (Doctor) |
| `GET` | `/api/dashboard/medical` | Pharmacy refills & staff tasks | Yes (Medical) |

### 🤖 AI Clinical Services
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/ai/report-explainer` | Plain-language lab report explainer | Yes (JWT) |
| `POST` | `/api/ai/chat` | Healthcare education & emergency triage | Yes (JWT) |
| `POST` | `/api/ai/health-insights` | Longitudinal biomarker trend synthesis | Yes (JWT) |
| `GET`  | `/api/ai/health-graph-insights`| Vital sign trajectory analysis | Yes (JWT) |

---

## 🔒 Security Best Practices

1. **Token Security**: Tokens are stored client-side in `localStorage` and sent via `Authorization: Bearer <token>` headers.
2. **Patient Isolation**: Access controls verify that patients can only retrieve and access their own clinical documents.
3. **Emergency Safeguards**: The AI chatbot inspects messages for critical emergency indicators (e.g. chest pain, stroke signs) and immediately advises emergency medical services (911).

---

## 📄 License

This project is licensed under the MIT License.
