// patient-portal/src/pages/Home.tsx
import React from 'react';
import { HeroSection, FeaturesSection, QuickScan, CTASection, Footer } from '../components/home';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickScan />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};
