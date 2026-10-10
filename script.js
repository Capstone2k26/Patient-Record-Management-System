/**
 * PRMS - Patient Record Management System | Multi-Page Architecture
 * Pure Vanilla JavaScript Application Logic
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. MOCK DATA STORE
     ========================================================================== */
  const MOCK_DATA = {
    users: {
      patient: {
        role: 'patient',
        username: 'patient',
        password: 'patient123',
        name: 'Sarah Jenkins',
        id: 'PRMS-84920',
        redirect: 'patient-dashboard.html'
      },
      medical: {
        role: 'medical',
        username: 'medical',
        password: 'medical123',
        name: 'Elena Vance, RN',
        id: 'MED-4029',
        redirect: 'medical-dashboard.html'
      },
      doctor: {
        role: 'doctor',
        username: 'doctor',
        password: 'doctor123',
        name: 'Dr. Robert Chen, MD',
        id: 'DOC-1082',
        redirect: 'doctor-dashboard.html'
      }
    },

    notifications: [
      {
        id: 'notif-1',
        type: 'info',
        title: 'Appointment Reminder',
        desc: 'Cardiology follow-up consultation with Dr. Robert Chen is on Aug 24, 10:30 AM.',
        time: '15 mins ago',
        unread: true
      },
      {
        id: 'notif-2',
        type: 'warning',
        title: 'Prescription Refill Alert',
        desc: 'Atorvastatin Calcium 10mg has 18 days of supply remaining. Refill ready.',
        time: '2 hours ago',
        unread: true
      },
      {
        id: 'notif-3',
        type: 'success',
        title: 'New Test Results Available',
        desc: 'Comprehensive Metabolic Panel (Quest Diagnostics) biomarkers extracted.',
        time: 'Yesterday',
        unread: true
      },
      {
        id: 'notif-4',
        type: 'info',
        title: 'System Update',
        desc: 'PRMS security encryption protocol updated to HIPAA-v3.4 compliance.',
        time: '2 days ago',
        unread: false
      }
    ],

    refillRequests: [
      { id: 'REF-101', patientName: 'Sarah Jenkins', patientId: 'PRMS-84920', medication: 'Metformin HCl 500mg', doctor: 'Dr. Robert Chen', date: 'Aug 20, 2026', supplyDays: '30 Days', pharmacy: 'CVS Pharmacy (#4921)', status: 'pending' },
      { id: 'REF-102', patientName: 'David Miller', patientId: 'PRMS-71932', medication: 'Lisinopril 20mg', doctor: 'Dr. Robert Chen', date: 'Aug 19, 2026', supplyDays: '90 Days', pharmacy: 'Walgreens (#1084)', status: 'pending' },
      { id: 'REF-103', patientName: 'Amanda Garcia', patientId: 'PRMS-62941', medication: 'Levothyroxine 50mcg', doctor: 'Dr. Sarah Smith', date: 'Aug 18, 2026', supplyDays: '30 Days', pharmacy: 'Rite Aid (#3302)', status: 'pending' },
      { id: 'REF-104', patientName: 'Michael Ross', patientId: 'PRMS-51048', medication: 'Omeprazole 20mg', doctor: 'Dr. Robert Chen', date: 'Aug 16, 2026', supplyDays: '60 Days', pharmacy: 'CVS Pharmacy (#4921)', status: 'approved' },
      { id: 'REF-105', patientName: 'Emma Watson', patientId: 'PRMS-93821', medication: 'Albuterol Inhaler', doctor: 'Dr. Sarah Smith', date: 'Aug 15, 2026', supplyDays: '30 Days', pharmacy: 'Kroger Pharmacy', status: 'approved' }
    ],

    assignedPatients: [
      { name: 'Sarah Jenkins', id: 'PRMS-84920', age: '34 / F', doctor: 'Dr. Robert Chen', diagnosis: 'Type 2 Diabetes / Dyslipidemia', meds: 'Metformin 500mg, Atorvastatin 10mg', nextApp: 'Aug 24, 2026 (10:30 AM)', biomarkers: 'Glucose: 92 | BP: 120/78 | Chol: 176' },
      { name: 'David Miller', id: 'PRMS-71932', age: '52 / M', doctor: 'Dr. Robert Chen', diagnosis: 'Essential Hypertension', meds: 'Lisinopril 20mg, Amlodipine 5mg', nextApp: 'Aug 26, 2026 (02:00 PM)', biomarkers: 'BP: 135/85 | Pulse: 72 bpm' },
      { name: 'Amanda Garcia', id: 'PRMS-62941', age: '41 / F', doctor: 'Dr. Sarah Smith', diagnosis: 'Hypothyroidism', meds: 'Levothyroxine 50mcg', nextApp: 'Sep 02, 2026 (09:15 AM)', biomarkers: 'TSH: 2.1 mIU/L (Normal)' },
      { name: 'Michael Ross', id: 'PRMS-51048', age: '63 / M', doctor: 'Dr. Robert Chen', diagnosis: 'Coronary Artery Disease', meds: 'Aspirin 81mg, Omeprazole 20mg', nextApp: 'Aug 24, 2026 (04:30 PM)', biomarkers: 'BP: 128/80 | Total Chol: 165' },
      { name: 'Emma Watson', id: 'PRMS-93821', age: '28 / F', doctor: 'Dr. Sarah Smith', diagnosis: 'Mild Asthma', meds: 'Albuterol HFA Inhaler', nextApp: 'Sep 10, 2026 (11:00 AM)', biomarkers: 'Spirometry: FEV1 94%' },
      { name: 'James Wilson', id: 'PRMS-44910', age: '47 / M', doctor: 'Dr. Robert Chen', diagnosis: 'Arrhythmia Evaluation', meds: 'Metoprolol Succinate 25mg', nextApp: 'Aug 25, 2026 (11:30 AM)', biomarkers: 'ECG: Normal Sinus Rhythm' }
    ],

    doctorAppointments: [
      { id: 'APP-01', patient: 'Sarah Jenkins', patientId: 'PRMS-84920', type: 'PRMS Telehealth (Video)', time: '10:30 AM', date: 'Aug 24, 2026', status: 'Confirmed', notes: 'Review quarterly metabolic panel and fasting glucose trajectory.' },
      { id: 'APP-02', patient: 'James Wilson', patientId: 'PRMS-44910', type: 'In-Clinic Consultation', time: '11:30 AM', date: 'Aug 24, 2026', status: 'Confirmed', notes: 'Post-Holter monitor evaluation.' },
      { id: 'APP-03', patient: 'David Miller', patientId: 'PRMS-71932', type: 'PRMS Telehealth (Video)', time: '02:00 PM', date: 'Aug 24, 2026', status: 'Confirmed', notes: 'Blood pressure medication titration review.' },
      { id: 'APP-04', patient: 'Michael Ross', patientId: 'PRMS-51048', type: 'In-Clinic Consultation', time: '04:30 PM', date: 'Aug 24, 2026', status: 'Confirmed', notes: 'Cardiovascular checkup & ECG review.' }
    ],

    patientReports: [
      { id: 1, name: 'Comprehensive Metabolic Panel', patientName: 'Sarah Jenkins', category: 'Lab Work', date: 'Aug 14, 2026', facility: 'Quest Diagnostics', status: 'Extracted', keyMetrics: 'Fasting Glucose: 92 mg/dL • eGFR: >90 • Creatinine: 0.9', docNote: 'All metabolic indices within optimal limits. Continue current dietary regimen.' },
      { id: 2, name: 'Lipid Profile & Fasting Glucose', patientName: 'Sarah Jenkins', category: 'Lab Work', date: 'Jul 20, 2026', facility: 'LabCorp Central', status: 'Extracted', keyMetrics: 'Total Chol: 176 mg/dL • HDL: 54 • LDL: 98', docNote: 'Lipid profile improved by 12% following statin therapy.' },
      { id: 3, name: 'CBC with Differential Panel', patientName: 'Sarah Jenkins', category: 'Hematology', date: 'Jun 05, 2026', facility: 'Memorial Health', status: 'Extracted', keyMetrics: 'Platelets: 265k • WBC: 6.8 • RBC: 4.6', docNote: 'Normal differential. No signs of infection or anemia.' }
    ],

    doctorPrescriptions: [
      { id: 'RX-801', patient: 'Sarah Jenkins', medication: 'Metformin HCl 500mg', frequency: '1 tablet daily with dinner', date: 'Aug 14, 2026', refills: 3, instructions: 'Monitor fasting glucose weekly.' },
      { id: 'RX-802', patient: 'Sarah Jenkins', medication: 'Atorvastatin Calcium 10mg', frequency: '1 tablet nightly at bedtime', date: 'Jul 20, 2026', refills: 2, instructions: 'Repeat lipid profile in 6 months.' },
      { id: 'RX-803', patient: 'David Miller', medication: 'Lisinopril 20mg', frequency: '1 tablet daily in the morning', date: 'Aug 01, 2026', refills: 4, instructions: 'Target BP < 130/80 mmHg.' },
      { id: 'RX-804', patient: 'Michael Ross', medication: 'Aspirin 81mg', frequency: '1 tablet daily with breakfast', date: 'Jul 15, 2026', refills: 6, instructions: 'Cardioprotective secondary prevention.' }
    ],

    sentNotificationsLog: [
      { recipient: 'Sarah Jenkins', type: 'Medicine Ready', message: 'Your Metformin 500mg refill is ready for pickup at CVS Pharmacy (#4921).', time: 'Aug 20, 2026 • 03:10 PM', status: 'Delivered' },
      { recipient: 'David Miller', type: 'Appointment Reminder', message: 'Reminder: Telehealth consultation with Dr. Robert Chen on Aug 24 at 2:00 PM.', time: 'Aug 20, 2026 • 01:45 PM', status: 'Delivered' },
      { recipient: 'Amanda Garcia', type: 'Lab Results Available', message: 'Your Thyroid Panel results from LabCorp are ready in your patient portal.', time: 'Aug 19, 2026 • 11:20 AM', status: 'Delivered' }
    ]
  };

  /* ==========================================================================
     2. GLOBAL STATE & PAGE DETECTION
     ========================================================================== */
  const state = {
    selectedLoginRole: 'patient',
    isDashboardLocked: true,
    isSidebarCollapsed: false,
    isMobileDrawerOpen: false,
    currentView: 'dashboard',
    searchDebounceTimer: null,
    selectedReportForNote: null,
    selectedAppointmentForReschedule: null
  };

  function init() {
    setupGlobalNavigation();
    setupHeaderNotifications();
    setupGlobalSearch();
    setupProfileDropdown();

    if (document.getElementById('loginForm')) {
      setupLoginPage();
    }
    if (document.getElementById('dashboardHeading') || document.getElementById('patientReportsTableBody')) {
      setupPatientDashboard();
    }
    if (document.getElementById('medQuickRefillsTableBody') || document.getElementById('view-med-overview')) {
      setupMedicalDashboard();
    }
    if (document.getElementById('docAppointmentsTableBody') || document.getElementById('view-doc-overview')) {
      setupDoctorDashboard();
    }
  }

  /* ==========================================================================
     3. AUTHENTICATION & SIGN-IN LOGIC (signin.html & index.html)
     ========================================================================== */
  function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const errorAlert = document.getElementById('loginErrorAlert');
    const errorText = document.getElementById('loginErrorText');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const submitText = document.getElementById('loginSubmitText');
    const toggleEyeBtn = document.getElementById('toggleLoginPasswordBtn');
    const eyeIcon = document.getElementById('loginEyeIcon');
    const forgotBtn = document.getElementById('forgotCredsBtn');
    const bannerText = document.getElementById('roleBannerText');

    const roleData = {
      patient: {
        title: 'Patient',
        id: 'PRMS-84920',
        user: 'patient',
        pass: 'patient123',
        banner: 'Signing in as <strong>Patient</strong> (ID: PRMS-84920). Access records, test trends & appointments.',
        btnText: 'Sign In to Patient Portal'
      },
      medical: {
        title: 'Medical Staff',
        id: 'MED-4029',
        user: 'medical',
        pass: 'medical123',
        banner: 'Signing in as <strong>Medical Staff</strong> (ID: MED-4029). Manage pharmacy refills, alerts & assigned patients.',
        btnText: 'Sign In to Medical Staff Portal'
      },
      doctor: {
        title: 'Doctor',
        id: 'DOC-1082',
        user: 'doctor',
        pass: 'doctor123',
        banner: 'Signing in as <strong>Doctor</strong> (ID: DOC-1082). Access patient EHR charts, diagnostic trends & e-Prescriptions.',
        btnText: 'Sign In to Doctor Portal'
      }
    };

    function selectRole(roleKey, autoFill = true) {
      state.selectedLoginRole = roleKey;
      const role = roleData[roleKey];
      if (!role) return;

      // Update role tab buttons
      document.querySelectorAll('.role-card-btn').forEach(btn => {
        const isCurrent = btn.getAttribute('data-role') === roleKey;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      if (bannerText) {
        bannerText.innerHTML = role.banner;
      }
      if (submitText) {
        submitText.textContent = role.btnText;
      }
      if (autoFill && usernameInput && passwordInput) {
        usernameInput.value = role.id;
        passwordInput.value = role.pass;
      }
      if (errorAlert) {
        errorAlert.style.display = 'none';
      }
    }

    // Role Tab Click Handlers
    document.querySelectorAll('.role-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        if (role) selectRole(role, true);
      });
    });

    // Demo Pills Click Handlers
    document.querySelectorAll('.demo-pill-btn').forEach(pill => {
      pill.addEventListener('click', () => {
        const demoRole = pill.getAttribute('data-demo');
        if (demoRole) {
          selectRole(demoRole, true);
          showToast('Credentials Autofilled', `Loaded temporary credentials for ${roleData[demoRole].title}. Click Sign In below.`, 'info');
        }
      });
    });

    // Password Visibility Toggle
    if (toggleEyeBtn && passwordInput && eyeIcon) {
      toggleEyeBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      });
    }

    // Forgot credentials tooltip / alert
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        showToast(
          'Temporary Demo Access IDs',
          'Patient: PRMS-84920 / patient123 | Staff: MED-4029 / medical123 | Doctor: DOC-1082 / doctor123',
          'info'
        );
      });
    }

    // Form Submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawInput = (usernameInput ? usernameInput.value : '').trim().toLowerCase();
        const rawPassword = (passwordInput ? passwordInput.value : '').trim();

        if (!rawInput || !rawPassword) {
          if (errorAlert) {
            errorText.textContent = 'Please enter both your Healthcare ID / Username and Password.';
            errorAlert.style.display = 'flex';
          }
          return;
        }

        // Match against MOCK_DATA users by ID or username
        let authenticatedUser = null;
        for (const key of Object.keys(MOCK_DATA.users)) {
          const u = MOCK_DATA.users[key];
          const matchesIdentifier = u.username.toLowerCase() === rawInput || u.id.toLowerCase() === rawInput;
          const matchesPassword = u.password === rawPassword || u.password.toLowerCase() === rawPassword.toLowerCase();

          if (matchesIdentifier && matchesPassword) {
            authenticatedUser = u;
            break;
          }
        }

        // Fallback: Also check if matching default credentials for current active role
        if (!authenticatedUser) {
          const currentRoleInfo = roleData[state.selectedLoginRole];
          if (currentRoleInfo && (rawInput === currentRoleInfo.id.toLowerCase() || rawInput === currentRoleInfo.user.toLowerCase()) && rawPassword === currentRoleInfo.pass) {
            authenticatedUser = MOCK_DATA.users[state.selectedLoginRole];
          }
        }

        if (authenticatedUser) {
          if (errorAlert) errorAlert.style.display = 'none';

          // Store logged in user in localStorage
          localStorage.setItem('prms_active_user', JSON.stringify(authenticatedUser));

          // Button feedback
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="margin-right: 8px;"></i> Authenticating...';
          }

          showToast('Sign In Successful', `Welcome back, ${authenticatedUser.name}! Redirecting to ${authenticatedUser.role.toUpperCase()} portal...`, 'success');

          setTimeout(() => {
            window.location.href = authenticatedUser.redirect;
          }, 600);
        } else {
          if (errorAlert) {
            errorText.textContent = 'Invalid Healthcare ID or password. Please use the demo credential pills below to auto-fill.';
            errorAlert.style.display = 'flex';
          }
          if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
          }
        }
      });
    }
  }


  /* ==========================================================================
     4. PATIENT DASHBOARD LOGIC (patient-dashboard.html)
     ========================================================================== */
  function setupPatientDashboard() {
    // 1. Locked / Unlocked State Toggle
    const stateToggle = document.getElementById('dashboardStateToggle');
    if (stateToggle) {
      stateToggle.addEventListener('change', (e) => {
        state.isDashboardLocked = !e.target.checked;
        updatePatientDashboardViewState();
        showToast(
          state.isDashboardLocked ? 'Dashboard Locked' : 'Dashboard Unlocked',
          state.isDashboardLocked ? 'Dashboard returned to locked state.' : 'Your health metrics and biomarker trends are now live.',
          state.isDashboardLocked ? 'info' : 'success'
        );
      });
    }

    // Unlock Trigger Button
    const unlockTriggerBtn = document.getElementById('unlockTriggerUploadBtn');
    if (unlockTriggerBtn) {
      unlockTriggerBtn.addEventListener('click', () => {
        const dropzone = document.getElementById('dashboardDropzone');
        if (dropzone) dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    // Dropzone setup
    setupDropzoneUpload('dashboardDropzone', 'dashboardFileInput', 'browseFileBtn');
    setupDropzoneUpload('dedicatedDropzone', 'dedicatedFileInput', 'dedicatedBrowseBtn');

    // Instant Sample Report
    const quickSampleUploadBtn = document.getElementById('quickSampleUploadBtn');
    if (quickSampleUploadBtn) {
      quickSampleUploadBtn.addEventListener('click', () => {
        simulateFileUpload({ name: 'CBC_Comprehensive_Blood_Panel.pdf', size: 1420000 });
      });
    }

    // Sidebar CTA upload
    const sidebarUploadCtaBtn = document.getElementById('sidebarUploadCtaBtn');
    if (sidebarUploadCtaBtn) {
      sidebarUploadCtaBtn.addEventListener('click', () => {
        switchView('dashboard');
        const dropzone = document.getElementById('dashboardDropzone');
        if (dropzone) dropzone.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // View All Reports button
    const viewAllReportsBtn = document.getElementById('viewAllReportsBtn');
    if (viewAllReportsBtn) {
      viewAllReportsBtn.addEventListener('click', () => switchView('reports'));
    }

    // Upload New Report button in reports view
    const reportsUploadNewBtn = document.getElementById('reportsUploadNewBtn');
    if (reportsUploadNewBtn) {
      reportsUploadNewBtn.addEventListener('click', () => switchView('upload'));
    }

    // Book appointment button
    const bookNewAppBtn = document.getElementById('bookNewAppBtn');
    if (bookNewAppBtn) {
      bookNewAppBtn.addEventListener('click', () => {
        showToast('Appointment Scheduler', 'Connecting with Dr. Robert Chen\'s clinic calendar...', 'info');
      });
    }

    // Join video call buttons
    const joinCallBtn = document.getElementById('joinCallBtn');
    const joinVideoBtn = document.getElementById('joinVideoBtn');
    [joinCallBtn, joinVideoBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          showToast('Connecting Telehealth', 'Opening secure PRMS Video Consultation with Dr. Robert Chen...', 'success');
        });
      }
    });

    // Patient Refill buttons
    document.querySelectorAll('.patient-refill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const med = btn.getAttribute('data-med') || 'Medication';
        showToast('Refill Requested', `Refill authorization request submitted for ${med} to CVS Pharmacy.`, 'success');
      });
    });

    const requestRefillMainBtn = document.getElementById('requestRefillMainBtn');
    if (requestRefillMainBtn) {
      requestRefillMainBtn.addEventListener('click', () => {
        showToast('Refill Request', 'Select medication below or contact your attending physician.', 'info');
      });
    }

    // View Report Triggers
    document.querySelectorAll('.view-report-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-report-name');
        const date = btn.getAttribute('data-report-date');
        openReportModal(name, date);
      });
    });

    // Period buttons
    document.querySelectorAll('.period-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.getAttribute('data-period');
        showToast('Chart Updated', `Biomarker trajectory adjusted to ${period} view.`, 'info');
      });
    });

    // Report modal dismiss & download
    const closeReportModalBtn = document.getElementById('closeReportModalBtn');
    const modalDismissBtn = document.getElementById('modalDismissBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (closeReportModalBtn) closeReportModalBtn.addEventListener('click', closeReportModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeReportModal);
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        showToast('PDF Export', 'Clinical diagnostic report downloaded successfully.', 'success');
        closeReportModal();
      });
    }

    updatePatientDashboardViewState();
  }

  function setupDropzoneUpload(dropzoneId, fileInputId, browseBtnId) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    const browseBtn = document.getElementById(browseBtnId);

    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        simulateFileUpload(e.dataTransfer.files[0]);
      }
    });

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          simulateFileUpload(e.target.files[0]);
        }
      });
    }
  }

  function simulateFileUpload(file) {
    if (!file) return;

    const progressBox = document.getElementById('uploadProgressBox');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressFileName = document.getElementById('progressFileName');
    const progressFileSize = document.getElementById('progressFileSize');
    const progressStatusMsg = document.getElementById('progressStatusMsg');

    if (progressBox) {
      progressBox.classList.add('active');
      if (progressFileName) progressFileName.textContent = file.name || 'Medical_Diagnostic_Report.pdf';
      const sizeMb = file.size ? (file.size / (1024 * 1024)).toFixed(1) : '1.4';
      if (progressFileSize) progressFileSize.textContent = `(${sizeMb} MB)`;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 12;
      if (progress > 100) progress = 100;

      if (progressBarFill) progressBarFill.style.width = `${progress}%`;
      if (progressPercentage) progressPercentage.textContent = `${progress}%`;

      if (progress < 40) {
        if (progressStatusMsg) progressStatusMsg.innerHTML = '<span>Uploading medical file to encrypted HIPAA vault...</span>';
      } else if (progress < 80) {
        if (progressStatusMsg) progressStatusMsg.innerHTML = '<span>Extracting clinical biomarkers (Glucose, BP, Lipids)...</span>';
      } else if (progress < 100) {
        if (progressStatusMsg) progressStatusMsg.innerHTML = '<span>Validating clinical reference ranges & OCR accuracy...</span>';
      } else {
        clearInterval(interval);
        if (progressStatusMsg) progressStatusMsg.innerHTML = '<span style="color: var(--success); font-weight: 700;">✓ Document verified & biomarkers saved!</span>';

        setTimeout(() => {
          state.isDashboardLocked = false;
          updatePatientDashboardViewState();
          showToast('Report Saved Successfully!', `${file.name} processed. Health dashboard is now unlocked.`, 'success');
          
          if (progressBox) progressBox.classList.remove('active');
          if (state.currentView === 'upload') switchView('dashboard');
        }, 700);
      }
    }, 180);
  }

  function updatePatientDashboardViewState() {
    const lockedContainer = document.getElementById('lockedStateContainer');
    const unlockedContainer = document.getElementById('unlockedStateContainer');
    const stateLabel = document.getElementById('stateLabel');
    const toggle = document.getElementById('dashboardStateToggle');
    const badge = document.getElementById('navDashboardBadge');

    if (state.isDashboardLocked) {
      if (lockedContainer) lockedContainer.style.display = 'flex';
      if (unlockedContainer) unlockedContainer.classList.remove('active');
      if (stateLabel) stateLabel.textContent = 'Locked';
      if (toggle) toggle.checked = false;

      if (badge) {
        badge.className = 'nav-badge locked-badge';
        badge.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Locked`;
      }
    } else {
      if (lockedContainer) lockedContainer.style.display = 'none';
      if (unlockedContainer) unlockedContainer.classList.add('active');
      if (stateLabel) stateLabel.textContent = 'Live';
      if (toggle) toggle.checked = true;

      if (badge) {
        badge.className = 'nav-badge';
        badge.style.background = 'var(--success-soft)';
        badge.style.color = 'var(--success-hover)';
        badge.innerHTML = 'Live';
      }
    }
  }

  function openReportModal(name, date) {
    const modal = document.getElementById('reportViewerModal');
    const title = document.getElementById('modalReportTitle');
    const dateEl = document.getElementById('modalReportDate');
    if (title) title.textContent = name || 'Diagnostic Report';
    if (dateEl) dateEl.textContent = `Analyzed on ${date || 'Aug 14, 2026'}`;
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeReportModal() {
    const modal = document.getElementById('reportViewerModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     5. MEDICAL DASHBOARD LOGIC (medical-dashboard.html)
     ========================================================================== */
  function setupMedicalDashboard() {
    const medNewNotifBtn = document.getElementById('medNewNotifBtn');
    if (medNewNotifBtn) {
      medNewNotifBtn.addEventListener('click', () => switchView('med-notifications'));
    }

    const medViewAllRefillsBtn = document.getElementById('medViewAllRefillsBtn');
    if (medViewAllRefillsBtn) {
      medViewAllRefillsBtn.addEventListener('click', () => switchView('med-refills'));
    }

    // Refill filter buttons
    document.querySelectorAll('[data-refill-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-refill-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-refill-filter');
        renderMedicalRefillQueues(filter);
      });
    });

    // Send Notification Form
    const medSendNotifForm = document.getElementById('medSendNotifForm');
    if (medSendNotifForm) {
      medSendNotifForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipient = document.getElementById('notifPatientSelect').value;
        const type = document.getElementById('notifTypeSelect').value;
        const message = document.getElementById('notifMessageInput').value.trim();

        if (!message) return;

        MOCK_DATA.sentNotificationsLog.unshift({
          recipient: recipient,
          type: type === 'success' ? 'Medicine Ready' : type === 'info' ? 'Appointment Reminder' : 'Clinical Alert',
          message: message,
          time: 'Just now',
          status: 'Delivered'
        });

        medSendNotifForm.reset();
        renderMedicalNotificationLog();
        showToast('Notification Dispatched', `Alert successfully sent to ${recipient}.`, 'success');
      });
    }

    renderMedicalRefillQueues();
    renderMedicalNotificationLog();
    renderMedicalAssignedPatients();
  }

  function renderMedicalRefillQueues(filter = 'all') {
    const quickTbody = document.getElementById('medQuickRefillsTableBody');
    const allTbody = document.getElementById('medAllRefillsTableBody');
    const pendingCount = MOCK_DATA.refillRequests.filter(r => r.status === 'pending').length;

    const medStatPendingRefills = document.getElementById('medStatPendingRefills');
    const sidebarRefillCount = document.getElementById('sidebarRefillCount');
    if (medStatPendingRefills) medStatPendingRefills.textContent = pendingCount;
    if (sidebarRefillCount) sidebarRefillCount.textContent = `${pendingCount} Pending`;

    let filtered = MOCK_DATA.refillRequests;
    if (filter === 'pending') filtered = filtered.filter(r => r.status === 'pending');
    if (filter === 'approved') filtered = filtered.filter(r => r.status === 'approved');
    if (filter === 'rejected') filtered = filtered.filter(r => r.status === 'rejected');

    const generateRows = (list) => list.map(r => `
      <tr>
        <td><strong>${r.patientName}</strong> <span style="font-size: 11px; color: var(--text-muted);">(${r.patientId})</span></td>
        <td><strong>${r.medication}</strong></td>
        <td>${r.date}</td>
        <td>${r.pharmacy}</td>
        <td><span class="badge-tag ${r.status}">${r.status.toUpperCase()}</span></td>
        <td>
          ${r.status === 'pending' ? `
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn-primary touch-target approve-refill-btn" data-refill-id="${r.id}" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Approve</button>
              <button type="button" class="btn-outline touch-target reject-refill-btn" data-refill-id="${r.id}" style="min-height: 32px; padding: 0 10px; font-size: 11px; color: var(--danger);">Reject</button>
            </div>
          ` : `<span style="font-size: 12px; color: var(--text-muted);">Processed</span>`}
        </td>
      </tr>
    `).join('');

    if (quickTbody) quickTbody.innerHTML = generateRows(MOCK_DATA.refillRequests.slice(0, 4));
    if (allTbody) allTbody.innerHTML = generateRows(filtered);

    // Attach Approve / Reject listeners
    document.querySelectorAll('.approve-refill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-refill-id');
        const ref = MOCK_DATA.refillRequests.find(r => r.id === id);
        if (ref) {
          ref.status = 'approved';
          renderMedicalRefillQueues(filter);
          showToast('Refill Approved', `${ref.medication} approved for ${ref.patientName} at ${ref.pharmacy}.`, 'success');
        }
      });
    });

    document.querySelectorAll('.reject-refill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-refill-id');
        const ref = MOCK_DATA.refillRequests.find(r => r.id === id);
        if (ref) {
          ref.status = 'rejected';
          renderMedicalRefillQueues(filter);
          showToast('Refill Rejected', `${ref.medication} rejected for ${ref.patientName}. Physician notified.`, 'warning');
        }
      });
    });
  }

  function renderMedicalNotificationLog() {
    const tbody = document.getElementById('medNotifLogTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.sentNotificationsLog.map(item => `
      <tr>
        <td><strong>${item.recipient}</strong></td>
        <td><span class="badge-tag optimal">${item.type}</span></td>
        <td style="max-width: 280px;">${item.message}</td>
        <td>${item.time}</td>
        <td><span class="status-chip optimal">${item.status}</span></td>
      </tr>
    `).join('');
  }

  function renderMedicalAssignedPatients() {
    const tbody = document.getElementById('medPatientsTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.assignedPatients.map(p => `
      <tr>
        <td><strong>${p.name}</strong> <div style="font-size: 11px; color: var(--text-muted);">${p.id}</div></td>
        <td>${p.age}</td>
        <td>${p.doctor}</td>
        <td>${p.meds}</td>
        <td>${p.nextApp}</td>
        <td>
          <button type="button" class="btn-outline touch-target med-send-alert-to-btn" data-patient="${p.name}" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Send Alert</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.med-send-alert-to-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-patient');
        switchView('med-notifications');
        const select = document.getElementById('notifPatientSelect');
        if (select) select.value = name;
      });
    });
  }

  /* ==========================================================================
     6. DOCTOR DASHBOARD LOGIC (doctor-dashboard.html)
     ========================================================================== */
  function setupDoctorDashboard() {
    const docCreateRxQuickBtn = document.getElementById('docCreateRxQuickBtn');
    const docWriteRxBtn = document.getElementById('docWriteRxBtn');
    [docCreateRxQuickBtn, docWriteRxBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => openDoctorRxModal());
    });

    const docViewScheduleBtn = document.getElementById('docViewScheduleBtn');
    if (docViewScheduleBtn) {
      docViewScheduleBtn.addEventListener('click', () => switchView('doc-appointments'));
    }

    const docAddAppBtn = document.getElementById('docAddAppBtn');
    if (docAddAppBtn) {
      docAddAppBtn.addEventListener('click', () => {
        showToast('Schedule Appointment', 'Opening slot reservation for cardiology patients.', 'info');
      });
    }

    // Prescription Form Submit
    const doctorNewRxForm = document.getElementById('doctorNewRxForm');
    if (doctorNewRxForm) {
      doctorNewRxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const patient = document.getElementById('rxPatientSelect').value;
        const medName = document.getElementById('rxMedName').value.trim();
        const dosage = document.getElementById('rxDosage').value.trim();
        const freq = document.getElementById('rxFrequency').value.trim();
        const instructions = document.getElementById('rxInstructions').value.trim();

        MOCK_DATA.doctorPrescriptions.unshift({
          id: `RX-${Math.floor(Math.random()*900)+800}`,
          patient: patient,
          medication: `${medName} ${dosage}`,
          frequency: freq,
          date: 'Today',
          refills: 3,
          instructions: instructions || 'Take as directed.'
        });

        closeDoctorRxModal();
        renderDoctorPrescriptionsTable();
        showToast('Prescription Signed', `Electronic prescription for ${medName} ${dosage} issued to ${patient}.`, 'success');
      });
    }

    // Reschedule Form Submit
    const rescheduleForm = document.getElementById('rescheduleForm');
    if (rescheduleForm) {
      rescheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('rescheduleDate').value;
        const time = document.getElementById('rescheduleTime').value;

        if (state.selectedAppointmentForReschedule) {
          state.selectedAppointmentForReschedule.date = date;
          state.selectedAppointmentForReschedule.time = time;
          state.selectedAppointmentForReschedule.status = 'Rescheduled';
        }

        closeRescheduleModal();
        renderDoctorAppointmentsTable();
        renderDoctorOverviewWidgets();
        showToast('Appointment Rescheduled', `Consultation moved to ${date} at ${time}. Patient notified.`, 'success');
      });
    }

    // Clinical Notes Form Submit
    const clinicalNotesForm = document.getElementById('clinicalNotesForm');
    if (clinicalNotesForm) {
      clinicalNotesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const note = document.getElementById('doctorClinicalNoteInput').value.trim();

        if (state.selectedReportForNote) {
          state.selectedReportForNote.docNote = note;
        }

        closeClinicalNotesModal();
        renderDoctorReportsTable();
        showToast('Assessment Saved', 'Physician clinical notes attached to report.', 'success');
      });
    }

    // Modal Close buttons
    const closeDoctorRxModalBtn = document.getElementById('closeDoctorRxModalBtn');
    const cancelDoctorRxBtn = document.getElementById('cancelDoctorRxBtn');
    if (closeDoctorRxModalBtn) closeDoctorRxModalBtn.addEventListener('click', closeDoctorRxModal);
    if (cancelDoctorRxBtn) cancelDoctorRxBtn.addEventListener('click', closeDoctorRxModal);

    const closeRescheduleModalBtn = document.getElementById('closeRescheduleModalBtn');
    const cancelRescheduleBtn = document.getElementById('cancelRescheduleBtn');
    if (closeRescheduleModalBtn) closeRescheduleModalBtn.addEventListener('click', closeRescheduleModal);
    if (cancelRescheduleBtn) cancelRescheduleBtn.addEventListener('click', closeRescheduleModal);

    const closeClinicalNotesModalBtn = document.getElementById('closeClinicalNotesModalBtn');
    const cancelClinicalNoteBtn = document.getElementById('cancelClinicalNoteBtn');
    if (closeClinicalNotesModalBtn) closeClinicalNotesModalBtn.addEventListener('click', closeClinicalNotesModal);
    if (cancelClinicalNoteBtn) cancelClinicalNoteBtn.addEventListener('click', closeClinicalNotesModal);

    renderDoctorOverviewWidgets();
    renderDoctorAppointmentsTable();
    renderDoctorPatientsTable();
    renderDoctorPrescriptionsTable();
    renderDoctorReportsTable();
  }

  function renderDoctorOverviewWidgets() {
    const scheduleContainer = document.getElementById('docTodayScheduleList');
    const reportsContainer = document.getElementById('docUnreviewedReportsList');

    if (scheduleContainer) {
      scheduleContainer.innerHTML = MOCK_DATA.doctorAppointments.map(app => `
        <div class="calendar-slot-card">
          <div class="slot-time-col">
            <span class="slot-time">${app.time}</span>
            <span class="slot-duration">30 mins</span>
          </div>
          <div class="slot-patient-col">
            <div class="slot-patient-name">${app.patient}</div>
            <div class="slot-patient-meta">${app.type} • ${app.notes}</div>
          </div>
          <div>
            <button type="button" class="btn-primary touch-target start-telehealth-btn" data-patient="${app.patient}" style="min-height: 34px; padding: 0 10px; font-size: 11px;">Join Video</button>
          </div>
        </div>
      `).join('');

      scheduleContainer.querySelectorAll('.start-telehealth-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const patient = btn.getAttribute('data-patient');
          showToast('Telehealth Room Open', `Connecting encrypted video room with ${patient}...`, 'success');
        });
      });
    }

    if (reportsContainer) {
      reportsContainer.innerHTML = MOCK_DATA.patientReports.map(r => `
        <div class="report-item">
          <div class="report-item-left">
            <div class="report-file-icon"><i class="fa-solid fa-file-waveform" style="color: var(--primary);"></i></div>
            <div class="report-title-col">
              <span class="report-title">${r.name} (${r.patientName})</span>
              <span class="report-meta">${r.keyMetrics}</span>
            </div>
          </div>
          <div>
            <button type="button" class="btn-outline touch-target add-doc-note-trigger" data-report-name="${r.name}" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Evaluate</button>
          </div>
        </div>
      `).join('');

      reportsContainer.querySelectorAll('.add-doc-note-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const name = btn.getAttribute('data-report-name');
          const report = MOCK_DATA.patientReports.find(r => r.name === name);
          openClinicalNotesModal(report);
        });
      });
    }
  }

  function renderDoctorAppointmentsTable() {
    const tbody = document.getElementById('docAppointmentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.doctorAppointments.map(app => `
      <tr>
        <td><strong>${app.patient}</strong> <div style="font-size: 11px; color: var(--text-muted);">${app.patientId}</div></td>
        <td>${app.type}</td>
        <td>${app.date} • ${app.time}</td>
        <td><span class="badge-tag optimal">${app.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="btn-outline touch-target reschedule-app-btn" data-app-id="${app.id}" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Reschedule</button>
            <button type="button" class="btn-primary touch-target" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Consult</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.reschedule-app-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-app-id');
        const app = MOCK_DATA.doctorAppointments.find(a => a.id === id);
        openRescheduleModal(app);
      });
    });
  }

  function renderDoctorPatientsTable() {
    const tbody = document.getElementById('docPatientsTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.assignedPatients.map(p => `
      <tr>
        <td><strong>${p.name}</strong> <div style="font-size: 11px; color: var(--text-muted);">${p.id}</div></td>
        <td>${p.age}</td>
        <td><strong style="color: var(--primary);">${p.diagnosis}</strong></td>
        <td>${p.nextApp}</td>
        <td style="font-size: 12px;">${p.biomarkers}</td>
        <td>
          <button type="button" class="btn-outline touch-target view-patient-doc-records" data-patient="${p.name}" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Clinical Record</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.view-patient-doc-records').forEach(btn => {
      btn.addEventListener('click', () => {
        const patient = btn.getAttribute('data-patient');
        showToast('Clinical History', `Displaying comprehensive EHR record & lab trajectory for ${patient}.`, 'info');
      });
    });
  }

  function renderDoctorPrescriptionsTable() {
    const tbody = document.getElementById('docPrescriptionsTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.doctorPrescriptions.map(rx => `
      <tr>
        <td><strong>${rx.patient}</strong></td>
        <td><strong>${rx.medication}</strong></td>
        <td>${rx.frequency}</td>
        <td>${rx.date}</td>
        <td><span class="badge-tag optimal">${rx.refills} Refills</span></td>
        <td>
          <button type="button" class="btn-outline touch-target" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Amend</button>
        </td>
      </tr>
    `).join('');
  }

  function renderDoctorReportsTable() {
    const tbody = document.getElementById('docReportsTableBody');
    if (!tbody) return;

    tbody.innerHTML = MOCK_DATA.patientReports.map(r => `
      <tr>
        <td><strong>${r.name}</strong> <div style="font-size: 11px; color: var(--text-muted);">${r.patientName}</div></td>
        <td>${r.category}</td>
        <td>${r.date}</td>
        <td style="font-size: 12px;">${r.keyMetrics}</td>
        <td style="max-width: 220px; font-size: 12px; color: var(--text-secondary);">${r.docNote}</td>
        <td>
          <button type="button" class="btn-primary touch-target doc-add-note-btn" data-report-name="${r.name}" style="min-height: 32px; padding: 0 10px; font-size: 11px;">Add Note</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.doc-add-note-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-report-name');
        const report = MOCK_DATA.patientReports.find(r => r.name === name);
        openClinicalNotesModal(report);
      });
    });
  }

  function openDoctorRxModal() {
    const modal = document.getElementById('doctorPrescriptionModal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDoctorRxModal() {
    const modal = document.getElementById('doctorPrescriptionModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openRescheduleModal(appointment) {
    state.selectedAppointmentForReschedule = appointment;
    const modal = document.getElementById('rescheduleModal');
    const nameEl = document.getElementById('reschedulePatientName');
    if (nameEl && appointment) nameEl.textContent = `Patient: ${appointment.patient}`;
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeRescheduleModal() {
    const modal = document.getElementById('rescheduleModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openClinicalNotesModal(report) {
    state.selectedReportForNote = report;
    const modal = document.getElementById('clinicalNotesModal');
    const targetName = document.getElementById('noteTargetName');
    const noteInput = document.getElementById('doctorClinicalNoteInput');
    if (targetName && report) targetName.textContent = `Document: ${report.name} (${report.patientName})`;
    if (noteInput && report) noteInput.value = report.docNote || '';
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeClinicalNotesModal() {
    const modal = document.getElementById('clinicalNotesModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     7. COMMON GLOBAL NAVIGATION, SEARCH & NOTIFICATIONS
     ========================================================================== */
  function setupGlobalNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const collapseSidebarBtn = document.getElementById('collapseSidebarBtn');
    const appSidebar = document.getElementById('appSidebar');
    const appContainer = document.getElementById('appContainer');

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        state.isMobileDrawerOpen = true;
        if (appSidebar) appSidebar.classList.add('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
      });
    }

    const closeDrawer = () => {
      state.isMobileDrawerOpen = false;
      if (appSidebar) appSidebar.classList.remove('mobile-open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    };

    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeDrawer);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeDrawer);

    if (collapseSidebarBtn) {
      collapseSidebarBtn.addEventListener('click', () => {
        state.isSidebarCollapsed = !state.isSidebarCollapsed;
        if (appContainer) appContainer.classList.toggle('sidebar-collapsed', state.isSidebarCollapsed);
      });
    }

    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetView = link.getAttribute('data-view');
        const href = link.getAttribute('href');
        
        if (targetView) {
          const targetSection = document.getElementById(`view-${targetView}`);
          if (targetSection) {
            e.preventDefault();
            if (window.location.hash !== `#${targetView}`) {
              history.pushState(null, '', `#${targetView}`);
            }
            switchView(targetView);
            closeDrawer();
          } else if (href && href.includes('.html')) {
            // Navigate directly to dedicated page file
            window.location.href = href;
          }
        }
      });
    });

    // Hash routing initialization and hashchange listener
    const syncViewFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`view-${hash}`)) {
        switchView(hash);
      }
    };

    syncViewFromHash();
    window.addEventListener('hashchange', syncViewFromHash);

    // Return to main portal / Logout handlers
    const handleLogoutAction = (e) => {
      if (e) e.preventDefault();
      try {
        localStorage.removeItem('prms_active_user');
      } catch (err) {}
      window.location.href = 'signin.html';
    };

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogoutAction);
    }

    const headerLogoutQuickBtn = document.getElementById('headerLogoutQuickBtn');
    if (headerLogoutQuickBtn) {
      headerLogoutQuickBtn.addEventListener('click', handleLogoutAction);
    }

    // Modal backdrops close
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  function switchView(viewName) {
    state.currentView = viewName;

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.toggle('active', section.id === `view-${viewName}`);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupHeaderNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdownMenu = document.getElementById('notificationDropdownMenu');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearAllNotifsBtn = document.getElementById('clearAllNotifsBtn');

    if (notificationBtn) {
      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeProfileDropdown();
        if (notificationDropdownMenu) {
          notificationDropdownMenu.classList.toggle('active');
          renderNotificationList();
        }
      });
    }

    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => {
        MOCK_DATA.notifications.forEach(n => n.unread = false);
        renderNotificationList();
        updateNotificationBadge();
        showToast('Notifications Marked Read', 'All notifications marked as read.', 'info');
      });
    }

    if (clearAllNotifsBtn) {
      clearAllNotifsBtn.addEventListener('click', () => {
        MOCK_DATA.notifications = [];
        renderNotificationList();
        updateNotificationBadge();
        showToast('Notifications Cleared', 'Notification list is now empty.', 'info');
      });
    }

    document.addEventListener('click', (e) => {
      if (notificationDropdownMenu && !notificationDropdownMenu.contains(e.target) && e.target !== notificationBtn) {
        notificationDropdownMenu.classList.remove('active');
      }
    });

    updateNotificationBadge();
  }

  function renderNotificationList() {
    const container = document.getElementById('notificationListContainer');
    const notifCountPill = document.getElementById('notifCountPill');
    if (!container) return;

    const unreadCount = MOCK_DATA.notifications.filter(n => n.unread).length;
    if (notifCountPill) notifCountPill.textContent = `${unreadCount} New`;

    if (MOCK_DATA.notifications.length === 0) {
      container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">No new clinical notifications</div>`;
      return;
    }

    container.innerHTML = MOCK_DATA.notifications.map(item => `
      <div class="notification-list-item ${item.unread ? 'unread' : ''}" data-notif-id="${item.id}">
        <div class="notif-item-icon ${item.type}">
          <i class="fa-solid ${item.type === 'success' ? 'fa-check' : item.type === 'warning' ? 'fa-exclamation' : 'fa-info'}"></i>
        </div>
        <div class="notif-item-content">
          <div class="notif-item-title">${item.title}</div>
          <div class="notif-item-desc">${item.desc}</div>
          <div class="notif-item-time">${item.time}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.notification-list-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-notif-id');
        const notif = MOCK_DATA.notifications.find(n => n.id === id);
        if (notif) {
          notif.unread = false;
          renderNotificationList();
          updateNotificationBadge();
          showToast(notif.title, notif.desc, notif.type);
        }
      });
    });
  }

  function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    const unreadCount = MOCK_DATA.notifications.filter(n => n.unread).length;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
  }

  function setupProfileDropdown() {
    const profileBtn = document.getElementById('patientProfileBtn');
    const profileMenu = document.getElementById('profileDropdownMenu');

    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const notifMenu = document.getElementById('notificationDropdownMenu');
        if (notifMenu) notifMenu.classList.remove('active');
        if (profileMenu) profileMenu.classList.toggle('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (profileMenu && !profileMenu.contains(e.target) && e.target !== profileBtn) {
        profileMenu.classList.remove('active');
      }
    });
  }

  function closeProfileDropdown() {
    const menu = document.getElementById('profileDropdownMenu');
    if (menu) menu.classList.remove('active');
  }

  function setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const resultsDropdown = document.getElementById('searchResultsDropdown');
    const resultsContent = document.getElementById('searchResultsContent');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(state.searchDebounceTimer);
      const q = e.target.value.trim().toLowerCase();

      if (q.length < 2) {
        if (resultsDropdown) resultsDropdown.classList.remove('active');
        return;
      }

      state.searchDebounceTimer = setTimeout(() => {
        const matchedReports = MOCK_DATA.patientReports.filter(r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
        const matchedPatients = MOCK_DATA.assignedPatients.filter(p => p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q));
        const matchedRx = MOCK_DATA.doctorPrescriptions.filter(rx => rx.medication.toLowerCase().includes(q) || rx.patient.toLowerCase().includes(q));

        let html = '';
        if (matchedReports.length) {
          html += `<div class="search-category-title">Diagnostic Reports</div>`;
          matchedReports.forEach(r => {
            html += `
              <div class="search-result-item" onclick="alert('Viewing: ${r.name}');">
                <div class="search-result-left">
                  <i class="fa-solid fa-file-medical" style="color: var(--primary);"></i>
                  <div><div class="search-result-title">${r.name}</div><div class="search-result-subtitle">${r.category} • ${r.date}</div></div>
                </div>
                <span class="badge-tag optimal">View</span>
              </div>
            `;
          });
        }

        if (matchedPatients.length) {
          html += `<div class="search-category-title">Patients</div>`;
          matchedPatients.forEach(p => {
            html += `
              <div class="search-result-item">
                <div class="search-result-left">
                  <i class="fa-solid fa-user" style="color: var(--primary);"></i>
                  <div><div class="search-result-title">${p.name} (${p.id})</div><div class="search-result-subtitle">${p.diagnosis}</div></div>
                </div>
                <span class="badge-tag pending">EHR</span>
              </div>
            `;
          });
        }

        if (matchedRx.length) {
          html += `<div class="search-category-title">Prescriptions</div>`;
          matchedRx.forEach(rx => {
            html += `
              <div class="search-result-item">
                <div class="search-result-left">
                  <i class="fa-solid fa-pills" style="color: var(--primary);"></i>
                  <div><div class="search-result-title">${rx.medication}</div><div class="search-result-subtitle">${rx.patient} • ${rx.frequency}</div></div>
                </div>
                <span class="badge-tag approved">Active</span>
              </div>
            `;
          });
        }

        if (!html) {
          html = `<div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 12px;">No matching records found for "${q}"</div>`;
        }

        if (resultsContent && resultsDropdown) {
          resultsContent.innerHTML = html;
          resultsDropdown.classList.add('active');
        }
      }, 200);
    });

    document.addEventListener('click', (e) => {
      if (resultsDropdown && !resultsDropdown.contains(e.target) && e.target !== searchInput) {
        resultsDropdown.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     8. TOAST NOTIFICATIONS
     ========================================================================== */
  function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<i class="fa-solid fa-circle-check" style="font-size: 18px; color: var(--success);"></i>';
    } else if (type === 'warning') {
      iconSvg = '<i class="fa-solid fa-triangle-exclamation" style="font-size: 18px; color: var(--secondary);"></i>';
    } else if (type === 'error') {
      iconSvg = '<i class="fa-solid fa-circle-xmark" style="font-size: 18px; color: var(--danger);"></i>';
    } else {
      iconSvg = '<i class="fa-solid fa-circle-info" style="font-size: 18px; color: var(--primary);"></i>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
