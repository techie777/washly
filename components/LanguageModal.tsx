'use client';

import React, { useEffect, useState } from 'react';
import { Languages, Check, Sparkles, X } from 'lucide-react';
import { useLanguageStore } from '@/lib/store/languageStore';

export default function LanguageModal() {
  const { 
    language, 
    hasChosenLanguage, 
    isLanguageModalOpen, 
    setLanguage, 
    closeLanguageModal 
  } = useLanguageStore();

  const [mounted, setMounted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>(language);

  useEffect(() => {
    setMounted(true);
    setSelectedLang(language);
  }, [language]);

  // Don't render until mounted on client to prevent hydration mismatch
  if (!mounted) return null;

  // Show if explicitly opened OR if it's the first time and hasn't chosen language yet
  const shouldShow = isLanguageModalOpen || !hasChosenLanguage;

  if (!shouldShow) return null;

  const handleConfirm = () => {
    setLanguage(selectedLang);
    closeLanguageModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative animate-fade-in">
        
        {/* Optional close button only if language was previously selected */}
        {hasChosenLanguage && (
          <button
            type="button"
            onClick={closeLanguageModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Icon & Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Languages className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Choose Your Language
          </h2>
          <p className="text-sm font-bold text-amber-800 mt-0.5">
            अपनी पसंदीदा भाषा चुनें
          </p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Select your preferred language. You can change this anytime from your account settings.
          </p>
        </div>

        {/* Language Options Grid */}
        <div className="space-y-3 mb-6">
          
          {/* English Option */}
          <button
            type="button"
            onClick={() => setSelectedLang('en')}
            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              selectedLang === 'en'
                ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/20'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>English</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Clean & fast booking experience
                </div>
              </div>
            </div>
            {selectedLang === 'en' && (
              <div className="w-6 h-6 rounded-full bg-slate-950 border border-amber-400 text-amber-400 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Hindi Option */}
          <button
            type="button"
            onClick={() => setSelectedLang('hi')}
            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              selectedLang === 'hi'
                ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/20'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>हिंदी (Hindi)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    आसान भाषा
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  इंदौर में सरल व आसान हिंदी में बुकिंग
                </div>
              </div>
            </div>
            {selectedLang === 'hi' && (
              <div className="w-6 h-6 rounded-full bg-slate-950 border border-amber-400 text-amber-400 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            )}
          </button>

        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {selectedLang === 'hi' ? 'हिंदी में आगे बढ़ें' : 'Continue in English'}
          </span>
        </button>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-slate-400">
            {selectedLang === 'hi'
              ? 'आप इसे कभी भी "मेरा खाता" से बदल सकते हैं।'
              : 'You can change language anytime from "My Account".'}
          </span>
        </div>

      </div>
    </div>
  );
}
