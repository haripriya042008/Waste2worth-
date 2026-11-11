import api from './api';

export const recommendationService = {
  async getCombinedNearby(params = {}) {
    const response = await api.get('/api/recommendations/nearby', { params });
    return response.data;
  },

  async getPublicPlaces(params = {}) {
    const response = await api.get('/api/recommendations/public-places', { params });
    return response.data;
  },

  async getCommunityPlaces(params = {}) {
    const response = await api.get('/api/recommendations/community-places', { params });
    return response.data;
  }
};
