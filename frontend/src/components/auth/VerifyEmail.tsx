// frontend/src/components/auth/VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
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
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[500px] w-full bg-white border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 text-center space-y-8"
            >
                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <LoadingSpinner size="sm" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Verifying Identity</h1>
                        <p className="text-slate-500">Please wait while we securely verify your credentials.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-500 shadow-sm">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Verification Complete</h1>
                        <p className="text-slate-500">Your account has been successfully verified. You can now access the staff portal.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-all shadow-slate-900/10"
                        >
                            Access Portal
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                                <XCircle className="h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Verification Failed</h1>
                        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                        <p className="text-slate-500 text-sm">The security token may have expired or is invalid. Please try logging in to request a new verification link.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                        >
                            Return to Login
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
