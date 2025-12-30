// frontend/src/components/common/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import {
  LayoutDashboard,
  Users,
  ScanFace,
  History,
  UserCog,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/detection', icon: ScanFace, label: 'Detection' },
    { path: '/history', icon: History, label: 'History' },
    ...(user?.role === UserRole.ADMIN
      ? [{ path: '/users', icon: UserCog, label: 'User Management' }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 shadow-sm`}
    >
      {/* Header with Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            DentalCare AI
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Profile Section */}
      <Link
        to="/profile"
        className={`p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors ${
          isActive('/profile') ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <User className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-blue-600 uppercase tracking-wider font-medium">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
