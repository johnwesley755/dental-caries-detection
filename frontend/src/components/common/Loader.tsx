// frontend/src/components/common/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text, 
  className = '', 
  fullScreen = false 
}) => {
  // Size mapping for the spinner dimensions and border width
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-16 w-16 border-4',
  };

  const LoaderContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Background Track Ring */}
        <div 
          className={`${sizeClasses[size]} rounded-full border-slate-100`} 
        />
        {/* Spinning Indicator Ring */}
        <div 
          className={`absolute ${sizeClasses[size]} rounded-full border-blue-600 border-t-transparent border-l-transparent animate-spin`} 
        />
      </div>
      
      {/* Loading Text */}
      {text && (
        <p className="text-slate-500 text-sm font-medium animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );

  // If fullScreen prop is true, wrap in a fixed overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#F4F7FE]/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {LoaderContent}
      </div>
    );
  }

  return (
    <div className="p-4 flex items-center justify-center">
      {LoaderContent}
    </div>
  );
};

export default Loader;