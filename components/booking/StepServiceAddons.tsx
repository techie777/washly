'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { LUXURY_SERVICES } from '@/lib/seedData';
import { ServicePackage } from '@/types';

const SERVICE_SLIDES = [
  {
    id: 'srv_bucket_wash',
    name: 'Car Bucket Wash',
    subtitle: 'Gentle Hand Sponge & Microfiber Clean',
    image: '/images/bucket-wash.jpg',
    badge: 'Budget Friendly',
    duration: '25 mins',
  },
  {
    id: 'srv_pressure_wash',
    name: 'Car Pressure Wash',
    subtitle: 'High Pressure Jet Wash & Mud Blaster',
    image: '/images/pressure-wash.jpg',
    badge: 'Popular',
    duration: '35 mins',
  },
  {
    id: 'srv_pressure_rotator',
    name: 'Shampoo + Machine Rotator Shine',
    subtitle: 'Dense Snow Foam & Electric Rotator Buffing',
    image: '/images/rotator-shine.jpg',
    badge: 'Best Value',
    duration: '45 mins',
  },
  {
    id: 'srv_complete_detailing',
    name: 'Complete Wash + Interior Vacuum + Free Perfume',
    subtitle: 'Full Exterior, Deep Vacuum & Air Freshener',
    image: '/images/complete-spa.jpg',
    badge: 'Best Package',
    duration: '60 mins',
  },
];

export default function StepServiceAddons() {
  const { 
    service, 
    setService, 
    vehicle, 
    availableServices,
    setAvailableServices,
    nextStep, 
    prevStep 
  } = useBookingStore();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SERVICE_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Fetch updated packages from API/localStorage if edited by admin
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setAvailableServices(data.services);
        }
      })
      .catch((err) => console.warn('Using default services:', err));
  }, [setAvailableServices]);

  const servicesList = availableServices && availableServices.length > 0 ? availableServices : LUXURY_SERVICES;
  const filteredServices = servicesList.filter(
    (s) => s.category === (vehicle?.type || 'car')
  );

  const currentSegment = vehicle?.segment || 'compact_suv';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 3: Select Wash Package
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Calibrated for your {vehicle?.make} {vehicle?.model} ({currentSegment.replace('_', ' ').toUpperCase()}).
        </p>
      </div>

      {/* Auto-sliding 4-Image Service Visual Gallery */}
      <div 
        className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Banner Slide Container */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          {SERVICE_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30" />

                {/* Overlay Text */}
                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 text-white">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-xs">
                      {slide.badge}
                    </span>
                    <span className="text-[10px] text-amber-200 font-mono">
                      ⏱ {slide.duration}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-sm">
                    {slide.name}
                  </h4>
                  <p className="text-xs text-slate-200 line-clamp-1 drop-shadow-xs">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Left / Right Nav Arrows */}
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev - 1 + SERVICE_SLIDES.length) % SERVICE_SLIDES.length)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous service slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % SERVICE_SLIDES.length)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next service slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Small Thumbnail Sliders Sliding One After Another */}
        <div className="bg-slate-950/95 px-3 py-2.5 border-t border-slate-800">
          <div className="grid grid-cols-4 gap-2">
            {SERVICE_SLIDES.map((slide, idx) => {
              const isCurrent = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`relative h-12 sm:h-14 rounded-lg overflow-hidden border-2 text-left transition-all group/thumb ${
                    isCurrent
                      ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-md scale-[1.02]'
                      : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 transition-colors ${
                    isCurrent ? 'bg-amber-500/20' : 'bg-black/50 group-hover/thumb:bg-black/20'
                  }`} />
                  <div className="absolute inset-x-1 bottom-1">
                    <span className="block text-[9px] font-bold text-white truncate leading-tight drop-shadow-sm">
                      {slide.name.replace('Car ', '')}
                    </span>
                  </div>

                  {/* Animated Progress bar on active thumbnail */}
                  {isCurrent && !isPaused && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 animate-[pulse_1.5s_infinite]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Select Primary Package:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((srv) => {
            const isSelected = service?.id === srv.id;
            const price = srv.vehiclePricing[currentSegment] || 250;

            return (
              <div
                key={srv.id}
                onClick={() => setService(srv)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-blue-600 font-semibold">
                      {srv.durationMinutes} mins
                    </span>
                    {srv.badge && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.tagline}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {srv.includedTasks.slice(0, 3).map((t, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-xs text-blue-600 font-bold">₹</span>
                    <span className="text-2xl font-black text-slate-900 font-mono">{price}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center space-x-2 shadow-xs"
        >
          <span>Choose Date & Time Slot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
