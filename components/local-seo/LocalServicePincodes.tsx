import React from 'react';
import { MapPin, CheckCircle2, Shield, Compass } from 'lucide-react';
import { LocationCity } from '@/types';

interface LocalServicePincodesProps {
  city: LocationCity;
}

export default function LocalServicePincodes({ city }: LocalServicePincodesProps) {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Coverage Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Serviceable Pin Codes & Neighborhoods in {city.city}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Our self-sustained mobile wash vans are stationed across key areas in {city.city} for swift doorstep arrival.
          </p>
        </div>

        {/* Pin Codes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {city.serviceablePincodes.map((pin) => (
            <div
              key={pin}
              className="p-3.5 rounded-xl bg-white border border-slate-200 text-center hover:border-amber-400 shadow-2xs transition-colors group"
            >
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Pincode</span>
              <span className="text-base font-black text-slate-900 font-mono group-hover:text-amber-600 transition-colors">
                {pin}
              </span>
              <div className="mt-1 flex items-center justify-center space-x-1 text-[10px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Key Landmarks */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Primary Doorstep Wash Areas in {city.city}
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {city.landmarks.map((landmark) => (
                  <span
                    key={landmark}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 font-medium"
                  >
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">Local Operations Hub:</div>
            <div className="text-xs font-bold text-slate-800 max-w-xs truncate">
              {city.addressLine}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
