// frontend/src/components/home/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  FileText,
  X,
  Stethoscope,
  Zap,
  ShieldCheck,
  ScanLine,
  ChevronRight,
  Brain,
  Database,
  Cloud,
  Lock,
  UploadCloud
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- Background Icon Component ---
const BackgroundIcon = ({ icon: Icon, className, delay }: { icon: React.ElementType, className: string, delay: number }) => (
  <motion.div 
    className={`absolute text-blue-200/40 ${className}`}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 1, 
      y: [0, -20, 0], 
      rotate: [0, 5, -5, 0],
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
  >
    <Icon strokeWidth={1.5} className="w-full h-full" />
  </motion.div>
);

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Scroll & Parallax Hooks ---
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]); 
  const yMockup = useTransform(scrollY, [0, 500], [0, -50]); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-surface selection:bg-primary/20 selection:text-primary font-inter">
      
      {/* 1. AMBIENT BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-50/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] mix-blend-multiply" />

        {/* Floating Icons */}
        <motion.div style={{ y: yBackground }} className="absolute inset-0 w-full h-full">
            <BackgroundIcon icon={Brain} className="w-16 h-16 sm:w-24 sm:h-24 top-32 left-[5%]" delay={0} />
            <BackgroundIcon icon={Cloud} className="w-12 h-12 sm:w-20 sm:h-20 top-20 right-[10%]" delay={1} />
            <BackgroundIcon icon={Database} className="w-10 h-10 sm:w-16 sm:h-16 top-[40%] left-[15%]" delay={2} />
            <BackgroundIcon icon={Activity} className="w-10 h-10 sm:w-16 sm:h-16 top-[35%] right-[20%]" delay={3} />
            <BackgroundIcon icon={Lock} className="w-8 h-8 sm:w-14 sm:h-14 bottom-[20%] left-[8%]" delay={4} />
            <BackgroundIcon icon={ShieldCheck} className="w-12 h-12 sm:w-20 sm:h-20 bottom-[10%] right-[5%]" delay={5} />
        </motion.div>
      </div>

      {/* 2. STICKY NAVIGATION HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 active:scale-95">
              <Stethoscope className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="text-xl font-headline font-black text-blue-900 tracking-tight">
              DentalAI<span className="text-primary-container">.Dx</span>
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {['Detection', 'How it Works', 'Case Studies', 'Pricing'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 transition-colors">
              Vault Access
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
            >
              Start Practice
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-blue-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <span className="material-symbols-outlined text-3xl">menu</span>}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-8 flex flex-col gap-6">
                {['Detection', 'Workflow', 'Pricing'].map((item) => (
                  <a key={item} href="#" className="text-sm font-black uppercase tracking-widest text-slate-500">{item}</a>
                ))}
                <hr className="border-slate-50" />
                <button onClick={() => navigate('/login')} className="text-left text-sm font-black uppercase tracking-widest text-blue-900">Vault Access</button>
                <button onClick={() => navigate('/register')} className="w-full py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">Secure Instance</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. MAIN HERO CONTENT AREA */}
      <section className="relative pt-32 pb-20 sm:pt-40 lg:pt-56 flex flex-col items-center z-10">
        
        <div className="w-full max-w-[85rem] mx-auto px-6 text-center relative z-20">
          
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 text-blue-900 text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm hover:shadow-xl transition-all cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span>Neural Engine v4.0 Active</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-black tracking-tight text-blue-900 leading-[1.05] mb-8 lg:px-4">
             AI PRECISION FOR <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
              CLINICAL EXCELLENCE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-tight opacity-70">
            Automated detection of dental caries with peer-reviewed precision. <br className="hidden sm:block" />
            Empowering dentists with real-time neural diagnostics.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto h-16 px-10 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
                <Sparkles className="w-5 h-5" />
                <span>Initialize Practice</span>
                <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => document.getElementById('demo')?.scrollIntoView()}
              className="w-full sm:w-auto h-16 px-10 bg-white text-slate-500 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
            >
              <ScanLine className="w-5 h-5 opacity-50" />
              View Neural Scan
            </button>
          </div>
        </div>

        {/* 4. ENHANCED MOCKUP INTERFACE */}
        <motion.div 
          style={{ y: typeof window !== 'undefined' && window.innerWidth > 1024 ? yMockup : 0 }}
          className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        >
          <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-6 shadow-2xl ring-1 ring-slate-100">
            
            <div className="rounded-[1.5rem] sm:rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-4 sm:p-8 min-h-[400px] flex flex-col xl:flex-row gap-6 sm:gap-8">
              
              {/* --- LEFT CARD: Input --- */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-100/50 group hover:border-primary/20 transition-all duration-500">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-headline font-black text-blue-900 mb-3 uppercase tracking-tight text-left">SOURCE UPLOAD</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed font-bold text-left">
                    Accepts panoramic, periapical, and bitewing radiographic imagery.
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm relative overflow-hidden cursor-pointer group/item">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600">DICOM</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-700 truncate uppercase tracking-widest">patient_042_rx.dcm</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Ready for compute</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 opacity-60 transition-opacity cursor-not-allowed">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[10px] font-black text-slate-300">BITW</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-400 truncate uppercase tracking-widest">processing_active...</p>
                      </div>
                      <UploadCloud className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20 group">
                  <div className="relative z-10 h-full flex flex-col justify-center text-left">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                       <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-headline font-black mb-2 uppercase tracking-tight">LATENCY &lt; 2S</h3>
                    <p className="text-primary-container text-xs font-bold uppercase tracking-widest">Real-time inference on edge.</p>
                  </div>
                  <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125" />
                </div>
              </div>

              {/* --- RIGHT CARD: Preview --- */}
              <div className="flex-[1.6] bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden">
                <div className="h-16 border-b border-slate-50 px-6 sm:px-8 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Neural Projection</h3>
                    <div className="h-4 w-px bg-slate-100" />
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">
                      <ShieldCheck className="w-3 h-3" /> SECURE BASE
                    </span>
                  </div>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline hidden sm:flex items-center gap-2">
                    GENERATE REPORT <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 p-4 sm:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 bg-slate-50/50">
                  <div className="flex-[1.5] relative rounded-3xl overflow-hidden bg-slate-900 aspect-video lg:aspect-auto border border-slate-200">
                    <img 
                      src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
                      className="w-full h-full object-cover opacity-60 grayscale"
                      alt="Neural Scan"
                    />
                    
                    <motion.div 
                      className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_20px_rgba(37,99,235,0.8)] z-20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 z-30">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                       </span>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE DETECTION</span>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="absolute top-[35%] left-[45%] w-20 h-20 border-2 border-red-500 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] bg-red-500/10 z-10"
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xl tracking-tighter">
                        CARIES: 99.2%
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Confidence</span>
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-black text-blue-900">99.8%</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Optimal</span>
                      </div>
                      <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden ring-1 ring-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '99.8%' }}
                          transition={{ duration: 1.5 }}
                          className="bg-primary h-full rounded-full" 
                        />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col justify-center text-left">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Critical Findings</h4>
                      <ul className="space-y-4">
                        {[
                          { color: 'bg-red-500', label: 'Dentin Caries', loc: 'Tooth 37' },
                          { color: 'bg-primary', label: 'Neural Marker', loc: 'Tooth 36' },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.color} ring-4 ring-slate-50`} />
                            <div>
                              <p className="text-xs font-black text-slate-700 leading-none mb-1 uppercase tracking-tight">{item.label}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.loc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </section>
    </div>
  );
};