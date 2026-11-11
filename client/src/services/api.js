import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('waste2worth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token if expired and not on login page
      if (!window.location.pathname.includes('/login')) {
        // Optional: clear stale token
      }
    }
    return Promise.reject(error);
  }
);

export default api;
