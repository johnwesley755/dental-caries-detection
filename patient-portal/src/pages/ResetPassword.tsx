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
    Command
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6 isolate overflow-hidden">
                {/* Premium Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[440px] w-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 lg:p-12 text-center"
                >
                    <div className="flex justify-center mb-8">
                        <motion.div 
                            initial={{ rotate: -20, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="h-24 w-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                        >
                            <CheckCircle2 className="h-12 w-12" />
                        </motion.div>
                    </div>
                    
                    <div className="space-y-4 mb-10">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Access Restored</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">Your professional clinical credentials have been synchronized and updated successfully.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/login')}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.6)] transition-all"
                    >
                        Return to Portal
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020512] flex items-center justify-center p-6 lg:p-8 isolate overflow-hidden">
            {/* Premium Dynamic Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-[480px] w-full"
            >
                {/* Branding Header */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/20 flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <Command className="text-white h-7 w-7" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">DentAI <span className="text-blue-500">Security</span></span>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] p-10 lg:p-14 space-y-10 relative overflow-hidden">
                    {/* Decorative form glass effect */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Update Credentials</h1>
                        <p className="text-slate-400 text-sm font-medium">Please establish a strong new password for your clinical account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-left"
                                >
                                    <ShieldCheck className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="text-xs font-semibold text-red-300 leading-relaxed">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants} className="space-y-3">
                            <label className="text-xs font-semibold text-slate-400 ml-1 flex items-center gap-2">
                                <Lock className="h-3 w-3" />
                                New Secure Password
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full h-16 pl-6 pr-14 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white font-medium placeholder:text-slate-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                            <label className="text-xs font-semibold text-slate-400 ml-1 flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" />
                                Confirm Identity
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full h-16 pl-6 pr-14 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white font-medium placeholder:text-slate-600"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading || !token}
                            className="group relative w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm overflow-hidden shadow-xl shadow-blue-500/20 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div className="relative flex items-center justify-center gap-3">
                                {isLoading ? <LoadingSpinner size="sm" /> : (
                                    <>
                                        <span>Update Patient Access</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants} className="text-center pt-8 border-t border-white/5">
                        <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-white transition-all inline-flex items-center gap-2">
                            Return to Secure Login
                        </Link>
                    </motion.div>
                </div>
                
                {/* Footer Security Note */}
                <motion.p 
                    variants={itemVariants}
                    className="text-center mt-12 text-slate-600 text-[11px] font-medium uppercase tracking-[0.2em]"
                >
                    System Protected by DentAI Intelligence & AES-256
                </motion.p>
            </motion.div>
        </div>
    );
};
