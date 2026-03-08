// frontend/src/components/auth/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
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
                    className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 text-center space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shadow-sm border border-green-100">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Password Reset Successful</h2>
                    <p className="text-slate-500">Your password has been updated across the network. You can now log in securely.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10"
                    >
                        Go to Login
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 isolate">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[500px] w-full"
            >
                <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Set New Password</h1>
                        <p className="text-slate-500 text-sm">Please securely enter and confirm your new password below.</p>
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
                                <div className="absolute left-4 top-3.5 pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-50 hover:bg-slate-800 transition-all"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Update Password</span>}
                        </motion.button>
                    </form>

                    <div className="text-center pt-4 border-t border-slate-100">
                        <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors">
                            Cancel and return to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
