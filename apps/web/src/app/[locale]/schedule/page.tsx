import { prisma, Prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { ScheduleFilters } from '@/components/schedule/ScheduleFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { format } from 'date-fns';

import Image from 'next/image';
const MOCK_TEAMS: Record<string, any> = {
  argentina: { name: 'Argentina', flagUrl: 'https://flagcdn.com/w320/ar.png' },
  brazil: { name: 'Brazil', flagUrl: 'https://flagcdn.com/w320/br.png' },
  usa: { name: 'United States', flagUrl: 'https://flagcdn.com/w320/us.png' },
  england: { name: 'England', flagUrl: 'https://flagcdn.com/w320/gb-eng.png' }
};

const MOCK_STADIUMS: Record<string, any> = {
  metlife: { name: 'MetLife Stadium', city: 'New York/New Jersey' },
  sofi: { name: 'SoFi Stadium', city: 'Los Angeles' }
};

const MOCK_MATCHES = [
  {
    id: 'm1', slug: 'match-1-usa-eng', matchNumber: 1, round: 'Group Stage', group: 'A', kickoffUtc: new Date('2026-06-11T20:00:00Z'), status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS['usa'], awayTeam: MOCK_TEAMS['england'], stadium: MOCK_STADIUMS['sofi']
  },
  {
    id: 'm2', slug: 'match-15-arg-bra', matchNumber: 15, round: 'Group Stage', group: 'C', kickoffUtc: new Date('2026-06-15T18:00:00Z'), status: 'SCHEDULED',
    homeTeam: MOCK_TEAMS['argentina'], awayTeam: MOCK_TEAMS['brazil'], stadium: MOCK_STADIUMS['metlife']
  }
];

export default async function SchedulePage({ 
  params,
  searchParams,
}: { 
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let matches: any[] = [];
  
  const where: Prisma.MatchWhereInput = {};
  
  if (searchParams.round) {
    where.round = searchParams.round as string;
  }
  if (searchParams.group) {
    where.group = searchParams.group as string;
  }
  if (searchParams.country) {
    where.stadium = {
      countryCode: searchParams.country as string
    };
  }

  try {
    matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        stadium: true
      },
      orderBy: { kickoffUtc: 'asc' }
    });
  } catch (e) {
    console.error(e);
  }

  if (!matches || matches.length === 0) {
    matches = MOCK_MATCHES;
  }

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    const dateKey = format(new Date(match.kickoffUtc), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image src="/fifa-logo.jpg" alt="FIFA Logo" width={120} height={40} className="object-contain mix-blend-multiply" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy tracking-tight mb-4">
            Tournament Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your World Cup 2026 experience. Browse all 104 matches from the opening game to the historic final.
          </p>
        </div>

        <ScheduleFilters />

        <div className="space-y-12">
          {sortedDates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No matches found for these filters.</p>
            </div>
          )}
          {sortedDates.map((dateStr) => {
            const date = new Date(dateStr + 'T00:00:00Z');
            const dayMatches = groupedMatches[dateStr];
            
            return (
              <div key={dateStr} className="relative">
                <div className="sticky top-20 z-10 bg-gray-50/90 backdrop-blur-md py-4 mb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-brand-orange" />
                    {format(date, 'EEEE, MMMM do, yyyy')}
                  </h2>
                </div>

                <div className="space-y-4">
                  {dayMatches.map((match: any) => {
                    const matchDate = new Date(match.kickoffUtc);
                    return (
                      <Card key={match.id} className="rounded-2xl border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-white">
                        <CardContent className="p-0 flex flex-col sm:flex-row items-center">
                          <div className="bg-gray-50 sm:w-48 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 h-full w-full">
                            <span className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-1">
                              Match {match.matchNumber}
                            </span>
                            <span className="text-sm text-gray-500 font-medium mb-1">
                              {match.round} {match.group ? `- Group ${match.group}` : ''}
                            </span>
                            <span className="text-2xl font-bold text-brand-navy">
                              {format(matchDate, 'h:mm a')}
                            </span>
                          </div>

                          <div className="flex-1 p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-3 flex-1 justify-end">
                                <span className="font-bold text-lg text-brand-navy">
                                  {match.homeTeam?.name || 'TBD'}
                                </span>
                                <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-gray-200">
                                  {match.homeTeam?.flagUrl && <Image src={match.homeTeam.flagUrl} alt="flag" className="w-full h-full object-cover" width={120} height={80} />}
                                </div>
                              </div>
                              <div className="font-bold text-gray-400">VS</div>
                              <div className="flex items-center gap-3 flex-1 justify-start">
                                <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-gray-200">
                                  {match.awayTeam?.flagUrl && <Image src={match.awayTeam.flagUrl} alt="flag" className="w-full h-full object-cover" width={120} height={80} />}
                                </div>
                                <span className="font-bold text-lg text-brand-navy">
                                  {match.awayTeam?.name || 'TBD'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{match.stadium?.name}, {match.stadium?.city}</span>
                            </div>
                          </div>

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
            );
          })}
        </div>
      </div>
    </main>
  );
}
