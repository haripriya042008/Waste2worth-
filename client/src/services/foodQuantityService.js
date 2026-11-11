import api from './api';

export const foodQuantityService = {
  async calculate(data) {
    const response = await api.post('/api/food-quantity/calculate', data);
    return response.data;
  }
};
