'use client';

import React, { useState } from 'react';
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Official Washly Yellow & Black Logo */}
        <Link href="/" className="flex items-center group shrink-0 py-0.5" aria-label="Washly Home">
          <Image
            src="/images/washly-yellow-black-logo.png"
            alt="Washly Doorstep Car Care"
            width={160}
            height={60}
            priority
            className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Clean, Uncluttered Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold text-slate-700">
          <Link href="/#packages" className="hover:text-amber-500 transition-colors">
            {t.navServices}
          </Link>
          <Link href="/#how-it-works" className="hover:text-amber-500 transition-colors">
            {t.navHowItWorks}
          </Link>
          <Link href="/#reviews" className="hover:text-amber-500 transition-colors">
            {isHindi ? 'कस्टमर रिव्यू' : 'Reviews'}
          </Link>
          <Link href="/#monthly-pass" className="hover:text-amber-500 transition-colors">
            {isHindi ? 'मंथली पास' : 'Monthly Pass'}
          </Link>
          <Link href="/#faq" className="hover:text-amber-500 transition-colors">
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
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Hamburger Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="bg-white border-b border-slate-200 px-4 py-4 space-y-3.5 max-h-[85vh] overflow-y-auto shadow-xl animate-in slide-in-from-top-2 duration-150">
          
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
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Indore</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    +91 {user.phone}
                  </div>
                </div>
              </div>
              <Link
                href="/profile?tab=profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-300 text-slate-700 text-xs font-bold transition-all shrink-0 shadow-2xs"
              >
                {isHindi ? 'खाता' : 'Account'}
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
              <span className="text-slate-500">
                {isHindi ? 'कार्यक्षेत्र शहर:' : 'Service City:'}
              </span>
              <span className="font-bold text-amber-700 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.serviceCity} (Doorstep)</span>
              </span>
            </div>
          )}
          
          {/* Language Change Option Inside Hamburger Menu */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'भाषा बदलें (Change Language)' : 'Change Language / भाषा बदलें'}</span>
              </span>
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                {isHindi ? 'हिंदी सक्रिय' : 'EN Active'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  !isHindi
                    ? 'bg-slate-950 text-amber-400 shadow-xs ring-2 ring-amber-400/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🇬🇧 English</span>
                {!isHindi && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isHindi
                    ? 'bg-slate-950 text-amber-400 shadow-xs ring-2 ring-amber-400/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🇮🇳 हिन्दी</span>
                {isHindi && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Navigation Links Inside Hamburger Menu */}
          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700 pt-1">
            <Link 
              href="/#packages" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-amber-50 hover:text-amber-800 font-bold transition-colors"
            >
              <Car className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.navServices}</span>
            </Link>

            <Link 
              href="/#monthly-pass" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-amber-50 hover:text-amber-800 font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isHindi ? 'मंथली वॉश पास' : 'Monthly Wash Pass'}</span>
            </Link>

            <Link 
              href="/#how-it-works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Check className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{t.navHowItWorks}</span>
            </Link>

            <Link 
              href="/#reviews" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{isHindi ? 'कस्टमर रिव्यू व परिणाम' : 'Customer Reviews'}</span>
            </Link>

            <Link 
              href="/#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQ'}</span>
            </Link>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left w-full mt-1 border-t border-slate-100 pt-2.5"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'लॉगआउट करें' : 'Log Out of Account'}</span>
              </button>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
