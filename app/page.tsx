import React from 'react';
import HeroSection from '@/components/HeroSection';
import AreaAvailabilityChecker from '@/components/AreaAvailabilityChecker';
import ServiceCatalog from '@/components/ServiceCatalog';
import HowItWorks from '@/components/HowItWorks';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import MonthlyPlans from '@/components/MonthlyPlans';
import WhyWashlyComparison from '@/components/WhyWashlyComparison';
import FaqSection from '@/components/FaqSection';
import HomeCtaBanner from '@/components/HomeCtaBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section: Headline first, single CTA, 3 trust chips, real van photo */}
      <HeroSection />

      {/* 2. Pincode & Indore Area Checker: Instant service verification */}
      <AreaAvailabilityChecker />

      {/* 3. Packages: Horizontal swipe snap-cards, vehicle size selector (Hatchback/Sedan/SUV/Bike), dynamic pricing */}
      <ServiceCatalog />

      {/* 4. Kaise Kaam Karta Hai: Compact 4-step process with clean Lucide icons */}
      <HowItWorks />

      {/* 5. Before / After Comparison Slider + Verified Customer Reviews + Live Daily Wash Counter */}
      <BeforeAfterSlider />

      {/* 6. Monthly Wash Pass Subscription: Repeat customer recurring plans */}
      <MonthlyPlans />

      {/* 7. Why Washly Comparison: Honest comparison against local cleaners */}
      <WhyWashlyComparison />

      {/* 8. Frequently Asked Questions: Practical accordion addressing all customer concerns */}
      <FaqSection />

      {/* 9. Final Call-To-Action Banner: First-wash special discount code (WASH50) */}
      <HomeCtaBanner />
    </div>
  );
}
