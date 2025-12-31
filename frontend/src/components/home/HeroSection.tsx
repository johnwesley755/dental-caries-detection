// frontend/src/components/home/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pt-20 pb-32">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Hero Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:w-1/2 text-center lg:text-left z-10"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New v2.0 Model Released
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Precision Dental <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Diagnostics with AI
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Enhance your clinical workflow with our advanced computer vision system. 
            Detect early-stage caries with higher accuracy than traditional visual inspection.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={() => navigate('/login')} className="h-12 px-8 text-base shadow-xl shadow-blue-200/50 transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700">
              Start Diagnosis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/register')}
              className="h-12 px-8 text-base border-2 hover:bg-gray-50 transition-all"
            >
              <PlayCircle className="mr-2 h-5 w-5 text-gray-500" />
              View Demo
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> 99.8% Accuracy
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> FDA Cleared
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent z-10 mix-blend-overlay" />
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=2000" 
              alt="Dental AI Analysis Interface" 
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
