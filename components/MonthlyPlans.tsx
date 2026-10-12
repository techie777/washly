'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Calendar, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function MonthlyPlans() {
  const { isHindi } = useTranslation();

  const plans = [
    {
      id: 'biweekly',
      name: isHindi ? 'स्मार्ट केयर पास (2 वॉश/माह)' : 'Smart Care Pass (2 Washes/Mo)',
      tagline: isHindi ? 'हर 15 दिन में चमक' : 'Bi-weekly refresh',
      price: 449,
      regularPrice: 550,
      savings: '18% OFF',
      popular: false,
      features: [
        isHindi ? '2 एक्सटीरियर हाई-प्रेशर फोम वॉश' : '2 Exterior High-Pressure Foam Washes',
        isHindi ? '1 इंटीरियर डीप वैक्यूम + फ्लोर मैट वॉश' : '1 Interior Deep Vacuum + Mat Wash',
        isHindi ? 'टायर ग्लॉस व डैशबोर्ड सैनिटाइजेशन' : 'Tyre Gloss & Dashboard Dressing',
        isHindi ? 'निश्चित पसंदीदा वीकेंड/वीक-डे स्लॉट' : 'Reserved preferred time slot',
        isHindi ? 'मिस्ड वॉश अगले महीने रोलओवर' : 'Rollover unused wash next month',
      ],
      whatsappMsg: 'नमस्ते Washly! मुझे स्मार्ट केयर पास (2 वॉश/महीना - ₹449) एक्टिवेट करना है। कृपया आगे की प्रोसेस बताएं।'
    },
    {
      id: 'weekly',
      name: isHindi ? 'प्रीमियम शाइन पास (4 वॉश/माह)' : 'Premium Shine Pass (4 Washes/Mo)',
      tagline: isHindi ? 'हर हफ्ते शोरूम जैसी चमक' : 'Showroom finish every week',
      price: 849,
      regularPrice: 1100,
      savings: '23% OFF',
      popular: true,
      features: [
        isHindi ? '4 एक्सटीरियर हाई-प्रेशर शैम्पू वॉश (साप्ताहिक)' : '4 Exterior High-Pressure Washes (Weekly)',
        isHindi ? '2 इंटीरियर कम्प्लीट वैक्यूमिंग + बूट स्पेस' : '2 Full Interior Deep Vacuums + Boot Clean',
        isHindi ? '1 रोटेटर मशीन शाइन लिक्विड वैक्स पॉलिश' : '1 Free Rotator Liquid Wax Polish',
        isHindi ? 'VIP प्रायोरिटी शेड्यूलिंग (कन्फर्म स्लॉट)' : 'VIP Priority Scheduling slot',
        isHindi ? '100% मिस्ड वॉश रोलओवर गारंटी' : '100% missed wash rollover guarantee',
        isHindi ? 'डेडिकेटेड ट्रेंड वॉश एक्सपर्ट' : 'Dedicated expert operator assigned',
      ],
      whatsappMsg: 'नमस्ते Washly! मुझे सबसे लोकप्रिय प्रीमियम शाइन पास (4 वॉश/महीना - ₹849) शुरू करना है। कृपया मेरी कार का रजिस्ट्रेशन करें।'
    }
  ];

  return (
    <section id="monthly-pass" className="py-16 sm:py-20 bg-white border-t border-slate-200 text-slate-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-semibold mb-3 shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'मंथली वॉश सब्सक्रिप्शन' : 'Monthly Wash Subscription'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 mb-3">
            {isHindi ? 'महीने भर बेफिक्र रहें, ' : 'Worry-Free Monthly Care, '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">
              {isHindi ? 'गाड़ी रहे हमेशा चमचमाती' : 'Car Always Showroom Clean'}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isHindi 
              ? 'रोज़-रोज़ गंदे कपड़े से गाड़ी घिसवाने से मुक्ति! हर हफ्ते दरवाजे पर पेशेवर धुलाई और 23% तक की सीधी बचत।'
              : 'Ditch the daily dirty-cloth duster. Professional pressure foam care at your doorstep with up to 23% savings.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => {
            const isPop = plan.popular;
            const waHref = `https://wa.me/919685232340?text=${encodeURIComponent(plan.whatsappMsg)}`;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPop 
                    ? 'bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-2 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/20' 
                    : 'bg-white border border-slate-200 hover:border-amber-400/50 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Popular Pill */}
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>{isHindi ? 'सबसे लोकप्रिय पास (BEST VALUE)' : 'MOST POPULAR (BEST VALUE)'}</span>
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {plan.tagline}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 ${
                      isPop 
                        ? 'bg-amber-500 text-slate-950 font-black' 
                        : 'bg-amber-50 border border-amber-300 text-amber-900'
                    }`}>
                      {plan.savings}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">
                      /{isHindi ? 'महीना' : 'month'}
                    </span>
                    <span className="text-sm text-slate-500 font-semibold line-through ml-1 font-mono">
                      ₹{plan.regularPrice}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPop ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action */}
                <div>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-sparkle-gold w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isPop 
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25' 
                        : 'bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 shadow-xs'
                    }`}
                  >
                    <span>{isHindi ? 'व्हाट्सएप पर पास शुरू करें' : 'Start Pass on WhatsApp'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </a>
                  <p className="text-[11px] text-center text-slate-600 mt-2.5 font-medium">
                    {isHindi ? 'कोई लॉक-इन नहीं • कभी भी रद्द या पॉज करें' : 'No lock-in • Cancel or pause anytime'}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Small Bottom Trust Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 bg-slate-50 px-6 py-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? '100% शुद्ध पानी व साइलेंट जनरेटर' : '100% Pure Water & Silent Power'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'आपकी सुविधानुसार तारीख व समय' : 'Fixed time slot of your choice'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{isHindi ? 'धुलाई बाद ही भुगतान' : 'Pay after completion'}</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
