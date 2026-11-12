'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Droplet,
  ShieldCheck,
  Banknote,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';

const SHOWCASE_SLIDES = [
  {
    id: 'punch-pressure-wash',
    serviceSlug: 'car-pressure-wash',
    icon: '🚿',
    tabEn: 'Pressure Shampoo Wash',
    tabHi: 'प्रेशर शैम्पू वॉश',
    src: '/images/doorstep-creta-wash.jpg',
    alt: 'Washly Pressure Shampoo Wash on Hyundai Creta & Cars in Indore',
    badgeEn: '1st Option • Home Visit',
    badgeHi: 'विकल्प 1 • होम विजिट',
    titleEn: 'Pressure Shampoo Wash (Incl. Tax & Charges)',
    titleHi: 'प्रेशर शैम्पू वॉश (टैक्स व चार्ज सहित)',
    tag: '₹250',
  },
  {
    id: 'swift-bucket-wash',
    serviceSlug: 'car-bucket-wash',
    icon: '🧽',
    tabEn: 'Bucket Shampoo Wash',
    tabHi: 'बकेट शैम्पू वॉश',
    src: '/images/service-bucket-wash.jpg',
    alt: 'Maruti Swift Dzire Scratch-Free Bucket Shampoo Wash with Microfiber',
    badgeEn: '2nd Option • Home Visit',
    badgeHi: 'विकल्प 2 • होम विजिट',
    titleEn: 'Bucket Shampoo Wash (Incl. Tax & Charges)',
    titleHi: 'बकेट शैम्पू वॉश (टैक्स व चार्ज सहित)',
    tag: '₹150',
  },
  {
    id: 'interior-vacuum-spa',
    serviceSlug: 'shampoo-rotator-shine',
    icon: '🧹',
    tabEn: 'Pressure + Vacuum + Perfume',
    tabHi: 'प्रेशर + वैक्यूम + परफ्यूम',
    src: '/images/service-interior-vacuum.jpg',
    alt: 'Pressure Shampoo Wash, Deep Vacuum Cleaning & Car Perfume',
    badgeEn: '3rd Option • Deep Cabin Care',
    badgeHi: 'विकल्प 3 • डीप वैक्यूम केयर',
    titleEn: 'Pressure Shampoo Wash + Vacuum Cleaning + Perfume',
    titleHi: 'प्रेशर शैम्पू वॉश + वैक्यूम क्लीनिंग + परफ्यूम',
    tag: '₹400',
  },
  {
    id: 'mahindra-rotator-shine',
    serviceSlug: 'complete-wash-interior-vacuum-perfume',
    icon: '✨',
    tabEn: 'Pressure + Vacuum + Rotator + Perfume',
    tabHi: 'प्रेशर + वैक्यूम + रोटेटर + परफ्यूम',
    src: '/images/service-rotator-shine.jpg',
    alt: 'Machine Rotator Buffing Exterior Shine, Vacuum & Perfume on Mahindra SUV',
    badgeEn: '4th Option • Complete VIP Shine',
    badgeHi: 'विकल्प 4 • कम्प्लीट VIP शाइन',
    titleEn: 'Pressure Shampoo + Vacuum + Rotator Buffing Machine Shine + Perfume',
    titleHi: 'प्रेशर शैम्पू + वैक्यूम + मशीन रोटेटर शाइन + परफ्यूम',
    tag: '₹600',
  },
  {
    id: 'service-bike-gear',
    serviceSlug: 'bike-foam-pressure',
    icon: '🏍️',
    tabEn: 'Doorstep Bike Unit',
    tabHi: 'डोरस्टेप सर्विस बाइक',
    src: '/images/doorstep-technician-gear.jpg',
    alt: 'Washly Doorstep Service Bike with High-Pressure Foam Detailing Gear in Indore',
    badgeEn: 'Live Service Bike • Indore',
    badgeHi: 'ऑन-रोड सर्विस बाइक • इंदौर',
    titleEn: 'High-Pressure Washer & Pro Foam Detailing Kit',
    titleHi: 'हाई-प्रेशर वॉशर व प्रोफेशनल फोम डिटेलिंग किट',
    tag: 'हाई-प्रेशर किट',
  },
  {
    id: 'mobile-van',
    serviceSlug: 'car-pressure-wash',
    icon: '🚐',
    tabEn: 'Mobile Van Unit',
    tabHi: 'मोबाइल वैन यूनिट',
    src: '/images/doorstep-van.jpg',
    alt: 'Washly Mobile Doorstep Car Wash Van in Indore',
    badgeEn: 'Live Mobile Van • Indore',
    badgeHi: 'ऑन-रोड मोबाइल वैन • इंदौर',
    titleEn: 'Mobile Unit Equipped with Pro Detailing Machinery',
    titleHi: 'प्रोफेशनल मशीनों से सुसज्जित मोबाइल वैन यूनिट',
    tag: 'प्रो मोबाइल यूनिट',
  },
];

export default function HeroSection() {
  const { isHindi } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const currentSlide = SHOWCASE_SLIDES[activeSlide] || SHOWCASE_SLIDES[0];

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? SHOWCASE_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === SHOWCASE_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative bg-gradient-to-b from-amber-50/50 via-[#FAFAF9] to-white pt-5 sm:pt-14 pb-8 sm:pb-12 border-b border-amber-100/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start items-center">

          {/* RIGHT/TOP COLUMN: REAL SERVICE CAROUSEL */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 no-scrollbar scroll-smooth">
              {SHOWCASE_SLIDES.map((slide, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-black border border-amber-500'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
                    }`}
                  >
                    <span aria-hidden="true">{slide.icon}</span>
                    <span>{isHindi ? slide.tabHi : slide.tabEn}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-slate-900 group">
              <Image
                key={currentSlide.src}
                src={currentSlide.src}
                alt={currentSlide.alt}
                width={720}
                height={480}
                loading="eager"
                fetchPriority="high"
                quality={40}
                sizes="(max-width: 640px) 200px, 480px"
                className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Top Pill */}
              <div className="absolute top-3.5 left-3.5 bg-slate-950/90 px-3 py-1 rounded-full border border-amber-400/40 flex items-center space-x-2 text-xs font-bold text-amber-300 pointer-events-none">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>{isHindi ? currentSlide.badgeHi : currentSlide.badgeEn}</span>
              </div>

              {/* Floating Rating & Counter Badge */}
              <div className="absolute top-3.5 right-3.5 bg-slate-950/95 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center space-x-1 text-xs font-black text-white pointer-events-none">
                <Star aria-hidden="true" className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-amber-300">4.9</span>
                <span className="text-[10px] text-slate-200 font-semibold">(1,240+)</span>
                <span className="text-[10px] text-amber-300 font-mono ml-1 border-l border-white/25 pl-1.5">
                  {activeSlide + 1}/{SHOWCASE_SLIDES.length}
                </span>
              </div>

              {/* Navigation Chevrons */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-black/95 text-white flex items-center justify-center transition-colors border border-white/25 hover:border-amber-400 cursor-pointer"
              >
                <ChevronLeft aria-hidden="true" className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-black/95 text-white flex items-center justify-center transition-colors border border-white/25 hover:border-amber-400 cursor-pointer"
              >
                <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </button>

              {/* Bottom Feature Tag + Book Now CTA on every slide */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/95 border border-amber-400/35">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2 min-w-0 flex-1 pointer-events-none">
                    <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-white truncate block text-[11px] sm:text-xs">
                        {isHindi ? currentSlide.titleHi : currentSlide.titleEn}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-black text-amber-300 block">
                        {currentSlide.tag}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/book?service=${currentSlide.serviceSlug}`}
                    className="shrink-0 py-1.5 px-3 sm:px-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>{isHindi ? 'बुक करें' : 'Book Now'}</span>
                    <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Dots Strip */}
            <div className="flex items-center justify-center gap-1 mt-1">
              {SHOWCASE_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-pressed={activeSlide === idx}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-full cursor-pointer"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all block ${
                      activeSlide === idx ? 'w-6 bg-amber-600' : 'w-1.5 bg-slate-400 hover:bg-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* LEFT/BOTTOM COLUMN: HEADLINE, SUBTEXT, CTA & TRUST CHIPS */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-300 text-amber-950 text-[11px] sm:text-xs font-semibold sm:font-bold">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{isHindi ? 'इंदौर डोरस्टेप सर्विस • ₹99 की होम विजिट बिल्कुल फ्री' : 'Indore Doorstep Service • Free Home Visit Worth ₹99'}</span>
            </div>

            <h1 className="font-black text-[#090D16] tracking-tight leading-[1.2]">
              {isHindi ? (
                <span className="text-[1.85rem] sm:text-4xl lg:text-5xl block">
                  घर बैठे कार व बाइक वॉश,{' '}
                  <span className="text-amber-700 block mt-1">
                    शोरूम जैसी नई चमक
                  </span>
                </span>
              ) : (
                <span className="text-[1.52rem] xs:text-[1.68rem] sm:text-4xl lg:text-5xl block">
                  Doorstep Car & Bike Wash,{' '}
                  <span className="text-amber-700 block mt-1">
                    Showroom Shine at Home
                  </span>
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-normal">
              {isHindi
                ? 'हमारी सुसज्जित सर्विस बाइक व मोबाइल वैन हाई-प्रेशर मशीन, स्नो फोम गन और वैक्यूम सीधे आपकी पार्किंग में लाती हैं। 100% स्क्रैच-फ्री फोम वॉश व डीप इंटीरियर केयर।'
                : 'Custom service bikes & mobile vans bring high-pressure washers, snow foam guns & vacuums right to your parking for 100% scratch-free care.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/book"
                className="btn-sparkle-gold py-4 px-7 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2.5 transition-all shadow-lg cursor-pointer text-center relative group"
              >
                <span>{isHindi ? 'गाड़ी धुलवाएं (अभी बुक करें)' : 'Book Doorstep Wash Now'}</span>
                <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#quick-pricing"
                className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-amber-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors text-center cursor-pointer"
              >
                <span>{isHindi ? 'पैकेज व रेट देखें ↓' : 'View Packages & Rates ↓'}</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg pt-2 border-t border-amber-100">
              <div className="p-3 rounded-2xl bg-white border border-amber-200/80 text-center">
                <Droplet aria-hidden="true" className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="block text-[11px] font-black text-slate-800 leading-tight">
                  {isHindi ? 'हाई-प्रेशर फोम वॉश' : 'Pro Pressure Wash'}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {isHindi ? 'प्रीमियम स्नो फोम' : 'Rich Snow Foam'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-amber-200/80 text-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <span className="block text-[11px] font-black text-slate-800 leading-tight">
                  {isHindi ? 'पेंट-सेफ केयर' : 'Paint-Safe Care'}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {isHindi ? '500 GSM माइक्रोफाइबर' : 'Microfiber Towels'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-300/80 text-center">
                <Banknote aria-hidden="true" className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                <span className="block text-[11px] font-black text-slate-900 leading-tight">
                  {isHindi ? 'फ्री होम विजिट' : 'Free Home Visit'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {isHindi ? '₹99 की विजिट मुफ्त' : 'Worth ₹99 Free'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
