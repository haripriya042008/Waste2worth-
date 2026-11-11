import api from './api';

export const publicPlaceService = {
  async getPublicPlaces(params = {}) {
    const response = await api.get('/api/public-places', { params });
    return response.data;
  },

  async createPublicPlace(data) {
    const response = await api.post('/api/public-places', data);
    return response.data;
  },

  async updatePublicPlace(id, data) {
    const response = await api.put(`/api/public-places/${id}`, data);
    return response.data;
  },

  async deletePublicPlace(id) {
    const response = await api.delete(`/api/public-places/${id}`);
    return response.data;
  }
};
