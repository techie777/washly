'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

const CAR_PACKAGES = [
  {
    id: 'car-pressure-wash',
    icon: '🚿',
    nameEn: 'Pressure Shampoo Wash',
    nameHi: 'प्रेशर शैम्पू वॉश',
    descEn: 'Home visit high-pressure shampoo wash • Including tax & other charges',
    descHi: 'होम विजिट हाई-प्रेशर शैम्पू वॉश • सभी टैक्स व अन्य चार्ज सहित',
    tagEn: '1st Option • Popular',
    tagHi: 'विकल्प 1 • लोकप्रिय',
    time: '35 Min',
    prices: { hatchback: 250, sedan: 250, suv: 250 },
    popular: true,
  },
  {
    id: 'car-bucket-wash',
    icon: '🧽',
    nameEn: 'Bucket Shampoo Wash',
    nameHi: 'बकेट शैम्पू वॉश',
    descEn: 'Home visit gentle bucket shampoo wash • Including tax & other charges',
    descHi: 'होम विजिट बकेट शैम्पू वॉश • सभी टैक्स व अन्य चार्ज सहित',
    tagEn: '2nd Option • Budget',
    tagHi: 'विकल्प 2 • किफायती',
    time: '25 Min',
    prices: { hatchback: 150, sedan: 150, suv: 150 },
    popular: false,
  },
  {
    id: 'shampoo-rotator-shine',
    icon: '🧹',
    nameEn: 'Pressure Shampoo Wash + Vacuum Cleaning + Perfume',
    nameHi: 'प्रेशर शैम्पू वॉश + वैक्यूम क्लीनिंग + परफ्यूम',
    descEn: 'Pressure shampoo exterior wash + deep interior vacuum cleaning + perfume',
    descHi: 'प्रेशर शैम्पू वॉश + डीप वैक्यूम क्लीनिंग + कार परफ्यूम (सभी चार्ज सहित)',
    tagEn: '3rd Option • Best Value',
    tagHi: 'विकल्प 3 • बेस्ट वैल्यू',
    time: '50 Min',
    prices: { hatchback: 400, sedan: 400, suv: 400 },
    popular: false,
  },
  {
    id: 'complete-wash-interior-vacuum-perfume',
    icon: '🌟',
    nameEn: 'Pressure Shampoo Wash + Vacuum Cleaning + Rotator Buffing Exterior Shine with Machine + Perfume',
    nameHi: 'प्रेशर शैम्पू वॉश + वैक्यूम क्लीनिंग + मशीन रोटेटर बफिंग एक्सटीरियर शाइन + परफ्यूम',
    descEn: 'Complete pressure shampoo wash, deep vacuum, rotator machine shine + perfume',
    descHi: 'प्रेशर शैम्पू + वैक्यूम + मशीन रोटेटर बफिंग एक्सटीरियर शाइन + परफ्यूम',
    tagEn: '4th Option • All-In-One',
    tagHi: 'विकल्प 4 • ऑल-इन-वन',
    time: '65 Min',
    prices: { hatchback: 600, sedan: 600, suv: 600 },
    popular: false,
  },
];

const BIKE_PACKAGES = [
  {
    id: 'bike-foam-pressure',
    icon: '🛵',
    nameEn: 'Bike / Scooter Foam Pressure Wash',
    nameHi: 'बाइक / स्कूटर फोम प्रेशर वॉश',
    descEn: 'High pressure foam spray, engine degrease & tire rinse',
    descHi: 'हाई प्रेशर फोम स्प्रे, इंजन व टायर रिम डीप वॉश',
    tagEn: 'Quick Clean',
    tagHi: 'क्विक क्लीन',
    time: '20 Min',
    price: 99,
  },
  {
    id: 'bike-super-detailing',
    icon: '✨',
    nameEn: 'Bike Super Detailing + Rotator Shine',
    nameHi: 'बाइक सुपर डिटेलिंग + रोटेटर शाइन',
    descEn: 'Deep pressure wash, chain lube, chrome polish & machine wax',
    descHi: 'डीप प्रेशर वॉश, चेन ल्यूब, क्रोम पॉलिश व मशीन वैक्स',
    tagEn: 'Showroom Gloss',
    tagHi: 'शोरूम शाइन',
    time: '35 Min',
    price: 199,
  },
];

const VEHICLE_LABELS: Record<'hatchback' | 'sedan' | 'suv' | 'bike', { en: string; hi: string; icon: string }> = {
  hatchback: { en: 'Hatchback', hi: 'हैचबैक', icon: '🚗' },
  sedan: { en: 'Sedan', hi: 'सेडान', icon: '🏎️' },
  suv: { en: 'SUV', hi: 'SUV', icon: '🚙' },
  bike: { en: 'Bike', hi: 'बाइक', icon: '🛵' },
};

export default function QuickPricingSection() {
  const { isHindi } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState<'hatchback' | 'sedan' | 'suv' | 'bike'>('hatchback');

  return (
    <section id="quick-pricing" className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4 scroll-mt-24">
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-amber-200/90 shadow-md p-4 sm:p-6 lg:p-7 space-y-4">
        {/* Header & Segment Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-900">
              <span aria-hidden="true" className="text-amber-600">🏷️</span>
              <span>{isHindi ? 'डोरस्टेप वॉश रेट लिस्ट (पारदर्शी दरें)' : 'Doorstep Wash Rates & Packages'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {isHindi ? '100% पारदर्शी' : 'Zero Hidden Fees'}
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {isHindi ? '₹99 की होम/डोरस्टेप विजिट बिल्कुल फ्री • सभी टैक्स शामिल (पानी व बिजली ग्राहक द्वारा)' : 'Free Door / Home Visit worth ₹99 included • All taxes included (Water & power by customer)'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
            {(['hatchback', 'sedan', 'suv', 'bike'] as const).map((type) => {
              const isSelected = selectedVehicle === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedVehicle(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white shadow-xs font-black text-amber-950'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{VEHICLE_LABELS[type].icon}</span>
                  <span>{isHindi ? VEHICLE_LABELS[type].hi : VEHICLE_LABELS[type].en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        {selectedVehicle === 'bike' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto py-1">
            {BIKE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 sm:p-5 rounded-2xl border bg-amber-50/40 border-amber-300/80 hover:bg-amber-50/80 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-3xl">{pkg.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      {isHindi ? pkg.tagHi : pkg.tagEn}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 mb-1">
                    {isHindi ? pkg.nameHi : pkg.nameEn}
                  </h3>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {isHindi ? pkg.descHi : pkg.descEn}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/80">
                    ⏱️ {pkg.time}
                  </span>
                </div>

                <div className="pt-3.5 mt-3 border-t border-amber-200/70 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-slate-950">₹{pkg.price}</span>
                    <span className="text-[10px] text-slate-600 block -mt-0.5 font-medium">
                      {isHindi ? 'सभी टैक्स सहित' : 'All Inclusive'}
                    </span>
                  </div>
                  <Link
                    href={`/book?service=${pkg.id}&segment=commuter`}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-colors"
                  >
                    {isHindi ? 'बुक करें' : 'Book'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-1">
            {CAR_PACKAGES.map((pkg) => {
              const price = pkg.prices[selectedVehicle as 'hatchback' | 'sedan' | 'suv'];
              return (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    pkg.popular ? 'bg-amber-50/50 border-amber-300' : 'bg-white border-slate-200/90 hover:border-amber-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-2xl">{pkg.icon}</span>
                      {pkg.tagEn && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pkg.popular ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isHindi ? pkg.tagHi : pkg.tagEn}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm text-slate-900 mb-1 leading-snug">
                      {isHindi ? pkg.nameHi : pkg.nameEn}
                    </h3>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                      {isHindi ? pkg.descHi : pkg.descEn}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                      ⏱️ {pkg.time}
                    </span>
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-lg sm:text-xl font-black text-slate-950">₹{price}</span>
                      <span className="text-[10px] text-slate-600 block -mt-0.5 font-medium">
                        {isHindi ? 'टैक्स व चार्ज सहित (होम विजिट)' : 'Incl. tax & home visit'}
                      </span>
                    </div>
                    <Link
                      href={`/book?service=${pkg.id}&segment=${selectedVehicle}`}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors shrink-0"
                    >
                      {isHindi ? 'बुक करें' : 'Book'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isHindi ? 'फ्री होम विजिट (₹99 वैल्यू मुफ्त) • आसान कैश व UPI पेमेंट' : 'Free Door / Home Visit worth ₹99 • Easy Cash & UPI payment'}</span>
          </div>
          <a
            href="#packages"
            className="font-bold text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center gap-1"
          >
            <span>{isHindi ? 'विस्तृत विवरण व फीचर्स देखें' : 'View full catalog details'}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

