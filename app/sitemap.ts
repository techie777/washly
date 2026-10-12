import { MetadataRoute } from 'next';
import { LUXURY_SERVICES, SERVICEABLE_CITIES } from '@/lib/seedData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://doorstepcarwash.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/book`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Programmatic dynamic service x city local SEO pages
  const localSeoRoutes: MetadataRoute.Sitemap = [];

  for (const service of LUXURY_SERVICES) {
    for (const city of SERVICEABLE_CITIES) {
      localSeoRoutes.push({
        url: `${SITE_URL}/services/${service.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  return [...staticRoutes, ...localSeoRoutes];
}
