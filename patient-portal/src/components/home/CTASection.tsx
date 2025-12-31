// patient-portal/src/components/home/CTASection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

export const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-blue-600 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to take control of your dental health?
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Sign in to access your personalized dental health dashboard
        </p>
        {!isAuthenticated && (
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};
