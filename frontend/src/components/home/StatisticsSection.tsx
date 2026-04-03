// frontend/src/components/home/StatisticsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MetricBarProps {
  label: string;
  value: number;
  display: string;
  delay?: number;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, display, delay = 0 }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center gap-4">
      <span className="font-bold text-xs text-[#b2c5ff] leading-snug flex-1">{label}</span>
      <span className="font-black text-xl sm:text-2xl text-white shrink-0">{display}</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        className="h-full bg-[#708cfd] rounded-full"
      />
    </div>
  </div>
);

export const StatisticsSection: React.FC = () => {
  const metrics: MetricBarProps[] = [
    { label: 'Mean Average Precision (mAP)', value: 94.2, display: '0.942', delay: 0 },
    { label: 'Recall — UFBA-UESC Test Set', value: 91.8, display: '0.918', delay: 0.15 },
    { label: 'F1-Score Performance', value: 93.0, display: '0.930', delay: 0.3 },
  ];

  return (
    <section id="results" className="py-6 sm:py-12 px-4 sm:px-8 max-w-screen-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#131b2e] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-20 overflow-hidden relative"
      >
        {/* Decorative right glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-gradient-to-l from-[#003d9b] to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Metrics */}
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-black text-[#b2c5ff] tracking-widest">Model Performance</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Benchmarking Excellence.
              </h2>
              <p className="text-[#b2c5ff] text-sm sm:text-base font-medium leading-relaxed">
                Rigorous empirical testing against the UFBA-UESC Dental Dataset demonstrates the clinical-grade performance of the detection model.
              </p>
            </div>
            <div className="space-y-6 sm:space-y-8">
              {metrics.map((m) => (
                <MetricBar key={m.label} {...m} />
              ))}
            </div>
          </div>

          {/* Right — Mini stat cards */}
          <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Image card */}
              <div className="col-span-2 aspect-video bg-[#001234]/60 rounded-xl sm:rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
                  alt="Clinical dental examination intraoral view"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-black text-white mb-1">UFBA-UESC</div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#b2c5ff] tracking-widest">Validated Dataset</div>
                  </div>
                </div>
              </div>
              {/* Precision */}
              <div className="p-4 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
                <p className="text-xs font-black text-[#b2c5ff] mb-1">Precision</p>
                <p className="text-2xl sm:text-3xl font-black text-white">96.4%</p>
              </div>
              {/* Sensitivity */}
              <div className="p-4 sm:p-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
                <p className="text-xs font-black text-[#b2c5ff] mb-1">Sensitivity</p>
                <p className="text-2xl sm:text-3xl font-black text-white">89.1%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
