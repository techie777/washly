'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function Footer() {
  const { isHindi } = useTranslation();
  const pathname = usePathname();
  const isBookingPage = pathname?.startsWith('/book');

  // Completely omit footer on the booking wizard page to maximize conversion focus
  if (isBookingPage) {
    return null;
  }

  const services = [
    { 
      nameEn: '1. Pressure Shampoo Wash (Home Visit)', 
      nameHi: '1. प्रेशर शैम्पू वॉश (होम विजिट)', 
      price: '₹250', 
      href: '/services/car-pressure-wash/indore' 
    },
    { 
      nameEn: '2. Bucket Shampoo Wash (Home Visit)', 
      nameHi: '2. बकेट शैम्पू वॉश (होम विजिट)', 
      price: '₹150', 
      href: '/services/car-bucket-wash/indore' 
    },
    { 
      nameEn: '3. Pressure Shampoo + Vacuum + Perfume', 
      nameHi: '3. प्रेशर शैम्पू + वैक्यूम + परफ्यूम', 
      price: '₹400', 
      href: '/services/shampoo-rotator-shine/indore' 
    },
    { 
      nameEn: '4. Pressure Shampoo + Vacuum + Rotator Shine + Perfume', 
      nameHi: '4. प्रेशर शैम्पू + वैक्यूम + मशीन रोटेटर शाइन + परफ्यूम', 
      price: '₹600', 
      href: '/services/complete-wash-interior-vacuum-perfume/indore' 
    },
    { 
      nameEn: 'Bike / Scooter Foam Wash', 
      nameHi: 'बाइक / स्कूटर फोम वॉश', 
      price: '₹99', 
      href: '/services/bike-foam-pressure/indore' 
    },
    { 
      nameEn: 'Bike Super Detailing + Chain Lube', 
      nameHi: 'बाइक सुपर डिटेलिंग + चेन ल्यूब', 
      price: '₹199', 
      href: '/services/bike-super-detailing/indore' 
    },
  ];

  const serviceAreas = [
    'Vijay Nagar',
    'Palasia',
    'Mahalaxmi Nagar',
    'Scheme No 54',
    'Scheme No 78',
    'Nipania',
    'MR-9 Road',
    'Bapat Square',
    'Sukhlia',
    'LIG Square',
    'Malviya Nagar',
    'Saket',
    'Tilak Nagar',
    'Bengali Square',
    'Khajrana',
  ];

  return (
    <footer className="below-fold bg-gradient-to-b from-white via-slate-50/80 to-amber-50/30 text-slate-600 border-t border-slate-200/90 text-xs">
      {/* MAIN 4-COLUMN RICH INFORMATION GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 items-start">
          
          {/* Column 1: Brand Info & Social Presence */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="Washly Home">
              <Image
                src="/images/washly-yellow-black-logo.png"
                alt="Washly Doorstep Car Care"
                width={167}
                height={60}
                quality={40}
                sizes="(max-width: 640px) 112px, 128px"
                className="w-[111px] h-10 sm:w-[123px] sm:h-11 object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              {isHindi 
                ? 'इंदौर की प्रमुख ऑन-डिमांड कार व बाइक केयर सेवा। हाई-प्रेशर मशीनों से सुसज्जित सर्विस यूनिट्स सीधे आपकी पार्किंग में आकर शोरूम जैसी चमक देती हैं (पानी व बिजली ग्राहक द्वारा)।'
                : 'Indore’s premier doorstep car & bike care. Equipped mobile units and service bikes bring high-pressure detailing equipment right to your parking (water & power by customer).'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{isHindi ? 'इंदौर में 15+ क्षेत्रों में लाइव सेवा उपलब्ध' : 'Serving 15+ Localities in Indore'}</span>
            </div>

            {/* Social Media Presence */}
            <div className="pt-1">
              <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                {isHindi ? 'सोशल मीडिया पर फॉलो करें' : 'Connect With Us'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/washly.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50/50 flex items-center justify-center text-slate-600 transition-all shadow-2xs hover:scale-110"
                  title="Instagram: @washly.in"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href="https://facebook.com/washly.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 flex items-center justify-center text-slate-600 transition-all shadow-2xs hover:scale-110"
                  title="Facebook: Washly Doorstep"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a
                  href="https://youtube.com/@washly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50/50 flex items-center justify-center text-slate-600 transition-all shadow-2xs hover:scale-110"
                  title="YouTube: Washly"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href="https://wa.me/919685232340"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 flex items-center justify-center text-slate-600 transition-all shadow-2xs hover:scale-110"
                  title="WhatsApp Support"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>

                <a
                  href="https://x.com/washly_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-800 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all shadow-2xs hover:scale-110"
                  title="X: @washly_in"
                  aria-label="X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Services & Rates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
              <p className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                {isHindi ? 'वॉश सेवाएं व दरें' : 'Doorstep Wash Services'}
              </p>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
                {isHindi ? 'डोरस्टेप' : 'At Home'}
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {services.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between text-slate-600 hover:text-amber-800 transition-colors py-0.5"
                  >
                    <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">
                      {isHindi ? item.nameHi : item.nameEn}
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] font-mono shrink-0">
                      {item.price}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-100">
                <Link
                  href="/#monthly-plans"
                  className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold text-xs hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{isHindi ? 'मंथली वॉश पास (30% बचत)' : 'Monthly Wash Passes (Save 30%)'}</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Localities in Indore */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
              <p className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                {isHindi ? 'इंदौर में सर्विस क्षेत्र' : 'Service Areas'}
              </p>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                {isHindi ? '15+ क्षेत्र' : '15+ Localities'}
              </span>
            </div>

            {/* Clean compact locality list */}
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {serviceAreas.join(' • ')}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
              <MapPin aria-hidden="true" className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{isHindi ? 'सर्विस वैन व बाइक पूरे इंदौर में सक्रिय' : 'Vans & bikes active across Indore'}</span>
            </div>
          </div>

          {/* Column 4: Customer Helpline & Instant Booking */}
          <div className="space-y-3">
            <p className="text-slate-900 font-bold text-xs uppercase tracking-wider">
              {isHindi ? 'कस्टमर केयर व बुकिंग' : 'Helpline & Support'}
            </p>

            {/* Helpline Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <a 
                href="tel:+919685232340" 
                className="flex items-center gap-2 text-slate-900 hover:text-amber-700 transition-colors font-bold text-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Phone aria-hidden="true" className="w-3.5 h-3.5" />
                </div>
                <span>+91 96852 32340</span>
              </a>

              <a 
                href="mailto:support@washly.in" 
                className="flex items-center gap-2 text-slate-600 hover:text-amber-700 transition-colors text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                  <Mail aria-hidden="true" className="w-3.5 h-3.5" />
                </div>
                <span>support@washly.in</span>
              </a>

              <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <Clock aria-hidden="true" className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{isHindi ? 'सोम - रवि | सुबह 7:00 से रात 8:00' : 'Mon - Sun | 7:00 AM - 8:00 PM'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Link
                href="/book"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
              >
                <span>{isHindi ? 'डोरस्टेप वॉश बुक करें' : 'Book Doorstep Wash'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://wa.me/919685232340?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20Washly!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B5%E0%A5%89%E0%A4%B6%20%E0%A4%AC%E0%A5%81%E0%A4%95%20%E0%A4%95%E0%A4%B0%E0%A4%A8%E0%A5%80%20%E0%A4%B9%E0%A5%88%E0%A5%A4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>WhatsApp: +91 96852 32340</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. POLICY & LEGAL BAR */}
      <div className="border-t border-slate-200/80 bg-white/50 py-3.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 font-semibold text-[11px]">
              <Link
                href="/terms"
                className="text-slate-600 hover:text-amber-800 hover:underline transition-colors"
              >
                {isHindi ? 'उपयोग के नियम (Terms of Use)' : 'Terms of Use'}
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/privacy"
                className="text-slate-600 hover:text-amber-800 hover:underline transition-colors"
              >
                {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/cancellation-refund"
                className="text-slate-600 hover:text-amber-800 hover:underline transition-colors"
              >
                {isHindi ? 'रद्दीकरण व रिफंड नीति (Refund Policy)' : 'Cancellation & Refund'}
              </Link>
            </div>

            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="w-3 h-3 text-amber-700 shrink-0" />
              <span>{isHindi ? 'मुख्यालय: विजय नगर, इंदौर (म.प्र.) 452010' : 'HQ: Vijay Nagar, Indore (M.P.) 452010'}</span>
            </div>

          </div>
        </div>
      </div>

      {/* 4. BOTTOM COPYRIGHT & ANIMATION REPLAY */}
      <div className="border-t border-slate-200/60 bg-slate-100/60 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span>© {new Date().getFullYear()} Washly Doorstep Car Care Pvt. Ltd. All rights reserved.</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('show_washly_splash'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 min-h-[28px] rounded-md bg-white hover:bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-300/80 transition-colors cursor-pointer shadow-2xs"
                title="Replay Wash Animation"
              >
                <Sparkles aria-hidden="true" className="w-3 h-3 text-amber-700" />
                <span>{isHindi ? 'एनीमेशन देखें' : 'Replay Animation'}</span>
              </button>
            </div>

            <div className="text-slate-600 text-[10px]">
              <span>Made with care for car & bike lovers in Indore 🚗✨</span>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
