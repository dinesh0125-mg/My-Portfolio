import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { ToastProvider } from './Toast';
import './AdminLayout.css';
import '../styles/AdminManagers.css';

export default function AdminLayout() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans antialiased overflow-x-hidden">
        {/* Top Navbar with Universal Dropdown Navigation (Desktop & Mobile) */}
        <AdminNavbar />

        {/* Main Content Area - Full Width & Centered */}
        <div className="admin-content-shell">
          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Admin Footer */}
          <footer className="px-4 sm:px-6 py-4 border-t border-slate-200/80 bg-white text-[11px] sm:text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>Portfolio Admin CMS v1.0</span>
            <span>Dinesh M</span>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}
