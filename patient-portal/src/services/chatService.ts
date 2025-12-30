import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    const token = localStorage.getItem('patient_token');
    
    const response = await axios.post(
      `${API_URL}/api/v1/chat/`,
      {
        message,
        detection_id: detectionId || null,
      } as ChatMessageRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  },

  /**
   * Get chat history
   */
  getChatHistory: async (limit: number = 50): Promise<ChatMessageResponse[]> => {
    const token = localStorage.getItem('patient_token');
    
    const response = await axios.get(
      `${API_URL}/api/v1/chat/history?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data.messages;
  },
};
