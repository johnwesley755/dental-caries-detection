// patient-portal/src/services/authService.ts
import { api } from './api';
import type { User, UserLogin, Token } from '../types/auth.types';

export const authService = {
  async login(credentials: UserLogin): Promise<{ user: User; token: string }> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post<Token>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = response.data.access_token;

    // Get user info
    const userResponse = await api.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { user: userResponse.data, token };
  },

  async register(userData: any): Promise<void> {
    const payload = {
      ...userData,
      role: 'PATIENT'
    };

    const serializedData = JSON.stringify(payload);
    const formData = new FormData();
    formData.append('user_data', serializedData);

    await api.post('/auth/register', formData);
  },

  async verifyOtp(email: string, otp: string): Promise<void> {
    await api.post('/auth/verify-otp', { email, otp });
  },

  async resendOtp(email: string): Promise<void> {
    await api.post('/auth/resend-otp', { email });
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem('patient_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('patient_token');
  },

  removeToken(): void {
    localStorage.removeItem('patient_token');
  },

  async forgotPassword(email: string, role: string = 'PATIENT'): Promise<void> {
    await api.post('/auth/forgot-password', { email, role });
  },

  async resetPassword(data: any): Promise<void> {
    await api.post('/auth/reset-password', data);
  },

  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email?token=${token}`);
  },
};
