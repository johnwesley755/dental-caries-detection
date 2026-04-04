// patient-portal/src/components/common/MobileHeader.tsx
import React from 'react';
import { Menu, Microscope } from 'lucide-react';
import { NotificationDropdown } from '../dashboard/NotificationDropdown';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-100 z-40">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent active:border-slate-100"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Microscope className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black text-blue-900 leading-none tracking-tight">DENTALAI</h1>
            <span className="text-[9px] font-black text-primary opacity-60">Patient</span>
          </div>
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
