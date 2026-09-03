import React from 'react';

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = false,
  actionLink,
  actionText,
  actionIcon: ActionIcon,
  className = '',
}) {
  return (
    <div className={`mb-8 md:mb-12 ${centered ? 'text-center mx-auto max-w-2xl' : ''} ${className}`}>
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${centered ? 'items-center' : ''}`}>
        <div>
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-200/60 mb-2.5">
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-slate-500 font-normal leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {actionText && (
          <a
            href={actionLink || "#"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors shrink-0 group self-start md:self-auto"
          >
            <span>{actionText}</span>
            {ActionIcon ? (
              <ActionIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            ) : (
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            )}
          </a>
        )}
      </div>
    </div>
  );
}
