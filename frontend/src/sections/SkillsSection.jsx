import React from 'react';
import SectionHeading from '../components/SectionHeading';
import SkillCard from '../components/SkillCard';
import { skillsData } from '../data/skills';
import { usePortfolio } from '../context/PortfolioContext';
import './SkillsSection.css';

export default function SkillsSection() {
  const { skills: contextSkills } = usePortfolio();

  let categories = skillsData.categories;
  if (contextSkills && typeof contextSkills === 'object' && !Array.isArray(contextSkills) && Object.keys(contextSkills).length > 0) {
    categories = skillsData.categories.map((baseCat) => {
      const matchKey = Object.keys(contextSkills).find((k) =>
        baseCat.title.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(baseCat.id.toLowerCase())
      );
      if (matchKey && Array.isArray(contextSkills[matchKey])) {
        return {
          ...baseCat,
          skills: contextSkills[matchKey].map((s) => ({
            name: s.name,
            note: s.note || '',
            highlight: !!s.highlight,
          })),
        };
      }
      return baseCat;
    });
  } else if (Array.isArray(contextSkills) && contextSkills.length > 0) {
    categories = contextSkills;
  }

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Technical Competencies"
          title="Skills & Technologies"
          subtitle="Focused tech stack relevant to Full Stack, Java, and Software Developer positions."
        />

        {/* 5-Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {categories.map((cat) => (
            <SkillCard key={cat.id || cat.title || cat.name} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
