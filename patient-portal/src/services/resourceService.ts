// patient-portal/src/services/resourceService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  content?: string;
  category: string;
  type: string;
  url?: string;
  thumbnail_url?: string;
  author?: string;
  source?: string;
  tags?: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

const getAuthToken = () => {
  return localStorage.getItem('patient_token');
};

export const resourceService = {
  async getResources(params?: {
    category?: string;
    type?: string;
    search?: string;
    featured_only?: boolean;
  }): Promise<Resource[]> {
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${API_URL}/api/v1/resources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  async getResource(resourceId: string): Promise<Resource> {
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${API_URL}/api/v1/resources/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${API_URL}/api/v1/resources/categories/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};
