'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/translations';

interface SplashScreenProps {
  forceShow?: boolean;
  onFinish?: () => void;
}

export default function SplashScreen({ forceShow = false, onFinish }: SplashScreenProps) {
  const { isHindi } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleReplay = () => {
      setProgress(0);
      setIsDone(false);
      setVisible(true);
    };
    window.addEventListener('show_washly_splash', handleReplay);

    // Only display if explicitly forced or requested via query parameter
    if (forceShow || (typeof window !== 'undefined' && window.location.search.includes('splash=1'))) {
      setVisible(true);
    }

    return () => window.removeEventListener('show_washly_splash', handleReplay);
  }, [forceShow, onFinish]);

  useEffect(() => {
    if (!visible) return;

    // Snappy, lightweight 350ms animation that never hurts Web Vitals
    const intervalTime = 25; // 25ms step
    const totalSteps = 14; // ~350ms total
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const currentProgress = Math.min(100, Math.round((step / totalSteps) * 100));
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setIsDone(true);
        try {
          sessionStorage.setItem('washly_splash_viewed', 'true');
        } catch {}

        setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 180);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [visible, onFinish]);

  const handleDismiss = () => {
    setIsDone(true);
    try {
      sessionStorage.setItem('washly_splash_viewed', 'true');
    } catch {}
    setVisible(false);
    if (onFinish) onFinish();
  };

  if (!mounted || !visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-300 select-none cursor-pointer ${
        isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Washly Splash Screen"
    >
      {/* Subtle Soft Warm Ambient Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Skip Hint (Top-Right) */}
      <button
        onClick={handleDismiss}
        type="button"
        className="absolute top-5 right-5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-1 rounded-full bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 shadow-2xs"
      >
        {isHindi ? 'छोड़ें' : 'Skip'} ✕
      </button>

      {/* Main Brand Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Official Washly Yellow & Black Logo for Light Background */}
        <div className="relative mb-3">
          <Image
            src="/images/washly-yellow-black-logo.png"
            alt="Washly Doorstep Car Care"
            width={240}
            height={85}
            priority
            className="w-48 sm:w-56 h-auto object-contain transition-transform duration-500 scale-100"
          />
        </div>

        {/* Minimal Tagline */}
        <p className="text-xs text-slate-500 font-semibold tracking-wider">
          {isHindi ? 'डोरस्टेप कार केयर • इंदौर' : 'Doorstep Car Care • Indore'}
        </p>

        {/* Ultra-Slim Golden Progress Line */}
        <div className="w-36 sm:w-44 h-1 rounded-full bg-slate-100 overflow-hidden mt-6 p-0 border border-slate-200/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
