'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  Share2,
  X
} from 'lucide-react';
import { useBookingStore } from '@/lib/store/bookingStore';
import { useTranslation } from '@/lib/translations';
import QuickBookForm from './QuickBookForm';
import BookingSummaryCard from './BookingSummaryCard';
import confetti from 'canvas-confetti';
import { openWhatsAppOrder } from '@/lib/whatsapp';

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const citySlug = searchParams.get('city');

  const { 
    prefillBooking, 
    resetBooking, 
    vehicle, 
    service,
    customer,
    address,
    pincode,
    paymentMethod,
    notes,
    scheduledDate, 
    timeSlot,
    getTotalAmount 
  } = useBookingStore();

  const { t, isHindi } = useTranslation();
  const [completedBookingId, setCompletedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (serviceSlug || citySlug) {
      prefillBooking(serviceSlug || undefined, citySlug || undefined);
    }
  }, [serviceSlug, citySlug, prefillBooking]);

  const handleBookingSuccess = (bookingId: string) => {
    setCompletedBookingId(bookingId);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#FBBF24', '#090D16', '#10B981', '#EAB308'],
    });
  };

  const handleShareReceipt = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 640, 760);
      const grad = ctx.createLinearGradient(0, 0, 640, 140);
      grad.addColorStop(0, '#090D16');
      grad.addColorStop(1, '#18181B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 140);
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('WASHLY DOORSTEP CARE', 40, 55);
      ctx.fillStyle = '#FEF3C7';
      ctx.font = '14px sans-serif';
      ctx.fillText('Eco-Friendly On-Demand Mobile Cleaning - Indore', 40, 85);
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('OFFICIAL BOOKING CONFIRMATION VOUCHER', 40, 115);
      ctx.fillStyle = '#FAFAF9';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, 170, 560, 90, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('BOOKING UNIQUE ID', 60, 205);
      ctx.fillStyle = '#D97706';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(completedBookingId || 'CW-BOOKING', 60, 240);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('STATUS: CONFIRMED & SCHEDULED', 340, 225);
      ctx.fillStyle = '#FAFAF9';
      ctx.strokeStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.roundRect(40, 280, 560, 360, 16);
      ctx.fill();
      ctx.stroke();
      const items: [string, string][] = [
        ['Customer Name:', customer?.name || 'Customer'],
        ['Contact Phone:', customer?.phone || '-'],
        ['Vehicle Details:', `${vehicle?.make || ''} ${vehicle?.model || ''} (${vehicle?.segment?.replace('_', ' ').toUpperCase() || 'CAR'})`],
        ['Wash Package:', service?.name || 'Doorstep Wash'],
        ['Scheduled Date:', scheduledDate || 'Tomorrow'],
        ['Arrival Window:', timeSlot || 'Morning Express'],
        ['Service City:', 'Indore (Doorstep)'],
        ['Total Payable:', `Rs.${getTotalAmount()} (Pay After Wash)`]
      ];
      items.forEach(([label, val], idx) => {
        const y = 320 + (idx * 38);
        ctx.fillStyle = '#64748B';
        ctx.font = '13px sans-serif';
        ctx.fillText(label, 60, y);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(val, 240, y);
      });
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Helpline: +91 96852 32340 | Pure Water & Silent Power On-Board', 80, 680);
      ctx.fillText('Washly Doorstep Car Care Indore. All rights reserved.', 150, 710);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Washly-${completedBookingId}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Booking Voucher ${completedBookingId}`,
              text: `My Washly Doorstep Car Wash Booking: ${completedBookingId}`,
              files: [file],
            });
            return;
          } catch { /* fallback */ }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Washly-${completedBookingId}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      console.error('Failed to generate PNG receipt', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <QuickBookForm onBookingSuccess={handleBookingSuccess} />
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <BookingSummaryCard />
        </div>
      </div>

      {completedBookingId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-5 sm:p-7 border border-amber-300 shadow-2xl text-center animate-fade-in relative">
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShareReceipt}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-colors"
                title="Share Booking Voucher"
              >
                <Share2 className="w-4 h-4 text-amber-600" />
              </button>
              <button
                type="button"
                onClick={() => { setCompletedBookingId(null); resetBooking(); }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-amber-500" />
            </div>

            <div className="inline-block px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-2">
              {t.vanScheduled}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {t.bookingConfirmedTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {t.bookingConfirmedSub}
            </p>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-amber-200/80 mb-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t.bookingIdLabel}</span>
                <span className="font-bold text-amber-600 font-mono">{completedBookingId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t.vehicleLabel}</span>
                <span className="font-bold text-slate-800">{vehicle?.make} {vehicle?.model}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t.dateSlotLabel}</span>
                <span className="font-semibold text-slate-700">{scheduledDate} ({timeSlot})</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                    openWhatsAppOrder({
                      bookingId: completedBookingId,
                      serviceName: service?.name || 'Doorstep Wash',
                      price: getTotalAmount(),
                      vehicleType: vehicle?.type || 'car',
                      vehicleModel: `${vehicle?.make || ''} ${vehicle?.model || ''} (${vehicle?.segment?.replace('_', ' ').toUpperCase() || 'CAR'})`,
                      customerName: customer?.name,
                      phone: customer?.phone,
                      address: `${address?.street || ''}${address?.landmark ? ', ' + address?.landmark : ''}, Indore - ${pincode}`,
                      date: scheduledDate,
                      slot: timeSlot,
                      paymentMethod,
                      notes,
                      isHindi,
                    });
                }}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.842-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{isHindi ? 'व्हाट्सएप पर ऑर्डर भेजें (+91 9685232340)' : 'Send Order to WhatsApp (+91 9685232340)'}</span>
              </button>

              <Link
                href="/profile?tab=orders"
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-amber-400/30 transition-all"
              >
                <span>{t.myOrdersBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/track?id=${completedBookingId}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{t.trackVanBtn}</span>
              </Link>

              <div className="flex items-center justify-center gap-3 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => { setCompletedBookingId(null); resetBooking(); }}
                  className="text-amber-600 hover:underline font-semibold cursor-pointer"
                >
                  {t.bookAnotherBtn}
                </button>
                <span className="text-slate-300">•</span>
                <Link
                  href="/"
                  onClick={() => { setCompletedBookingId(null); resetBooking(); }}
                  className="text-slate-600 hover:text-slate-900 font-semibold hover:underline"
                >
                  {t.homePageBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
