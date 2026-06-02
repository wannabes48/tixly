import { Link } from '@/navigation';
import { Calendar, MapPin, ChevronRight, Trophy, Ticket } from 'lucide-react';
import { prisma, Prisma } from '@tixly/database';
import { MatchesFilterSidebar } from '@/components/matches/MatchesFilterSidebar';
import { MatchesFilterSheet } from '@/components/matches/MatchesFilterSheet';
import { MatchSortSelect } from '@/components/matches/MatchSortSelect';
import { LocalTime } from '@/components/LocalTime';
import { Badge } from '@/components/ui/badge';

import Image from 'next/image';
export const revalidate = 300;

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let teamsData: any[] = [];
  try {
    teamsData = await prisma.team.findMany({ orderBy: { name: 'asc' } });
  } catch (e) {
    console.error("DB Error teams", e);
  }
  const teamOptions = teamsData.map((t) => ({
    label: t.name,
    value: t.name.toLowerCase(),
    emoji: t.flagUrl || undefined,
  }));

  const where: Prisma.MatchWhereInput = {};

  if (searchParams.dateFrom) {
    where.kickoffUtc = {
      ...((where.kickoffUtc as any) || {}),
      gte: new Date(searchParams.dateFrom as string),
    };
  }
  if (searchParams.dateTo) {
    const toDate = new Date(searchParams.dateTo as string);
    toDate.setDate(toDate.getDate() + 1); // include the entire day
    where.kickoffUtc = {
      ...((where.kickoffUtc as any) || {}),
      lt: toDate,
    };
  }
  if (searchParams.rounds) {
    where.round = { in: (searchParams.rounds as string).split(',') };
  }
  if (searchParams.countries) {
    where.stadium = { countryCode: { in: (searchParams.countries as string).split(',') } };
  }
  if (searchParams.teams) {
    const tNames = (searchParams.teams as string).split(',');
    where.OR = [
      { homeTeam: { name: { in: tNames, mode: 'insensitive' } } },
      { awayTeam: { name: { in: tNames, mode: 'insensitive' } } },
    ];
  }

  // Round slug filter (from quick-filter pills)
  if (searchParams.round) {
    const roundMap: Record<string, string> = {
      'group': 'Group Stage',
      'round-of-32': 'Round of 32',
      'round-of-16': 'Round of 16',
      'quarter-finals': 'Quarter-Finals',
      'semi-finals': 'Semi-Finals',
      'final': 'Final',
    };
    const mappedRound = roundMap[searchParams.round as string];
    if (mappedRound) {
      where.round = mappedRound;
    }
  }

  // Team slug filter (from TeamGrid links)
  if (searchParams.team) {
    const teamSlug = (searchParams.team as string).replace(/-/g, ' ');
    if (!where.OR) {
      where.OR = [
        { homeTeam: { name: { contains: teamSlug, mode: 'insensitive' as const } } },
        { awayTeam: { name: { contains: teamSlug, mode: 'insensitive' as const } } },
      ];
    }
  }

  // City slug filter (from CityGrid links)
  if (searchParams.city) {
    const citySlug = (searchParams.city as string).replace(/-/g, ' ');
    where.stadium = {
      ...(where.stadium as any || {}),
      city: { contains: citySlug, mode: 'insensitive' as const },
    };
  }

  // Text search (q param)
  if (searchParams.q) {
    const q = searchParams.q as string;
    const searchFilter = {
      OR: [
        { homeTeam: { name: { contains: q, mode: 'insensitive' as const } } },
        { awayTeam: { name: { contains: q, mode: 'insensitive' as const } } },
        { stadium: { name: { contains: q, mode: 'insensitive' as const } } },
        { stadium: { city: { contains: q, mode: 'insensitive' as const } } },
        { round: { contains: q, mode: 'insensitive' as const } },
      ],
    };
    if (where.OR) {
      // Already have team filter OR, combine with AND
      const existingOR = where.OR;
      delete where.OR;
      where.AND = [{ OR: existingOR }, searchFilter];
    } else {
      where.OR = searchFilter.OR;
    }
  }

  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice as string) : 0;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : 2500;
  
  if (minPrice > 0 || maxPrice < 2500) {
    where.listings = {
      some: {
        pricePerTicket: {
          gte: minPrice,
          lte: maxPrice < 2500 ? maxPrice : undefined,
        },
      },
    };
  }

  let matches: any[] = [];
  try {
    matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        stadium: true,
        _count: {
          select: { listings: true }
        },
        listings: {
          orderBy: { pricePerTicket: 'asc' },
          take: 1,
        },
      },
    });
  } catch (e) {
    console.error("DB Error matches", e);
  }

  const sort = searchParams.sort as string || 'date_asc';

  matches.sort((a, b) => {
    switch (sort) {
      case 'price_asc': {
        const priceA = a.listings[0]?.pricePerTicket ?? Infinity;
        const priceB = b.listings[0]?.pricePerTicket ?? Infinity;
        // If prices are equal, fallback to date
        if (priceA === priceB) return a.kickoffUtc.getTime() - b.kickoffUtc.getTime();
        return priceA - priceB;
      }
      case 'price_desc': {
        const priceDescA = a.listings[0]?.pricePerTicket ?? -Infinity;
        const priceDescB = b.listings[0]?.pricePerTicket ?? -Infinity;
        if (priceDescA === priceDescB) return a.kickoffUtc.getTime() - b.kickoffUtc.getTime();
        return priceDescB - priceDescA;
      }
      case 'tickets_desc': {
        const countA = a._count?.listings ?? 0;
        const countB = b._count?.listings ?? 0;
        if (countA === countB) return a.kickoffUtc.getTime() - b.kickoffUtc.getTime();
        return countB - countA;
      }
      case 'date_asc':
      default:
        return a.kickoffUtc.getTime() - b.kickoffUtc.getTime();
    }
  });

  // Group matches by round
  const groupStage = matches.filter((m) => m.round === 'Group Stage');
  const knockout = matches.filter((m) => m.round !== 'Group Stage');

  // Compute dynamic sidebar counts
  const hostCountryCounts: Record<string, number> = {};
  const roundCounts: Record<string, number> = {};
  for (const m of matches) {
    const country = m.stadium.countryCode;
    hostCountryCounts[country] = (hostCountryCounts[country] || 0) + 1;
    roundCounts[m.round] = (roundCounts[m.round] || 0) + 1;
  }

  const hostCountries = [
    { label: 'United States', code: 'US', emoji: '🇺🇸' },
    { label: 'Mexico', code: 'MX', emoji: '🇲🇽' },
    { label: 'Canada', code: 'CA', emoji: '🇨🇦' },
  ];

  const tournamentStages = [
    { label: 'Group Stage', key: 'Group Stage' },
    { label: 'Round of 32', key: 'Round of 32' },
    { label: 'Round of 16', key: 'Round of 16' },
    { label: 'Quarter-Finals', key: 'Quarter-Finals' },
    { label: 'Semi-Finals', key: 'Semi-Finals' },
    { label: 'Final', key: 'Final' },
  ];

  const priceRanges = [
    'Under $200',
    '$200 – $500',
    '$500 – $1,000',
    'Over $1,000',
  ];

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      {/* ──────────────── Page Header ──────────────── */}
      <div className="bg-tixNavy pt-24 pb-10 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-tixSilver/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-tixOrange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/80 font-medium">Matches</span>
          </nav>

          <div className="mb-4">
            <Image src="/fifa-logo.jpg" alt="FIFA Logo" width={100} height={34} className="object-contain brightness-0 invert" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            World Cup 2026 Tickets
          </h1>
          <p className="text-white/60 max-w-lg text-lg">
            Browse all{' '}
            <span className="text-tixOrange font-bold">{matches.length}</span>{' '}
            matches across 16 stadiums and 16 host cities.
          </p>

          <form action="" method="GET" className="mt-6 max-w-xl">
            <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <input
                type="text"
                name="q"
                defaultValue={(searchParams.q as string) || ''}
                placeholder="Search by team, city, or match…"
                className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
              <button type="submit" className="bg-tixOrange text-white px-6 py-3 text-sm font-bold hover:bg-orange-600 transition-colors">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ──────────────── Content ──────────────── */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* ─── Sidebar Filters ─── */}
          <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-120px)] sticky top-24">
            <MatchesFilterSidebar teamOptions={teamOptions} />
          </aside>

          {/* ─── Match List ─── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <MatchesFilterSheet teamOptions={teamOptions} />
                <p className="text-sm text-gray-500 font-medium hidden sm:block">
                  <span className="font-bold text-tixNavy">{matches.length}</span>{' '}
                  matches available
                </p>
              </div>
              <MatchSortSelect />
            </div>

            {/* Knockout highlight banner */}
            {knockout.length > 0 && (
              <div className="bg-tixNavy rounded-2xl p-4 mb-5 flex items-center gap-4 border border-tixOrange/20">
                <div className="w-10 h-10 bg-tixOrange rounded-xl flex items-center justify-center shrink-0">
                  <Trophy size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    Knockout Stage tickets available
                  </p>
                  <p className="text-white/60 text-xs">
                    Quarter-Finals, Semis &amp; the Grand Final · Limited seats
                  </p>
                </div>
                <Link
                  href="#knockout"
                  className="ml-auto shrink-0 bg-tixOrange hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors active:scale-95"
                >
                  View →
                </Link>
              </div>
            )}

            {/* ─── Group Stage ─── */}
            {groupStage.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-tixOrange rounded-full" />
                  <h2 className="text-base font-bold text-tixNavy">Group Stage</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 font-semibold">
                    {groupStage.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {groupStage.map((match) => (
                    <MatchCard key={match.id} match={match} accentColor="orange" />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Knockout Stage ─── */}
            {knockout.length > 0 && (
              <div id="knockout" className="mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-tixNavy rounded-full" />
                  <h2 className="text-base font-bold text-tixNavy">
                    Knockout Stage
                  </h2>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 font-semibold">
                    {knockout.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {knockout.map((match) => (
                    <MatchCard key={match.id} match={match} accentColor="midblue" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Match Card Component                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

function MatchCard({
  match,
  accentColor,
}: {
  match: {
    id: string;
    round: string;
    group: string | null;
    homeTeam: { name: string; flagUrl: string | null };
    awayTeam: { name: string; flagUrl: string | null };
    stadium: { name: string; city: string; countryCode: string };
    kickoffUtc: Date;
    listings: { pricePerTicket: number }[];
    _count?: { listings: number };
  };
  accentColor: 'orange' | 'midblue';
}) {
  const lowestPrice = match.listings[0]?.pricePerTicket ?? null;
  const numListings = match._count?.listings ?? 0;

  const dateStr = new Date(match.kickoffUtc).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = new Date(match.kickoffUtc).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });

  const roundLabelColor =
    accentColor === 'orange' ? 'text-tixOrange' : 'text-tixNavy';
  const panelHoverBg = 'group-hover:bg-tixSilver/50';
  const ctaBg = 'bg-tixOrange hover:bg-orange-600';

  return (
    <div className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-tixOrange/50 transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Teams panel (Left section) */}
        <div
          className={`md:w-72 bg-[#f9fafb] ${panelHoverBg} transition-colors p-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100`}
        >
          <div
            className={`text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider`}
          >
            {match.round}
            {match.group && (
              <span className="ml-1.5 text-gray-400 normal-case font-semibold">
                · {match.group}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 text-center">
              {match.homeTeam.flagUrl ? (
                <Image src={match.homeTeam.flagUrl} alt={`${match.homeTeam.name} flag`} className="w-10 h-7 object-cover mx-auto mb-2 rounded shadow-sm border border-slate-200" width={64} height={48} />
              ) : (
                <span className="text-3xl block mb-1">🏳️</span>
              )}
              <div className="text-sm font-bold text-tixNavy leading-tight">
                {match.homeTeam.name}
              </div>
            </div>

            <div className="shrink-0">
              <span className="text-xs font-black text-slate-400">
                VS
              </span>
            </div>

            <div className="flex-1 text-center">
              {match.awayTeam.flagUrl ? (
                <Image src={match.awayTeam.flagUrl} alt={`${match.awayTeam.name} flag`} className="w-10 h-7 object-cover mx-auto mb-2 rounded shadow-sm border border-slate-200" width={64} height={48} />
              ) : (
                <span className="text-3xl block mb-1">🏳️</span>
              )}
              <div className="text-sm font-bold text-tixNavy leading-tight">
                {match.awayTeam.name}
              </div>
            </div>
          </div>
        </div>

        {/* Info + CTA (Middle and Right Sections) */}
        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700">{dateStr}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{timeStr}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <MapPin size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold text-tixNavy truncate">
                {match.stadium.name}
              </span>
              <span className="text-slate-400 truncate hidden xl:inline">
                , {match.stadium.city}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Ticket size={16} className="text-tixGreen shrink-0" />
              <span className="font-bold text-tixNavy">{numListings}</span>
              <span className="text-slate-500">tickets available</span>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end md:text-right gap-6 md:border-l border-slate-100 md:pl-6 h-full">
            <div>
              {lowestPrice ? (
                <>
                  <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold mb-1">From</span>
                  <span className="text-3xl font-black text-tixNavy tracking-tight">
                    ${lowestPrice}
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400 italic">No tickets yet</span>
              )}
            </div>
            <Link
              href={`/matches/${match.id}`}
              className={`${ctaBg} text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors active:scale-95 whitespace-nowrap shadow-sm hover:shadow-md block text-center`}
            >
              Select Seats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
