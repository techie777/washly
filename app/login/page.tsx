'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Car,
  AlertCircle,
  HelpCircle 
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useTranslation } from '@/lib/translations';

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile?tab=orders';

  const { isLoggedIn, login } = useAuthStore();
  const { t, isHindi } = useTranslation();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // If already logged in, redirect to profile
  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectUrl);
    }
  }, [isLoggedIn, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    if (pin.length !== 4) {
      setErrorMsg('Please enter a 4-digit secret PIN.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          pin,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Successful login/registration
      login(data.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Image
              src="/images/washly-logo.png"
              alt="Washly Doorstep Car Care"
              width={160}
              height={120}
              priority
              className="h-20 w-auto mx-auto mb-2 object-contain filter drop-shadow-sm"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.loginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {t.loginSub}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.instantAccessBadge}</span>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.whatsAppNumber}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm font-semibold">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9820048822"
                  className="w-full pl-13 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isHindi ? 'अपना 10-अंकों का मोबाइल नंबर दर्ज करें।' : 'Enter your 10-digit mobile phone number.'}
              </p>
            </div>

            {/* 4-Digit PIN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.pinLabel}
                </label>
                <span className="text-[11px] text-amber-700 font-bold">
                  {isHindi ? 'पिन दर्ज करें' : 'Set or enter PIN'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base tracking-widest font-bold placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {t.pinSub}
              </p>
            </div>

            {/* Optional Name (toggle or show) */}
            <div>
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isRegisterMode ? (isHindi ? '- नाम छुपाएं' : '- Hide Name Field') : (isHindi ? '+ अपना नाम जोड़ें (वैकल्पिक)' : '+ Add / Update Name (Optional)')}</span>
              </button>

              {isRegisterMode && (
                <div className="mt-2.5 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHindi ? "आपका पूरा नाम (उदा. राहुल शर्मा)" : "Your Full Name (e.g. Rahul Sharma)"}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || phone.length !== 10 || pin.length !== 4}
                className="w-full py-3.5 px-5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 disabled:opacity-50 disabled:cursor-not-allowed font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>{isHindi ? 'सत्यापित हो रहा है...' : 'Authenticating...'}</span>
                ) : (
                  <>
                    <span>{t.proceedBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guarantee Badges */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.directPinBadge}</span>
            </span>
          </div>
        </div>

        {/* Quick Help & Track link */}
        <div className="mt-6 text-center space-y-2 text-xs text-slate-500">
          <div>
            Need immediate booking assistance?{' '}
            <a href="tel:+919685232340" className="text-amber-800 font-bold hover:underline">
              Call Helpline (+91 9685232340)
            </a>
          </div>
          <div>
            Or simply{' '}
            <Link href="/track" className="text-slate-700 font-semibold hover:underline">
              Track Single Booking by ID
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
        Loading login...
      </div>
    }>
      <CustomerLoginForm />
    </Suspense>
  );
}
