// patient-portal/src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import {
    Loader2,
    ArrowLeft,
    Mail,
    ShieldCheck,
    Stethoscope,
    Smile
} from 'lucide-react';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
            await authService.forgotPassword(email, 'PATIENT');
            setIsSubmitted(true);
        } catch (err: any) {
            console.error('Forgot password error:', err);
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden text-slate-900 bg-slate-50">
            <div className="relative flex items-center justify-center p-4 lg:p-8 isolate">
                <div
                    className="absolute inset-0 -z-20 h-full w-full opacity-40"
                    style={{
                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-teal-200/40 mix-blend-multiply blur-[90px]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[520px]"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-14 space-y-8">
                        <div className="space-y-3 text-center">
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
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-4">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-teal-500/20 disabled:opacity-70"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Send Reset Link</span>}
                                    </div>
                                </motion.button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 text-teal-700 text-sm leading-relaxed">
                                    <p>Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full h-14 rounded-xl border-slate-200"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}

                        <div className="text-center pt-4 border-t border-slate-100">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-teal-600 font-bold hover:underline">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side Image (Same as Login for consistency) */}
            <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
                        alt="Dental Care"
                        className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-emerald-950/80 to-slate-950/90 mix-blend-multiply" />
                </div>
                <div className="relative z-20 flex items-center gap-3">
                    <Stethoscope className="h-8 w-8 text-teal-400" />
                    <span className="text-2xl font-bold tracking-tight">DentAI<span className="text-teal-400">Diagnostics</span></span>
                </div>
                <div className="relative z-20 mt-auto">
                    <div className="max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
                        <Smile className="h-8 w-8 text-teal-300 mb-4" />
                        <p className="text-xl font-light text-slate-100">
                            "Providing accessible dental care information when you need it most."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Button component since we might not have the UI library imported easily here
const Button = ({ children, className, ...props }: any) => (
    <button
        className={cn("px-4 py-2 transition-all active:scale-95 disabled:opacity-50", className)}
        {...props}
    >
        {children}
    </button>
);
