// patient-portal/src/components/home/FeaturesSection.tsx
import React, { useRef } from 'react';
import { 
  Smartphone, 
  Shield, 
  TrendingUp, 
  Smile, 
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Activity
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// --- Feature Data ---
const features = [
  {
    id: 1,
    category: "Accessibility",
    title: "Your dental office, now in your pocket.",
    description: "No more calling for records. Securely view your X-rays, 3D scans, and treatment plans from any device, anywhere in the world.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    icon: Smartphone,
    theme: "light", // Light background with blue accents
    bgClass: "bg-white",
    accentColor: "text-blue-600",
    blobColor: "bg-blue-200",
    layout: "right" // Image on right
  },
  {
    id: 2,
    category: "Security First",
    title: "Bank-grade security for your peace of mind.",
    description: "We use AES-256 encryption and are fully HIPAA compliant. Your private health data stays private, accessible only by you and your doctor.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
    icon: Shield,
    theme: "dark", // Dark background for contrast
    bgClass: "bg-slate-900",
    accentColor: "text-emerald-400",
    blobColor: "bg-emerald-500",
    layout: "left" // Image on left
  },
  {
    id: 3,
    category: "Health Insights",
    title: "Visualize your progress like never before.",
    description: "Track your gum health, cavity risks, and treatment timeline with our smart dashboard. See the difference your daily habits make over time.",
    image: "https://images.unsplash.com/photo-1576091160550-2187d80aeff2?q=80&w=2070&auto=format&fit=crop",
    icon: TrendingUp,
    theme: "colorful", // Gradient background
    bgClass: "bg-gradient-to-br from-indigo-50 to-purple-50",
    accentColor: "text-purple-600",
    blobColor: "bg-purple-300",
    layout: "right" // Image on right
  }
];

// --- Individual Feature Slide Component ---
const FeatureSlide = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const isDark = feature.theme === 'dark';
  const isRight = feature.layout === 'right';
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });
  
  return (
    <section ref={ref} className={`relative min-h-screen flex items-center overflow-hidden py-20 ${feature.bgClass}`}>
      
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={isInView ? { opacity: 0.4, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5 }}
          className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-multiply ${feature.blobColor} ${isRight ? '-left-20 top-20' : '-right-20 bottom-20'}`} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${!isRight ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Icon & Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white shadow-md'}`}>
                  <feature.icon className={`h-6 w-6 ${feature.accentColor}`} />
                </div>
                <span className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {feature.category}
                </span>
              </div>

              {/* Title */}
              <h2 className={`text-4xl lg:text-6xl font-extrabold leading-[1.1] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {feature.title}
              </h2>

              {/* Description */}
              <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {feature.description}
              </p>

              {/* Action/List */}
              <div className="space-y-4">
                {['Real-time Updates', 'AI Analysis', 'Secure Sharing'].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className={`h-5 w-5 ${feature.accentColor}`} />
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-10 px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
                  isDark 
                    ? 'bg-white text-slate-900 hover:bg-slate-100' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Visual Content (Image/Mockup) */}
          <div className="lg:w-1/2 w-full perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: isRight ? 15 : -15, x: isRight ? 50 : -50 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Main Card */}
              <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl border ${isDark ? 'border-slate-700/50' : 'border-white/50 bg-white'}`}>
                
                {/* Floating Badge (Visily Style) */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-8 z-20 bg-white/90 backdrop-blur-xl p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3"
                >
                  <div className={`p-2 rounded-lg ${feature.blobColor} bg-opacity-20`}>
                    <feature.icon className={`h-5 w-5 ${feature.accentColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                    <p className="text-sm font-bold text-slate-900">Active & Secure</p>
                  </div>
                </motion.div>

                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-auto object-cover min-h-[400px] lg:min-h-[600px] hover:scale-105 transition-transform duration-[2s]"
                />
                
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-900/80 via-transparent' : 'from-white/20 via-transparent'} to-transparent`} />
              </div>

              {/* Decorative Elements behind card */}
              <div className={`absolute -z-10 top-10 ${isRight ? '-right-10' : '-left-10'} w-full h-full rounded-[2.5rem] border-2 border-dashed ${isDark ? 'border-slate-700' : 'border-slate-300'} opacity-50`} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export const FeaturesSection: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {features.map((feature, index) => (
        <FeatureSlide key={feature.id} feature={feature} index={index} />
      ))}
      
      {/* Final CTA Section */}
      <section className="min-h-[60vh] bg-slate-900 flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
         </div>
         
         <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
            >
               <Smile className="h-20 w-20 text-blue-500 mx-auto mb-8" />
               <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                  Ready to smile brighter?
               </h2>
               <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  Join thousands of patients experiencing the future of dental care today.
               </p>
               <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white text-lg rounded-full font-bold transition-all shadow-xl shadow-blue-900/50 hover:scale-105 hover:-translate-y-1">
                  Create Your Free Account
               </button>
            </motion.div>
         </div>
      </section>
    </div>
  );
};