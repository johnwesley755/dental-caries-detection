// patient-portal/src/pages/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import {
    Loader2,
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Password Reset Successful</h2>
                    <p className="text-slate-500">Your password has been updated. You can now log in with your new password.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full h-14 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all"
                    >
                        Go to Login
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 isolate">
            <div className="absolute inset-0 -z-10 h-full w-full opacity-30"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[500px] w-full"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-10 space-y-8">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-slate-900">Set New Password</h1>
                        <p className="text-slate-500">Please enter and confirm your new password below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">New Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full h-14 pl-12 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full h-14 pl-12 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full h-14 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Update Password</span>}
                        </motion.button>
                    </form>

                    <div className="text-center pt-4 border-t border-slate-100">
                        <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors">
                            Cancel and go back
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
