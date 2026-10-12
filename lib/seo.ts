import { ServicePackage, LocationCity } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://doorstepcarwash.com';

export function generateAutomotiveBusinessSchema(city: LocationCity) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: `Washly Doorstep Car Care - ${city.city}`,
    image: `${SITE_URL}/images/washly-logo.png`,
    '@id': `${SITE_URL}/#autorepair-${city.slug}`,
    url: `${SITE_URL}/services/doorstep-car-wash/${city.slug}`,
    telephone: city.localizedPhone,
    priceRange: '₹150 - ₹450',
    address: {
      '@type': 'PostalAddress',
      streetAddress: city.addressLine,
      addressLocality: city.city,
      addressRegion: city.state,
      postalCode: city.serviceablePincodes[0] || '452010',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.latitude,
      longitude: city.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '07:00',
        closes: '20:00',
      },
    ],
    areaServed: city.serviceablePincodes.map((pin) => ({
      '@type': 'AdministrativeArea',
      name: `${city.city} Pincode ${pin}`,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: city.averageRating.toString(),
      reviewCount: city.totalReviews.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function generateServiceSchema(service: ServicePackage, city?: LocationCity) {
  const minPrice = Math.min(...Object.values(service.vehiclePricing));
  const maxPrice = Math.max(...Object.values(service.vehiclePricing));

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: `${service.name}${city ? ` in ${city.city}` : ''}`,
    description: service.description,
    provider: {
      '@type': 'AutomotiveBusiness',
      name: 'Washly Doorstep Car Care',
      url: SITE_URL,
      telephone: city ? city.localizedPhone : '+91 96852 32340',
    },
    areaServed: city
      ? {
          '@type': 'City',
          name: city.city,
        }
      : undefined,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: minPrice.toString(),
      highPrice: maxPrice.toString(),
      offerCount: Object.keys(service.vehiclePricing).length.toString(),
    },
  };
}

export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
