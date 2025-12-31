// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  User, Mail, Shield, Calendar, Edit2, Save, X, Lock, 
  Activity, CheckCircle2, KeyRound
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.detail || 'Failed to update profile');
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
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.detail || 'Failed to change password');
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      
      {/* --- BACKGROUND ELEMENTS (Matched to Login) --- */}
      {/* Base Grid Pattern */}
      <div 
        className="fixed inset-0 -z-20 h-full w-full opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Animated Blobs */}
      <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
          <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-200/30 mix-blend-multiply blur-[100px]" 
          />
          <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
             transition={{ duration: 15, repeat: Infinity }}
             className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-200/30 mix-blend-multiply blur-[100px]" 
          />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Page Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account details and security.</p>
        </motion.div>

        {/* --- HEADER CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
        >
          {/* Decorative Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

          {/* Avatar Logo (No Upload) */}
          <div className="flex-shrink-0">
             <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {user?.full_name ? getInitials(user.full_name) : <User />}
             </div>
          </div>

          {/* User Info */}
          <div className="flex-grow text-center md:text-left space-y-1">
             <h2 className="text-2xl font-bold text-slate-900">{user?.full_name}</h2>
             <p className="text-slate-500 font-medium">{user?.email}</p>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 uppercase tracking-wide">
                   <Shield className="h-3 w-3" />
                   {user?.role}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-100">
                   <Calendar className="h-3 w-3" />
                   Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2025'}
                </span>
             </div>
          </div>
        </motion.div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. PERSONAL DETAILS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg shadow-slate-200/50 rounded-2xl p-6 md:p-8 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                     <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Personal Details</h3>
               </div>
               {!isEditing && (
                  <button 
                     onClick={() => setIsEditing(true)}
                     className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                     title="Edit Profile"
                  >
                     <Edit2 className="h-4 w-4" />
                  </button>
               )}
            </div>

            <div className="space-y-6 flex-grow">
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  {isEditing ? (
                     <input
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                     />
                  ) : (
                     <div className="flex h-11 w-full items-center rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-900 border border-slate-100">
                        {user?.full_name}
                     </div>
                  )}
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  {isEditing ? (
                     <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                     />
                  ) : (
                     <div className="flex h-11 w-full items-center rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-900 border border-slate-100">
                        {user?.email}
                     </div>
                  )}
               </div>
            </div>

            {isEditing && (
               <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-3 pt-6 mt-auto"
               >
                  <button 
                     onClick={handleProfileUpdate} 
                     disabled={loading}
                     className="flex-1 flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
                  >
                     {loading ? <Activity className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                     Save
                  </button>
                  <button 
                     onClick={handleCancelEdit} 
                     disabled={loading}
                     className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                     Cancel
                  </button>
               </motion.div>
            )}
          </motion.div>

          {/* 2. SECURITY */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg shadow-slate-200/50 rounded-2xl p-6 md:p-8 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                     <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Security</h3>
               </div>
            </div>

            {!isChangingPassword ? (
               <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4 py-6">
                  <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                     <KeyRound className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-slate-900 font-medium">Password Protection</p>
                     <p className="text-sm text-slate-500">Secure your account with a strong password.</p>
                  </div>
                  <button 
                     onClick={() => setIsChangingPassword(true)}
                     className="mt-4 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                     Change Password
                  </button>
               </div>
            ) : (
               <div className="space-y-4 flex-grow">
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                     <input
                        type="password"
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        placeholder="••••••••"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                     <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        placeholder="••••••••"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
                     <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        placeholder="••••••••"
                     />
                  </div>
               </div>
            )}

            {isChangingPassword && (
               <div className="flex gap-3 pt-6 mt-auto">
                  <button 
                     onClick={handlePasswordChange} 
                     disabled={loading}
                     className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  >
                     {loading ? <Activity className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                     Update
                  </button>
                  <button 
                     onClick={() => {
                        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
                        setIsChangingPassword(false);
                     }}
                     disabled={loading}
                     className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                     Cancel
                  </button>
               </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};