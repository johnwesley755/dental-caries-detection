import { api } from './api';

export interface ChatMessageRequest {
  message: string;
  detection_id?: string;
}

export interface DetectionContext {
  detection_id: string;
  severity: string | null;
  total_caries: number;
  confidence_avg: number | null;
}

export interface ChatMessageResponse {
  id: string;
  user_message: string;
  bot_response: string;
  detection_context: DetectionContext | null;
  created_at: string;
}

export const chatService = {
  /**
   * Send a message to the chatbot
   */
  sendMessage: async (message: string, detectionId?: string): Promise<ChatMessageResponse> => {
    const response = await api.post(
      '/chat',
      {
        message,
        detection_id: detectionId || null,
      } as ChatMessageRequest
    );

    return response.data;
  },

  /**
   * Get chat history
   */
  getChatHistory: async (limit: number = 50): Promise<ChatMessageResponse[]> => {
    const response = await api.get(
      `/chat/history?limit=${limit}`
    );

    return response.data.messages;
  },
};
