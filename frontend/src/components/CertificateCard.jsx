import React from 'react';
import { Award, Code, Bot, Terminal, Calendar, ExternalLink } from 'lucide-react';

const iconMap = {
  Code,
  Bot,
  Terminal,
  Award,
};

export default function CertificateCard({ certificate }) {
  if (!certificate) return null;

  const title = certificate.title || '';
  const organization = certificate.organization || certificate.issuer || '';
  const year = certificate.year || '';
  const issuerBadge = certificate.issuerBadge || (organization.includes('Infosys') ? 'Enterprise Certification' : 'Academic Partner');
  const skills = Array.isArray(certificate.skills) ? certificate.skills : [];
  const icon = certificate.icon || 'Award';
  const IconComponent = iconMap[icon] || Award;
  const verifyUrl = certificate.certificateUrl || certificate.verifyUrl || '';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-teal-200 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200">
            <IconComponent className="w-5 h-5" />
          </div>
          {year && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{year}</span>
            </div>
          )}
        </div>

        <div className="mb-1">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            {organization}
          </span>
          {issuerBadge && (
            <>
              <span className="mx-1.5 text-slate-300">•</span>
              <span className="text-[11px] font-medium text-slate-500">{issuerBadge}</span>
            </>
          )}
        </div>

        <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
          {title}
        </h3>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Verified Competencies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/70 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {verifyUrl && (
        <div className="mt-3 pt-2">
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Verify Credential</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
