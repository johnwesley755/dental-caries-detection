// frontend/src/components/layout/SideNavBar.tsx
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Microscope,
  ShieldCheck,
  UserCog,
  LogOut,
  History,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth.types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNavBar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Schedules", path: "/schedules", icon: Calendar },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Detection", path: "/detection", icon: Microscope },
    { name: "History", path: "/history", icon: History },
  ];

  const adminItems = [
    { name: "User Access", path: "/users", icon: UserCog },
    { name: "Credentials", path: "/verifications", icon: ShieldCheck },
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
          h-screen w-72 fixed left-0 top-0 bg-white border-r border-slate-100 z-[70] flex flex-col py-8
          transition-all duration-500 ease-in-out shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}

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
                <p className="text-[10px] font-black tracking-[0.3em] text-primary opacity-60 mt-1">
                  Intelligence
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

          {navItems.map((item) => (
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
              {/* {item.badge && !isActive(item.path) && (
                <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-1 rounded-lg">
                  {item.badge}
                </span>
              )} */}
            </NavLink>
          ))}

          {user?.role === UserRole.ADMIN && (
            <>
              <div className="pt-4 pb-4 px-4 text-sm font-black text-slate-400 opacity-60">
                System Admin
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `
                        flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-blue-900 text-white shadow-xl shadow-blue-900/20"
                            : "text-slate-500 hover:bg-slate-50 hover:text-blue-900"
                        }
                    `}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-blue-900"}`}
                  />
                  <span className="text-sm font-black leading-none">
                    {item.name}
                  </span>
                </NavLink>
              ))}
            </>
          )}
          <div className="px-6 mt-auto space-y-4">
            <button
              onClick={() => {
                logout();
                handleLinkClick();
              }}
              className="w-full h-14 rounded-2xl bg-red-50 border-red-200 text-red-400 flex items-center justify-center gap-3 transition-all hover:bg-red-50 hover:text-red-500 group border border-transparent hover:border-red-100"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-black">Sign out</span>
            </button>
          </div>
        </nav>

        {/* Footer Actions */}
      </aside>
    </>
  );
};
