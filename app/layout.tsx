import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
  preload: true,
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-devanagari',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://doorstepcarwash.com'),
  title: {
    default: 'Washly | Doorstep Car Care - Indore',
    template: '%s | Washly Doorstep Car Care',
  },
  description: 
    'Washly - Indore’s trusted on-demand doorstep car and bike wash service. Mobile wash units equipped with clean water and power deliver high pressure foam washes, interior vacuuming, and electric rotator shine right at your home.',
  keywords: [
    'Washly',
    'Washly doorstep car care',
    'doorstep car wash Indore',
    'mobile car cleaning Indore',
    'car pressure wash at home',
    'bike foam wash',
    'interior car vacuum cleaning',
    'rotator shine car wash',
    'car wash near me'
  ],
  authors: [{ name: 'Washly Doorstep Car Care' }],
  creator: 'Washly',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://doorstepcarwash.com',
    siteName: 'Washly Doorstep Car Care',
    title: 'Washly | On-Demand Doorstep Car Care at Your Home',
    description: 'Professional car and bike wash at your doorstep in Indore. We bring clean water, high-pressure foam, and power generators.',
    images: [
      {
        url: '/images/washly-logo.png',
        width: 658,
        height: 494,
        alt: 'Washly Doorstep Car Care Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Washly | On-Demand Doorstep Car Care',
    description: 'On-demand doorstep car and bike wash. We bring pure water, foam pressure, and vacuum right to your doorstep.',
    images: ['/images/washly-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: 'Washly Doorstep Car Care',
    image: 'https://doorstepcarwash.com/images/washly-logo.png',
    url: 'https://doorstepcarwash.com',
    logo: 'https://doorstepcarwash.com/images/washly-logo.png',
    description: 'Indore’s trusted on-demand doorstep car and bike wash service with pure water and silent power onboard.',
    telephone: '+91 96852 32340',
    priceRange: '₹150 - ₹450',
    openingHours: 'Mo-Su 07:00-20:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vijay Nagar & AB Road Doorstep Hub',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452010',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.7196,
      longitude: 75.8577,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Indore',
      },
    ],
  };

  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable} ${notoSansDevanagari.variable}`} suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
        />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
