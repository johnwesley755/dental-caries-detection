// frontend/src/services/authService.ts
import { api } from './api';
import type { User, UserCreate, UserLogin, Token } from '../types/auth.types';

export const authService = {
  async register(data: UserCreate): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  async login(data: UserLogin): Promise<Token> {
    const response = await api.post<Token>('/auth/login/json', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async forgotPassword(email: string, role: string = 'DENTIST'): Promise<void> {
    await api.post('/auth/forgot-password', { email, role });
  },

  async resetPassword(data: any): Promise<void> {
    await api.post('/auth/reset-password', data);
  },

  async verifyEmail(token: string): Promise<void> {
    await api.get(`/auth/verify-email?token=${token}`);
  },
};