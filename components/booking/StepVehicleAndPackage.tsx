'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Bike, 
  Check, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { POPULAR_VEHICLES, LUXURY_SERVICES } from '@/lib/seedData';
import { VehicleType, VehicleSegment, ServicePackage } from '@/types';
import { useTranslation } from '@/lib/translations';

export default function StepVehicleAndPackage() {
  const { t, isHindi } = useTranslation();
  const { 
    vehicle, 
    setVehicle, 
    service, 
    setService, 
    availableServices, 
    setAvailableServices,
    nextStep 
  } = useBookingStore();

  const [vehicleType, setVehicleType] = useState<VehicleType>(vehicle?.type || 'car');
  const [make, setMake] = useState(vehicle?.make || 'Hyundai');
  const [model, setModel] = useState(vehicle?.model || 'Creta');
  const [segment, setSegment] = useState<VehicleSegment>(vehicle?.segment || 'compact_suv');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>(vehicle?.fuelType || 'petrol');
  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '');

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

  const popularList = vehicleType === 'car' ? POPULAR_VEHICLES.cars : POPULAR_VEHICLES.bikes;

  const handleSelectPreset = (item: typeof popularList[0]) => {
    if (item.make === 'Other' || item.model === 'Other vehicle') {
      setMake('Other');
      setModel('');
      setSegment(vehicleType === 'car' ? 'compact_suv' : 'commuter');
    } else {
      setMake(item.make);
      setModel(item.model);
      setSegment(item.segment as VehicleSegment);
    }
  };

  const servicesList = availableServices && availableServices.length > 0 ? availableServices : LUXURY_SERVICES;
  const filteredServices = servicesList.filter(
    (s) => s.category === vehicleType
  );

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicle({
      type: vehicleType,
      make: make.trim() || 'Other',
      model: model.trim() || 'Custom Vehicle',
      segment,
      plateNumber,
      fuelType,
    });
    // Ensure active service matches the category
    if (!service || service.category !== vehicleType) {
      if (filteredServices.length > 0) {
        setService(filteredServices[0]);
      }
    }
    nextStep();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleContinue} className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Doorstep Hub: Indore (16 Mobile Vans Ready)</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 1: Choose Vehicle & Select Wash Package
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Pick your vehicle specifications and preferred wash tier. Pricing calibrates automatically.
        </p>
      </div>

      {/* SECTION 1: VEHICLE SELECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <Car className="w-4 h-4 text-blue-600" />
            <span>1. Vehicle Category & Model</span>
          </label>
        </div>

        {/* Vehicle Type Switcher */}
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => {
              setVehicleType('car');
              setSegment('compact_suv');
              setMake('Hyundai');
              setModel('Creta');
              const carSrv = servicesList.find(s => s.category === 'car');
              if (carSrv) setService(carSrv);
            }}
            className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
              vehicleType === 'car'
                ? 'bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-500 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Car className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Car Wash</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVehicleType('bike');
              setSegment('sports_superbike');
              setMake('Royal Enfield');
              setModel('Classic 350');
              const bikeSrv = servicesList.find(s => s.category === 'bike');
              if (bikeSrv) setService(bikeSrv);
            }}
            className={`p-3.5 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
              vehicleType === 'bike'
                ? 'bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-500 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Bike className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Bike Care</span>
          </button>
        </div>

        {/* Popular Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-600">
              Popular {vehicleType === 'car' ? 'Cars' : 'Bikes'} in Indore:
            </span>
            <span className="text-[10px] text-slate-400">Click to select or enter custom below</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
            {popularList.map((item, idx) => {
              const isOther = item.make === 'Other' || item.model === 'Other vehicle';
              const isMatch = isOther
                ? make === 'Other' || (!popularList.some(p => p.make !== 'Other' && p.make === make && p.model === model))
                : make === item.make && model === item.model;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(item)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    isOther
                      ? isMatch
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs ring-1 ring-amber-400'
                        : 'bg-gradient-to-br from-white to-amber-50/40 border-dashed border-amber-300 text-amber-800 hover:border-amber-400 hover:bg-amber-50/50'
                      : isMatch
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold truncate text-[11px] ${isOther ? 'text-amber-900 font-bold' : 'text-slate-900'}`}>
                      {item.make}
                    </span>
                    {isOther && (
                      <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-200/80 text-amber-800">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] truncate mt-0.5 ${isOther ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>
                    {item.model}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand / Model / Segment / Fuel */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                required
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Hyundai / Maruti / Honda"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Creta / Swift / City"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Vehicle Segment
              </label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as VehicleSegment)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              >
                {vehicleType === 'car' ? (
                  <>
                    <option value="hatchback">Hatchback (Swift, i20)</option>
                    <option value="sedan">Sedan (City, Verna)</option>
                    <option value="compact_suv">Compact SUV (Creta, Brezza)</option>
                    <option value="suv">Full-Size SUV (Fortuner, XUV700)</option>
                    <option value="luxury">Luxury (Mercedes, BMW, Audi)</option>
                  </>
                ) : (
                  <>
                    <option value="commuter">Commuter / EV Bike (Classic 350, Ola)</option>
                    <option value="sports_superbike">Superbike / Cruiser</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric (EV)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Vehicle Plate No. (Optional)
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                placeholder="e.g. MP 09 AB 1234"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PACKAGE SELECTION */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>2. Select Wash Package for {make} {model}</span>
          </label>
          <span className="text-[11px] text-blue-600 font-semibold font-mono">
            Segment: {segment.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredServices.map((srv) => {
            const isSelected = service?.id === srv.id;
            const price = srv.vehiclePricing[segment] || 250;

            return (
              <div
                key={srv.id}
                onClick={() => setService(srv)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-2 ring-blue-500/40'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-blue-600 font-semibold">
                      ⏱ {srv.durationMinutes} mins
                    </span>
                    {srv.badge && (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {srv.tagline}
                  </p>

                  <div className="space-y-1 mb-3">
                    {srv.includedTasks.slice(0, 3).map((t, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-xs text-blue-600 font-bold">₹</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{price}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <span>{t.continueToSlot}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
