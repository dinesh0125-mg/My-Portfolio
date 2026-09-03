import React from 'react';
import SectionHeading from '../components/SectionHeading';
import ExperienceCard from '../components/ExperienceCard';
import { experienceData } from '../data/experience';
import { usePortfolio } from '../context/PortfolioContext';
import './ExperienceSection.css';

export default function ExperienceSection() {
  const { experience: contextExp } = usePortfolio();
  const experiences = contextExp && contextExp.length > 0 ? contextExp : experienceData;

  return (
    <section id="experience" className="py-16 md:py-24 bg-slate-50/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Work History"
          title="Internship & Industry Experience"
          subtitle="Real-world engineering internships contributing to production web features, Java platforms, and database maintenance."
        />

        {/* 2-Card Side-by-Side Grid for Internships */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {experiences.map((item) => (
            <ExperienceCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}
