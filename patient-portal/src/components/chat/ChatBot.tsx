// patient-portal/src/components/chat/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { chatService, ChatMessageResponse } from '../../services/chatService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

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
    <Card className="flex flex-col h-full border-none shadow-none rounded-none overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100/50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="h-5 w-5 text-primary" />
          AI Health Assistant
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Ask me about your scan results. I'm here to help explain them in simple terms.
        </p>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 no-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <p className="font-bold text-slate-900 text-lg">How can I help you today?</p>
              <p className="text-sm mt-2 max-w-sm">
                I can explain your dental scan results, severity levels, and next steps in plain English.
              </p>
              <div className="mt-6 p-4 bg-blue-50/80 border border-blue-100 rounded-2xl max-w-sm">
                <div className="flex items-start gap-3 text-left">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-900 font-medium leading-relaxed">
                    I provide AI-powered explanations, not medical advice.
                    Always consult your dentist for treatment decisions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="bg-primary text-white rounded-2xl px-4 py-2.5 shadow-sm text-sm font-medium">
                    {msg.user_message}
                  </div>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm border-b-2 border-b-slate-200/50">
                    <p className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {msg.bot_response}
                    </p>
                    {msg.detection_context && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight mb-2">
                          Scan Context:
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {msg.detection_context.severity && (
                            <span className={`px-2.5 py-1 rounded-lg font-bold ${msg.detection_context.severity.toLowerCase() === 'severe'
                              ? 'bg-red-50 text-red-700'
                              : msg.detection_context.severity.toLowerCase() === 'moderate'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-emerald-50 text-emerald-700'
                              }`}>
                              {msg.detection_context.severity}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-bold">
                            {msg.detection_context.total_caries} caries found
                          </span>
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
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-slate-500 font-bold">Analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white/80 backdrop-blur-md">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your scan results..."
              disabled={isLoading}
              className="flex-1 rounded-xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-inner"
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="h-12 w-12 rounded-xl bg-primary hover:bg-blue-900 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
            Powered by DENTALAI Intelligence • AI responses can vary
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
