import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const officialTeams = [
  // UEFA
  { name: "Austria", slug: "austria", countryCode: "at", confederation: "UEFA" },
  { name: "Belgium", slug: "belgium", countryCode: "be", confederation: "UEFA" },
  { name: "Bosnia and Herzegovina", slug: "bosnia-and-herzegovina", countryCode: "ba", confederation: "UEFA" },
  { name: "Croatia", slug: "croatia", countryCode: "hr", confederation: "UEFA" },
  { name: "Czech Republic", slug: "czech-republic", countryCode: "cz", confederation: "UEFA" },
  { name: "Denmark", slug: "denmark", countryCode: "dk", confederation: "UEFA" },
  { name: "England", slug: "england", countryCode: "gb-eng", confederation: "UEFA" },
  { name: "France", slug: "france", countryCode: "fr", confederation: "UEFA" },
  { name: "Germany", slug: "germany", countryCode: "de", confederation: "UEFA" },
  { name: "Netherlands", slug: "netherlands", countryCode: "nl", confederation: "UEFA" },
  { name: "Norway", slug: "norway", countryCode: "no", confederation: "UEFA" },
  { name: "Poland", slug: "poland", countryCode: "pl", confederation: "UEFA" },
  { name: "Portugal", slug: "portugal", countryCode: "pt", confederation: "UEFA" },
  { name: "Scotland", slug: "scotland", countryCode: "gb-sct", confederation: "UEFA" },
  { name: "Spain", slug: "spain", countryCode: "es", confederation: "UEFA" },
  { name: "Sweden", slug: "sweden", countryCode: "se", confederation: "UEFA" },
  { name: "Switzerland", slug: "switzerland", countryCode: "ch", confederation: "UEFA" },
  { name: "Turkey", slug: "turkey", countryCode: "tr", confederation: "UEFA" },
  { name: "Wales", slug: "wales", countryCode: "gb-wls", confederation: "UEFA" },
  // CONMEBOL
  { name: "Argentina", slug: "argentina", countryCode: "ar", confederation: "CONMEBOL" },
  { name: "Brazil", slug: "brazil", countryCode: "br", confederation: "CONMEBOL" },
  { name: "Colombia", slug: "colombia", countryCode: "co", confederation: "CONMEBOL" },
  { name: "Ecuador", slug: "ecuador", countryCode: "ec", confederation: "CONMEBOL" },
  { name: "Paraguay", slug: "paraguay", countryCode: "py", confederation: "CONMEBOL" },
  { name: "Uruguay", slug: "uruguay", countryCode: "uy", confederation: "CONMEBOL" },
  // CAF
  { name: "Algeria", slug: "algeria", countryCode: "dz", confederation: "CAF" },
  { name: "Cape Verde", slug: "cape-verde", countryCode: "cv", confederation: "CAF" },
  { name: "DR Congo", slug: "dr-congo", countryCode: "cd", confederation: "CAF" },
  { name: "Egypt", slug: "egypt", countryCode: "eg", confederation: "CAF" },
  { name: "Ghana", slug: "ghana", countryCode: "gh", confederation: "CAF" },
  { name: "Ivory Coast", slug: "ivory-coast", countryCode: "ci", confederation: "CAF" },
  { name: "Morocco", slug: "morocco", countryCode: "ma", confederation: "CAF" },
  { name: "Senegal", slug: "senegal", countryCode: "sn", confederation: "CAF" },
  { name: "South Africa", slug: "south-africa", countryCode: "za", confederation: "CAF" },
  { name: "Tunisia", slug: "tunisia", countryCode: "tn", confederation: "CAF" },
  // CONCACAF
  { name: "Canada", slug: "canada", countryCode: "ca", confederation: "CONCACAF" },
  { name: "Curaçao", slug: "curacao", countryCode: "cw", confederation: "CONCACAF" },
  { name: "Haiti", slug: "haiti", countryCode: "ht", confederation: "CONCACAF" },
  { name: "Jamaica", slug: "jamaica", countryCode: "jm", confederation: "CONCACAF" },
  { name: "Mexico", slug: "mexico", countryCode: "mx", confederation: "CONCACAF" },
  { name: "Panama", slug: "panama", countryCode: "pa", confederation: "CONCACAF" },
  { name: "United States", slug: "usa", countryCode: "us", confederation: "CONCACAF" },
  // AFC
  { name: "Australia", slug: "australia", countryCode: "au", confederation: "AFC" },
  { name: "Iran", slug: "iran", countryCode: "ir", confederation: "AFC" },
  { name: "Iraq", slug: "iraq", countryCode: "iq", confederation: "AFC" },
  { name: "Japan", slug: "japan", countryCode: "jp", confederation: "AFC" },
  { name: "Jordan", slug: "jordan", countryCode: "jo", confederation: "AFC" },
  { name: "Qatar", slug: "qatar", countryCode: "qa", confederation: "AFC" },
  { name: "Saudi Arabia", slug: "saudi-arabia", countryCode: "sa", confederation: "AFC" },
  { name: "South Korea", slug: "south-korea", countryCode: "kr", confederation: "AFC" },
  { name: "Uzbekistan", slug: "uzbekistan", countryCode: "uz", confederation: "AFC" },
  // OFC
  { name: "New Zealand", slug: "new-zealand", countryCode: "nz", confederation: "OFC" }
];

async function main() {
  console.log("Updating all teams...");

  // First, set all teams to TBD so they don't show on the Teams page
  await prisma.team.updateMany({
    data: { countryCode: 'TBD' }
  });

  console.log("Set all current teams to TBD.");

  for (const t of officialTeams) {
    await prisma.team.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        countryCode: t.countryCode.toUpperCase(),
        confederation: t.confederation
      },
      create: {
        name: t.name,
        slug: t.slug,
        countryCode: t.countryCode.toUpperCase(),
        confederation: t.confederation,
        flagUrl: `https://flagcdn.com/w320/${t.countryCode}.png` // Simple fallback
      }
    });
  }

  console.log("Upserted 48 official teams successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
