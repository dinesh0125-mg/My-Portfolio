import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { ToastProvider } from './Toast';
import './AdminLayout.css';
import '../styles/AdminManagers.css';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_minimized', String(next));
      } catch {
        // ignore localStorage errors
      }
      return next;
    });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased overflow-x-hidden">
        {/* Fixed/Responsive Sidebar with Minimize Support */}
        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isMinimized={isMinimized}
          toggleMinimize={toggleMinimize}
        />

        {/* Main Content Area */}
        <div
          className={`admin-content-shell ${
            isMinimized ? 'minimized' : ''
          } ${mobileOpen && isMinimized ? 'mobile-minimized' : ''}`}
        >
          {/* Top Navbar */}
          <AdminNavbar
            setMobileOpen={setMobileOpen}
            isMinimized={isMinimized}
            toggleMinimize={toggleMinimize}
          />

          {/* Dynamic Nested Page Content */}
          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Admin Footer */}
          <footer className="px-4 sm:px-6 py-4 border-t border-slate-200/80 bg-white text-[11px] sm:text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>Portfolio Admin CMS v1.0 • Dinesh M</span>
            <span>Frontend Prototype (Ready for Backend Integration)</span>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}
