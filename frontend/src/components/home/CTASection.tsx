// frontend/src/components/home/CTASection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-blue-600 rounded-3xl p-12 md:p-24 text-center text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-blue-600 to-blue-600" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Transform Your Practice?</h2>
          <p className="text-xl mb-10 text-blue-100">
            Join over 5,000 dental professionals using our AI-powered caries detection to improve patient outcomes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register')}
              className="text-lg px-10 h-14 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              Create Free Account
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-200 opacity-80">No credit card required for 14-day trial.</p>
        </div>
      </motion.div>
    </div>
  );
};
