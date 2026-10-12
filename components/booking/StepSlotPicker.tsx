'use client';

import React from 'react';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';

const TIME_SLOTS = [
  { slot: '08:00 AM - 10:00 AM', label: 'Morning Express', availableVans: 3 },
  { slot: '10:00 AM - 12:00 PM', label: 'Mid-Morning Prime', availableVans: 2 },
  { slot: '12:00 PM - 02:00 PM', label: 'Noon Session', availableVans: 4 },
  { slot: '02:00 PM - 04:00 PM', label: 'Afternoon Wash', availableVans: 3 },
  { slot: '04:00 PM - 06:00 PM', label: 'Evening Prime', availableVans: 2 },
  { slot: '06:00 PM - 08:00 PM', label: 'Sunset Wash', availableVans: 2 },
];

export default function StepSlotPicker() {
  const { scheduledDate, timeSlot, setSchedule, nextStep, prevStep, city } = useBookingStore();

  // Generate next 6 days
  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Starting tomorrow
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { iso, dayName, monthDay };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 4: Select Your Date & Arrival Window
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Each slot dispatches a dedicated mobile wash van with trained washers to your location in {city?.city || 'your area'}.
        </p>
      </div>

      {/* Date Carousel Grid */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Select Preferred Date:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dateOptions.map((opt) => {
            const isSelected = scheduledDate === opt.iso;
            return (
              <button
                key={opt.iso}
                type="button"
                onClick={() => setSchedule(opt.iso, timeSlot)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                  {opt.dayName}
                </span>
                <span className="text-lg font-black text-slate-900 font-mono my-1">
                  {opt.monthDay}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  Slots Open
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Hour Slot Intervals */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Select 2-Hour Arrival Window:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIME_SLOTS.map((ts) => {
            const isSelected = timeSlot === ts.slot;
            return (
              <button
                key={ts.slot}
                type="button"
                onClick={() => setSchedule(scheduledDate, ts.slot)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-blue-600 border-slate-200'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {ts.slot}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {ts.label}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold block">
                    {ts.availableVans} Vans Ready
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-blue-600">Selected</span>
                  )}
                </div>
              </button>
            );
          })}
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
          type="button"
          onClick={nextStep}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center space-x-2 shadow-xs"
        >
          <span>Confirm Slot & Enter Address</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
