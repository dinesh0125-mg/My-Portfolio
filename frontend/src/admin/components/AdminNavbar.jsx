import React, { useState } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  ExternalLink,
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
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminNavbar.css';

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
  '/admin/messages': 'Contact Messages',
  '/admin/settings': 'Settings',
};

export default function AdminNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();
  const title = routeTitles[location.pathname] || 'Admin CMS';

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      desc: 'Overview metrics & activity',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Hero',
      desc: 'Headline, portraits & CTAs',
      path: '/admin/hero',
      icon: Sparkles,
    },
    {
      name: 'About',
      desc: 'Biography, traits & highlights',
      path: '/admin/about',
      icon: User,
    },
    {
      name: 'Projects',
      desc: 'Portfolio showcase entries',
      path: '/admin/projects',
      icon: FolderKanban,
    },
    {
      name: 'Services',
      desc: 'Technical offerings & skills',
      path: '/admin/services',
      icon: Briefcase,
    },
    {
      name: 'Experience',
      desc: 'Internships & career timeline',
      path: '/admin/experience',
      icon: History,
    },
    {
      name: 'Skills',
      desc: 'Competency badges & matrix',
      path: '/admin/skills',
      icon: Cpu,
    },
    {
      name: 'Education',
      desc: 'University degree & honors',
      path: '/admin/education',
      icon: GraduationCap,
    },
    {
      name: 'Certificates',
      desc: 'Verified licenses & credentials',
      path: '/admin/certificates',
      icon: Award,
    },
    {
      name: 'Contact Info',
      desc: 'Public channels & social links',
      path: '/admin/contact',
      icon: Mail,
    },
    {
      name: 'Inquiries',
      desc: 'Recruiter inbox & messages',
      path: '/admin/messages',
      icon: MessageSquare,
    },
    {
      name: 'Settings',
      desc: 'Admin credentials & security',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <>
      <header className="admin-navbar-header">
        {/* Left: Brand + Navigation Dropdown Trigger + Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Brand Emblem */}
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-2.5 shrink-0 text-decoration-none group"
            title="Portfolio Admin Dashboard"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 block leading-tight">
                Portfolio Admin
              </span>
              <span className="text-[10px] text-teal-600 font-bold tracking-wider uppercase block">
                CMS Panel
              </span>
            </div>
          </NavLink>

          {/* Navigation Dropdown Trigger Button (Visible on ALL devices) */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`admin-nav-trigger-btn ${dropdownOpen ? 'active' : ''}`}
            aria-label="Toggle Navigation Menu"
            title="Toggle CMS Navigation Menu"
            aria-expanded={dropdownOpen}
          >
            {dropdownOpen ? (
              <X className="admin-nav-trigger-icon" />
            ) : (
              <Menu className="admin-nav-trigger-icon" />
            )}
            <span className="hidden xs:inline">Navigation</span>
            <ChevronDown
              className={`admin-nav-chevron ${dropdownOpen ? 'rotated' : ''}`}
            />
          </button>

          {/* Breadcrumb & Title */}
          <div className="min-w-0 hidden md:block border-l border-slate-200 pl-3">
            <div className="text-[10px] text-slate-400 font-medium leading-none">
              Portfolio Admin / <span className="text-slate-600">{location.pathname.replace('/admin/', '')}</span>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate mt-0.5 max-w-[220px]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Quick Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Live Database Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
            <span className="text-xs font-bold text-slate-800 hidden xl:inline truncate max-w-[100px]">
              {adminUser?.name || 'Dinesh M'}
            </span>
          </div>
        </div>
      </header>

      {/* Universal Dropdown Backdrop */}
      {dropdownOpen && (
        <div
          className="admin-navbar-dropdown-backdrop"
          onClick={() => setDropdownOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Universal Dropdown Mega-Menu (Desktop & Mobile) */}
      {dropdownOpen && (
        <div className="admin-navbar-dropdown">
          <div className="admin-dropdown-inner">
            {/* User Profile Card */}
            <div className="admin-dropdown-user-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="admin-dropdown-avatar">DM</div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-slate-900 block truncate">
                    {adminUser?.name || 'Dinesh M'}
                  </span>
                  <span className="text-xs text-slate-400 block truncate">
                    {adminUser?.email || 'admin@dineshm.dev'} • Administrator
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span>Database Connected</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  aria-label="Close Dropdown"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Grid (4 columns on desktop, 2 on tablet, 1 on mobile) */}
            <div className="admin-dropdown-nav-grid">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setDropdownOpen(false)}
                    className={({ isActive }) =>
                      `admin-dropdown-nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <div className="admin-dropdown-icon-wrapper">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="admin-dropdown-nav-text">
                      <span className="admin-dropdown-nav-title">{item.name}</span>
                      <span className="admin-dropdown-nav-desc">{item.desc}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* Dropdown Footer Actions */}
            <div className="admin-dropdown-footer">
              <div className="text-xs text-slate-400 hidden sm:block">
                Select any module above to manage live MySQL content
              </div>

              <div className="admin-dropdown-footer-group">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDropdownOpen(false)}
                  className="admin-dropdown-footer-btn"
                  title="Preview Live Site"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Public Site</span>
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="admin-dropdown-footer-btn logout"
                  title="Sign out of Admin Panel"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
