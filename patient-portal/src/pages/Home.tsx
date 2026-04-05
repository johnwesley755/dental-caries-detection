// patient-portal/src/pages/Home.tsx
import React from 'react';
import { 
  HeroSection, 
  PatientTrust,
  QuickScan, 
  FeaturesSection, 
  CTASection, 
  Footer 
} from '../components/home';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PatientTrust />
      <QuickScan />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};
