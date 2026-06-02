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
import dynamic from 'next/dynamic';

const StadiumChartModal = dynamic(() => import('@/components/matches/StadiumChartModal'), { ssr: false });

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
      images: match.stadium.imageUrl ? [{ url: match.stadium.imageUrl, width: 1200, height: 630 }] : [],
    },
    other: {
      // Ticombo-style custom open graph price properties
      ...(lowestPrice ? {
        'og:price:amount': lowestPrice.toString(),
        'og:price:currency': 'USD',
      } : {}),
    },
    alternates: {
      canonical: `/matches/${match.id}`,
    }
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
      "address": {
        "@type": "PostalAddress",
        "addressLocality": match.stadium.city,
        "addressCountry": match.stadium.countryCode
      }
    },
    ...(match.listings.length > 0 && {
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": match.listings[0].pricePerTicket.toString(),
        "highPrice": match.listings[match.listings.length - 1].pricePerTicket.toString(),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `https://www.tixlyonline.com/en/matches/${match.id}`
      }
    }),
    "organizer": { "@type": "Organization", "name": "FIFA" }
  };

  // JSON-LD Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.tixlyonline.com/" },
      { "@type": "ListItem", "position": 2, "name": "Matches", "item": "https://www.tixlyonline.com/matches" },
      { "@type": "ListItem", "position": 3, "name": match.round, "item": `https://www.tixlyonline.com/matches?round=${encodeURIComponent(match.round)}` },
      { "@type": "ListItem", "position": 4, "name": `${match.homeTeam.name} vs ${match.awayTeam.name}` }
    ]
  };

  const prices = match.listings.map((l) => Number(l.pricePerTicket));
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : null;

  return (
    <main className="min-h-screen bg-[#f9fafb] pb-20">
      <script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* ──────────────── Hero Header ──────────────── */}
      <div className="bg-tixNavy text-white pt-24 pb-14 relative overflow-hidden">
        {/* Decorative elements omitted for brevity, keeping structure intact */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-tixSilver/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-tixOrange/10 rounded-full blur-3xl pointer-events-none" />

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
            <span className="inline-block bg-tixOrange text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
              {match.round} {match.group ? `· ${match.group}` : ''}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-8">
            <div className="text-center">
              <div className="text-7xl mb-4 h-28 flex justify-center items-center">
                {match.homeTeam.flagUrl ? <Image src={match.homeTeam.flagUrl} alt="flag" className="h-full w-auto object-contain rounded-md shadow-lg border border-white/10" width={160} height={112} priority /> : '🏳️'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{match.homeTeam.name}</h1>
            </div>
            <div className="shrink-0">
              <span className="text-xl font-black text-white/30 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">VS</span>
            </div>
            <div className="text-center">
              <div className="text-7xl mb-4 h-28 flex justify-center items-center">
                {match.awayTeam.flagUrl ? <Image src={match.awayTeam.flagUrl} alt="flag" className="h-full w-auto object-contain rounded-md shadow-lg border border-white/10" width={160} height={112} priority /> : '🏳️'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{match.awayTeam.name}</h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-base text-white/70">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-tixOrange" />
              <span><LocalTime date={match.kickoffUtc.toISOString()} format="date" /> &bull; <LocalTime date={match.kickoffUtc.toISOString()} format="time" /></span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <MapPin size={18} className="text-tixOrange" />
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
          {/* ─── Sidebar Info Panel (Left) ─── */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden sticky top-24">
              <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
                <Image
                  src={match.stadium.imageUrl || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=600&auto=format&fit=crop"}
                  alt={`${match.stadium.name} view`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-base font-black text-tixNavy mb-4">Venue Info</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-tixNavy shrink-0 mt-0.5" />
                    <div>
                      <Link href={`/stadiums/${match.stadium.slug}`} className="text-sm font-bold text-tixNavy hover:underline">
                        {match.stadium.name}
                      </Link>
                      <div className="text-sm text-gray-500">{match.stadium.city}, {match.stadium.countryCode}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-tixNavy shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-tixNavy">Capacity</div>
                      <div className="text-sm text-gray-500">{match.stadium.capacity.toLocaleString()} seats</div>
                    </div>
                  </div>
                </div>

                <StadiumChartModal 
                  stadiumName={match.stadium.name} 
                  seatingChartUrl={match.stadium.seatingChartUrl}
                />
              </div>
            </div>
          </aside>

          {/* ─── Ticket List (Right) ─── */}
          <div className="flex-1 min-w-0 w-full">
            <ListingsTable matchId={match.id} initialQuantity={initialQuantity} />
          </div>
        </div>
      </div>
    </main>
  );
}
