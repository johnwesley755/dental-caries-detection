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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 isolate">
            <div className="absolute inset-0 -z-10 h-full w-full opacity-30"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[500px] w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-10 text-center space-y-8"
            >
                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                <LoadingSpinner size="sm" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Verifying Email</h1>
                        <p className="text-slate-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Email Verified!</h1>
                        <p className="text-slate-500">Your email has been successfully verified. You can now access all features of the patient portal.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all shadow-xl shadow-teal-500/30"
                        >
                            Go to Login
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                <XCircle className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Verification Failed</h1>
                        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                        <p className="text-slate-500">The link may have expired or is invalid. Please try logging in to resend the verification email.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
