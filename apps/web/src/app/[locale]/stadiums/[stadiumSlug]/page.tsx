import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Ticket, Calendar, MapPin, Users, Eye, EyeOff, DollarSign, Gem } from 'lucide-react';
import { format } from 'date-fns';
import { stadiumInsights } from '@/data/stadium-insights';

import Image from 'next/image';
import { cache } from 'react';
import { Metadata } from 'next';

const getStadium = cache(async (stadiumSlug: string) => {
  try {
    return await prisma.stadium.findUnique({
      where: { slug: stadiumSlug },
      include: {
        matches: {
          include: { homeTeam: true, awayTeam: true },
          orderBy: { kickoffUtc: 'asc' }
        }
      }
    });
  } catch (e) {
    return null;
  }
});

export async function generateMetadata({ params }: { params: { stadiumSlug: string } }): Promise<Metadata> {
  const stadium = await getStadium(params.stadiumSlug);
  if (!stadium) return {};

  return {
    title: `${stadium.name} Tickets & Information — World Cup 2026`,
    description: `Experience the incredible atmosphere at ${stadium.name} in ${stadium.city}. Buy World Cup 2026 tickets for matches at this venue.`,
    alternates: {
      canonical: `/stadiums/${stadium.slug}`,
    }
  };
}

export default async function StadiumDetailPage({ params }: { params: { locale: string; stadiumSlug: string } }) {
  let stadium: any = await getStadium(params.stadiumSlug);

  if (!stadium) {
    notFound();
  }

  // Fallback image since we haven't added stadium images to the DB yet
  stadium.imageUrl = stadium.imageUrl || 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=1200';
  stadium.description = stadium.description || `Experience the incredible atmosphere at ${stadium.name} in ${stadium.city}.`;

  const displayMatches = stadium.matches || [];
  const insights = stadiumInsights[stadium.slug];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.tixlyonline.com/" },
      { "@type": "ListItem", "position": 2, "name": "Stadiums", "item": "https://www.tixlyonline.com/stadiums" },
      { "@type": "ListItem", "position": 3, "name": stadium.name }
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
          <Image src={stadium.imageUrl} alt={stadium.name} className="w-full h-full object-cover" width={800} height={600} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <Link href={`/stadiums`} className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stadiums
          </Link>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 bg-[#ff6b00] text-white px-3 py-1 rounded-full text-sm font-semibold">
              <MapPin className="w-4 h-4" />
              {stadium.city}
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
              <Users className="w-4 h-4" />
              {stadium.capacity.toLocaleString()} Capacity
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
            {stadium.name}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            {stadium.description}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* Seating Insights */}
        {insights && (
          <section>
            <h2 className="text-2xl font-bold text-[#0a192f] mb-6 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#ff6b00]" />
              Official Seating Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-none shadow-md bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Gem className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a192f] text-lg mb-2">Best Value Seats</h3>
                      <p className="text-slate-600 leading-relaxed">{insights.bestValueSeats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-md bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a192f] text-lg mb-2">Most Expensive Seats</h3>
                      <p className="text-slate-600 leading-relaxed">{insights.mostExpensiveSeats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-md bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a192f] text-lg mb-2">Best Views</h3>
                      <p className="text-slate-600 leading-relaxed">{insights.bestViews}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-md bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <EyeOff className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a192f] text-lg mb-2">Worst Views</h3>
                      <p className="text-slate-600 leading-relaxed">{insights.worstViews}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Matches */}
        <section>
          <h2 className="text-2xl font-bold text-[#0a192f] mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#ff6b00]" />
            Matches at {stadium.name}
          </h2>
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

                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center w-full">
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
                        <div className="flex items-center gap-3 w-full sm:flex-1 justify-between sm:justify-end">
                          <span className="font-bold text-base sm:text-lg text-[#0a192f] truncate">
                            {match.homeTeam?.name}
                          </span>
                          <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
                            {match.homeTeam?.flagUrl && <Image src={match.homeTeam.flagUrl} alt="flag" className="w-full h-full object-cover" width={120} height={80} />}
                          </div>
                        </div>
                        <div className="font-bold text-slate-400 text-xs sm:text-base bg-slate-100 sm:bg-transparent px-3 py-0.5 sm:px-0 sm:py-0 rounded-full">VS</div>
                        <div className="flex items-center gap-3 w-full sm:flex-1 justify-between sm:justify-start flex-row-reverse sm:flex-row">
                          <span className="font-bold text-base sm:text-lg text-[#0a192f] truncate">
                            {match.awayTeam?.name}
                          </span>
                          <div className="w-8 h-6 rounded overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
                            {match.awayTeam?.flagUrl && <Image src={match.awayTeam.flagUrl} alt="flag" className="w-full h-full object-cover" width={120} height={80} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:w-48 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-100 h-full w-full">
                      <Button asChild className="w-full rounded-xl bg-[#ff6b00] hover:bg-[#e66000] text-white font-semibold">
                        <Link href={`/matches/${match.id}`} className="w-full flex items-center justify-center">
                          <Ticket className="w-4 h-4 mr-2" />
                          Tickets
                        </Link>
                      </Button>
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
