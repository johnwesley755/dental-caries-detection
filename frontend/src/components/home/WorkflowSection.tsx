// frontend/src/components/home/WorkflowSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  number: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  { number: '01', title: 'Neural Input', desc: 'Securely upload DICOM or radiographic imagery to the practice vault.' },
  { number: '02', title: 'Deep Analysis', desc: 'Our clinical-grade neural networks identify density anomalies in real-time.' },
  { number: '03', title: 'Clinical Report', desc: 'Generate annotated diagnostic reports for immediate clinical validation.' },
];

export const WorkflowSection: React.FC = () => {
  return (
    <div id="workflow" className="py-24 container mx-auto px-6 overflow-hidden">
      <div className="text-center mb-20 space-y-3">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] font-black text-primary uppercase tracking-[0.3em]"
        >
          Protocol
        </motion.p>
        <h2 className="text-3xl md:text-5xl font-headline font-black text-blue-900 uppercase">Seamless Diagnostics</h2>
      </div>

      <div className="relative flex flex-col md:flex-row gap-12 sm:gap-8 max-w-6xl mx-auto">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-10" />
        
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="flex-1 relative bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 text-center hover:border-primary/20 transition-all group hover:-translate-y-2 duration-500"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-[6px] border-slate-50 text-primary rounded-3xl flex items-center justify-center text-2xl sm:text-3xl font-black mx-auto mb-8 group-hover:scale-110 group-hover:border-primary/10 group-hover:rotate-6 transition-all shadow-xl shadow-primary/5">
              {step.number}
            </div>
            <h3 className="text-lg font-headline font-black mb-4 text-blue-900 uppercase tracking-tight">{step.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
