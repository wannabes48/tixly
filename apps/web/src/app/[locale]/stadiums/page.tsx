import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Prisma } from '@tixly/database';

import Image from 'next/image';
const MOCK_STADIUMS = [
  { slug: 'metlife-stadium', name: 'MetLife Stadium', city: 'New York/New Jersey', countryCode: 'US', capacity: 82500, imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800' },
  { slug: 'sofi-stadium', name: 'SoFi Stadium', city: 'Los Angeles', countryCode: 'US', capacity: 70240, imageUrl: 'https://images.unsplash.com/photo-1628045648439-082046205779?auto=format&fit=crop&q=80&w=800' },
  { slug: 'estadio-azteca', name: 'Estadio Azteca', city: 'Mexico City', countryCode: 'MX', capacity: 83264, imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800' },
  { slug: 'bmo-field', name: 'BMO Field', city: 'Toronto', countryCode: 'CA', capacity: 30000, imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=800' },
];

export default async function StadiumsPage({ 
  params,
  searchParams,
}: { 
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let stadiums: any[] = [];
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

  try {
    const where: Prisma.StadiumWhereInput = {};
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }
    stadiums = await prisma.stadium.findMany({
      where,
      orderBy: { capacity: 'desc' }
    });
  } catch (e) {
    console.error(e);
  }

  if (!stadiums || stadiums.length === 0) {
    stadiums = MOCK_STADIUMS;
    if (q) {
      stadiums = stadiums.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
    }
  } else {
    // Merge with mock images
    stadiums = stadiums.map(s => {
      const mock = MOCK_STADIUMS.find(m => m.slug === s.slug);
      return { ...s, imageUrl: mock?.imageUrl || MOCK_STADIUMS[0].imageUrl };
    });
  }

  const groupedByCountry = stadiums.reduce((acc: any, stadium: any) => {
    if (!acc[stadium.countryCode]) acc[stadium.countryCode] = [];
    acc[stadium.countryCode].push(stadium);
    return acc;
  }, {} as Record<string, typeof stadiums>);

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a192f] tracking-tight mb-4">
            Venues
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover the state-of-the-art stadiums that will host the 2026 World Cup across North America.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-xl">
          <form method="GET" action="/stadiums" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="search" 
              name="q" 
              placeholder="Search stadiums by name..." 
              defaultValue={q}
              className="w-full pl-12 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-lg focus-visible:ring-brand-orange"
            />
          </form>
        </div>

        <div className="space-y-16">
          {Object.keys(groupedByCountry).length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No stadiums found matching your search.</p>
            </div>
          )}
          {Object.entries(groupedByCountry).map(([countryCode, countryStadiums]: [string, any]) => (
            <div key={countryCode}>
              <h2 className="text-2xl font-bold text-[#0a192f] mb-6 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-6 h-6 text-[#ff6b00]" />
                {countryCode === 'US' ? 'United States' : countryCode === 'CA' ? 'Canada' : 'Mexico'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {countryStadiums.map((stadium: any) => (
                  <Link href={`/stadiums/${stadium.slug}`} key={stadium.slug}>
                    <Card className="rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer border-none shadow-md bg-white flex flex-col h-full">
                      <div className="aspect-video relative overflow-hidden flex-shrink-0">
                        <Image src={stadium.imageUrl} 
                          alt={stadium.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width={800} height={600} />
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-[#0a192f] text-2xl group-hover:text-[#ff6b00] transition-colors mb-2">
                            {stadium.name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-500 mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{stadium.city}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#0a192f] font-semibold bg-slate-100 w-fit px-3 py-1 rounded-lg text-sm">
                          <Users className="w-4 h-4 text-[#ff6b00]" />
                          Capacity: {stadium.capacity.toLocaleString()}
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
