import api from './api';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  receiver_name: string;
}

export interface Conversation {
  id: string;
  patient_id: string;
  dentist_id: string;
  last_message_at?: string;
  other_user_id: string;
  other_user_name: string;
  other_user_role: string;
  unread_count: number;
  last_message?: string;
}

export interface SendMessageRequest {
  receiver_id: string;
  content?: string;
}

export const messagingService = {
  // Get all conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/messaging/conversations');
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get(`/messaging/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Send a text message
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await api.post('/messaging/messages', data);
    return response.data;
  },

  // Upload a file
  uploadFile: async (file: File): Promise<{
    file_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/messaging/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Send message with file
  sendMessageWithFile: async (
    receiverId: string,
    file: File,
    content?: string
  ): Promise<Message> => {
    const formData = new FormData();
    formData.append('receiver_id', receiverId);
    formData.append('file', file);
    if (content) {
      formData.append('content', content);
    }
    
    const response = await api.post('/messaging/messages/with-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/messaging/unread-count');
    return response.data.count;
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<void> => {
    await api.put(`/messaging/messages/${messageId}/read`);
  },
};
