// Helper to normalize image/video URLs to the API host for admin UI
export function getAdminImageUrl(url) {
  if (!url) return '';
  if (typeof url !== 'string') return '';

  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Resolve API base from env or runtime global
  const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.API_BASE_UR || window.API_BASE_URL)) || 'http://localhost:3000';

  const path = url.replace(/^https?:\/\//, '');
  const normalized = url.startsWith('/') ? url : `/${url}`;

  return `${API_BASE}${normalized}`;
}
