import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, LogOut, Mail, FileText, XCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const PendingVerification: React.FC = () => {
  const { user, logout } = useAuth();
  const profile = user?.profile;
  const status = profile?.verification_status || 'PENDING';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header Header */}
        <div className={`p-8 text-center ${status === 'REJECTED' ? 'bg-red-50' : 'bg-blue-50'}`}>
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-white shadow-sm">
            {status === 'REJECTED' ? (
              <XCircle className="h-8 w-8 text-red-500" />
            ) : status === 'APPROVED' ? (
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            ) : (
              <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-800">
            {status === 'REJECTED' ? 'Verification Rejected' : 'Verification Pending'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Status: <span className="font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200">{status}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {status === 'REJECTED' ? (
             <div className="space-y-4">
               <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                 <p className="text-xs font-bold text-red-400 uppercase mb-1">Reason for Rejection</p>
                 <p className="text-sm text-red-700 leading-relaxed font-medium">
                   {profile?.rejection_reason || "No specific reason provided. Please contact support."}
                 </p>
               </div>
               <p className="text-sm text-slate-600">
                 Please review the reason above, update your profile or documents, and reach out to the administration team to resubmit your application.
               </p>
             </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-slate-600 leading-relaxed">
                Thank you for joining <strong>DentoAI Diagnostics</strong>. Your dental credentials are currently being reviewed by our clinical administration team.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">License</p>
                  <p className="text-xs font-semibold text-slate-700 truncate">{profile?.license_number}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Documents</p>
                  <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                     <FileText className="h-3 w-3" /> Submitted
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <a 
              href="mailto:admin@dentoai.test" 
              className="w-full flex items-center justify-center gap-2 h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Administration
            </a>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 h-12 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
           <p className="text-[11px] text-slate-400">
             &copy; 2024 DentoAI Diagnostics Lab. Clinical Visionary Research.
           </p>
        </div>
      </motion.div>
    </div>
  );
};
