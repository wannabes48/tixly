import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Prisma } from '@tixly/database';

import Image from 'next/image';
const CITY_IMAGES: Record<string, string> = {
  'new-york-nj':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304169/new-york_omfrh6.jpg',
  'los-angeles':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304222/losangeles_v82zbn.jpg',
  'dallas':                'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304161/Skyline-Dallas-Texas_nticby.webp',
  'houston':               'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304160/houston-skyline_quwptf.jpg',
  'atlanta':               'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304168/atlanta-skyline-georgia_j59ykj.webp',
  'philadelphia':          'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304157/philadelphia_yny63r.jpg',
  'seattle':               'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304165/seattle_sdljvu.avif',
  'san-francisco-bay-area':'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304147/san-francisco-ca_n7lsjj.jpg',
  'boston':                'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304152/boston_a2xiyv.webp',
  'miami':                 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304169/miami_ltw4at.webp',
  'kansas-city':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304166/kansascity_vvckg7.webp',
  'mexico-city':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304180/mexicocity_t7bigt.avif',
  'guadalajara':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304151/guadalajara_r9wo1t.jpg',
  'monterrey':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304181/monterrey_rabcs0.jpg',
  'toronto':               'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304148/toronto_bwnsmn.jpg',
  'vancouver':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304153/vancouver_a4k5zl.jpg',
};

export default async function CitiesPage({ 
  params,
  searchParams,
}: { 
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let dbStadiums: any[] = [];
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

  try {
    const where: Prisma.StadiumWhereInput = {};
    if (q) {
      where.city = { contains: q, mode: 'insensitive' };
    }
    dbStadiums = await prisma.stadium.findMany({ where });
  } catch (e) {
    console.error(e);
  }

  // Extract unique cities from stadiums, or fallback to mock
  let cities = [];
  if (dbStadiums.length > 0) {
    const cityMap = new Map();
    dbStadiums.forEach(s => {
      const slug = s.city.toLowerCase().replace(/[\s/]+/g, '-');
      if (!cityMap.has(slug)) {
        cityMap.set(slug, {
          slug,
          name: s.city,
          countryCode: s.countryCode,
          imageUrl: CITY_IMAGES[slug] || 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop'
        });
      }
    });
    cities = Array.from(cityMap.values());
  } else {
    // mock fallback
    cities = Object.entries(CITY_IMAGES).map(([slug, img]) => ({
      slug,
      name: slug,
      countryCode: 'US',
      imageUrl: img
    }));
  }

  const groupedByCountry = cities.reduce((acc: any, city: any) => {
    if (!acc[city.countryCode]) acc[city.countryCode] = [];
    acc[city.countryCode].push(city);
    return acc;
  }, {} as Record<string, typeof cities>);

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a192f] tracking-tight mb-4">
            Host Cities
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Explore the 16 incredible cities across Canada, Mexico, and the United States hosting the 2026 World Cup.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-xl">
          <form method="GET" action="/cities" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="search" 
              name="q" 
              placeholder="Search host cities..." 
              defaultValue={q}
              className="w-full pl-12 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-lg focus-visible:ring-brand-orange"
            />
          </form>
        </div>

        <div className="space-y-16">
          {Object.keys(groupedByCountry).length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No host cities found matching your search.</p>
            </div>
          )}
          {Object.entries(groupedByCountry).map(([countryCode, countryCities]: [string, any]) => (
            <div key={countryCode}>
              <h2 className="text-2xl font-bold text-[#0a192f] mb-6 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-6 h-6 text-[#ff6b00]" />
                {countryCode === 'US' ? 'United States' : countryCode === 'CA' ? 'Canada' : 'Mexico'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {countryCities.map((city: any) => (
                  <Link href={`/cities/${city.slug}`} key={city.slug}>
                    <Card className="rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group cursor-pointer border-none shadow-md bg-white h-64 relative">
                      <div className="absolute inset-0 z-0">
                        <Image src={city.imageUrl} 
                          alt={city.name} 
                          unoptimized
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" width={800} height={600} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/30 to-transparent" />
                      </div>
                      <CardContent className="relative z-10 h-full flex flex-col justify-end p-6">
                        <h3 className="font-bold text-white text-3xl group-hover:text-[#ff6b00] transition-colors mb-2">
                          {city.name}
                        </h3>
                        <p className="text-slate-200 flex items-center gap-2">
                          View matches & stadiums &rarr;
                        </p>
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
