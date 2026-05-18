import api from './axiosInstance';

export const contactApi = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.post(`/contact/${id}/read`),
};
