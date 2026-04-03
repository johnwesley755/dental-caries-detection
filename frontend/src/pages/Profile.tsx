// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
   User, Shield, Calendar, Edit2, Save,
   KeyRound
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { TopNavBar } from '../components/layout/TopNavBar';

export const Profile: React.FC = () => {
   const { user, updateUser } = useAuth();
   const [isEditing, setIsEditing] = useState(false);
   const [isChangingPassword, setIsChangingPassword] = useState(false);
   const [loading, setLoading] = useState(false);

   // Search query for TopNavBar stand-in
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
      } catch (err) {
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
      } catch (err) {
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
      <div className="min-h-screen w-full bg-surface relative overflow-hidden">
         <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
               animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 10, repeat: Infinity }}
               className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 mix-blend-multiply blur-[100px]"
            />
            <motion.div
               animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 15, repeat: Infinity }}
               className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/10 mix-blend-multiply blur-[100px]"
            />
         </div>

         <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">

            {/* Page Title */}
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8"
            >
               <h1 className="text-2xl sm:text-3xl font-headline font-black tracking-tight text-blue-900 uppercase">Clinical Settings</h1>
               <p className="text-slate-500 mt-1 font-medium text-sm">Manage your workstation profile and clinical security credentials.</p>
            </motion.div>

            {/* --- HEADER CARD --- */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative overflow-hidden"
            >
               {/* Decorative Top Gradient Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

               {/* Avatar Logo (No Upload) */}
               <div className="flex-shrink-0">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-blue-700 to-primary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/20 transition-transform hover:scale-105 duration-300">
                     {user?.full_name ? getInitials(user.full_name) : <User />}
                  </div>
               </div>

               {/* User Info */}
               <div className="flex-grow text-center md:text-left space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-headline font-black text-blue-900">{user?.full_name}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{user?.email}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black border border-primary/10 uppercase tracking-widest">
                        <Shield className="h-3 w-3" />
                        {user?.role}
                     </span>
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black border border-slate-100 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        Joined {user?.created_at ? new Date(user.created_at).getFullYear() : '2025'}
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
                  className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col h-full"
               >
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/5 text-primary rounded-xl">
                           <span className="material-symbols-outlined text-2xl">badge</span>
                        </div>
                        <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Personal Base</h3>
                     </div>
                     {!isEditing && (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-primary/10"
                           title="Edit Profile"
                        >
                           <Edit2 className="h-4 w-4" />
                        </button>
                     )}
                  </div>

                  <div className="space-y-6 flex-grow">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</label>
                        {isEditing ? (
                           <input
                              value={profileData.full_name}
                              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                              className="flex h-12 w-full rounded-xl border-none bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:bg-white focus:outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                           />
                        ) : (
                           <div className="flex h-12 w-full items-center rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-700 border border-slate-100/50">
                              {user?.full_name}
                           </div>
                        )}
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Channel Access</label>
                        {isEditing ? (
                           <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="flex h-12 w-full rounded-xl border-none bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:bg-white focus:outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                           />
                        ) : (
                           <div className="flex h-12 w-full items-center rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-700 border border-slate-100/50">
                              {user?.email}
                           </div>
                        )}
                     </div>
                  </div>

                  {isEditing && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex gap-3 pt-6 mt-6 border-t border-slate-50"
                     >
                        <button
                           onClick={handleProfileUpdate}
                           disabled={loading}
                           className="flex-1 flex items-center justify-center h-12 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                        >
                           {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                           Sync Profile
                        </button>
                        <button
                           onClick={handleCancelEdit}
                           disabled={loading}
                           className="flex-1 flex items-center justify-center h-12 bg-white border border-slate-100 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all"
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
                  className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col h-full"
               >
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                           <span className="material-symbols-outlined text-2xl">lock_open</span>
                        </div>
                        <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Clinical Security</h3>
                     </div>
                  </div>

                  {!isChangingPassword ? (
                     <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4 py-6">
                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                           <KeyRound className="h-6 w-6" />
                        </div>
                        <div>
                           <p className="text-slate-900 font-bold">Password Protection</p>
                           <p className="text-xs text-slate-400">Secure your account with a strong password.</p>
                        </div>
                        <button
                           onClick={() => setIsChangingPassword(true)}
                           className="mt-4 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                           Change Password
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-4 flex-grow">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vault Key</label>
                           <input
                              type="password"
                              value={passwordData.old_password}
                              onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                              className="flex h-12 w-full rounded-xl border-none bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:bg-white focus:outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                              placeholder="Current Access Key"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Key</label>
                           <input
                              type="password"
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                              className="flex h-12 w-full rounded-xl border-none bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:bg-white focus:outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                              placeholder="New Safe Key"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verify Key</label>
                           <input
                              type="password"
                              value={passwordData.confirm_password}
                              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                              className="flex h-12 w-full rounded-xl border-none bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 focus:bg-white focus:outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                              placeholder="Repeat New Key"
                           />
                        </div>
                     </div>
                  )}

                  {isChangingPassword && (
                     <div className="flex gap-3 pt-6 mt-auto">
                        <button
                           onClick={handlePasswordChange}
                           disabled={loading}
                           className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                        >
                           {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
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