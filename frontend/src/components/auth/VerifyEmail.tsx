// frontend/src/components/auth/VerifyEmail.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    Mail,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check for token in URL or email in state (from Login redirect)
    const urlToken = searchParams.get('token');
    const initialEmail = location.state?.email || '';

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'input'>('loading');
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const verifyWithToken = async () => {
            if (urlToken) {
                setStatus('loading');
                try {
                    await authService.verifyEmail(urlToken);
                    setStatus('success');
                    toast.success('Email successfully verified!');
                } catch (err: unknown) {
                    const error = err as { response?: { data?: { detail?: string } } };
                    setStatus('error');
                    setError(error.response?.data?.detail || 'Verification failed. The link may have expired.');
                }
            } else if (initialEmail) {
                setStatus('input');
            } else {
                setStatus('error');
                setError('No verification method provided. Please log in again.');
            }
        };

        verifyWithToken();
    }, [urlToken, initialEmail]);

    // Handle OTP Input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleManualVerify = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setStatus('loading');
        try {
            await authService.verifyEmail(fullOtp);
            setStatus('success');
            toast.success('Secure Verification Complete');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { detail?: string } } };
            setStatus('input');
            toast.error(error.response?.data?.detail || 'Invalid or expired code');
        }
    };

    const handleResend = async () => {
        if (!initialEmail) return;
        setIsResending(true);
        try {
            await authService.resendVerification(initialEmail);
            toast.success('A new secure code has been sent to your inbox');
        } catch {
            toast.error('Could not resend code. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 isolate font-sans">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[480px] w-full bg-white border border-slate-100 shadow-[20px_40px_80px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-10 lg:p-14 text-center space-y-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600" />

                <AnimatePresence mode="wait">
                    {status === 'loading' && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100">
                                    <LoadingSpinner size="sm" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verifying Credentials</h1>
                                <p className="text-slate-500 font-bold">Please wait while we validate your staff access security token.</p>
                            </div>
                        </motion.div>
                    )}

                    {status === 'input' && (
                        <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="space-y-4">
                                <div className="h-20 w-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto shadow-xl shadow-blue-900/5 ring-1 ring-blue-100">
                                    <Mail className="h-10 w-10" />
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Check Your Inbox</h1>
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                        We've sent a 6-digit clinical verification code to <br />
                                        <span className="text-blue-600 underline font-black">{initialEmail}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-full aspect-square text-2xl font-black text-center bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-blue-900 shadow-sm"
                                    />
                                ))}
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleManualVerify}
                                    className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Verify & Access Portal
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                                
                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        onClick={handleResend}
                                        disabled={isResending}
                                        className="text-sm font-black text-blue-600 hover:text-blue-700 flex items-center gap-2 group disabled:opacity-50"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
                                        {isResending ? 'Sending Code...' : "Didn't receive a code? Resend"}
                                    </button>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                                    >
                                        Return to Login screen
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-900/5">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Identity Confirmed</h1>
                                <p className="text-slate-500 font-bold leading-relaxed px-4 text-center">Your staff account has been successfully verified. Access to clinical systems is now granted.</p>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full h-16 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                            >
                                Enter Clinical Portal
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-[2rem] bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-2xl shadow-red-900/5">
                                    <XCircle className="h-12 w-12" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Access Blocked</h1>
                                <div className="p-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-left">
                                    <AlertCircle className="h-6 w-6 shrink-0" />
                                    <p className="font-bold leading-relaxed">{error}</p>
                                </div>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed px-4">The security token has expired or is invalid. Please return to login to request a fresh verification link.</p>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 transition-all"
                            >
                                Return to Credentials Screen
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
