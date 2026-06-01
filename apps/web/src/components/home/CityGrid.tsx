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
      { name: "New York/NJ",           slug: "new-york-nj",  matches: 8, image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg" },
      { name: "Los Angeles",           slug: "los-angeles",  matches: 7, image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Hollywood_Sign_%28Zuschnitt%29.jpg" },
      { name: "Dallas",                slug: "dallas",       matches: 6, image: "https://upload.wikimedia.org/wikipedia/commons/0/03/View_of_Dallas_from_Reunion_Tower_August_2015_05.jpg" },
      { name: "Houston",               slug: "houston",      matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Texas_medical_center.jpg" },
      { name: "Atlanta",               slug: "atlanta",      matches: 6, image: "https://upload.wikimedia.org/wikipedia/commons/c/c8/A2ATL20250614-0721_%28cropped%29.jpg" },
      { name: "Philadelphia",          slug: "philadelphia", matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Philadelphia_skyline_20240528_%28cropped_2-1%29.jpg" },
      { name: "Seattle",               slug: "seattle",      matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/5/58/Seattle_Center_as_night_falls.jpg" },
      { name: "San Francisco Bay Area", slug: "san-francisco",matches: 6, image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/San_Francisco_Downtown_Aerial%2C_August_2025.jpg" },
      { name: "Boston/Foxborough",     slug: "boston",       matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/9/96/ISH_WC_Boston4.jpg" },
      { name: "Miami",                 slug: "miami",        matches: 7, image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Miami_wideangle_south_beach.jpg" },
      { name: "Kansas City",           slug: "kansas-city",  matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Kansas_City_Missouri_Downtown_2012.jpg" },
    ],
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    cities: [
      { name: "Mexico City", slug: "mexico-city", matches: 7, image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg" },
      { name: "Guadalajara", slug: "guadalajara",  matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Guadalajara_de_noche.JPG" },
      { name: "Monterrey",   slug: "monterrey",   matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Monterrey_Mexico_at_night.jpg" },
    ],
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    cities: [
      { name: "Toronto",   slug: "toronto",   matches: 6, image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Toronto_Skyline_From_CN_Tower.jpg" },
      { name: "Vancouver", slug: "vancouver", matches: 5, image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Vancouver_Skyline_at_dusk.jpg" },
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
                        unoptimized
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
