import React from 'react';
import { Mail, Phone, MapPin, Download, ArrowUpRight } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/Icons';
import ContactForm from '../components/ContactForm';
import { profileData } from '../data/profile';
import { usePortfolio } from '../context/PortfolioContext';
import './ContactSection.css';

export default function ContactSection() {
  const { contact: contextContact, hero } = usePortfolio();

  const email = contextContact?.email || profileData.email;
  const phone = contextContact?.phone || profileData.phone;
  const location = contextContact?.location || profileData.location;
  const linkedin = contextContact?.linkedin || profileData.linkedin;
  const github = contextContact?.github || profileData.github;
  const resumeUrl = hero?.resumeUrl || profileData.resumeUrl;

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 relative bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-2 sm:mt-3 leading-tight">
            Let's build something great together.
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            I am actively seeking Full Stack Developer, Java Developer, and Software Engineer opportunities. Let's discuss how my skills can contribute to your team.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Recruiter Channels */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            
            {/* Email Card */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-card hover:border-teal-300 hover:shadow-card-hover transition-all group min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Direct Email</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate block">
                  {email}
                </span>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-card hover:border-teal-300 hover:shadow-card-hover transition-all group min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Phone & WhatsApp</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate block">
                  {phone}
                </span>
              </div>
            </a>

            {/* Location Card */}
            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-card min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Location</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">
                  {location}
                </span>
              </div>
            </div>

            {/* LinkedIn & GitHub Quick Buttons */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-card hover:shadow-card-hover transition-all text-xs font-semibold text-slate-800 hover:text-teal-700 group"
              >
                <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <LinkedinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-700 shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0" />
              </a>

              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-card hover:shadow-card-hover transition-all text-xs font-semibold text-slate-800 hover:text-teal-700 group"
              >
                <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 shrink-0" />
                  <span className="truncate">GitHub</span>
                </span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0" />
              </a>
            </div>

            {/* Download Resume Banner Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5">
              <div>
                <p className="text-xs font-bold">Looking for my full resume?</p>
                <p className="text-[10px] sm:text-[11px] text-teal-700">Single-page printable PDF format</p>
              </div>
              <a
                href={resumeUrl}
                download="Dinesh_M_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shrink-0 self-stretch xs:self-auto justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume PDF</span>
              </a>
            </div>

          </div>

          {/* Right Column: Functional Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </section>
  );
}
