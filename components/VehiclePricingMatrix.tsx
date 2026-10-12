'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Car, 
  Bike, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { LUXURY_SERVICES } from '@/lib/seedData';
import { useBookingStore } from '@/lib/store/bookingStore';
import { VehicleSegment, ServicePackage } from '@/types';

interface SegmentOption {
  id: VehicleSegment;
  title: string;
  category: 'car' | 'bike';
  examples: string;
  badge?: string;
}

const SEGMENT_OPTIONS: SegmentOption[] = [
  {
    id: 'hatchback',
    title: 'Hatchback',
    category: 'car',
    examples: 'Swift, i20, Altroz, Baleno, Mini Cooper',
  },
  {
    id: 'sedan',
    title: 'Executive Sedan',
    category: 'car',
    examples: 'Honda City, Hyundai Verna, VW Virtus, Skoda Slavia',
  },
  {
    id: 'compact_suv',
    title: 'Compact SUV',
    category: 'car',
    examples: 'Creta, Seltos, Nexon EV, Grand Vitara, Elevate',
  },
  {
    id: 'suv',
    title: 'Full-Size SUV',
    category: 'car',
    examples: 'Toyota Fortuner, XUV700, Tata Safari, Scorpio-N',
  },
  {
    id: 'luxury',
    title: 'Luxury & Supercar',
    category: 'car',
    examples: 'Mercedes E/S-Class, BMW 5/7 Series, Audi Q7/A6, Porsche 911',
    badge: 'Elite Care',
  },
  {
    id: 'commuter',
    title: 'Commuter & EV Bike',
    category: 'bike',
    examples: 'Royal Enfield Classic 350, Yamaha MT-15, Ather 450X, Ola S1',
  },
  {
    id: 'sports_superbike',
    title: 'Superbike & Cruiser',
    category: 'bike',
    examples: 'Ducati Panigale, BMW S1000RR, Triumph Tiger, Harley-Davidson',
    badge: 'Pro Grade',
  },
];

export default function VehiclePricingMatrix() {
  const router = useRouter();
  const [selectedSegment, setSelectedSegment] = useState<VehicleSegment>('sedan');
  const { setVehicle, setService } = useBookingStore();

  const currentSegmentMeta = SEGMENT_OPTIONS.find(s => s.id === selectedSegment)!;

  const handleBookFromMatrix = (srv: ServicePackage) => {
    setVehicle({
      type: currentSegmentMeta.category,
      make: currentSegmentMeta.examples.split(',')[0].trim(),
      model: currentSegmentMeta.title,
      segment: selectedSegment,
      fuelType: 'petrol',
    });
    setService(srv);
    router.push('/book');
  };

  return (
    <section id="pricing" className="py-24 relative bg-[#090D14] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#00D2FF] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tiered Automotive Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Transparent Rates by <span className="gold-gradient-text">Vehicle Segment</span>
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-3">
            No hidden surge fees. Precision pricing calibrated to body surface area, paintwork complexity, and decontamination requirements.
          </p>
        </div>

        {/* Interactive Segment Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SEGMENT_OPTIONS.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  isSelected
                    ? 'bg-[#131B2A] border-[#D4AF37] text-white shadow-xl shadow-[#D4AF37]/15'
                    : 'glass-card border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#94A3B8]/40'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  {seg.category === 'car' ? (
                    <Car className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E5C07B]' : 'text-[#94A3B8]'}`} />
                  ) : (
                    <Bike className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00D2FF]' : 'text-[#94A3B8]'}`} />
                  )}
                  <span>{seg.title}</span>
                  {seg.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#E5C07B] font-extrabold uppercase">
                      {seg.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#94A3B8] max-w-[140px] truncate">
                  {seg.examples}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Segment Banner */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 border border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#00D2FF]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Active Selection: {currentSegmentMeta.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#131B2A] text-[#E5C07B] border border-[#1E293B]">
                  {currentSegmentMeta.category.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-[#94A3B8]">
                Benchmarked for: {currentSegmentMeta.examples}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#94A3B8] flex items-center space-x-4">
            <span>Includes 100% pure de-ionized water</span>
            <span>Zero customer power needed</span>
          </div>
        </div>

        {/* Pricing Cards for Current Segment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LUXURY_SERVICES.filter(s => s.category === currentSegmentMeta.category).map((srv) => {
            const price = srv.vehiclePricing[selectedSegment] || 799;

            return (
              <div
                key={srv.id}
                className="glass-card rounded-2xl p-6 border border-[#1E293B] flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#00D2FF] font-mono uppercase">
                      {srv.durationMinutes} Min Session
                    </span>
                    {srv.popular && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E5C07B] border border-[#D4AF37]/30">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#E5C07B] transition-colors mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mb-6">
                    {srv.tagline}
                  </p>

                  <div className="p-4 rounded-xl bg-[#0B0F17]/80 border border-[#1E293B] mb-6">
                    <div className="text-[11px] text-[#94A3B8] mb-1">Total Doorstep Price:</div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-sm font-bold text-[#E5C07B]">₹</span>
                      <span className="text-3xl font-black text-white font-mono">{price}</span>
                      <span className="text-xs text-[#94A3B8] ml-1">all-inclusive</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {srv.includedTasks.slice(0, 4).map((t, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-[#94A3B8]">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookFromMatrix(srv)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#131B2A] hover:gold-gradient hover:text-[#0B0F17] text-white border border-[#1E293B] hover:border-transparent font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>Select Slot for {currentSegmentMeta.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
