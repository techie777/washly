'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Send, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { openWhatsAppOrder, WHATSAPP_PHONE } from '@/lib/whatsapp';

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: {
    name: string;
    price: number | string;
    slug?: string;
  };
}

export default function WhatsAppOrderModal({
  isOpen,
  onClose,
  initialService,
}: WhatsAppOrderModalProps) {
  const { isHindi } = useTranslation();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [address, setAddress] = useState('');
  const [selectedService, setSelectedService] = useState(
    initialService?.name || (isHindi ? 'कार प्रेशर जेट वॉश (₹250)' : 'Car Pressure Wash (₹250)')
  );
  const [servicePrice, setServicePrice] = useState<string | number>(
    initialService?.price || 250
  );

  // Update whenever initialService changes
  React.useEffect(() => {
    if (initialService) {
      setSelectedService(initialService.name);
      setServicePrice(initialService.price);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSendToWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    openWhatsAppOrder({
      serviceName: selectedService,
      price: servicePrice,
      customerName: customerName.trim() || undefined,
      phone: phone.trim() || undefined,
      vehicleModel: vehicleModel.trim() || undefined,
      address: address.trim() || undefined,
      isHindi,
    });

    onClose();
  };

  const handleQuickDirectOpen = () => {
    openWhatsAppOrder({
      serviceName: selectedService,
      price: servicePrice,
      isHindi,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with WhatsApp Brand Green */}
        <div className="bg-[#25D366] text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.842-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white leading-tight">
                {isHindi ? 'व्हाट्सएप पर तुरंत ऑर्डर करें' : 'Order Directly on WhatsApp'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {isHindi ? 'सीधा संपर्क: +91 9685232340' : 'Direct Helpline: +91 9685232340'}
              </p>
            </div>
          </div>

          <div className="mt-3.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? '1 मिनट में कन्फर्मेशन पाएं' : 'Get instant confirmation on WhatsApp'}</span>
          </div>
        </div>

        {/* Selected Package Banner */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">
              {isHindi ? 'चयनित पैकेज:' : 'Selected Package:'}
            </span>
            <span className="font-bold text-slate-900">{selectedService}</span>
          </div>
          <span className="font-extrabold text-base text-emerald-600 font-mono">
            ₹{servicePrice}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendToWhatsApp} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHindi ? 'आपका नाम (Optional)' : 'Your Name (Optional)'}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={isHindi ? 'उदा: राहुल शर्मा' : 'e.g. Rahul Sharma'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'गाड़ी का नाम / मॉडल' : 'Vehicle / Car Model'}
              </label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder={isHindi ? 'उदा: Creta / Swift / Activa' : 'e.g. Creta / Swift / Activa'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'फोन नंबर (यदि अलग हो)' : 'Phone (Optional)'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{isHindi ? 'पता / इलाका (इंदौर)' : 'Address / Locality (Indore)'}</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {isHindi ? 'इंदौर पूर्ण कार्यक्षेत्र' : 'Indore Area'}
              </span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isHindi ? 'उदा: विजय नगर, स्कीम 54, इंदौर' : 'e.g. Vijay Nagar, Scheme 54, Indore'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Value Props */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHindi ? 'पानी व बिजली हमारी' : 'On-Board Water & Power'}</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHindi ? 'संतुष्टि के बाद भुगतान' : 'Pay After Inspection'}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="btn-sparkle-whatsapp w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>
                {isHindi ? 'व्हाट्सएप पर ऑर्डर भेजें' : 'Send Order on WhatsApp'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleQuickDirectOpen}
              className="w-full py-2 px-3 text-xs text-slate-600 hover:text-slate-900 font-medium hover:underline text-center"
            >
              {isHindi ? '⚡ बिना विवरण भरे सीधे व्हाट्सएप चैट खोलें' : '⚡ Open WhatsApp Directly Without Form'}
            </button>

            <Link
              href="/book"
              onClick={onClose}
              className="block w-full py-2 px-3 text-xs text-amber-800 hover:text-amber-950 font-black hover:underline text-center"
            >
              {isHindi ? '📋 या 4-स्टेप बुकिंग फॉर्म खोलें →' : '📋 Or Open 4-Step Booking Wizard →'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
