import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { projectsData } from '../data/projects';
import { usePortfolio } from '../context/PortfolioContext';
import './ProjectsSection.css';

export default function ProjectsSection() {
  const { projects: contextProjects } = usePortfolio();
  const projects = contextProjects && contextProjects.length > 0 ? contextProjects : projectsData;

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: `All Projects (${projects.length})` },
    { id: 'featured', label: 'Featured Flagships' },
    { id: 'java', label: 'Java & Spring Boot' },
    { id: 'mern', label: 'MERN & Python' },
  ];

  const filteredProjects = projects.filter((proj) => {
    const techs = Array.isArray(proj.technologies) ? proj.technologies : [];
    if (activeFilter === 'featured') return proj.featured;
    if (activeFilter === 'java') return techs.includes('Java') || techs.includes('Spring Boot');
    if (activeFilter === 'mern') return techs.includes('Node.js') || techs.includes('Django');
    return true;
  });

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Portfolio Work"
          title="Featured Projects"
          subtitle="Full-stack web platforms and backend systems solving real-world domain problems with clean architecture."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                activeFilter === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-Column Grid for Flagship Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        {/* Detailed Modal Dialogue */}
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
