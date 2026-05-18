import api from './axiosInstance';

export const reviewApi = {
  getByBusiness: (businessId) => api.get(`/reviews/business/${businessId}`),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};
