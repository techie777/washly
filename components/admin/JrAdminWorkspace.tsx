'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  KeyRound, 
  QrCode, 
  Banknote, 
  LogOut, 
  Sparkles, 
  Navigation, 
  ExternalLink,
  AlertCircle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Booking, JrAdmin } from '@/types';
import { AdminAuthSession } from './AdminLoginView';
import { useNotificationStore } from '@/lib/store/notificationStore';
import ToastContainer from '@/components/ui/ToastContainer';

interface JrAdminWorkspaceProps {
  session: AdminAuthSession;
  bookings: Booking[];
  jrAdmins: JrAdmin[];
  onOrderUpdated: (updatedBooking: Booking) => void;
  onLogout: () => void;
}

export default function JrAdminWorkspace({
  session,
  bookings,
  jrAdmins,
  onOrderUpdated,
  onLogout,
}: JrAdminWorkspaceProps) {
  const { addToast } = useNotificationStore();
  const currentJr = jrAdmins.find((j) => j.id === session.user.id || j.name === session.user.name) || {
    id: session.user.id || 'jr-1',
    name: session.user.name,
    phone: session.user.phone || '9685232340',
    vehicleNo: session.user.vehicleNo || 'MP 09 AB 7890 (Mobile Unit)',
    rating: session.user.rating || 4.97,
    status: 'active' as const,
    totalJobs: session.user.totalJobs || 0,
    pin: '1234',
    joinedDate: '2025-01-01',
  };

  const [enteredOtp, setEnteredOtp] = useState<{ [bookingId: string]: string }>({});
  const [otpError, setOtpError] = useState<{ [bookingId: string]: string | null }>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<{ [bookingId: string]: 'company_qr' | 'cash' }>({});
  const [activeTab, setActiveTab] = useState<'assigned' | 'completed' | 'all'>('assigned');

  // Filter bookings assigned to this Jr Admin
  const myAssignedBookings = bookings.filter(
    (b) =>
      b.assignedTechnician?.name === currentJr.name ||
      b.assignedTechnician?.phone === currentJr.phone ||
      b.assignedTechnician?.vehicleNo === currentJr.vehicleNo ||
      b.assignedTechnician?.id === currentJr.id
  );

  // Flow action trigger
  const handleFlowAction = async (
    bookingId: string,
    action: 'on_my_way' | 'arrived' | 'verify_otp' | 'complete_wash',
    payload?: any
  ) => {
    setLoadingId(bookingId);
    setOtpError((prev) => ({ ...prev, [bookingId]: null }));

    try {
      const res = await fetch('/api/admin/orders/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          bookingId,
          collectedBy: currentJr.name,
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (action === 'verify_otp') {
          setOtpError((prev) => ({
            ...prev,
            [bookingId]: data.message || 'गलत OTP दर्ज किया गया!',
          }));
        } else {
          alert(data.message || 'Failed to update status.');
        }
        return;
      }

      if (data.booking) {
        onOrderUpdated(data.booking);

        if (action === 'on_my_way') {
          addToast({
            title: '🚗 Status Updated: En Route',
            message: `Heading to ${data.booking.customer.name}'s location (${data.booking.address.street}). Customer notified!`,
            type: 'info',
          });
        } else if (action === 'arrived') {
          addToast({
            title: '📍 Arrived at Customer Doorstep',
            message: `Please ask ${data.booking.customer.name} for their 4-digit Start OTP to begin wash.`,
            type: 'warning',
          });
        } else if (action === 'verify_otp') {
          addToast({
            title: '✨ OTP Verified & Wash Started',
            message: 'Start OTP matched! Proceed with complete vehicle wash.',
            type: 'success',
          });
        } else if (action === 'complete_wash') {
          addToast({
            title: '✅ Wash Completed & Payment Collected',
            message: `₹${data.booking.totalAmount} collected via ${payload?.paymentMode === 'company_qr' ? 'UPI QR' : 'Cash'}. Job completed!`,
            type: 'success',
          });
        }
      }
    } catch (err: any) {
      alert(err.message || 'Network error');
    } finally {
      setLoadingId(null);
    }
  };

  const displayedBookings =
    activeTab === 'assigned'
      ? myAssignedBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled')
      : activeTab === 'completed'
      ? myAssignedBookings.filter((b) => b.status === 'completed')
      : myAssignedBookings;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16 relative">
      <ToastContainer />
      {/* Mobile-Friendly Top Bar */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center space-x-2">
                <span>{currentJr.name}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono">
                  Wash Expert
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                <span>{currentJr.vehicleNo}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">★ {currentJr.rating}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Active
            </div>
            <div className="text-xl font-black text-blue-400 mt-0.5">
              {myAssignedBookings.filter((b) => b.status !== 'completed').length}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Completed Jobs
            </div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {myAssignedBookings.filter((b) => b.status === 'completed').length + (currentJr.totalJobs || 0)}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CSAT Score
            </div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {currentJr.rating} / 5.0
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'assigned'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Tasks ({myAssignedBookings.filter((b) => b.status !== 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Finished Jobs ({myAssignedBookings.filter((b) => b.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Bookings ({myAssignedBookings.length})
          </button>
        </div>

        {/* Assigned Bookings List */}
        {displayedBookings.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-base font-bold text-slate-200">No tasks in this list</h4>
            <p className="text-xs text-slate-400">
              When Super Admin assigns you a new doorstep wash task, it will instantly appear here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedBookings.map((b) => {
              const bOtp = enteredOtp[b.bookingId] || '';
              const bError = otpError[b.bookingId];
              const mode = paymentMode[b.bookingId] || 'company_qr';
              const isBusy = loadingId === b.bookingId;

              return (
                <div
                  key={b.bookingId}
                  className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl"
                >
                  {/* Row 1: Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/70 border border-blue-800 px-2.5 py-1 rounded-lg">
                        #{b.bookingId}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                            : b.status === 'en_route'
                            ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700 animate-pulse'
                            : b.status === 'arrived'
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                            : b.status === 'in_progress'
                            ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                            : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                        }`}
                      >
                        {b.status === 'confirmed'
                          ? 'Assigned to You'
                          : b.status === 'en_route'
                          ? 'On My Way (रास्ते में)'
                          : b.status === 'arrived'
                          ? 'Arrived (Take OTP)'
                          : b.status === 'in_progress'
                          ? 'Washing In Progress'
                          : 'Completed'}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-emerald-400">₹{b.totalAmount}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">
                        {b.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Customer & Vehicle Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Customer &amp; Location
                      </div>
                      <div className="font-bold text-slate-100 text-sm">{b.customer.name}</div>
                      <a
                        href={`tel:${b.customer.phone}`}
                        className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-mono font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>+91 {b.customer.phone}</span>
                      </a>
                      <div className="text-slate-300 flex items-start space-x-1 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{b.address.street}, {b.address.city} - {b.address.pincode}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Vehicle &amp; Service Package
                      </div>
                      <div className="font-bold text-slate-100 text-sm">
                        🚗 {b.vehicle.make} {b.vehicle.model}
                      </div>
                      <div className="text-slate-400 text-xs">
                        Segment: <span className="text-slate-200 uppercase font-mono">{b.vehicle.segment}</span>
                      </div>
                      <div className="text-blue-300 font-semibold">{b.service.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-0.5">
                        <span>📅 {b.scheduledDate}</span>
                        <span>⏰ {b.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Action Panel */}
                  <div className="pt-3 border-t border-slate-700/80 space-y-3">
                    {/* Stage 1: When Confirmed -> Move to "I am on my way" */}
                    {b.status === 'confirmed' && (
                      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-2.5">
                        <div className="text-xs text-slate-300">
                          Ready to leave? Tap below to notify customer you are en route.
                        </div>
                        <button
                          onClick={() => handleFlowAction(b.bookingId, 'on_my_way')}
                          disabled={isBusy}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>{isBusy ? 'Updating...' : 'I am on my way (रास्ते में हूँ)'}</span>
                        </button>
                      </div>
                    )}

                    {/* Stage 2: When En Route -> Move to "I have arrived" */}
                    {b.status === 'en_route' && (
                      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-2.5">
                        <div className="text-xs text-slate-300">
                          Reached customer location? Tap below to notify customer you have arrived.
                        </div>
                        <button
                          onClick={() => handleFlowAction(b.bookingId, 'arrived')}
                          disabled={isBusy}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/30 transition-all active:scale-98"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>{isBusy ? 'Updating...' : 'I have arrived (पहुँच गया हूँ)'}</span>
                        </button>
                      </div>
                    )}

                    {/* Stage 3: When Arrived -> Take OTP from user & Start Wash */}
                    {b.status === 'arrived' && (
                      <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/40 space-y-3">
                        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                          <KeyRound className="w-4 h-4" />
                          <span>Ask customer for their 4-digit Start OTP:</span>
                        </div>

                        <div>
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="e.g. 5829"
                            value={bOtp}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setEnteredOtp((prev) => ({ ...prev, [b.bookingId]: val }));
                            }}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center font-mono font-black text-xl text-white tracking-widest outline-none focus:border-amber-500"
                          />
                          {bError && (
                            <p className="text-rose-400 text-xs font-semibold mt-1 flex items-center space-x-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{bError}</span>
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleFlowAction(b.bookingId, 'verify_otp', { otp: bOtp })}
                          disabled={isBusy || bOtp.length !== 4}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>{isBusy ? 'Verifying OTP...' : 'Verify OTP & Start Washing'}</span>
                        </button>
                      </div>
                    )}

                    {/* Stage 4: Washing in progress -> Complete & Collect Payment */}
                    {b.status === 'in_progress' && (
                      <div className="p-4 bg-slate-900/90 rounded-2xl border border-purple-500/40 space-y-4">
                        <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Washing Ongoing at Customer Doorstep</span>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-400">Amount to Collect:</span>
                            <span className="text-emerald-400 text-sm">₹{b.totalAmount}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setPaymentMode((prev) => ({ ...prev, [b.bookingId]: 'company_qr' }))
                              }
                              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                                mode === 'company_qr'
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <QrCode className="w-4 h-4" />
                              <span>Company UPI QR</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPaymentMode((prev) => ({ ...prev, [b.bookingId]: 'cash' }))
                              }
                              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                                mode === 'cash'
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <Banknote className="w-4 h-4" />
                              <span>Cash Collected</span>
                            </button>
                          </div>

                          {mode === 'company_qr' && (
                            <div className="p-3 bg-white text-slate-900 rounded-xl flex flex-col items-center text-center space-y-1.5 mt-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Doorstep Car Wash Company UPI QR
                              </span>
                              <div className="w-32 h-32 border border-slate-300 p-2 rounded-lg bg-white flex flex-col items-center justify-center">
                                <QrCode className="w-24 h-24 text-slate-900" />
                                <span className="text-[9px] font-mono font-bold text-slate-700">
                                  doorstepwash@upi
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500">
                                Customer can scan via PhonePe, GooglePay, Paytm, BHIM
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleFlowAction(b.bookingId, 'complete_wash', {
                              paymentVia: mode,
                            })
                          }
                          disabled={isBusy}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {isBusy
                              ? 'Saving...'
                              : `Wash Done & Collect ₹${b.totalAmount}`}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Stage 5: Completed */}
                    {b.status === 'completed' && (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          Wash Completed! Payment collected via{' '}
                          <span className="uppercase">{b.paymentCollectedVia || 'company_qr'}</span>.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
