import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Microscope,
  UserCircle,
  LogOut,
  Activity,
  BookOpen
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Reports", path: "/detections", icon: FileText },
    { name: "Schedules", path: "/appointments", icon: Calendar },
    { name: "AI Detection", path: "/new-detection", icon: Microscope },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Health Tracker", path: "/health", icon: Activity },
    { name: "Resources", path: "/resources", icon: BookOpen },
    { name: "Profile Settings", path: "/profile", icon: UserCircle },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blue-900/40 backdrop-blur-md z-[60] lg:hidden transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          h-screen w-72 fixed lg:sticky left-0 top-0 bg-white border-r border-slate-100 z-[70] flex flex-col py-8
          transition-all duration-500 ease-in-out shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <div className="px-8 mb-12 flex items-center justify-between">
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-headline font-black text-blue-900 tracking-tight leading-none">
                  DENTALAI
                </h1>
                <p className="text-[10px] font-black text-primary opacity-60 mt-1">
                  Patient
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-primary transition-colors bg-slate-50 rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `
                    flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group
                    ${
                      isActive
                        ? "bg-primary text-white shadow-xl shadow-primary/20"
                        : "text-slate-500 hover:text-blue-900"
                    }
                `}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-primary"}`}
                />
                <span className="text-sm font-black leading-none">
                  {item.name}
                </span>
              </div>
            </NavLink>
          ))}

          <div className="px-6 mt-auto space-y-4">
             <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200/30 flex items-center gap-4 transition-all mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-black">
                  {user?.full_name ? user.full_name.charAt(0) : "P"}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-black text-blue-900 truncate tracking-tight">{user?.full_name || "Patient"}</p>
                  <p className="text-[10px] font-black text-primary tracking-tight">{user?.role || "Patient"}</p>
                </div>
             </div>

            <button
              onClick={() => {
                logout();
                navigate("/");
                handleLinkClick();
              }}
              className="w-full h-14 rounded-2xl bg-red-50 border-red-200 text-red-500 flex items-center justify-center gap-3 transition-all hover:bg-red-50 hover:text-red-500 group border border-transparent hover:border-red-100"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-black">Sign out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
