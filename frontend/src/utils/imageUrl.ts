// frontend/src/utils/imageUrl.ts

/**
 * Resolves an image URL.
 * If the URL is absolute (e.g., Cloudinary), it returns it as is.
 * If the URL is relative (e.g., /uploads/...), it prepends the backend API URL.
 */
export const resolveImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    return url;
  }

  // If it's a relative path to our backend static storage
  if (url.startsWith('/uploads') || url.startsWith('/results')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // Remove trailing slash from baseUrl if exists, and ensure url starts with slash
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    
    return `${normalizedBaseUrl}${normalizedPath}`;
  }

  return url;
};
