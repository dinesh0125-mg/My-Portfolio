import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import PricingCard from '../components/PricingCard';
import ProcessSection from './ProcessSection';
import { pricingData } from '../data/pricing';

export default function PricingSection() {
  const [selectedTier, setSelectedTier] = useState(null);

  const handleSelectTier = (tierName) => {
    setSelectedTier(tierName);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-12 md:py-20 bg-slate-50/40 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Paired Layout matching reference: Pricing (Left ~60%) + Process (Right ~40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: 3 Pricing Cards */}
          <div className="lg:col-span-8 xl:col-span-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Service Packages & Engagement Models
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Transparent scope-based engagements for frontend, backend, or full-stack web solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
              {pricingData.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  onSelectTier={handleSelectTier}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Development Process Stepper */}
          <div id="process" className="lg:col-span-4 xl:col-span-4 lg:pt-2">
            <ProcessSection isCard={true} />
          </div>

        </div>
      </div>
    </section>
  );
}
