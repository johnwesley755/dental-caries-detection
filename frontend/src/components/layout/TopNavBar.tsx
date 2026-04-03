import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Menu, Bell, Calendar as CalendarIcon, Search } from 'lucide-react';

interface TopNavBarProps {
  title?: string;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
}

interface ContextProps {
  onMenuClick: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ 
  title, 
  searchQuery, 
  setSearchQuery
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const context = useOutletContext<ContextProps>();

  return (
    <header className="sticky top-0 right-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex justify-between items-center h-16 sm:h-20 px-4 sm:px-8 transition-all duration-200 ease-in-out">
      <div className="flex items-center gap-4 flex-1">
        {context?.onMenuClick && (
          <button 
            onClick={context.onMenuClick}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        {title ? (
          <h1 className="text-lg sm:text-xl font-headline font-black text-blue-900 uppercase truncate">
            {title}
          </h1>
        ) : setSearchQuery && (
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 font-medium" 
              placeholder="Search..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="hidden sm:flex items-center gap-4 border-r border-slate-100 pr-6">
          <button 
             onClick={() => navigate('/schedules')}
             className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 rounded-xl"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button className="relative p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div 
            className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-2xl transition-all"
            onClick={() => navigate('/profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-tight">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/10 shadow-sm">
             <img 
              alt="User" 
              className="w-full h-full object-cover" 
              src={`https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=003d9b&color=fff&bold=true`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
