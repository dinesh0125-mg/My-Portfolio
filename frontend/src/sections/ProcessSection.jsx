import React from 'react';
import ProcessStep from '../components/ProcessStep';
import { processData } from '../data/process';

export default function ProcessSection({ isCard = false }) {
  return (
    <div className={isCard ? "bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-card h-full flex flex-col justify-between" : ""}>
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
          My Development Process
        </h3>
        <p className="text-xs md:text-sm text-slate-500 mb-8 leading-relaxed">
          A disciplined engineering workflow ensuring high code quality, scalability, and seamless delivery.
        </p>

        <div className="space-y-0">
          {processData.map((step, idx) => (
            <ProcessStep
              key={step.step}
              step={step}
              isLast={idx === processData.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
