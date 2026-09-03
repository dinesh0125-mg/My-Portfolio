import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Portfolio Sections (100% Preserved)
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import EducationSection from './sections/EducationSection';
import ContactSection from './sections/ContactSection';
import Footer from './components/Footer';

// Admin System Components & Modules
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import HeroManager from './admin/pages/HeroManager';
import AboutManager from './admin/pages/AboutManager';
import ProjectsManager from './admin/pages/ProjectsManager';
import ServicesManager from './admin/pages/ServicesManager';
import ExperienceManager from './admin/pages/ExperienceManager';
import SkillsManager from './admin/pages/SkillsManager';
import EducationManager from './admin/pages/EducationManager';
import CertificatesManager from './admin/pages/CertificatesManager';
import ContactManager from './admin/pages/ContactManager';
import ContactMessagesManager from './admin/pages/ContactMessagesManager';
import SettingsManager from './admin/pages/SettingsManager';
import { PortfolioProvider } from './context/PortfolioContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Portfolio ErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-xl text-center space-y-3">
            <h2 className="text-lg font-bold text-red-600">Something went wrong</h2>
            <p className="text-xs text-slate-500 font-mono bg-slate-100 p-2.5 rounded-xl break-words text-left">
              {this.state.error?.message || 'Unknown render error'}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
            >
              Reload Portfolio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * PublicPortfolio Component
 * Renders the existing public portfolio website exactly as it is,
 * with identical sections, styling, typography, scroll-spy, and animations.
 */
function PublicPortfolio() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* 100% Preserved Floating / Fixed Navbar */}
      <Navbar activeSection={activeSection} />

      {/* Main Sections (offset for fixed navbar) */}
      <main className="pt-[60px] sm:pt-[68px]">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Skills Matrix Section */}
        <SkillsSection />

        {/* 4. Experience Section */}
        <ExperienceSection />

        {/* 5. Projects Section */}
        <ProjectsSection />

        {/* 6. Education Section */}
        <EducationSection />

        {/* 7. Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/**
 * Root Application Router
 * Provides seamless routing between the public portfolio and the dedicated CMS admin panel.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route (Visually Unchanged) */}
            <Route
              path="/"
              element={
                <PortfolioProvider>
                  <PublicPortfolio />
                </PortfolioProvider>
              }
            />

            {/* Admin Login Page */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/hero" element={<HeroManager />} />
                <Route path="/admin/about" element={<AboutManager />} />
                <Route path="/admin/projects" element={<ProjectsManager />} />
                <Route path="/admin/services" element={<ServicesManager />} />
                <Route path="/admin/experience" element={<ExperienceManager />} />
                <Route path="/admin/skills" element={<SkillsManager />} />
                <Route path="/admin/education" element={<EducationManager />} />
                <Route path="/admin/certificates" element={<CertificatesManager />} />
                <Route path="/admin/contact" element={<ContactManager />} />
                <Route path="/admin/messages" element={<ContactMessagesManager />} />
                <Route path="/admin/settings" element={<SettingsManager />} />
              </Route>
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
