import { prisma } from '@tixly/database';
import { Link } from '@/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Prisma } from '@tixly/database';

import Image from 'next/image';
const CITY_IMAGES: Record<string, string> = {
  'new-york-nj':           'https://upload.wikimedia.org/wikipedia/commons/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
  'los-angeles':           'https://upload.wikimedia.org/wikipedia/commons/5/5a/Hollywood_Sign_%28Zuschnitt%29.jpg',
  'dallas':                'https://upload.wikimedia.org/wikipedia/commons/0/03/View_of_Dallas_from_Reunion_Tower_August_2015_05.jpg',
  'houston':               'https://upload.wikimedia.org/wikipedia/commons/a/a3/Texas_medical_center.jpg',
  'atlanta':               'https://upload.wikimedia.org/wikipedia/commons/c/c8/A2ATL20250614-0721_%28cropped%29.jpg',
  'philadelphia':          'https://upload.wikimedia.org/wikipedia/commons/1/19/Philadelphia_skyline_20240528_%28cropped_2-1%29.jpg',
  'seattle':               'https://upload.wikimedia.org/wikipedia/commons/5/58/Seattle_Center_as_night_falls.jpg',
  'san-francisco-bay-area':'https://upload.wikimedia.org/wikipedia/commons/f/f9/San_Francisco_Downtown_Aerial%2C_August_2025.jpg',
  'boston':                'https://upload.wikimedia.org/wikipedia/commons/9/96/ISH_WC_Boston4.jpg',
  'miami':                 'https://upload.wikimedia.org/wikipedia/commons/2/28/Miami_wideangle_south_beach.jpg',
  'kansas-city':           'https://upload.wikimedia.org/wikipedia/commons/b/b5/Kansas_City_Missouri_Downtown_2012.jpg',
  'mexico-city':           'https://upload.wikimedia.org/wikipedia/commons/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg',
  'guadalajara':           'https://upload.wikimedia.org/wikipedia/commons/a/a4/Guadalajara_de_noche.JPG',
  'monterrey':             'https://upload.wikimedia.org/wikipedia/commons/9/9b/Monterrey_Mexico_at_night.jpg',
  'toronto':               'https://upload.wikimedia.org/wikipedia/commons/4/43/Toronto_Skyline_From_CN_Tower.jpg',
  'vancouver':             'https://upload.wikimedia.org/wikipedia/commons/b/b5/Vancouver_Skyline_at_dusk.jpg',
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
