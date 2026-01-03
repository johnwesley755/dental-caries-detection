// patient-portal/src/pages/Home.tsx
import React from 'react';
import { HeroSection, FeaturesSection, BenefitsSection, HowItWorksSection, CTASection, Footer } from '../components/home';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-green-50/50 blur-3xl" />
      </div>

      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};
