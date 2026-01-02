// frontend/src/services/analyticsService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DetectionTrend {
  date: string;
  count: number;
}

export interface CariesDistribution {
  severity: string;
  count: number;
}

export interface PatientGrowth {
  date: string;
  count: number;
}

export interface AppointmentStats {
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

class AnalyticsService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getDetectionTrends(days: number = 30): Promise<DetectionTrend[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/detection-trends?days=${days}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching detection trends:', error);
      throw error;
    }
  }

  async getCariesDistribution(): Promise<CariesDistribution[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/caries-distribution`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching caries distribution:', error);
      throw error;
    }
  }

  async getPatientGrowth(days: number = 90): Promise<PatientGrowth[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/patient-growth?days=${days}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching patient growth:', error);
      throw error;
    }
  }

  async getAppointmentStats(): Promise<AppointmentStats> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/analytics/appointment-stats`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
