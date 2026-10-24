/**
 * PRMS - Dashboard API & Live Data Integration
 * Connects frontend dashboard views to Flask backend APIs.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('prms_token');
    const storedUser = localStorage.getItem('prms_user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Check if on a dashboard page
    const pathname = window.location.pathname.toLowerCase();
    const isPatientDashboard = pathname.includes('patient-dashboard') || !!document.getElementById('patientReportsTableBody');
    const isDoctorDashboard = pathname.includes('doctor-dashboard') || !!document.getElementById('docAppointmentsTableBody');
    const isMedicalDashboard = pathname.includes('medical-dashboard') || !!document.getElementById('medQuickRefillsTableBody');

    if (!isPatientDashboard && !isDoctorDashboard && !isMedicalDashboard) {
      return; // Not on a dashboard page
    }

    // Role check and redirect
    if (!token || !user) {
      console.warn('No active session found. Redirecting to sign in...');
      window.location.href = 'signin.html';
      return;
    }

    if (isPatientDashboard && user.role !== 'patient') {
      const redirectMap = { doctor: 'doctor-dashboard.html', medical: 'medical-dashboard.html' };
      window.location.href = redirectMap[user.role] || 'signin.html';
      return;
    }

    if (isDoctorDashboard && user.role !== 'doctor') {
      const redirectMap = { patient: 'patient-dashboard.html', medical: 'medical-dashboard.html' };
      window.location.href = redirectMap[user.role] || 'signin.html';
      return;
    }

    if (isMedicalDashboard && user.role !== 'medical') {
      const redirectMap = { patient: 'patient-dashboard.html', doctor: 'doctor-dashboard.html' };
      window.location.href = redirectMap[user.role] || 'signin.html';
      return;
    }

    // Update User Profile in UI
    updateUserProfileDisplay(user);

    // Setup Logout Handler
    setupLogout();

    // Fetch and Bind Live Data
    loadDashboardLiveData(user);

    // Setup Real Uploads & Refill Requests
    setupActionListeners(user);
  });

  function updateUserProfileDisplay(user) {
    // Name displays
    document.querySelectorAll('.patient-name, .profile-user-name').forEach(el => {
      el.textContent = user.name;
    });

    // ID displays
    document.querySelectorAll('.patient-id, .profile-user-id').forEach(el => {
      el.textContent = `ID: ${user.user_id}`;
    });

    // Role display
    document.querySelectorAll('.profile-user-role').forEach(el => {
      el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    });

    // Initials in avatar
    const initials = (user.name || 'User').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    document.querySelectorAll('.avatar-wrapper span:first-child').forEach(el => {
      el.textContent = initials;
    });
  }

  function setupLogout() {
    const logoutBtns = document.querySelectorAll('#logoutBtn, #headerLogoutQuickBtn');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          if (window.PRMS_API && window.PRMS_API.auth) {
            await window.PRMS_API.auth.logout();
          }
        } catch (err) {
          console.warn('Logout API error:', err);
        } finally {
          localStorage.removeItem('prms_token');
          localStorage.removeItem('prms_user');
          window.location.href = 'signin.html';
        }
      });
    });
  }

  async function loadDashboardLiveData(user) {
    if (!window.PRMS_API) return;

    try {
      let data = null;
      if (user.role === 'patient') {
        data = await window.PRMS_API.dashboard.getPatientDashboard();
        bindPatientDashboard(data);
      } else if (user.role === 'doctor') {
        data = await window.PRMS_API.dashboard.getDoctorDashboard();
        bindDoctorDashboard(data);
      } else if (user.role === 'medical') {
        data = await window.PRMS_API.dashboard.getMedicalDashboard();
        bindMedicalDashboard(data);
      }
      console.log('PRMS Live Dashboard Data successfully bound:', data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.message && (err.message.includes('401') || err.message.includes('Token has expired'))) {
        localStorage.clear();
        window.location.href = 'signin.html';
      }
    }
  }

  function bindPatientDashboard(data) {
    if (!data) return;

    // Update real stats
    if (data.stats) {
      const recStat = document.querySelector('[data-stat="records"]');
      if (recStat) recStat.textContent = data.stats.total_records;

      const aptStat = document.querySelector('[data-stat="appointments"]');
      if (aptStat) aptStat.textContent = data.stats.total_appointments;
    }

    // Bind real medical records table if present
    if (data.recent_records && data.recent_records.length > 0) {
      const tbody = document.getElementById('patientReportsTableBody');
      if (tbody) {
        tbody.innerHTML = data.recent_records.map(rec => {
          const dateStr = rec.visit_date ? rec.visit_date.slice(0, 10) : 'Recent';
          return `
            <tr>
              <td><strong>${rec.title}</strong></td>
              <td>${rec.record_type ? rec.record_type.replace('_', ' ').toUpperCase() : 'Lab Work'}</td>
              <td>${dateStr}</td>
              <td>${rec.facility || 'PRMS Medical Lab'}</td>
              <td><span class="status-chip optimal">Verified Active</span></td>
              <td>
                <button type="button" class="btn-outline touch-target view-report-trigger"
                  data-report-name="${rec.title}" data-report-date="${dateStr}"
                  style="min-height: 34px; padding: 0 10px; font-size: 12px;">View Summary</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  function bindDoctorDashboard(data) {
    if (!data) return;

    // Update doctor stats
    if (data.stats) {
      const patientCount = document.querySelector('#docTotalPatientsCount');
      if (patientCount) patientCount.textContent = data.stats.total_patients;

      const apptCount = document.querySelector('#docTodayAppointmentsCount');
      if (apptCount) apptCount.textContent = data.stats.today_appointments;
    }

    // Bind doctor appointments table
    if (data.appointments && data.appointments.length > 0) {
      const tbody = document.getElementById('docAppointmentsTableBody');
      if (tbody) {
        tbody.innerHTML = data.appointments.map(apt => `
          <tr>
            <td><strong>${apt.patient_id}</strong> <div style="font-size: 11px; color: var(--text-muted);">${apt.patient_id}</div></td>
            <td>${apt.type || 'Consultation'}</td>
            <td>${apt.appointment_date} • ${apt.appointment_time || '10:00 AM'}</td>
            <td><span class="badge-tag optimal">${apt.status || 'Confirmed'}</span></td>
            <td>
              <button type="button" class="btn-primary touch-target" style="min-height: 32px; padding: 0 10px; font-size: 11px;">EHR Chart</button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  function bindMedicalDashboard(data) {
    if (!data) return;

    if (data.stats) {
      const refillCount = document.querySelector('#medPendingRefillsCount');
      if (refillCount) refillCount.textContent = data.stats.pending_refills;
    }
  }

  function setupActionListeners(user) {
    // Connect live file upload
    const fileInputs = ['dashboardFileInput', 'dedicatedFileInput'];
    fileInputs.forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        try {
          const uploadRes = await window.PRMS_API.records.upload(file);
          console.log('File uploaded to server:', uploadRes);

          // Create medical record in DB
          await window.PRMS_API.records.create({
            patient_id: user.user_id,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
            record_type: 'lab_report',
            facility: 'PRMS Health Diagnostics',
            description: 'Patient uploaded diagnostic document.'
          });

          // Refresh live dashboard data
          loadDashboardLiveData(user);
        } catch (err) {
          console.error('File upload error:', err);
        }
      });
    });
  }
})();
