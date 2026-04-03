// frontend/src/components/home/FeaturesSection.tsx
import React from 'react';
import { Activity, Shield, Zap, Users, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const features: Feature[] = [
  {
    icon: Activity,
    title: 'Neural Diagnosis',
    description: 'Precision-first deep learning models identifying clinical caries with 99.8% validated accuracy.',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/10'
  },
  {
    icon: Shield,
    title: 'Secure Vault',
    description: 'HIPAA-compliant architecture with end-to-end encryption for every radiographic asset.',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100'
  },
  {
    icon: Zap,
    title: 'Edge Inference',
    description: 'Optimized neural pipelines delivering instant diagnostic insights in less than 2 seconds.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100'
  },
  {
    icon: Users,
    title: 'Clinical Pulse',
    description: 'Centralized patient management for long-term health tracking and automated reporting.',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-100'
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <div id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-3">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-primary uppercase tracking-[0.3em]"
          >
            Capabilities
          </motion.p>
          <h2 className="text-3xl md:text-5xl font-headline font-black text-blue-900 uppercase">Engineered for Precision</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-bold text-sm sm:text-base">Built on a foundational dataset of over 2 Million expert-annotated radiographs.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className={`h-full border-none shadow-xl shadow-slate-100/50 rounded-3xl transition-all duration-500 overflow-hidden group-hover:shadow-primary/10 relative`}>
                <div className={`absolute top-0 left-0 w-full h-[2px] ${feature.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className={`h-16 w-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-8 border ${feature.borderColor} group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-headline font-black text-blue-900 mb-4 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
