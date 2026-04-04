import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import type { Conversation, Message } from '../services/messagingService';
import { MessageCircle, Send, Paperclip, X, FileText, Image as ImageIcon, Download, Search, UserCircle, Check, CheckCheck, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { patientService } from '../services/patientService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
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

  const [dentists, setDentists] = useState<any[]>([]);
  const [isLoadingDentists, setIsLoadingDentists] = useState(false);
  const [showDentistSelector, setShowDentistSelector] = useState(false);
  const [linkedDetectionId, setLinkedDetectionId] = useState<string | null>(null);

  const [detections, setDetections] = useState<any[]>([]);
  const [showDetectionSelector, setShowDetectionSelector] = useState(false);

  useEffect(() => {
    loadInitialData();
    loadDentists();
    loadDetections();
  }, []);

  const loadDetections = async () => {
    try {
      const data = await patientService.getMyDetections();
      setDetections(data);
    } catch (error) {
      console.error('Failed to load detections', error);
    }
  };

  // Handle navigation state
  useEffect(() => {
    if (location.state?.dentistId && !loading && conversations.length > 0) {
      handleStartNewChat(location.state.dentistId);
      if (location.state.detectionId) {
        setLinkedDetectionId(location.state.detectionId);
      }
      // Clear state after handling
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loading, conversations]);

  const loadDentists = async () => {
    try {
      setIsLoadingDentists(true);
      const data = await messagingService.getDentists();
      setDentists(data);
    } catch (error) {
      console.error('Failed to load dentists:', error);
    } finally {
      setIsLoadingDentists(false);
    }
  };

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

  const handleStartNewChat = async (dentistId?: string) => {
    const targetDentistId = dentistId || patientInfo?.created_by;

    if (!targetDentistId) {
      setShowDentistSelector(true);
      return;
    }

    // Check if conversation already exists
    const existingConv = conversations.find(c => c.other_user_id === targetDentistId);
    if (existingConv) {
      setSelectedConversation(existingConv);
      setShowDentistSelector(false);
    } else {
      // Find the dentist name if we have the list
      const dentist = dentists.find(d => d.id === targetDentistId);

      // Create a temporary conversation object
      const tempConv: Conversation = {
        id: 'new',
        patient_id: user?.id || '',
        dentist_id: targetDentistId,
        other_user_id: targetDentistId,
        other_user_name: dentist?.full_name || patientInfo?.created_by_name || "Specialist",
        other_user_role: 'DENTIST',
        unread_count: 0
      };
      setSelectedConversation(tempConv);
      setMessages([]);
      setShowDentistSelector(false);
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

      const detectionId = linkedDetectionId;

      if (selectedFile) {
        sentMessage = await messagingService.sendMessageWithFile(
          selectedConversation.other_user_id,
          selectedFile,
          newMessage.trim() || undefined,
          detectionId || undefined
        );
      } else {
        sentMessage = await messagingService.sendMessage({
          receiver_id: selectedConversation.other_user_id,
          content: newMessage.trim(),
          detection_id: detectionId || undefined
        });
      }

      setMessages([...messages, sentMessage]);
      setNewMessage('');
      setSelectedFile(null);
      setLinkedDetectionId(null); // Clear linked detection after sending

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

  const getFileUrl = (url: string) => {
    if (!url) return '';
    let finalUrl = '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      finalUrl = url.startsWith('//') ? `https:${url}` : url;
    } else {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      finalUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return finalUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="md" />
          <p className="text-slate-500 font-bold tracking-tight">Syncing conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-slate-50/50 overflow-hidden">
      {/* Conversations List */}
      <div className={`
        ${showMobileChat ? 'hidden' : 'flex'} 
        lg:flex w-full lg:w-96 bg-white border-r border-slate-200/60 flex-col shadow-sm relative z-10
      `}>
        <div className="p-8 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
             <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-blue-100 shadow-inner">
                {conversations.length}
             </div>
          </div>
          <p className="text-sm text-slate-400 font-bold tracking-tight mt-1">Clinical Chat History</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/30">
          {conversations.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-blue-100">
                <MessageCircle className="h-10 w-10 text-primary opacity-40 shrink-0" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No messages yet</h3>
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-8 px-6">Your clinical message history with specialists will appear here.</p>
              <Button
                onClick={() => handleStartNewChat()}
                className="bg-primary hover:bg-blue-900 text-white px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest transition-all hover:scale-105"
              >
                Find Specialist
              </Button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-5 mx-3 my-2 rounded-[1.5rem] cursor-pointer transition-all duration-300 group border ${selectedConversation?.id === conv.id
                  ? 'bg-white shadow-xl shadow-blue-900/5 border-blue-100 ring-2 ring-primary/5'
                  : 'bg-transparent border-transparent hover:bg-white hover:shadow-lg hover:shadow-slate-200/50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${selectedConversation?.id === conv.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-primary'}`}>
                     <UserCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-slate-900 truncate tracking-tight text-sm uppercase">{conv.other_user_name}</h3>
                      {conv.last_message_at && (
                        <span className="text-[10px] font-black text-slate-400 whitespace-nowrap ml-2 opacity-60">
                          {formatDate(conv.last_message_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs truncate font-bold ${conv.unread_count > 0 ? 'text-primary' : 'text-slate-400'}`}>
                        {conv.last_message || 'Start a new conversation'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg ml-2 flex-shrink-0 shadow-lg shadow-primary/20 animate-pulse transition-all">
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
        lg:flex flex-1 flex-col bg-white h-full relative shadow-2xl z-0
      `}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-6 flex items-center gap-5 sticky top-0 z-20">
              <button
                onClick={() => setShowMobileChat(false)}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-primary transition-all bg-slate-50 rounded-xl"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                 <UserCircle className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-900 truncate tracking-tight text-lg uppercase">{selectedConversation.other_user_name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Online & Verified</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 bg-slate-50/50 no-scrollbar">
              {messages.map((message, index) => {
                const isOwn = message.sender_id === user?.id;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showDateHeader = !prevMessage || 
                  new Date(message.created_at).toDateString() !== new Date(prevMessage.created_at).toDateString();

                return (
                  <React.Fragment key={message.id}>
                    {showDateHeader && (
                      <div className="flex justify-center my-10">
                        <div className="bg-white px-5 py-2 rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[85%] lg:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col group`}>
                        <div
                          className={`rounded-[1.75rem] px-5 py-3.5 shadow-sm transition-all duration-300 ${isOwn
                            ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none font-bold'
                            }`}
                        >
                          {message.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}

                          {message.detection_id && (
                            <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-4 glass transition-all hover:scale-[1.02] ${isOwn ? 'bg-white/10 border-white/20' : 'bg-emerald-50/80 border-emerald-100'}`}>
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${isOwn ? 'bg-white/20' : 'bg-white border border-emerald-100 shadow-sm'}`}>
                                  <Activity className={`h-5 w-5 ${isOwn ? 'text-white' : 'text-emerald-500'}`} />
                                </div>
                                <div>
                                  <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isOwn ? 'text-white' : 'text-emerald-900'}`}>AI Analysis Linked</p>
                                  <p className={`text-xs font-bold ${isOwn ? 'text-blue-100' : 'text-emerald-600'}`}>Clinical findings shared</p>
                                </div>
                              </div>
                              <a 
                                 href={`/detection/${message.detection_id}`} 
                                 className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${isOwn ? 'bg-white text-primary hover:bg-blue-50 shadow-lg' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl'}`}
                              >
                                Open Scan
                              </a>
                            </div>
                          )}

                          {message.file_url && (
                            <div className="mt-4">
                              {message.file_type?.startsWith('image/') ? (
                                <div className="relative group/img overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
                                  <img
                                    src={getFileUrl(message.file_url)}
                                    alt={message.file_name}
                                    className="max-w-full rounded-2xl transition-transform duration-500 group-hover/img:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/20 transition-all flex items-center justify-center">
                                    <a
                                      href={getFileUrl(message.file_url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-12 h-12 bg-white/90 backdrop-blur rounded-2xl opacity-0 scale-75 group-hover/img:opacity-100 group-hover/img:scale-100 transition-all flex items-center justify-center shadow-2xl"
                                    >
                                      <Download className="h-6 w-6 text-primary" />
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <a
                                  href={getFileUrl(message.file_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all border shadow-sm group/file ${isOwn ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold' : 'bg-white border-slate-100 text-slate-800 hover:border-primary/20 font-bold'
                                    }`}
                                >
                                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isOwn ? 'bg-white/20 text-white' : 'bg-blue-50 text-primary shadow-inner'}`}>
                                    {getFileIcon(message.file_type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black truncate uppercase tracking-tight">{message.file_name}</p>
                                    <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Download Material</p>
                                  </div>
                                  <Download className="h-4 w-4 opacity-40 group-hover/file:opacity-100 group-hover/file:translate-y-0.5 transition-all" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-opacity">
                            {formatTime(message.created_at)}
                          </span>
                          {isOwn && (
                            <div className="flex items-center">
                              {message.is_read ? (
                                <CheckCheck className="h-4 w-4 text-primary" strokeWidth={3} />
                              ) : (
                                <Check className="h-4 w-4 text-slate-300" strokeWidth={3} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="bg-white border-t border-slate-100 p-6 lg:p-10 bg-white/80 backdrop-blur-xl">
              {linkedDetectionId && (
                <div className="mb-4 flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-950 uppercase tracking-tight leading-none mb-1">AI Scan Linked</p>
                      <p className="text-[10px] text-emerald-600 font-bold">Analysis results will be attached to your next message.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLinkedDetectionId(null)}
                    className="p-2 text-emerald-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {selectedFile && (
                <div className="mb-4 flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-inner border border-blue-100">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-primary truncate uppercase tracking-tight leading-none mb-1">{selectedFile.name}</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Material Attachment Ready</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 text-blue-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-3 max-w-6xl mx-auto">
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
                  className="p-3 h-12 w-12 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-blue-50/50 transition-all rounded-xl border-slate-200"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDetectionSelector(true)}
                  className="p-3 h-12 w-12 text-emerald-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all rounded-xl border-slate-200"
                  title="Attach AI Scan"
                >
                  <Activity className="h-5 w-5" />
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
                    placeholder="Type a clinical message..."
                    className="w-full resize-none border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all min-h-[52px] max-h-[150px] bg-slate-50 focus:bg-white shadow-inner font-bold text-sm"
                    rows={1}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={sending || (!newMessage.trim() && !selectedFile)}
                  className="h-12 w-12 bg-primary text-white rounded-2xl hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                >
                  {sending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest mt-6 opacity-60">
                End-to-End Encrypted Health Messaging
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-10 bg-slate-50/30">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-900/5 border border-slate-100 ring-1 ring-blue-50/50">
                <MessageCircle className="h-12 w-12 text-primary/40 shrink-0" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase">Dental Workspace</h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-10 px-8">
                Connect directly with our clinical board for AI scan reviews, consultations, and ongoing dental support.
              </p>
              <Button
                onClick={() => handleStartNewChat()}
                className="bg-primary hover:bg-blue-900 text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Find Specialist
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Specialist Selector Modal */}
      {showDentistSelector && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-6 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_40px_100px_-20px_rgba(30,58,138,0.25)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary text-white">
              <div>
                <h3 className="text-2xl font-black tracking-tight leading-none">Select Specialist</h3>
                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mt-2">Verified Professional Board</p>
              </div>
              <button
                onClick={() => setShowDentistSelector(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/30">
              {isLoadingDentists ? (
                <div className="text-center py-16 space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-8 border-blue-50 rounded-full"></div>
                    <LoadingSpinner size="lg" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Scanning clinical directory...</p>
                </div>
              ) : dentists.length === 0 ? (
                <div className="text-center py-16 px-10">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                    <UserCircle className="h-12 w-12" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">No Specialists Found</h4>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed px-4">
                    Clinical onboarding is in progress. Please check back later.
                  </p>
                </div>
              ) : (
                dentists.map((dentist) => (
                  <div
                    key={dentist.id}
                    onClick={() => handleStartNewChat(dentist.id)}
                    className="p-6 bg-white border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-primary/20 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary font-black text-xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-primary/20">
                        {dentist.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 tracking-tight text-lg leading-none">{dentist.full_name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <ShieldCheck className="h-3 w-3 text-primary" />
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Board Certified</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <Send className="h-4 w-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detection Selection Modal */}
      {showDetectionSelector && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-6 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_40px_100px_-20px_rgba(16,185,129,0.25)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-emerald-100 flex items-center justify-between bg-emerald-600 text-white">
              <div>
                <h3 className="text-2xl font-black tracking-tight leading-none">Attach AI Scan</h3>
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-2">Personal Diagnostic History</p>
              </div>
              <button
                onClick={() => setShowDetectionSelector(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/30">
              {detections.length === 0 ? (
                <div className="text-center py-16 px-10">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                    <Activity className="h-12 w-12" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">No Scans Found</h4>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed px-4">
                    You haven't uploaded any dental AI scans for analysis yet.
                  </p>
                </div>
              ) : (
                detections.map((det) => (
                  <div
                    key={det.id}
                    onClick={() => {
                        setLinkedDetectionId(det.id);
                        setShowDetectionSelector(false);
                    }}
                    className="p-6 bg-white border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-emerald-600/20">
                        <Search className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 tracking-tight text-lg leading-none">Scan #{det.detection_id.substring(0, 8)}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <Activity className="h-3 w-3 text-emerald-500" />
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(det.detection_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                       <Paperclip className="h-4 w-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
