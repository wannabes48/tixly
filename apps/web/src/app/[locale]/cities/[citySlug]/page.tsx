import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

import Image from 'next/image';
const MOCK_CITY = {
  name: 'New York/New Jersey',
  slug: 'new-york-new-jersey',
  countryCode: 'US',
  imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1200',
  description: 'Experience the magic of the Big Apple and New Jersey. A cultural melting pot ready to host the biggest matches of the 2026 World Cup.',
};

const MOCK_STADIUMS = [
  { slug: 'metlife-stadium', name: 'MetLife Stadium', capacity: 82500, city: 'New York/New Jersey' }
];

const MOCK_MATCHES = [
  {
    id: 'm2', slug: 'match-15-arg-bra', matchNumber: 15, round: 'Group Stage', group: 'C', kickoffUtc: new Date('2026-06-15T18:00:00Z'), status: 'SCHEDULED',
    homeTeam: { name: 'Argentina', flagUrl: 'https://flagcdn.com/w320/ar.png' },
    awayTeam: { name: 'Brazil', flagUrl: 'https://flagcdn.com/w320/br.png' },
    stadium: MOCK_STADIUMS[0]
  }
];

import { cache } from 'react';
import { Metadata } from 'next';

const getCityData = cache(async (citySlug: string) => {
  try {
    const possibleCityNames = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const stadiums = await prisma.stadium.findMany({
      where: { city: { contains: possibleCityNames.split(' ')[0] } }
    });
    
    let matches: any[] = [];
    if (stadiums.length > 0) {
      matches = await prisma.match.findMany({
        where: { 
          stadiumId: { in: stadiums.map(s => s.id) },
          kickoffUtc: { gt: new Date() }
        },
        include: { homeTeam: true, awayTeam: true, stadium: true },
        orderBy: { kickoffUtc: 'asc' }
      });
    }
    return { stadiums, matches, possibleCityNames };
  } catch (e) {
    return { stadiums: [], matches: [], possibleCityNames: '' };
  }
});

export async function generateMetadata({ params }: { params: { citySlug: string } }): Promise<Metadata> {
  let { stadiums, possibleCityNames } = await getCityData(params.citySlug);
  
  let cityName = possibleCityNames || params.citySlug;
  if (params.citySlug === 'new-york-new-jersey') cityName = 'New York/New Jersey';
  else if (stadiums.length > 0) cityName = stadiums[0].city;

  return {
    title: `${cityName} Host City — World Cup 2026 Tickets`,
    description: `Experience the World Cup in ${cityName}. Find match tickets, stadium guides, and things to do in the host city.`,
    alternates: {
      canonical: `/cities/${params.citySlug}`,
    }
  };
}

export default async function CityDetailPage({ params }: { params: { locale: string; citySlug: string } }) {
  let { stadiums, matches } = await getCityData(params.citySlug);

  // Fallback
  let cityDetails = MOCK_CITY;
  if (params.citySlug !== 'new-york-new-jersey' && stadiums.length > 0) {
    cityDetails = {
      name: stadiums[0].city,
      slug: params.citySlug,
      countryCode: stadiums[0].countryCode,
      imageUrl: 'https://images.unsplash.com/photo-1518481612222-68bbe828def1?auto=format&fit=crop&q=80&w=1200',
      description: `Welcome to ${stadiums[0].city}, a spectacular host for the 2026 World Cup.`
    };
  }

  const displayStadiums = stadiums.length > 0 ? stadiums : MOCK_STADIUMS;
  const displayMatches = matches.length > 0 ? matches : MOCK_MATCHES;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.tixlyonline.com/" },
      { "@type": "ListItem", "position": 2, "name": "Cities", "item": "https://www.tixlyonline.com/cities" },
      { "@type": "ListItem", "position": 3, "name": cityDetails.name }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-end pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <Image src={cityDetails.imageUrl} alt={cityDetails.name} className="w-full h-full object-cover" width={800} height={600} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <Link href={`/cities`} className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cities
          </Link>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
            {cityDetails.name}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            {cityDetails.description}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        
        {/* Stadiums */}
        <section>
          <h2 className="text-2xl font-bold text-[#0a192f] mb-6">Host Stadiums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayStadiums.map((stadium) => (
              <Link href={`/stadiums/${stadium.slug}`} key={stadium.slug}>
                <Card className="rounded-2xl border-none shadow-md hover:shadow-xl transition-all bg-white overflow-hidden group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#0a192f] group-hover:text-[#ff6b00] transition-colors">{stadium.name}</h3>
                      <MapPin className="text-slate-400 w-5 h-5" />
                    </div>
                    <p className="text-slate-500">Capacity: {stadium.capacity ? stadium.capacity.toLocaleString() : '80,000'}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Matches */}
        <section>
          <h2 className="text-2xl font-bold text-[#0a192f] mb-6">Upcoming Matches</h2>
          <div className="space-y-4">
            {displayMatches.map((match: any) => {
              const date = new Date(match.kickoffUtc);
              return (
                <Card key={match.id} className="rounded-2xl border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-0 flex flex-col sm:flex-row items-center">
                    <div className="bg-slate-100 sm:w-48 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200 h-full w-full">
                      <span className="text-sm font-semibold text-[#ff6b00] uppercase tracking-wider mb-1">
                        {match.round}
                      </span>
                      <span className="text-2xl font-bold text-[#0a192f]">
                        {format(date, 'MMM do')}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {format(date, 'h:mm a')}
                      </span>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <span className="font-bold text-lg text-[#0a192f]">
                            {match.homeTeam?.name}
                          </span>
                          <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
                            {match.homeTeam?.flagUrl && <Image src={match.homeTeam.flagUrl} alt="flag" className="w-full h-full object-cover" width={120} height={80} />}
                          </div>
                        </div>
                        <div className="font-bold text-slate-400">VS</div>
                        <div className="flex items-center gap-3 flex-1 justify-start">
                          <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
                            {match.awayTeam?.flagUrl && <Image src={match.awayTeam.flagUrl} alt="flag" className="w-full h-full object-cover" width={120} height={80} />}
                          </div>
                          <span className="font-bold text-lg text-[#0a192f]">
                            {match.awayTeam?.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <MapPin className="w-4 h-4" />
                        <span>{match.stadium?.name}</span>
                      </div>
                    </div>

                    <div className="p-6 sm:w-48 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-100 h-full w-full">
                      <Link href={`/matches/${match.id}`} className="w-full">
                        <Button className="w-full rounded-xl bg-[#ff6b00] hover:bg-[#e66000] text-white font-semibold">
                          <img src="/ticket.png" alt="Ticket" className="w-4 h-4 mr-2 object-contain" />
                          Tickets
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}

export const revalidate = 300;
