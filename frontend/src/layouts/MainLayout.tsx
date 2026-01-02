import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import MobileHeader from '../components/common/MobileHeader';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* Sidebar - Desktop always visible, Mobile controlled by state */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
