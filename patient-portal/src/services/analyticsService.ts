// patient-portal/src/services/analyticsService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  private getAuthHeader() {
    const token = localStorage.getItem('patient_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getMyHealthScore(): Promise<HealthScore> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/my-health-score`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching health score:', error);
      throw error;
    }
  }

  async getMyHealthHistory(days: number = 180): Promise<HealthHistory[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/my-health-history?days=${days}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching health history:', error);
      throw error;
    }
  }

  async getMyDetectionHistory(): Promise<DetectionHistory[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/my-detection-history`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching detection history:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
