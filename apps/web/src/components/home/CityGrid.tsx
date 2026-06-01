import { useLocale } from "next-intl";
import { Link } from '@/navigation';
import Image from 'next/image';

interface City {
  name: string;
  slug: string;
  matches: number;
  image: string;
}

interface CountryGroup {
  country: string;
  flag: string;
  cities: City[];
}

const countryGroups: CountryGroup[] = [
  {
    country: "USA",
    flag: "🇺🇸",
    cities: [
      { name: "New York/NJ", slug: "new-york-nj", matches: 8, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop" },
      { name: "Los Angeles", slug: "los-angeles", matches: 7, image: "https://images.unsplash.com/photo-1518481612222-68bbe828def1?w=600&h=400&fit=crop" },
      { name: "Dallas", slug: "dallas", matches: 6, image: "https://images.unsplash.com/photo-1572975929656-749e755519b5?w=600&h=400&fit=crop" },
      { name: "Houston", slug: "houston", matches: 5, image: "https://images.unsplash.com/photo-1516084478335-5154316f73e5?w=600&h=400&fit=crop" },
      { name: "Atlanta", slug: "atlanta", matches: 6, image: "https://images.unsplash.com/photo-1575971480026-64506f23fcf6?w=600&h=400&fit=crop" },
      { name: "Philadelphia", slug: "philadelphia", matches: 5, image: "https://images.unsplash.com/photo-1604104033282-5fbe6089bd16?w=600&h=400&fit=crop" },
      { name: "Seattle", slug: "seattle", matches: 5, image: "https://images.unsplash.com/photo-1502175353174-a7a70e73b4c3?w=600&h=400&fit=crop" },
      { name: "San Francisco Bay Area", slug: "san-francisco", matches: 6, image: "https://images.unsplash.com/photo-1501594907296-3244840e6922?w=600&h=400&fit=crop" },
      { name: "Boston/Foxborough", slug: "boston", matches: 5, image: "https://images.unsplash.com/photo-1506526649718-20da5d92e624?w=600&h=400&fit=crop" },
      { name: "Miami", slug: "miami", matches: 7, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop" },
      { name: "Kansas City", slug: "kansas-city", matches: 5, image: "https://images.unsplash.com/photo-1591942060867-b541334c264a?w=600&h=400&fit=crop" },
    ],
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    cities: [
      { name: "Mexico City", slug: "mexico-city", matches: 7, image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&h=400&fit=crop" },
      { name: "Guadalajara", slug: "guadalajara", matches: 5, image: "https://images.unsplash.com/photo-1592862086910-410ff372a9df?w=600&h=400&fit=crop" },
      { name: "Monterrey", slug: "monterrey", matches: 5, image: "https://images.unsplash.com/photo-1585293297151-5be0cbf9f53e?w=600&h=400&fit=crop" },
    ],
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    cities: [
      { name: "Toronto", slug: "toronto", matches: 6, image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=600&h=400&fit=crop" },
      { name: "Vancouver", slug: "vancouver", matches: 5, image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=600&h=400&fit=crop" },
    ],
  },
];

export default function CityGrid() {
  const locale = useLocale();

  return (
    <section className="bg-[#f9fafb] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-orange">
            16 Venues · 3 Countries
          </p>
          <h2 className="text-3xl font-extrabold text-brand-navy md:text-4xl">
            Host Cities
          </h2>
        </div>

        {/* Country panels */}
        <div className="space-y-14">
          {countryGroups.map((group) => (
            <div key={group.country}>
              {/* Country header */}
              <div className="mb-5 flex items-center gap-3">
                <span className="text-3xl">{group.flag}</span>
                <h3 className="text-xl font-bold text-brand-navy">
                  {group.country}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    {group.cities.length} {group.cities.length === 1 ? "city" : "cities"}
                  </span>
                </h3>
              </div>

              {/* City cards grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {group.cities.map((city, idx) => (
                  <Link
                    key={city.slug}
                    href={`matches?city=${city.slug}`}
                    className={`group relative overflow-hidden rounded-2xl ${
                      idx === 0 ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`relative w-full overflow-hidden ${
                        idx === 0 ? "h-48 md:h-full md:min-h-[320px]" : "h-40 md:h-48"
                      }`}
                    >
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    {/* City name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-base font-bold text-white drop-shadow-md md:text-lg">
                        {city.name}
                      </h4>
                      <span className="mt-1 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {city.matches} matches
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
