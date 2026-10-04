const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop';

const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');

export function resolveImageUrl(path) {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith('http')) return path;
  return `${API_ORIGIN}${path}`;
}
