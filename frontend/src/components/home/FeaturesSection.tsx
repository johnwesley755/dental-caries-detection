// frontend/src/components/home/FeaturesSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, FileDown } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-black text-[#003d9b] mb-3 tracking-wide">System Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#131b2e] tracking-tight">
              Redefining Clinical Workflows.
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-sm">
              Leveraging multi-modal deep learning to assist dental specialists in rapid, accurate chairside diagnostics.
            </p>
          </div>
          <div className="h-1 w-16 sm:w-20 bg-[#003d9b] rounded-full hidden lg:block" />
        </div>

        {/* Bento Grid — stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:h-[580px]">

          {/* Large Card — full width on mobile, 2x2 on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-2 lg:row-span-2 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between group hover:bg-slate-50 transition-all shadow-sm ring-1 ring-slate-100"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#dae2ff] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#003d9b] transition-colors">
                <span className="material-symbols-outlined text-[#003d9b] group-hover:text-white text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>clinical_notes</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#131b2e] mb-3">
                Comprehensive Pathology Mapping.
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                The AI model identifies carious lesions across all tooth surfaces — from initial enamel demineralization to advanced dentinal decay — supporting informed clinical decision-making.
              </p>
            </div>
            <div className="mt-5 sm:mt-6 rounded-xl sm:rounded-2xl overflow-hidden h-36 sm:h-44 ring-1 ring-slate-100">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
                alt="Intraoral clinical examination"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Real-time Classification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="sm:col-span-2 lg:col-span-2 bg-[#eaedff] p-6 sm:p-7 rounded-2xl sm:rounded-3xl flex items-center gap-5 sm:gap-6 ring-1 ring-[#dae2ff] group"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-black text-[#003d9b]">Real-time Classification.</h3>
              <p className="text-slate-500 font-medium mt-2 text-sm">
                Instant analysis of dental images with sub-3 second latency for seamless clinical use.
              </p>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white rounded-full flex items-center justify-center border border-[#dae2ff] group-hover:scale-110 transition-transform shadow-sm">
              <Zap className="w-7 h-7 sm:w-9 sm:h-9 text-[#003d9b]" />
            </div>
          </motion.div>

          {/* Validated Dataset */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-[#f8faff] p-6 sm:p-7 rounded-2xl sm:rounded-3xl flex flex-col justify-between ring-1 ring-slate-100"
          >
            <ShieldCheck className="text-[#003d9b] w-7 h-7 sm:w-8 sm:h-8" />
            <div>
              <h4 className="font-black text-[#131b2e] text-base mt-4">Validated Dataset.</h4>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Trained on 10,000+ labeled intraoral images from UFBA-UESC.
              </p>
            </div>
          </motion.div>

          {/* PDF Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#003d9b] text-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl flex flex-col justify-between"
          >
            <FileDown className="w-7 h-7 sm:w-8 sm:h-8" />
            <div>
              <h4 className="font-black text-base mt-4">PDF Report Export.</h4>
              <p className="text-sm text-[#b2c5ff] font-medium mt-1">
                One-click clinical PDF with detection findings for each analysis.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
