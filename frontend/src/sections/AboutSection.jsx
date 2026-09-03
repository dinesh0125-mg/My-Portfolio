import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { profileData } from '../data/profile';
import { Layers, Code2, Globe, Cpu, CheckCircle2, Download, Mail } from 'lucide-react';
import Button from '../components/Button';
import { usePortfolio } from '../context/PortfolioContext';
import './AboutSection.css';

const highlightIcons = {
  fullstack: Layers,
  java: Code2,
  webapps: Globe,
  'problem-solving': Cpu,
  Layers: Layers,
  Code2: Code2,
  Globe: Globe,
  Cpu: Cpu,
};

export default function AboutSection() {
  const { about: contextAbout, hero } = usePortfolio();
  const about = contextAbout || profileData.about;

  const heading = about.heading || profileData.about.heading;
  const intro = about.description || about.intro || profileData.about.intro;
  const summaryPoints = Array.isArray(about.additionalInfo) && about.additionalInfo.length > 0
    ? about.additionalInfo
    : profileData.about.summaryPoints;
  const highlights = Array.isArray(about.highlights) && about.highlights.length > 0
    ? about.highlights
    : profileData.about.highlights;
  const resumeUrl = hero?.resumeUrl || profileData.resumeUrl;

  return (
    <section id="about" className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge={profileData.about.badge}
          title={heading}
          subtitle="A focused overview of my full-stack background, Java software engineering foundation, and development philosophy."
        />

        {/* Clean Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Short Professional Introduction */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {heading}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {intro}
            </p>

            <div className="pt-2 space-y-2.5">
              {summaryPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-5 flex flex-wrap items-center gap-3">
              <a
                href={resumeUrl}
                download="Dinesh_M_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </a>

              <Button
                variant="secondary"
                size="sm"
                href="#contact"
                icon={Mail}
                iconPosition="left"
              >
                Contact Me
              </Button>
            </div>
          </div>

          {/* Right Column: 4 Quick Professional Highlight Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((card, index) => {
              const iconKey = card.icon || card.id;
              const Icon = highlightIcons[iconKey] || Layers;
              return (
                <div
                  key={card.id || index}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-teal-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3.5 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                      {card.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.description || card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
