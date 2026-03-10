import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  UserCircle,
  LogOut,
  ChevronRight,
  Calendar,
  Activity,
  BookOpen,
  MessageCircle,
  ScanFace,
  Search,
  X
} from 'lucide-react';
import { CalendarModal } from '../dashboard/CalendarModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/detections', icon: FileText, label: 'My Reports', badge: 2 },
    { path: '/appointments', icon: Calendar, label: 'Schedules' },
    { path: '/messages', icon: MessageCircle, label: 'Messages', dot: true },
    { path: '/new-detection', icon: ScanFace, label: 'New Scan' },
    { path: '/health', icon: Activity, label: 'Health Tracker' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  const bottomMenuItems = [
    { path: '/profile', icon: UserCircle, label: 'Profile Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  // Three dots colors
  const Dots = () => (
    <div className={`flex items-center gap-2 ${isExpanded ? 'mb-8' : 'mb-8 justify-center'}`}>
      <div className="w-3 h-3 rounded-full bg-red-400 cursor-pointer hover:bg-red-500 transition-colors" onClick={() => setIsExpanded(!isExpanded)} />
      <div className="w-3 h-3 rounded-full bg-amber-400 cursor-pointer hover:bg-amber-500 transition-colors" onClick={() => setIsExpanded(!isExpanded)} />
      <div className="w-3 h-3 rounded-full bg-emerald-400 cursor-pointer hover:bg-emerald-500 transition-colors" onClick={() => setIsExpanded(!isExpanded)} />
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-2rem)]
          ${isExpanded ? 'w-[260px]' : 'w-[80px]'}
          bg-white lg:m-4 lg:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
          flex flex-col border border-slate-100
          z-50 lg:z-auto transition-all duration-300 ease-in-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-50"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Content Wrapper */}
        <div className="flex flex-col h-full overflow-hidden pt-6">
          <div className="px-6 flex flex-col shrink-0">
            <Dots />

            {/* Logo */}
            <div className={`flex items-center ${isExpanded ? 'gap-3 mb-6' : 'justify-center mb-6'} transition-all`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                <Activity className="h-5 w-5 text-white" />
              </div>
              {isExpanded && (
                <span className="text-lg font-bold text-slate-800 tracking-tight whitespace-nowrap">DentAI Patient</span>
              )}
            </div>

            {/* Search */}
            {isExpanded ? (
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ask Assistant..."
                  className="block w-full pl-9 pr-3 py-2 border-0 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 sm:text-sm transition-all"
                />
              </div>
            ) : (
              <div className="mb-6 flex justify-center">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide space-y-1 pb-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center ${isExpanded ? 'px-3' : 'justify-center px-0'} py-2.5 rounded-xl transition-all duration-200 group relative
                    ${active
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
                    }
                  `}
                  title={!isExpanded ? item.label : undefined}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} strokeWidth={active ? 2.5 : 2} />
                    {item.dot && !isExpanded && !active && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {isExpanded && (
                    <span className={`ml-3 text-sm font-medium ${active ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                  )}

                  {isExpanded && item.badge && !active && (
                    <span className="ml-auto bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-xs font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {isExpanded && item.dot && !active && (
                    <span className="ml-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  )}
                </Link>
              );
            })}

            <div className={`h-px bg-slate-100 my-4 ${isExpanded ? 'mx-3' : 'mx-2'}`} />

            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center ${isExpanded ? 'px-3' : 'justify-center px-0'} py-2.5 rounded-xl transition-all duration-200 group relative
                    ${active
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'
                    }
                  `}
                  title={!isExpanded ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} strokeWidth={active ? 2.5 : 2} />
                  {isExpanded && <span className={`ml-3 text-sm font-medium ${active ? 'text-white' : ''}`}>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 shrink-0 transition-all rounded-b-2xl">
            <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-200 to-emerald-200 shrink-0 border border-white shadow-sm flex items-center justify-center overflow-hidden text-teal-800 font-bold uppercase">
                  {user?.full_name ? user.full_name.charAt(0) : 'P'}
                </div>
                {isExpanded && (
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{user?.full_name || 'Patient'}</p>
                    <p className="text-xs text-slate-400 truncate w-32">{user?.email || 'patient@example.com'}</p>
                  </div>
                )}
              </div>
              {isExpanded ? (
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors shrink-0"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            {!isExpanded && (
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex justify-center p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

        {/* Global Calendar Modal */}
        <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
      </aside>
    </>
  );
};

export default Sidebar;