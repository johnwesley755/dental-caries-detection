// frontend/src/components/home/StatisticsSection.tsx
import React from 'react';
import { Users, TrendingUp, ShieldCheck, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatisticsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Patients Diagnosed',
      color: 'primary'
    },
    {
      icon: Microscope,
      value: '2.4M',
      label: 'Radiograph Samples',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      value: '99.8%',
      label: 'Validated Accuracy',
      color: 'indigo'
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'GDPR / HIPAA Vault',
      color: 'emerald'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/5 text-primary border-primary/10';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'indigo': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50" />
      
      <div className="max-w-[90rem] mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl text-left">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4"
            >
              Performance Metrics
            </motion.p>
            <h2 className="text-3xl sm:text-5xl font-headline font-black text-blue-900 uppercase leading-[1.1]">
              Trusted By Clinical <br className="hidden sm:block" /> Leaders Worldwide
            </h2>
          </div>
          <p className="text-slate-500 font-bold text-sm sm:text-lg max-w-sm text-left lg:text-right border-l-4 lg:border-l-0 lg:border-r-4 border-primary px-6 py-2">
            Automating diagnostic precision for modern dental practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50 hover:shadow-primary/5 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${getColorClasses(stat.color)} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-4xl font-black text-blue-900 mb-2 tracking-tighter uppercase font-headline">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
