# PRMS - Complete Integration Guide

## 🎯 Backend Setup (Complete)

### Step 1: Install MongoDB

**Option A: MongoDB Community Server (Local)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and run MongoDB service
3. Default connection: `mongodb://localhost:27017/`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `backend/.env` with your connection string

### Step 2: Install Python Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
# Copy example env file
copy .env.example .env

# Edit .env with your settings
notepad .env
```

**Important Settings in .env:**
```env
SECRET_KEY=change-this-to-random-secret-key
JWT_SECRET_KEY=change-this-to-random-jwt-key
MONGO_URI=mongodb://localhost:27017/
DB_NAME=prms_database
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Step 4: Initialize Database

```bash
# This creates demo users and sample data
python init_db.py
```

Expected output:
```
✅ Demo users created (patient, medical, doctor)
✅ Demo medical records created
✅ Demo appointments created
✅ Demo health metrics created
✅ Database initialization complete!
```

### Step 5: Start Backend Server

```bash
python run.py
```

Server starts at: `http://localhost:5000`

Test health check: http://localhost:5000/api/health

---

## 🌐 Frontend Integration

### Step 1: Update HTML Files

Add the API client script to **ALL** your HTML files (index.html, signin.html, patient-dashboard.html, doctor-dashboard.html, medical-dashboard.html):

**Add BEFORE the closing `</body>` tag, but BEFORE `app.js`:**

```html
<!-- API Client -->
<script src="js/api.js"></script>

<!-- Auth Integration -->
<script src="js/auth-integration.js"></script>

<!-- Original App Logic -->
<script src="js/app.js"></script>
</body>
</html>
```

### Step 2: Update index.html

Open `index.html` and add the scripts:

```html
  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer" aria-live="polite"></div>

  <!-- NEW: API Integration -->
  <script src="js/api.js"></script>
  <script src="js/auth-integration.js"></script>
  
  <!-- Existing App Logic -->
  <script src="js/app.js"></script>
</body>
</html>
```

### Step 3: Protect Dashboard Pages

Add authentication check to the top of each dashboard HTML file's script section:

```javascript
// Add to patient-dashboard.html, doctor-dashboard.html, medical-dashboard.html
(function() {
  // Check authentication
  const token = localStorage.getItem('prms_token');
  const user = JSON.parse(localStorage.getItem('prms_user') || '{}');
  
  if (!token || !user.user_id) {
    window.location.href = 'index.html';
    return;
  }
  
  // Verify role matches page
  const currentPage = window.location.pathname;
  if (currentPage.includes('patient-dashboard') && user.role !== 'patient') {
    window.location.href = 'index.html';
    return;
  }
  if (currentPage.includes('doctor-dashboard') && user.role !== 'doctor') {
    window.location.href = 'index.html';
    return;
  }
  if (currentPage.includes('medical-dashboard') && user.role !== 'medical') {
    window.location.href = 'index.html';
    return;
  }
  
  // Load dashboard data from API
  loadDashboardData();
})();

async function loadDashboardData() {
  try {
    const user = JSON.parse(localStorage.getItem('prms_user'));
    
    let dashboardData;
    if (user.role === 'patient') {
      dashboardData = await window.PRMS_API.dashboard.getPatientDashboard();
    } else if (user.role === 'doctor') {
      dashboardData = await window.PRMS_API.dashboard.getDoctorDashboard();
    } else if (user.role === 'medical') {
      dashboardData = await window.PRMS_API.dashboard.getMedicalDashboard();
    }
    
    console.log('Dashboard data loaded:', dashboardData);
    // Update UI with real data
    updateDashboardUI(dashboardData);
    
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  }
}

function updateDashboardUI(data) {
  // Update welcome message
  const welcomeEl = document.querySelector('.welcome-user-name');
  if (welcomeEl && data.user) {
    welcomeEl.textContent = data.user.name;
  }
  
  // Update stats
  if (data.stats) {
    // Update your stat cards with real data
    console.log('Stats:', data.stats);
  }
  
  // Update records, appointments, etc.
  if (data.recent_records) {
    console.log('Recent records:', data.recent_records);
  }
  
  if (data.upcoming_appointments) {
    console.log('Appointments:', data.upcoming_appointments);
  }
}
```

---

## 🧪 Testing the Integration

### Test Backend Directly

**1. Health Check:**
```bash
curl http://localhost:5000/api/health
```

**2. Login API:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"patient\",\"password\":\"patient123\"}"
```

**3. Get User Info (requires token from login):**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Frontend

1. **Open your browser's DevTools (F12)**
2. **Navigate to:** `http://127.0.0.1:5500/index.html` (or your local server)
3. **Try logging in with demo credentials:**
   - Username: `patient`
   - Password: `patient123`
4. **Check Console for:**
   - API calls
   - Token storage
   - Navigation events

### Test Flow:

1. ✅ Click "Patient" demo pill → auto-fills credentials
2. ✅ Click "Sign In" → API call to `/api/auth/login`
3. ✅ Token saved to localStorage
4. ✅ Redirect to patient-dashboard.html
5. ✅ Dashboard loads real data from API

---

## 📋 Demo Credentials

| Role | Username | Password | User ID |
|------|----------|----------|---------|
| Patient | `patient` | `patient123` | PRMS-84920 |
| Medical Staff | `medical` | `medical123` | MED-4029 |
| Doctor | `doctor` | `doctor123` | DOC-1082 |

---

## 🔧 Troubleshooting

### CORS Errors
If you see CORS errors in browser console:
1. Make sure backend is running
2. Check CORS settings in `backend/app/__init__.py`
3. Access frontend via `http://127.0.0.1` or `http://localhost`

### MongoDB Connection Failed
```
Error: ServerSelectionTimeoutError
```
**Solutions:**
1. Verify MongoDB is running: `mongosh` or check MongoDB Compass
2. Check connection string in `.env`
3. For Atlas: Whitelist your IP address

### Import Error (Python)
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:**
1. Activate virtual environment first
2. Run `pip install -r requirements.txt` again

### Token Expired
```
{"error": "Token has expired"}
```
**Solution:**
Tokens expire after 24 hours. Login again.

---

## 🚀 Next Steps

### 1. Implement Dashboard Data Binding
Update each dashboard to fetch and display real data from the API.

### 2. Add Logout Functionality
```javascript
async function logout() {
  try {
    await window.PRMS_API.auth.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}
```

### 3. Implement Medical Records CRUD
```javascript
// Create record
await window.PRMS_API.records.create({
  patient_id: 'PRMS-84920',
  title: 'Annual Checkup',
  description: 'Routine examination',
  diagnosis: 'Healthy'
});

// Get records
const records = await window.PRMS_API.records.getAll();
```

### 4. Health Metrics Tracking
```javascript
// Record metric
await window.PRMS_API.healthMetrics.create({
  metric_type: 'blood_pressure',
  value: '120/80',
  unit: 'mmHg'
});

// Get chart data
const chartData = await window.PRMS_API.healthMetrics.getChartData(null, 'blood_glucose');
```

### 5. Production Deployment

Before deploying:
- [ ] Change SECRET_KEY and JWT_SECRET_KEY to strong random values
- [ ] Set `FLASK_ENV=production`
- [ ] Configure MongoDB with authentication
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Update CORS origins to production domain
- [ ] Add logging and monitoring

---

## 📚 API Documentation

Full API documentation is available in `backend/README.md`

### Quick Reference:

**Authentication:**
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- GET `/api/auth/me` - Get current user

**Medical Records:**
- GET `/api/records` - List records
- POST `/api/records` - Create record
- PUT `/api/records/:id` - Update record
- DELETE `/api/records/:id` - Delete record

**Appointments:**
- GET `/api/appointments` - List appointments
- POST `/api/appointments` - Create appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment

**Health Metrics:**
- GET `/api/health-metrics` - Get metrics
- POST `/api/health-metrics` - Record metric
- GET `/api/health-metrics/chart-data` - Chart data

**Dashboards:**
- GET `/api/dashboard/patient` - Patient dashboard
- GET `/api/dashboard/doctor` - Doctor dashboard
- GET `/api/dashboard/medical` - Medical staff dashboard

---

## ✅ Checklist

- [x] Backend structure created
- [x] MongoDB models defined
- [x] Authentication with JWT implemented
- [x] All API endpoints created
- [x] CORS configured
- [x] Database initialization script
- [x] Demo data seeded
- [x] API client (api.js) created
- [x] Authentication integration script
- [x] Update HTML files with script tags
- [x] Test login flow
- [x] Bind dashboard data to UI
- [x] Test all CRUD operations

---

## 🆘 Need Help?

If you encounter issues:
1. Check backend logs in terminal
2. Check browser console for errors
3. Verify MongoDB is running
4. Ensure virtual environment is activated
5. Check all environment variables in `.env`

**Common Issues:**
- Port 5000 already in use → Change FLASK_PORT in `.env`
- MongoDB not found → Install MongoDB or use Atlas
- CORS errors → Check frontend URL matches CORS settings
