'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Tag, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function HomeCtaBanner() {
  const { isHindi } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText('WASH50');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-20 relative bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 border-t border-slate-200 overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-200/35 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Luxury CTA Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl shadow-amber-500/5 text-center relative overflow-hidden">
          
          {/* Top Pill / Discount Alert */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold mb-4 shadow-2xs">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'सीमित समय ऑफर: पहली बुकिंग पर ₹50 OFF' : 'LIMITED OFFER: ₹50 OFF on First Wash'}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
            {isHindi ? 'घर बैठे गाड़ी को दें ' : 'Treat Your Vehicle to '}
            <span className="text-amber-700">{isHindi ? 'शोरूम जैसी चमक' : 'Showroom Polish'}</span>
          </h2>

          {/* Subtext */}
          <p className="text-xs sm:text-base text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
            {isHindi 
              ? 'शुद्ध पानी, साइलेंट बिजली और आधुनिक उपकरण सब हमारे। बस 1 मिनट में तारीख व समय चुनें, वैन आपके पते पर पहुंचेगी।'
              : 'Zero water or power required from you. Schedule your doorstep wash in 60 seconds.'}
          </p>

          {/* Coupon Code Pill */}
          <div className="inline-flex items-center gap-3 bg-amber-50/70 border border-dashed border-amber-400 rounded-2xl px-5 py-2.5 mb-8">
            <span className="text-xs text-slate-600 font-medium">
              {isHindi ? 'कूपन कोड:' : 'Coupon Code:'}
            </span>
            <span className="font-mono font-black text-sm text-amber-900 tracking-wider">
              WASH50
            </span>
            <button
              type="button"
              onClick={copyCoupon}
              aria-label={isHindi ? 'कूपन कोड WASH50 कॉपी करें' : 'Copy coupon code WASH50'}
              className="text-[11px] font-bold text-slate-800 hover:text-amber-600 bg-white border border-amber-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">{isHindi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                </>
              ) : (
                <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
              )}
            </button>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Primary Action Button with Golden Sparkling Effect */}
            <Link
              href="/book"
              className="btn-sparkle-gold w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all group"
            >
              <span>{isHindi ? 'गाड़ी धुलाई बुक करें (₹50 छूट के साथ)' : 'Book Doorstep Wash (Get ₹50 Off)'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Direct WhatsApp Option with WhatsApp Sparkling Effect */}
            <a
              href="https://wa.me/919685232340?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20Washly!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%95%E0%A5%82%E0%A4%AA%E0%A4%A8%20WASH50%20%E0%A4%95%E0%A5%87%20%E0%A4%B8%E0%A4%BE%E0%A4%A5%20%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B5%E0%A5%89%E0%A4%B6%20%E0%A4%AC%E0%A5%81%E0%A4%95%20%E0%A4%95%E0%A4%B0%E0%A4%A8%E0%A5%80%20%E0%A4%B9%E0%A5%88%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sparkle-whatsapp w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.842-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>{isHindi ? 'व्हाट्सएप पर ऑर्डर करें' : 'Order on WhatsApp'}</span>
            </a>
          </div>

          {/* Micro trust guarantee */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? '100% संतुष्टि के बाद ही भुगतान' : 'Pay after 100% satisfaction'}</span>
            </span>
            <span>•</span>
            <span>{isHindi ? 'पानी व बिजली हमारी' : 'Water & Power Provided'}</span>
            <span>•</span>
            <span>{isHindi ? 'पूरे इंदौर में उपलब्ध' : 'All Indore Areas'}</span>
          </div>

        </div>

      </div>
    </section>
  );
}
