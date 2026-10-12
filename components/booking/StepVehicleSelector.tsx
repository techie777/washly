'use client';

import React, { useState } from 'react';
import { Car, Bike, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { POPULAR_VEHICLES } from '@/lib/seedData';
import { VehicleType, VehicleSegment } from '@/types';

export default function StepVehicleSelector() {
  const { vehicle, setVehicle, nextStep, prevStep } = useBookingStore();

  const [vehicleType, setVehicleType] = useState<VehicleType>(vehicle?.type || 'car');
  const [make, setMake] = useState(vehicle?.make || 'Hyundai');
  const [model, setModel] = useState(vehicle?.model || 'Creta');
  const [segment, setSegment] = useState<VehicleSegment>(vehicle?.segment || 'compact_suv');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>(vehicle?.fuelType || 'petrol');
  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '');

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

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicle({
      type: vehicleType,
      make: make.trim() || 'Other',
      model: model.trim() || 'Custom Vehicle',
      segment,
      plateNumber,
      fuelType,
    });
    nextStep();
  };

  return (
    <form onSubmit={handleProceed} className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 2: Choose Your Vehicle Details
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Select vehicle type and model to help our washers allocate the right amount of foam and equipment.
        </p>
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
          }}
          className={`p-4 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${
            vehicleType === 'car'
              ? 'bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-500 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Car className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-bold">Car Wash</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setVehicleType('bike');
            setSegment('sports_superbike');
            setMake('Royal Enfield');
            setModel('Classic 350');
          }}
          className={`p-4 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${
            vehicleType === 'bike'
              ? 'bg-blue-50/80 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-500 font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Bike className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-bold">Bike Care</span>
        </button>
      </div>

      {/* Quick Presets Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Popular Models:
          </label>
          <span className="text-[11px] text-slate-500">
            Click your model or select &quot;Other vehicle&quot;
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
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
                className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
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
                  <span className={`font-semibold truncate ${isOther ? 'text-amber-900 font-bold' : 'text-slate-900'}`}>
                    {item.make}
                  </span>
                  {isOther && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-800">
                      CUSTOM
                    </span>
                  )}
                </div>
                <span className={`text-[11px] truncate mt-1 ${isOther ? 'text-amber-700 font-medium' : 'text-slate-500'}`}>
                  {item.model}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Input Form */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Maruti / Hyundai / Honda"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Model Name
            </label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Swift / Creta / City"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Segment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vehicle Segment
            </label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as VehicleSegment)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              {vehicleType === 'car' ? (
                <>
                  <option value="hatchback">Hatchback (Swift, i20, Polo)</option>
                  <option value="sedan">Executive Sedan (City, Verna, Virtus)</option>
                  <option value="compact_suv">Compact SUV (Creta, Seltos, Nexon)</option>
                  <option value="suv">Full-Size SUV (Fortuner, XUV700)</option>
                  <option value="luxury">Luxury / Supercar (Mercedes, BMW, Audi)</option>
                </>
              ) : (
                <>
                  <option value="commuter">Commuter / EV Bike (Classic 350, Ather, Ola)</option>
                  <option value="sports_superbike">Superbike / Cruiser (Ducati, S1000RR, Triumph)</option>
                </>
              )}
            </select>
          </div>

          {/* Fuel */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fuel Type
            </label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric (EV)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* License Plate */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vehicle Number (Optional)
            </label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="e.g. MH 02 AB 1234"
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center space-x-2 shadow-xs"
        >
          <span>Confirm Vehicle & Choose Package</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
}
