import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

import Image from 'next/image';
const MOCK_GROUPS = {
  'Group A': [
    { team: { name: 'USA', flagUrl: 'https://flagcdn.com/w320/us.png', slug: 'usa' }, p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 2, gd: 3, pts: 7 },
    { team: { name: 'England', flagUrl: 'https://flagcdn.com/w320/gb-eng.png', slug: 'england' }, p: 3, w: 2, d: 0, l: 1, gf: 4, ga: 2, gd: 2, pts: 6 },
    { team: { name: 'Senegal', flagUrl: 'https://flagcdn.com/w320/sn.png', slug: 'senegal' }, p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
    { team: { name: 'Iran', flagUrl: 'https://flagcdn.com/w320/ir.png', slug: 'iran' }, p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 6, gd: -5, pts: 0 },
  ],
  'Group C': [
    { team: { name: 'Argentina', flagUrl: 'https://flagcdn.com/w320/ar.png', slug: 'argentina' }, p: 3, w: 3, d: 0, l: 0, gf: 7, ga: 1, gd: 6, pts: 9 },
    { team: { name: 'Brazil', flagUrl: 'https://flagcdn.com/w320/br.png', slug: 'brazil' }, p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 2, gd: 3, pts: 6 },
    { team: { name: 'Mexico', flagUrl: 'https://flagcdn.com/w320/mx.png', slug: 'mexico' }, p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 4, gd: -1, pts: 3 },
    { team: { name: 'Saudi Arabia', flagUrl: 'https://flagcdn.com/w320/sa.png', slug: 'saudi-arabia' }, p: 3, w: 0, d: 0, l: 3, gf: 0, ga: 8, gd: -8, pts: 0 },
  ]
};

export default async function StandingsPage({ 
  params,
  searchParams,
}: { 
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // We will mostly rely on mock data here since dynamic standings generation 
  // requires results logic which is complex and likely missing from initial seed.

  const q = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  let groups = { ...MOCK_GROUPS };

  if (q) {
    const filteredGroups: Record<string, any[]> = {};
    for (const [groupName, teams] of Object.entries(groups)) {
      if (groupName.toLowerCase().includes(q)) {
        filteredGroups[groupName] = teams;
      } else {
        const matchingTeams = teams.filter(t => t.team.name.toLowerCase().includes(q));
        if (matchingTeams.length > 0) {
          filteredGroups[groupName] = matchingTeams; // Or show all teams in the group if one matches: filteredGroups[groupName] = teams;
          // Let's show all teams in that group so standings make sense
          filteredGroups[groupName] = teams;
        }
      }
    }
    groups = filteredGroups;
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a192f] tracking-tight mb-4 flex items-center gap-4">
            <Trophy className="w-10 h-10 text-[#ff6b00]" />
            Group Standings
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Track the progress of all 48 teams during the group stage. The top two teams from each group, along with the eight best third-placed teams, advance to the Round of 32.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-xl">
          <form method="GET" action="/standings" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="search" 
              name="q" 
              placeholder="Search by team or group (e.g., 'Argentina' or 'Group C')..." 
              defaultValue={q}
              className="w-full pl-12 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-lg focus-visible:ring-brand-orange"
            />
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.keys(groups).length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No groups or teams found matching your search.</p>
            </div>
          )}
          {Object.entries(groups).map(([groupName, teams]) => (
            <Card key={groupName} className="rounded-2xl border-none shadow-md overflow-hidden bg-white">
              <CardHeader className="bg-[#0a192f] text-white py-4 px-6 rounded-t-2xl">
                <CardTitle className="text-xl font-bold">{groupName}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                      <tr>
                        <th scope="col" className="px-6 py-3">Pos</th>
                        <th scope="col" className="px-6 py-3 min-w-[200px]">Team</th>
                        <th scope="col" className="px-4 py-3 text-center">P</th>
                        <th scope="col" className="px-4 py-3 text-center">W</th>
                        <th scope="col" className="px-4 py-3 text-center">D</th>
                        <th scope="col" className="px-4 py-3 text-center">L</th>
                        <th scope="col" className="px-4 py-3 text-center hidden sm:table-cell">GF</th>
                        <th scope="col" className="px-4 py-3 text-center hidden sm:table-cell">GA</th>
                        <th scope="col" className="px-4 py-3 text-center">GD</th>
                        <th scope="col" className="px-4 py-3 text-center font-bold text-[#0a192f]">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((row, index) => (
                        <tr key={row.team.slug} className={`border-b hover:bg-slate-50 transition-colors ${index < 2 ? 'bg-green-50/30' : index === 2 ? 'bg-yellow-50/30' : ''}`}>
                          <td className="px-6 py-4 font-semibold text-[#0a192f]">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/teams/${row.team.slug}`} className="flex items-center gap-3 group">
                              <div className="w-6 h-4 rounded overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
                                <Image src={row.team.flagUrl} alt={`${row.team.name} flag`} className="w-full h-full object-cover" width={120} height={80} />
                              </div>
                              <span className="font-bold text-[#0a192f] group-hover:text-[#ff6b00] transition-colors">{row.team.name}</span>
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-center">{row.p}</td>
                          <td className="px-4 py-4 text-center">{row.w}</td>
                          <td className="px-4 py-4 text-center">{row.d}</td>
                          <td className="px-4 py-4 text-center">{row.l}</td>
                          <td className="px-4 py-4 text-center hidden sm:table-cell">{row.gf}</td>
                          <td className="px-4 py-4 text-center hidden sm:table-cell">{row.ga}</td>
                          <td className="px-4 py-4 text-center">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                          <td className="px-4 py-4 text-center font-bold text-[#0a192f] text-lg">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
