// patient-portal/src/pages/Home.tsx
import React from 'react';
import { HeroSection, FeaturesSection, CTASection, Footer } from '../components/home';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};
