import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Prisma } from '@tixly/database';

import Image from 'next/image';
const STADIUM_IMAGES: Record<string, string> = {
  'metlife-stadium':         'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307182/Metlife_stadium__Aerial_view_ozywne.jpg',
  'sofi-stadium':            'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307236/SoFi_Stadium_2023_fzzuuc.jpg',
  'estadio-azteca':          'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307185/Estadio_Azteca_-_2026_-_02_jpevn0.jpg',
  'bmo-field':               'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307178/bmo_field_ngoycc.avif',
  'att-stadium':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307180/ATT_economic-1_jqbqoh.jpg',
  'arrowhead-stadium':       'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307175/Aerial_view_of_Arrowhead_Stadium_08-31-2013_podq2f.jpg',
  'nrg-stadium':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307268/Nrg_stadium_dkhltx.jpg',
  'mercedes-benz-stadium':   'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307145/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13_cwql91.jpg',
  'lincoln-financial-field': 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307175/Lincoln_Financial_Field__Aerial_view_bquhy6.jpg',
  'lumen-field':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307070/LumenFieldAerialB500_krblfo.webp',
  'levis-stadium':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307175/levis-stadium-cover_c7qwzt.webp',
  'gillette-stadium':        'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307085/Gillette_Stadium__Top_View_aepxrg.jpg',
  'hard-rock-stadium':       'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307062/hard-rock-stadium-hero_kxq0ml.jpg',
  'bc-place':                'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307069/bcplace_zbkhwe.jpg',
  'estadio-akron':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307058/Estadio-Akron_ncqjr2.jpg',
  'estadio-bbva':            'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307254/Estadio_BBVA_Bancomer_fifa_world_cup_2026_6_cpn91l.jpg',
};

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
    // fallback if no db
    stadiums = Object.entries(STADIUM_IMAGES).map(([slug, img]) => ({
      slug,
      name: slug,
      city: 'Unknown',
      countryCode: 'US',
      capacity: 50000,
      imageUrl: img
    }));
    if (q) {
      stadiums = stadiums.filter(s => s.slug.toLowerCase().includes(q.toLowerCase()));
    }
  } else {
    // Merge with real images
    stadiums = stadiums.map(s => {
      return { ...s, imageUrl: s.imageUrl || STADIUM_IMAGES[s.slug] || 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop' };
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
                          unoptimized
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
