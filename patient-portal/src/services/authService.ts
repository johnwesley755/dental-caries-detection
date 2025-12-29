// patient-portal/src/services/authService.ts
import { api } from './api';
import type { User, UserLogin, Token } from '../types/auth.types';

export const authService = {
  async login(credentials: UserLogin): Promise<{ user: User; token: string }> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post<Token>('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = response.data.access_token;
    
    // Get user info
    const userResponse = await api.get<User>('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { user: userResponse.data, token };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/v1/auth/me');
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
};
