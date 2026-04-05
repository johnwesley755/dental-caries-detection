// patient-portal/src/pages/VerifyEmail.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    ArrowLeft, 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle,
    Mail,
    Stethoscope,
    Smile,
    ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const message = location.state?.message;
    const detectionId = location.state?.detectionId;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    useEffect(() => {
        if (!email) {
            // If accessed directly without an email in state, redirect to register
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.slice(0, 6).split('');
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            const lastIndex = Math.min(index + pastedData.length, 5);
            inputRefs[lastIndex].current?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.verifyOtp(email, otpCode);
            toast.success('Email verified successfully!');
            
            navigate('/login', { 
                state: { 
                    message: 'Verification successful! Please login to your dashboard.',
                    email,
                    detectionId
                } 
            });
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.response?.data?.detail || 'Invalid verification code. Please try again.');
            toast.error('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        
        setIsResending(true);
        try {
            await authService.resendOtp(email);
            toast.success('Verification code resent!');
            setCooldown(60);
        } catch (err: any) {
            toast.error('Failed to resend code');
        } finally {
            setIsResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden text-slate-900 bg-slate-50">
            {/* =======================
                LEFT SIDE - FORM 
               ======================= */}
            <div className="relative flex items-center justify-center p-4 lg:p-8 isolate">
                
                {/* --- BACKGROUND LAYERS --- */}
                <div
                    className="absolute inset-0 -z-20 h-full w-full opacity-40"
                    style={{
                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Animated Patient Blobs */}
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 mix-blend-multiply blur-[90px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.5, 0.2],
                            x: [0, -30, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 mix-blend-multiply blur-[90px]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[500px]"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-14 space-y-10 relative overflow-hidden">
                        
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-20 w-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner mb-2 ring-1 ring-blue-100">
                                <ShieldCheck className="h-10 w-10" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">Security Verification</h1>
                            <p className="text-slate-500 font-medium tracking-tight">
                                We've sent a 6-digit clinical code to <br />
                                <span className="font-bold text-blue-950 underline">{email}</span>
                            </p>
                        </div>

                        {message && !error && (
                            <div className="p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex items-center gap-4 text-emerald-700 text-sm font-semibold">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                <span>{message}</span>
                            </div>
                        )}

                        {error && (
                            <div className="p-5 bg-red-50/50 border border-red-100/50 rounded-2xl flex items-center gap-4 text-red-700 text-sm font-semibold">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="flex justify-between gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-full h-16 sm:h-20 text-center text-3xl font-black rounded-2xl border-2 border-slate-100 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading || otp.some(d => !d)}
                                className={cn(
                                    "relative overflow-hidden w-full h-16 rounded-2xl bg-gradient-to-r from-blue-900 to-emerald-600 px-4 text-white font-black shadow-2xl shadow-blue-900/10 hover:shadow-blue-900/30 transition-all duration-200",
                                    (isLoading || otp.some(d => !d)) && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            <span>Validating Identity...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Secure My Account</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </form>

                        <div className="flex flex-col items-center gap-8 pt-4 border-t border-slate-100">
                            <div className="text-sm text-slate-400 flex flex-col items-center gap-3">
                                <span className="font-bold tracking-tight">Didn't receive the code?</span>
                                <button
                                    onClick={handleResend}
                                    type="button"
                                    disabled={isResending || cooldown > 0}
                                    className="flex items-center gap-2 font-black text-blue-900 hover:text-blue-700 disabled:text-slate-300 transition-colors"
                                >
                                    {isResending ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Mail className="h-4 w-4" />
                                    )}
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                </button>
                            </div>

                            <Link 
                                to="/register" 
                                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Use different email
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* =======================
                RIGHT SIDE - IMAGE 
               ======================= */}
            <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
                        alt="Clinical Trust"
                        className="h-full w-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-slate-950/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent opacity-40" />
                </div>

                {/* Branding */}
                <div className="relative z-20 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <Stethoscope className="h-6 w-6 text-blue-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight text-white">DENTALAI<span className="text-blue-400">Diagnostics</span></span>
                        <span className="text-[10px] font-bold text-blue-200/60 font-sans">Verification Portal</span>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="relative z-20 mt-auto max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-2xl"
                    >
                        <div className="mb-6 text-blue-300">
                            <Smile className="h-8 w-8" />
                        </div>
                        <p className="text-xl font-light leading-relaxed text-slate-100 mb-6">
                            "Security matters when it comes to medical data. I feel safe knowing my dental records are protected by clinical-grade AI."
                        </p>
                        <footer className="flex items-center gap-4 border-t border-white/10 pt-6">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg border border-white/20">
                                AM
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">Arthur Morgan</div>
                                <div className="text-xs text-blue-200">Patient verified</div>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
