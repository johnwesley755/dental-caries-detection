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
    Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50 isolate">
             <div
                className="absolute inset-0 -z-20 h-full w-full opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[500px]"
            >
                <div className="bg-white/90 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-[2.5rem] p-10 lg:p-14 space-y-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner mb-2">
                             <ShieldCheck className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Verify Account</h1>
                        <p className="text-slate-500 font-medium tracking-tight">
                            We've sent a 6-digit clinical code to <br />
                            <span className="font-bold text-blue-900">{email}</span>
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

                        <button
                            type="submit"
                            disabled={isLoading || otp.some(d => !d)}
                            className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 text-white font-black shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Complete Verification</span>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col items-center gap-8 pt-4">
                        <div className="text-sm text-slate-400 flex flex-col items-center gap-3">
                             <span className="font-bold tracking-tight">Didn't receive the code?</span>
                             <button
                                onClick={handleResend}
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
    );
};
