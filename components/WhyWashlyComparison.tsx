'use client';

import React from 'react';
import { Check, X, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function WhyWashlyComparison() {
  const { isHindi } = useTranslation();

  const comparisons = [
    {
      feature: isHindi ? 'धुलाई तकनीक' : 'Wash Method',
      washly: isHindi ? 'साफ पानी से सुरक्षित टू-बकेट धुलाई व हाई-प्रेशर रिंस (दाग-मुक्त)' : 'Fresh two-bucket safe rinse & 140 Bar pressure wash (Spot-free)',
      others: isHindi ? 'एक ही बाल्टी के गंदे पानी से पूरी गाड़ी धोना' : 'Dirty recycled bucket used on multiple cars',
      washlyGood: true
    },
    {
      feature: isHindi ? 'मशीन व उपकरण' : 'Machines & Gear',
      washly: isHindi ? '140 Bar हाई-प्रेशर पंप, स्नो फोम गन व इलेक्ट्रिक रोटेटर पॉलिशर' : '140 Bar pressure pump, snow foam gun & rotator polisher',
      others: isHindi ? 'सिर्फ सादे पाइप या सूखे कपड़े से ही पोंछना' : 'Only plain hose or manual dry cloth wiping',
      washlyGood: true
    },
    {
      feature: isHindi ? 'कपड़ा व सफाई तकनीक' : 'Cloth & Technique',
      washly: isHindi ? '3 अलग रंग के अल्ट्रा-सॉफ्ट माइक्रोफाइबर (100% स्क्रैच-फ्री)' : '3 Fresh ultra-soft microfiber cloths (Scratch-free)',
      others: isHindi ? '1 ही घिसा-पिटा गंदा कपड़ा जो 15 गाड़ियों पर घिसता है' : 'Single dirty cloth used on 15+ vehicles daily',
      washlyGood: true
    },
    {
      feature: isHindi ? 'शैम्पू व केमिकल्स' : 'Shampoo & Chemicals',
      washly: isHindi ? 'pH-न्यूट्रल एक्टिव फोम (पेंट व कोटिंग सुरक्षित)' : 'pH-Neutral Snow Foam (Protects paint & coating)',
      others: isHindi ? 'सस्ता डिटर्जेंट या सिर्फ सादा गंदा पानी' : 'Cheap harsh detergent or just plain dirty water',
      washlyGood: true
    },
    {
      feature: isHindi ? 'इंटीरियर व वैक्यूमिंग' : 'Interior Vacuuming',
      washly: isHindi ? 'शक्तिशाली इंडस्ट्रियल वैक्यूम + फ्लोर मैट वॉश' : 'Industrial vacuum clean + Floor mat wash',
      others: isHindi ? 'इंटीरियर हाथ भी नहीं लगाते, सिर्फ बाहर से झाड़ना' : 'No interior cleaning, only hurried exterior dust',
      washlyGood: true
    },
    {
      feature: isHindi ? 'होम विजिट व पेमेंट' : 'Visit Fee & Payment',
      washly: isHindi ? '₹99 की डोर/होम विजिट बिल्कुल फ्री + आसान Cash/UPI विकल्प' : 'Free Door / Home Visit worth ₹99 + Easy Cash or UPI payment',
      others: isHindi ? 'महीने के पहले ही दिन एडवांस पैसे की मांग' : 'Forced monthly advance with irregular attendance',
      washlyGood: true
    }
  ];

  return (
    <section id="why-us" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'सच्ची तुलना' : 'Honest Comparison'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight mb-3">
            {isHindi ? 'Washly ही क्यों चुनें?' : 'Why Choose Washly?'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isHindi 
              ? 'जानें कैसे Washly की प्रोफेशनल डोरस्टेप वैन आपकी कीमती गाड़ी के पेंट को सालों-साल नया रखती है।'
              : 'See the difference between professional doorstep equipment and ordinary daily car cleaners.'}
          </p>
        </div>

        {/* Comparison Table / Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-slate-950 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 px-4 sm:px-6">
            <div className="col-span-4 sm:col-span-3 text-slate-300">
              {isHindi ? 'सुविधा' : 'Feature'}
            </div>
            <div className="col-span-4 sm:col-span-5 text-amber-400 flex items-center gap-1.5 font-black">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Washly Doorstep Care</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-slate-300">
              {isHindi ? 'लोकल डेली क्लीनर' : 'Local Daily Cleaner'}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {comparisons.map((row, idx) => (
              <div 
                key={idx} 
                className={`grid grid-cols-12 items-center py-4 px-4 sm:px-6 text-xs sm:text-sm transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                {/* Feature Name */}
                <div className="col-span-4 sm:col-span-3 font-bold text-slate-800 pr-2">
                  {row.feature}
                </div>

                {/* Washly Column */}
                <div className="col-span-4 sm:col-span-5 flex items-start gap-2 pr-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-semibold text-slate-900 leading-snug">
                    {row.washly}
                  </span>
                </div>

                {/* Local Cleaner Column */}
                <div className="col-span-4 sm:col-span-4 flex items-start gap-2 text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="leading-snug">
                    {row.others}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
