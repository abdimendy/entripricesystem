import api from '../api/axiosInstance';
import { DEFAULT_PRODUCTION_API_ORIGIN } from '../api/configureApi';

const FALLBACK_API =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ||
  (import.meta.env.PROD ? DEFAULT_PRODUCTION_API_ORIGIN : 'http://localhost:5261');

function apiOrigin() {
  const base = api.defaults.baseURL || '/api';
  if (base.startsWith('http')) return base.replace(/\/api\/?$/, '');
  if (import.meta.env.PROD) return FALLBACK_API;
  if (typeof window !== 'undefined') return window.location.origin;
  return FALLBACK_API;
}

/** Resolve business logo URL (Cloudinary https, local /uploads, or avatar fallback). */
export function resolveImageUrl(url, name = 'Business') {
  if (!url || !String(url).trim()) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fbbf24&color=1e293b&size=256&bold=true`;
  }

  const trimmed = url.trim();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.includes('res.cloudinary.com')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${apiOrigin()}${trimmed}`;
  }

  return trimmed;
}

/** Optional Cloudinary transform, e.g. w_400,h_300,c_fill */
export function cloudinaryTransform(url, transform = 'w_400,h_300,c_fill') {
  if (!url?.includes('res.cloudinary.com') || !transform) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
}
