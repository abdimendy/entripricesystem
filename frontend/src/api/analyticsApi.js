import api from './axiosInstance';

export const analyticsApi = {
  track: (data) => api.post('/analytics/track', data).catch(() => {}),
  summary: () => api.get('/analytics/summary'),
};
