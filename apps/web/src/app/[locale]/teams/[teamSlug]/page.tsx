import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Trophy, ArrowLeft, Ticket } from 'lucide-react';
import { format } from 'date-fns';

import Image from 'next/image';
const MOCK_TEAMS: Record<string, any> = {
  argentina: { id: 'arg', slug: 'argentina', name: 'Argentina', countryCode: 'AR', confederation: 'CONMEBOL', flagUrl: 'https://flagcdn.com/w320/ar.png' },
  france: { id: 'fra', slug: 'france', name: 'France', countryCode: 'FR', confederation: 'UEFA', flagUrl: 'https://flagcdn.com/w320/fr.png' },
  brazil: { id: 'bra', slug: 'brazil', name: 'Brazil', countryCode: 'BR', confederation: 'CONMEBOL', flagUrl: 'https://flagcdn.com/w320/br.png' },
  england: { id: 'eng', slug: 'england', name: 'England', countryCode: 'GB', confederation: 'UEFA', flagUrl: 'https://flagcdn.com/w320/gb-eng.png' },
  usa: { id: 'usa', slug: 'usa', name: 'United States', countryCode: 'US', confederation: 'CONCACAF', flagUrl: 'https://flagcdn.com/w320/us.png' },
};

const MOCK_MATCHES = [
  {
    id: 'm1', slug: 'match-1-usa-eng', matchNumber: 1, round: 'Group Stage', group: 'A', kickoffUtc: new Date('2026-06-11T20:00:00Z'), status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS['usa'], awayTeam: MOCK_TEAMS['england'], stadium: { name: 'SoFi Stadium', city: 'Los Angeles' }
  },
  {
    id: 'm2', slug: 'match-15-arg-bra', matchNumber: 15, round: 'Group Stage', group: 'C', kickoffUtc: new Date('2026-06-15T18:00:00Z'), status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS['argentina'], awayTeam: MOCK_TEAMS['brazil'], stadium: { name: 'MetLife Stadium', city: 'New York/New Jersey' }
  }
];

import { cache } from 'react';
import { Metadata } from 'next';

const getTeam = cache(async (teamSlug: string) => {
  try {
    return await prisma.team.findUnique({
      where: { slug: teamSlug },
      include: {
        homeMatches: { include: { awayTeam: true, stadium: true } },
        awayMatches: { include: { homeTeam: true, stadium: true } },
      }
    });
  } catch (e) {
    return null;
  }
});

export async function generateMetadata({ params }: { params: { teamSlug: string } }): Promise<Metadata> {
  let team = await getTeam(params.teamSlug);
  if (!team) team = MOCK_TEAMS[params.teamSlug];
  
  if (!team) return {};

  return {
    title: `${team.name} Tickets — World Cup 2026`,
    description: `Follow ${team.name}'s journey in the 2026 World Cup. Secure your tickets now and be part of history.`,
    alternates: {
      canonical: `/teams/${team.slug}`,
    }
  };
}

export default async function TeamDetailPage({ params }: { params: { locale: string; teamSlug: string } }) {
  let team: any = await getTeam(params.teamSlug);

  if (!team) {
    team = MOCK_TEAMS[params.teamSlug];
    if (!team) {
      return notFound();
    }
    // Mock matches for fallback
    team.homeMatches = MOCK_MATCHES.filter(m => m.homeTeam?.slug === team.slug);
    team.awayMatches = MOCK_MATCHES.filter(m => m.awayTeam?.slug === team.slug);
  }

  // Normalize matches
  const allMatches = [
    ...(team.homeMatches || []).map((m: any) => ({ ...m, isHome: true })),
    ...(team.awayMatches || []).map((m: any) => ({ ...m, isHome: false }))
  ].sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());

  // Fallback if no matches
  const displayMatches = allMatches.length > 0 ? allMatches : MOCK_MATCHES.map(m => ({
    ...m,
    isHome: Math.random() > 0.5
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.tixlyonline.com/" },
      { "@type": "ListItem", "position": 2, "name": "Teams", "item": "https://www.tixlyonline.com/teams" },
      { "@type": "ListItem", "position": 3, "name": team.name }
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero Section */}
      <div className="bg-brand-navy text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href={`/teams`} className="inline-flex items-center text-brand-paleblue hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-40 h-28 md:w-56 md:h-36 relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0 bg-white">
              {team.flagUrl ? (
                <Image src={team.flagUrl} alt={`${team.name} flag`} className="w-full h-full object-cover" width={120} height={80} priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-navy font-bold text-3xl">
                  {team.countryCode}
                </div>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2 text-brand-orange font-semibold tracking-wide uppercase text-sm">
                <Trophy className="w-4 h-4" />
                {team.confederation}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                {team.name}
              </h1>
              <p className="text-white/80 text-lg max-w-xl">
                Follow {team.name}'s journey in the 2026 World Cup. Secure your tickets now and be part of history.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <h2 className="text-2xl font-bold text-brand-navy mb-6">Match Schedule</h2>
        <div className="space-y-4">
          {displayMatches.map((match: any) => {
            const opponent = match.isHome ? match.awayTeam : match.homeTeam;
            const date = new Date(match.kickoffUtc);
            
            return (
              <Card key={match.id} className="rounded-2xl border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-0 flex flex-col sm:flex-row items-center">
                  {/* Date & Time */}
                  <div className="bg-gray-50 sm:w-48 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 h-full w-full">
                    <span className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-1">
                      {match.round}
                    </span>
                    <span className="text-2xl font-bold text-brand-navy">
                      {format(date, 'MMM do')}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {format(date, 'h:mm a')}
                    </span>
                  </div>

                  {/* Match Details */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className={`font-bold text-lg ${match.isHome ? 'text-brand-navy' : 'text-gray-500'}`}>
                          {match.isHome ? team.name : opponent?.name}
                        </span>
                        <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-gray-200">
                          {(match.isHome ? team.flagUrl : opponent?.flagUrl) ? (
                            <Image src={(match.isHome ? team.flagUrl : opponent?.flagUrl) as string} alt="flag" className="w-full h-full object-cover" width={120} height={80} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                              🏳️
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-gray-400">VS</div>
                      <div className="flex items-center gap-3 flex-1 justify-start">
                        <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-gray-200">
                          {(!match.isHome ? team.flagUrl : opponent?.flagUrl) ? (
                            <Image src={(!match.isHome ? team.flagUrl : opponent?.flagUrl) as string} alt="flag" className="w-full h-full object-cover" width={120} height={80} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                              🏳️
                            </div>
                          )}
                        </div>
                        <span className={`font-bold text-lg ${!match.isHome ? 'text-brand-navy' : 'text-gray-500'}`}>
                          {!match.isHome ? team.name : opponent?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{match.stadium?.name}, {match.stadium?.city}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-6 sm:w-48 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-100 h-full w-full">
                    <Link href={`/matches/${match.id}`} className="w-full">
                      <Button className="w-full rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-semibold">
                        <Ticket className="w-4 h-4 mr-2" />
                        Tickets
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export const revalidate = 300;
