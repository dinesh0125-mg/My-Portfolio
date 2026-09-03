import React from 'react';
import SectionHeading from '../components/SectionHeading';
import CertificateCard from '../components/CertificateCard';
import { certificatesData } from '../data/certificates';
import './CertificatesSection.css';

export default function CertificatesSection() {
  return (
    <section id="certificates" className="py-12 md:py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Verified Certifications"
          subtitle="Accredited technical credentials from Infosys Springboard and CodeTantra."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificatesData.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
