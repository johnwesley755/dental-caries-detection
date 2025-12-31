// patient-portal/src/components/home/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Dental Health, <br />
            <span className="text-blue-600">At Your Fingertips</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access your dental records, view scan results, and track your oral health journey—all in one secure portal.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
