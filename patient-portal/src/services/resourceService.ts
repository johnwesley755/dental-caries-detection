// patient-portal/src/services/resourceService.ts
import { api } from './api';

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

export const resourceService = {
  async getResources(params?: {
    category?: string;
    type?: string;
    search?: string;
    featured_only?: boolean;
  }): Promise<Resource[]> {
    try {
      const response = await api.get('/resources', {
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
      const response = await api.get(`/resources/${resourceId}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get('/resources/categories/list');

      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};
