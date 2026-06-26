import { useLocale } from "next-intl";
import { Link } from '@/navigation';

interface Team {
  name: string;
  slug: string;
  flag: string;
  matches: number;
  confederation: string;
  countryCode: string;
}

const teams: Team[] = [
  // UEFA
  { name: "Austria", slug: "austria", flag: "🇦🇹", matches: 3, confederation: "UEFA", countryCode: "at" },
  { name: "Belgium", slug: "belgium", flag: "🇧🇪", matches: 3, confederation: "UEFA", countryCode: "be" },
  { name: "Bosnia and Herzegovina", slug: "bosnia-and-herzegovina", flag: "🇧🇦", matches: 3, confederation: "UEFA", countryCode: "ba" },
  { name: "Croatia", slug: "croatia", flag: "🇭🇷", matches: 3, confederation: "UEFA", countryCode: "hr" },
  { name: "Czech Republic", slug: "czech-republic", flag: "🇨🇿", matches: 3, confederation: "UEFA", countryCode: "cz" },
  { name: "England", slug: "england", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", matches: 3, confederation: "UEFA", countryCode: "gb-eng" },
  { name: "France", slug: "france", flag: "🇫🇷", matches: 3, confederation: "UEFA", countryCode: "fr" },
  { name: "Germany", slug: "germany", flag: "🇩🇪", matches: 3, confederation: "UEFA", countryCode: "de" },
  { name: "Netherlands", slug: "netherlands", flag: "🇳🇱", matches: 3, confederation: "UEFA", countryCode: "nl" },
  { name: "Norway", slug: "norway", flag: "🇳🇴", matches: 3, confederation: "UEFA", countryCode: "no" },
  { name: "Portugal", slug: "portugal", flag: "🇵🇹", matches: 3, confederation: "UEFA", countryCode: "pt" },
  { name: "Scotland", slug: "scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", matches: 3, confederation: "UEFA", countryCode: "gb-sct" },
  { name: "Spain", slug: "spain", flag: "🇪🇸", matches: 3, confederation: "UEFA", countryCode: "es" },
  { name: "Sweden", slug: "sweden", flag: "🇸🇪", matches: 3, confederation: "UEFA", countryCode: "se" },
  { name: "Switzerland", slug: "switzerland", flag: "🇨🇭", matches: 3, confederation: "UEFA", countryCode: "ch" },
  { name: "Turkey", slug: "turkey", flag: "🇹🇷", matches: 3, confederation: "UEFA", countryCode: "tr" },
  // CONMEBOL
  { name: "Argentina", slug: "argentina", flag: "🇦🇷", matches: 3, confederation: "CONMEBOL", countryCode: "ar" },
  { name: "Brazil", slug: "brazil", flag: "🇧🇷", matches: 3, confederation: "CONMEBOL", countryCode: "br" },
  { name: "Colombia", slug: "colombia", flag: "🇨🇴", matches: 3, confederation: "CONMEBOL", countryCode: "co" },
  { name: "Ecuador", slug: "ecuador", flag: "🇪🇨", matches: 3, confederation: "CONMEBOL", countryCode: "ec" },
  { name: "Paraguay", slug: "paraguay", flag: "🇵🇾", matches: 3, confederation: "CONMEBOL", countryCode: "py" },
  { name: "Uruguay", slug: "uruguay", flag: "🇺🇾", matches: 3, confederation: "CONMEBOL", countryCode: "uy" },
  // CAF
  { name: "Algeria", slug: "algeria", flag: "🇩🇿", matches: 3, confederation: "CAF", countryCode: "dz" },
  { name: "Cape Verde", slug: "cape-verde", flag: "🇨🇻", matches: 3, confederation: "CAF", countryCode: "cv" },
  { name: "DR Congo", slug: "dr-congo", flag: "🇨🇩", matches: 3, confederation: "CAF", countryCode: "cd" },
  { name: "Egypt", slug: "egypt", flag: "🇪🇬", matches: 3, confederation: "CAF", countryCode: "eg" },
  { name: "Ghana", slug: "ghana", flag: "🇬🇭", matches: 3, confederation: "CAF", countryCode: "gh" },
  { name: "Ivory Coast", slug: "ivory-coast", flag: "🇨🇮", matches: 3, confederation: "CAF", countryCode: "ci" },
  { name: "Morocco", slug: "morocco", flag: "🇲🇦", matches: 3, confederation: "CAF", countryCode: "ma" },
  { name: "Senegal", slug: "senegal", flag: "🇸🇳", matches: 3, confederation: "CAF", countryCode: "sn" },
  { name: "South Africa", slug: "south-africa", flag: "🇿🇦", matches: 3, confederation: "CAF", countryCode: "za" },
  { name: "Tunisia", slug: "tunisia", flag: "🇹🇳", matches: 3, confederation: "CAF", countryCode: "tn" },
  // CONCACAF
  { name: "Canada", slug: "canada", flag: "🇨🇦", matches: 3, confederation: "CONCACAF", countryCode: "ca" },
  { name: "Curaçao", slug: "curacao", flag: "🇨🇼", matches: 3, confederation: "CONCACAF", countryCode: "cw" },
  { name: "Haiti", slug: "haiti", flag: "🇭🇹", matches: 3, confederation: "CONCACAF", countryCode: "ht" },
  { name: "Mexico", slug: "mexico", flag: "🇲🇽", matches: 3, confederation: "CONCACAF", countryCode: "mx" },
  { name: "Panama", slug: "panama", flag: "🇵🇦", matches: 3, confederation: "CONCACAF", countryCode: "pa" },
  { name: "USA", slug: "usa", flag: "🇺🇸", matches: 3, confederation: "CONCACAF", countryCode: "us" },
  // AFC
  { name: "Australia", slug: "australia", flag: "🇦🇺", matches: 3, confederation: "AFC", countryCode: "au" },
  { name: "Iran", slug: "iran", flag: "🇮🇷", matches: 3, confederation: "AFC", countryCode: "ir" },
  { name: "Iraq", slug: "iraq", flag: "🇮🇶", matches: 3, confederation: "AFC", countryCode: "iq" },
  { name: "Japan", slug: "japan", flag: "🇯🇵", matches: 3, confederation: "AFC", countryCode: "jp" },
  { name: "Jordan", slug: "jordan", flag: "🇯🇴", matches: 3, confederation: "AFC", countryCode: "jo" },
  { name: "Qatar", slug: "qatar", flag: "🇶🇦", matches: 3, confederation: "AFC", countryCode: "qa" },
  { name: "Saudi Arabia", slug: "saudi-arabia", flag: "🇸🇦", matches: 3, confederation: "AFC", countryCode: "sa" },
  { name: "South Korea", slug: "south-korea", flag: "🇰🇷", matches: 3, confederation: "AFC", countryCode: "kr" },
  { name: "Uzbekistan", slug: "uzbekistan", flag: "🇺🇿", matches: 3, confederation: "AFC", countryCode: "uz" },
  // OFC
  { name: "New Zealand", slug: "new-zealand", flag: "🇳🇿", matches: 3, confederation: "OFC", countryCode: "nz" }
];

const confederationLabels: Record<string, string> = {
  UEFA: "UEFA (16)",
  CONMEBOL: "CONMEBOL (6)",
  CONCACAF: "CONCACAF (6)",
  CAF: "CAF (10)",
  AFC: "AFC (9)",
  OFC: "OFC (1)",
};

const confederationOrder = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];

export default function TeamGrid() {
  const locale = useLocale();

  const grouped = confederationOrder.reduce<Record<string, Team[]>>((acc, conf) => {
    acc[conf] = teams.filter((t) => t.confederation === conf);
    return acc;
  }, {});

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Subtle Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1508344928928-7137b2f3479a?w=1920&q=80")',
        }}
      />
      {/* Heavy light overlay to keep cards popping and text readable */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md/95" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-[13px] font-medium uppercase tracking-editorial text-brand-orange">
            48 Nations
          </p>
          <h2 className="text-3xl font-semibold text-brand-navy md:text-4xl">
            Browse by Team
          </h2>
        </div>

        {/* Confederation groups */}
        <div className="space-y-10">
          {confederationOrder.map((conf) => (
            <div key={conf}>
              <h3 className="mb-4 text-[12px] font-medium uppercase tracking-editorial text-gray-500">
                {confederationLabels[conf]}
              </h3>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {grouped[conf].map((team) => (
                  <Link
                    key={team.slug}
                    href={`matches?team=${team.slug}`}
                    className="group relative overflow-hidden rounded-2xl min-h-[120px] bg-cover bg-center transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-lg"
                    style={{
                      backgroundImage: `url(https://flagcdn.com/w640/${team.countryCode}.png)`,
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-brand-navy/20 group-hover:from-brand-orange/90 group-hover:via-brand-orange/40 transition-all duration-300 rounded-2xl" />

                    {/* Team name */}
                    <span className="absolute bottom-8 left-0 right-0 text-center text-sm font-semibold text-white drop-shadow-md">
                      {team.name}
                    </span>

                    {/* Match count badge */}
                    <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-medium text-white/80">
                      {team.matches} matches
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* View All link */}
        <div className="mt-12 text-center">
          <Link
            href="/teams"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange transition-colors hover:text-orange-700"
          >
            View All 48 Teams →
          </Link>
        </div>
      </div>
    </section>
  );
}
