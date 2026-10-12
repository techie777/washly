'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  PhoneCall, 
  Car, 
  AlertCircle,
  KeyRound,
  Bell,
  Sparkles
} from 'lucide-react';
import { Booking, BookingStatus } from '@/types';
import { useTranslation } from '@/lib/translations';
import { useNotificationStore } from '@/lib/store/notificationStore';

const STATUS_STAGES: Array<{ id: BookingStatus; label: string; desc: string }> = [
  { id: 'pending', label: 'Order Logged', desc: 'Request registered in system' },
  { id: 'confirmed', label: 'Van Assigned', desc: 'Mobile wash van reserved' },
  { id: 'en_route', label: 'En Route', desc: 'Van travelling to your location' },
  { id: 'arrived', label: 'Van Arrived', desc: 'Van reached, share Start OTP' },
  { id: 'in_progress', label: 'Wash In Progress', desc: 'Foam wash & interior cleaning' },
  { id: 'completed', label: 'Completed', desc: 'Spotless inspection & verified' },
];

function TrackOrderContent() {
  const { t, isHindi } = useTranslation();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';
  const { addToast } = useNotificationStore();

  const [searchCode, setSearchCode] = useState(queryId);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

  const statusStages: Array<{ id: BookingStatus; label: string; desc: string }> = isHindi
    ? [
        { id: 'pending', label: 'ऑर्डर दर्ज', desc: 'सिस्टम में अनुरोध दर्ज हुआ' },
        { id: 'confirmed', label: 'वैन असाइन', desc: 'मोबाइल वॉश वैन बुक हो गई' },
        { id: 'en_route', label: 'रास्ते में है', desc: 'वैन आपके पते की ओर निकल चुकी है' },
        { id: 'arrived', label: 'वैन पहुँच गई है', desc: 'वाश एक्सपर्ट आ चुके हैं, OTP बताएं' },
        { id: 'in_progress', label: 'धुलाई जारी है', desc: 'फोम वॉश और अंदर की सफाई' },
        { id: 'completed', label: 'सफाई पूर्ण', desc: 'गाड़ी पूरी तरह चमक गई है' },
      ]
    : STATUS_STAGES;

  const fetchBooking = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setNotFoundError(false);
    try {
      const res = await fetch(`/api/bookings/${idToFetch.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setActiveBooking(data.booking);

        if (data.booking.status === 'arrived') {
          addToast({
            title: isHindi ? '🚨 वाश एक्सपर्ट पहुँच चुके हैं!' : '🚨 Wash Expert Has Arrived!',
            message: isHindi
              ? `कृपया वाश शुरू करने के लिए अपना Start OTP ${data.booking.startOtp || '1234'} बताएं।`
              : `Please share your Start OTP ${data.booking.startOtp || '1234'} with the technician.`,
            type: 'warning',
            duration: 6000,
          });
        } else if (data.booking.status === 'en_route') {
          addToast({
            title: isHindi ? '🚗 वैन रास्ते में है' : '🚗 Van En Route',
            message: isHindi
              ? `${data.booking.assignedTechnician?.name || 'एक्सपर्ट'} आपके पते की ओर निकल चुके हैं।`
              : `${data.booking.assignedTechnician?.name || 'Technician'} is on the way to your address.`,
            type: 'info',
          });
        }
      } else {
        setActiveBooking(null);
        setNotFoundError(true);
      }
    } catch {
      setActiveBooking(null);
      setNotFoundError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      fetchBooking(queryId);
    } else {
      // Default to first active sample booking
      fetchBooking('WSH-89241');
    }
  }, [queryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooking(searchCode);
  };

  const getStageIndex = (status: BookingStatus) => {
    return statusStages.findIndex((s) => s.id === status);
  };

  const currentStageIndex = activeBooking ? getStageIndex(activeBooking.status) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-semibold mb-3">
          <Truck className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{isHindi ? 'लाइव वैन ट्रैकिंग' : 'Live Van Telematics'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          {isHindi ? 'अपनी डोरस्टेप ' : 'Track Your '} 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">{isHindi ? 'वॉश वैन ट्रैक करें' : 'Doorstep Mobile Van'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          {isHindi 
            ? 'वैन की वर्तमान स्थिति, ड्राइवर का फोन नंबर और लाइव आगमन की जानकारी।' 
            : 'Real-time status updates, assigned wash team details, and live arrival notifications.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder={isHindi ? "बुकिंग आईडी डालें (उदा. WSH-89241)" : "Enter Booking ID (e.g. WSH-89241)"}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 font-mono text-sm uppercase tracking-wider focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 font-black text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xs shrink-0 cursor-pointer"
          >
            {loading ? (isHindi ? 'खोज रहे हैं...' : 'Locating...') : (isHindi ? 'ट्रैक करें' : 'Track Van')}
          </button>
        </form>

        {/* Quick Demo links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Try Sample IDs:</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('WSH-89241');
              fetchBooking('WSH-89241');
            }}
            className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono font-semibold text-xs transition-all shadow-2xs"
          >
            WSH-89241 (In Progress)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchCode('WSH-89242');
              fetchBooking('WSH-89242');
            }}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-mono font-semibold text-xs transition-all shadow-2xs"
          >
            WSH-89242 (En Route)
          </button>
        </div>
      </div>

      {notFoundError && (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-white border border-rose-200 text-center mb-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900">Booking Not Found</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            We couldn&apos;t find an active reservation for &quot;{searchCode}&quot;. Please double check your booking code or click below to view a live demo.
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSearchCode('WSH-89241');
                fetchBooking('WSH-89241');
              }}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              Load Demo Booking (WSH-89241)
            </button>
          </div>
        </div>
      )}

      {/* Active Booking Card */}
      {activeBooking && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Critical Status Alert Banners */}
          {activeBooking.status === 'arrived' && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sm:p-5 rounded-2xl shadow-lg shadow-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-black shrink-0 shadow-sm">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg">
                    {isHindi ? '🚨 वाश एक्सपर्ट आपके पते पर पहुँच चुके हैं!' : '🚨 Wash Expert Has Arrived at Doorstep!'}
                  </h4>
                  <p className="text-xs text-amber-50 mt-0.5 font-medium">
                    {isHindi 
                      ? 'धुलाई कार्य शुरू करने के लिए कृपया अपने एक्सपर्ट को यह 4-अंकों का Start OTP बताएं:' 
                      : 'Please share your 4-digit security Start OTP with the technician to initiate washing:'}
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/40 text-center shrink-0 self-center sm:self-auto">
                <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-100">
                  {isHindi ? 'वॉश स्टार्ट OTP' : 'Start Wash OTP'}
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-widest">
                  {activeBooking.startOtp || '1234'}
                </span>
              </div>
            </div>
          )}

          {activeBooking.status === 'en_route' && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-400/40 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-300">
                    {isHindi ? '🚗 वाश वैन आपके पते की ओर निकल चुकी है' : '🚗 Mobile Wash Van is On The Way'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {activeBooking.assignedTechnician?.name || 'Wash Expert'} ({activeBooking.assignedTechnician?.vehicleNo || 'Van'}) 
                    {isHindi ? ' कुछ ही समय में आपके पते पर पहुँच रहे हैं।' : ' is heading to your doorstep.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Tracker Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-6">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {activeBooking.bookingId}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    activeBooking.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : activeBooking.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                      : activeBooking.status === 'arrived'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : activeBooking.status === 'en_route'
                      ? 'bg-slate-950 text-amber-400 border-amber-400/40'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {activeBooking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi ? 'ग्राहक:' : 'Customer:'} <span className="font-semibold text-slate-700">{activeBooking.customer.name}</span> • {activeBooking.scheduledDate} ({activeBooking.timeSlot})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400">{isHindi ? 'कुल राशि:' : 'Total Wash Amount:'}</div>
                <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline sm:justify-end space-x-1">
                  <span className="text-sm font-bold text-amber-600">₹</span>
                  <span>{activeBooking.totalAmount}</span>
                  <span className="text-[11px] text-emerald-600 uppercase font-bold ml-1">
                    ({activeBooking.paymentStatus === 'paid' ? (isHindi ? 'सफल' : 'Paid') : (isHindi ? 'बकाया' : 'Pending')})
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Stage Visual Progress Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative">
              {statusStages.map((stg, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div 
                    key={stg.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-400'
                        : isPassed
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-slate-50/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {isHindi ? `चरण 0${idx + 1}` : `STAGE 0${idx + 1}`}
                      </span>
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <h5 className={`text-xs font-bold ${
                      isCurrent ? 'text-amber-900' : isPassed ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {stg.label}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {stg.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Start OTP Banner for Customer */}
          {activeBooking.startOtp && ['confirmed', 'en_route', 'arrived'].includes(activeBooking.status) && (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-950">
                    {isHindi ? 'कार धुलाई शुरू करने का 4-अंकों का OTP:' : 'Secure 4-Digit Wash Start OTP:'}
                  </h4>
                  <p className="text-xs text-amber-800">
                    {isHindi
                      ? 'जब वाश एक्सपर्ट आपके पते पर पहुँचे, धुलाई शुरू करवाने हेतु यह OTP उन्हें बताएं।'
                      : 'Provide this OTP to your Wash Expert upon arrival at your doorstep to start service.'}
                  </p>
                </div>
              </div>
              <div className="font-mono text-2xl font-black text-amber-950 bg-white border-2 border-amber-400 px-5 py-2 rounded-xl tracking-widest text-center shadow-sm">
                {activeBooking.startOtp}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Assigned Mobile Unit & Technician */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'असाइंड मोबाइल वैन' : 'Assigned Mobile Van'}</span>
              </div>

              {activeBooking.assignedTechnician ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-950 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-base">
                      {activeBooking.assignedTechnician.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {activeBooking.assignedTechnician.name}
                      </h4>
                      <div className="text-xs text-amber-500 font-semibold">
                        ★ {activeBooking.assignedTechnician.rating} {isHindi ? 'सत्यापित एक्सपर्ट' : 'Verified Washer'}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div>{isHindi ? 'वैन नंबर:' : 'Van Reg:'} <span className="text-slate-900 font-bold">{activeBooking.assignedTechnician.vehicleNo}</span></div>
                    <div>GPS: <span className="text-emerald-600 font-semibold">{isHindi ? 'लाइव कनेक्टेड' : 'Live Connected'}</span></div>
                  </div>

                  <a
                    href={`tel:${activeBooking.assignedTechnician.phone}`}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/30 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'ड्राइवर को कॉल करें' : 'Call Washer'}</span>
                  </a>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  {isHindi ? 'नजदीकी उपलब्ध वैन आवंटित की जा रही है...' : 'Dispatch system allocating nearest available wash van...'}
                </div>
              )}
            </div>

            {/* Vehicle & Service Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Car className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'गाड़ी और पैकेज' : 'Vehicle & Package'}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {activeBooking.vehicle.make} {activeBooking.vehicle.model}
                </h4>
                <div className="text-xs text-slate-500 capitalize">
                  {activeBooking.vehicle.segment.replace('_', ' ')} • {activeBooking.vehicle.plateNumber || (isHindi ? 'नंबर उपलब्ध नहीं' : 'No Plate Provided')}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">
                  {isHindi ? (
                    (activeBooking.service.name.toLowerCase().includes('complete') || activeBooking.service.name.toLowerCase().includes('vacuum'))
                      ? 'कम्प्लीट लग्जरी वॉश + इंटीरियर वैक्यूम + रोटेटर शाइन'
                      : activeBooking.service.name.toLowerCase().includes('rotator')
                      ? 'प्रेशर वॉश + शैम्पू व रोटेटर शाइन'
                      : activeBooking.service.name.toLowerCase().includes('pressure')
                      ? 'कार प्रेशर वॉश'
                      : activeBooking.service.name.toLowerCase().includes('bucket')
                      ? 'कार बकेट वॉश'
                      : activeBooking.service.name
                  ) : activeBooking.service.name}
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {isHindi ? 'समय:' : 'Duration:'} {activeBooking.service.durationMinutes} {isHindi ? 'मिनट' : 'mins'}
                </div>
              </div>

              {activeBooking.selectedAddOns.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    {isHindi ? 'अतिरिक्त सेवाएं:' : 'Add-Ons:'}
                  </span>
                  {activeBooking.selectedAddOns.map((a) => (
                    <div key={a.id} className="text-[11px] text-slate-700 font-medium">
                      • {a.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Doorstep Destination */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Doorstep Address</span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {activeBooking.address.street}
              </p>

              <div className="text-xs text-slate-500">
                {activeBooking.address.city} • Pincode: <span className="font-mono font-bold text-slate-800">{activeBooking.address.pincode}</span>
              </div>

              {activeBooking.address.landmark && (
                <div className="text-[11px] text-slate-600 pt-1">
                  Landmark: <span className="text-amber-800 font-semibold">{activeBooking.address.landmark}</span>
                </div>
              )}

              {activeBooking.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mt-2">
                  Note: &ldquo;{activeBooking.notes}&rdquo;
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Suspense fallback={
        <div className="max-w-md mx-auto p-12 text-center text-slate-400 text-xs">
          Loading live telematics tracker...
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
