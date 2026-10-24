// Update the login form submission in app.js to use the real API
// Add this script tag to your index.html: <script src="js/api.js"></script>

// Replace the mock authentication in app.js with real API calls
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('loginUsername');
  const passwordInput = document.getElementById('loginPassword');
  const errorAlert = document.getElementById('loginErrorAlert');
  const errorText = document.getElementById('loginErrorText');
  const submitBtn = document.getElementById('loginSubmitBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        showError('Please enter both username and password');
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
      }

      try {
        // Call the real API
        const response = await window.PRMS_API.auth.login({
          username: username,
          password: password
        });

        // Store token and user info
        localStorage.setItem('prms_token', response.token);
        localStorage.setItem('prms_user', JSON.stringify(response.user));

        // Hide error if visible
        if (errorAlert) errorAlert.style.display = 'none';

        // Show success message
        showToast('Login Successful', `Welcome back, ${response.user.name}!`, 'success');

        // Redirect based on role
        setTimeout(() => {
          const dashboardMap = {
            'patient': 'patient-dashboard.html',
            'doctor': 'doctor-dashboard.html',
            'medical': 'medical-dashboard.html'
          };
          window.location.href = dashboardMap[response.user.role] || 'patient-dashboard.html';
        }, 600);

      } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Invalid username or password');
        
        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
        }
      }
    });
  }

  function showError(message) {
    if (errorAlert && errorText) {
      errorText.textContent = message;
      errorAlert.style.display = 'flex';
    }
  }

  function showToast(title, message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) {
      console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
      return;
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconSvg = '<i class="fa-solid fa-circle-info" style="font-size: 18px; color: var(--primary);"></i>';
    if (type === 'success') {
      iconSvg = '<i class="fa-solid fa-circle-check" style="font-size: 18px; color: var(--success);"></i>';
    } else if (type === 'error') {
      iconSvg = '<i class="fa-solid fa-circle-xmark" style="font-size: 18px; color: var(--danger);"></i>';
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
    }, 3500);
  }

  // Auto-fill demo credentials
  document.querySelectorAll('.demo-pill-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const role = this.getAttribute('data-demo');
      const credentials = {
        patient: { username: 'patient', password: 'patient123' },
        medical: { username: 'medical', password: 'medical123' },
        doctor: { username: 'doctor', password: 'doctor123' }
      };

      if (credentials[role]) {
        usernameInput.value = credentials[role].username;
        passwordInput.value = credentials[role].password;
        
        // Trigger role selection if needed
        const roleBtn = document.querySelector(`[data-role="${role}"]`);
        if (roleBtn) roleBtn.click();
      }
    });
  });
});
