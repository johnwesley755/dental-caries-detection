import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    const token = localStorage.getItem('patient_token');
    const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData) => {
    const token = localStorage.getItem('patient_token');
    const response = await axios.put(`${API_URL}/api/v1/users/me`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordData) => {
    const token = localStorage.getItem('patient_token');
    const response = await axios.put(
      `${API_URL}/api/v1/users/me/password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
