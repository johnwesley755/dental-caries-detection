// frontend/src/components/home/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, Stethoscope, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['About', 'Features', 'Results', 'Team'];

  return (
    <div className="relative w-full min-h-screen bg-white font-['Inter',sans-serif]">

      {/* Solid Sticky Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#001234] ${
          isScrolled ? 'shadow-lg border-b border-white/10' : 'border-b border-white/5'
        }`}
      >

        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          {/* Brand */}
          <div
            className="text-lg sm:text-xl font-black text-white tracking-tight cursor-pointer select-none"
            onClick={() => navigate('/')}
          >
            DentAI Diagnostics
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-slate-300 font-medium hover:text-white transition-colors text-sm px-4 py-1.5 rounded-full hover:bg-white/10"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-bold text-white px-6 py-2 rounded-full active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(0,61,155,0.95) 0%, rgba(55,85,195,0.95) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 20px rgba(0,61,155,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10"
              style={{ background: 'rgba(0,18,52,0.95)', backdropFilter: 'blur(20px)' }}
            >
              <div className="px-6 py-6 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-300 font-medium text-base py-2 border-b border-white/5"
                  >
                    {link}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-2">
                  <button onClick={() => navigate('/login')} className="text-left text-white font-bold py-2">
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full py-3 bg-[#003d9b] text-white font-bold rounded-xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Content */}
      <section id="about" className="pt-24 sm:pt-28 pb-16 sm:pb-20 max-w-screen-xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-5">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#dae2ff] text-[#003d9b] font-bold text-xs ring-1 ring-[#003d9b]/20">
                Clinical Dissertation Research
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#131b2e] leading-[1.05] tracking-tight">
                Precision Diagnostics Through{' '}
                <span className="text-[#003d9b]">Neural Clarity.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                Advancing dental pathology identification with state-of-the-art computer vision. Validated against the UFBA-UESC Dental Panoramic Radiography Dataset.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-2 bg-[#003d9b] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-[#3755c3] transition-all shadow-lg shadow-[#003d9b]/20 active:scale-95 text-sm sm:text-base"
              >
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
                Explore the System
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 bg-[#eaedff] text-[#003d9b] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-[#dae2ff] transition-all text-sm sm:text-base"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                Read the Thesis
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Right Column — Intraoral Image Card */}
          <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[480px]">
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl"
              style={{ background: 'radial-gradient(circle at center, rgba(55,85,195,0.12) 0%, transparent 70%)' }}
            />
            <div className="relative h-full w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl ring-1 ring-blue-100 min-h-[280px] sm:min-h-[380px] lg:min-h-[480px]">
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2074&auto=format&fit=crop"
                alt="Intraoral dental examination — clinical view"
                className="w-full h-full object-cover absolute inset-0"
              />
              {/* Overlay card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/80 backdrop-blur-lg p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-100/60 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#dae2ff] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#003d9b] text-base sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-bold">Detection Engine</p>
                      <p className="text-xs sm:text-sm font-black text-[#003d9b]">YOLOv8 · v4.2 Alpha</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-black text-[#003d9b]">97.4%</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold">Detection Accuracy</p>
                  </div>
                </div>
              </div>
              {/* AI badge */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-[#003d9b]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-black text-white">AI Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};