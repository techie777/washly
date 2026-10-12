'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useTranslation } from '@/lib/translations';
import { useAuthStore } from '@/lib/store/authStore';

interface StepSlotAndAddressProps {
  onBookingSuccess: (bookingId: string, waUrl?: string) => void;
}

const TIME_SLOTS = [
  { slot: '08:00 AM - 10:00 AM', label: 'Morning Express', availableVans: 3 },
  { slot: '10:00 AM - 12:00 PM', label: 'Mid-Morning Prime', availableVans: 2 },
  { slot: '12:00 PM - 02:00 PM', label: 'Noon Session', availableVans: 4 },
  { slot: '02:00 PM - 04:00 PM', label: 'Afternoon Wash', availableVans: 3 },
  { slot: '04:00 PM - 06:00 PM', label: 'Evening Prime', availableVans: 2 },
  { slot: '06:00 PM - 08:00 PM', label: 'Sunset Wash', availableVans: 2 },
];

export default function StepSlotAndAddress({ onBookingSuccess }: StepSlotAndAddressProps) {
  const { t, isHindi } = useTranslation();
  const { 
    city, 
    pincode, 
    setPincode,
    vehicle, 
    service, 
    selectedAddOns, 
    scheduledDate, 
    timeSlot, 
    setSchedule,
    customer, 
    setCustomer, 
    address, 
    setAddress, 
    paymentMethod, 
    setPaymentMethod, 
    notes, 
    setNotes, 
    getTotalAmount, 
    prevStep 
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 6 days starting tomorrow
  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { iso, dayName, monthDay };
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCustomer({ phone: digitsOnly });
    if (error) setError(null);
  };

  const handlePincodeChange = (val: string) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setPincode(cleanPin);
    if (error) setError(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      setError('Please provide your full name.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Mobile number must be exactly 10 numeric digits (e.g. 9685232340).');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit Indore pincode.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!address.street.trim()) {
      setError('Please enter your full doorstep address in Indore.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        customer: {
          ...customer,
          phone: cleanPhone,
        },
        vehicle,
        service,
        selectedAddOns,
        scheduledDate,
        timeSlot,
        address: {
          ...address,
          city: city?.city || 'Indore',
          pincode: pincode,
        },
        status: 'confirmed',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        totalAmount: getTotalAmount(),
        notes,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      // Sync customer login in authStore and persist recent booking ID
      try {
        useAuthStore.getState().login({
          name: customer.name.trim(),
          phone: cleanPhone,
          email: customer.email?.trim() || '',
          pin: '1234',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('doorstep_last_booking_id', data.booking.bookingId);
        localStorage.setItem('doorstep_last_customer_phone', cleanPhone);
        const existing = JSON.parse(localStorage.getItem('doorstep_recent_bookings') || '[]');
        const updated = Array.from(new Set([data.booking.bookingId, ...existing]));
        localStorage.setItem('doorstep_recent_bookings', JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage error', e);
      }

      // Construct WhatsApp Booking Alert to 9685232340
      const waTargetNumber = '919685232340';
      const waAlertMessage = 
        `🚗 *NEW DOORSTEP WASH BOOKING ALERT (INDORE)* 🚗\n` +
        `--------------------------------------\n` +
        `📋 *Booking ID:* ${data.booking.bookingId}\n` +
        `👤 *Customer Name:* ${customer.name}\n` +
        `📞 *Contact No:* ${cleanPhone}\n` +
        `📍 *Address:* ${address.street}${address.landmark ? ', Landmark: ' + address.landmark : ''}, Indore - ${pincode}\n` +
        `🚘 *Vehicle Details:* ${vehicle?.make} ${vehicle?.model} (${vehicle?.segment?.replace('_', ' ').toUpperCase()}) [Fuel: ${vehicle?.fuelType}] ${vehicle?.plateNumber ? `[Plate: ${vehicle?.plateNumber}]` : ''}\n` +
        `📦 *Package Chosen:* ${service?.name} (₹${getTotalAmount()})\n` +
        `📅 *Slot Date:* ${scheduledDate}\n` +
        `⏰ *Time Slot:* ${timeSlot}\n` +
        `💳 *Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery (₹' + getTotalAmount() + ')' : 'UPI / Online (₹' + getTotalAmount() + ')'}\n` +
        `⚡💧 *Water & Power Available:* Yes (Confirmed by Customer)\n` +
        `${notes ? `📝 *Special Notes:* ${notes}\n` : ''}` +
        `--------------------------------------\n` +
        `🚀 *Doorstep Car Wash Indore Operations*`;

      const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(waAlertMessage)}`;

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#3B82F6', '#60A5FA', '#10B981'],
      });

      onBookingSuccess(data.booking.bookingId);
    } catch (err: any) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitBooking} className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Indore Doorstep Dispatch • 100% Water & Power On-Board</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 2: Choose Slot & Doorstep Address
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Pick your preferred date and arrival window, and tell us where your vehicle is parked in Indore.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: DATE & SLOT PICKER */}
      <div className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>1. Preferred Date & Arrival Window</span>
        </label>

        {/* Date options */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {dateOptions.map((opt) => {
            const isSelected = scheduledDate === opt.iso;
            return (
              <button
                key={opt.iso}
                type="button"
                onClick={() => setSchedule(opt.iso, timeSlot)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                  {opt.dayName}
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 font-mono my-0.5">
                  {opt.monthDay}
                </span>
                <span className="text-[9px] text-emerald-600 font-medium">
                  Slots Open
                </span>
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {TIME_SLOTS.map((ts) => {
            const isSelected = timeSlot === ts.slot;
            return (
              <button
                key={ts.slot}
                type="button"
                onClick={() => setSchedule(scheduledDate, ts.slot)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-blue-600 border-slate-200'
                  }`}>
                    <Clock className="w-4 h-4" />
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
                  <span className="text-[9px] font-mono text-emerald-600 font-semibold block">
                    {ts.availableVans} Vans Ready
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-bold text-blue-600">Selected</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ADDRESS & PINCODE IN INDORE */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>2. Doorstep Parking Address in Indore</span>
        </label>

        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5">
          {/* Indore Pincode Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-700">
                Indore Service Pincode *
              </label>
              <span className="text-[10px] text-blue-600 font-medium">All Indore areas covered</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="e.g. 452010"
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Indore Pincode Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['452001', '452010', '452011', '452002', '452003', '452012', '452016'].map((pin) => (
                <button
                  key={pin}
                  type="button"
                  onClick={() => handlePincodeChange(pin)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-colors ${
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

          {/* Full Address */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              House / Flat No, Society, Building & Street Address *
            </label>
            <input
              type="text"
              required
              value={address.street}
              onChange={(e) => setAddress({ street: e.target.value })}
              placeholder="e.g. Flat 402, Sunshine Heights, Vijay Nagar / Palasia / AB Road"
              className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={address.landmark}
                onChange={(e) => setAddress({ landmark: e.target.value })}
                placeholder="e.g. Near Vijay Nagar Square / Meghdoot Garden"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                readOnly
                value="Indore (Doorstep Hub)"
                className="w-full px-3.5 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CUSTOMER CONTACT DETAILS */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
          <User className="w-4 h-4 text-blue-600" />
          <span>3. Customer Contact & Washer Notes</span>
        </label>

        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Mobile No. (10 Digits) *
                </label>
                <span className={`text-[9px] font-mono font-bold ${
                  customer.phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {customer.phone.length}/10 digits
                </span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={customer.phone}
                onChange={handlePhoneChange}
                placeholder="e.g. 9685232340"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ email: e.target.value })}
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Instructions for Washer (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Park in visitor bay 4, please focus on underbody mud"
              className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: PAYMENT SELECTION */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>4. Payment Preference</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setPaymentMethod('cod')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              paymentMethod === 'cod'
                ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Pay After Inspection (Cash / UPI)
                </div>
                <div className="text-[10px] text-slate-500">
                  Pay washer directly once your car is clean
                </div>
              </div>
            </div>
            {paymentMethod === 'cod' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            )}
          </div>

          <div
            onClick={() => setPaymentMethod('upi_mock')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              paymentMethod === 'upi_mock'
                ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Instant QR on Van Arrival
                </div>
                <div className="text-[10px] text-slate-500">
                  Scan GPay, PhonePe or Paytm on vehicle van
                </div>
              </div>
            </div>
            {paymentMethod === 'upi_mock' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Navigation & Submit */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            prevStep();
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center space-x-1.5 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToVehicle}</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <span>{t.bookingProcessing}</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{t.confirmBooking} (₹{getTotalAmount()})</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
