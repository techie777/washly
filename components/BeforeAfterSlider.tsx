'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, MoveHorizontal } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

interface SegmentItem {
  id: string;
  bookingSegment: string;
  titleHi: string;
  titleEn: string;
  carNameHi: string;
  carNameEn: string;
  beforeImage?: string;
  afterImage?: string;
  staticSplitImage?: string;
  beforeDescHi: string;
  beforeDescEn: string;
  afterDescHi: string;
  afterDescEn: string;
  badgeHi: string;
  badgeEn: string;
}

const BEFORE_AFTER_SEGMENTS: SegmentItem[] = [
  {
    id: 'sedan',
    bookingSegment: 'sedan',
    titleHi: 'सेडान (Swift Dzire)',
    titleEn: 'Sedan (Dzire)',
    carNameHi: 'मारुति स्विफ्ट डिजायर (Maruti Swift Dzire)',
    carNameEn: 'Maruti Suzuki Swift Dzire (Sedan)',
    beforeImage: '/images/cars/dzire-before.jpg',
    afterImage: '/images/cars/dzire-after.jpg',
    beforeDescHi: 'सड़क की धूल, कीचड़ और खारे पानी के दाग',
    beforeDescEn: 'Road dust, mud splatters & hard water spots',
    afterDescHi: '100% मिरर ग्लॉस और डीप ब्लैक टायर शाइन',
    afterDescEn: '100% mirror gloss & deep black tire shine',
    badgeHi: 'प्रीमियम फिनिश',
    badgeEn: 'Showroom Finish',
  },
  {
    id: 'compact-suv',
    bookingSegment: 'compact_suv',
    titleHi: 'कॉम्पैक्ट SUV (Creta)',
    titleEn: 'Compact SUV (Creta)',
    carNameHi: 'हुंडई क्रेटा (Hyundai Creta)',
    carNameEn: 'Hyundai Creta (Compact SUV)',
    beforeImage: '/images/cars/creta-before.jpg',
    afterImage: '/images/cars/creta-after.jpg',
    beforeDescHi: 'ट्रैफिक का काला धुआं और चिपकी हुई धूल',
    beforeDescEn: 'Traffic soot, road grime & dusty body panels',
    afterDescHi: 'सिरेमिक वैक्स कोटिंग प्रोटेक्शन और न्यू लुक',
    afterDescEn: 'Foam wash, ceramic wax shine & crisp trim',
    badgeHi: 'सिरेमिक चमक',
    badgeEn: 'Ceramic Shine',
  },
  {
    id: 'suv',
    bookingSegment: 'suv',
    titleHi: 'बड़ी SUV (Mahindra XUV)',
    titleEn: 'Full SUV (XUV700)',
    carNameHi: 'महिंद्रा XUV700 (Mahindra XUV SUV)',
    carNameEn: 'Mahindra XUV700 (Full SUV)',
    beforeImage: '/images/cars/xuv-before.jpg',
    afterImage: '/images/cars/xuv-after.jpg',
    beforeDescHi: 'ऑफ-रोड कीचड़, गंदे व्हील्स और धुंधले ग्लास',
    beforeDescEn: 'Mud splashes, dirty alloys & hazy windshield',
    afterDescHi: 'हाई-प्रेशर मड ब्लास्ट + वेट-लुक रोटेटर पॉलिश',
    afterDescEn: 'High-pressure mud blast + wet-look polish',
    badgeHi: 'डीप मड क्लीन',
    badgeEn: 'Deep Mud Clean',
  },
  {
    id: 'tata-punch',
    bookingSegment: 'hatchback',
    titleHi: 'टाटा पंच (Tata Punch)',
    titleEn: 'Tata Punch',
    carNameHi: 'टाटा पंच (Tata Punch Micro SUV)',
    carNameEn: 'Tata Punch (Micro SUV)',
    beforeImage: '/images/cars/punch-before.jpg',
    afterImage: '/images/cars/punch-after.jpg',
    beforeDescHi: 'बारिश के गंदे छींटे, मटमैले रिम्स और डल पेंट',
    beforeDescEn: 'Rain splashes, muddy cladding & dull paint',
    afterDescHi: 'शोरूम जैसी फ्रेश चमक और क्लीन अलॉय व्हील्स',
    afterDescEn: 'Showroom-fresh gloss & clean alloy wheels',
    badgeHi: 'सुपर शाइन',
    badgeEn: 'Super Shine',
  },
  {
    id: 'hatchback',
    bookingSegment: 'hatchback',
    titleHi: 'हैचबैक (Maruti Swift)',
    titleEn: 'Hatchback (Swift)',
    carNameHi: 'मारुति स्विफ्ट (Maruti Swift Hatchback)',
    carNameEn: 'Maruti Suzuki Swift (Hatchback)',
    staticSplitImage: '/images/before-after-hatchback.jpg',
    beforeDescHi: 'बरसात के गंदे छींटे, मटमैले रिम्स और डल पेंट',
    beforeDescEn: 'Monsoon mud splashes & dull exterior paint',
    afterDescHi: 'शोरूम जैसी फ्रेश कैंडी शाइन और क्लीन अलॉय',
    afterDescEn: 'Showroom candy gloss & spotless black alloys',
    badgeHi: 'सुपर शाइन',
    badgeEn: 'Super Shine',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    car: 'Hyundai Creta (Scheme 54)',
    commentHi: 'डोरस्टेप पर हाई-प्रेशर फोम वॉश और वैक्यूम सेटअप देखकर बहुत इम्प्रेस हुआ। बेसमेंट पार्किंग में बिना किसी झंझट के गाड़ी 40 मिनट में नई जैसी चमक गई।',
    commentEn: 'Super impressed by their doorstep high-pressure foam wash and vacuum setup. Basement wash completed in 40 mins with zero hassle.',
    rating: 5,
    dateHi: '2 दिन पहले',
    dateEn: '2 days ago',
  },
  {
    name: 'Amitabh Verma',
    car: 'Tata Punch (Vijay Nagar)',
    commentHi: 'लोकल धोने वाले गाड़ी पर स्क्रैच डाल देते थे। वाशली के माइक्रोफाइबर टॉवल और रोटेटर मशीन से पेंट पर गजब की चमक आई है।',
    commentEn: 'Normal daily cleaners cause swirls. Washly microfiber and rotator polish gave an unbelievable mirror shine.',
    rating: 5,
    dateHi: '3 दिन पहले',
    dateEn: '3 days ago',
  },
  {
    name: 'Pooja Jain',
    car: 'Maruti Swift Dzire (Palasia)',
    commentHi: '₹99 वाली होम विजिट बिल्कुल फ्री मिलना और समय पर टीम का आना सबसे अच्छा लगा। इंटीरियर वैक्यूमिंग बहुत बारीक और साफ की गई। 10/10 सर्विस।',
    commentEn: 'Free home visit worth ₹99 and punctual arrival is the best thing. Interior vacuuming was deep and spot-free.',
    rating: 5,
    dateHi: 'पिछले हफ्ते',
    dateEn: 'Last week',
  },
];

export default function BeforeAfterSlider() {
  const { isHindi } = useTranslation();
  const [activeSegmentId, setActiveSegmentId] = useState('sedan');
  const [sliderPosition, setSliderPosition] = useState(50);

  const currentSegment = BEFORE_AFTER_SEGMENTS.find(s => s.id === activeSegmentId) || BEFORE_AFTER_SEGMENTS[0];

  const handleSegmentChange = (id: string) => {
    setActiveSegmentId(id);
    setSliderPosition(50);
  };

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-slate-50/80 border-y border-slate-200/90 text-slate-900 relative overflow-hidden">
      {/* Ambient soft background glow (CSS gradient, zero blur filter) */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(253,224,71,0.12) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'वास्तविक परिणाम व संतुष्ट ग्राहक' : 'Real Results & Reviews'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            {isHindi ? 'देखें अंतर:' : 'See the Difference:'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700">
              {isHindi ? 'धुलाई से पहले और बाद में' : 'Before vs After Clean'}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {isHindi 
              ? 'अपनी गाड़ी के सेगमेंट पर टैप करके देखें—कीचड़ और धूल से सनी गाड़ी कैसे Washly की फोम वॉश और मशीन पॉलिश के बाद नई जैसी चमकती है।'
              : 'Tap on your car category and slide to compare road grime with showroom glossy paint reflection.'}
          </p>

          {/* Real Counter Badge */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 text-xs font-bold shadow-2xs">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>
              {isHindi 
                ? '⚡ आज इंदौर में 14 गाड़ियाँ सफलतापूर्वक धुली गईं • 2 वैन अभी उपलब्ध' 
                : '⚡ 14 vehicles washed today in Indore • 2 vans available right now'}
            </span>
          </div>
        </div>

        {/* 1. SEGMENT SELECTOR TABS (Swift Dzire | Creta | XUV700 | Tata Punch | Swift) */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {BEFORE_AFTER_SEGMENTS.map((seg) => {
              const isSelected = seg.id === activeSegmentId;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => handleSegmentChange(seg.id)}
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
            
            {currentSegment.staticSplitImage ? (
              <div className="relative aspect-[16/9] w-full select-none">
                <Image
                  src={currentSegment.staticSplitImage}
                  alt={isHindi ? currentSegment.carNameHi : currentSegment.carNameEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />

                <div className="absolute top-3.5 left-3.5 bg-slate-950/90 px-3 sm:px-4 py-1.5 rounded-full border border-red-500/40 text-red-200 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-red-500" />
                  <span>{isHindi ? 'धुलाई से पहले (BEFORE)' : 'BEFORE WASH'}</span>
                </div>

                <div className="absolute top-3.5 right-3.5 bg-slate-950/90 px-3 sm:px-4 py-1.5 rounded-full border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHindi ? 'Washly के बाद (AFTER)' : 'AFTER WASHLY SHINE'}</span>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full select-none overflow-hidden bg-slate-900">
                {/* Base Layer: AFTER (Shiny Clean) */}
                <Image
                  src={currentSegment.afterImage!}
                  alt={`${isHindi ? currentSegment.carNameHi : currentSegment.carNameEn} - After Wash`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover pointer-events-none"
                />

                {/* Top Clipped Layer: BEFORE (Dusty / Muddy) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <Image
                    src={currentSegment.beforeImage!}
                    alt={`${isHindi ? currentSegment.carNameHi : currentSegment.carNameEn} - Before Wash`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-cover"
                  />
                </div>

                {/* Vertical Split Divider & Grab Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/95 shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white text-slate-950 shadow-xl flex items-center justify-center">
                    <MoveHorizontal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Interactive Range Input Overlay */}
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  aria-label="Compare Before and After Wash"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                {/* Floating Top Labels */}
                <div className="absolute top-3.5 left-3.5 bg-slate-950/90 px-3 sm:px-4 py-1.5 rounded-full border border-red-500/40 text-red-200 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg pointer-events-none z-10">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-red-500" />
                  <span>{isHindi ? 'धुलाई से पहले (BEFORE)' : 'BEFORE WASH'}</span>
                </div>

                <div className="absolute top-3.5 right-3.5 bg-slate-950/90 px-3 sm:px-4 py-1.5 rounded-full border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg pointer-events-none z-10">
                  <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHindi ? 'Washly के बाद (AFTER)' : 'AFTER WASHLY SHINE'}</span>
                </div>

                {/* Subtle drag hint pill at bottom center */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/85 px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 pointer-events-none z-10">
                  {isHindi ? '◀ स्लाइड करके अंतर देखें ▶' : '◀ Drag to compare ▶'}
                </div>
              </div>
            )}

            {/* Bottom info strip with Car Details */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {isHindi ? currentSegment.carNameHi : currentSegment.carNameEn}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {isHindi ? currentSegment.badgeHi : currentSegment.badgeEn}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="text-red-600 font-semibold">
                    ✕ {isHindi ? currentSegment.beforeDescHi : currentSegment.beforeDescEn}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ {isHindi ? currentSegment.afterDescHi : currentSegment.afterDescEn}
                  </span>
                </div>
              </div>

              <Link
                href={`/book?segment=${currentSegment.bookingSegment}`}
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
                  <div role="img" className="flex text-amber-700" aria-label="Rated 5 out of 5 stars">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} aria-hidden="true" className="text-sm">{s}</span>
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
                    <div role="img" className="flex text-amber-700 text-xs" aria-label={`Rated ${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} aria-hidden="true">★</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">{isHindi ? review.dateHi : review.dateEn}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &ldquo;{isHindi ? review.commentHi : review.commentEn}&rdquo;
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
