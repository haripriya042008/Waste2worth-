import api from './api';

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  }
};
