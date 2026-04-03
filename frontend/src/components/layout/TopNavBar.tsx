import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopNavBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ searchQuery, setSearchQuery }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center h-16 px-8 transition-all duration-200 ease-in-out">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-xl text-sm focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all placeholder:text-slate-500" 
            placeholder="Search patients, IDs, or analysis records..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6">
          <button 
             onClick={() => navigate('/schedules')}
             className="relative text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
          </button>
          <button className="relative text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
        <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/profile')}
        >
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface font-manrope">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">{user?.role || 'Staff'}</p>
          </div>
          <img 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-high" 
            src={`https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=003d9b&color=fff&bold=true`}
          />
        </div>
      </div>
    </header>
  );
};
