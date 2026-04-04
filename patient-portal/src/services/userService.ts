import { api } from './api';

export interface UpdateProfileData {
  full_name?: string;
  email?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export const userService = {
  /**
   * Get current user information
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Get all dentists
   */
  getDentists: async () => {
    const response = await api.get('/auth/dentists');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.put(
      '/users/me/password',
      data
    );
    return response.data;
  },
};
