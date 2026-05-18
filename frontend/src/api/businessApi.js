import api from './axiosInstance';

export const businessApi = {
  getAll: (admin = false) => api.get('/businesses', { params: admin ? { admin: true } : {} }),
  getPending: () => api.get('/businesses/pending'),
  getFeatured: (count = 6) => api.get('/businesses/featured', { params: { count } }),
  search: ({ name, categoryId, city, page = 1, pageSize = 12 }) =>
    api.get('/businesses/search', { params: { name, categoryId, city, page, pageSize } }),
  getById: (id) => api.get(`/businesses/${id}`),
  create: (data) => api.post('/businesses', data),
  submit: (data) => api.post('/businesses/submit', data),
  approve: (id) => api.post(`/businesses/${id}/approve`),
  update: (id, data) => api.put(`/businesses/${id}`, data),
  delete: (id) => api.delete(`/businesses/${id}`),
  exportCsv: (params = {}) =>
    api.get('/businesses/export.csv', { params, responseType: 'blob' }),
};
