// patient-portal/src/pages/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle2,
    ArrowRight,
    UserCircle
} from 'lucide-react';

export const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.resetPassword({ token, new_password: password });
            setIsSuccess(true);
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Failed to reset password. The link may have expired.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 isolate overflow-hidden font-inter">
                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10 h-full w-full opacity-40"
                    style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[480px] w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-14 text-center space-y-10"
                >
                    <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reset Complete</h2>
                        <p className="text-slate-500 text-base leading-relaxed">Your professional clinical credentials have been synchronized successfully.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/login')}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-900 to-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                        Return to Login
                        <ArrowRight className="h-5 w-5" />
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-8 isolate overflow-hidden font-inter">
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 h-full w-full opacity-40"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Animated Blobs */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-100/60 blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-100/60 blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[520px] w-full"
            >
                {/* Branding Badge */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-950 text-xs font-semibold shadow-sm">
                        <UserCircle className="h-4 w-4" />
                        Patient Security Portal
                    </span>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-14 space-y-8 relative overflow-hidden">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security Update</h1>
                        <p className="text-base text-slate-500">Set a high-strength password for your clinical account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                                >
                                    <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-red-700 leading-relaxed">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">New Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 pr-12 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-slate-300"
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

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Confirm Identity</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-slate-300"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-900 to-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <LoadingSpinner size="sm" />
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Update Final Credentials</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="text-center pt-6 border-t border-slate-100">
                        <Link to="/login" className="text-sm font-bold text-blue-900 hover:underline">
                            Return to Secure Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
