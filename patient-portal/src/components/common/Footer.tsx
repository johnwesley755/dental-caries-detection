// patient-portal/src/components/common/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Dental Care Portal. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Your dental health information is secure and confidential.
          </p>
        </div>
      </div>
    </footer>
  );
};
