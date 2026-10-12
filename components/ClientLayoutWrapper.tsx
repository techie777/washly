'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LanguageModal from '@/components/LanguageModal';
import ToastContainer from '@/components/ui/ToastContainer';
import { useAdminThemeStore, applyThemeToDocument } from '@/lib/store/adminThemeStore';

import MobileStickyCta from '@/components/MobileStickyCta';
import SplashScreen from '@/components/SplashScreen';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { currentTheme } = useAdminThemeStore();

  useEffect(() => {
    // 1. Immediately apply the store's current active theme to document
    if (currentTheme) {
      applyThemeToDocument(currentTheme);
    }

    // 2. Synchronize with localStorage for cross-tab or direct store updates
    const syncFromStorage = () => {
      try {
        const stored = localStorage.getItem('doorstep_admin_theme_v2');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.currentTheme) {
            applyThemeToDocument(parsed.state.currentTheme);
          }
        }
      } catch {
        // ignore
      }
    };

    syncFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'doorstep_admin_theme_v2') {
        syncFromStorage();
      }
    };

    const handleThemeApplied = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        applyThemeToDocument(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('doorstep_theme_applied', handleThemeApplied);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('doorstep_theme_applied', handleThemeApplied);
    };
  }, [currentTheme]);

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ToastContainer />
        {children}
      </div>
    );
  }

  return (
    <>
      <SplashScreen />
      <ToastContainer />
      <LanguageModal />
      <Navbar />
      <main className="flex-grow pt-20 pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
      <MobileStickyCta />
    </>
  );
}
