import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api'; 
import type { User } from '../types/auth.types';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  Mail, 
  Building2, 
  MapPin, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const VerificationDashboard: React.FC = () => {
    const [dentists, setDentists] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<VerificationStatus>('PENDING');
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const loadDentists = useCallback(async () => {
        setIsLoading(true);
        try {
            const endpoint = activeTab === 'PENDING' ? '/admin/pending-dentists' : `/admin/dentists-by-status/${activeTab}`;
            const response = await api.get(endpoint);
            setDentists(response.data);
        } catch (err: unknown) {
            console.error('Failed to load dentists', err);
            toast.error('Failed to load verification requests');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadDentists();
    }, [loadDentists]);

    const handleVerify = async (userId: string) => {
        try {
            await api.post(`/admin/verify-dentist/${userId}`);
            toast.success('Dentist verified successfully');
            setDentists(prev => prev.filter(d => d.id !== userId));
        } catch (err: unknown) {
            console.error('Verification failed', err);
            toast.error('Verification failed');
        }
    };

    const handleReject = async () => {
        if (!showRejectModal || !rejectionReason.trim()) return;
        
        try {
            await api.post(`/admin/reject-dentist/${showRejectModal}?rejection_reason=${encodeURIComponent(rejectionReason)}`);
            toast.success('Dentist application rejected');
            setDentists(prev => prev.filter(d => d.id !== showRejectModal));
            setShowRejectModal(null);
            setRejectionReason('');
        } catch (err: unknown) {
            console.error('Rejection failed', err);
            toast.error('Failed to submit rejection');
        }
    };

    const StatusTab = ({ status, label, icon: Icon }: { status: VerificationStatus, label: string, icon: any }) => (
      <button
        onClick={() => setActiveTab(status)}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all relative overflow-hidden",
          activeTab === status 
            ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
        {activeTab === status && (
          <motion.div layoutId="tab-active" className="absolute inset-0 bg-slate-900 -z-10" />
        )}
      </button>
    );

    if (isLoading && dentists.length === 0) return <div className="min-h-screen bg-surface flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <TopNavBar title="Credential Verification" />
            
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2 text-left">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Clinical Governance</h1>
                        <p className="text-slate-500 font-bold text-xs opacity-60">Authentication protocols for neural diagnostic practitioners</p>
                    </div>

                    {/* Tabs / Segments */}
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start">
                      <StatusTab status="PENDING" label="Pending Review" icon={Clock} />
                      <StatusTab status="APPROVED" label="Verified" icon={CheckCircle2} />
                      <StatusTab status="REJECTED" label="Rejected" icon={XCircle} />
                    </div>
                </div>

                {/* Main Content Area */}
                {dentists.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[2.5rem] p-16 shadow-xl border border-slate-100 text-center flex flex-col items-center gap-6"
                    >
                        <div className={cn(
                          "w-20 h-20 rounded-3xl flex items-center justify-center",
                          activeTab === 'PENDING' ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"
                        )}>
                            <ShieldCheck className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-800">
                              {activeTab === 'PENDING' ? 'No Pending Requests' : `No ${activeTab.toLowerCase()} accounts`}
                            </h3>
                            <p className="text-slate-400 font-bold text-sm">
                              The secure clinical queue is currently at baseline.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {dentists.map((dentist) => (
                            <motion.div 
                              layout
                              key={dentist.id} 
                              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 hover:border-blue-200 transition-all group relative"
                            >
                                {/* Mini Status Badge for non-pending */}
                                {activeTab !== 'PENDING' && (
                                  <div className={cn(
                                    "absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                                    activeTab === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                                  )}>
                                    {activeTab}
                                  </div>
                                )}

                                <div className="flex items-center gap-5 mb-8">
                                    <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100 overflow-hidden shrink-0">
                                        {dentist.profile?.profile_image_url ? (
                                          <img src={dentist.profile.profile_image_url} alt={dentist.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-2xl font-black">{dentist.full_name[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <h3 className="font-bold text-slate-800 text-base truncate pr-16">{dentist.full_name}</h3>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold mt-1">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{dentist.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    {/* Credentials Card */}
                                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                                        <Award className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
                                        <div className="text-left font-bold flex-1 min-w-0">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">State License</p>
                                            <p className="text-sm text-slate-700 truncate">{dentist.profile?.license_number || 'N/A'}</p>
                                            <div className="flex gap-2 mt-2">
                                              <Badge className="bg-white text-slate-500 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                                                  {dentist.profile?.specialization || 'Clinical'}
                                              </Badge>
                                              {dentist.profile?.years_of_experience && (
                                                <Badge className="bg-white text-slate-500 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                                                  {dentist.profile?.years_of_experience}
                                                </Badge>
                                              )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clinical Info Group */}
                                    <div className="p-5 rounded-3xl bg-slate-100/30 border border-slate-100 space-y-3">
                                      <div className="flex items-center gap-3">
                                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span className="text-xs font-bold text-slate-600 truncate">{dentist.profile?.clinic_name || 'Personal Practice'}</span>
                                      </div>
                                      {dentist.profile?.phone_number && (
                                        <div className="flex items-center gap-3">
                                          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                          <span className="text-xs font-bold text-slate-600">{dentist.profile?.phone_number}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span className="text-xs font-bold text-slate-400 truncate">{dentist.profile?.clinic_address || 'Address Restricted'}</span>
                                      </div>
                                    </div>
                                </div>

                                {/* Rejection Reason if any */}
                                {activeTab === 'REJECTED' && dentist.profile?.rejection_reason && (
                                   <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl text-left">
                                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Rejection Log</p>
                                      <p className="text-xs text-red-700 italic">"{dentist.profile.rejection_reason}"</p>
                                   </div>
                                )}

                                {/* Action Bar */}
                                <div className="flex gap-4 mt-auto">
                                  {activeTab === 'PENDING' ? (
                                    <>
                                      <button
                                          onClick={() => handleVerify(dentist.id)}
                                          className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                      >
                                          <ShieldCheck className="h-4 w-4" />
                                          Authorize
                                      </button>
                                      <button
                                          onClick={() => setShowRejectModal(dentist.id)}
                                          className="w-12 h-12 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-sm"
                                          title="Decline Protocol"
                                      >
                                          <XCircle className="h-5 w-5" />
                                      </button>
                                    </>
                                  ) : (
                                    <button 
                                      className="w-full h-12 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100 flex items-center justify-center gap-2 cursor-default"
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                      Review History
                                    </button>
                                  )}
                                  
                                  {dentist.profile?.verification_documents_url && (
                                    <a 
                                      href={dentist.profile.verification_documents_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="h-12 w-12 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm"
                                      title="View Credentials Document"
                                    >
                                      <FileText className="h-5 w-5" />
                                    </a>
                                  )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            <AnimatePresence>
              {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowRejectModal(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8"
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-slate-800">Decline Application</h3>
                        <p className="text-xs text-slate-400 font-bold">Provide valid clinical feedback</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-500 uppercase ml-1">Rejection Reason</label>
                        <textarea 
                          className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:outline-none transition-all placeholder:text-slate-300"
                          placeholder="e.g. License document is expired or unreadable"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button 
                          onClick={() => setShowRejectModal(null)}
                          className="flex-1 h-12 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleReject}
                          disabled={!rejectionReason.trim()}
                          className="flex-1 h-12 bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
        </div>
    );
};

export default VerificationDashboard;
