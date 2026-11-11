import api from './api';

export const donationService = {
  async createDonation(formData) {
    const response = await api.post('/api/donations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getDonations(params = {}) {
    const response = await api.get('/api/donations', { params });
    return response.data;
  },

  async getDonationById(id) {
    const response = await api.get(`/api/donations/${id}`);
    return response.data;
  },

  async getMyDonations(params = {}) {
    const response = await api.get('/api/donations/my-donations', { params });
    return response.data;
  },

  async getAvailableDonations(params = {}) {
    const response = await api.get('/api/donations/available', { params });
    return response.data;
  },

  async updateDonation(id, formData) {
    const response = await api.put(`/api/donations/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async acceptDonation(id) {
    const response = await api.post(`/api/donations/${id}/accept`);
    return response.data;
  },

  async rejectDonation(id, rejectionReason) {
    const response = await api.post(`/api/donations/${id}/reject`, { rejectionReason });
    return response.data;
  },

  async collectDonation(id) {
    const response = await api.put(`/api/donations/${id}/collect`);
    return response.data;
  },

  async completeDonation(id) {
    const response = await api.put(`/api/donations/${id}/complete`);
    return response.data;
  },

  async cancelDonation(id) {
    const response = await api.delete(`/api/donations/${id}`);
    return response.data;
  }
};
