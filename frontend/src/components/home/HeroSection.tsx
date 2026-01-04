// frontend/src/components/home/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  FileText,
  Menu,
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
  Feather,
  UploadCloud
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- Background Icon Component ---
const BackgroundIcon = ({ icon: Icon, className, delay }: { icon: any, className: string, delay: number }) => (
  <motion.div 
    className={`absolute text-slate-200/60 ${className}`}
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
  const yMockup = useTransform(scrollY, [0, 500], [0, -80]); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-50/50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* =========================================
          1. AMBIENT BACKGROUND LAYER
      ========================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft Colorful Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-100/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-indigo-50/50 rounded-full blur-[100px] mix-blend-multiply" />

        {/* Floating Icons */}
        <motion.div style={{ y: yBackground }} className="absolute inset-0 w-full h-full">
            <BackgroundIcon icon={Brain} className="w-24 h-24 top-32 left-[5%]" delay={0} />
            <BackgroundIcon icon={Cloud} className="w-20 h-20 top-20 right-[10%]" delay={1} />
            <BackgroundIcon icon={Database} className="w-16 h-16 top-[40%] left-[15%]" delay={2} />
            <BackgroundIcon icon={Activity} className="w-16 h-16 top-[35%] right-[20%]" delay={3} />
            <BackgroundIcon icon={Lock} className="w-14 h-14 bottom-[20%] left-[8%]" delay={4} />
            <BackgroundIcon icon={ShieldCheck} className="w-20 h-20 bottom-[10%] right-[5%]" delay={5} />
        </motion.div>
      </div>

      {/* =========================================
          2. STICKY NAVIGATION HEADER
      ========================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 py-3 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative w-9 h-9 flex items-center justify-center bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="w-5 h-5 text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              DentalAI<span className="text-indigo-600">.Dx</span>
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Features', 'Technology', 'Pricing', 'Resources'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {['Features', 'Technology', 'Pricing'].map((item) => (
                  <a key={item} href="#" className="text-base font-medium text-slate-600 py-2">{item}</a>
                ))}
                <hr className="border-slate-100" />
                <button onClick={() => navigate('/login')} className="text-left font-semibold text-slate-900 py-2">Log in</button>
                <button onClick={() => navigate('/register')} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold">Get Started</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================
          3. MAIN HERO CONTENT AREA
      ========================================= */}
      <section className="relative pt-36 pb-20 lg:pt-48 flex flex-col items-center z-10">
        
        {/* Animated Props (Feather/Sparkles) */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%] hidden 2xl:block"
        >
          <Sparkles className="w-16 h-16 text-yellow-400 drop-shadow-sm" fill="rgba(250, 204, 21, 0.2)" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-[10%] hidden 2xl:block"
        >
          <Feather className="w-16 h-16 text-purple-400 drop-shadow-sm" strokeWidth={1.5} />
        </motion.div>


        <div className="w-full max-w-[85rem] mx-auto px-4 text-center relative z-20">
          
          {/* Version Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <span>New: Auto-Report Generation v2.0</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-8">
            Make your diagnostics look <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              as good as they sound
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
            DentalAI helps professionals quickly convey clinical findings to patients and colleagues, 
            with precision and ease.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <button
              onClick={() => navigate('/register')}
              className="group relative h-14 px-8 bg-indigo-600 text-white rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5 fill-indigo-200/50" />
                <span>Start Analyzing Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button 
              onClick={() => document.getElementById('demo')?.scrollIntoView()}
              className="h-14 px-8 bg-white text-slate-600 border border-slate-200 rounded-2xl text-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <ScanLine className="w-5 h-5 text-slate-400" />
              View Sample Report
            </button>
          </div>
        </div>


        {/* =========================================
            4. ENHANCED MOCKUP INTERFACE
        ========================================= */}
        <motion.div 
          style={{ y: yMockup }}
          className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 perspective-[2000px]"
        >
          {/* Main Glass Container */}
          <div className="relative bg-white rounded-[3rem] p-4 md:p-8 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.12)] ring-1 ring-slate-900/5 backdrop-blur-sm">
            
            {/* Inner Content Area */}
            <div className="rounded-[2.5rem] bg-gradient-to-b from-slate-50/80 to-white border border-slate-100 p-6 md:p-10 min-h-[600px] flex flex-col xl:flex-row gap-8">
              
              {/* --- LEFT CARD: Upload Source --- */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 group hover:border-indigo-100 transition-colors duration-300">
                  
                  {/* Icon Header */}
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-7 h-7 text-indigo-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Start from any source</h3>
                  <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                    Upload OPG X-rays, Bitewings, or intraoral camera images directly.
                  </p>

                  {/* Upload List */}
                  <div className="flex flex-col gap-3">
                    {/* Active Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-green-100 shadow-[0_4px_20px_-10px_rgba(22,163,74,0.15)] relative overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500" />
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xs font-bold text-green-700">JPG</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-700 truncate">patient_scan_001.jpg</p>
                        <p className="text-xs text-green-600 font-bold">Ready for analysis</p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                    </div>

                    {/* Pending Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">DCM</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-500 truncate">dicom_batch_22.zip</p>
                      </div>
                      <UploadCloud className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Instant Analysis Card (Purple Gradient) */}
                <div className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20 group hover:shadow-indigo-500/30 transition-shadow">
                  {/* Subtle Noise Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                       <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Instant Analysis</h3>
                    <p className="text-indigo-100 text-lg">AI processing in &lt; 2 seconds.</p>
                  </div>
                  {/* Decorative Glow */}
                  <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 ease-in-out" />
                </div>
              </div>

              {/* --- RIGHT CARD: Dashboard Analysis --- */}
              <div className="flex-[1.6] bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden group">
                {/* Dashboard Toolbar */}
                <div className="h-16 border-b border-slate-100 px-8 flex items-center justify-between bg-white relative z-10">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-800">Analysis Results</h3>
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                      <ShieldCheck className="w-3 h-3" /> HIPAA Compliant
                    </span>
                  </div>
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline decoration-2 underline-offset-4">
                    Export Report <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 p-8 flex flex-col lg:flex-row gap-8 bg-slate-50/30">
                  
                  {/* X-Ray Viewer */}
                  <div className="flex-[1.5] relative rounded-2xl overflow-hidden bg-slate-900 group-hover:shadow-md transition-shadow border border-slate-200">
                    <img 
                      src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
                      className="w-full h-full object-cover opacity-90"
                      alt="Dental Analysis"
                    />
                    
                    {/* Scanning Animation Line */}
                    <motion.div 
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* AI Layer Active Badge */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 shadow-lg z-30">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                       </span>
                       <span className="text-xs font-bold text-white tracking-wide">AI Layer Active</span>
                    </div>

                    {/* Detected Box */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-[30%] left-[40%] w-24 h-24 border-2 border-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] bg-red-500/10 z-10"
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                        Caries (98%)
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Sidebar Stats */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Confidence Widget */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence</span>
                        <Activity className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-4xl font-bold text-slate-800">98.5%</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">High Accuracy</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '98.5%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="bg-indigo-600 h-full rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" 
                        />
                      </div>
                    </div>

                    {/* Findings List */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Detected Issues</h4>
                      <ul className="space-y-4">
                        {[
                          { color: 'bg-red-500', label: 'Approximal Caries', loc: 'Tooth 46', severe: true },
                          { color: 'bg-yellow-400', label: 'Enamel Lesion', loc: 'Tooth 45', severe: false },
                          { color: 'bg-green-500', label: 'Bone Density', loc: 'Normal', severe: false },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
                            <span className={`w-3 h-3 rounded-full ${item.color} shadow-sm ring-2 ring-white`} />
                            <div>
                              <p className="text-sm font-bold text-slate-700 leading-none mb-1">{item.label}</p>
                              <p className="text-xs text-slate-400 font-medium">{item.loc}</p>
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