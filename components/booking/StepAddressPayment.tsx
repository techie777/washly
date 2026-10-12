'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Banknote, 
  QrCode, 
  MapPin, 
  User, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useAuthStore } from '@/lib/store/authStore';

interface StepAddressPaymentProps {
  onBookingSuccess: (bookingId: string, waUrl?: string) => void;
}

export default function StepAddressPayment({ onBookingSuccess }: StepAddressPaymentProps) {
  const router = useRouter();
  const { 
    city, 
    pincode, 
    vehicle, 
    service, 
    selectedAddOns, 
    scheduledDate, 
    timeSlot, 
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric digits and limit to 10
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCustomer({ phone: digitsOnly });
    if (error) setError(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Mobile number must be exactly 10 numeric digits (e.g. 9685232340).');
      return;
    }

    if (!address.street.trim()) {
      setError('Please enter your full doorstep address.');
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
        `🚗 *NEW DOORSTEP WASH BOOKING ALERT* 🚗\n` +
        `--------------------------------------\n` +
        `📋 *Booking ID:* ${data.booking.bookingId}\n` +
        `👤 *Customer Name:* ${customer.name}\n` +
        `📞 *Contact No:* ${cleanPhone}\n` +
        `📍 *Address:* ${address.street}${address.landmark ? ', Landmark: ' + address.landmark : ''}, ${city?.city || 'Indore'} - ${pincode}\n` +
        `🚘 *Vehicle Details:* ${vehicle?.make} ${vehicle?.model} (${vehicle?.segment?.replace('_', ' ').toUpperCase()}) [Fuel: ${vehicle?.fuelType}] ${vehicle?.plateNumber ? `[Plate: ${vehicle?.plateNumber}]` : ''}\n` +
        `📦 *Package Chosen:* ${service?.name} (₹${getTotalAmount()})\n` +
        `📅 *Slot Date:* ${scheduledDate}\n` +
        `⏰ *Time Slot:* ${timeSlot}\n` +
        `💳 *Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery (₹' + getTotalAmount() + ')' : 'Online Payment (Confirmed - ₹' + getTotalAmount() + ')'}\n` +
        `${notes ? `📝 *Special Notes:* ${notes}\n` : ''}` +
        `--------------------------------------\n` +
        `🚀 *Doorstep Car Wash Operations*`;

      const waUrl = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(waAlertMessage)}`;

      // Automatically dispatch WhatsApp alert in new tab
      try {
        if (typeof window !== 'undefined') {
          window.open(waUrl, '_blank');
        }
      } catch (waErr) {
        console.warn('Popup blocked, WhatsApp link will be provided in confirmation modal.', waErr);
      }

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#3B82F6', '#60A5FA', '#10B981'],
      });

      onBookingSuccess(data.booking.bookingId, waUrl);
    } catch (err: any) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitBooking} className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Step 5: Doorstep Address & Payment Method
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Our mobile wash van will arrive at your specified parking location in {city?.city || 'your area'}.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Customer Contact Details */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center space-x-2">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Customer Contact Details</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer({ name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mobile Number (10 Digits) *
              </label>
              <span className={`text-[10px] font-mono font-bold ${
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
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-mono tracking-wider focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email (Optional)
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ email: e.target.value })}
              placeholder="rahul@example.com"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Doorstep Parking Address</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Flat/House No, Building/Society & Street Name *
          </label>
          <input
            type="text"
            required
            value={address.street}
            onChange={(e) => setAddress({ street: e.target.value })}
            placeholder="e.g. Flat 402, Building A, Palm Heights, Off Link Road"
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              readOnly
              value={city?.city || 'Indore'}
              className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service Pincode
            </label>
            <input
              type="text"
              readOnly
              value={pincode}
              className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Landmark / Parking Slot (Optional)
            </label>
            <input
              type="text"
              value={address.landmark || ''}
              onChange={(e) => setAddress({ landmark: e.target.value })}
              placeholder="e.g. Near Gate 2 / Basement B1"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Special Instructions for Washers (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Call before arrival, park near security gate"
            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Payment Options */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Select Payment Method:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* COD */}
          <div
            onClick={() => setPaymentMethod('cod')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
              paymentMethod === 'cod'
                ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Cash on Completion
              </div>
              <div className="text-[10px] text-slate-500">
                Pay after your car is washed
              </div>
            </div>
          </div>

          {/* Razorpay Mock */}
          <div
            onClick={() => setPaymentMethod('razorpay_mock')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
              paymentMethod === 'razorpay_mock'
                ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Online Payment (UPI/Cards)
              </div>
              <div className="text-[10px] text-slate-500">
                Instant digital receipt
              </div>
            </div>
          </div>

          {/* UPI Mock */}
          <div
            onClick={() => setPaymentMethod('upi_mock')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
              paymentMethod === 'upi_mock'
                ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Scan QR (GPay / PhonePe)
              </div>
              <div className="text-[10px] text-slate-500">
                Zero convenience fee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Submit */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center space-x-2 shadow-xs disabled:opacity-50"
        >
          {loading ? (
            <span>Securing Mobile Van...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Confirm & Book Doorstep Wash (₹{getTotalAmount()})</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
