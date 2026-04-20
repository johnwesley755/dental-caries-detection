// patient-portal/src/utils/imageUrl.ts

/**
 * Resolves an image URL by checking if it's an absolute URL (Cloudinary)
 * or a relative path (Local StorageFallback).
 * For relative paths, it prepends the API URL.
 */
export const resolveImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  
  // If it's already an absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url.startsWith('//') ? `https:${url}` : url;
  }
  
  // If it's a relative path, prepend the API URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Ensure we don't have double slashes but have at least one
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};
