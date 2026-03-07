// frontend/src/components/common/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import {
  LayoutDashboard,
  Users,
  History,
  UserCog,
  LogOut,
  ChevronRight,
  ScanFace,
  Calendar,
  MessageCircle,
  ShieldCheck,
  X
} from 'lucide-react';
import { CalendarModal } from '../dashboard/CalendarModal';
import { NotificationDropdown } from '../dashboard/NotificationDropdown';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/detection', icon: ScanFace, label: 'New Detection' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    ...(user?.role === UserRole.ADMIN
      ? [
        { path: '/users', icon: UserCog, label: 'User Management' },
        { path: '/verifications', icon: ShieldCheck, label: 'Dentist Verification' }
      ]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLinkClick = () => {
    // Close mobile menu when link is clicked
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-2rem)]
          w-72 bg-white lg:m-4 lg:rounded-3xl shadow-lg lg:shadow-sm
          flex flex-col border-r lg:border border-gray-100
          z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-4
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        )}

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
                D
              </div>
              Dental AI
            </h1>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setShowCalendar(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              title="Calendar"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Calendar</span>
            </button>

            <div className="relative hidden lg:block">
              <NotificationDropdown />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                  }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 absolute right-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Calendar Modal */}
        <CalendarModal isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
      </aside>
    </>
  );
};

export default Sidebar;