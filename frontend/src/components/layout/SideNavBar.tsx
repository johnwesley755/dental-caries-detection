import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const SideNavBar: React.FC = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', badge: null },
    { name: 'Patients', path: '/patients', icon: 'group', badge: { count: 5, colorClass: 'bg-primary-container text-on-primary-container' } },
    { name: 'Schedules', path: '/schedules', icon: 'calendar_today', badge: null },
    { name: 'Messages', path: '/messages', icon: 'chat', badge: { count: 3, colorClass: 'bg-secondary-container text-on-secondary-container' } },
    { name: 'New Scan', path: '/detection', icon: 'biotech', badge: null },
  ];

  const adminItems = [
    { name: 'User Management', path: '/users', icon: 'manage_accounts' },
    { name: 'Verifications', path: '/verifications', icon: 'verified_user' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 ease-in-out text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
      : "flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors";

  const adminLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ease-in-out text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
      : "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors";

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col py-6">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" data-icon="biotech">biotech</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-100 font-manrope">Dental AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Dental AI Intelligence</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={linkClass}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
              <span className="font-manrope text-sm font-medium">{item.name}</span>
            </div>
            {item.badge && (
              <span className={`${item.badge.colorClass} text-[10px] px-2 py-0.5 rounded-full font-bold`}>
                {item.badge.count}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</div>
        {adminItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={adminLinkClass}>
            <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
            <span className="font-manrope text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 mt-auto">
        <button 
          onClick={() => navigate('/detection')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
          <span className="font-manrope text-sm">New Scan</span>
        </button>
      </div>
    </aside>
  );
};
