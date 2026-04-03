import { Outlet } from 'react-router-dom';
import { SideNavBar } from '../components/layout/SideNavBar';

const MainLayout = () => {
  return (
    <div className="flex bg-background min-h-screen">
      <SideNavBar />
      {/* 
        Note: The TopNavBar requires search props, typically we can lift search state or keep it 
        in the dashboard. Since the initial mock had it in the layout header, we will handle search 
        inside Dashboard if it needs to drive local component state, or we pass context.
        Let's let Dashboard handle TopNavBar or move TopNavBar outside if global search is needed.
        For now, we'll let Dashboard render TopNavBar to match the specific search behavior, or wrap it here contextually.
        Actually, the TopNavBar is fixed so we can let the pages render their own header or give it a global search context.
      */}
      <div className="ml-64 mt-16 min-h-screen relative w-[calc(100%-16rem)]">
         <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
