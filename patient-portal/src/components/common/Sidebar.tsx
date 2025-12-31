// patient-portal/src/components/common/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  UserCircle,
  LogOut,
  Settings,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Patient Portal specific menu items
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/detections', icon: FileText, label: 'My Reports' },
    { path: '/profile', icon: UserCircle, label: 'My Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    // Handle sub-routes if necessary, or exact matches
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-72 bg-white m-4 rounded-3xl shadow-sm flex flex-col hidden lg:flex border border-gray-100 sticky top-4 h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
            <Stethoscope className="h-5 w-5" />
          </div>
          DentAI <span className="text-xs font-normal text-gray-400 self-end mb-1">Patient</span>
        </h1>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                active 
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

      {/* Footer / System Status */}
      <div className="p-4 mt-auto">
        {/* Status Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Settings className="h-5 w-5" />
            </div>
            <p className="font-medium text-sm opacity-90">System Status</p>
            <h3 className="text-lg font-bold mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Optimal
            </h3>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-4 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;