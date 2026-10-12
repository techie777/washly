'use client';

import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Navigation, 
  MapPin, 
  KeyRound, 
  CheckCircle2, 
  QrCode, 
  Banknote, 
  User, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Booking } from '@/types';

interface JrAdminFieldModalProps {
  booking: Booking;
  onClose: () => void;
  onStatusUpdated: (updatedBooking: Booking) => void;
}

export default function JrAdminFieldModal({
  booking,
  onClose,
  onStatusUpdated,
}: JrAdminFieldModalProps) {
  const [currentBooking, setCurrentBooking] = useState<Booking>(booking);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'company_qr' | 'cash'>('company_qr');

  // Trigger flow action
  const handleFlowAction = async (
    action: 'on_my_way' | 'arrived' | 'verify_otp' | 'complete_wash',
    payload?: any
  ) => {
    setLoading(true);
    setOtpError(null);

    try {
      const res = await fetch('/api/admin/orders/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          bookingId: currentBooking.bookingId,
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (action === 'verify_otp') {
          setOtpError(data.message || 'गलत OTP दर्ज किया गया!');
        } else {
          alert(data.message || 'Failed to update order flow.');
        }
        return;
      }

      if (data.booking) {
        setCurrentBooking(data.booking);
        onStatusUpdated(data.booking);
      }
    } catch (err: any) {
      alert(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const technicianName = currentBooking.assignedTechnician?.name || 'Wash Expert (Jr Admin)';
  const technicianPhone = currentBooking.assignedTechnician?.phone || '+91 98200 48822';
  const vanNo = currentBooking.assignedTechnician?.vehicleNo || 'MP 09 CW 4040';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar representing mobile field expert view */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Wash Expert Mobile App Simulator
              </div>
              <div className="text-sm font-black text-white flex items-center space-x-1.5">
                <span>{technicianName}</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                  {vanNo}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Order Summary Card */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
              #{currentBooking.bookingId}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              ₹{currentBooking.totalAmount}
            </span>
          </div>

          <div className="text-sm font-bold text-slate-100 flex items-center space-x-1">
            <span>{currentBooking.customer.name}</span>
            <span className="text-slate-400 font-normal">({currentBooking.customer.phone})</span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{currentBooking.address.street}, {currentBooking.address.city}</span>
          </p>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
            <span>🚗 {currentBooking.vehicle.make} {currentBooking.vehicle.model}</span>
            <span>•</span>
            <span className="text-blue-300 font-semibold">{currentBooking.service.name}</span>
          </div>
        </div>

        {/* Dynamic Workflow Progress Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Step Indicators */}
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
            <div className={`p-1.5 rounded-lg ${['confirmed', 'en_route', 'arrived', 'in_progress', 'completed'].includes(currentBooking.status) ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              1. Assigned
            </div>
            <div className={`p-1.5 rounded-lg ${['en_route', 'arrived', 'in_progress', 'completed'].includes(currentBooking.status) ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              2. On Way
            </div>
            <div className={`p-1.5 rounded-lg ${['arrived', 'in_progress', 'completed'].includes(currentBooking.status) ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              3. Arrived
            </div>
            <div className={`p-1.5 rounded-lg ${currentBooking.status === 'completed' ? 'bg-emerald-600 text-white' : currentBooking.status === 'in_progress' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              4. Complete
            </div>
          </div>

          {/* Action 1: When order is Confirmed / Assigned */}
          {currentBooking.status === 'confirmed' && (
            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                <Navigation className="w-4 h-4" />
                <span>Task Assigned to You</span>
              </div>
              <p className="text-xs text-slate-300">
                You have been dispatched for this booking. When ready to drive to customer address, tap below to notify customer that you are on the way.
              </p>
              <button
                onClick={() => handleFlowAction('on_my_way')}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-sm uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98"
              >
                <Navigation className="w-4 h-4" />
                <span>{loading ? 'Updating...' : 'I am on my way (रास्ते में हूँ)'}</span>
              </button>
            </div>
          )}

          {/* Action 2: When En Route */}
          {currentBooking.status === 'en_route' && (
            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>En Route to Destination</span>
              </div>
              <p className="text-xs text-slate-300">
                Customer is currently tracking your live status as &quot;On the way&quot;. Once your mobile wash van reaches customer location, tap below.
              </p>
              <button
                onClick={() => handleFlowAction('arrived')}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/30 transition-all active:scale-98"
              >
                <MapPin className="w-4 h-4" />
                <span>{loading ? 'Updating...' : 'I have arrived (पहुँच गया हूँ)'}</span>
              </button>
            </div>
          )}

          {/* Action 3: When Arrived (Must take OTP from user) */}
          {currentBooking.status === 'arrived' && (
            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Customer OTP Verification Required</span>
              </div>
              <p className="text-xs text-slate-300">
                Ask customer for their 4-digit secret Start OTP (visible on their booking confirmation &amp; &apos;My Orders&apos; page) to commence car washing.
              </p>

              {/* Admin helper note */}
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/70 text-blue-200 text-xs flex items-center justify-between">
                <span>Customer&apos;s OTP for test:</span>
                <span className="font-mono font-black text-sm bg-blue-600 text-white px-2 py-0.5 rounded">
                  {currentBooking.startOtp || '1234'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Enter 4-Digit Customer OTP:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 5829"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-600 focus:border-blue-500 text-white text-center font-mono font-black text-xl tracking-widest outline-none"
                />
                {otpError && (
                  <p className="text-rose-400 text-xs font-semibold mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => handleFlowAction('verify_otp', { otp: enteredOtp })}
                disabled={loading || enteredOtp.length !== 4}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Start Wash'}</span>
              </button>
            </div>
          )}

          {/* Action 4: Washing in progress -> Complete & Collect Payment */}
          {currentBooking.status === 'in_progress' && (
            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Washing Work In Progress</span>
              </div>
              <p className="text-xs text-slate-300">
                Eco pressure wash, foam cleaning, and interior vacuuming are ongoing at customer doorstep.
              </p>

              {/* Payment Collection Section */}
              <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Bill to Collect:</span>
                  <span className="text-emerald-400 font-black text-sm">₹{currentBooking.totalAmount}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Select Payment Mode:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('company_qr')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        paymentMode === 'company_qr'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Company UPI QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('cash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        paymentMode === 'cash'
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Direct Cash</span>
                    </button>
                  </div>
                </div>

                {paymentMode === 'company_qr' && (
                  <div className="p-3 bg-white text-slate-900 rounded-xl flex flex-col items-center text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Company Given QR Code (Indore Hub)
                    </p>
                    {/* Visual QR presentation using SVG */}
                    <div className="w-36 h-36 border-2 border-slate-900 p-2 rounded-lg bg-white flex flex-col items-center justify-center">
                      <QrCode className="w-24 h-24 text-slate-900" />
                      <span className="text-[9px] font-mono font-bold text-slate-700">doorstepwash@upi</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Show this QR to customer. Works with PhonePe, GooglePay, Paytm, BHIM.
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  handleFlowAction('complete_wash', {
                    paymentVia: paymentMode,
                    collectedBy: technicianName,
                  })
                }
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {loading ? 'Completing...' : `Wash Done & Collect ₹${currentBooking.totalAmount}`}
                </span>
              </button>
            </div>
          )}

          {/* Action 5: Completed */}
          {currentBooking.status === 'completed' && (
            <div className="bg-emerald-950/40 border border-emerald-800/80 p-5 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-white">Wash Task Completed &amp; Verified!</h4>
              <p className="text-xs text-emerald-200">
                Payment of <span className="font-bold">₹{currentBooking.totalAmount}</span> was collected via{' '}
                <span className="font-mono font-bold uppercase">{currentBooking.paymentCollectedVia || 'company_qr'}</span>{' '}
                by {currentBooking.paymentCollectedBy || technicianName}.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                Close Simulator
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
