// patient-portal/src/components/home/FeaturesSection.tsx
import React, { useRef } from 'react';
import { 
  Smartphone, 
  Shield, 
  TrendingUp, 
  Check,
  ArrowRight,
  MousePointer2
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- Feature Data ---
const features = [
  {
    id: 1,
    tag: "Accessibility",
    title: "Your dental health, anywhere.",
    description: "Access your complete dental history, X-rays, and treatment plans from any device. No more phone calls to get your records.",
    image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=2540&auto=format&fit=crop",
    icon: Smartphone,
    bg: "bg-white",
    text: "text-slate-900",
    accent: "bg-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    layout: "right"
  },
  {
    id: 2,
    tag: "Bank-Grade Security",
    title: "Fort Knox for your smile.",
    description: "We utilize AES-256 encryption and strict HIPAA-compliant protocols. Your private health data remains strictly between you and your doctor.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop",
    icon: Shield,
    bg: "bg-slate-950",
    text: "text-white",
    accent: "bg-emerald-500",
    badge: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
    layout: "left"
  },
  {
    id: 3,
    tag: "Smart Insights",
    title: "See the future of your teeth.",
    description: "Our AI analyzes your scans to predict potential issues before they happen. Track gum health and cavity risks on a visual timeline.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2532&auto=format&fit=crop",
    icon: TrendingUp,
    bg: "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100",
    text: "text-slate-900",
    accent: "bg-purple-600",
    badge: "bg-white/60 text-purple-700 border-purple-200 backdrop-blur",
    layout: "right"
  }
];

const FeatureCard = ({ feature, index, range }: { feature: typeof features[0], index: number, range: [number, number] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // Parallax effects for content
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  const isDark = feature.bg.includes('slate-950');
  const isRight = feature.layout === 'right';

  return (
    // STICKY CONTAINER: This is what creates the "stacking" effect
    <div 
      ref={containerRef} 
      className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden ${feature.bg}`}
    >
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 h-full ${!isRight ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* --- Text Content --- */}
          <motion.div 
            style={{ y, opacity }}
            className="flex-1 space-y-8 pt-20 lg:pt-0"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-widest ${feature.badge}`}>
              <feature.icon className="w-4 h-4" />
              {feature.tag}
            </div>

            <h2 className={`text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] ${feature.text}`}>
              {feature.title}
            </h2>

            <p className={`text-xl lg:text-2xl leading-relaxed max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {feature.description}
            </p>

            <ul className="space-y-4">
              {['Instant access', 'Secure encryption', '24/7 Availability'].map((item, i) => (
                <li key={i} className={`flex items-center gap-3 text-lg font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button className={`group mt-8 px-8 py-4 rounded-full text-lg font-bold text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 ${feature.accent}`}>
              Learn more
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* --- Image/Visual Content --- */}
          <motion.div 
            style={{ scale }}
            className="flex-1 w-full max-w-2xl"
          >
            <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl border ${isDark ? 'border-slate-800' : 'border-white'} group`}>
              
              {/* Floating UI Elements (Visily Style) */}
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              {/* Cursor Interaction Mockup */}
              <div className="absolute bottom-10 right-10 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-[3000ms]">
                 <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    <MousePointer2 className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Interaction</p>
                    <p className="text-sm font-bold text-slate-900">Click to expand</p>
                 </div>
              </div>

              {/* The Image */}
              <img 
                src={feature.image} 
                alt={feature.title} 
                className="w-full h-[50vh] object-cover object-top transform group-hover:scale-105 transition-transform duration-[1.5s]"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-950/80' : 'from-white/20'} to-transparent opacity-60`} />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export const FeaturesSection: React.FC = () => {
  return (
    <div className="relative w-full">
      {/* This wrapper ensures the stacking context works. 
        Each FeatureCard is h-screen and sticky.
      */}
      {features.map((feature, index) => (
        <FeatureCard 
          key={feature.id} 
          feature={feature} 
          index={index} 
          range={[index * 0.33, 1]}
        />
      ))}
    </div>
  );
};