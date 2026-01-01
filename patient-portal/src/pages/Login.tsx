// patient-portal/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  ArrowRight, 
  Lock, 
  Mail, 
  Smile, 
  ShieldCheck, 
  Stethoscope,
  Eye,
  EyeOff,
  Heart,
  UserCircle
} from 'lucide-react';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please check your credentials.';
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
      
      {/* =======================
          LEFT SIDE - LOGIN FORM 
         ======================= */}
      <div className="relative flex items-center justify-center p-4 lg:p-8 isolate">
        
        {/* --- BACKGROUND LAYERS --- */}
        <div 
          className="absolute inset-0 -z-20 h-full w-full opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Animated Blobs (Softer Teal/Blue for Patients) */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2], 
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-teal-200/40 mix-blend-multiply blur-[90px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -30, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 mix-blend-multiply blur-[90px]"
            />
        </div>

        {/* --- MAIN CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[520px]" 
        >
          {/* DIFFERENTIATOR: Patient Access Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <UserCircle className="h-4 w-4" />
              Patient Access Portal
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-3xl p-10 lg:p-14 space-y-8 relative overflow-hidden">
            
            {/* Header */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h1>
              <p className="text-base text-slate-500">
                View your diagnostics and treatment plans
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
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 pointer-events-none">
                     <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm transition-all duration-200",
                      "placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      "hover:bg-slate-50 hover:border-slate-300"
                    )}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 pointer-events-none">
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
                      "flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 pr-12 text-sm transition-all duration-200",
                      "placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      "hover:bg-slate-50 hover:border-slate-300"
                    )}
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

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                  "relative overflow-hidden w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Login</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>
            
            <div className="text-center text-xs text-slate-400 mt-4 border-t border-slate-100 pt-6">
              <p>For account issues, please contact your dental provider directly.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =======================
          RIGHT SIDE - IMAGE
         ======================= */}
      <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden">
        {/* Background Image - Patient Friendly & Warm */}
        <div className="absolute inset-0 bg-slate-900">
          {/* Changed image to a consultation/patient focus */}
          <img 
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop"
            alt="Patient Consultation"
            className="h-full w-full object-cover opacity-60 scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-indigo-950/80 to-slate-950/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-500/10 to-transparent opacity-40" />
        </div>
        
        {/* Branding */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <Stethoscope className="h-6 w-6 text-blue-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-white">DentAI<span className="text-blue-400">Diagnostics</span></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200/60">Patient Portal</span>
          </div>
        </div>

        {/* Testimonial / Value Prop */}
        <div className="relative z-20 mt-auto max-w-lg">
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4, duration: 0.6 }}
             className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-2xl"
          >
            <div className="mb-6 text-teal-300">
              <Smile className="h-8 w-8" />
            </div>
            <p className="text-xl font-light leading-relaxed text-slate-100 mb-6">
              "Seeing my dental scans explained by AI made me feel so much more involved in my healthcare decisions. Truly empowering technology."
            </p>
            <footer className="flex items-center gap-4 border-t border-white/10 pt-6">
               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg border border-white/20">
                 JD
               </div>
               <div>
                  <div className="text-sm font-semibold text-white">Jane Doe</div>
                  <div className="text-xs text-blue-200">Patient since 2023</div>
               </div>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};