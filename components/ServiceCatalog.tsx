'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Check, 
  Clock, 
  Sparkles, 
  Star, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { LUXURY_SERVICES } from '@/lib/seedData';
import { VehicleSegment, ServicePackage } from '@/types';
import { useTranslation } from '@/lib/translations';
import { useBookingStore } from '@/lib/store/bookingStore';

const VEHICLE_SEGMENTS: { seg: VehicleSegment; titleEn: string; titleHi: string; icon: string; examples: string }[] = [
  { seg: 'hatchback', titleEn: 'Hatchback', titleHi: 'हैचबैक', icon: '🚗', examples: 'Swift, i20, WagonR' },
  { seg: 'sedan', titleEn: 'Sedan', titleHi: 'सेडान', icon: '🏎️', examples: 'City, Verna, Dzire' },
  { seg: 'compact_suv', titleEn: 'Compact SUV', titleHi: 'कॉम्पैक्ट SUV', icon: '🚙', examples: 'Creta, Brezza, Nexon' },
  { seg: 'suv', titleEn: 'Full SUV', titleHi: 'बड़ी SUV', icon: '🛞', examples: 'Fortuner, Scorpio, Thar' },
  { seg: 'commuter', titleEn: 'Bike / Scooter', titleHi: 'बाइक / स्कूटर', icon: '🛵', examples: 'Activa, Splendor, Bullet' },
];

const SERVICE_IMAGES: Record<string, string> = {
  'srv_bucket_wash': '/images/bucket-wash.jpg',
  'srv_pressure_wash': '/images/pressure-wash.jpg',
  'srv_pressure_rotator': '/images/rotator-shine.jpg',
  'srv_complete_detailing': '/images/complete-spa.jpg',
  'srv_bike_foam_pressure': '/images/pressure-wash.jpg',
  'srv_bike_super_detailing': '/images/complete-spa.jpg',
  'car-bucket-wash': '/images/bucket-wash.jpg',
  'car-pressure-wash': '/images/pressure-wash.jpg',
  'shampoo-rotator-shine': '/images/rotator-shine.jpg',
  'complete-wash-interior-vacuum-perfume': '/images/complete-spa.jpg',
  'bike-foam-pressure': '/images/pressure-wash.jpg',
  'bike-super-detailing': '/images/complete-spa.jpg',
};

export default function ServiceCatalog() {
  const { isHindi } = useTranslation();
  const { setService, setVehicle } = useBookingStore();
  const [selectedSegment, setSelectedSegment] = useState<VehicleSegment>('hatchback');

  const isBike = selectedSegment === 'commuter' || selectedSegment === 'sports_superbike';
  const categoryFilter = isBike ? 'bike' : 'car';

  const servicesList = LUXURY_SERVICES.filter((s) => s.category === categoryFilter);

  const getServiceContent = (service: ServicePackage) => {
    if (!isHindi) {
      return {
        name: service.name,
        tagline: service.tagline || service.description,
        tasks: service.includedTasks.slice(0, 3),
        badge: service.badge || 'POPULAR',
      };
    }
    switch (service.slug) {
      case 'car-bucket-wash':
        return {
          name: 'कार बकेट वॉश',
          tagline: 'स्पंज और माइक्रोफाइबर से सुरक्षित हाथ से सफाई',
          tasks: ['हाथ से शैम्पू सफाई', 'टायर व रिम वॉश', 'माइक्रोफाइबर सुखाई'],
          badge: 'किफायती वॉश'
        };
      case 'car-pressure-wash':
        return {
          name: 'कार प्रेशर जेट वॉश',
          tagline: 'हाई प्रेशर पानी का जेट और मिट्टी की पूरी सफाई',
          tasks: ['हाई प्रेशर पानी जेट', 'अंडरबॉडी मड ब्लास्ट', 'व्हील आर्च क्लीनिंग'],
          badge: 'सबसे लोकप्रिय'
        };
      case 'shampoo-rotator-shine':
        return {
          name: 'शैम्पू + रोटेटर चमक',
          tagline: 'गाढ़ा स्नो फोम और मशीन से चमकदार पॉलिश',
          tasks: ['गाढ़ा स्नो शैम्पू फोम', 'मशीन रोटेटर पॉलिश', 'टायर ग्लॉस कोटिंग'],
          badge: 'पैसे वसूल'
        };
      case 'complete-wash-interior-vacuum-perfume':
        return {
          name: 'कम्प्लीट वॉश + वैक्यूम + परफ्यूम',
          tagline: 'फुल जेट वॉश, इंटीरियर वैक्यूम और फ्री कार परफ्यूम',
          tasks: ['फुल प्रेशर जेट वॉश', 'सीट व फ्लोर वैक्यूम', 'फ्री प्रीमियम परफ्यूम'],
          badge: 'नंबर-1 पैकेज'
        };
      case 'bike-foam-pressure':
        return {
          name: 'बाइक फोम व प्रेशर वॉश',
          tagline: 'हाई प्रेशर से मिट्टी की पूरी सफाई और चमक',
          tasks: ['हाई प्रेशर जेट वॉश', 'फोम शैम्पू सफाई', 'माइक्रोफाइबर वाइप'],
          badge: 'लोकप्रिय बाइक वॉश'
        };
      case 'bike-super-detailing':
        return {
          name: 'बाइक सुपर डिटेलिंग + चेन ल्यूब',
          tagline: 'इंजन डीग्रीजिंग, चेन ल्यूब और हाई-ग्लॉस पॉलिश',
          tasks: ['इंजन डीग्रीजिंग', 'चेन क्लीन + ल्यूब', 'पूरी बॉडी पर चमक'],
          badge: 'सुपर डिटेलिंग'
        };
      default:
        return {
          name: service.name,
          tagline: service.tagline || service.description,
          tasks: service.includedTasks.slice(0, 3),
          badge: service.badge || 'स्पेशल पैकेज'
        };
    }
  };

  const handleSelectPackage = (service: ServicePackage) => {
    setService(service);
    setVehicle({
      type: isBike ? 'bike' : 'car',
      make: isBike ? 'Honda' : 'Maruti Suzuki',
      model: isBike ? 'Activa' : 'Swift',
      segment: selectedSegment,
      fuelType: 'petrol',
      plateNumber: '',
    });
  };

  return (
    <section id="packages" className="py-14 sm:py-20 bg-gradient-to-b from-white via-amber-50/30 to-slate-50 border-b border-amber-200/60 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'डोरस्टेप वॉश पैकेज व सटीक रेट' : 'Doorstep Wash Packages & Exact Pricing'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {isHindi ? 'अपनी गाड़ी का साइज चुनें और' : 'Select Vehicle Size &'}{' '}
            <span className="text-amber-700">{isHindi ? 'सटीक रेट देखें' : 'See Exact Price'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {isHindi 
              ? 'कोई छुपा हुआ शुल्क नहीं। शुद्ध पानी, साइलेंट बिजली और जर्मन उपकरण हमारी वैन से शामिल हैं।' 
              : 'Zero hidden charges. Pure water, silent power & high pressure equipment included.'}
          </p>
        </div>

        {/* 1. VEHICLE SIZE SELECTOR TABS (Hatchback | Sedan | Compact SUV | Full SUV | Bike) */}
        <div className="mb-8">
          <div className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            {isHindi ? 'गाड़ी का प्रकार चुनें (साइज अनुसार रेट देखें):' : 'Select Vehicle Size:'}
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {VEHICLE_SEGMENTS.map((item) => {
              const isSelected = selectedSegment === item.seg;
              return (
                <button
                  key={item.seg}
                  type="button"
                  onClick={() => setSelectedSegment(item.seg)}
                  className={`px-3.5 py-2.5 rounded-2xl flex items-center space-x-2 transition-all shrink-0 cursor-pointer text-xs font-bold border ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-2xs'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{isHindi ? item.titleHi : item.titleEn}</span>
                  <span className={`text-[10px] hidden md:inline opacity-75 font-normal`}>
                    ({item.examples.split(',')[0]})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. COMPACT PACKAGE CARDS WITH HORIZONTAL SNAP SCROLL ON MOBILE */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible no-scrollbar">
          {servicesList.map((service) => {
            const content = getServiceContent(service);
            const exactPrice = service.vehiclePricing[selectedSegment] || 250;
            const serviceImage = SERVICE_IMAGES[service.slug] || SERVICE_IMAGES[service.id] || '/images/pressure-wash.jpg';
            const isPopular = service.popular || service.slug === 'car-pressure-wash' || service.slug === 'complete-wash-interior-vacuum-perfume';

            return (
              <div
                key={service.id}
                className={`snap-center shrink-0 w-[82vw] sm:w-auto bg-white rounded-3xl flex flex-col justify-between border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isPopular
                    ? 'border-amber-400 ring-4 ring-amber-400/20 shadow-lg shadow-amber-500/15'
                    : 'border-slate-200 hover:border-amber-300 shadow-sm'
                }`}
              >
                {/* Compact Thumbnail Header */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={serviceImage}
                    alt={content.name}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 280px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-xs ${
                      isPopular
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 text-slate-950 font-black'
                        : 'bg-slate-950 text-amber-300 border border-amber-400/30'
                    }`}>
                      {content.badge}
                    </span>
                  </div>

                  {/* Rating & Duration */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-amber-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{service.durationMinutes} {isHindi ? 'मिनट' : 'mins'}</span>
                    </span>

                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{service.rating}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-grow space-y-3">
                  <div>
                    {/* Title */}
                    <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1 mb-1">
                      {content.name}
                    </h3>
                    
                    {/* Short Description */}
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1 leading-relaxed mb-3">
                      {content.tagline}
                    </p>

                    {/* 3 Crisp Bullets */}
                    <div className="space-y-1.5 pb-3 border-b border-slate-100">
                      {content.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                          <span className="truncate">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Single Clean CTA */}
                  <div className="pt-1 space-y-2">
                    
                    {/* Exact Price Row */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase block">
                          {isHindi ? 'सटीक रेट' : 'Exact Price'}
                        </span>
                        <span className="text-[9px] text-emerald-700 font-bold">
                          {isHindi ? 'पानी व जनरेटर शामिल' : 'Water & Power incl.'}
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-xs font-black text-amber-700">₹</span>
                        <span className="text-2xl font-black text-slate-900 font-mono">{exactPrice}</span>
                      </div>
                    </div>

                    {/* ONLY ONE PRIMARY ACTION BUTTON! */}
                    <Link
                      href={`/book?service=${service.slug}&segment=${selectedSegment}`}
                      onClick={() => handleSelectPackage(service)}
                      className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md text-center cursor-pointer ${
                        isPopular
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                          : 'bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/30'
                      }`}
                    >
                      <span>{isHindi ? `अभी बुक करें (₹${exactPrice})` : `Book Now (₹${exactPrice})`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Secondary subtle text link (not a confusing second button) */}
                    <a
                      href={`https://wa.me/919685232340?text=${encodeURIComponent(
                        isHindi 
                        ? `नमस्ते Washly! मुझे ${content.name} (रेट: ₹${exactPrice}) के बारे में जानना है।`
                        : `Hello Washly! I would like to inquire about ${content.name} (Price: ₹${exactPrice}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-[10px] text-slate-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      {isHindi ? 'व्हाट्सएप पर पूछें →' : 'Inquire on WhatsApp →'}
                    </a>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Swipe hint on mobile */}
        <div className="sm:hidden text-center text-[11px] text-slate-600 font-semibold mt-2 flex items-center justify-center gap-1">
          <span>👈</span>
          <span>{isHindi ? 'अन्य पैकेज देखने के लिए स्वाइप करें' : 'Swipe left/right to view all packages'}</span>
          <span>👉</span>
        </div>

      </div>
    </section>
  );
}
