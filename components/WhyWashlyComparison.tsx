'use client';

import React from 'react';
import { Check, X, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function WhyWashlyComparison() {
  const { isHindi } = useTranslation();

  const comparisons = [
    {
      feature: isHindi ? 'पानी की व्यवस्था' : 'Water Quality',
      washly: isHindi ? 'वैन में 500L शुद्ध सॉफ्ट पानी ऑन-बोर्ड (दाग-मुक्त)' : '500L Pure soft water onboard (No water stains)',
      others: isHindi ? 'खारा बोरिंग पानी या एक ही बाल्टी का गंदा पानी' : 'Hard borewell water or dirty recycled bucket',
      washlyGood: true
    },
    {
      feature: isHindi ? 'बिजली व मशीन' : 'Power & Machines',
      washly: isHindi ? 'साइलेंट जनरेटर + हाई-प्रेशर 140 Bar जर्मन पंप' : 'Silent onboard generator + German pressure pump',
      others: isHindi ? 'सोसायटी से कनेक्शन मांगना या हाथ से ही पोंछना' : 'Begging for power or only manual wiping',
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
      feature: isHindi ? 'पेमेंट व संतुष्टि' : 'Payment & Trust',
      washly: isHindi ? 'धुलाई पूरी होने और पूरी संतुष्टि के बाद भुगतान' : 'Pay only AFTER wash and 100% satisfaction',
      others: isHindi ? 'महीने के पहले ही दिन एडवांस पैसे की मांग' : 'Forced monthly advance with irregular attendance',
      washlyGood: true
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'सच्ची तुलना' : 'Honest Comparison'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
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
