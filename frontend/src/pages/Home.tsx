// frontend/src/pages/Home.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HeroSection, FeaturesSection, WorkflowSection, CTASection, StatisticsSection, TestimonialsSection, Footer } from '../components/home';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-50/50 blur-3xl" />
      </div>

      <HeroSection />
      <FeaturesSection />
      <StatisticsSection />
      <WorkflowSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};
