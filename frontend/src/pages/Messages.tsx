import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import type { Conversation, Message } from '../services/messagingService';
import { MessageCircle, Send, Paperclip, X, FileText, Image as ImageIcon, Download, Loader2, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
export const Messages: React.FC = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Load conversations on mount
  useEffect(() => {
    const init = async () => {
      try {
        const data = await messagingService.getConversations();
        setConversations(data);

        // Handle patientId from URL
        const searchParams = new URLSearchParams(location.search);
        const patientIdParam = searchParams.get('patientId');
        if (patientIdParam) {
          const existingConv = data.find(c => c.other_user_id === patientIdParam);
          if (existingConv) {
            setSelectedConversation(existingConv);
          } else {
            // Fetch patient details to start a new chat if ID is provided
            const { patientService } = await import('../services/patientService');
            const patient = await patientService.getPatient(patientIdParam);
            if (patient && patient.user_id) {
              handleStartNewChat(patient);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
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

  const handleStartNewChat = async (patient: any) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.other_user_id === patient.user_id);
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      // Create a temporary conversation object
      const tempConv: Conversation = {
        id: 'new',
        patient_id: patient.id,
        dentist_id: currentUser.id,
        other_user_id: patient.user_id,
        other_user_name: patient.full_name,
        other_user_role: 'PATIENT',
        unread_count: 0
      };
      setSelectedConversation(tempConv);
      setMessages([]);
    }
    setShowPatientSelector(false);
  };

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const { patientService } = await import('../services/patientService');
      const data = await patientService.getPatients();
      // Only show patients that have a linked user account
      setPatients(data.filter(p => p.user_id));
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoadingPatients(false);
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patient Messages</h2>
            <p className="text-sm text-gray-500 mt-1">Chat with your patients</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (!showPatientSelector) loadPatients();
              setShowPatientSelector(!showPatientSelector);
            }}
            className={showPatientSelector ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}
          >
            {showPatientSelector ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {showPatientSelector ? (
            <div className="animate-in fade-in slide-in-from-left-2 duration-200">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select a patient</p>
              </div>
              {loadingPatients ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
                </div>
              ) : patients.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">No patients found</p>
                </div>
              ) : (
                patients.map(patient => (
                  <div
                    key={patient.id}
                    onClick={() => handleStartNewChat(patient)}
                    className="p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.full_name}</h4>
                        <p className="text-xs text-gray-500">{patient.patient_id}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedConversation?.id === conv.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{conv.other_user_name}</h3>
                      {conv.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {conv.last_message || 'No messages yet'}
                    </p>
                  </div>
                  {conv.last_message_at && (
                    <span className="text-xs text-gray-400">
                      {formatDate(conv.last_message_at)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">{selectedConversation.other_user_name}</h3>
              <p className="text-sm text-gray-500">Patient • {selectedConversation.id === 'new' ? 'Start a new conversation' : 'Active conversation'}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === currentUser?.id;
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                      >
                        {message.content && <p className="text-sm">{message.content}</p>}

                        {message.file_url && (
                          <div className="mt-2">
                            {message.file_type?.startsWith('image/') ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${message.file_url}`}
                                alt={message.file_name}
                                className="rounded-lg max-w-xs"
                              />
                            ) : (
                              <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${message.file_url}`}
                                download={message.file_name}
                                className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-blue-700' : 'bg-gray-50'
                                  }`}
                              >
                                {getFileIcon(message.file_type)}
                                <span className="text-sm">{message.file_name}</span>
                                <Download className="h-4 w-4 ml-auto" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {selectedFile && (
                <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  {getFileIcon(selectedFile.type)}
                  <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={1}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={sending || (!newMessage.trim() && !selectedFile)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a patient to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
