import React from 'react';
import HeroSection from '@/components/HeroSection';
import DeferredBelowFold from '@/components/DeferredBelowFold';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section: Headline first, CTA, rate cards & carousel */}
      <HeroSection />

      {/* 2-9. Pincode checker & below-the-fold sections loaded progressively on scroll / interaction */}
      <DeferredBelowFold />
    </div>
  );
}
