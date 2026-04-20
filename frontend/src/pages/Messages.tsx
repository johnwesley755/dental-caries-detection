import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { messagingService } from '../services/messagingService';
import type { Conversation, Message } from '../services/messagingService';
import { patientService } from '../services/patientService';
import type { Patient } from '../types/patient.types';
import { FileText, Image as ImageIcon, Download, X } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';
import { resolveImageUrl } from '../utils/imageUrl';

export const Messages: React.FC = () => {
    const location = useLocation();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [fileInputRef] = [useRef<HTMLInputElement>(null)];
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showPatientSelector, setShowPatientSelector] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const loadMessages = useCallback(async (conversationId: string) => {
        try {
            const data = await messagingService.getMessages(conversationId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleStartNewChat = useCallback(async (patient: Patient) => {
        const existingConv = conversations.find(c => c.other_user_id === patient.user_id);
        if (existingConv) {
            setSelectedConversation(existingConv);
        } else {
            const tempConv: Conversation = {
                id: 'new',
                patient_id: patient.id,
                dentist_id: currentUser.id,
                other_user_id: patient.user_id || '',
                other_user_name: patient.full_name,
                other_user_role: 'PATIENT',
                unread_count: 0
            };
            setSelectedConversation(tempConv);
            setMessages([]);
        }
        setShowPatientSelector(false);
        setShowMobileChat(true);
    }, [conversations, currentUser.id]);

    useEffect(() => {
        const init = async () => {
            try {
                const data = await messagingService.getConversations();
                setConversations(data);

                const searchParams = new URLSearchParams(location.search);
                const patientIdParam = searchParams.get('patientId');
                if (patientIdParam) {
                    const existingConv = data.find(c => c.other_user_id === patientIdParam);
                    if (existingConv) {
                        setSelectedConversation(existingConv);
                    } else {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    useEffect(() => {
        if (selectedConversation && selectedConversation.id !== 'new') {
            loadMessages(selectedConversation.id);
            if (window.innerWidth < 1024) {
                setShowMobileChat(true);
            }
        }
    }, [selectedConversation, loadMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

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

            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
            setSelectedFile(null);

            const data = await messagingService.getConversations();
            setConversations(data);

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

    const loadPatients = async () => {
        try {
            setLoadingPatients(true);
            const data = await patientService.getPatients();
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
        return resolveImageUrl(url) || '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-surface">
                <LoadingSpinner size="sm" />
            </div>
        );
    }

    const filteredConversations = conversations.filter(c =>
        c.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="flex-1 flex overflow-hidden">
                {/* Conversation List */}
                <section className={`
                    ${showMobileChat ? 'hidden' : 'flex'} 
                    lg:flex w-full lg:w-80 lg:min-w-[320px] bg-white border-r border-slate-100 flex-col overflow-hidden shrink-0
                `}>
                    <div className="p-4 lg:p-6 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900 font-headline">Messages</h2>
                        <button
                            onClick={() => {
                                if (!showPatientSelector) loadPatients();
                                setShowPatientSelector(!showPatientSelector);
                            }}
                            className={`p-2 rounded-lg transition-all ${showPatientSelector ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 hover:text-primary'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showPatientSelector ? 'close' : 'add_comment'}
                            </span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {showPatientSelector ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-4 bg-slate-50 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-400">Select Patient to Message</p>
                                </div>
                                {loadingPatients ? (
                                    <div className="p-12 text-center">
                                        <LoadingSpinner size="sm" />
                                    </div>
                                ) : patients.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-sm font-bold text-slate-400">No patients found</p>
                                    </div>
                                ) : (
                                    patients.map(patient => (
                                        <div
                                            key={patient.id}
                                            onClick={() => handleStartNewChat(patient)}
                                            className="p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all flex items-center gap-4 group"
                                        >
                                            <img
                                                className="w-10 h-10 rounded-xl object-cover shadow-sm bg-slate-100 border border-slate-200"
                                                src={`https://ui-avatars.com/api/?name=${patient.full_name}&background=dae2ff&color=003d9b&size=100`}
                                                alt={patient.full_name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-800 text-sm truncate">{patient.full_name}</h4>
                                                <p className="text-[11px] font-black text-primary">{patient.patient_id}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-3xl text-slate-200" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">Clear Inbox</h3>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Start a conversation to see it here.</p>
                                </div>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`p-5 cursor-pointer transition-all border-b border-slate-50 relative group ${selectedConversation?.id === conv.id
                                            ? 'bg-primary/5'
                                            : 'hover:bg-slate-50'
                                        }`}
                                >
                                    {selectedConversation?.id === conv.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="relative shrink-0">
                                            <img
                                                className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                                                src={`https://ui-avatars.com/api/?name=${conv.other_user_name}&background=003d9b&color=fff&size=100`}
                                                alt={conv.other_user_name}
                                            />
                                            {conv.unread_count > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-sm animate-bounce">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className={`text-sm font-bold truncate ${conv.unread_count > 0 ? 'text-blue-900' : 'text-slate-700'}`}>
                                                    {conv.other_user_name}
                                                </h3>
                                                {conv.last_message_at && (
                                                    <span className="text-[10px] font-bold text-slate-400 ml-2">
                                                        {formatDate(conv.last_message_at)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate transition-colors ${conv.unread_count > 0 ? 'text-primary font-bold' : 'text-slate-500 font-medium group-hover:text-slate-700'}`}>
                                                {conv.last_message || 'Start clinical update...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Active Chat Window */}
                <section className={`
                    ${showMobileChat ? 'flex' : 'hidden'} 
                    lg:flex flex-1 bg-surface flex-col overflow-hidden
                `}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 bg-white shadow-sm flex items-center justify-between z-10 shrink-0">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setShowMobileChat(false)}
                                        className="lg:hidden p-2 mr-2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <div className="relative">
                                        <img
                                            className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                            src={`https://ui-avatars.com/api/?name=${selectedConversation.other_user_name}&background=003d9b&color=fff&size=100`}
                                            alt={selectedConversation.other_user_name}
                                        />
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-base font-bold text-slate-900 leading-none">{selectedConversation.other_user_name}</h2>
                                        <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5" /> Active Patient
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>
                            </div>

                            {/* Chat Bubbles */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 bg-surface">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                        <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                                        <p className="text-sm font-medium">Start your secure conversation.</p>
                                    </div>
                                ) : (
                                    messages.map((message, index) => {
                                        const isOwn = message.sender_id === currentUser?.id;
                                        const prevMessage = index > 0 ? messages[index - 1] : null;
                                        const showDateHeader = !prevMessage ||
                                            new Date(message.created_at).toDateString() !== new Date(prevMessage.created_at).toDateString();

                                        return (
                                            <React.Fragment key={message.id}>
                                                {showDateHeader && (
                                                    <div className="flex justify-center mt-6 mb-4">
                                                        <span className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
                                                            {formatDate(message.created_at)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className={`flex items-end space-x-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                    {!isOwn && (
                                                        <img
                                                            className="w-6 h-6 rounded-full shrink-0"
                                                            src={`https://ui-avatars.com/api/?name=${selectedConversation.other_user_name}&background=003d9b&color=fff&size=50`}
                                                            alt="avatar"
                                                        />
                                                    )}
                                                    <div className={`max-w-[80%] ${isOwn ? 'order-1' : 'order-2'}`}>
                                                        <div className={`p-3 text-sm leading-relaxed ${isOwn
                                                                ? 'bg-primary text-white rounded-xl rounded-br-none shadow-md'
                                                                : 'bg-white rounded-xl rounded-bl-none shadow-sm text-slate-700 border border-slate-50'
                                                            }`}>
                                                            {message.content && <p>{message.content}</p>}
                                                            {message.detection_id && (
                                                              <div className={`mt-3 p-3 flex items-center justify-between rounded-xl border ${isOwn ? 'bg-white/10 border-white/20' : 'bg-primary/5 border-primary/10'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${isOwn ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                                                        <span className="material-symbols-outlined text-sm">health_and_safety</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className={`text-sm font-bold leading-none ${isOwn ? 'text-white' : 'text-primary'}`}>AI Scan Linked</p>
                                                                        <p className={`text-[10px] mt-1 font-medium ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>View analysis results</p>
                                                                    </div>
                                                                </div>
                                                                <a href={`/detection/${message.detection_id}`} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isOwn ? 'bg-white text-primary hover:bg-slate-100' : 'bg-primary text-white hover:bg-primary/90'}`}>
                                                                    Open
                                                                </a>
                                                              </div>
                                                            )}
                                                            {message.file_url && (
                                                                <div className="mt-2 w-full">
                                                                    {message.file_type?.startsWith('image/') ? (
                                                                        <div className="relative rounded-lg overflow-hidden border border-white/10 group">
                                                                            <img
                                                                                src={getFileUrl(message.file_url)}
                                                                                alt={message.file_name}
                                                                                className="rounded-lg max-w-full"
                                                                            />
                                                                            <a href={getFileUrl(message.file_url)} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Download className="text-white h-6 w-6" />
                                                                            </a>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={`border p-3 rounded-xl flex items-center justify-between ${isOwn ? 'bg-white/10 border-white/20' : 'bg-primary/5 border-primary/10'}`}>
                                                                            <div className="flex items-center overflow-hidden">
                                                                                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${isOwn ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                                                                    <span className="material-symbols-outlined">description</span>
                                                                                </div>
                                                                                <div className="ml-3 min-w-0">
                                                                                    <p className={`text-sm font-bold truncate ${isOwn ? 'text-white' : 'text-primary'}`}>{message.file_name}</p>
                                                                                    <p className={`text-[10px] font-medium ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>Document</p>
                                                                                </div>
                                                                            </div>
                                                                            <a href={getFileUrl(message.file_url)} target="_blank" rel="noopener noreferrer" className={`w-8 h-8 rounded-full ml-3 shrink-0 flex items-center justify-center transition-all ${isOwn ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                                                                <span className="material-symbols-outlined text-sm">download</span>
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`flex items-center mt-1 ${isOwn ? 'justify-end mr-1' : 'ml-1'}`}>
                                                            <span className="text-[10px] text-slate-400 mr-1">{formatTime(message.created_at)}</span>
                                                            {isOwn && (
                                                                <span className="material-symbols-outlined text-xs text-blue-500">
                                                                    {message.is_read ? 'done_all' : 'check'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Container */}
                            <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
                                {selectedFile && (
                                    <div className="mb-3 flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg max-w-sm">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded flex items-center justify-center shrink-0">
                                            {getFileIcon(selectedFile.type)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 flex-1 truncate">{selectedFile.name}</span>
                                        <button onClick={() => setSelectedFile(null)} className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2 ring-1 ring-slate-200 focus-within:ring-secondary/50 focus-within:bg-white transition-all">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                    />
                                    <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-primary transition-colors p-1">
                                        <span className="material-symbols-outlined">attach_file</span>
                                    </button>
                                    <input
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 text-slate-700"
                                        placeholder="Type clinic update..."
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={sending || (!newMessage.trim() && !selectedFile)}
                                        className="bg-primary text-white p-2 w-10 h-10 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center shadow-md shadow-primary/20"
                                    >
                                        {sending ? <LoadingSpinner size="sm" /> : <span className="material-symbols-outlined text-xl">send</span>}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-5xl text-slate-300">chat_bubble</span>
                            </div>
                            <h3 className="text-xl font-headline font-bold text-slate-800 mb-2">Select a conversation</h3>
                            <p className="text-slate-500 font-medium text-center max-w-sm">Choose a patient from the list on the left to start messaging.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
