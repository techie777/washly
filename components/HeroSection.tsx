'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Droplet, 
  ShieldCheck, 
  Banknote,
  Star,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function HeroSection() {
  const { isHindi } = useTranslation();

  return (
    <section className="relative bg-gradient-to-b from-amber-50/50 via-[#FAFAF9] to-white pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-amber-100/60 overflow-hidden">
      {/* Decorative ambient golden glow orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-4 left-10 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================
              LEFT COLUMN: HEADLINE, SUBTEXT, CTA & TRUST CHIPS (ORDER-1)
             ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* City & Live Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300/80 text-amber-950 text-[11px] sm:text-xs font-semibold sm:font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{isHindi ? 'इंदौर में ऑन-डिमांड कार केयर • पानी व बिजली ऑन-बोर्ड' : 'Indore On-Demand Car Care • Water & Power On-Board'}</span>
            </div>

            {/* 1. Main Headline with Harmonized Hindi vs English Typography */}
            <h1 className="font-black text-[#090D16] tracking-tight leading-[1.2]">
              {isHindi ? (
                <span className="text-[1.85rem] sm:text-4xl lg:text-5xl block">
                  घर बैठे कार व बाइक वॉश,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 block mt-1">
                    शोरूम जैसी नई चमक
                  </span>
                </span>
              ) : (
                <span className="text-[1.52rem] xs:text-[1.68rem] sm:text-4xl lg:text-5xl block">
                  Doorstep Car & Bike Wash,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 block mt-1">
                    Showroom Shine at Home
                  </span>
                </span>
              )}
            </h1>

            {/* 2. One-Line Subtext */}
            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-normal">
              {isHindi 
                ? 'हमारी पूरी तरह सुसज्जित मोबाइल वैन शुद्ध पानी और साइलेंट जनरेटर साथ लाती है। हाई प्रेशर फोम वॉश, वैक्यूमिंग और मशीन पॉलिश—सीधे आपकी पार्किंग में।'
                : 'Mobile wash vans equipped with pure water & silent power generator. High pressure foam wash, interior vacuuming & machine shine right in your parking.'}
            </p>

            {/* 3. Action CTAs (Big Primary Gold & Black + Clean Secondary "पैकेज देखें") */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/book"
                className="btn-sparkle-gold py-4 px-7 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2.5 transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 cursor-pointer text-center relative group"
              >
                <span>{isHindi ? 'गाड़ी धुलवाएं (अभी बुक करें)' : 'Book Doorstep Wash Now'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#packages"
                className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-amber-600 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all shadow-2xs text-center cursor-pointer"
              >
                <span>{isHindi ? 'पैकेज व रेट देखें ↓' : 'View Packages & Rates ↓'}</span>
              </a>
            </div>

            {/* 4. 3 Trust Chips */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg pt-2 border-t border-amber-100">
              <div className="p-3 rounded-2xl bg-white/90 border border-amber-200/60 shadow-2xs text-center backdrop-blur-xs">
                <Droplet className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="block text-[11px] font-black text-slate-800 leading-tight">
                  {isHindi ? 'पानी व बिजली हमारी' : 'Water & Power'}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {isHindi ? 'ऑन-बोर्ड जनरेटर' : 'Self-Powered'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-amber-200/60 shadow-2xs text-center backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="block text-[11px] font-black text-slate-800 leading-tight">
                  {isHindi ? 'स्क्रैच-फ्री गारंटी' : 'Scratch-Free'}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {isHindi ? 'सॉफ्ट माइक्रोफाइबर' : 'Microfiber Towels'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 border border-amber-200/60 shadow-2xs text-center backdrop-blur-xs">
                <Banknote className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="block text-[11px] font-black text-slate-800 leading-tight">
                  {isHindi ? 'धुलाई बाद भुगतान' : 'Pay After Wash'}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {isHindi ? '100% संतुष्टि पर' : 'Cash or UPI'}
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: REAL MOBILE VAN & DETAILING DEMO PHOTO
             ======================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900 group">
              <Image
                src="/images/doorstep-van.jpg"
                alt="Washly Mobile Doorstep Car Wash Van in Indore"
                width={720}
                height={480}
                priority
                quality={75}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Floating Top Pill: Real Indore Van Unit */}
              <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 flex items-center space-x-2 text-xs font-bold text-amber-300 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isHindi ? 'इंदौर में ऑन-रोड मोबाइल वैन' : 'Live Mobile Van • Indore'}</span>
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute top-3.5 right-3.5 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30 flex items-center space-x-1 text-xs font-black text-white shadow-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-amber-300">4.9</span>
                <span className="text-[10px] text-slate-400 font-semibold">(1,240+)</span>
              </div>

              {/* Bottom Feature Tag */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/30 shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">
                      {isHindi ? '100% आत्मनिर्भर वैन (टैंक + बिजली)' : '100% Self-Contained Mobile Unit'}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-amber-400">₹99 से शुरू</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
