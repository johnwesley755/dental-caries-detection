// frontend/src/components/home/TestimonialsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Database, Stethoscope } from 'lucide-react';

interface FoundationCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const cards: FoundationCard[] = [
  {
    icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#003d9b]" />,
    title: 'Institutional Review',
    description: 'Fully compliant with institutional board protocols for patient data anonymization and ethical research standards.',
  },
  {
    icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#003d9b]" />,
    title: 'Open Methodology',
    description: 'Transparent model architectures and preprocessing pipelines available for peer review and academic replication.',
  },
  {
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#003d9b]" />,
    title: 'Data Diversity',
    description: 'Robust training incorporating diverse patient demographics and varying radiographic image qualities.',
  },
  {
    icon: <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-[#003d9b]" />,
    title: 'Clinical Validation',
    description: 'Pilot program conducted with dental practitioners to refine the chairside user experience and clinical utility.',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="team" className="py-16 sm:py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">

          {/* Left — About the Project */}
          <div className="lg:col-span-1 space-y-5 sm:space-y-6">
            <div>
              <p className="text-xs font-black text-[#003d9b] tracking-wide mb-3">About the Project</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight">Academic Foundations.</h2>
            </div>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              This project represents a final year deep dive into dental informatics, bridging the gap between clinical expertise and computational intelligence through AI-assisted diagnostics.
            </p>
            <div className="p-5 sm:p-6 bg-[#eaedff] rounded-xl sm:rounded-2xl border border-[#dae2ff]">
              <p className="text-sm font-bold text-[#003d9b] italic leading-relaxed">
                "The integration of AI in dental diagnostics is not just a tool for efficiency, but a necessity for diagnostic consistency across general practice."
              </p>
              <p className="mt-3 sm:mt-4 text-xs font-black text-[#131b2e]">— Principal Researcher</p>
            </div>
          </div>

          {/* Right — 4 Research Credibility Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col p-5 sm:p-7 bg-white rounded-2xl sm:rounded-3xl shadow-sm ring-1 ring-slate-100 hover:ring-[#dae2ff] transition-all"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#eaedff] rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  {card.icon}
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#131b2e] mb-2">{card.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed flex-grow">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
