// patient-portal/src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

export const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setError('Missing verification token.');
                return;
              }

            try {
                await authService.verifyEmail(token);
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setError(err.response?.data?.detail || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-8 isolate">
            <div className="absolute inset-0 -z-10 h-full w-full opacity-30"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-[480px] w-full bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-10 lg:p-12 text-center space-y-10"
            >
                {status === 'loading' && (
                    <div className="space-y-8 animate-in fade-in duration-700">
                        <div className="flex justify-center">
                            <div className="h-24 w-24 rounded-[2rem] bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                                <LoadingSpinner size="md" />
                            </div>
                        </div>
                        <div className="space-y-3">
                           <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Verifying</h1>
                           <p className="text-slate-500 font-bold tracking-tight">Syncing with clinical servers...</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
                        <div className="flex justify-center">
                            <div className="h-24 w-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner ring-1 ring-emerald-100">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-3">
                          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Email Verified</h1>
                          <p className="text-slate-500 font-bold tracking-tight leading-relaxed">Your account is now fully activated. You can now access all clinical features.</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 rounded-2xl bg-primary text-white font-black text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:bg-blue-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Continue to Login
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
                        <div className="flex justify-center">
                            <div className="h-24 w-24 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 shadow-inner ring-1 ring-red-100">
                                <XCircle className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-4">
                          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Access Denied</h1>
                          <div className="p-4 bg-red-50/50 border border-red-100/50 rounded-2xl flex items-start gap-3 text-left">
                              <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-red-700 leading-relaxed">{error}</p>
                          </div>
                          <p className="text-slate-400 font-bold text-sm leading-relaxed px-4">This link may be expired or tampered with. Please request a new verification token from your dashboard.</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] hover:bg-slate-50 transition-all"
                        >
                            Return to Login
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
