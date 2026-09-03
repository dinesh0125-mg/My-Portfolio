import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  User,
  FolderKanban,
  Briefcase,
  History,
  Cpu,
  GraduationCap,
  Award,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar({
  isMinimized,
  toggleMinimize,
}) {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hero', path: '/admin/hero', icon: Sparkles },
    { name: 'About', path: '/admin/about', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Experience', path: '/admin/experience', icon: History },
    { name: 'Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Contact Info', path: '/admin/contact', icon: Mail },
    { name: 'Inquiries', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden lg:flex fixed top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-200 flex-col border-r border-slate-800 transition-all duration-300 ease-in-out ${
        isMinimized ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-slate-800 shrink-0 ${
          isMinimized
            ? 'flex-col justify-center px-2 gap-1'
            : 'justify-between px-4 sm:px-5'
        }`}
      >
        {isMinimized ? (
          <div className="flex items-center justify-between w-full">
            <div
              className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0"
              title="Portfolio Admin CMS"
            >
              <Shield className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={toggleMinimize}
              className="p-1 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-colors"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-black text-sm tracking-tight text-white block leading-tight truncate">
                  Portfolio Admin
                </span>
                <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase block">
                  CMS Panel
                </span>
              </div>
            </div>

            {/* Minimize button for desktop */}
            <button
              type="button"
              onClick={toggleMinimize}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Minimize Sidebar"
              aria-label="Minimize Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links (Scrollable) */}
      <div
        className={`flex-1 overflow-y-auto py-3 space-y-1 ${
          isMinimized ? 'px-2' : 'px-3'
        }`}
      >
        {!isMinimized && (
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={isMinimized ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-xs font-semibold transition-all group ${
                  isMinimized
                    ? 'justify-center p-2.5 w-full'
                    : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-slate-950'
                        : 'text-slate-400 group-hover:text-teal-400'
                    }`}
                  />
                  {!isMinimized && (
                    <span className="truncate">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile & Logout Area */}
      <div
        className={`border-t border-slate-800 bg-slate-950/40 shrink-0 ${
          isMinimized ? 'p-2 flex flex-col items-center gap-2' : 'p-3'
        }`}
      >
        {isMinimized ? (
          <>
            <div
              className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-bold shrink-0"
              title={`${adminUser?.name || 'Dinesh M'} (${adminUser?.email || 'admin@dineshm.dev'})`}
            >
              DM
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-950/40 transition-colors"
              title="Logout of Admin Panel"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-bold shrink-0">
                DM
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {adminUser?.name || 'Dinesh M'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {adminUser?.email || 'admin@dineshm.dev'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Open Public Site"
              >
                <span>Public</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-400 hover:text-white hover:bg-red-950/40 transition-colors"
                title="Log out of Admin Panel"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
