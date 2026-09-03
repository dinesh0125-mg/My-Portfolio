import React from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import TechnologiesSection from './TechnologiesSection';
import { servicesData } from '../data/services';

export default function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Layout: Services on Left (~60%) + Technologies on Right (~40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Services I Offer */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between">
            <div>
              <SectionHeading
                title="Services I Offer"
                subtitle="High-impact engineering solutions from frontend interfaces to backend data pipelines."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesData.slice(0, 4).map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>

            {/* Additional 2 services in bottom row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {servicesData.slice(4, 6).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

          {/* Right Column: Technologies I Work With (adapts Trusted by Clients from reference) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <TechnologiesSection isCompact={false} />
          </div>

        </div>
      </div>
    </section>
  );
}
