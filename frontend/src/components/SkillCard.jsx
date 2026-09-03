import React from 'react';
import { Code2, Monitor, Server, Database, Wrench, CheckCircle2 } from 'lucide-react';

const categoryIcons = {
  languages: Code2,
  frontend: Monitor,
  backend: Server,
  database: Database,
  tools: Wrench,
};

export default function SkillCard({ category }) {
  if (!category) return null;
  const id = category.id || 'languages';
  const title = category.title || category.name || '';
  const description = category.description || '';
  const skills = Array.isArray(category.skills) ? category.skills : [];
  const IconComponent = categoryIcons[id] || Code2;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-teal-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Category Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {title}
            </h3>
          </div>
        </div>

        {description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Skill Badges & Notes */}
        <div className="space-y-2.5">
          {skills.map((skill) => (
            <div
              key={skill.name || skill.id}
              className={`p-2.5 rounded-xl border transition-all ${
                skill.highlight
                  ? 'bg-teal-50/40 border-teal-200/80'
                  : 'bg-slate-50/60 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-bold ${
                  skill.highlight ? 'text-teal-900' : 'text-slate-800'
                }`}>
                  {skill.name}
                </span>

                {skill.highlight && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
                    Core
                  </span>
                )}
              </div>

              {skill.note && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {skill.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
