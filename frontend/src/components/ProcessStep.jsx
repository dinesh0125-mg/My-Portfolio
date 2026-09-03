import React from 'react';
import { Compass, FileText, PenTool, Code2, CheckCircle2, Rocket } from 'lucide-react';

const processIcons = {
  Compass,
  FileText,
  PenTool,
  Code2,
  CheckCircle2,
  Rocket,
};

export default function ProcessStep({ step, isLast }) {
  const IconComponent = processIcons[step.icon] || Code2;

  return (
    <div className="flex items-start gap-4 relative group">
      {/* Icon and Connector Line */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-200 shadow-2xs z-10 shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        {!isLast && (
          <div className="w-0.5 h-12 md:h-14 border-l-2 border-dashed border-brand-200 my-1"></div>
        )}
      </div>

      {/* Content */}
      <div className="pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-600 tracking-wide">
            {step.step}.
          </span>
          <h4 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {step.title}
          </h4>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed max-w-sm">
          {step.description}
        </p>
      </div>
    </div>
  );
}
