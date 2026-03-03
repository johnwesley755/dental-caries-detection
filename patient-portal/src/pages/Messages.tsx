import React, { useState, useEffect, useRef } from 'react';
import { messagingService } from '../services/messagingService';
import type { Conversation, Message } from '../services/messagingService';
import { MessageCircle, Send, Paperclip, X, FileText, Image as ImageIcon, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { patientService } from '../services/patientService';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [convs, info] = await Promise.all([
        messagingService.getConversations(),
        patientService.getMyInfo()
      ]);
      setConversations(convs);
      setPatientInfo(info);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation && selectedConversation.id !== 'new') {
      loadMessages(selectedConversation.id);
      if (window.innerWidth < 1024) {
        setShowMobileChat(true);
      }
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await messagingService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleStartNewChat = async () => {
    if (!patientInfo?.created_by) {
      toast.error("No assigned dentist found. Please contact support.");
      return;
    }

    // Check if conversation already exists
    const existingConv = conversations.find(c => c.other_user_id === patientInfo.created_by);
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      // Create a temporary conversation object
      const tempConv: Conversation = {
        id: 'new',
        patient_id: user?.id || '',
        dentist_id: patientInfo.created_by,
        other_user_id: patientInfo.created_by,
        other_user_name: patientInfo.created_by_name || "Your Dentist",
        other_user_role: 'DENTIST',
        unread_count: 0
      };
      setSelectedConversation(tempConv);
      setMessages([]);
      if (window.innerWidth < 1024) {
        setShowMobileChat(true);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || (!newMessage.trim() && !selectedFile)) return;

    try {
      setSending(true);
      let sentMessage: Message;

      if (selectedFile) {
        sentMessage = await messagingService.sendMessageWithFile(
          selectedConversation.other_user_id,
          selectedFile,
          newMessage.trim() || undefined
        );
      } else {
        sentMessage = await messagingService.sendMessage({
          receiver_id: selectedConversation.other_user_id,
          content: newMessage.trim(),
        });
      }

      setMessages([...messages, sentMessage]);
      setNewMessage('');
      setSelectedFile(null);

      // Refresh conversations
      const data = await messagingService.getConversations();
      setConversations(data);

      // If it was a new conversation, select the real one
      if (selectedConversation.id === 'new') {
        const newConv = data.find(c => c.other_user_id === selectedConversation.other_user_id);
        if (newConv) {
          setSelectedConversation(newConv);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-5 w-5" />;
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex bg-gray-50 overflow-hidden">
      {/* Conversations List */}
      <div className={`
        ${showMobileChat ? 'hidden' : 'flex'} 
        lg:flex w-full lg:w-80 bg-white border-r border-gray-200 flex-col
      `}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500 mt-1">Chat with your dental team</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-500 mb-6">Your message history with your dentist will appear here.</p>
              <Button
                onClick={handleStartNewChat}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Find Dentist
              </Button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${selectedConversation?.id === conv.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.other_user_name}</h3>
                      {conv.last_message_at && (
                        <span className="text-[10px] uppercase font-bold text-gray-400 whitespace-nowrap ml-2">
                          {formatDate(conv.last_message_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm mt-1 truncate ${conv.unread_count > 0 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        {conv.last_message || 'No messages yet'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0 animate-pulse">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`
        ${showMobileChat ? 'flex' : 'hidden'} 
        lg:flex flex-1 flex-col bg-white h-full relative
      `}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
              <button
                onClick={() => setShowMobileChat(false)}
                className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{selectedConversation.other_user_name}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-xs text-gray-500">Online now</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-[#f8fbff]">
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] lg:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col group`}>
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${isOwn
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-100 text-gray-900 rounded-tl-none'
                          }`}
                      >
                        {message.content && <p className="text-sm leading-relaxed">{message.content}</p>}

                        {message.file_url && (
                          <div className="mt-3">
                            {message.file_type?.startsWith('image/') ? (
                              <div className="relative group/img overflow-hidden rounded-lg">
                                <img
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${message.file_url}`}
                                  alt={message.file_name}
                                  className="max-w-full rounded-lg transition-transform duration-300 group-hover/img:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                                  <a
                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${message.file_url}`}
                                    download
                                    className="p-2 bg-white/90 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                                  >
                                    <Download className="h-4 w-4 text-blue-600" />
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${message.file_url}`}
                                download={message.file_name}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isOwn ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-900 border border-blue-100'
                                  }`}
                              >
                                <div className={`p-2 rounded-lg ${isOwn ? 'bg-blue-800' : 'bg-white shadow-sm'}`}>
                                  {getFileIcon(message.file_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold truncate">{message.file_name}</p>
                                  <p className="text-[10px] opacity-70">Download File</p>
                                </div>
                                <Download className="h-4 w-4 opacity-50" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 lg:p-6 pb-8">
              {selectedFile && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-900 truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-blue-600">Attachment Ready</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-white rounded-full transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-3 max-w-5xl mx-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 h-10 w-10 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all rounded-xl"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                        (e.target as HTMLTextAreaElement).style.height = 'auto';
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full resize-none border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[44px] max-h-[150px] bg-gray-50 focus:bg-white shadow-inner"
                    rows={1}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={sending || (!newMessage.trim() && !selectedFile)}
                  className="h-10 w-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-50">
                <MessageCircle className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Dental Chat</h3>
              <p className="text-gray-500 leading-relaxed">
                Connect directly with your specialist for consultations and support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
