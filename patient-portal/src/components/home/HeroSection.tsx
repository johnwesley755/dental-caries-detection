// patient-portal/src/pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Calendar, 
  Stethoscope,
  Menu,
  X,
  Lock
} from 'lucide-react';

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const float = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

const floatReverse = {
  animate: {
    y: [0, 20, 0],
    rotate: [0, -5, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
  }
};

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Parallax Hooks ---
  const { scrollY } = useScroll();
  
  // Background moves slower (creating depth behind)
  const yBg = useTransform(scrollY, [0, 1000], [0, 400]); 
  
  // Text moves slightly down (lingers)
  const yText = useTransform(scrollY, [0, 500], [0, 100]); 
  
  // Mockup moves slightly up (lifts off page)
  const yMockup = useTransform(scrollY, [0, 500], [0, -50]); 

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // No specific font class, inheriting global font
    <div className="relative min-h-screen w-full overflow-hidden bg-white selection:bg-blue-100 text-slate-900">
      
      {/* ==============================================
          GLOBAL MESH GRADIENT BACKGROUND (With Parallax)
      =============================================== */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1000px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(99,102,241,0.1)_40%,transparent_70%)] blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(20,184,166,0.12)_0%,transparent_60%)] blur-[100px]" />
        <div className="absolute bottom-0 left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] blur-[100px]" />
      </motion.div>

      {/* ==============================================
          HEADER / NAVBAR (Fixed on Top)
      =============================================== */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-4 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">DentAI</span>
                 <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mt-0.5">Patient Portal</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="h-12 rounded-full bg-slate-900 px-8 text-base font-semibold text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-full hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="h-12 rounded-full bg-blue-600 px-8 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-6 space-y-4 shadow-xl"
            >
              {isAuthenticated ? (
                <Button onClick={() => navigate('/dashboard')} className="w-full h-12 text-lg">Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="w-full justify-start h-12 text-lg font-semibold">Sign In</Button>
                  <Button onClick={() => navigate('/register')} className="w-full bg-blue-600 text-white h-12 text-lg font-semibold">Get Started</Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==============================================
          HERO SECTION CONTENT
      =============================================== */}
      {/* Significantly reduced padding to tighten layout */}
      <div className="container relative z-10 mx-auto px-4 pt-32 pb-12 lg:pt-40 lg:pb-16 flex flex-col items-center">
        
        {/* Text Content with Parallax */}
        <motion.div 
          style={{ y: yText }} 
          className="max-w-5xl w-full text-center relative"
        >
          
          {/* Floating 3D Elements */}
          <motion.div variants={float} animate="animate" className="absolute -top-8 -left-4 lg:left-0 text-teal-500 hidden lg:block">
            <ShieldCheck className="h-20 w-20 drop-shadow-2xl fill-teal-50/50" />
          </motion.div>
          <motion.div variants={floatReverse} animate="animate" className="absolute -top-4 -right-4 lg:right-0 text-indigo-500 hidden lg:block">
            <Sparkles className="h-16 w-16 drop-shadow-2xl fill-indigo-50/50" />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="space-y-8" // Reduced spacing
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/60 border border-blue-200 text-blue-700 text-sm font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ring-1 ring-white/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                New: AI Analysis v2.0
              </span>
            </motion.div>

            {/* Headline - Larger */}
            <motion.h1 variants={fadeInUp} className="text-6xl lg:text-8xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
              Your dental health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 pb-2">
                clearly explained.
              </span>
            </motion.h1>

            {/* Subtext - Larger */}
            <motion.p variants={fadeInUp} className="text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Experience a new standard of dental care. Access your records, view smart AI diagnostic reports, and understand your treatment plan instantly.
            </motion.p>

            {/* CTA Button - Centered */}
            <motion.div variants={fadeInUp} className="pt-6 flex justify-center">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="h-16 px-12 text-xl rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-900/30 transition-all hover:scale-105 hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/login')}
                  className="h-16 px-12 text-xl rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 hover:-translate-y-1"
                >
                  Check My Records
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* --- VISUAL MOCKUP (Browser Window Style) --- */}
        {/* Reduced margin top to tighten layout */}
        <motion.div 
          style={{ y: yMockup }} 
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 w-full max-w-7xl px-4"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/20 border-[6px] border-white bg-white ring-1 ring-slate-900/5">
            
            {/* Fake Browser Toolbar */}
            <div className="h-14 bg-slate-50/80 backdrop-blur border-b border-slate-100 flex items-center px-6 gap-3">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-400/80 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80 shadow-sm" />
              </div>
              <div className="mx-auto bg-white border border-slate-200 rounded-xl px-6 py-1.5 text-xs text-slate-400 font-medium w-80 text-center shadow-sm flex items-center justify-center gap-2">
                <Lock className="h-3 w-3 text-slate-300" />
                secure.dentai.com/patient/dashboard
              </div>
            </div>

            {/* Dashboard Preview Image */}
            <div className="relative bg-slate-50">
              
              {/* Floating Cards (Decorations) */}
              <motion.div 
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute top-12 left-12 z-20 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 hidden lg:block transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Next Appointment</p>
                    <p className="text-lg font-bold text-slate-900">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 40, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-12 right-12 z-20 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 hidden lg:block transform rotate-3 hover:rotate-0 transition-transform duration-500"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <Activity className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">AI Analysis</p>
                    <p className="text-lg font-bold text-emerald-700">Healthy • No Cavities</p>
                  </div>
                </div>
              </motion.div>

              {/* Main Image */}
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2532&auto=format&fit=crop"
                alt="Patient Dashboard Mockup"
                className="w-full h-auto object-cover max-h-[800px] opacity-95"
              />
              
              {/* Gradient Fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Glow Behind Mockup */}
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 opacity-40 blur-3xl -z-10 rounded-[4rem]" />
        </motion.div>
      </div>
    </div>
  );
};