import React from 'react';
import { GraduationCap, Award, Calendar, MapPin, CheckCircle2, BookOpen } from 'lucide-react';

export default function EducationCard({ education }) {
  if (!education) return null;

  const degree = education.degree || '';
  const institution = education.institution || '';
  const location = education.location || 'Chennai, India';
  const duration = education.duration || `${education.startYear || '2023'} – ${education.endYear || '2027'}`;
  const cgpa = education.cgpa || '';
  const coursework = Array.isArray(education.coursework) ? education.coursework : [];
  const description = education.description || '';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                {institution}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {degree}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {duration && (
              <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {duration}
              </span>
            )}
            {cgpa && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                CGPA {cgpa}
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            {description}
          </p>
        )}

        {/* Relevant Coursework */}
        {coursework.length > 0 && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              Relevant Engineering Coursework
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {coursework.map((course, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {location}</span>
        <span className="font-semibold text-teal-700">Final-Year CSE Status</span>
      </div>
    </div>
  );
}
