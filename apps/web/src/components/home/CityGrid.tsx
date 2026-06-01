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
      { name: "New York/NJ",           slug: "new-york-nj",  matches: 8, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304169/new-york_omfrh6.jpg" },
      { name: "Los Angeles",           slug: "los-angeles",  matches: 7, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304222/losangeles_v82zbn.jpg" },
      { name: "Dallas",                slug: "dallas",       matches: 6, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304161/Skyline-Dallas-Texas_nticby.webp" },
      { name: "Houston",               slug: "houston",      matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304160/houston-skyline_quwptf.jpg" },
      { name: "Atlanta",               slug: "atlanta",      matches: 6, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304168/atlanta-skyline-georgia_j59ykj.webp" },
      { name: "Philadelphia",          slug: "philadelphia", matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304157/philadelphia_yny63r.jpg" },
      { name: "Seattle",               slug: "seattle",      matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304165/seattle_sdljvu.avif" },
      { name: "San Francisco Bay Area", slug: "san-francisco",matches: 6, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304147/san-francisco-ca_n7lsjj.jpg" },
      { name: "Boston/Foxborough",     slug: "boston",       matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304152/boston_a2xiyv.webp" },
      { name: "Miami",                 slug: "miami",        matches: 7, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304169/miami_ltw4at.webp" },
      { name: "Kansas City",           slug: "kansas-city",  matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304166/kansascity_vvckg7.webp" },
    ],
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    cities: [
      { name: "Mexico City", slug: "mexico-city", matches: 7, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304180/mexicocity_t7bigt.avif" },
      { name: "Guadalajara", slug: "guadalajara",  matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304151/guadalajara_r9wo1t.jpg" },
      { name: "Monterrey",   slug: "monterrey",   matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304181/monterrey_rabcs0.jpg" },
    ],
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    cities: [
      { name: "Toronto",   slug: "toronto",   matches: 6, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304148/toronto_bwnsmn.jpg" },
      { name: "Vancouver", slug: "vancouver", matches: 5, image: "https://res.cloudinary.com/dm12f7lnc/image/upload/v1780304153/vancouver_a4k5zl.jpg" },
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
