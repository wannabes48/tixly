import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/checkout/'],
    },
    sitemap: 'https://www.tixlyonline.com/sitemap.xml',
  };
}
