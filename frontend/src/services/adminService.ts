import { api } from './api';
import { UserRole } from '../types/auth.types';

export interface CreateUserRequest {
  email: string;
  full_name: string;
  role: UserRole;
  send_email?: boolean;
}

export interface CreatePatientWithAccountRequest {
  full_name: string;
  age?: number;
  gender?: string;
  contact_number?: string;
  email: string;
  address?: string;
  medical_history?: string;
  create_account?: boolean;
  send_email?: boolean;
}

export interface UserWithPassword {
  user: any;
  password?: string;
}

export const adminService = {
  // Create a new user (dentist/patient)
  async createUser(data: CreateUserRequest): Promise<UserWithPassword> {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  // Create patient with optional user account
  async createPatientWithAccount(data: CreatePatientWithAccountRequest): Promise<any> {
    const response = await api.post('/admin/patients', data);
    return response.data;
  },

  // List all users
  async listUsers(): Promise<any[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },
};
