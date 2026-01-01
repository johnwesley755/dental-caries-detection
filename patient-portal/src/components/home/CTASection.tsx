// patient-portal/src/components/home/CTASection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';

export const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/50 to-white isolate">
      
      {/* ==============================================
          LIGHT THEME BACKGROUND FX
      =============================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft colorful blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Floating Decor Icons */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex absolute top-10 left-10 items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-lg border border-blue-100 rotate-12"
          >
            <ShieldCheck className="w-7 h-7 text-blue-500" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute bottom-20 right-10 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-200 -rotate-12"
          >
            <Star className="w-8 h-8 text-white fill-white" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Pill Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold uppercase tracking-widest shadow-sm">
                <Zap className="w-4 h-4 fill-blue-600" />
                Start your journey
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Dental care that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                actually feels good.
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Join thousands of patients who have switched to a smarter, more transparent way of managing their oral health.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!isAuthenticated ? (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/register')}
                    className="h-16 px-10 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                    className="h-16 px-10 text-lg rounded-full border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 shadow-sm hover:shadow-md transition-all bg-white/50 backdrop-blur-sm"
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="h-16 px-12 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 hover:scale-105 transition-all"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>

            <p className="text-sm text-slate-400 font-medium">
              No credit card required • HIPAA Compliant • Cancel anytime
            </p>

          </motion.div>
        </div>
      </div>
    </section>
  );
};