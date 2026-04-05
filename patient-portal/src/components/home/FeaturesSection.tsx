// patient-portal/src/components/home/FeaturesSection.tsx
import React from 'react';
import { 
  Smartphone, 
  Sparkles, 
  ArrowRight,
  MessageSquare,
  History,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Feature Data (Patient Oriented) ---
const features = [
  {
    id: 1,
    title: "Instant AI Feedback",
    description: "Get immediate insights into your dental health. Our AI highlights potential issues before they become painful or expensive.",
    icon: Sparkles,
    color: "blue"
  },
  {
    id: 2,
    title: "Secure Messaging",
    description: "Connect directly with your clinical team. Private, encrypted chat for all your questions and follow-up care.",
    icon: MessageSquare,
    color: "emerald"
  },
  {
    id: 3,
    title: "Clean Dental History",
    description: "Access your X-rays and treatment plans in plain English. No more confusing medical jargon—just clear health data.",
    icon: History,
    color: "indigo"
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const isEmerald = feature.color === 'emerald';
  const isIndigo = feature.color === 'indigo';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
    >
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
        isEmerald ? 'bg-emerald-50 text-emerald-600' : 
        isIndigo ? 'bg-indigo-50 text-indigo-600' : 
        'bg-blue-50 text-blue-600'
      }`}>
        <feature.icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
        {feature.title}
      </h3>

      <p className="text-slate-500 font-bold leading-relaxed mb-8">
        {feature.description}
      </p>

      <div className="flex items-center gap-2 text-sm font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        Discover more
        <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
      </div>
      
      {/* Subtle Glow */}
      <div className={`absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10 ${
        isEmerald ? 'bg-emerald-400/10' : 
        isIndigo ? 'bg-indigo-400/10' : 
        'bg-blue-400/10'
      }`} />
    </motion.div>
  );
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-emerald-50/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                <Smartphone className="w-3.5 h-3.5" />
                Patient Experience
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
                Designed for <br/>
                <span className="text-primary">your peace of mind.</span>
            </h2>
            <p className="text-xl text-slate-500 font-bold leading-relaxed tracking-tight">
                DentoAI isn't just about code—it's about making your next dental visit stress-free, informed, and private.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.id} 
              feature={feature} 
              index={index}
            />
          ))}
        </div>

        {/* Security Banner */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 rounded-3xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8"
        >
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                    <Lock className="w-7 h-7" />
                </div>
                <div>
                   <h4 className="text-xl font-black tracking-tight mb-1">Bank-Grade Security</h4>
                   <p className="text-slate-400 font-bold text-sm">Your data is AES-256 encrypted and HIPAA compliant.</p>
                </div>
            </div>
            <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 w-12 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden">
                        <img 
                            src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                            alt="User" 
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                ))}
                <div className="h-12 px-4 rounded-full border-4 border-slate-900 bg-emerald-600 flex items-center justify-center text-xs font-black">
                    Join 2k+ Patients
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};