import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { 
  LUXURY_SERVICES, 
  SERVICEABLE_CITIES, 
  LOCAL_FAQS 
} from '@/lib/seedData';
import { 
  generateAutomotiveBusinessSchema, 
  generateServiceSchema, 
  generateFaqSchema, 
  generateBreadcrumbSchema 
} from '@/lib/seo';
import LocalSeoHero from '@/components/local-seo/LocalSeoHero';
import LocalServicePincodes from '@/components/local-seo/LocalServicePincodes';
import LocalReviewsWidget from '@/components/local-seo/LocalReviewsWidget';
import LocalFaqSection from '@/components/local-seo/LocalFaqSection';
import Link from 'next/link';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';

interface PageProps {
  params: Promise<{
    'service-slug': string;
    city: string;
  }>;
}

export async function generateStaticParams() {
  const paths: Array<{ 'service-slug': string; city: string }> = [];
  
  for (const service of LUXURY_SERVICES) {
    for (const city of SERVICEABLE_CITIES) {
      paths.push({
        'service-slug': service.slug,
        city: city.slug,
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'service-slug': serviceSlug, city: citySlug } = await params;
  
  const service = LUXURY_SERVICES.find((s) => s.slug === serviceSlug);
  const city = SERVICEABLE_CITIES.find((c) => c.slug === citySlug);

  if (!service || !city) {
    return {
      title: 'Service Not Found | Washly Doorstep Car Care',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doorstepcarwash.com';
  const title = `${service.name} in ${city.city} | Washly Doorstep Car Care`;
  const description = `Book professional ${service.name.toLowerCase()} in ${city.city}. Autonomous mobile van with 100% pure soft water & silent power arrives at your doorstep. Zero electricity or water required from you.`;
  const canonicalUrl = `${siteUrl}/services/${service.slug}/${city.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: '/images/washly-logo.png',
          width: 658,
          height: 494,
          alt: `${service.name} in ${city.city}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/washly-logo.png'],
    },
  };
}

export default async function LocalSeoPage({ params }: PageProps) {
  const { 'service-slug': serviceSlug, city: citySlug } = await params;

  const service = LUXURY_SERVICES.find((s) => s.slug === serviceSlug);
  const city = SERVICEABLE_CITIES.find((c) => c.slug === citySlug);

  if (!service || !city) {
    notFound();
  }

  // Generate Structured JSON-LD schemas
  const autoRepairSchema = generateAutomotiveBusinessSchema(city);
  const serviceSchema = generateServiceSchema(service, city);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/#services' },
    { name: service.name, url: `/services/${service.slug}/${city.slug}` },
    { name: city.city, url: `/services/${service.slug}/${city.slug}` },
  ]);
  const faqSchema = generateFaqSchema([
    {
      question: `Is Washly authorized to service vehicles in gated societies in ${city.city}?`,
      answer: `Yes, Washly mobile units are approved across all major residential complexes and gated communities in ${city.city} with silent inverter generators and closed-loop wastewater containment.`,
    },
    ...LOCAL_FAQS,
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Inject Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoRepairSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Local SEO Hero Section */}
      <LocalSeoHero service={service} city={city} />

      {/* 2. Serviceable Pin Codes & Neighborhood Corridors */}
      <LocalServicePincodes city={city} />

      {/* 3. Local Google Reviews & Verified Feedback */}
      <LocalReviewsWidget city={city} service={service} />

      {/* 4. Hyper-Local FAQ Section */}
      <LocalFaqSection city={city} service={service} />

      {/* 5. Bottom Local Booking Prompt */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-400/40 text-white shadow-xl">
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Schedule {service.name} at Your {city.city} Address
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8">
              Select your vehicle and pick your preferred 2-hour window today. Pay securely online or post-inspection via Cash on Delivery or UPI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/book?service=${service.slug}&city=${city.slug}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Book Slot in {city.city}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
