// frontend/src/components/home/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#000d29] w-full py-10 sm:py-12 px-4 sm:px-8 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto">
        {/* Main grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3">
            <div className="text-lg font-black text-[#b2c5ff]">DentAI Diagnostics</div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
              Final Year Project — Computer Science 2025. AI-powered dental caries detection system for clinical dentists.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#b2c5ff] hover:text-white transition-colors mt-1"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {/* System */}
          <div>
            <h3 className="text-xs font-black text-white mb-4 sm:mb-5">System</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><Link to="/detection" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Detection</Link></li>
              <li><Link to="/patients" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Patients</Link></li>
              <li><Link to="/history" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">History</Link></li>
              <li><Link to="/login" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-xs font-black text-white mb-4 sm:mb-5">Project</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><a href="#about" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">About</a></li>
              <li><a href="#features" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Methodology</a></li>
              <li><a href="#results" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Results</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">GitHub</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-black text-white mb-4 sm:mb-5">Legal</h3>
            <ul className="space-y-3 text-xs font-bold">
              <li><a href="#" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Institutional Review</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#b2c5ff] transition-colors">Data Ethics</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/5">
          <p className="text-xs font-medium text-slate-600 italic text-center sm:text-left">
            © 2025 John Wesley. Academic Project — Final Year Dissertation, Computer Science. Not for commercial use.
          </p>
        </div>
      </div>
    </footer>
  );
};
