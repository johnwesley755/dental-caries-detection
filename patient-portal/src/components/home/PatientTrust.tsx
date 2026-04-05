// patient-portal/src/components/home/PatientTrust.tsx
import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  FileText,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
  { icon: ShieldCheck, label: "HIPAA Compliant", sub: "Secure health data" },
  { icon: Lock, label: "AES-256 Encryption", sub: "Personal privacy" },
  { icon: Award, label: "FYP Innovation", sub: "Top clinical model" },
  { icon: FileText, label: "Clinical Standards", sub: "ISO 27001 Ready" },
  { icon: Activity, label: "92% Accuracy", sub: "Validated results" }
];

export const PatientTrust: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-12 text-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Scientific Foundation</h4>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">Built for Professional Standards.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {trustItems.map((item, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:text-primary group-hover:scale-110 transition-all">
                        <item.icon className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{item.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.sub}</span>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
