import { Link } from '@/navigation';
import { notFound } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react';
import { prisma } from '@tixly/database';
import { LocalTime } from '@/components/LocalTime';
import { cache } from 'react';
import { ListingsTable } from '@/components/match/ListingsTable';
import Script from 'next/script';

import Image from 'next/image';
// Cache the match query so metadata and page components don't trigger duplicate DB calls
const getMatch = cache(async (matchId: string) => {
  return await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
      listings: {
        where: { status: 'ACTIVE' },
        orderBy: { pricePerTicket: 'asc' },
      },
    },
  });
});

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { matchId: string };
}) {
  const match = await getMatch(params.matchId);
  if (!match) return {};

  const lowestPrice = match.listings[0]?.pricePerTicket;

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} — Tickets | Tixly`,
    description: `Buy tickets for ${match.homeTeam.name} vs ${match.awayTeam.name} at ${match.stadium.name}, ${match.stadium.city}. ${match.round} - FIFA World Cup 2026.`,
    openGraph: {
      type: 'website',
      title: `${match.homeTeam.name} vs ${match.awayTeam.name} Tickets`,
      description: `Get your tickets for the World Cup 2026 ${match.round} match.`,
    },
    other: {
      // Ticombo-style custom open graph price properties
      ...(lowestPrice ? {
        'og:price:amount': lowestPrice.toString(),
        'og:price:currency': 'USD',
      } : {}),
    },
  };
}

export default async function MatchDetailPage({
  params,
  searchParams,
}: {
  params: { matchId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const match = await getMatch(params.matchId);
  if (!match) notFound();

  const isUpcoming = new Date(match.kickoffUtc).getTime() > Date.now();
  
  // Extract initial quantity from URL
  const initialQuantity = typeof searchParams.quantity === 'string' ? parseInt(searchParams.quantity) : 1;

  // JSON-LD Event schema
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${match.homeTeam.name} vs ${match.awayTeam.name} - ${match.round}`,
    "startDate": match.kickoffUtc.toISOString(),
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": match.stadium.name,
      "address": `${match.stadium.city}, ${match.stadium.countryCode}`
    },
    ...(match.listings.length > 0 && {
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": match.listings[0].pricePerTicket.toString(),
        "highPrice": match.listings[match.listings.length - 1].pricePerTicket.toString(),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
      }
    }),
    "organizer": { "@type": "Organization", "name": "FIFA" }
  };

  const prices = match.listings.map((l) => Number(l.pricePerTicket));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;

  return (
    <main className="min-h-screen bg-[#f9fafb] pb-20">
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {/* ──────────────── Hero Header ──────────────── */}
      <div className="bg-brand-navy text-white pt-24 pb-14 relative overflow-hidden">
        {/* Decorative elements omitted for brevity, keeping structure intact */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-midblue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/matches" className="hover:text-white transition-colors">Matches</Link>
            <ChevronRight size={14} />
            <span className="text-white/70">{match.round}</span>
            <ChevronRight size={14} />
            <span className="text-white/90 font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</span>
          </nav>

          <div className="text-center mb-6">
            <span className="inline-block bg-brand-orange text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
              {match.round} {match.group ? `· ${match.group}` : ''}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-8">
            <div className="text-center">
              <div className="text-7xl mb-4 h-28 flex justify-center items-center">
                {match.homeTeam.flagUrl ? <Image src={match.homeTeam.flagUrl} alt="flag" className="h-full w-auto object-contain rounded-md shadow-lg border border-white/10" width={160} height={112} /> : '🏳️'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{match.homeTeam.name}</h1>
            </div>
            <div className="shrink-0">
              <span className="text-xl font-black text-white/30 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">VS</span>
            </div>
            <div className="text-center">
              <div className="text-7xl mb-4 h-28 flex justify-center items-center">
                {match.awayTeam.flagUrl ? <Image src={match.awayTeam.flagUrl} alt="flag" className="h-full w-auto object-contain rounded-md shadow-lg border border-white/10" width={160} height={112} /> : '🏳️'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{match.awayTeam.name}</h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-base text-white/70">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-brand-orange" />
              <span><LocalTime date={match.kickoffUtc} format="date" /> &bull; <LocalTime date={match.kickoffUtc} format="time" /></span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <MapPin size={18} className="text-brand-orange" />
              <Link href={`/stadiums/${match.stadium.slug}`} className="hover:underline">
                {match.stadium.name}, {match.stadium.city}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Content Area ──────────────── */}
      <div className="container mx-auto px-4 -mt-4 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 w-full">
            <ListingsTable matchId={match.id} initialQuantity={initialQuantity} />
          </div>

          {/* ─── Sidebar Info Panel ─── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden sticky top-24">
              <div className="w-full h-48 bg-gray-200">
                <iframe
                  width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCWlCjyA5PUYr3CHOaO8QJQgqUqcxtvDTs&q=${encodeURIComponent(match.stadium.name + ', ' + match.stadium.city)}`}
                ></iframe>
              </div>
              
              <div className="p-6">
                <h3 className="text-base font-black text-brand-navy mb-4">Venue Info</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-midblue shrink-0 mt-0.5" />
                    <div>
                      <Link href={`/stadiums/${match.stadium.slug}`} className="text-sm font-bold text-brand-navy hover:underline">
                        {match.stadium.name}
                      </Link>
                      <div className="text-sm text-gray-500">{match.stadium.city}, {match.stadium.countryCode}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-brand-midblue shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-brand-navy">Capacity</div>
                      <div className="text-sm text-gray-500">{match.stadium.capacity.toLocaleString()} seats</div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/stadiums/${match.stadium.slug}`}
                  className="block w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-brand-navy text-sm font-bold text-center transition-colors mb-3 border border-gray-200"
                >
                  View Stadium Layout
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
