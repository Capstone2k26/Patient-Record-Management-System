const API_BASE_URL = 'http://localhost:5000/api';

const API = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('prms_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  auth: {
    login: (credentials) => API.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    
    register: (userData) => API.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
    getCurrentUser: () => API.request('/auth/me'),
    
    logout: () => API.request('/auth/logout', { method: 'POST' })
  },
  
  records: {
    getAll: (patientId) => {
      const query = patientId ? `?patient_id=${patientId}` : '';
      return API.request(`/records${query}`);
    },
    
    getById: (id) => API.request(`/records/${id}`),
    
    create: (recordData) => API.request('/records', {
      method: 'POST',
      body: JSON.stringify(recordData)
    }),
    
    update: (id, recordData) => API.request(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData)
    }),
    
    delete: (id) => API.request(`/records/${id}`, { method: 'DELETE' })
  },
  
  appointments: {
    getAll: () => API.request('/appointments'),
    
    create: (appointmentData) => API.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    }),
    
    update: (id, appointmentData) => API.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    }),
    
    cancel: (id) => API.request(`/appointments/${id}`, { method: 'DELETE' })
  },
  
  healthMetrics: {
    getAll: (patientId, type) => {
      let query = '';
      if (patientId) query += `?patient_id=${patientId}`;
      if (type) query += `${query ? '&' : '?'}type=${type}`;
      return API.request(`/health-metrics${query}`);
    },
    
    create: (metricData) => API.request('/health-metrics', {
      method: 'POST',
      body: JSON.stringify(metricData)
    }),
    
    getChartData: (patientId, type) => {
      let query = '';
      if (patientId) query += `?patient_id=${patientId}`;
      if (type) query += `${query ? '&' : '?'}type=${type}`;
      return API.request(`/health-metrics/chart-data${query}`);
    }
  },
  
  dashboard: {
    getPatientDashboard: () => API.request('/dashboard/patient'),
    getDoctorDashboard: () => API.request('/dashboard/doctor'),
    getMedicalDashboard: () => API.request('/dashboard/medical')
  }
};

window.PRMS_API = API;
