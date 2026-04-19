// patient-portal/src/components/common/Modal.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Simplified button for Modal if standard one isn't available
const ModalButton: React.FC<{ 
  onClick: () => void; 
  children: ReactNode; 
  className?: string; 
  variant?: 'ghost' 
}> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = 'lg' 
}) => {
  const [show, setShow] = useState(isOpen);

  // Synchronize state and handle body scroll locking
  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!show) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop with Blur */}
        <div
          className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Centering Spacer */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Panel */}
        <div
          className={`
            inline-block w-full align-bottom bg-white rounded-[24px] text-left overflow-hidden shadow-2xl 
            transform transition-all sm:my-8 sm:align-middle ${maxWidthClasses[maxWidth]}
            animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/20
          `}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="text-xl font-bold text-slate-800 leading-6 tracking-tight">
              {title}
            </h3>
            <ModalButton
              onClick={onClose}
              className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </ModalButton>
          </div>

          {/* Body */}
          <div className="px-6 py-6 bg-white">
            <div className="text-slate-600 text-sm leading-relaxed">
              {children}
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-slate-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
