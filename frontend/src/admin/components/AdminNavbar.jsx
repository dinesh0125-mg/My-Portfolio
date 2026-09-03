import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const routeTitles = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/hero': 'Hero Management',
  '/admin/about': 'About Management',
  '/admin/projects': 'Projects Management',
  '/admin/services': 'Services Management',
  '/admin/experience': 'Work Experience',
  '/admin/skills': 'Skills Matrix',
  '/admin/education': 'Education',
  '/admin/certificates': 'Certificates',
  '/admin/contact': 'Contact Channels',
  '/admin/settings': 'Settings',
};

export default function AdminNavbar({ setMobileOpen, isMinimized, toggleMinimize }) {
  const location = useLocation();
  const { adminUser } = useAuth();
  const title = routeTitles[location.pathname] || 'Admin CMS';

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-teal-500 shrink-0 touch-manipulation"
          aria-label="Toggle Sidebar Menu"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Minimize/Expand Toggle */}
        <button
          type="button"
          onClick={toggleMinimize}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 hidden lg:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500 shrink-0 transition-colors"
          title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
          aria-label={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
        >
          {isMinimized ? (
            <PanelLeftOpen className="w-5 h-5 text-teal-600" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-slate-500" />
          )}
        </button>

        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
            Portfolio Admin / <span className="text-slate-600">{location.pathname.replace('/admin/', '')}</span>
          </div>
          <h1 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Live Database Status Badge (Desktop only) */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>MySQL Live CMS</span>
        </div>

        {/* View Public Site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-200 transition-colors touch-manipulation"
          title="Open Public Portfolio in New Tab"
        >
          <span className="hidden xs:inline">Live</span> Site
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
            DM
          </div>
          <span className="text-xs font-bold text-slate-800 hidden lg:inline truncate max-w-[100px]">
            {adminUser?.name || 'Dinesh M'}
          </span>
        </div>
      </div>
    </header>
  );
}
