'use client';

import React, { useState, useEffect } from 'react';
import {
  Car, Bike, Check, Sparkles, Calendar, Clock,
  MapPin, User, CreditCard, Banknote, QrCode,
  AlertCircle, CheckCircle2, ArrowRight, ArrowLeft,
  Droplets, Zap, ShieldCheck, Phone, Edit3
} from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { POPULAR_VEHICLES, LUXURY_SERVICES } from '@/lib/seedData';
import { VehicleType, VehicleSegment } from '@/types';
import { useTranslation } from '@/lib/translations';
import { useAuthStore } from '@/lib/store/authStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { openWhatsAppOrder } from '@/lib/whatsapp';

interface QuickBookFormProps {
  onBookingSuccess: (bookingId: string) => void;
}

const TIME_SLOTS = [
  { slot: '08:00 AM - 10:00 AM', emoji: '🌅', labelEn: 'Morning (8 - 10 AM)', labelHi: 'सुबह 8 - 10' },
  { slot: '10:00 AM - 12:00 PM', emoji: '☀️', labelEn: 'Mid-Morning (10 - 12 PM)', labelHi: 'मध्य सुबह 10 - 12' },
  { slot: '12:00 PM - 02:00 PM', emoji: '🌤️', labelEn: 'Afternoon (12 - 2 PM)', labelHi: 'दोपहर 12 - 2' },
  { slot: '02:00 PM - 04:00 PM', emoji: '⛅', labelEn: 'Late Noon (2 - 4 PM)', labelHi: 'शाम से पहले 2 - 4' },
  { slot: '04:00 PM - 06:00 PM', emoji: '🌆', labelEn: 'Evening (4 - 6 PM)', labelHi: 'शाम 4 - 6' },
  { slot: '06:00 PM - 08:00 PM', emoji: '🌙', labelEn: 'Sunset (6 - 8 PM)', labelHi: 'संध्या 6 - 8' },
];

const CAR_SEGMENTS: { seg: VehicleSegment; titleEn: string; titleHi: string; icon: string; examples: string }[] = [
  { seg: 'hatchback', titleEn: 'Hatchback', titleHi: 'हैचबैक', icon: '🚗', examples: 'Swift, i20, WagonR, Baleno' },
  { seg: 'sedan', titleEn: 'Sedan', titleHi: 'सेडान', icon: '🏎️', examples: 'City, Verna, Dzire, Slavia' },
  { seg: 'compact_suv', titleEn: 'Compact SUV', titleHi: 'कॉम्पैक्ट SUV', icon: '🚙', examples: 'Creta, Brezza, Nexon, Seltos' },
  { seg: 'suv', titleEn: 'Full SUV', titleHi: 'बड़ी SUV', icon: '🛞', examples: 'Fortuner, Scorpio, Thar, XUV700' },
  { seg: 'luxury', titleEn: 'Luxury', titleHi: 'लक्ज़री', icon: '✨', examples: 'BMW, Audi, Mercedes, Jaguar' },
];

const BIKE_SEGMENTS: { seg: VehicleSegment; titleEn: string; titleHi: string; icon: string; examples: string }[] = [
  { seg: 'commuter', titleEn: 'Daily Commuter', titleHi: 'कम्यूटर / स्कूटर', icon: '🛵', examples: 'Splendor, Activa, Jupiter, Shine' },
  { seg: 'sports_superbike', titleEn: 'Cruiser / Superbike', titleHi: 'क्रूजर / स्पोर्ट्स', icon: '🏍️', examples: 'Classic 350, Hunter, KTM, Dominar' },
];

const DEFAULT_SEGMENT_MODELS: Record<VehicleSegment, { make: string; model: string }> = {
  hatchback: { make: 'Maruti Suzuki', model: 'Swift' },
  sedan: { make: 'Honda', model: 'City' },
  compact_suv: { make: 'Hyundai', model: 'Creta' },
  suv: { make: 'Mahindra', model: 'Scorpio' },
  luxury: { make: 'BMW', model: '3 Series' },
  commuter: { make: 'Honda', model: 'Activa 6G' },
  sports_superbike: { make: 'Royal Enfield', model: 'Classic 350' },
};

const POPULAR_CAR_CHIPS = [
  { name: 'Swift', make: 'Maruti Suzuki', model: 'Swift', seg: 'hatchback' as VehicleSegment },
  { name: 'Creta', make: 'Hyundai', model: 'Creta', seg: 'compact_suv' as VehicleSegment },
  { name: 'Nexon', make: 'Tata', model: 'Nexon', seg: 'compact_suv' as VehicleSegment },
  { name: 'Brezza', make: 'Maruti Suzuki', model: 'Brezza', seg: 'compact_suv' as VehicleSegment },
  { name: 'Thar', make: 'Mahindra', model: 'Thar', seg: 'suv' as VehicleSegment },
  { name: 'Fortuner', make: 'Toyota', model: 'Fortuner', seg: 'suv' as VehicleSegment },
  { name: 'City', make: 'Honda', model: 'City', seg: 'sedan' as VehicleSegment },
  { name: 'Baleno', make: 'Maruti Suzuki', model: 'Baleno', seg: 'hatchback' as VehicleSegment },
  { name: 'Scorpio', make: 'Mahindra', model: 'Scorpio', seg: 'suv' as VehicleSegment },
];

const POPULAR_BIKE_CHIPS = [
  { name: 'Classic 350', make: 'Royal Enfield', model: 'Classic 350', seg: 'sports_superbike' as VehicleSegment },
  { name: 'Activa', make: 'Honda', model: 'Activa 6G', seg: 'commuter' as VehicleSegment },
  { name: 'Splendor', make: 'Hero', model: 'Splendor Plus', seg: 'commuter' as VehicleSegment },
  { name: 'Jupiter', make: 'TVS', model: 'Jupiter', seg: 'commuter' as VehicleSegment },
  { name: 'Hunter 350', make: 'Royal Enfield', model: 'Hunter 350', seg: 'sports_superbike' as VehicleSegment },
];

const INDORE_PINCODES = [
  { pin: '452010', area: 'Vijay Nagar' },
  { pin: '452001', area: 'Palasia' },
  { pin: '452011', area: 'Scheme 54' },
  { pin: '452016', area: 'Super Corridor' },
  { pin: '452002', area: 'Rajwada' },
  { pin: '452012', area: 'Bhawarkua' },
];

export default function QuickBookForm({ onBookingSuccess }: QuickBookFormProps) {
  const { isHindi } = useTranslation();
  const { user: authUser, login: authLogin } = useAuthStore();
  const { addToast } = useNotificationStore();

  const {
    step, setStep,
    vehicle, setVehicle, service, setService, availableServices, setAvailableServices,
    pincode, setPincode, scheduledDate, timeSlot, setSchedule,
    customer, setCustomer, address, setAddress, paymentMethod, setPaymentMethod,
    notes, setNotes, getTotalAmount, getBasePrice,
  } = useBookingStore();

  // Prefill customer details from authenticated user
  useEffect(() => {
    if (authUser?.phone && !customer.phone) {
      setCustomer({
        name: authUser.name || customer.name,
        phone: authUser.phone,
        email: authUser.email || customer.email,
      });
    }
  }, [authUser, customer.phone, customer.name, customer.email, setCustomer]);

  const [vehicleType, setVehicleType] = useState<VehicleType>(vehicle?.type || 'car');
  const [make, setMake] = useState(vehicle?.make || 'Maruti Suzuki');
  const [model, setModel] = useState(vehicle?.model || 'Swift');
  const [segment, setSegment] = useState<VehicleSegment>(vehicle?.segment || 'hatchback');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>(vehicle?.fuelType || 'petrol');
  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '');
  const [isEditingVehicleCustom, setIsEditingVehicleCustom] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasWaterElectricity, setHasWaterElectricity] = useState<boolean>(true);

  // Top anchor ref for instant/smooth scrolling to top of wizard on step transitions
  const topAnchorRef = React.useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      topAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToStep = (newStep: number) => {
    setStep(newStep);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      topAnchorRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  };

  // Automatically scroll to top whenever step changes
  useEffect(() => {
    scrollToTop();
  }, [step]);

  // Sync store vehicle
  useEffect(() => {
    setVehicle({
      type: vehicleType,
      make: make.trim() || 'Other',
      model: model.trim() || 'Custom',
      segment,
      fuelType,
      plateNumber,
    });
  }, [vehicleType, make, model, segment, fuelType, plateNumber, setVehicle]);

  // Fetch updated packages
  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.services?.length) setAvailableServices(data.services);
      })
      .catch(() => {});
  }, [setAvailableServices]);

  const servicesList = availableServices?.length ? availableServices : LUXURY_SERVICES;
  const filteredServices = servicesList.filter((s) => s.category === vehicleType);

  // Auto-select first matching service if needed
  useEffect(() => {
    if (!service || service.category !== vehicleType) {
      const match = filteredServices[0];
      if (match) setService(match);
    }
  }, [vehicleType, filteredServices, service, setService]);

  // Handle Preset Quick Chip click
  const handleQuickChip = (chip: typeof POPULAR_CAR_CHIPS[0]) => {
    setMake(chip.make);
    setModel(chip.model);
    setSegment(chip.seg);
    setIsEditingVehicleCustom(false);
  };

  // Date options
  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? (isHindi ? 'कल' : 'Tomorrow') : d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric' });
    return { iso, dayName, monthDay };
  });

  // Step Validations
  const validateStep1 = () => {
    if (!make.trim() || !model.trim()) {
      setError(isHindi ? 'कृपया अपनी गाड़ी चुनें या नाम लिखें।' : 'Please choose or enter your vehicle.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!service) {
      setError(isHindi ? 'कृपया वॉश सर्विस पैकेज चुनें।' : 'Please choose a wash package.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!customer.name.trim()) {
      setError(isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return false;
    }
    const cleanPhone = customer.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError(isHindi ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!address.street.trim() || address.street.trim().length < 4) {
      setError(isHindi ? 'कृपया अपना पूरा पता (मकान/फ्लैट नं. व सोसायटी) दर्ज करें।' : 'Please enter your doorstep address.');
      return false;
    }
    if (!pincode || pincode.length !== 6) {
      setError(isHindi ? 'कृपया 6 अंकों का पिनकोड चुनें।' : 'Please select Indore pincode.');
      return false;
    }
    setError(null);
    return true;
  };

  // Final Order Submit & WhatsApp Trigger
  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    const cleanPhone = customer.phone.replace(/\D/g, '').slice(-10);
    setLoading(true);
    setError(null);

    try {
      const v = {
        type: vehicleType,
        make: make.trim() || 'Other',
        model: model.trim() || 'Custom',
        segment,
        plateNumber: plateNumber.trim().toUpperCase(),
        fuelType
      };
      setVehicle(v);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { ...customer, phone: cleanPhone },
          vehicle: v,
          service,
          selectedAddOns: [],
          scheduledDate,
          timeSlot,
          address: { ...address, city: 'Indore', pincode },
          status: 'confirmed',
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          totalAmount: getTotalAmount(),
          notes,
          hasWaterElectricity: true
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');

      // 1. Auto-login customer
      authLogin({
        name: customer.name.trim(),
        phone: cleanPhone,
        email: customer.email?.trim() || '',
        pin: '1234',
        createdAt: new Date().toISOString(),
      });

      // 2. Persist recent booking ID
      try {
        localStorage.setItem('doorstep_last_booking_id', data.booking.bookingId);
        localStorage.setItem('doorstep_last_customer_phone', cleanPhone);
        const existing = JSON.parse(localStorage.getItem('doorstep_recent_bookings') || '[]');
        const updated = Array.from(new Set([data.booking.bookingId, ...existing]));
        localStorage.setItem('doorstep_recent_bookings', JSON.stringify(updated));
      } catch (storageErr) {
        console.warn('Storage error', storageErr);
      }

      // 3. Toast
      addToast({
        title: isHindi ? 'बुकिंग कन्फर्म हो गई!' : 'Booking Confirmed!',
        message: `${isHindi ? 'बुकिंग आईडी:' : 'Booking ID:'} #${data.booking.bookingId}`,
        type: 'success',
        duration: 5000,
        bookingId: data.booking.bookingId,
      });

      // 4. Trigger WhatsApp Order Message immediately
      try {
        const fullAddress = `${address.street}${address.landmark ? ', ' + address.landmark : ''}, Indore - ${pincode}`;
        openWhatsAppOrder({
          bookingId: data.booking.bookingId,
          serviceName: service?.name || 'Doorstep Wash',
          price: getTotalAmount(),
          vehicleType,
          vehicleModel: `${v.make} ${v.model} (${v.segment.replace('_', ' ').toUpperCase()})`,
          customerName: customer.name.trim(),
          phone: cleanPhone,
          address: fullAddress,
          date: scheduledDate,
          slot: timeSlot,
          paymentMethod,
          notes,
          isHindi,
        });
      } catch (waErr) {
        console.warn('WhatsApp launch error', waErr);
      }

      onBookingSuccess(data.booking.bookingId);
    } catch (err: any) {
      setError(err.message || 'Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: isHindi ? '1. कार' : '1. Vehicle', icon: '🚗' },
    { num: 2, label: isHindi ? '2. पैकेज' : '2. Wash', icon: '🧽' },
    { num: 3, label: isHindi ? '3. पता' : '3. Slot & Address', icon: '📅' },
    { num: 4, label: isHindi ? '4. रिव्यू' : '4. Review & Pay', icon: '💳' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Invisible anchor for precise scroll-to-top on step transitions */}
      <div ref={topAnchorRef} id="booking-top-anchor" className="scroll-mt-32 -translate-y-8" />

      {/* ========================================================
          SLEEK FLOATING PROGRESS STEPPER
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-200/80 shadow-[0_4px_25px_rgba(245,158,11,0.08)]">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
          {stepsList.map((s) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < step) goToStep(s.num);
                  else if (s.num === 2 && validateStep1()) goToStep(2);
                  else if (s.num === 3 && validateStep1() && validateStep2()) goToStep(3);
                  else if (s.num === 4 && validateStep1() && validateStep2() && validateStep3()) goToStep(4);
                }}
                className={`py-2 px-1 sm:py-2.5 sm:px-2 rounded-xl sm:rounded-2xl text-center flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-950 text-amber-400 font-extrabold shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50 scale-[1.02] border border-amber-400/40'
                    : isCompleted
                    ? 'bg-amber-50 text-amber-900 border border-amber-300/80 font-bold hover:bg-amber-100/60'
                    : 'bg-slate-50/80 text-slate-400 hover:text-slate-600 border border-slate-100 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="text-xs sm:text-sm">{isCompleted ? '✓' : s.icon}</span>
                  <span className="text-[11px] sm:text-xs font-bold truncate">{s.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Multi-color Progress Track */}
        <div className="w-full bg-slate-100/90 h-2 rounded-full overflow-hidden mt-2.5 sm:mt-3 p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 h-full transition-all duration-500 rounded-full shadow-xs"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700 font-semibold animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-rose-500 font-bold px-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* ========================================================
          STEP 1: APNI CAR SELECT KARE (VISUAL VEHICLE SELECTOR)
         ======================================================== */}
      {step === 1 && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-200/80 shadow-[0_10px_35px_rgba(245,158,11,0.06)] overflow-hidden p-5 sm:p-7 space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-amber-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🚗</span>
                <span>{isHindi ? 'अपनी गाड़ी का चयन करें' : 'Select Your Vehicle'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? 'बॉडी टाइप या मॉडल पर क्लिक करें' : 'Choose body segment or tap popular vehicle'}
              </p>
            </div>

            {/* Car / Bike toggle pills */}
            <div className="flex p-1 rounded-xl bg-slate-100/80 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setVehicleType('car');
                  setSegment('hatchback');
                  setMake('Maruti Suzuki');
                  setModel('Swift');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vehicleType === 'car'
                    ? 'bg-slate-950 text-amber-400 border border-amber-400/40 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚗 कार
              </button>
              <button
                type="button"
                onClick={() => {
                  setVehicleType('bike');
                  setSegment('commuter');
                  setMake('Hero');
                  setModel('Splendor');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  vehicleType === 'bike'
                    ? 'bg-slate-950 text-amber-400 border border-amber-400/40 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏍️ बाइक
              </button>
            </div>
          </div>

          {/* 1. VISUAL SEGMENT CARDS */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{isHindi ? 'बॉडी टाइप (साइज चुनें):' : 'Select Vehicle Segment:'}</span>
              <span className="text-[10px] text-amber-700 font-bold">1-Tap Fast Selection</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(vehicleType === 'car' ? CAR_SEGMENTS : BIKE_SEGMENTS).map((item) => {
                const isSel = segment === item.seg;
                return (
                  <button
                    key={item.seg}
                    type="button"
                    onClick={() => {
                      setSegment(item.seg);
                      if (!isEditingVehicleCustom) {
                        const def = DEFAULT_SEGMENT_MODELS[item.seg];
                        if (def) {
                          setMake(def.make);
                          setModel(def.model);
                        }
                      }
                    }}
                    className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSel
                        ? 'bg-gradient-to-b from-amber-50/90 via-amber-50/40 to-white border-amber-500 ring-4 ring-amber-400/20 shadow-md shadow-amber-500/10'
                        : 'bg-white border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSel ? 'bg-slate-950 border-amber-500 text-amber-400' : 'border-slate-300'
                      }`}>
                        {isSel && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">
                        {isHindi ? item.titleHi : item.titleEn}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {item.examples}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. POPULAR 1-TAP CAR CHIPS */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isHindi ? 'लोकप्रिय गाड़ियाँ (तुरंत चुनें):' : 'Popular in Indore (1-Tap Select):'}
            </div>

            <div className="flex flex-wrap gap-2">
              {(vehicleType === 'car' ? POPULAR_CAR_CHIPS : POPULAR_BIKE_CHIPS).map((chip) => {
                const isSelected = model.toLowerCase().includes(chip.name.toLowerCase());
                return (
                  <button
                    key={chip.name}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-xs scale-105 font-bold'
                        : 'bg-white text-slate-700 border-slate-200/90 hover:border-amber-400 hover:text-amber-900 hover:bg-amber-50/50 shadow-2xs'
                    }`}
                  >
                    {chip.name}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsEditingVehicleCustom((v) => !v)}
                className="px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-amber-400 text-amber-800 hover:bg-amber-50 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isHindi ? 'अन्य गाड़ी...' : '+ Other...'}</span>
              </button>
            </div>
          </div>

          {/* Optional Custom Input if user clicked "+ Other..." */}
          {isEditingVehicleCustom && (
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2.5 animate-fade-in">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    {isHindi ? 'ब्रांड (कंपनी)' : 'Make / Brand'}
                  </label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Maruti, Hyundai, Tata"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    {isHindi ? 'मॉडल का नाम' : 'Model Name'}
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Creta, Swift, Nexon"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  {isHindi ? 'नंबर प्लेट (वैकल्पिक)' : 'Vehicle Plate No. (Optional)'}
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  placeholder="MP 09 AB 1234"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
          )}

          {/* 3. ACTIVE SELECTED VEHICLE PASS */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-slate-900/5 border border-amber-300/80 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-400/30 text-amber-400 flex items-center justify-center text-lg font-black shrink-0 shadow-md shadow-amber-500/20">
                {vehicleType === 'car' ? '🚗' : '🏍️'}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900">
                  {make} {model}
                </div>
                <div className="text-[11px] text-amber-800 font-bold capitalize">
                  {segment.replace('_', ' ').toUpperCase()} • {fuelType.toUpperCase()}
                  {plateNumber && ` • ${plateNumber}`}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {isHindi ? 'चयनित ✓' : 'Selected ✓'}
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) goToStep(2);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 cursor-pointer"
          >
            <span>{isHindi ? 'आगे बढ़ें: सर्विस चुनें (स्टेप 2)' : 'Next: Choose Wash Service (Step 2)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          STEP 2: TYPE OF SERVICE SELECT KARE (WASH PACKAGES)
         ======================================================== */}
      {step === 2 && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-200/80 shadow-[0_10px_35px_rgba(245,158,11,0.06)] overflow-hidden p-5 sm:p-7 space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-amber-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🧼</span>
                <span>{isHindi ? 'सर्विस का प्रकार चुनें' : 'Choose Wash Service'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? `गाड़ी: ${make} ${model} (${segment.replace('_', ' ').toUpperCase()})` : `For ${make} ${model}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs text-amber-800 font-bold hover:underline cursor-pointer"
            >
              {isHindi ? '← गाड़ी बदलें' : '← Change Vehicle'}
            </button>
          </div>

          {/* 4 Clean Visual Wash Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredServices.map((srv) => {
              const isSel = service?.id === srv.id;
              const price = srv.vehiclePricing[segment] || 250;
              
              return (
                <div
                  key={srv.id}
                  onClick={() => {
                    setService(srv);
                    setError(null);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSel
                      ? 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/30 border-amber-500 shadow-lg shadow-amber-500/10 ring-4 ring-amber-400/20'
                      : 'bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/60">
                        ⏱️ {srv.durationMinutes} {isHindi ? 'मिनट' : 'mins'}
                      </span>
                      {srv.badge && (
                        <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 uppercase tracking-wider shadow-xs">
                          {srv.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900 mb-1">
                      {srv.name}
                    </h3>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {srv.tagline}
                    </p>

                    {/* Clean Bullets */}
                    <div className="space-y-1 mb-4 text-[11px] text-slate-600">
                      {srv.includedTasks.slice(0, 3).map((task, tidx) => (
                        <div key={tidx} className="flex items-center space-x-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="truncate">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {isHindi ? 'कुल रेट' : 'Price'}
                      </span>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        ₹{price}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSel ? 'bg-slate-950 border-amber-500 text-amber-400 shadow-xs' : 'border-slate-300'
                      }`}
                    >
                      {isSel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHindi ? 'पिछला' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep2()) goToStep(3);
              }}
              className="flex-1 py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 cursor-pointer"
            >
              <span>{isHindi ? 'आगे बढ़ें: स्लॉट व पता (स्टेप 3)' : 'Next: Slot & Address (Step 3)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 3: DATE & TIME SLOT OR ADDRESS FILL KARE
         ======================================================== */}
      {step === 3 && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-200/80 shadow-[0_10px_35px_rgba(245,158,11,0.06)] overflow-hidden p-5 sm:p-7 space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-amber-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>📅</span>
                <span>{isHindi ? 'तारीख, समय स्लॉट व पता' : 'Schedule & Address'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? 'अपनी सुविधानुसार दिन, समय और इंदौर का पता चुनें' : 'Choose time slot and doorstep address'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs text-amber-800 font-bold hover:underline cursor-pointer"
            >
              {isHindi ? '← सर्विस बदलें' : '← Change Service'}
            </button>
          </div>

          {/* 1. DATE CHIPS */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isHindi ? 'धुलाई की तारीख (Day):' : 'Select Date:'}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {dateOptions.map((opt) => {
                const isSel = scheduledDate === opt.iso;
                return (
                  <button
                    key={opt.iso}
                    type="button"
                    onClick={() => setSchedule(opt.iso, timeSlot)}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center transition-all cursor-pointer ${
                      isSel
                        ? 'bg-slate-950 border-slate-950 text-amber-400 font-bold shadow-md shadow-amber-500/20 ring-2 ring-amber-400 scale-102'
                        : 'bg-white border-slate-200/90 hover:border-amber-300 text-slate-700 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{opt.dayName}</span>
                    <span className={`text-xs font-black my-0.5 font-mono ${isSel ? 'text-amber-300' : 'text-slate-900'}`}>
                      {opt.monthDay}
                    </span>
                    <span className={`text-[9px] ${isSel ? 'text-amber-200 font-bold' : 'text-emerald-600 font-bold'}`}>
                      {isHindi ? 'उपलब्ध' : 'Open'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. TIME SLOTS */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isHindi ? 'समय स्लॉट (Arrival Window):' : 'Arrival Time Window:'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((ts) => {
                const isSel = timeSlot === ts.slot;
                return (
                  <button
                    key={ts.slot}
                    type="button"
                    onClick={() => setSchedule(scheduledDate, ts.slot)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-slate-950 border-slate-950 text-amber-400 font-bold shadow-xs'
                        : 'bg-white border-slate-200/90 hover:border-amber-300 text-slate-700 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="text-sm">{ts.emoji}</span>
                    <span className="truncate">{isHindi ? ts.labelHi : ts.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. CONTACT & ADDRESS */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? 'आपका नाम *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ name: e.target.value })}
                    placeholder={isHindi ? 'उदा: राहुल शर्मा' : 'e.g. Rahul Sharma'}
                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    {isHindi ? 'व्हाट्सएप / मोबाइल नंबर *' : 'Mobile Phone *'}
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${customer.phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {customer.phone.length}/10
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customer.phone}
                    onChange={(e) => setCustomer({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="9685232340"
                    className="w-full pl-11 pr-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Indore Pincode fast chips */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {isHindi ? 'इंदौर पिनकोड (चुनें):' : 'Select Indore Pincode:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INDORE_PINCODES.map((item) => (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => setPincode(item.pin)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono font-semibold transition-all cursor-pointer ${
                      pincode === item.pin
                        ? 'bg-slate-950 text-amber-400 border-slate-950 shadow-xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                    }`}
                  >
                    {item.pin} ({item.area})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isHindi ? 'मकान/फ्लैट नं., बिल्डिंग, सोसायटी का नाम *' : 'Doorstep Full Address (Indore) *'}
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ street: e.target.value })}
                  placeholder={isHindi ? 'उदा: फ्लैट 402, सिल्वर स्प्रिंग्स, स्कीम 54' : 'e.g. Flat 402, Silver Springs, Scheme 54'}
                  className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* On-Board Water & Silent Power Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                ✓
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  {isHindi ? '100% शुद्ध पानी व जनरेटर वैन में शामिल' : '100% On-Board Pure Water & Silent Power'}
                </span>
                <span className="text-[11px] text-emerald-800">
                  {isHindi
                    ? 'आपकी सोसायटी या घर से न पानी चाहिए न बिजली। हमारी वैन पूरी तरह आत्मनिर्भर है।'
                    : 'Zero water or power required from you. Our mobile unit arrives fully equipped.'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 shrink-0">
              {isHindi ? 'मुफ़्त ऑन-बोर्ड' : 'Included'}
            </span>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHindi ? 'पिछला' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep3()) goToStep(4);
              }}
              className="flex-1 py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 cursor-pointer"
            >
              <span>{isHindi ? 'आगे बढ़ें: रिव्यू व पेमेंट (स्टेप 4)' : 'Next: Review & Payment (Step 4)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 4: DETAIL REVIEW KARE OR PAYMENT KARE
          ISKE BAAD ORDER WHATSAPP PAR PLACE HO JAYEGA
         ======================================================== */}
      {step === 4 && (
        <form onSubmit={handleFinalOrderSubmit} className="bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-200/80 shadow-[0_10px_35px_rgba(245,158,11,0.06)] overflow-hidden p-5 sm:p-7 space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-amber-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>💳</span>
                <span>{isHindi ? 'विवरण रिव्यू करें और ऑर्डर करें' : 'Review Details & Payment'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? 'ऑर्डर की पुष्टि करें और सीधे व्हाट्सएप पर भेजें' : 'Confirm details and place order on WhatsApp'}
              </p>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {isHindi ? 'अंतिम चरण' : 'Final Step'}
            </span>
          </div>

          {/* CREATIVE DIGITAL WASH BOARDING PASS / TICKET */}
          <div className="rounded-3xl border-2 border-dashed border-amber-400/80 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 p-5 space-y-4 relative overflow-hidden shadow-xs">
            
            {/* Top Pass Brand Strip */}
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono font-black text-xs text-amber-800 tracking-widest uppercase">
                  WASHLY DOORSTEP PASS
                </span>
              </div>
              <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md border border-amber-200 text-slate-700">
                INDORE HUB
              </span>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {isHindi ? 'गाड़ी' : 'VEHICLE'}
                </div>
                <div className="font-black text-slate-900 text-sm mt-0.5">
                  {make} {model}
                </div>
                <div className="text-[10px] text-amber-800 font-bold uppercase">
                  {segment.replace('_', ' ')} • {fuelType}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {isHindi ? 'वॉश पैकेज' : 'SERVICE'}
                </div>
                <div className="font-black text-slate-900 text-sm mt-0.5">
                  {service?.name || 'Doorstep Wash'}
                </div>
                <div className="text-[10px] text-slate-500">
                  ⏱️ {service?.durationMinutes} {isHindi ? 'मिनट' : 'mins'}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {isHindi ? 'शेड्यूल' : 'SCHEDULE'}
                </div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {new Date(scheduledDate).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-[10px] text-slate-500">{timeSlot}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {isHindi ? 'ग्राहक व पता' : 'CUSTOMER'}
                </div>
                <div className="font-bold text-slate-800 mt-0.5 truncate">
                  {customer.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {address.street}, {pincode}
                </div>
              </div>
            </div>

            {/* Price Banner */}
            <div className="pt-3 border-t border-amber-200/70 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 block">
                  {isHindi ? 'कुल राशि (Total):' : 'Total Amount:'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {isHindi ? 'पानी व जनरेटर ऑन-बोर्ड मुफ़्त' : 'Water & Power included free'}
                </span>
              </div>
              <span className="text-3xl font-black text-slate-950 font-mono">
                ₹{getTotalAmount()}
              </span>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTION */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isHindi ? 'भुगतान का तरीका (Payment Option):' : 'Payment Method:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Cash/UPI after wash */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-emerald-50/90 border-emerald-500 ring-4 ring-emerald-400/15 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-900">
                    {isHindi ? 'धुलाई के बाद भुगतान' : 'Pay After Wash'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isHindi ? '100% संतुष्टि के बाद Cash / UPI' : 'Pay after complete satisfaction'}
                  </div>
                </div>
                {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </div>

              {/* Option 2: UPI QR on Arrival */}
              <div
                onClick={() => setPaymentMethod('upi_mock')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                  paymentMethod === 'upi_mock'
                    ? 'bg-amber-50/90 border-amber-500 ring-4 ring-amber-400/15 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-900">
                    {isHindi ? 'वैन पर QR से भुगतान' : 'UPI QR on Arrival'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    GPay, PhonePe, Paytm
                  </div>
                </div>
                {paymentMethod === 'upi_mock' && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">
              {isHindi ? 'वॉशर के लिए कोई विशेष निर्देश (वैकल्पिक):' : 'Special Instructions (Optional):'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isHindi ? 'उदा: गेट पर कॉल करें, बेसमेंट पार्किंग' : 'e.g. Call at the gate'}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
            />
          </div>

          {/* FINAL HIGH-CONVERSION WHATSAPP CTA */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#10b981] via-[#25d366] to-[#059669] hover:from-[#059669] hover:to-[#10b981] active:scale-[0.99] text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2.5 transition-all shadow-xl shadow-emerald-500/35 hover:shadow-2xl hover:shadow-emerald-500/45 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-pulse">{isHindi ? 'ऑर्डर प्रोसेस हो रहा है...' : 'Placing Order...'}</span>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.842-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>
                    {isHindi
                      ? `ऑर्डर कन्फर्म करें और व्हाट्सएप पर भेजें (₹${getTotalAmount()})`
                      : `Confirm & Place Order on WhatsApp (₹${getTotalAmount()})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="hover:text-slate-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>{isHindi ? 'पिछला (पता बदलें)' : 'Back to Address'}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                {isHindi ? 'हेल्पलाइन: +91 9685232340' : 'Helpline: +91 9685232340'}
              </span>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
