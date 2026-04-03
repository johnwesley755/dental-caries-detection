// frontend/src/components/home/WorkflowSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UploadCloud, BrainCircuit, FileDown } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Register Patient',
    desc: 'Dentist adds a patient to the system with their clinical profile and dental history.',
    icon: <UserPlus className="w-6 h-6 text-[#003d9b]" />,
  },
  {
    number: '02',
    title: 'Upload Image',
    desc: 'Upload an intraoral dental image (JPEG/PNG) directly from the browser.',
    icon: <UploadCloud className="w-6 h-6 text-[#003d9b]" />,
  },
  {
    number: '03',
    title: 'AI Analysis',
    desc: 'The system processes the image through the trained detection model in under 3 seconds.',
    icon: <BrainCircuit className="w-6 h-6 text-[#003d9b]" />,
  },
  {
    number: '04',
    title: 'View & Export Results',
    desc: 'Detection results with severity grades are displayed. Download the PDF clinical report.',
    icon: <FileDown className="w-6 h-6 text-[#003d9b]" />,
  },
];

export const WorkflowSection: React.FC = () => {
  return (
    <section id="workflow" className="py-6 sm:py-12 px-4 sm:px-8 max-w-screen-xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-[#001234] rounded-2xl sm:rounded-[2.5rem] px-6 sm:px-12 py-10 sm:py-16 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#003d9b]/30 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-10 sm:space-y-14">
          {/* Header */}
          <div className="text-center space-y-2 sm:space-y-3">
            <p className="text-xs font-black text-[#b2c5ff] tracking-widest">Clinical Protocol</p>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Simple 4-Step Clinical Workflow</h2>
            <p className="text-[#b2c5ff] font-medium text-sm max-w-lg mx-auto">
              Designed to integrate seamlessly into existing dental practice routines.
            </p>
          </div>

          {/* Steps — 2 col on mobile/tablet, 4 col on desktop */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Connector line — desktop only */}
            <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-px border-t-2 border-dashed border-white/15 z-0" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Icon card */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-[1.5rem] flex flex-col items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-[#003d9b]/20 border border-[#dae2ff]">
                  {step.icon}
                  <span className="text-[10px] sm:text-xs font-black text-[#003d9b] mt-1">{step.number}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-[#b2c5ff] text-xs sm:text-sm font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
