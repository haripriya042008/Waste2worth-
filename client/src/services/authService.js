import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('waste2worth_token', response.data.token);
      localStorage.setItem('waste2worth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('waste2worth_token', response.data.token);
      localStorage.setItem('waste2worth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/api/auth/me');
    if (response.data.user) {
      localStorage.setItem('waste2worth_user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      // Continue client cleanup even if network fails
    }
    localStorage.removeItem('waste2worth_token');
    localStorage.removeItem('waste2worth_user');
  },

  getCurrentUser() {
    const stored = localStorage.getItem('waste2worth_user');
    return stored ? JSON.parse(stored) : null;
  },

  getToken() {
    return localStorage.getItem('waste2worth_token');
  }
};
