// frontend/src/components/home/CTASection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 pb-24 group">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-blue-900 rounded-[3rem] p-12 md:p-24 text-center text-white overflow-hidden shadow-2xl shadow-primary/20"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-primary to-indigo-900" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-white/5 rounded-full blur-[120px] transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-primary/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-4 backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3" />
            <span>Deployment Ready</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-6xl font-headline font-black mb-6 tracking-tight leading-[1.1] uppercase">
            Initialize Your <br className="hidden sm:block" /> Digital Practice
          </h2>
          
          <p className="text-sm sm:text-xl mb-10 text-primary-container font-bold uppercase tracking-tight opacity-80 max-w-2xl mx-auto">
            Join a global network of dental professionals leveraging neural diagnostics to improve patient outcomes today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto h-16 px-12 bg-white text-blue-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              Secure Free Instance
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto h-16 px-12 bg-transparent border border-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
            >
              Vault Access
            </button>
          </div>
          
          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-primary-container/60">
            No credit card required for 14-day trial instance.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
