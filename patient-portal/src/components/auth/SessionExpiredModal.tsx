// patient-portal/src/components/auth/SessionExpiredModal.tsx
import React from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';
import Modal from '../common/Modal';
import { motion } from 'framer-motion';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onLogout: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Disable closing via background click for security
      title="Session Timed Out"
      maxWidth="md"
      footer={
        <div className="w-full">
          <button 
            onClick={onLogout}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5" />
            Back to Login
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center space-y-6 py-6 font-sans">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="h-24 w-24 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-900/5 ring-1 ring-indigo-100"
        >
          <ShieldAlert className="h-12 w-12" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Security Notice
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed px-6">
            For your protection, your secure health session has expired. Please login again to access your dental records and tracking.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 w-full flex items-start gap-4 text-left">
          <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <p className="text-xs text-slate-400 font-bold leading-normal uppercase tracking-wide">
            This prevents unauthorized access if you are away from your device.
          </p>
        </div>
      </div>
    </Modal>
  );
};
