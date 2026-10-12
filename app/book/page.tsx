import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import BookingWizard from '@/components/booking/BookingWizard';

export const metadata: Metadata = {
  title: 'Book Doorstep Car Wash & Bike Wash | Fast & Sparkling Clean | Washly',
  description: 'Schedule your doorstep car or bike wash in Indore. Pure water and silent power onboard with zero hassle.',
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-[#FAFAF9] to-white py-4 sm:py-8 relative overflow-hidden">
      {/* Decorative ambient golden glow orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-300/15 via-yellow-400/10 to-amber-200/10 blur-3xl rounded-full -z-10" />
      <div className="pointer-events-none absolute top-1/2 -right-32 w-80 h-80 bg-amber-200/15 blur-3xl rounded-full -z-10" />

      <h1 className="sr-only">Book Doorstep Car & Bike Wash</h1>

      <Suspense fallback={
        <div className="max-w-md mx-auto p-12 text-center text-slate-500 text-xs">
          लोड हो रहा है...
        </div>
      }>
        <BookingWizard />
      </Suspense>
    </div>
  );
}
