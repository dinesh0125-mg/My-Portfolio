import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

export default function PricingCard({ tier, onSelectTier }) {
  const { name, subtitle, price, isPopular, features, buttonText } = tier;

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative bg-white ${
        isPopular
          ? 'border-2 border-brand-500 shadow-card-hover -translate-y-1 z-10'
          : 'border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-slate-300'
      }`}
    >
      {/* "Most Popular" badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-[#2EA591] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      <div>
        {/* Tier Header */}
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-bold text-slate-900">
            {name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Pricing Display */}
        <div className="mb-6 pb-5 border-b border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {price}
            </span>
          </div>
          <span className="text-xs text-brand-600 font-medium mt-1 inline-block">
            Flexible based on requirements
          </span>
        </div>

        {/* Features list */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="text-xs md:text-sm text-slate-600 flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Button
        variant={isPopular ? 'primary' : 'secondary'}
        size="md"
        className="w-full"
        onClick={() => onSelectTier && onSelectTier(name)}
      >
        {buttonText}
      </Button>
    </div>
  );
}
