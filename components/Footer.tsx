'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Sparkles,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function Footer() {
  const { isHindi } = useTranslation();
  const pathname = usePathname();
  const isBookingPage = pathname?.startsWith('/book');

  const [areasOpen, setAreasOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);

  // Completely omit footer on the booking wizard page to maximize conversion focus
  if (isBookingPage) {
    return null;
  }

  const packagesList = [
    { name: isHindi ? 'एक्सटीरियर प्रेशर फोम वॉश' : 'Exterior Pressure Foam Wash', price: '₹249' },
    { name: isHindi ? 'कम्प्लीट वॉश + इंटीरियर वैक्यूम' : 'Complete Wash + Interior Vacuum', price: '₹449' },
    { name: isHindi ? 'सुपर शाइन + रोटेटर वैक्स पॉलिश' : 'Super Shine + Rotator Wax Polish', price: '₹649' },
    { name: isHindi ? 'डीप इंटीरियर स्पा + सैनिटाइजेशन' : 'Deep Interior Spa + Sanitization', price: '₹899' },
    { name: isHindi ? 'बाइक / स्कूटर फोम प्रेशर वॉश' : 'Bike / Scooter Foam Wash', price: '₹99' },
  ];

  const serviceAreas = [
    'विजय नगर (Vijay Nagar)',
    'पलासिया (Palasia)',
    'स्कीम 54 / 78 (Scheme 54/78)',
    'सुपर कॉरिडोर (Super Corridor)',
    'बायपास / निपानिया (Nipania)',
    'भंवरकुआं (Bhanwarkuan)',
    'राऊ व सिलिकॉन सिटी (Rau)',
    'कनाड़िया रोड (Kanadia Rd)',
    'अनूप नगर / एलआईजी (LIG)',
    'महालक्ष्मी नगर (Mahalaxmi Nagar)'
  ];

  return (
    <footer className="bg-[#090D16] text-slate-400 border-t border-slate-800/80 pt-10 pb-8 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Slim Grid: Brand & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-slate-800/80">
          
          {/* Brand Info (Col 1-5) */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-block group" aria-label="Washly Home">
              <Image
                src="/images/washly-yellow-white-logo.png"
                alt="Washly Doorstep Car Care"
                width={150}
                height={60}
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              {isHindi 
                ? 'इंदौर में घर बैठे 100% स्क्रैच-फ्री कार व बाइक वॉश। शुद्ध पानी और साइलेंट जनरेटर ऑन-बोर्ड।'
                : 'Indore’s premier doorstep car & bike care. Pure water and silent power onboard.'}
            </p>

            <div className="flex items-center gap-2 pt-1 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{isHindi ? 'धुलाई पूरी होने के बाद ही पेमेंट' : 'Pay only after 100% satisfaction'}</span>
            </div>
          </div>

          {/* Contact & Timings (Col 6-8) */}
          <div className="md:col-span-4 space-y-2.5">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
              {isHindi ? 'कस्टमर हेल्पलाइन' : 'Customer Helpline'}
            </p>

            <div className="space-y-2">
              <a 
                href="tel:+919685232340" 
                className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+91 96852 32340</span>
              </a>

              <a 
                href="mailto:support@washly.in" 
                className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>support@washly.in</span>
              </a>

              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isHindi ? 'सोम - रवि | सुबह 7:00 से रात 8:00' : 'Mon - Sun | 7:00 AM - 8:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Col 9-12) */}
          <div className="md:col-span-3 space-y-2.5 flex flex-col sm:items-start md:items-end">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
              {isHindi ? 'तुरंत बुकिंग' : 'Quick Booking'}
            </p>

            <Link
              href="/book"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
            >
              <span>{isHindi ? 'गाड़ी धुलाई बुक करें' : 'Book Doorstep Wash'}</span>
            </Link>

            <a
              href="https://wa.me/919685232340?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20Washly!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B5%E0%A5%89%E0%A4%B6%20%E0%A4%AC%E0%A5%81%E0%A4%95%20%E0%A4%95%E0%A4%B0%E0%A4%A8%E0%A5%80%20%E0%A4%B9%E0%A5%88%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-400 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>WhatsApp: +91 96852 32340</span>
            </a>
          </div>

        </div>

        {/* Accordions for Packages & Service Areas to keep footer slim */}
        <div className="py-4 border-b border-slate-800/80 space-y-2">
          
          {/* Packages Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
            <button
              type="button"
              onClick={() => setPackagesOpen(!packagesOpen)}
              className="w-full py-2.5 px-4 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="font-semibold text-xs flex items-center gap-2">
                <span>{isHindi ? '📦 वॉश पैकेज व रेट लिस्ट' : '📦 Wash Packages & Price List'}</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${packagesOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
            </button>

            {packagesOpen && (
              <div className="p-4 pt-1 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {packagesList.map((pkg, idx) => (
                  <Link
                    key={idx}
                    href="/book"
                    className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span className="text-slate-300">{pkg.name}</span>
                    <span className="font-bold text-amber-400">{pkg.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Service Areas Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
            <button
              type="button"
              onClick={() => setAreasOpen(!areasOpen)}
              className="w-full py-2.5 px-4 flex items-center justify-between text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="font-semibold text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? '📍 इंदौर में सर्विस क्षेत्र (Indore Coverage)' : '📍 Service Areas in Indore'}</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${areasOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
            </button>

            {areasOpen && (
              <div className="p-4 pt-1 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
                {serviceAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-850 text-slate-300 text-[11px]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Washly Doorstep Car Care Pvt. Ltd.</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('show_washly_splash'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-black text-amber-400 text-[10px] font-bold border border-amber-500/30 transition-colors cursor-pointer"
              title="Replay Wash Animation"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isHindi ? 'एनीमेशन फिर देखें' : 'Replay Animation'}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>{isHindi ? '100% शुद्ध पानी ऑन-बोर्ड' : '100% Pure Water On-Board'}</span>
            <span>•</span>
            <span>{isHindi ? 'साइलेंट जनरेटर' : 'Silent Generator'}</span>
            <span>•</span>
            <span>{isHindi ? 'स्क्रैच-फ्री गारंटी' : 'Scratch-Free'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
