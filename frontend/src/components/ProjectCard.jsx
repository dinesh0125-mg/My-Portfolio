import React from 'react';
import ProjectMockup from './ProjectMockups';
import { ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectCard({ project, onOpenDetails, onSelect }) {
  if (!project) return null;

  const handleOpen = () => {
    if (typeof onOpenDetails === 'function') onOpenDetails(project);
    else if (typeof onSelect === 'function') onSelect(project);
  };

  const title = project.title || project.name || '';
  const category = project.category || '';
  const featured = !!project.featured;
  const tag = project.tag || (featured ? 'Featured' : '');
  const shortDescription = project.shortDescription || project.tagline || '';
  const problemSolved = project.problemSolved || '';
  const keyFeatures = Array.isArray(project.keyFeatures) ? project.keyFeatures : [];
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const myContribution = project.myContribution || '';
  const githubUrl = project.githubUrl || '';
  const liveDemoUrl = project.liveDemoUrl || project.liveUrl || '';
  const type = project.type || 'web';
  const image = project.imageUrl || project.image || '/images/project-agriculture.jpg';

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 ${
        featured
          ? 'border-teal-200/90 shadow-card hover:shadow-card-hover ring-1 ring-teal-500/10'
          : 'border-slate-200 shadow-card hover:shadow-card-hover'
      }`}
    >
      {/* Top Preview Area with Mockup & Badge */}
      <div
        className="p-3 bg-slate-50/80 border-b border-slate-100 relative cursor-pointer"
        onClick={handleOpen}
        title="Click to view project details"
      >
        <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden shadow-2xs border border-slate-200/70 relative">
          <ProjectMockup type={type} imageSrc={image} alt={title} />
          
          {/* Quick View overlay on hover */}
          <div className="absolute inset-0 bg-slate-900/10 sm:bg-slate-900/0 sm:group-hover:bg-slate-900/15 transition-colors duration-300 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100">
            <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-white/95 backdrop-blur-xs text-slate-900 shadow-md flex items-center gap-1 hover:bg-white transition-all transform scale-95 sm:group-hover:scale-100">
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
            </span>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-5 left-5 flex items-center gap-1.5 z-10">
          {featured && (
            <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-full bg-teal-600 text-white shadow-sm">
              {tag || 'Featured'}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {category}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          </div>

          {/* Project Title */}
          <h3
            onClick={handleOpen}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug cursor-pointer"
          >
            {title}
          </h3>

          {/* One-line Description */}
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>

          {/* Problem Solved Snippet */}
          {problemSolved && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] sm:text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-0.5">Purpose & Problem:</span>
              <p className="line-clamp-2 text-slate-600">{problemSolved}</p>
            </div>
          )}

          {/* Key Features (Bullets) if present */}
          {keyFeatures.length > 0 && (
            <div className="mt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Key Features
              </span>
              <ul className="space-y-1">
                {keyFeatures.slice(0, 2).map((feat, i) => (
                  <li key={i} className="text-[11px] sm:text-xs text-slate-600 flex items-start gap-1.5 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* My Contribution Snippet */}
          {myContribution && (
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                My Contribution
              </span>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                {myContribution}
              </p>
            </div>
          )}
        </div>

        {/* Tech Stack & Actions */}
        <div className="mt-4 sm:mt-5 pt-3.5 border-t border-slate-100 space-y-3">
          {/* Tech pills */}
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors py-1 touch-manipulation"
            >
              <span>View Full Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors touch-manipulation"
                  title="GitHub Repository"
                  aria-label="GitHub Repository"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
