// frontend/src/components/home/WorkflowSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  number: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  { number: '01', title: 'Upload Scans', desc: 'Securely upload X-ray or intraoral images.' },
  { number: '02', title: 'AI Processing', desc: 'Our neural network analyzes density patterns.' },
  { number: '03', title: 'Diagnosis', desc: 'Receive annotated reports with treatment suggestions.' },
];

export const WorkflowSection: React.FC = () => {
  return (
    <div className="py-24 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-16">Workflow Simplified</h2>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10" />
        
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-blue-200 transition-colors group"
          >
            <div className="w-24 h-24 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:border-blue-100 transition-all shadow-lg shadow-blue-50">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
