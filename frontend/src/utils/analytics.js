import { analyticsApi } from '../api/analyticsApi';

export function trackEvent(eventType, { path, businessId } = {}) {
  const payload = {
    eventType,
    path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
    businessId,
    companyWebsite: '',
  };
  analyticsApi.track(payload);
  try {
    const key = `yb_${eventType}`;
    const n = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, String(n));
  } catch {
    /* ignore */
  }
}
