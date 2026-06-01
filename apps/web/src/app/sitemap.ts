import { MetadataRoute } from 'next';
import { prisma } from '@tixly/database';

const baseUrl = 'https://www.tixlyonline.com';
const locales = ['en', 'es', 'fr', 'pt', 'ar', 'de'];

function getAlternates(path: string) {
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}${path}`;
  });
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic entities
  const [matches, teams, stadiums] = await Promise.all([
    prisma.match.findMany({ select: { id: true, kickoffUtc: true } }),
    prisma.team.findMany({ select: { slug: true } }),
    prisma.stadium.findMany({ select: { slug: true, city: true } }),
  ]);

  const uniqueCities = Array.from(new Set(stadiums.map(s => s.city.toLowerCase().replace(/ /g, '-'))));

  const routes = [
    '',
    '/matches',
    '/teams',
    '/cities',
    '/stadiums',
    '/sell',
    '/how-it-works'
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
    alternates: getAlternates(route),
  }));

  const matchEntries: MetadataRoute.Sitemap = matches.map((match) => ({
    url: `${baseUrl}/en/matches/${match.id}`,
    lastModified: match.kickoffUtc,
    changeFrequency: 'hourly' as const,
    priority: 0.9,
    alternates: getAlternates(`/matches/${match.id}`),
  }));

  const teamEntries: MetadataRoute.Sitemap = teams.map((team) => ({
    url: `${baseUrl}/en/teams/${team.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: getAlternates(`/teams/${team.slug}`),
  }));

  const stadiumEntries: MetadataRoute.Sitemap = stadiums.map((stadium) => ({
    url: `${baseUrl}/en/stadiums/${stadium.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: getAlternates(`/stadiums/${stadium.slug}`),
  }));

  const cityEntries: MetadataRoute.Sitemap = uniqueCities.map((city) => ({
    url: `${baseUrl}/en/cities/${city}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: getAlternates(`/cities/${city}`),
  }));

  return [...staticEntries, ...matchEntries, ...teamEntries, ...stadiumEntries, ...cityEntries];
}
