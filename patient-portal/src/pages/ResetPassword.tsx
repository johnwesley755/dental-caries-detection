// patient-portal/src/pages/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle2,
    ArrowRight
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 isolate">
                <div className="absolute inset-0 -z-10 h-full w-full opacity-30"
                    style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[480px] w-full bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-10 lg:p-12 text-center space-y-10"
                >
                    <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner ring-1 ring-emerald-100">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Reset Complete</h2>
                      <p className="text-slate-500 font-bold tracking-tight">Your clinical credentials have been updated successfully.</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full h-14 rounded-2xl bg-primary text-white font-black text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:bg-blue-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Return to Login
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 lg:p-8 isolate">
            <div className="absolute inset-0 -z-10 h-full w-full opacity-30"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[480px] w-full"
            >
                <div className="bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-[2.5rem] p-10 lg:p-12 space-y-10">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Security Update</h1>
                        <p className="text-slate-500 font-bold tracking-tight">Set a secure new password for your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50/50 border border-red-100/50 rounded-2xl flex items-start gap-3 text-left">
                                <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-xs font-bold text-red-700 leading-relaxed">{error}</span>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 ml-1">New Password</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-5">
                                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full h-15 pl-14 pr-14 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold placeholder:text-slate-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 ml-1">Confirm Identity</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-5">
                                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full h-15 pl-14 pr-14 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold placeholder:text-slate-200"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full h-15 rounded-2xl bg-primary text-white font-black text-[10px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:bg-blue-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? <LoadingSpinner size="sm" /> : <span>Activate Final Credentials</span>}
                        </button>
                    </form>

                    <div className="text-center pt-8 border-t border-slate-100">
                        <Link to="/login" className="text-[10px] font-black text-slate-400 hover:text-primary transition-all">
                            Cancel Process
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
