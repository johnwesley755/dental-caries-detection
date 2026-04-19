// frontend/src/components/auth/VerifyEmail.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    Mail,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    ShieldCheck,
    Stethoscope,
    Activity,
    Smile
} from 'lucide-react';
import { toast } from 'sonner';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.slice(0, 6).split('');
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            const lastIndex = Math.min(index + pastedData.length, 5);
            inputRefs.current[lastIndex]?.focus();
            return;
        }

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
        <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
            
            {/* =======================
                LEFT SIDE - FORM 
               ======================= */}
            <div className="relative flex items-center justify-center p-4 lg:p-8 isolate">
                
                {/* --- BACKGROUND LAYERS --- */}
                <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 mix-blend-multiply blur-[90px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                            x: [0, -30, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-200/40 mix-blend-multiply blur-[90px]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[500px]"
                >
                    <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-[2.5rem] p-10 lg:p-14 space-y-8 relative overflow-hidden">
                        
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400" />

                        <AnimatePresence mode="wait">
                            {status === 'loading' && (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10 text-center py-4">
                                    <div className="flex justify-center">
                                        <div className="h-24 w-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100">
                                            <LoadingSpinner size="sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verifying Credentials</h1>
                                        <p className="text-slate-500 font-bold leading-relaxed px-4">Establishing a secure connection to the clinical database. Please wait...</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'input' && (
                                <motion.div key="input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                                    <div className="space-y-4 text-center">
                                        <div className="h-20 w-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto shadow-xl shadow-blue-900/5 ring-1 ring-blue-100">
                                            <Mail className="h-10 w-10" />
                                        </div>
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Check Your Inbox</h1>
                                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                            <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                                We've sent a 6-digit clinical verification code to <br />
                                                <span className="text-blue-600 underline font-black text-base">{initialEmail}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => { inputRefs.current[index] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-full aspect-square text-3xl font-black text-center bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-blue-900 shadow-sm"
                                            />
                                        ))}
                                    </div>

                                    <div className="space-y-5">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleManualVerify}
                                            className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all"
                                        >
                                            Verify & Access Portal
                                            <ArrowRight className="h-5 w-5" />
                                        </motion.button>
                                        
                                        <div className="flex flex-col items-center gap-6 pt-4 border-t border-slate-100">
                                            <button
                                                onClick={handleResend}
                                                disabled={isResending}
                                                className="text-sm font-black text-blue-600 hover:text-blue-700 flex items-center gap-2 group disabled:opacity-50"
                                            >
                                                <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
                                                {isResending ? 'Resending Code...' : "Didn't receive a code? Resend"}
                                            </button>
                                            <Link 
                                                to="/login"
                                                className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2"
                                            >
                                                <ArrowLeft className="h-3 w-3" />
                                                Return to Login screen
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center py-4">
                                    <div className="flex justify-center">
                                        <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-900/5">
                                            <CheckCircle2 className="h-12 w-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Identity Confirmed</h1>
                                        <p className="text-slate-500 font-bold leading-relaxed px-4">Your clinical account has been successfully verified. Secure access is now active.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full h-16 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all font-sans"
                                    >
                                        Enter Clinical Portal
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-24 w-24 rounded-[2.5rem] bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-2xl shadow-red-900/5">
                                            <XCircle className="h-12 w-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center">Access Blocked</h1>
                                        <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-left">
                                            <AlertCircle className="h-6 w-6 shrink-0" />
                                            <p className="font-black leading-relaxed">{error}</p>
                                        </div>
                                        <p className="text-slate-500 font-bold text-sm leading-relaxed px-4">Security session failed. Please return to credentials screen to re-authenticate.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 transition-all"
                                    >
                                        Return to Credentials screen
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* =======================
                RIGHT SIDE - IMAGE
               ======================= */}
            <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
                        alt="Medical Lab"
                        className="h-full w-full object-cover opacity-50 scale-105 saturate-50"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-slate-900/90 to-slate-950/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent opacity-30" />
                </div>

                {/* Branding */}
                <div className="relative z-20 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <Stethoscope className="h-6 w-6 text-blue-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">DentAI<span className="text-blue-400">Portal</span></span>
                        <span className="text-xs font-bold text-blue-200/60 uppercase tracking-tighter">Security & Verification</span>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="relative z-20 mt-auto max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 p-10 shadow-2xl"
                    >
                        <div className="mb-6 text-blue-300">
                            <Activity className="h-8 w-8" />
                        </div>
                        <p className="text-xl font-light leading-relaxed text-slate-100 mb-8 italic">
                            "The platform's security architecture ensures that clinician workflows remain uninterrupted while maintaining the highest medical data standards."
                        </p>
                        <footer className="flex items-center justify-between border-t border-white/10 pt-8 mt-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg">DS</div>
                                <div>
                                    <div className="text-sm font-black text-white">Dr. Sarah Danvers</div>
                                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Clinical Security Officer</div>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-slate-400 bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md uppercase">Authorized Staff Only</div>
                        </footer>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
