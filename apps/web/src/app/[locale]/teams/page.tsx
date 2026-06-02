import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { Globe, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Prisma } from '@tixly/database';
import Image from 'next/image';

const MOCK_TEAMS = [
  { slug: 'argentina', name: 'Argentina', countryCode: 'AR', confederation: 'CONMEBOL', flagUrl: 'https://flagcdn.com/w320/ar.png' },
  { slug: 'france', name: 'France', countryCode: 'FR', confederation: 'UEFA', flagUrl: 'https://flagcdn.com/w320/fr.png' },
  { slug: 'brazil', name: 'Brazil', countryCode: 'BR', confederation: 'CONMEBOL', flagUrl: 'https://flagcdn.com/w320/br.png' },
  { slug: 'england', name: 'England', countryCode: 'GB', confederation: 'UEFA', flagUrl: 'https://flagcdn.com/w320/gb-eng.png' },
  { slug: 'usa', name: 'United States', countryCode: 'US', confederation: 'CONCACAF', flagUrl: 'https://flagcdn.com/w320/us.png' },
  { slug: 'mexico', name: 'Mexico', countryCode: 'MX', confederation: 'CONCACAF', flagUrl: 'https://flagcdn.com/w320/mx.png' },
  { slug: 'canada', name: 'Canada', countryCode: 'CA', confederation: 'CONCACAF', flagUrl: 'https://flagcdn.com/w320/ca.png' },
  { slug: 'spain', name: 'Spain', countryCode: 'ES', confederation: 'UEFA', flagUrl: 'https://flagcdn.com/w320/es.png' },
];

export default async function TeamsPage({ 
  params,
  searchParams,
}: { 
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let teams: any[] = [];
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

  try {
    const where: Prisma.TeamWhereInput = {
      countryCode: { notIn: ['TBD', 'UN'] }
    };
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }
    teams = await prisma.team.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error(e);
  }

  if (!teams || teams.length === 0) {
    teams = MOCK_TEAMS as any;
    if (q) {
      teams = teams.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
    }
  }

  const groupedTeams = teams.reduce((acc: any, team: any) => {
    const conf = team.confederation || 'Other';
    if (!acc[conf]) acc[conf] = [];
    acc[conf].push(team);
    return acc;
  }, {} as Record<string, typeof teams>);

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a192f] tracking-tight mb-4">
            Participating Teams
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover all 48 nations competing in the 2026 World Cup across North America. Select a team to view their squad, schedule, and tickets.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-xl">
          <form method="GET" action="/teams" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="search" 
              name="q" 
              placeholder="Search teams by name..." 
              defaultValue={q}
              className="w-full pl-12 h-14 rounded-2xl bg-white border-none shadow-sm text-lg focus-visible:ring-brand-orange"
            />
          </form>
        </div>

        <div className="space-y-16">
          {Object.keys(groupedTeams).length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No teams found matching your search.</p>
            </div>
          )}
          {Object.entries(groupedTeams).map(([confederation, confTeams]: [string, any]) => (
            <div key={confederation}>
              <h2 className="text-2xl font-bold text-[#0a192f] mb-6 flex items-center gap-3 border-b pb-2">
                <Image src="/fifa-logo.jpg" alt="FIFA Logo" width={48} height={16} className="object-contain mix-blend-multiply opacity-90" />
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {confTeams.map((team: any) => (
                  <Link href={`/teams/${team.slug}`} key={team.slug}>
                    <Card className="rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer border-none shadow-md bg-white h-full flex flex-col">
                      <CardContent className="p-0 flex-1 flex flex-col">
                        <div className="aspect-[3/2] relative overflow-hidden bg-slate-100 flex-shrink-0">
                          {team.flagUrl ? (
                            <Image
                              src={team.flagUrl}
                              alt={`${team.name} flag`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                              {team.countryCode}
                            </div>
                          )}
                        </div>
                        <div className="p-4 text-center flex-1 flex items-center justify-center">
                          <h3 className="font-bold text-[#0a192f] text-lg truncate group-hover:text-[#ff6b00] transition-colors">
                            {team.name}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
