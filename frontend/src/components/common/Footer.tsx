// frontend/src/components/common/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} DentalCare AI. All rights reserved.
          </p>
          <p className="text-xs mt-2 text-gray-400">
            AI-Powered Dental Caries Detection System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;