import React, { useEffect } from 'react';
import { X, CheckCircle2, ExternalLink, Code2, Layers, Cpu } from 'lucide-react';
import { GithubIcon } from './Icons';
import Button from './Button';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const title = project.title || project.name || '';
  const category = project.category || '';
  const shortDescription = project.shortDescription || project.tagline || '';
  const problemSolved = project.problemSolved || '';
  const keyFeatures = Array.isArray(project.keyFeatures) ? project.keyFeatures : [];
  const myContribution = project.myContribution || '';
  const developmentApproach = project.developmentApproach || '';
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const githubUrl = project.githubUrl || '';
  const liveDemoUrl = project.liveDemoUrl || project.liveUrl || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-full">
                {category}
              </span>
              {project.featured && (
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h2 id="modal-project-title" className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 shrink-0 touch-manipulation"
            aria-label="Close project details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          
          {/* Overview */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Overview & Purpose
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {shortDescription}
            </p>
          </div>

          {/* Problem Solved */}
          {problemSolved && (
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-teal-50/60 border border-teal-100">
              <h3 className="text-[10px] sm:text-xs font-bold text-teal-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                Problem Solved
              </h3>
              <p className="text-teal-950 text-xs sm:text-sm leading-relaxed">
                {problemSolved}
              </p>
            </div>
          )}

          {/* Key Features if present */}
          {keyFeatures.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Core Technical Features
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dinesh's Contribution */}
          {myContribution && (
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-700" />
                My Role & Contribution
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {myContribution}
              </p>
            </div>
          )}

          {/* Development Approach */}
          {developmentApproach && (
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                Development Approach & Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {developmentApproach}
              </p>
            </div>
          )}

          {/* Technologies Used */}
          {technologies.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 rounded-md border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {liveDemoUrl && (
              <a
                href={liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-2xs"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
