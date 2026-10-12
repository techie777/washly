'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

const BEFORE_AFTER_SEGMENTS = [
  {
    id: 'sedan',
    titleHi: 'सेडान (Sedan)',
    titleEn: 'Executive Sedan',
    carName: 'लक्ज़री सेडान (Mercedes / Honda City)',
    image: '/images/before-after-sedan.jpg',
    beforeDescHi: 'सड़क की धूल, कीचड़ और खारे पानी के दाग',
    afterDescHi: '100% मिरर ग्लॉस और डीप ब्लैक टायर शाइन',
    badge: 'प्रीमियम फिनिश'
  },
  {
    id: 'suv',
    titleHi: 'बड़ी SUV (Full SUV)',
    titleEn: 'Full SUV',
    carName: 'टोयोटा फॉर्च्यूनर (Toyota Fortuner SUV)',
    image: '/images/before-after-suv.jpg',
    beforeDescHi: 'ऑफ-रोड कीचड़, गंदे व्हील्स और धुंधले ग्लास',
    afterDescHi: 'हाई-प्रेशर मड ब्लास्ट + वेट-लुक रोटेटर पॉलिश',
    badge: 'डीप मड क्लीन'
  },
  {
    id: 'hatchback',
    titleHi: 'हैचबैक (Hatchback)',
    titleEn: 'Hatchback',
    carName: 'मारुति स्विफ्ट (Maruti Swift Hatchback)',
    image: '/images/before-after-hatchback.jpg',
    beforeDescHi: 'बरसात के गंदे छींटे, मटमैले रिम्स और डल पेंट',
    afterDescHi: 'शोरूम जैसी फ्रेश कैंडी शाइन और क्लीन अलॉय',
    badge: 'सुपर शाइन'
  },
  {
    id: 'compact-suv',
    titleHi: 'कॉम्पैक्ट SUV (Compact SUV)',
    titleEn: 'Compact SUV',
    carName: 'किआ सेल्टोस / क्रेटा (Kia Seltos / Creta)',
    image: '/images/before-after-compact-suv.jpg',
    beforeDescHi: 'ट्रैफिक का काला धुआं और चिपकी हुई धूल',
    afterDescHi: 'सिरेमिक वैक्स कोटिंग प्रोटेक्शन और न्यू लुक',
    badge: 'सिरेमिक चमक'
  }
];

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    car: 'Hyundai Creta (Scheme 54)',
    commentHi: 'वैन में खुद का पानी और जनरेटर देखकर बहुत इम्प्रेस हुआ। बेसमेंट पार्किंग में बिना किसी झंझट के गाड़ी 40 मिनट में नई जैसी चमक गई।',
    commentEn: 'Super impressed by their self-contained water tank and generator. Basement wash completed in 40 mins with zero hassle.',
    rating: 5,
    date: '2 दिन पहले',
  },
  {
    name: 'Amitabh Verma',
    car: 'Tata Nexon (Vijay Nagar)',
    commentHi: 'लोकल धोने वाले गाड़ी पर स्क्रैच डाल देते थे। वाशली के माइक्रोफाइबर टॉवल और रोटेटर मशीन से पेंट पर गजब की चमक आई है।',
    commentEn: 'Normal daily cleaners cause swirls. Washly microfiber and rotator polish gave an unbelievable mirror shine.',
    rating: 5,
    date: '3 दिन पहले',
  },
  {
    name: 'Pooja Jain',
    car: 'Honda City (Palasia)',
    commentHi: 'धुलाई के बाद पेमेंट करने की सुविधा सबसे अच्छी लगी। इंटीरियर वैक्यूमिंग बहुत बारीक और साफ की गई। 10/10 सर्विस।',
    commentEn: 'Pay after 100% satisfaction is the best thing. Interior vacuuming was deep and spot-free.',
    rating: 5,
    date: 'पिछले हफ्ते',
  },
];

export default function BeforeAfterSlider() {
  const { isHindi } = useTranslation();
  const [activeSegmentId, setActiveSegmentId] = useState('sedan');

  const currentSegment = BEFORE_AFTER_SEGMENTS.find(s => s.id === activeSegmentId) || BEFORE_AFTER_SEGMENTS[0];

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-slate-50/80 border-y border-slate-200/90 text-slate-900 relative overflow-hidden">
      {/* Ambient soft background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'वास्तविक परिणाम व संतुष्ट ग्राहक' : 'Real Results & Reviews'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
            {isHindi ? 'देखें अंतर:' : 'See the Difference:'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">
              {isHindi ? 'धुलाई से पहले और बाद में' : 'Before vs After Clean'}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {isHindi 
              ? 'अपनी गाड़ी के सेगमेंट पर टैप करके देखें—कीचड़ और धूल से सनी गाड़ी कैसे Washly की फोम वॉश और मशीन पॉलिश के बाद नई जैसी चमकती है।'
              : 'Tap on your car category to compare road grime with showroom glossy paint reflection.'}
          </p>

          {/* Real Counter Badge */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isHindi 
                ? '⚡ आज इंदौर में 14 गाड़ियाँ सफलतापूर्वक धुली गईं • 2 वैन अभी उपलब्ध' 
                : '⚡ 14 vehicles washed today in Indore • 2 vans available right now'}
            </span>
          </div>
        </div>

        {/* 1. SEGMENT SELECTOR TABS (Sedan | Full SUV | Hatchback | Compact SUV) */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {BEFORE_AFTER_SEGMENTS.map((seg) => {
              const isSelected = seg.id === activeSegmentId;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setActiveSegmentId(seg.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400/60 hover:text-amber-900 hover:bg-amber-50/50 shadow-2xs'
                  }`}
                >
                  <span>{isHindi ? seg.titleHi : seg.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. FULL VEHICLE BEFORE / AFTER SHOWCASE */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-white group">
            
            {/* The Before & After Photo showing full car */}
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={currentSegment.image}
                alt={currentSegment.carName}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover transition-opacity duration-300"
              />

              {/* Floating Top Labels */}
              <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-red-500/40 text-red-300 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{isHindi ? 'धुलाई से पहले (BEFORE)' : 'BEFORE WASH'}</span>
              </div>

              <div className="absolute top-3.5 right-3.5 bg-black/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? 'Washly के बाद (AFTER)' : 'AFTER WASHLY SHINE'}</span>
              </div>
            </div>

            {/* Bottom info strip with Car Details */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {currentSegment.carName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {currentSegment.badge}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="text-red-600 font-semibold">
                    ✕ {currentSegment.beforeDescHi}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ {currentSegment.afterDescHi}
                  </span>
                </div>
              </div>

              <Link
                href={`/book?segment=${currentSegment.id}`}
                className="btn-sparkle-gold w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 shrink-0"
              >
                <span>{isHindi ? 'मेरी गाड़ी भी ऐसी चमकाएं' : 'Book Wash For My Car'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </Link>
            </div>

          </div>
        </div>

        {/* 3. VERIFIED GOOGLE RATING & CUSTOMER REVIEWS */}
        <div>
          {/* Header with Google Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-900 font-black flex items-center justify-center text-lg shadow-2xs">
                G
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-black text-slate-900">Google Reviews</span>
                  <div className="flex text-amber-400">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-sm">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {isHindi ? '4.9★ औसत रेटिंग (1,240+ इंदौर ग्राहक)' : '4.9★ Average Rating (1,240+ Indore Car Owners)'}
                </div>
              </div>
            </div>

            <Link
              href="/book"
              className="btn-sparkle-gold py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <span>{isHindi ? 'गाड़ी धुलाई बुक करें' : 'Book Your Wash'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((review, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">{review.date}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{isHindi ? review.commentHi : review.commentEn}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900">{review.name}</div>
                    <div className="text-[10px] text-amber-700 font-semibold">{review.car}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Verified
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
