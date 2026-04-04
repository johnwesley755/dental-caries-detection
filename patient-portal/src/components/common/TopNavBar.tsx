// patient-portal/src/components/common/TopNavBar.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface TopNavBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ title, onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 right-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center h-16 lg:h-20 px-4 lg:px-10 transition-all duration-300">
      
      {/* Left Side: Mobile Menu & Title */}
      <div className="flex items-center gap-4 flex-1">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        {title ? (
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none truncate">
            {title}
          </h1>
        ) : (
          <div className="relative w-full max-w-sm hidden lg:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all placeholder:text-slate-300 outline-none" 
              placeholder="Search Records..." 
              type="text"
            />
          </div>
        )}
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 lg:gap-8">
        <div className="flex items-center gap-2 lg:gap-4 lg:mr-4">
          <button 
             onClick={() => navigate('/appointments')}
             className="p-2.5 text-slate-400 hover:text-primary transition-all hover:bg-blue-50 rounded-2xl group border border-transparent hover:border-blue-100 active:scale-95"
             title="Appointments"
          >
            <CalendarIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <NotificationDropdown />
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-100 hidden lg:block" />

        {/* Profile Summary */}
        <div 
            className="flex items-center gap-4 cursor-pointer p-1.5 hover:bg-slate-50 rounded-[1.5rem] transition-all group ring-1 ring-transparent hover:ring-slate-100"
            onClick={() => navigate('/profile')}
        >
          <div className="text-right hidden lg:block pr-1">
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
              {user?.full_name?.split(' ')[0] || 'Patient'}
            </p>
            <p className="text-[9px] text-primary font-black uppercase tracking-widest opacity-60">Verified Portal</p>
          </div>
          
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-xl shadow-blue-900/5 group-hover:shadow-blue-900/10 transition-all ring-1 ring-slate-100 group-hover:ring-primary/20">
             <img 
              alt={user?.full_name || 'User'} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
              src={`https://ui-avatars.com/api/?name=${user?.full_name || 'Patient'}&background=217bff&color=fff&bold=true&font-size=0.33`}
              onError={(e) => {
                 e.currentTarget.src = '';
                 e.currentTarget.className = 'hidden';
              }}
            />
            <UserIcon className="h-6 w-6 text-primary opacity-20 absolute z-0" />
          </div>
        </div>
      </div>
    </header>
  );
};
