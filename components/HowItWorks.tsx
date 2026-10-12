'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Car, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function HowItWorks() {
  const { isHindi } = useTranslation();

  const steps = [
    {
      title: isHindi ? '1. गाड़ी व पैकेज चुनें' : '1. Select Vehicle & Service',
      desc: isHindi ? 'अपनी कार/बाइक और पसंदीदा वॉश पैकेज 1-टैप में चुनें।' : 'Choose car/bike model and preferred wash package.',
      icon: Car,
    },
    {
      title: isHindi ? '2. तारीख व समय तय करें' : '2. Pick Date & Time Slot',
      desc: isHindi ? 'अपनी सुविधानुसार दिन व आगमन समय चुनें।' : 'Pick your convenient date and arrival time window.',
      icon: Calendar,
    },
    {
      title: isHindi ? '3. वैन आपके पते पर पहुंचेगी' : '3. Mobile Van Arrives',
      desc: isHindi ? 'शुद्ध पानी, साइलेंट जनरेटर और हाई-प्रेशर मशीनों के साथ वैन आएगी।' : 'Van arrives at your doorstep with water & power on-board.',
      icon: Truck,
    },
    {
      title: isHindi ? '4. काम देखें और पेमेंट करें' : '4. Inspect & Pay After Wash',
      desc: isHindi ? '100% संतुष्टि के बाद Cash या UPI (GPay/PhonePe) से भुगतान करें।' : 'Pay via Cash or UPI only after complete satisfaction.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-16 bg-white border-b border-amber-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'सरल व पारदर्शी प्रक्रिया' : 'Simple 4-Step Process'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {isHindi ? 'डोरस्टेप कार वॉश' : 'How Doorstep Wash'}{' '}
            <span className="text-amber-700">{isHindi ? 'कैसे काम करता है?' : 'Works'}</span>
          </h2>
        </div>

        {/* Compact 4-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-start space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-950 text-amber-400 border border-amber-400/30 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick CTA strip */}
        <div className="mt-8 text-center">
          <Link
            href="/book"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-black text-amber-400 font-black text-xs uppercase tracking-wider transition-all shadow-md border border-amber-400/30 active:scale-98"
          >
            <span>{isHindi ? 'अभी अपॉइंटमेंट बुक करें' : 'Book Appointment Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
