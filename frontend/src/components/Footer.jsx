import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Download, ArrowUp, Lock, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { profileData } from '../data/profile';
import { usePortfolio } from '../context/PortfolioContext';
import './Footer.css';

export default function Footer() {
  const { contact, hero } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const name = hero?.name || profileData.name;
  const role = hero?.title || profileData.role;
  const headline = hero?.subtitle || 'Building Scalable, User-Centric Web Applications';
  const email = contact?.email || profileData.email;
  const phone = contact?.phone || profileData.phone;
  const linkedin = contact?.linkedin || profileData.linkedin;
  const github = contact?.github || profileData.github;
  const resumeUrl = hero?.resumeUrl || profileData.resumeUrl;

  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Identity */}
          <div className="text-center md:text-left">
            <a href="#home" className="inline-flex items-center gap-1 text-xl font-black text-slate-900">
              <span>{name}</span>
              <span className="text-teal-600 text-2xl leading-none">.</span>
            </a>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {role} | {headline}
            </p>
          </div>

          {/* Direct Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${email}`}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors"
              title="Send Direct Email"
              aria-label="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            <a
              href={`tel:${phone}`}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors"
              title={`Call ${name}`}
              aria-label="Call Phone"
            >
              <Phone className="w-4 h-4" />
            </a>

            <a
              href={resumeUrl}
              download="Dinesh_M_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume PDF</span>
            </a>
          </div>

        </div>

        {/* Quick Nav Links Row */}
        <div className="py-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <a href="#home" className="hover:text-teal-700 transition-colors">Home</a>
          <a href="#about" className="hover:text-teal-700 transition-colors">About</a>
          <a href="#skills" className="hover:text-teal-700 transition-colors">Skills</a>
          <a href="#experience" className="hover:text-teal-700 transition-colors">Experience</a>
          <a href="#projects" className="hover:text-teal-700 transition-colors">Projects</a>
          <a href="#education" className="hover:text-teal-700 transition-colors">Education & Credentials</a>
          <a href="#contact" className="hover:text-teal-700 transition-colors">Contact</a>
          <Link
            to="/admin/login"
            className="text-slate-400 hover:text-teal-700 transition-colors inline-flex items-center gap-1 font-semibold"
            title="Administrator Portal"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <p>© {currentYear} {name}. All rights reserved.</p>
            <span>•</span>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-teal-700 transition-colors inline-flex items-center gap-1 font-medium"
              title="Admin Login Portal"
            >
              <Shield className="w-3 h-3 text-slate-400" />
              <span>Admin Login</span>
            </Link>
          </div>

          <a
            href="#home"
            className="hover:text-teal-700 transition-colors inline-flex items-center gap-1 font-semibold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
}
