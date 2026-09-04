import React, { useState } from 'react';
import { Award, Code, Bot, Terminal, Calendar, ExternalLink, Eye, X, Maximize2 } from 'lucide-react';

const iconMap = {
  Code,
  Bot,
  Terminal,
  Award,
};

export default function CertificateCard({ certificate }) {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-teal-200 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
        <div>
          {/* Top Row: Icon + Organization & Year */}
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

          {/* Organization & Issuer Badge */}
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

          {/* Title */}
          <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug mb-3">
            {title}
          </h3>

          {/* Certificate Image Thumbnail Preview */}
          {imageUrl && !imageError && (
            <div
              onClick={() => setShowModal(true)}
              className="relative rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-slate-200/80 cursor-pointer group/thumb shadow-2xs hover:border-teal-300 transition-all aspect-video sm:aspect-16/10"
              title="Click to view certificate"
            >
              <img
                src={imageUrl}
                alt={title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-2xs">
                <Eye className="w-4 h-4" />
                <span>View Certificate</span>
              </div>
            </div>
          )}
        </div>

        {/* Verified Competencies */}
        {skills.length > 0 && (
          <div className="mt-2 pt-3 border-t border-slate-100">
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

        {/* Card Footer with View Certificate and Verify Credential */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          {imageUrl && !imageError ? (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
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
              className="text-[11px] font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Verify Credential</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Certificate Full Modal / Lightbox */}
      {showModal && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl relative max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
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
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Image View */}
            <div className="flex-1 overflow-auto rounded-xl bg-slate-100 border border-slate-200/80 p-2 flex items-center justify-center min-h-[260px] max-h-[60vh]">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto max-h-[58vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              {certificate.credentialId ? (
                <span className="font-mono text-slate-500">
                  Credential ID: <span className="text-slate-800 font-semibold">{certificate.credentialId}</span>
                </span>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-3 ml-auto">
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Open Full Image</span>
                </a>
                {verifyUrl && (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 font-bold text-white shadow-sm inline-flex items-center gap-1.5 transition-colors"
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

