import api from './api';

export const analyticsService = {
  async getAdminAnalytics() {
    const response = await api.get('/api/analytics/admin');
    return response.data;
  },

  async getDonorAnalytics() {
    const response = await api.get('/api/analytics/donor');
    return response.data;
  },

  async getCharityAnalytics() {
    const response = await api.get('/api/analytics/charity');
    return response.data;
  }
};
