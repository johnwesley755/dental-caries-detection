// frontend/src/components/auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, Lock, Mail, Activity, Stethoscope, ShieldCheck } from 'lucide-react';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    }
  };

  return (
    // Removed 'font-sans' here to preserve your global font settings
    <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden">
      
      {/* =======================
          LEFT SIDE - LOGIN FORM 
         ======================= */}
      <div className="relative flex items-center justify-center p-4 lg:p-8 bg-slate-50 dark:bg-slate-950 isolate">
        
        {/* --- BACKGROUND LAYERS (Creating Depth) --- */}
        
        {/* 1. Base Grid Pattern (Slightly darker dots on the slate background) */}
        <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
        
        {/* 2. Animated Color Gradients (Soft glow behind the card) */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3], 
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 mix-blend-multiply blur-[90px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, -30, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-200/40 mix-blend-multiply blur-[90px]"
            />
        </div>

        {/* --- MAIN CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[480px]" 
        >
          {/* Card Container: Pure White on Slate-50 Background = Pop */}
          <div className="bg-white border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-12 space-y-8 relative overflow-hidden">
            
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

            {/* Header */}
            <div className="space-y-3 text-center">
               <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 mb-2 ring-1 ring-blue-100">
                 <Activity className="h-7 w-7" />
               </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h1>
              <p className="text-base text-slate-500">
                Enter your credentials to access the portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
                >
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Medical ID / Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 pointer-events-none">
                     <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="doctor@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm transition-all duration-200",
                      "placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      "hover:bg-slate-50 hover:border-slate-300"
                    )}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn(
                      "flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 pr-12 text-sm transition-all duration-200",
                      "placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      "hover:bg-slate-50 hover:border-slate-300"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                  "relative overflow-hidden w-full rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all duration-200",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            <div className="relative pt-2">
               <div className="absolute inset-0 flex items-center">
                 <span className="w-full border-t border-slate-100" />
               </div>
               <div className="relative flex justify-center text-xs uppercase tracking-widest">
                 <span className="bg-white px-3 text-slate-400 font-medium">
                   Secure Staff Portal
                 </span>
               </div>
             </div>

            <div className="text-center text-xs text-slate-500">
              <p>Protected by <span className="font-semibold text-slate-700">Enterprise Shield</span>. <br/> Access restricted to authorized personnel.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =======================
          RIGHT SIDE - IMAGE
         ======================= */}
      <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
            alt="Dental Technology"
            className="h-full w-full object-cover opacity-50 scale-105 saturate-50"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-slate-900/90 to-slate-950/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent opacity-30" />
        </div>
        
        {/* Branding */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <Stethoscope className="h-6 w-6 text-blue-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-white">DentAI<span className="text-blue-400">Diagnostics</span></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200/60">Intelligent Care Systems</span>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-20 mt-auto max-w-lg">
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4, duration: 0.6 }}
             className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-2xl"
          >
            <div className="mb-6 text-blue-300">
              <Activity className="h-8 w-8" />
            </div>
            <p className="text-xl font-light leading-relaxed text-slate-100 mb-6">
              "The accuracy of the caries detection module has become indispensable to our daily practice, allowing us to focus more on patient treatment plans."
            </p>
            <footer className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">JS</div>
                 <div>
                    <div className="text-sm font-semibold text-white">Dr. James Smith</div>
                    <div className="text-xs text-blue-200">Chief of Dental Surgery</div>
                 </div>
              </div>
              <div className="text-xs font-medium text-slate-400 bg-black/20 px-3 py-1 rounded-full">v2.4.0 Stable</div>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;