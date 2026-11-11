import api from './api';

export const charityService = {
  async getProfile() {
    const response = await api.get('/api/charities/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/api/charities/profile', data);
    return response.data;
  },

  async getAllCharities(params = {}) {
    const response = await api.get('/api/charities', { params });
    return response.data;
  },

  async getNearbyCharities(params = {}) {
    const response = await api.get('/api/charities/nearby', { params });
    return response.data;
  },

  async verifyCharity(id, { status, rejectionReason }) {
    const response = await api.put(`/api/charities/${id}/verify`, { status, rejectionReason });
    return response.data;
  }
};
