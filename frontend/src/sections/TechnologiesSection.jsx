import React from 'react';
import { 
  Code, 
  Terminal, 
  Database, 
  Layers, 
  FileCode, 
  Globe, 
  Cpu, 
  Server, 
  GitBranch, 
  Box, 
  Compass, 
  Workflow 
} from 'lucide-react';
import { technologiesData } from '../data/technologies';

const techIconMap = {
  python: Terminal,
  java: Code,
  react: Globe,
  javascript: FileCode,
  html: Layers,
  css: Box,
  nodejs: Server,
  django: Cpu,
  springboot: Workflow,
  mysql: Database,
  mongodb: Database,
  github: GitBranch,
};

export default function TechnologiesSection({ isCompact = false }) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card h-full flex flex-col justify-between ${isCompact ? '' : 'py-8'}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-bold text-slate-900">
            Technologies I Work With
          </h3>
          <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
            Modern Stack
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Production-tested languages, frameworks, and databases utilized in client and enterprise systems.
        </p>

        {/* Logo / Tech Grid mimicking client logo grid in reference */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {technologiesData.map((tech) => {
            const Icon = techIconMap[tech.iconKey] || Code;
            return (
              <div
                key={tech.name}
                className="p-3 rounded-xl bg-slate-50 hover:bg-brand-50/60 border border-slate-100 hover:border-brand-200/80 transition-all duration-200 flex flex-col items-center justify-center text-center group"
                title={tech.category}
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-brand-600 transition-colors mb-1.5">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-brand-700 transition-colors leading-tight">
                  {tech.name}
                </span>
                <span className="text-[9px] text-slate-400 truncate max-w-full block">
                  {tech.category.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Verified Proficiency</span>
        <span className="font-semibold text-brand-600">Full Stack Ready</span>
      </div>
    </div>
  );
}
