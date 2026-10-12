'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { SERVICEABLE_CITIES } from '@/lib/seedData';
import { LocationCity } from '@/types';

export default function StepCityPincode() {
  const { 
    city, 
    setCity, 
    pincode, 
    setPincode, 
    validatePincode, 
    nextStep 
  } = useBookingStore();

  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const handleCityChange = (c: LocationCity) => {
    setCity(c);
    setPincodeError(null);
  };

  const handlePincodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPincode(val);
    if (val.length === 6) {
      if (city?.serviceablePincodes.includes(val)) {
        setPincodeError(null);
      } else {
        setPincodeError(`Pincode ${val} is not currently in ${city?.city}'s instant dispatch zone. Try one of our active pin codes below.`);
      }
    } else {
      setPincodeError(null);
    }
  };

  const handleProceed = () => {
    if (!city) {
      setPincodeError('Please select a city.');
      return;
    }
    if (!pincode || pincode.length !== 6) {
      setPincodeError('Please enter a valid 6-digit postal pincode.');
      return;
    }
    const isValid = validatePincode();
    if (!isValid) {
      setPincodeError(`Pincode ${pincode} is not currently serviceable in ${city.city}.`);
      return;
    }
    setPincodeError(null);
    nextStep();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 1: Confirm Your Service Pincode in Indore
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Our self-powered mobile wash units are stationed across Indore for rapid doorstep arrival.
        </p>
      </div>

      {/* Operating City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Operating Metro City:
        </label>
        <div className="max-w-md p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-600 shadow-xs ring-1 ring-blue-500 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-blue-700">Indore</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full uppercase">Active Hub</span>
            </div>
            <div className="text-[11px] text-blue-600 font-semibold font-mono mt-1">
              16 Vans Ready • Vijay Nagar, Palasia, AB Road & All Zones
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
        </div>
      </div>

      {/* Pin Code Input Box */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
          Enter 6-Digit Service Pincode in Indore:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <MapPin className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={handlePincodeInput}
              placeholder="e.g. 452010"
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 font-mono text-sm tracking-wider focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xs shrink-0"
          >
            Confirm Area & Next
          </button>
        </div>

        {pincodeError && (
          <div className="mt-3 flex items-center space-x-2 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pincodeError}</span>
          </div>
        )}

        {/* Quick Clickable Active Pincodes */}
        {city && (
          <div className="mt-5 pt-4 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-2 font-medium">
              Sample verified active pin codes in {city.city}:
            </span>
            <div className="flex flex-wrap gap-2">
              {city.serviceablePincodes.map((pin) => (
                <button
                  key={pin}
                  type="button"
                  onClick={() => {
                    setPincode(pin);
                    setPincodeError(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                    pincode === pin
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {pin}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
