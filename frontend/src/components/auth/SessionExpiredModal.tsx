// frontend/src/components/auth/SessionExpiredModal.tsx
import React from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';
import Modal from '../common/Modal';
import { Button } from '../ui/button';
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
      title="Session Expired"
      maxWidth="md"
      footer={
        <div className="w-full">
          <Button 
            onClick={onLogout}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]"
          >
            <LogIn className="h-4 w-4" />
            Sign In Again
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="h-20 w-20 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-900/5 ring-1 ring-amber-100"
        >
          <ShieldAlert className="h-10 w-10" />
        </motion.div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Security Timeout
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed px-4">
            Your clinical session has expired for security reasons. To protect patient data, you have been securely logged out.
          </p>
        </div>

        <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-widest">
          Authorized personnel only
        </div>
      </div>
    </Modal>
  );
};
