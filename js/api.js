const API_BASE_URL = 'http://localhost:5000/api';

const API = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('prms_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    
    try {
      const response = await fetch(${API_BASE_URL}, {
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
      const query = patientId ? ?patient_id= : '';
      return API.request(/records);
    },
    
    getById: (id) => API.request(/records/),
    
    create: (recordData) => API.request('/records', {
      method: 'POST',
      body: JSON.stringify(recordData)
    }),
    
    update: (id, recordData) => API.request(/records/, {
      method: 'PUT',
      body: JSON.stringify(recordData)
    }),
    
    delete: (id) => API.request(/records/, { method: 'DELETE' }),

    upload: async (file) => {
      const token = localStorage.getItem('prms_token');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(${API_BASE_URL}/records/upload, {
        method: 'POST',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {},
        body: formData
      });
      return res.json();
    }
  },
  
  appointments: {
    getAll: () => API.request('/appointments'),
    
    create: (appointmentData) => API.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    }),
    
    update: (id, appointmentData) => API.request(/appointments/, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    }),
    
    cancel: (id) => API.request(/appointments/, { method: 'DELETE' })
  },
  
  healthMetrics: {
    getAll: (patientId, type) => {
      let query = '';
      if (patientId) query += ?patient_id=;
      if (type) query += ${query ? '&' : '?'}type=;
      return API.request(/health-metrics);
    },
    
    create: (metricData) => API.request('/health-metrics', {
      method: 'POST',
      body: JSON.stringify(metricData)
    }),
    
    getChartData: (patientId, type) => {
      let query = '';
      if (patientId) query += ?patient_id=;
      if (type) query += ${query ? '&' : '?'}type=;
      return API.request(/health-metrics/chart-data);
    },

    getHistory: (patientId, startDate, endDate) => {
      let query = '';
      if (patientId) query += ?patient_id=;
      if (startDate) query += ${query ? '&' : '?'}start_date=;
      if (endDate) query += ${query ? '&' : '?'}end_date=;
      return API.request(/health-metrics/history);
    }
  },
  
  dashboard: {
    getPatientDashboard: () => API.request('/dashboard/patient'),
    getDoctorDashboard: () => API.request('/dashboard/doctor'),
    getMedicalDashboard: () => API.request('/dashboard/medical'),
    getSummary: () => API.request('/dashboard/summary')
  },

  ai: {
    explainReport: (reportText, reportType) => API.request('/ai/report-explainer', {
      method: 'POST',
      body: JSON.stringify({ report_text: reportText, report_type: reportType })
    }),

    chat: (message, history = []) => API.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history })
    }),

    getHealthInsights: () => API.request('/ai/health-insights', {
      method: 'POST'
    }),

    getGraphInsights: (metricType = 'blood_pressure') => API.request(/ai/health-graph-insights?type=)
  }
};

window.PRMS_API = API;
