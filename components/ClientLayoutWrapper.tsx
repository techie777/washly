'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguageStore } from '@/lib/store/languageStore';
import { useNotificationStore } from '@/lib/store/notificationStore';

const LanguageModal = dynamic(() => import('@/components/LanguageModal'), { ssr: false });
const ToastContainer = dynamic(() => import('@/components/ui/ToastContainer'), { ssr: false });
const SplashScreen = dynamic(() => import('@/components/SplashScreen'), { ssr: false });
const MobileStickyCta = dynamic(() => import('@/components/MobileStickyCta'), { ssr: false });
const ScrollToTopButton = dynamic(() => import('@/components/ScrollToTopButton'), { ssr: false });

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { isLanguageModalOpen, hasChosenLanguage } = useLanguageStore();
  const toasts = useNotificationStore((s) => s.toasts);
  const [showSplash, setShowSplash] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('splash=1')) {
      setShowSplash(true);
    }
    const handleReplay = () => setShowSplash(true);
    const onScroll = () => {
      if (window.scrollY > 250) {
        setHasScrolled(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('show_washly_splash', handleReplay);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('show_washly_splash', handleReplay);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    let cleanup = () => {};

    const syncAdminTheme = () => {
      try {
        const stored = localStorage.getItem('doorstep_admin_theme_v2');
        if (!isAdmin && !stored) return;
        const parsed = stored ? JSON.parse(stored) : null;
        const theme = parsed?.state?.currentTheme;
        if (!isAdmin && (!theme || theme.id === 'blue')) return;
        import('@/lib/store/adminThemeStore').then(({ applyThemeToDocument, useAdminThemeStore }) => {
          const active = theme || useAdminThemeStore.getState().currentTheme;
          if (active && (isAdmin || active.id !== 'blue')) {
            applyThemeToDocument(active);
          }
        });
      } catch {
        // ignore
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'doorstep_admin_theme_v2') syncAdminTheme();
    };
    const handleThemeApplied = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        import('@/lib/store/adminThemeStore').then(({ applyThemeToDocument }) => applyThemeToDocument(detail));
      }
    };

    // Defer non-critical admin theme check until after initial paint
    const timer = setTimeout(syncAdminTheme, 0);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('doorstep_theme_applied', handleThemeApplied);
    cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('doorstep_theme_applied', handleThemeApplied);
    };

    return cleanup;
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        {toasts.length > 0 && <ToastContainer />}
        {children}
      </div>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen forceShow={true} onFinish={() => setShowSplash(false)} />}
      {toasts.length > 0 && <ToastContainer />}
      {(isLanguageModalOpen || !hasChosenLanguage) && <LanguageModal />}
      <Navbar />
      <main className="flex-grow pt-[100px] sm:pt-[108px] pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      {hasScrolled && <ScrollToTopButton />}
      {hasScrolled && <MobileStickyCta />}
    </>
  );
}
