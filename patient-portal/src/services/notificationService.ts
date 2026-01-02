// frontend/src/services/notificationService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'detection' | 'appointment' | 'report' | 'system' | 'reminder';
  is_read: boolean;
  related_id?: string;
  related_type?: string;
  created_at: string;
  read_at?: string;
}

class NotificationService {
  private getAuthHeader() {
    const token = localStorage.getItem('patient_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getNotifications(unreadOnly: boolean = false, limit: number = 50): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (unreadOnly) params.append('unread_only', 'true');
      params.append('limit', limit.toString());

      const response = await axios.get(
        `${API_URL}/api/v1/notifications?${params.toString()}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/notifications/unread-count`,
        this.getAuthHeader()
      );
      return response.data.unread_count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/notifications/${notificationId}/read`,
        {},
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<{ message: string }> {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/notifications/mark-all-read`,
        {},
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/notifications/${notificationId}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
