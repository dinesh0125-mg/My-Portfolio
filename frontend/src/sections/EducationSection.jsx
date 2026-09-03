import React from 'react';
import SectionHeading from '../components/SectionHeading';
import EducationCard from '../components/EducationCard';
import CertificateCard from '../components/CertificateCard';
import { educationData } from '../data/education';
import { certificatesData } from '../data/certificates';
import { usePortfolio } from '../context/PortfolioContext';
import './EducationSection.css';

export default function EducationSection() {
  const { education: contextEdu, certificates: contextCerts } = usePortfolio();

  const education = (contextEdu && contextEdu.length > 0) ? contextEdu[0] : educationData;
  const certificates = (contextCerts && contextCerts.length > 0) ? contextCerts : certificatesData;

  return (
    <section id="education" className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Academic & Certifications"
          title="Education & Credentials"
          subtitle="Formal engineering degree and verified technical accreditations from Infosys Springboard and CodeTantra."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Education Card (~60%) */}
          <div className="lg:col-span-7">
            <EducationCard education={education} />
          </div>

          {/* Right Column: Verified Certificates (~40%) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Technical Certifications ({certificates.length})
            </h3>
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
