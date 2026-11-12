'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const QuickPricingSection = dynamic(() => import('@/components/QuickPricingSection'), {
  ssr: false,
  loading: () => <div className="min-h-[520px]" aria-hidden="true" />,
});
const AreaAvailabilityChecker = dynamic(() => import('@/components/AreaAvailabilityChecker'), { ssr: false });
const ServiceCatalog = dynamic(() => import('@/components/ServiceCatalog'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
const BeforeAfterSlider = dynamic(() => import('@/components/BeforeAfterSlider'), { ssr: false });
const MonthlyPlans = dynamic(() => import('@/components/MonthlyPlans'), { ssr: false });
const WhyWashlyComparison = dynamic(() => import('@/components/WhyWashlyComparison'), { ssr: false });
const FaqSection = dynamic(() => import('@/components/FaqSection'), { ssr: false });
const HomeCtaBanner = dynamic(() => import('@/components/HomeCtaBanner'), { ssr: false });

const BELOW_FOLD_HASHES = new Set([
  '#quick-pricing',
  '#packages',
  '#how-it-works',
  '#reviews',
  '#monthly-pass',
  '#monthly-plans',
  '#faq',
]);

export default function DeferredBelowFold() {
  const [loadPricing, setLoadPricing] = useState(false);
  const [loadRest, setLoadRest] = useState(false);
  const pricingSentinelRef = useRef<HTMLDivElement | null>(null);
  const restSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loadPricing && loadRest) return;

    const triggerAll = () => {
      setLoadPricing(true);
      setLoadRest(true);
    };

    if (typeof window !== 'undefined' && BELOW_FOLD_HASHES.has(window.location.hash)) {
      triggerAll();
      return;
    }

    const pricingObserver =
      !loadPricing && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                setLoadPricing(true);
                pricingObserver?.disconnect();
              }
            },
            { rootMargin: '0px 0px' }
          )
        : null;

    if (pricingObserver && pricingSentinelRef.current) {
      pricingObserver.observe(pricingSentinelRef.current);
    }

    const restObserver =
      !loadRest && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                setLoadPricing(true);
                setLoadRest(true);
                restObserver?.disconnect();
              }
            },
            { rootMargin: '40px 0px' }
          )
        : null;

    if (restObserver && restSentinelRef.current) {
      restObserver.observe(restSentinelRef.current);
    }

    const handleHashChange = () => {
      if (BELOW_FOLD_HASHES.has(window.location.hash)) {
        triggerAll();
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 80) {
        triggerAll();
      }
    };

    const handleFirstInteraction = () => {
      triggerAll();
    };

    window.addEventListener('hashchange', handleHashChange, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true, once: true });

    return () => {
      pricingObserver?.disconnect();
      restObserver?.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [loadPricing, loadRest]);

  useEffect(() => {
    if (!loadRest || typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !BELOW_FOLD_HASHES.has(hash)) return;
    const targetId = hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
    return () => clearTimeout(timer);
  }, [loadRest]);

  return (
    <>
      {!loadPricing ? (
        <div ref={pricingSentinelRef} className="min-h-[520px]" aria-hidden="true">
          <span id="quick-pricing" className="block scroll-mt-24" />
        </div>
      ) : (
        <QuickPricingSection />
      )}

      {!loadRest ? (
        <div ref={restSentinelRef} className="min-h-[240px]" aria-hidden="true">
          <span id="packages" className="block scroll-mt-24" />
          <span id="how-it-works" className="block scroll-mt-24" />
          <span id="reviews" className="block scroll-mt-24" />
          <span id="monthly-pass" className="block scroll-mt-24" />
          <span id="monthly-plans" className="block scroll-mt-24" />
          <span id="faq" className="block scroll-mt-24" />
        </div>
      ) : (
        <>
          <div className="below-fold">
            <AreaAvailabilityChecker />
          </div>
          <div className="below-fold">
            <ServiceCatalog />
          </div>
          <div className="below-fold">
            <HowItWorks />
          </div>
          <div className="below-fold">
            <BeforeAfterSlider />
          </div>
          <div className="below-fold">
            <MonthlyPlans />
          </div>
          <div className="below-fold">
            <WhyWashlyComparison />
          </div>
          <div className="below-fold">
            <FaqSection />
          </div>
          <div className="below-fold">
            <HomeCtaBanner />
          </div>
        </>
      )}
    </>
  );
}
