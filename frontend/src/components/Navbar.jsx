import React, { useState, useEffect } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { profileData } from '../data/profile';
import BrandLogo from './BrandLogo';
import './Navbar.css';

export default function Navbar({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : 'unscrolled'}`}>
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo / Brand Name */}
          <a href="#home" className="navbar-logo" title="Dinesh M - Full Stack Developer">
            <BrandLogo />
            <span className="navbar-brand-name">
              Dinesh <span className="navbar-brand-accent">M</span>
            </span>
          </a>

          {/* Desktop Center Horizontal Navigation */}
          <nav className="navbar-nav" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`navbar-nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Download Resume + Mobile Menu Toggle */}
          <div className="navbar-actions">
            <a
              href={profileData.resumeUrl}
              download="Dinesh_M_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-resume-btn"
              title="Download Dinesh M Resume PDF"
            >
              <Download className="navbar-btn-icon" />
              <span>Resume</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="navbar-menu-toggle"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="navbar-menu-icon" />
              ) : (
                <Menu className="navbar-menu-icon" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="navbar-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="navbar-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Link List */}
            <div className="navbar-mobile-list">
              {navLinks.map((link) => {
                const isActive = activeSection === link.name.toLowerCase();
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`navbar-mobile-item ${isActive ? 'active' : ''}`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="navbar-active-dot"></span>}
                  </a>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="navbar-mobile-actions">
              <a
                href={profileData.resumeUrl}
                download="Dinesh_M_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="navbar-mobile-resume-btn"
              >
                <Download className="navbar-mobile-btn-icon" />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
