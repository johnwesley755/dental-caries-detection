// patient-portal/src/components/common/MobileHeader.tsx
import React from 'react';
import { Menu, Activity } from 'lucide-react';
import { NotificationDropdown } from '../dashboard/NotificationDropdown';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Activity className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold text-blue-900">DentAI <span className="text-xs font-normal text-gray-400">Patient</span></h1>
        </div>

        {/* Notification */}
        <div className="relative">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
