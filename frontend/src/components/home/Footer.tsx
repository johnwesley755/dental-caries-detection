// frontend/src/components/home/Footer.tsx
import React from 'react';
import { Mail, MapPin, Phone, Stethoscope, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-slate-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-headline font-black text-white tracking-tight uppercase">
                DentalAI<span className="text-primary-container">.Dx</span>
              </span>
            </div>
            <p className="text-sm font-bold leading-relaxed uppercase tracking-tight opacity-60">
              Advanced neural diagnostics for the modern clinical ecosystem. <br />
              Precision-first. Patient-centric.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors hover:text-white">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Practice */}
          <div className="text-left">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Practice</h3>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><Link to="/" className="hover:text-primary transition-colors">Neural Hub</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Vault Access</Link></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Core Engine</a></li>
              <li><a href="#workflow" className="hover:text-primary transition-colors">Protocol</a></li>
            </ul>
          </div>

          {/* Intelligence */}
          <div className="text-left">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Intelligence</h3>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neural Research</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Clinical Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Cloud</a></li>
            </ul>
          </div>

          {/* Nexus */}
          <div className="text-left">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Nexus</h3>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="truncate">ops@dentalai.dx</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 800 NEURAL</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>DX-CORE HQ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
            &copy; {new Date().getFullYear()} DENTALAI SYSTEMS. OPERATING UNDER DX-V4 COMPLIANCE.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-60">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
