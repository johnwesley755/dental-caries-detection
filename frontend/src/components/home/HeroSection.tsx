// frontend/src/components/home/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Feather, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

// Animation variants for smooth transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const floatingAnimation = {
  y: ['-5%', '5%'],
  transition: {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gray-50/50">
      {/* Background Blurs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 pt-24 pb-32 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Decorative Elements */}
          <motion.div variants={itemVariants} className="absolute top-20 left-[15%] text-blue-400 hidden lg:block" animate={floatingAnimation}>
            <Sparkles className="h-10 w-10" />
          </motion.div>
          <motion.div variants={itemVariants} className="absolute top-16 right-[15%] text-purple-400 hidden lg:block" animate={floatingAnimation}>
            <Feather className="h-12 w-12" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8"
          >
            Make your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              dental diagnosis
            </span>{' '}
            <br className="hidden md:block" /> look as good as it sounds
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed font-medium"
          >
            Our AI-powered platform helps dental professionals quickly analyse radiographs and convey findings to patients with precision, clarity, and ease.
          </motion.p>

          {/* Call to Action Button */}
          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="h-14 px-10 text-lg font-semibold rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:shadow-blue-500/40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Get Started for Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Hero Image/Video Placeholder */}
          <motion.div
            variants={itemVariants}
            className="mt-20 relative w-full max-w-5xl"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
              {/* Floating UI Elements on Image */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm hidden md:block">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-semibold text-gray-700">AI-Powered Analysis</span>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 z-20 flex gap-2 hidden md:flex">
                <div className="bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg text-white flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="text-xs font-medium">Translate findings</span>
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/30 backdrop-blur-md p-6 rounded-full shadow-xl border-2 border-white/50 text-white transition-transform"
                >
                  <Play className="h-12 w-12 fill-current" />
                </motion.button>
              </div>

              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                alt="AI Dental Analysis Dashboard"
                className="w-full h-auto object-cover bg-gray-100"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};