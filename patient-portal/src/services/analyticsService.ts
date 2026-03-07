// patient-portal/src/services/analyticsService.ts
import { api } from './api';

export interface HealthScore {
  score: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface HealthHistory {
  date: string;
  score: number;
  total_caries: number;
}

export interface DetectionHistory {
  date: string;
  caries_count: number;
  detection_id: string;
}

class AnalyticsService {
  async getMyHealthScore(): Promise<HealthScore> {
    try {
      const response = await api.get('/analytics/my-health-score');
      return response.data;
    } catch (error) {
      console.error('Error fetching health score:', error);
      throw error;
    }
  }

  async getMyHealthHistory(days: number = 180): Promise<HealthHistory[]> {
    try {
      const response = await api.get(`/analytics/my-health-history?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health history:', error);
      throw error;
    }
  }

  async getMyDetectionHistory(): Promise<DetectionHistory[]> {
    try {
      const response = await api.get('/analytics/my-detection-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching detection history:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
