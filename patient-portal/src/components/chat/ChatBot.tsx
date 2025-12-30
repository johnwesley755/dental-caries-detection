// patient-portal/src/components/chat/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { chatService, ChatMessageResponse } from '../../services/chatService';

interface ChatBotProps {
  detectionId?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ detectionId }) => {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage, detectionId);
      setMessages((prev) => [...prev, response]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(error.response?.data?.detail || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="h-5 w-5" />
          Dental Health Assistant
        </CardTitle>
        <p className="text-sm text-blue-700 mt-1">
          Ask me about your scan results. I'm here to help explain them in simple terms.
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Bot className="h-12 w-12 mb-3 text-blue-400" />
              <p className="font-medium">Welcome! How can I help you today?</p>
              <p className="text-sm mt-2 max-w-md">
                I can explain your dental scan results, severity levels, and next steps.
              </p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">
                    I cannot provide medical advice or prescriptions. 
                    Always consult your dentist for treatment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-sm">{msg.user_message}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {msg.bot_response}
                    </p>
                    {msg.detection_context && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Based on your scan:
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {msg.detection_context.severity && (
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              msg.detection_context.severity.toLowerCase() === 'severe'
                                ? 'bg-red-100 text-red-700'
                                : msg.detection_context.severity.toLowerCase() === 'moderate'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {msg.detection_context.severity}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {msg.detection_context.total_caries} caries
                          </span>
                          {msg.detection_context.confidence_avg && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                              {msg.detection_context.confidence_avg}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your scan results..."
              disabled={isLoading}
              className="flex-1"
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This chatbot explains your scan results. It does not provide medical advice.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
