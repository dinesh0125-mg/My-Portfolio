import React, { useState } from 'react';

export default function ProjectMockup({ type, imageSrc, alt }) {
  const [imgError, setImgError] = useState(false);

  // If image exists and hasn't errored, render real image
  if (imageSrc && !imgError) {
    return (
      <img
        src={imageSrc}
        alt={alt || "Project Preview"}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  // Bespoke Software UI Mockups
  if (type === 'aluminium') {
    return (
      <div className="w-full h-full bg-[#EBF8F5] p-3 flex flex-col justify-between select-none font-sans text-slate-800">
        {/* Top Mini Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-teal-100 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-700 tracking-tight">Recovery Ops • Active</span>
          </div>
          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">98.4% Purity</span>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-2 my-1.5 items-stretch flex-1">
          {/* Left gauge card */}
          <div className="col-span-5 bg-white rounded-lg p-2 border border-slate-100 flex flex-col justify-center items-center text-center shadow-2xs">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-teal-500" strokeDasharray="88, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[10px] font-extrabold text-slate-800">88%</span>
            </div>
            <span className="text-[9px] font-medium text-slate-500 mt-1">Yield Rate</span>
          </div>

          {/* Right stat columns */}
          <div className="col-span-7 flex flex-col gap-1 justify-between">
            <div className="bg-white rounded-md p-1.5 border border-slate-100 flex items-center justify-between">
              <span className="text-[9px] text-slate-500">Intake Batch</span>
              <span className="text-[9px] font-bold text-slate-800">14.2 Tons</span>
            </div>
            <div className="bg-white rounded-md p-1.5 border border-slate-100 flex items-center justify-between">
              <span className="text-[9px] text-slate-500">Refined Al</span>
              <span className="text-[9px] font-bold text-teal-600">12.5 Tons</span>
            </div>
            <div className="bg-white rounded-md p-1.5 border border-slate-100 flex items-center justify-between">
              <span className="text-[9px] text-slate-500">Emission Saved</span>
              <span className="text-[9px] font-bold text-emerald-600">-64% CO₂</span>
            </div>
          </div>
        </div>

        {/* Bottom Flow Pipeline */}
        <div className="bg-white/80 rounded-md p-1.5 border border-teal-100/80 flex items-center justify-between text-[8px] text-slate-600 font-medium">
          <span className="bg-teal-50 text-teal-700 px-1 py-0.5 rounded font-bold">1. Sorting</span>
          <span>→</span>
          <span className="bg-teal-50 text-teal-700 px-1 py-0.5 rounded font-bold">2. Smelt</span>
          <span>→</span>
          <span className="bg-teal-50 text-teal-700 px-1 py-0.5 rounded font-bold">3. Ingot</span>
        </div>
      </div>
    );
  }

  if (type === 'agriculture') {
    return (
      <div className="w-full h-full bg-[#F3EFFE] p-3 flex flex-col justify-between select-none font-sans text-slate-800">
        {/* Marketplace Search Bar */}
        <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-purple-100 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <div className="w-2.5 h-2.5 rounded-full border border-slate-300"></div>
            <span className="text-[9px] text-slate-500">Search fresh crops, grains...</span>
          </div>
          <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Farmer Direct</span>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 gap-2 my-1.5 flex-1">
          <div className="bg-white rounded-lg p-2 border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="h-10 bg-emerald-50 rounded-md mb-1.5 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                Organic Wheat
              </div>
              <p className="text-[9px] font-bold text-slate-800 leading-tight">Salem Harvest</p>
              <p className="text-[8px] text-slate-400">Min Order: 50 kg</p>
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-emerald-600">₹32/kg</span>
              <span className="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-medium">Buy</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-2 border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="h-10 bg-amber-50 rounded-md mb-1.5 flex items-center justify-center text-amber-700 text-[10px] font-bold">
                Basmati Rice
              </div>
              <p className="text-[9px] font-bold text-slate-800 leading-tight">Grade-A Paddy</p>
              <p className="text-[8px] text-slate-400">Thanjavur Farms</p>
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-emerald-600">₹68/kg</span>
              <span className="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-medium">Buy</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white/80 rounded-md px-2 py-1 border border-purple-100/60 flex items-center justify-between text-[8px] text-slate-600">
          <span>Direct Bank Escrow</span>
          <span className="text-purple-600 font-bold">0% Middleman Fee</span>
        </div>
      </div>
    );
  }

  if (type === 'projecthub') {
    return (
      <div className="w-full h-full bg-[#EEF7F2] p-3 flex flex-col justify-between select-none font-sans text-slate-800">
        {/* Header */}
        <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-teal-100 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-teal-500"></span>
            <span className="text-[10px] font-bold text-slate-800">ProjectHub Evaluation</span>
          </div>
          <span className="text-[8px] bg-teal-100/80 text-teal-800 font-semibold px-1.5 py-0.5 rounded">Phase 3 Review</span>
        </div>

        {/* Milestone Steps */}
        <div className="bg-white rounded-lg p-2 my-1.5 border border-slate-100 shadow-2xs flex-1 flex flex-col justify-around">
          <div className="flex items-center justify-between text-[9px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[8px] font-bold">✓</span>
              <span className="font-medium text-slate-700">SRS & Architecture</span>
            </div>
            <span className="text-emerald-600 font-bold text-[8px]">Approved</span>
          </div>

          <div className="flex items-center justify-between text-[9px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[8px] font-bold">●</span>
              <span className="font-medium text-slate-900">Prototype Demo</span>
            </div>
            <span className="text-teal-600 font-bold text-[8px]">In Review</span>
          </div>

          <div className="flex items-center justify-between text-[9px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[8px]">○</span>
              <span className="text-slate-400">Final Viva & Journal</span>
            </div>
            <span className="text-slate-400 text-[8px]">Upcoming</span>
          </div>
        </div>

        {/* Faculty Review Badge */}
        <div className="bg-teal-600 text-white rounded-md px-2 py-1 flex items-center justify-between text-[8px]">
          <span>Faculty Guide Status</span>
          <span className="font-bold">Verified & Endorsed</span>
        </div>
      </div>
    );
  }

  // medicare
  return (
    <div className="w-full h-full bg-[#F7F4EF] p-3 flex flex-col justify-between select-none font-sans text-slate-800">
      {/* Pharmacy Header */}
      <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-amber-100 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
          <span className="text-[10px] font-bold text-slate-800">Medicare Pharmacy Dispenser</span>
        </div>
        <span className="text-[8px] bg-cyan-100 text-cyan-800 font-bold px-1.5 py-0.5 rounded">Rx Ready</span>
      </div>

      {/* Inventory Monitoring Items */}
      <div className="bg-white rounded-lg p-2 my-1.5 border border-slate-100 shadow-2xs flex-1 flex flex-col justify-around">
        <div className="flex items-center justify-between text-[9px]">
          <div>
            <span className="font-bold text-slate-800">Amoxicillin 500mg</span>
            <span className="text-[8px] text-slate-400 block">Stock: 420 Units</span>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">In Stock</span>
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-teal-500 h-full w-[78%] rounded-full"></div>
        </div>

        <div className="flex items-center justify-between text-[9px]">
          <div>
            <span className="font-bold text-slate-800">Paracetamol Syrup</span>
            <span className="text-[8px] text-amber-600 block">Expiring in 28 Days</span>
          </div>
          <span className="bg-amber-50 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">Low Shelf</span>
        </div>
      </div>

      {/* Prescription Queue Counter */}
      <div className="bg-white/80 rounded-md px-2 py-1 border border-amber-100/60 flex items-center justify-between text-[8px] text-slate-600">
        <span>Prescriptions Queued</span>
        <span className="font-bold text-slate-800">18 Pending Dispense</span>
      </div>
    </div>
  );
}
