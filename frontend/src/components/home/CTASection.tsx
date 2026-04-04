// frontend/src/components/home/CTASection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-[#001234] rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-16 text-center text-white overflow-hidden"
      >
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-[#003d9b]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[#3755c3]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-black text-[#b2c5ff] backdrop-blur-sm">
            Academic Demonstration Available
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Try the Detection System
          </h2>
          <p className="text-[#b2c5ff] font-medium text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Sign in to upload a dental image and see the AI caries detection model in action. No commercial use — academic project only.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 sm:h-14 px-8 sm:px-10 bg-white text-[#003d9b] rounded-xl font-black hover:bg-[#dae2ff] transition-all shadow-xl active:scale-95 text-sm sm:text-base"
            >
              Sign Up
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <a
              href="https://github.com/johnwesley755/dental-caries-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 sm:h-14 px-8 sm:px-10 bg-transparent border border-white/20 text-white rounded-xl font-black hover:bg-white/5 transition-all active:scale-95 text-sm sm:text-base"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              View Source Code
            </a>
          </div>
          {/* <p className="text-xs font-black text-[#b2c5ff]/50 pt-1 sm:pt-2">
            © 2026 Final Year  Project. Not for commercial use.
          </p> */}
        </div>
      </motion.div>
    </div>
  );
};
