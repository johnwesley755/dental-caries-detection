// frontend/src/utils/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SEVERITY_COLORS = {
  mild: '#10b981',
  moderate: '#f59e0b',
  severe: '#ef4444',
};

export const SEVERITY_LABELS = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
};

export const IMAGE_TYPE_LABELS = {
  intraoral: 'Intraoral',
  bitewing: 'Bitewing',
  periapical: 'Periapical',
  panoramic: 'Panoramic',
};

export const CARIES_TYPE_LABELS = {
  enamel: 'Enamel',
  dentin: 'Dentin',
  pulp: 'Pulp',
};

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB