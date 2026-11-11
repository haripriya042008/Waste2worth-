import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },

  async getAllUsers(params = {}) {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  async updateUserStatus(id, status) {
    const response = await api.put(`/api/users/${id}/status`, { status });
    return response.data;
  }
};
