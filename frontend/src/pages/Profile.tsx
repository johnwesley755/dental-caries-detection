// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Shield, Edit2, Save,
    KeyRound, Mail, Camera, CheckCircle2, Fingerprint, AppWindow, Lock, X
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { TopNavBar } from '../components/layout/TopNavBar';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Search query for TopNavBar
    const [searchQuery, setSearchQuery] = useState('');

    // Profile form state
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.full_name,
                email: user.email,
            });
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            const updated = await userService.updateProfile(profileData);
            updateUser(updated);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.new_password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await userService.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });
            toast.success('Password changed successfully!');
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: '',
            });
            setIsChangingPassword(false);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setProfileData({
            full_name: user?.full_name || '',
            email: user?.email || '',
        });
        setIsEditing(false);
    };

    // Helper to get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen w-full bg-[#f8f9ff] text-[#0b1c30]">
            <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <main className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-headline font-extrabold text-primary tracking-tight leading-none mb-3">Clinical Settings</h2>
                        <p className="text-slate-500 font-body text-sm font-medium">Configure your secure medical workstation and authentication profile.</p>
                    </motion.div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none bg-white border-slate-200 text-primary font-headline font-bold text-[11px] uppercase tracking-wider py-5 rounded-xl">
                            Export Logs
                        </Button>
                        <Button
                            onClick={isEditing ? handleProfileUpdate : undefined}
                            disabled={loading || (!isEditing && !isChangingPassword)}
                            className="flex-1 md:flex-none bg-primary text-white font-headline font-bold text-[11px] uppercase tracking-wider py-5 px-8 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Professional Profile Header */}
                <section className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-[#00194a] p-8 lg:p-10 shadow-2xl shadow-primary/10 group">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container rounded-full blur-[100px] opacity-30 -mr-24 -mt-24 transition-transform group-hover:scale-110 duration-700"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-8 lg:gap-10">
                        <div className="relative group">
                            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-[2rem] bg-white flex items-center justify-center text-primary font-headline font-extrabold text-4xl lg:text-5xl shadow-2xl border-4 border-white/10 ring-8 ring-primary/5 group-hover:scale-105 transition-transform duration-500">
                                {user?.full_name ? getInitials(user.full_name) : '??'}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#00194a] hover:scale-110 transition-transform active:scale-95 duration-200">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h3 className="text-3xl lg:text-4xl font-headline font-extrabold text-white tracking-tight">{user?.full_name}, D.D.S.</h3>
                                <div className="flex gap-2">
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.15em] border border-white/10">{user?.role}</span>
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.15em] border border-white/10">L3 Access</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2.5 text-blue-100/70 font-body text-sm font-semibold">
                                    <Mail className="h-4 w-4 text-primary-container" />
                                    {user?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Personal Identity Box */}
                    <Card className="bg-white rounded-[2.5rem] p-8 lg:p-10 border-none shadow-xl shadow-slate-200/50 group transition-all hover:shadow-2xl hover:shadow-primary/5">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-headline font-black text-primary uppercase tracking-tight">Identity Profile</h4>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Verified practitioner data</p>
                                    </div>
                                </div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center justify-center transition-all bg-white"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="w-10 h-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center transition-all bg-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all group-hover:border-primary/10">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Legal Name</label>
                                            {isEditing ? (
                                                <input
                                                    value={profileData.full_name}
                                                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                    className="w-full bg-white border-none py-2 px-3 rounded-lg text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                                                />
                                            ) : (
                                                <span className="text-base text-[#0b1c30] font-headline font-black ml-1">{user?.full_name}</span>
                                            )}
                                        </div>
                                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                    </div>
                                </div>

                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all group-hover:border-primary/10">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Primary Communications</label>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <input
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="w-full bg-white border-none py-2 px-3 rounded-lg text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                                                />
                                            ) : (
                                                <span className="text-base text-[#0b1c30] font-body font-bold ml-1">{user?.email}</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black px-3 py-1 rounded bg-blue-100 text-blue-700 uppercase tracking-widest shadow-sm">Primary</span>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-6 pt-6 border-t border-slate-50"
                                    >
                                        <Button
                                            onClick={handleProfileUpdate}
                                            disabled={loading}
                                            className="w-full h-12 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary-container transition-all shadow-lg shadow-primary/10"
                                        >
                                            {loading ? <LoadingSpinner size="sm" /> : <><Save className="h-4 w-4 mr-2" /> Sync Changes</>}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-start gap-3">
                                <Shield className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">Professional credentials are synced with the central medical board. Changes require administrative verification.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clinical Security Box */}
                    <Card className="bg-white rounded-[2.5rem] p-8 lg:p-10 border-none shadow-xl shadow-slate-200/50 group transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
                        <CardContent className="p-0 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-headline font-black text-primary uppercase tracking-tight">Clinical Security</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Authentication & compliance</p>
                                </div>
                            </div>

                            <div className="space-y-6 flex-grow">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all hover:border-emerald-100/50">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="mt-0.5 w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-slate-200 shadow-sm">
                                            <KeyRound className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h5 className="text-sm font-headline font-black text-primary uppercase">Master Access Code</h5>
                                                <span className="text-[10px] text-slate-400 font-bold tracking-widest">v4 Protocol active</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-semibold tracking-tight leading-tight">Compliant with 12-character medical security policy. Updated 14d ago.</p>
                                        </div>
                                    </div>

                                    {!isChangingPassword ? (
                                        <Button
                                            onClick={() => setIsChangingPassword(true)}
                                            className="w-full bg-primary text-white font-headline font-black text-[11px] py-6 rounded-xl shadow-lg shadow-primary/10 hover:bg-primary-container transition-all group/btn uppercase tracking-widest"
                                        >
                                            Update Credentials
                                        </Button>
                                    ) : (
                                        <div className="space-y-4">
                                            <input
                                                type="password"
                                                placeholder="Old Password"
                                                value={passwordData.old_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                                className="w-full bg-white border-none py-3 px-4 rounded-xl text-sm font-bold text-primary focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <div className="flex gap-3">
                                                <input
                                                    type="password"
                                                    placeholder="New Key"
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                    className="flex-1 bg-white border-none py-3 px-4 rounded-xl text-sm font-bold text-primary focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Confirm"
                                                    value={passwordData.confirm_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                    className="flex-1 bg-white border-none py-3 px-4 rounded-xl text-sm font-bold text-primary focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    onClick={handlePasswordChange}
                                                    disabled={loading}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase h-12 rounded-xl"
                                                >
                                                    {loading ? <LoadingSpinner size="sm" /> : 'Confirm Shift'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsChangingPassword(false)}
                                                    className="flex-1 border-slate-200 text-slate-400 font-black text-[10px] uppercase h-12 rounded-xl"
                                                >
                                                    Revert
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-slate-200">
                                            <Fingerprint className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Biometrics</p>
                                            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">Active</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-slate-200">
                                            <AppWindow className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">MFA (TOTP)</p>
                                            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">Enabled</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </main>
        </div>
    );
};