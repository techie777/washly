'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Star, 
  Droplet, 
  Sparkles, 
  PhoneCall, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { ServicePackage, LocationCity } from '@/types';
import { useBookingStore } from '@/lib/store/bookingStore';

interface LocalSeoHeroProps {
  service: ServicePackage;
  city: LocationCity;
}

export default function LocalSeoHero({ service, city }: LocalSeoHeroProps) {
  const router = useRouter();
  const { setService, setCity } = useBookingStore();

  const handleInstantBook = () => {
    setService(service);
    setCity(city);
    router.push(`/book?service=${service.slug}&city=${city.slug}`);
  };

  const startingPrice = Math.min(...Object.values(service.vehiclePricing));

  return (
    <section className="relative pt-12 pb-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center space-x-2 text-xs text-slate-600">
          <Link href="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#services" className="hover:text-amber-700 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-amber-700 font-semibold">{service.name}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">{city.city}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7">
            {/* Local Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs text-amber-950 font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Doorstep Wash Hub: {city.city}, {city.state}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-6">
              {service.name} in{' '}
              <span className="text-amber-600">{city.city}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Enjoy professional {service.name.toLowerCase()} delivered directly to your residence or office parking anywhere across {city.city}. 
              Our mobile units bring 140 Bar pressure washers, snow foam guns, and vacuums right to your doorstep (water &amp; power to be provided by the customer during the wash; onboard options are planned for the future).
            </p>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-600">Starting Price</div>
                <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline space-x-1">
                  <span className="text-sm text-amber-700 font-bold">₹</span>
                  <span>{startingPrice}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-600">Session Duration</div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {service.durationMinutes} mins
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-600">Local Vans Active</div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {city.activeTechnicians} Mobile Vans
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleInstantBook}
                className="btn-sparkle-gold w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-black text-amber-400 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg border border-amber-400/40 hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Book In {city.city} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${city.localizedPhone}`}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider hover:border-amber-400 hover:text-amber-700 flex items-center justify-center space-x-2 transition-all shadow-2xs"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>Call {city.city} Dispatch: {city.localizedPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Protocol Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Verified Wash Protocol</span>
                  <span className="text-[11px] text-slate-600">Serviced in {city.city}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-amber-700 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{city.averageRating}</span>
                  <span className="text-slate-600 font-medium">({city.totalReviews}+ reviews)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {service.includedTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-600">
                <div className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Free Home Visit Worth ₹99 in {city.city}</span>
                </div>
                High-pressure foam wash, soft microfiber wipe, and paint-safe care protocol—with ₹99 doorstep home visit included free.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
