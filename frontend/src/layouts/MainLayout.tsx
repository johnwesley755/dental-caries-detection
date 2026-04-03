import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNavBar } from '../components/layout/SideNavBar';

export interface MainLayoutProps {
  onMenuClick: () => void;
}

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onMenuClick = () => setIsSidebarOpen(true);

  return (
    <div className="flex bg-surface min-h-screen font-inter overflow-x-hidden">
      {/* Sidebar - z-index 70 */}
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Content Area - shifted on desktop */}
      <div className="flex-1 lg:ml-72 min-h-screen relative w-full lg:w-[calc(100%-18rem)] transition-all duration-300">
         <Outlet context={{ onMenuClick } as MainLayoutProps} />
      </div>
    </div>
  );
};

export default MainLayout;
