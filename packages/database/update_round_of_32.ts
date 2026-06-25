import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Adding placeholder teams...");

  const placeholderTeams = [
    { name: "Group A/B/C/D/F third place", code: "TBD1", slug: "group-abcdf-3rd" },
    { name: "Group F winners", code: "TBD2", slug: "group-f-1st" },
    { name: "Group F runners-up", code: "TBD3", slug: "group-f-2nd" },
    { name: "Group C/E/F/H/I third place", code: "TBD4", slug: "group-cephi-3rd" },
    { name: "Group B/E/F/I/J third place", code: "TBD5", slug: "group-befij-3rd" },
    { name: "Group E/F/G/I/J third place", code: "TBD6", slug: "group-efgij-3rd" },
    { name: "Group H runners-up", code: "TBD7", slug: "group-h-2nd" },
    { name: "South Africa", code: "RSA", slug: "south-africa" } // Ensuring SA exists
  ];

  for (const pt of placeholderTeams) {
    await prisma.team.upsert({
      where: { slug: pt.slug },
      update: {},
      create: {
        name: pt.name,
        slug: pt.slug,
        countryCode: pt.code,
        confederation: "TBD",
        flagUrl: pt.code === 'RSA' ? 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg' : null
      }
    });
  }

  // Helper to find team
  const getTeam = async (slug: string) => {
    const team = await prisma.team.findUnique({ where: { slug } });
    if (!team) throw new Error(`Team ${slug} not found`);
    return team;
  };

  // Helper to find stadium
  const getStadium = async (search: string) => {
    const st = await prisma.stadium.findFirst({
      where: { city: { contains: search, mode: 'insensitive' } }
    });
    // Fallback if not found
    if (!st) {
       console.log(`Could not find stadium for city: ${search}`);
       const anySt = await prisma.stadium.findFirst();
       return anySt!;
    }
    return st;
  };

  const matchesToCreate = [
    {
      home: "south-africa",
      away: "canada",
      stadiumSearch: "Toronto", // Defaulting to somewhere if not specified
      timeEAT: "2026-06-28T22:00:00+03:00"
    },
    {
      home: "germany",
      away: "group-abcdf-3rd",
      stadiumSearch: "Boston",
      timeEAT: "2026-06-29T23:30:00+03:00"
    },
    {
      home: "group-f-1st",
      away: "morocco",
      stadiumSearch: "Monterrey",
      timeEAT: "2026-06-30T04:00:00+03:00"
    },
    {
      home: "brazil",
      away: "group-f-2nd",
      stadiumSearch: "Houston",
      timeEAT: "2026-06-29T20:00:00+03:00"
    },
    {
      home: "mexico",
      away: "group-cephi-3rd",
      stadiumSearch: "Mexico City",
      timeEAT: "2026-07-01T20:00:00+03:00" // Guessed time as requested missing
    },
    {
      home: "usa",
      away: "group-befij-3rd",
      stadiumSearch: "San Francisco",
      timeEAT: "2026-07-02T03:00:00+03:00"
    },
    {
      home: "switzerland",
      away: "group-efgij-3rd",
      stadiumSearch: "Vancouver",
      timeEAT: "2026-07-03T06:00:00+03:00"
    },
    {
      home: "argentina",
      away: "group-h-2nd",
      stadiumSearch: "Miami",
      timeEAT: "2026-07-04T01:00:00+03:00"
    }
  ];

  for (let i = 0; i < matchesToCreate.length; i++) {
    const m = matchesToCreate[i];
    const homeTeam = await getTeam(m.home);
    const awayTeam = await getTeam(m.away);
    const stadium = await getStadium(m.stadiumSearch);

    const kickoffUtc = new Date(m.timeEAT);
    
    const matchSlug = `match-r32-${i+1}`;
    await prisma.match.upsert({
      where: { slug: matchSlug },
      update: {
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        stadiumId: stadium.id,
        kickoffUtc,
      },
      create: {
        slug: matchSlug,
        matchNumber: 73 + i, // Arbitrary match number for R32
        round: "Round of 32",
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        stadiumId: stadium.id,
        kickoffUtc
      }
    });
    console.log(`Upserted match: ${homeTeam.name} vs ${awayTeam.name} at ${stadium.name}`);
  }

  console.log("Done updating matches!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
