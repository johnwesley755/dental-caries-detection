// patient-portal/src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import {
    Loader2,
    ArrowRight,
    Lock,
    Mail,
    ShieldCheck,
    Stethoscope,
    Eye,
    EyeOff,
    User,
    Heart
} from 'lucide-react';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const detectionId = location.state?.detectionId;
    console.log('Register page detectionId:', detectionId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.register({
                email,
                password,
                full_name: fullName,
                detection_id: detectionId
            });
            navigate('/login', { state: { message: 'Registration successful! Please login.', detectionId } });
        } catch (err: any) {
            console.error('Registration error:', err);
            let errorMessage = 'Registration failed. Please try again.';
            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;
                if (Array.isArray(detail)) {
                    errorMessage = detail.map((d: any) => d.msg).join(', ');
                } else if (typeof detail === 'string') {
                    errorMessage = detail;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden text-slate-900 bg-slate-50">

            {/* LEFT SIDE - REGISTER FORM */}
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
                        className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-teal-200/40 blur-[90px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-teal-200/40 blur-[90px]"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[520px]"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-10 lg:p-14 space-y-8">
                        <div className="space-y-3 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                            <p className="text-slate-500">Join DentAI to manage your dental health</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-xl hover:shadow-teal-500/40 transition-all duration-200",
                                    isLoading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Start Your Journey</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-teal-600 font-bold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern Dentistry"
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-emerald-950/80 to-slate-950/90 mix-blend-multiply" />

                <div className="relative z-20 flex items-center gap-3">
                    <Stethoscope className="h-8 w-8 text-teal-300" />
                    <span className="text-2xl font-bold">DentAI<span className="text-teal-400">Diagnostics</span></span>
                </div>

                <div className="relative z-20 mt-auto max-w-lg">
                    <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8">
                        <Heart className="h-8 w-8 text-teal-300 mb-4" />
                        <p className="text-xl font-light leading-relaxed mb-6">
                            "Your dental health is our priority. Get instant AI insights and connect with top-tier professionals."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
