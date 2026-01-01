// patient-portal/src/components/common/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  ArrowRight,
  Mail
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">DentAI</span>
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm max-w-xs">
              Revolutionizing dental diagnostics with Artificial Intelligence. We help patients understand their health and clinicians deliver better care.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              {['Features', 'AI Analysis', 'Security', 'Enterprise', 'Pricing'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
            <p className="text-sm text-slate-500 mb-4">
              Get the latest updates on AI dental technology and oral health tips.
            </p>
            <form className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                />
              </div>
              <button className="h-10 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
                Subscribe <ArrowRight className="h-3 w-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2024 DentAI Diagnostics. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
};