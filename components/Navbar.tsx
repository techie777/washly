'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Menu, 
  X, 
  Car, 
  User, 
  ShoppingBag, 
  PhoneCall, 
  Languages, 
  Check, 
  LogOut, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  Navigation
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useTranslation } from '@/lib/translations';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const { t, isHindi, setLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Official Washly Yellow & Black Logo */}
        <Link href="/" className="flex items-center group shrink-0 py-0.5" aria-label="Washly Home">
          <Image
            src="/images/washly-yellow-black-logo.png"
            alt="Washly Doorstep Car Care"
            width={167}
            height={60}
            quality={40}
            sizes="(max-width: 640px) 100px, 140px"
            loading="eager"
            className="w-[100px] h-9 sm:w-[123px] sm:h-11 md:w-[134px] md:h-12 object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Clean, Uncluttered Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center space-x-7 text-sm font-semibold text-slate-700">
          <Link href="/#packages" className="hover:text-amber-700 transition-colors">
            {t.navServices}
          </Link>
          <Link href="/#how-it-works" className="hover:text-amber-700 transition-colors">
            {t.navHowItWorks}
          </Link>
          <Link href="/#reviews" className="hover:text-amber-700 transition-colors">
            {isHindi ? 'कस्टमर रिव्यू' : 'Reviews'}
          </Link>
          <Link href="/#monthly-pass" className="hover:text-amber-700 transition-colors">
            {isHindi ? 'मंथली पास' : 'Monthly Pass'}
          </Link>
          <Link href="/#faq" className="hover:text-amber-700 transition-colors">
            {isHindi ? 'सवाल-जवाब' : 'FAQ'}
          </Link>
        </nav>

        {/* Right Action Controls: Quick Call & Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Call Button with Yellow & Black Luxury Styling */}
          <a
            href="tel:+919685232340"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 text-xs font-bold transition-all shadow-2xs"
            title="Call Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline font-mono">+91 96852 32340</span>
            <span className="sm:hidden font-semibold">{isHindi ? 'हेल्पलाइन' : 'Call'}</span>
          </a>

          {/* Customer Account / Login Button */}
          {isLoggedIn && user ? (
            <Link
              href="/profile?tab=profile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
            >
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline max-w-[85px] truncate">{user.name?.split(' ')[0] || t.navProfile}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.navLogin}</span>
            </Link>
          )}

          {/* Hamburger / Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Menu & Options"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Top Left-to-Right Horizontal Scrolling Notice Bar */}
      <div
        className="bg-slate-950 text-amber-300 border-t border-amber-400/25 overflow-hidden h-8 sm:h-9 flex items-center select-none"
        style={{ contain: 'layout paint' }}
      >
        <div className="animate-marquee-ltr flex items-center whitespace-nowrap text-[11px] sm:text-xs font-bold tracking-wide">
          <div className="flex items-center shrink-0 min-w-[100vw] justify-around">
            <span className="inline-flex items-center gap-2 px-8">
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                {isHindi ? 'सूचना' : 'NOTE'}
              </span>
              <span>
                {isHindi
                  ? 'पानी एवं बिजली के लिए हम भविष्य में प्लान कर रहे हैं — फिलहाल हमारे पास पानी व बिजली के विकल्प नहीं हैं, धुलाई के दौरान आपको पानी और बिजली उपलब्ध करानी होगी।'
                  : 'We are planning onboard water & power facilities for the future — currently we do not have water or electricity options, so customers need to provide water & a power point during the wash.'}
              </span>
            </span>
          </div>
          <div className="flex items-center shrink-0 min-w-[100vw] justify-around" aria-hidden="true">
            <span className="inline-flex items-center gap-2 px-8">
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                {isHindi ? 'सूचना' : 'NOTE'}
              </span>
              <span>
                {isHindi
                  ? 'पानी एवं बिजली के लिए हम भविष्य में प्लान कर रहे हैं — फिलहाल हमारे पास पानी व बिजली के विकल्प नहीं हैं, धुलाई के दौरान आपको पानी और बिजली उपलब्ध करानी होगी।'
                  : 'We are planning onboard water & power facilities for the future — currently we do not have water or electricity options, so customers need to provide water & a power point during the wash.'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Hamburger Drawer / Full-Height Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-5 h-[calc(100dvh-97px)] sm:h-[calc(100dvh-101px)] overflow-y-auto overscroll-contain flex flex-col justify-between gap-6 shadow-xl">
          <div className="space-y-4">
            {/* User Profile Snippet (if logged in) */}
            {isLoggedIn && user ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200/80 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-xs truncate">
                        {user.name || 'User'}
                      </span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        <ShieldCheck aria-hidden="true" className="w-2.5 h-2.5" />
                        <span>Indore</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      +91 {user.phone}
                    </div>
                  </div>
                </div>
                <Link
                  href="/profile?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-300 text-slate-700 text-xs font-bold transition-colors shrink-0"
                >
                  {isHindi ? 'खाता' : 'Account'}
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">
                  {isHindi ? 'कार्यक्षेत्र शहर:' : 'Service City:'}
                </span>
                <span className="font-bold text-amber-700 flex items-center space-x-1">
                  <MapPin aria-hidden="true" className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.serviceCity} (Doorstep)</span>
                </span>
              </div>
            )}

            {/* Language Change Option Inside Hamburger Menu */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Languages aria-hidden="true" className="w-4 h-4 text-amber-700" />
                  <span>{isHindi ? 'भाषा बदलें (Change Language)' : 'Change Language / भाषा बदलें'}</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                  {isHindi ? 'हिंदी सक्रिय' : 'EN Active'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    !isHindi
                      ? 'bg-slate-950 text-amber-400 shadow-xs ring-2 ring-amber-400/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {!isHindi && <Check aria-hidden="true" className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isHindi
                      ? 'bg-slate-950 text-amber-400 shadow-xs ring-2 ring-amber-400/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>🇮🇳 हिन्दी</span>
                  {isHindi && <Check aria-hidden="true" className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* Navigation Links Inside Hamburger Menu */}
            <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700 pt-1">
              <Link
                href="/#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-900 hover:bg-amber-50 hover:text-amber-800 font-bold transition-colors"
              >
                <Car aria-hidden="true" className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t.navServices}</span>
              </Link>

              <Link
                href="/#monthly-pass"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-900 hover:bg-amber-50 hover:text-amber-800 font-bold transition-colors"
              >
                <Sparkles aria-hidden="true" className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{isHindi ? 'मंथली वॉश पास' : 'Monthly Wash Pass'}</span>
              </Link>

              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Check aria-hidden="true" className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{t.navHowItWorks}</span>
              </Link>

              <Link
                href="/#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Sparkles aria-hidden="true" className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{isHindi ? 'कस्टमर रिव्यू व परिणाम' : 'Customer Reviews'}</span>
              </Link>

              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <HelpCircle aria-hidden="true" className="w-4 h-4 text-slate-600 shrink-0" />
                <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQ'}</span>
              </Link>

              {!isLoggedIn && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User aria-hidden="true" className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>{t.navLogin}</span>
                </Link>
              )}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left w-full mt-1 border-t border-slate-100 pt-3 cursor-pointer"
                >
                  <LogOut aria-hidden="true" className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? 'लॉगआउट करें' : 'Log Out of Account'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Drawer Bottom Action Strip (fills lower screen cleanly) */}
          <div className="pt-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] border-t border-slate-200 space-y-2.5 shrink-0">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>{isHindi ? 'गाड़ी धुलवाएं (अभी बुक करें)' : 'Book Doorstep Wash Now'}</span>
            </Link>
            <a
              href="tel:+919685232340"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-black text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall aria-hidden="true" className="w-3.5 h-3.5" />
              <span>{isHindi ? 'कस्टमर केयर: +91 96852 32340' : 'Call Helpline: +91 96852 32340'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
