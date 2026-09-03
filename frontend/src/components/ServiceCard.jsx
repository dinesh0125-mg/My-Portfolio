import React from 'react';
import { 
  Layout, 
  Monitor, 
  Layers, 
  Server, 
  Cpu, 
  Database,
  Code2,
  Terminal,
  Globe
} from 'lucide-react';

const iconMap = {
  Layout,
  Monitor,
  Layers,
  Server,
  Cpu,
  Database,
  Code2,
  Terminal,
  Globe
};

export default function ServiceCard({ service }) {
  const { iconName, title, description } = service;
  const IconComponent = iconMap[iconName] || Code2;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        <div className="w-11 h-11 rounded-xl bg-[#E8F8F4] text-[#2EA591] flex items-center justify-center mb-4 group-hover:bg-[#2EA591] group-hover:text-white transition-all duration-300 shadow-2xs">
          <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
        </div>

        <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>

        <p className="mt-2 text-xs md:text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Learn more</span>
        <span>→</span>
      </div>
    </div>
  );
}
