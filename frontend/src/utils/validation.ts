// frontend/src/utils/validation.ts
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
};

export const validateFile = (file: File): { valid: boolean; message?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, message: 'Invalid file type. Only JPG, PNG, and BMP are allowed.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: 'File size exceeds 10MB limit.' };
  }
  return { valid: true };
};

export const validateAge = (age: number): boolean => {
  return age >= 0 && age <= 150;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.length >= 10;
};