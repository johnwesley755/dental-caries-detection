// patient-portal/src/services/notificationService.ts
import { api } from './api';

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
  async getNotifications(unreadOnly: boolean = false, limit: number = 50): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (unreadOnly) params.append('unread_only', 'true');
      params.append('limit', limit.toString());

      const response = await api.get(
        `/notifications?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get(
        '/notifications/unread-count'
      );
      return response.data.unread_count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await api.put(
        `/notifications/${notificationId}/read`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<{ message: string }> {
    try {
      const response = await api.put(
        '/notifications/mark-all-read',
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(
        `/notifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
