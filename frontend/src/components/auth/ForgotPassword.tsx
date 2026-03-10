// frontend/src/components/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion } from 'framer-motion';
import {
    Loader2,
    ArrowLeft,
    Mail,
    ShieldCheck,
    Stethoscope,
    Activity
} from 'lucide-react';

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email, 'DENTIST');
            setIsSubmitted(true);
        } catch (err: any) {
            console.error('Forgot password error:', err);
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden bg-slate-50 dark:bg-slate-950 isolate">
            {/* LEFT SIDE - FORM */}
            <div className="relative flex items-center justify-center p-4 lg:p-8">
                {/* Background Patterns */}
                <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-orange-200/40 mix-blend-multiply blur-[90px]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[480px]"
                >
                    <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-12 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

                        <div className="space-y-3 text-center">
                            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 mb-2 ring-1 ring-orange-100">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
                            </h1>
                            <p className="text-base text-slate-500">
                                {isSubmitted
                                    ? "We've sent a password reset link to your email address."
                                    : "Enter your email and we'll send you a link to reset your password."}
                            </p>
                        </div>

                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                        Medical ID / Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-3.5 pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="doctor@clinic.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "relative overflow-hidden w-full rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all duration-200",
                                        isLoading && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {isLoading ? <LoadingSpinner size="sm" /> : <span>Send Reset Link</span>}
                                    </div>
                                </motion.button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-orange-700 text-sm leading-relaxed text-center">
                                    <p>Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
                                </div>
                                <button
                                    className="w-full rounded-xl border border-slate-200 px-4 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Try another email
                                </button>
                            </div>
                        )}

                        <div className="text-center pt-4 border-t border-slate-100">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT SIDE - IMAGE */}
            <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                        alt="Dental Technology"
                        className="h-full w-full object-cover opacity-50 scale-105 saturate-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-950/95 via-slate-900/90 to-slate-950/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/10 to-transparent opacity-30" />
                </div>

                <div className="relative z-20 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <Stethoscope className="h-6 w-6 text-orange-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight text-white">DentAI<span className="text-orange-400">Diagnostics</span></span>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-200/60">Intelligent Care Systems</span>
                    </div>
                </div>

                <div className="relative z-20 mt-auto max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-2xl"
                    >
                        <div className="mb-6 text-orange-300">
                            <Activity className="h-8 w-8" />
                        </div>
                        <p className="text-xl font-light leading-relaxed text-slate-100 mb-6">
                            "We take your security seriously. Password reset protocols ensure your patient data remains protected at all times."
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
