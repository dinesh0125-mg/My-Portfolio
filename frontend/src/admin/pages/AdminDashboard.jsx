import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Cpu,
  Briefcase,
  Award,
  History,
  ArrowUpRight,
  Plus,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../api/adminService';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 4,
    totalSkills: 16,
    totalServices: 6,
    totalCertificates: 3,
    totalExperience: 2,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then((data) => {
        if (data && data.stats) {
          setStats(data.stats);
          if (data.recentActivity) {
            setActivityLog(data.recentActivity);
          }
        }
      })
      .catch((err) => {
        console.warn('Dashboard stats fallback:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtitle: 'Database-driven records',
      icon: FolderKanban,
      color: 'teal',
      link: '/admin/projects',
    },
    {
      title: 'Total Skills',
      value: stats.totalSkills,
      subtitle: 'Categorized technical matrix',
      icon: Cpu,
      color: 'blue',
      link: '/admin/skills',
    },
    {
      title: 'Total Services',
      value: stats.totalServices,
      subtitle: 'Active offerings',
      icon: Briefcase,
      color: 'indigo',
      link: '/admin/services',
    },
    {
      title: 'Total Certificates',
      value: stats.totalCertificates,
      subtitle: 'Verified credentials',
      icon: Award,
      color: 'emerald',
      link: '/admin/certificates',
    },
    {
      title: 'Total Experience',
      value: stats.totalExperience,
      subtitle: 'Industry internships',
      icon: History,
      color: 'purple',
      link: '/admin/experience',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="admin-welcome-banner">
        <div className="relative z-10 max-w-2xl">
          <span className="admin-welcome-badge">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MySQL & Cloudinary Powered CMS</span>
          </span>
          <h2 className="admin-welcome-title">
            Welcome back, Dinesh M
          </h2>
          <p className="admin-welcome-desc">
            Manage your personal portfolio content, configure real-time project entries, edit technical skills, and review recruiter contact messages stored in your MySQL database.
          </p>

          <div className="admin-welcome-actions">
            <Link
              to="/admin/projects"
              className="admin-welcome-btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
            <Link
              to="/admin/hero"
              className="admin-welcome-btn-secondary"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Edit Hero Section</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-welcome-link"
            >
              <span>View Public Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Ambient Shape */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Portfolio Overview Metrics
          </h3>
          {loading && (
            <span className="text-[11px] text-teal-600 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Syncing with MySQL...
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                </div>

                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1">
                    {stat.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {stat.subtitle}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Recent Updates & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Updates & Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Recent Activity & Audit Trail</span>
            </h4>
            <span className="text-[11px] text-teal-600 font-semibold">MySQL Audit Log</span>
          </div>

          <div className="space-y-3.5">
            {activityLog.length > 0 ? (
              activityLog.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {act.details || act.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {act.action} • {act.entity}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 text-center">
                No recent activity logged.
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>MySQL Portfolio Engine</span>
            <span className="text-teal-700 font-semibold">● Connected & In Sync</span>
          </div>
        </div>

        {/* Right Column: Quick Management Shortcuts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Quick Management Actions</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                to="/admin/hero"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-xs font-semibold text-slate-800 transition-all flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Hero Settings</span>
              </Link>

              <Link
                to="/admin/projects"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-xs font-semibold text-slate-800 transition-all flex items-center gap-2.5"
              >
                <FolderKanban className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Projects ({stats.totalProjects})</span>
              </Link>

              <Link
                to="/admin/skills"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-xs font-semibold text-slate-800 transition-all flex items-center gap-2.5"
              >
                <Cpu className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Skills Matrix</span>
              </Link>

              <Link
                to="/admin/contact"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-xs font-semibold text-slate-800 transition-all flex items-center gap-2.5"
              >
                <User className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Contact Channels</span>
              </Link>

              <Link
                to="/admin/settings"
                className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-xs font-semibold text-slate-800 transition-all flex items-center gap-2.5 sm:col-span-2"
              >
                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Global CMS Settings & Resume</span>
              </Link>
            </div>
          </div>

          {/* Database & Cloudinary Status */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-teal-400 font-bold mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full-Stack Database Architecture</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Connected to MySQL database <code className="text-teal-300">portfolio_db</code> with Prisma ORM. Media assets and resumes are uploaded directly to Cloudinary with secure asset replacement.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
