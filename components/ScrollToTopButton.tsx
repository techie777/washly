'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function ScrollToTopButton() {
  const { isHindi } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const visible = window.scrollY > 320;
      setIsVisible((prev) => (prev !== visible ? visible : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={isHindi ? 'पेज के ऊपर जाएं' : 'Scroll to top'}
      title={isHindi ? 'ऊपर जाएं' : 'Back to top'}
      className="fixed z-40 flex items-center justify-center transition-transform duration-200 cursor-pointer group outline-none select-none bottom-20 right-4 sm:bottom-8 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/50 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
    >
      <ArrowUp aria-hidden="true" className="w-5 h-5 text-amber-400 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
      <span className="sr-only">{isHindi ? 'ऊपर जाएं' : 'Scroll to top'}</span>
    </button>
  );
}
