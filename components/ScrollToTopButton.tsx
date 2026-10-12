'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function ScrollToTopButton() {
  const { isHindi } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 320px
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed z-40 flex items-center justify-center transition-all duration-300 cursor-pointer group outline-none select-none ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
      } bottom-20 right-4 sm:bottom-8 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-950/90 hover:bg-black text-amber-400 border border-amber-400/50 shadow-xl shadow-black/40 hover:shadow-amber-400/20 hover:scale-105 active:scale-95 backdrop-blur-md`}
    >
      <ArrowUp className="w-5 h-5 text-amber-400 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
      <span className="sr-only">{isHindi ? 'ऊपर जाएं' : 'Scroll to top'}</span>
    </button>
  );
}
