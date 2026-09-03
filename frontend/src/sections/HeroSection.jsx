import React, { useState } from 'react';
import { ArrowDown, Download, Mail, Phone, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';
import Button from '../components/Button';
import { profileData } from '../data/profile';
import { usePortfolio } from '../context/PortfolioContext';
import './HeroSection.css';

export default function HeroSection() {
  const portfolio = usePortfolio();
  const hero = portfolio.hero || {};
  const contact = portfolio.contact || {};

  const [imgError, setImgError] = useState(false);

  // Dynamic values with graceful fallback
  const name = hero.name || profileData.name;
  const role = hero.title || profileData.role;
  const headline = hero.subtitle || profileData.headline;
  const description = hero.description || profileData.hero.supportingText;
  const badge = hero.badge || profileData.hero.badge;
  const primaryButtonText = hero.primaryButtonText || profileData.hero.ctaWork;
  const primaryButtonLink = hero.primaryButtonLink || '#projects';
  const secondaryButtonText = hero.secondaryButtonText || profileData.hero.ctaResume;
  const resumeUrl = hero.resumeUrl || profileData.resumeUrl;
  const profileImageUrl = hero.profileImageUrl || '/images/hero-developer.jpg';

  const linkedinUrl = contact.linkedin || profileData.linkedin;
  const githubUrl = contact.github || profileData.github;
  const emailAddress = contact.email || profileData.email;
  const locationText = contact.location || hero.location || profileData.location;

  return (
    <section id="home" className="relative pt-6 pb-12 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-100">
      {/* Clean subtle backdrop glow without distracting 3D elements */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-teal-50/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-60 sm:w-72 h-60 sm:h-72 bg-slate-100/50 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Identity, Value Proposition & Recruiter Actions */}
          <div className="lg:col-span-7 xl:col-span-7 z-10">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/80 mb-3 sm:mb-4 shadow-2xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0"></span>
              <span className="truncate">{badge}</span>
            </div>

            {/* Prominent Name & Title */}
            <div className="mb-2 sm:mb-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] break-words">
                {name}
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-teal-600 mt-1">
                {role}
              </p>
            </div>

            {/* Concise Professional Headline */}
            <h2 className="text-base sm:text-xl font-semibold text-slate-700 leading-snug max-w-xl mt-2 sm:mt-3">
              {headline}
            </h2>

            {/* Supporting Bio */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-500 leading-relaxed max-w-lg">
              {description}
            </p>

            {/* Primary CTAs - Full-width stacked on mobile for thumb friendliness */}
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
              <Button
                variant="primary"
                size="md"
                href={primaryButtonLink}
                icon={ArrowDown}
                iconPosition="right"
                className="w-full sm:w-auto text-center justify-center py-3 sm:py-2.5"
              >
                {primaryButtonText}
              </Button>

              <a
                href={resumeUrl}
                download="Dinesh_M_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm px-5 py-3 sm:py-2.5 rounded-full inline-flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <span>{secondaryButtonText}</span>
                <Download className="w-4 h-4 text-slate-600" />
              </a>
            </div>

            {/* Direct Recruiter Access Bar (GitHub, LinkedIn, Email, Phone) */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 hover:text-teal-700 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 hover:text-teal-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a
                href={`mailto:${emailAddress}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 hover:text-teal-700 transition-colors max-w-full truncate"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{emailAddress}</span>
              </a>

              <span className="inline-flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{locationText}</span>
              </span>
            </div>

            {/* Core Tech Stack Scannable Pills */}
            <div className="mt-4 sm:mt-5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Core:
              </span>
              {profileData.hero.keyTechs.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>

          {/* Right Column: Clean Professional Developer Portrait Container */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center mt-4 lg:mt-0">
            <div className="relative w-full max-w-[260px] sm:max-w-[290px] md:max-w-xs aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-b from-teal-50 to-slate-100">
              {!imgError ? (
                <img
                  src={profileImageUrl}
                  alt={`${name} - ${role}`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold mb-3">
                    DM
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{name}</h3>
                  <p className="text-xs font-semibold text-teal-700">{role}</p>
                  <p className="text-xs text-slate-500 mt-1">{locationText}</p>
                </div>
              )}

              {/* Status footer inside photo frame */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-3 sm:p-4 text-white">
                <p className="text-xs font-bold leading-tight">{name}</p>
                <p className="text-[10px] sm:text-[11px] text-teal-300 font-medium truncate">B.E. CSE • J.N.N Institute (2027)</p>
              </div>
            </div>

            {/* Quick Metrics Bar below photo */}
            <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[280px] sm:max-w-sm text-center">
              {profileData.hero.stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200 shadow-2xs">
                  <div className="text-sm sm:text-base font-black text-slate-900">{stat.value}</div>
                  <div className="text-[9px] sm:text-[10px] font-semibold text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
