'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  Bike, 
  Sparkles 
} from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useTranslation } from '@/lib/translations';

export default function BookingSummaryCard() {
  const { 
    step,
    setStep,
    city, 
    pincode, 
    vehicle, 
    service, 
    selectedAddOns, 
    scheduledDate, 
    timeSlot, 
    getBasePrice, 
    getTotalAmount 
  } = useBookingStore();

  const { t, isHindi } = useTranslation();

  const formattedDate = new Date(scheduledDate).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Translate service name if in Hindi
  const getServiceName = () => {
    if (!service) return isHindi ? 'पैकेज चुनें' : 'Select Package';
    if (!isHindi) return service.name;
    const s = service.name.toLowerCase();
    if (s.includes('complete') || s.includes('vacuum') || s.includes('rotator')) {
      return 'कम्प्लीट वॉश + इंटीरियर वैक्यूम + रोटेटर शाइन';
    }
    if (s.includes('rotator') || s.includes('shampoo')) {
      return 'प्रेशर वॉश + शैम्पू व रोटेटर शाइन';
    }
    if (s.includes('pressure') && s.includes('car')) {
      return 'कार प्रेशर वॉश';
    }
    if (s.includes('bucket')) {
      return 'कार बकेट वॉश';
    }
    if (s.includes('pressure') && s.includes('bike')) {
      return 'बाइक प्रेशर वॉश';
    }
    if (s.includes('bike') && (s.includes('detail') || s.includes('chain'))) {
      return 'बाइक फुल डिटेल + चेन लूब';
    }
    if (s.includes('bike')) {
      return 'बाइक साधारण धुलाई';
    }
    return service.name;
  };

  const getSegmentLabel = (seg?: string) => {
    if (!seg) return '';
    if (!isHindi) return seg.replace('_', ' ');
    switch (seg) {
      case 'hatchback': return 'हैचबैक';
      case 'sedan': return 'सेडान';
      case 'compact_suv': return 'कॉम्पैक्ट SUV';
      case 'suv': return 'बड़ी SUV';
      case 'luxury': return 'लक्ज़री कार';
      case 'commuter': return 'कम्यूटर बाइक';
      case 'sports_superbike': return 'सुपरबाइक / क्रूजर';
      default: return seg.replace('_', ' ');
    }
  };

  const getFuelLabel = (fuel?: string) => {
    if (!fuel) return isHindi ? 'पेट्रोल' : 'Petrol';
    if (!isHindi) return fuel.charAt(0).toUpperCase() + fuel.slice(1);
    switch (fuel) {
      case 'petrol': return 'पेट्रोल';
      case 'diesel': return 'डीजल';
      case 'electric': return 'इलेक्ट्रिक (EV)';
      case 'hybrid': return 'हाइब्रिड';
      default: return fuel;
    }
  };

  const handleEditStep = (targetStep: number) => {
    setStep(targetStep);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-amber-200/80 sticky top-24 shadow-[0_8px_30px_rgba(245,158,11,0.06)] space-y-4">
      <div className="flex items-center justify-between pb-3.5 border-b border-amber-100">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isHindi ? 'डोरस्टेप वॉश सारांश' : 'Doorstep Wash Summary'}</span>
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
          {isHindi ? 'ज़ीरो सरचार्ज' : 'Zero Surge'}
        </span>
      </div>

      {/* Vehicle Specs (Step 1) */}
      <div className={`p-3 rounded-2xl border transition-all ${step === 1 ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/50 shadow-xs' : 'bg-slate-50/60 border-slate-200/70'}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
          <span>{isHindi ? 'स्टेप 1: गाड़ी' : 'Step 1: Vehicle'}</span>
          {step > 1 && (
            <button
              type="button"
              onClick={() => handleEditStep(1)}
              className="text-[11px] text-amber-800 font-bold hover:underline lowercase capitalize cursor-pointer"
            >
              {isHindi ? 'बदलें' : 'Edit'}
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-950 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            {vehicle?.type === 'car' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
          </div>
          <div className="truncate">
            <div className="text-xs font-black text-slate-900 truncate">
              {vehicle?.make} {vehicle?.model}
            </div>
            <div className="text-[11px] text-amber-800 font-semibold capitalize truncate">
              {getSegmentLabel(vehicle?.segment)} • {getFuelLabel(vehicle?.fuelType)}
            </div>
          </div>
        </div>
      </div>

      {/* Service Details (Step 2) */}
      <div className={`p-3 rounded-2xl border transition-all ${step === 2 ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/50 shadow-xs' : 'bg-slate-50/60 border-slate-200/70'}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
          <span>{isHindi ? 'स्टेप 2: सर्विस' : 'Step 2: Wash Service'}</span>
          {step > 2 && (
            <button
              type="button"
              onClick={() => handleEditStep(2)}
              className="text-[11px] text-amber-800 font-bold hover:underline lowercase capitalize cursor-pointer"
            >
              {isHindi ? 'बदलें' : 'Edit'}
            </button>
          )}
        </div>
        <div className="text-xs font-black text-slate-900 truncate">
          {getServiceName()}
        </div>
        <div className="text-[11px] text-amber-800 font-bold">
          {isHindi ? `⏱ अनुमानित समय: ${service?.durationMinutes || 35} मिनट` : `⏱ Est. Duration: ${service?.durationMinutes || 35} mins`}
        </div>
      </div>

      {/* Date & Location (Step 3) */}
      <div className={`p-3 rounded-2xl border transition-all ${step === 3 ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/50 shadow-xs' : 'bg-slate-50/60 border-slate-200/70'}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-1">
          <span>{isHindi ? 'स्टेप 3: स्लॉट व पता' : 'Step 3: Slot & Location'}</span>
          {step > 3 && (
            <button
              type="button"
              onClick={() => handleEditStep(3)}
              className="text-[11px] text-amber-800 font-bold hover:underline lowercase capitalize cursor-pointer"
            >
              {isHindi ? 'बदलें' : 'Edit'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="font-bold text-slate-800 text-[11px] truncate">{formattedDate}</div>
            <div className="text-[10px] text-slate-500 truncate">{timeSlot}</div>
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[11px] truncate">{city?.city || (isHindi ? 'इंदौर' : 'Indore')}</div>
            <div className="text-[10px] text-slate-500 font-mono">Pin: {pincode}</div>
          </div>
        </div>
      </div>

      {/* Itemized Price Calculation */}
      <div className="space-y-2 mb-5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>{isHindi ? 'वॉश पैकेज मूल्य:' : 'Base Wash Price:'}</span>
          <span className="font-bold text-slate-900 font-mono">₹{getBasePrice()}</span>
        </div>

        {selectedAddOns.map((addon) => (
          <div key={addon.id} className="flex justify-between text-slate-600">
            <span className="truncate max-w-[180px]">+ {addon.name}</span>
            <span className="font-bold text-slate-900 font-mono">₹{addon.price}</span>
          </div>
        ))}

        <div className="flex justify-between text-emerald-600">
          <span>{isHindi ? 'शुद्ध स्वच्छ पानी:' : 'Clean Pure Water:'}</span>
          <span className="font-bold uppercase text-[10px]">{isHindi ? 'मुफ़्त शामिल' : 'Included Free'}</span>
        </div>

        <div className="flex justify-between text-emerald-600">
          <span>{isHindi ? 'मोबाइल पावर जनरेटर:' : 'Mobile Power Generator:'}</span>
          <span className="font-bold uppercase text-[10px]">{isHindi ? '₹0 (मुफ़्त)' : '₹0 (On Us)'}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-3.5 border-t border-slate-100 flex items-baseline justify-between mb-5">
        <div>
          <span className="text-xs font-semibold text-slate-700 block">{isHindi ? 'कुल राशि' : 'Total Amount'}</span>
          <span className="text-[10px] text-slate-400">{isHindi ? 'सभी टैक्स शामिल' : 'All taxes included'}</span>
        </div>
        <div className="flex items-baseline space-x-0.5">
          <span className="text-sm font-bold text-amber-700">₹</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {getTotalAmount()}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-2 text-[11px] text-slate-600">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{isHindi ? '100% शुद्ध पानी व जनरेटर। धुलाई के बाद भुगतान करें।' : '100% pure water & silent power. Pay post-wash.'}</span>
      </div>

    </div>
  );
}
