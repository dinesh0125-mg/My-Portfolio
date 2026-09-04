import React, { useState, useEffect } from 'react';
import { Award, Code, Bot, Terminal, Calendar, ExternalLink, Eye, X, Maximize2 } from 'lucide-react';

const iconMap = {
  Code,
  Bot,
  Terminal,
  Award,
};

export default function CertificateCard({ certificate }) {
  const [showModal, setShowModal] = useState(false);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  if (!certificate) return null;

  const title = certificate.title || '';
  const organization = certificate.organization || certificate.issuer || '';
  const year = certificate.year || '';
  const issuerBadge =
    certificate.issuerBadge ||
    (organization.toLowerCase().includes('infosys') ? 'Enterprise Certification' : 'Academic Partner');
  const skills = Array.isArray(certificate.skills) ? certificate.skills : [];
  const icon = certificate.icon || 'Award';
  const IconComponent = iconMap[icon] || Award;
  const verifyUrl = certificate.certificateUrl || certificate.verifyUrl || '';
  const imageUrl = certificate.certificateImageUrl || certificate.imageUrl || certificate.image || '';

  return (
    <>
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-teal-200 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
        <div>
          {/* Top Row: Icon + Year Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
              <IconComponent className="w-5 h-5" />
            </div>
            {year && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{year}</span>
              </div>
            )}
          </div>

          {/* Organization & Issuer Badge */}
          <div className="mb-1.5">
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

          {/* Certificate Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
            {title}
          </h3>
        </div>

        {/* Verified Competencies */}
        {skills.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100">
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

        {/* Card Footer: View Certificate Button & Verify Link */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/70 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer touch-manipulation"
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>View Certificate</span>
            </button>
          ) : (
            <span />
          )}

          {verifyUrl && (
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-500 hover:text-teal-700 hover:underline inline-flex items-center gap-1 transition-colors ml-auto touch-manipulation"
            >
              <span>Verify Credential</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* Certificate Full Modal / Lightbox for Both Desktop & Mobile */}
      {showModal && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] border border-slate-200 shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0 bg-white">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                    {organization}
                  </span>
                  {issuerBadge && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-slate-500">{issuerBadge}</span>
                    </>
                  )}
                  {year && (
                    <span className="text-xs text-slate-400">({year})</span>
                  )}
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-slate-900 leading-snug truncate">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0 touch-manipulation"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High-resolution Certificate Image */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 bg-slate-900/5 sm:bg-slate-100 flex items-center justify-center min-h-[220px]">
              <img
                src={imageUrl}
                alt={title}
                className="w-auto max-w-full max-h-[58vh] sm:max-h-[64vh] object-contain rounded-lg sm:rounded-xl shadow-md mx-auto block"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
              {certificate.credentialId ? (
                <span className="text-[11px] sm:text-xs font-mono text-slate-500 text-center sm:text-left">
                  Credential ID: <span className="text-slate-800 font-semibold">{certificate.credentialId}</span>
                </span>
              ) : (
                <span className="hidden sm:inline" />
              )}
              <div className="flex items-center gap-2 justify-end">
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-1.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors touch-manipulation"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Open Full</span>
                </a>
                {verifyUrl && (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none justify-center px-4 py-2 sm:py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-xs text-white shadow-sm inline-flex items-center gap-1.5 transition-colors touch-manipulation"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

