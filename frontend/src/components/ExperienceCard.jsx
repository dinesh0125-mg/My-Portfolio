import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function ExperienceCard({ item }) {
  if (!item) return null;

  const role = item.role || item.jobTitle || '';
  const company = item.company || '';
  const period = item.period || `${item.startDate || ''} – ${item.endDate || ''}`.trim();
  const location = item.location || 'Chennai, India';
  const summary = item.summary || '';
  const responsibilities = Array.isArray(item.responsibilities) ? item.responsibilities : [];
  const technologies = Array.isArray(item.technologies) ? item.technologies : [];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-teal-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header with Company & Role */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
              {company}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {role}
            </h3>
          </div>

          <div className="flex flex-col sm:items-end text-xs text-slate-500 font-medium shrink-0">
            {period && (
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {period}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1 mt-1 text-slate-400">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
            )}
          </div>
        </div>

        {/* What I Worked On Summary */}
        {summary && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900 block mb-0.5">Focus:</span>
            {summary}
          </div>
        )}

        {/* Key Responsibilities & Achievements */}
        {responsibilities.length > 0 && (
          <div className="space-y-2 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Key Responsibilities & Deliverables
            </span>
            <ul className="space-y-2">
              {responsibilities.map((resp, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Technologies Used */}
      {technologies.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Technologies & Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((t) => (
              <span key={t} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
