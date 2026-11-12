'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { LocationCity, ServicePackage } from '@/types';
import { LOCAL_FAQS } from '@/lib/seedData';

interface LocalFaqSectionProps {
  city: LocationCity;
  service: ServicePackage;
}

export default function LocalFaqSection({ city, service }: LocalFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const citySpecificFaqs = [
    {
      question: `Is Washly authorized to service vehicles in gated apartments and societies in ${city.city}?`,
      answer: `Yes, Washly mobile units operate across residential complexes and gated communities in ${city.city} (including ${city.landmarks.slice(0, 3).join(', ')}). Our crews use controlled low-splash pressure washing and clean up the bay neatly. Please note we are planning onboard water & power for the future—currently, water and a power point need to be provided at the site during the wash.`,
    },
    {
      question: `How quickly can a mobile detailing unit reach my location in ${city.city}?`,
      answer: `We maintain ${city.activeTechnicians} active mobile units stationed across strategic hubs in ${city.city}. We offer flexible 2-hour scheduling slots from 7:00 AM to 8:00 PM, with express same-day emergency slots usually available when booked at least 2 hours in advance.`,
    },
    ...LOCAL_FAQS,
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-bold uppercase tracking-wider text-amber-950 mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            {city.city} Doorstep Wash FAQs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Everything you need to know about our {service.name} in {city.city}.
          </p>
        </div>

        <div className="space-y-4">
          {citySpecificFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 text-amber-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
