import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Matches 75, 76, 78...");

  // Upsert necessary teams
  const teamsToUpsert = [
    { name: "Netherlands", slug: "netherlands", code: "NL", conf: "UEFA" },
    { name: "Morocco", slug: "morocco", code: "MA", conf: "CAF" },
    { name: "Brazil", slug: "brazil", code: "BR", conf: "CONMEBOL" },
    { name: "Japan", slug: "japan", code: "JP", conf: "AFC" },
    { name: "Côte d'Ivoire", slug: "cote-divoire", code: "CI", conf: "CAF" },
    { name: "Group I runners-up", slug: "group-i-2nd", code: "TBD", conf: "TBD" }
  ];

  for (const t of teamsToUpsert) {
    await prisma.team.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        name: t.name,
        slug: t.slug,
        countryCode: t.code,
        confederation: t.conf,
        flagUrl: null // or some generic flag
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
    if (!st) {
       console.log(`Could not find stadium for city: ${search}`);
       const anySt = await prisma.stadium.findFirst();
       return anySt!;
    }
    return st;
  };

  const matchUpdates = [
    { num: 75, home: "netherlands", away: "morocco", citySearch: "Monterrey" },
    { num: 76, home: "brazil", away: "japan", citySearch: "Houston" },
    { num: 78, home: "cote-divoire", away: "group-i-2nd", citySearch: "Dallas" }
  ];

  for (const update of matchUpdates) {
    const homeTeam = await getTeam(update.home);
    const awayTeam = await getTeam(update.away);
    const stadium = await getStadium(update.citySearch);

    const matchToUpdate = await prisma.match.findFirst({
      where: { matchNumber: update.num }
    });

    if (matchToUpdate) {
      await prisma.match.update({
        where: { id: matchToUpdate.id },
        data: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          stadiumId: stadium.id,
          slug: `${homeTeam.slug}-vs-${awayTeam.slug}-jul-04` // Generically set a slug to prevent conflicts, though we could keep the old one
        }
      });
      console.log(`Updated Match ${update.num}: ${homeTeam.name} vs ${awayTeam.name} at ${stadium.name}`);

      // Seed tickets for it
      // Delete old listings for this match to avoid duplicates
      await prisma.ticketListing.deleteMany({ where: { matchId: matchToUpdate.id } });

      const listingsToCreate = [
        { category: 'CAT1', section: '102', row: 'A', quantity: 4, pricePerTicket: 850.00, deliveryMethod: 'MOBILE_TRANSFER' },
        { category: 'CAT2', section: '205', row: 'F', quantity: 2, pricePerTicket: 450.00, deliveryMethod: 'MOBILE_TRANSFER' },
        { category: 'CAT3', section: '315', row: 'K', quantity: 6, pricePerTicket: 220.00, deliveryMethod: 'MOBILE_TRANSFER' },
        { category: 'CAT4', section: '422', row: 'Z', quantity: 3, pricePerTicket: 110.00, deliveryMethod: 'MOBILE_TRANSFER' }
      ];

      for (const listing of listingsToCreate) {
        await prisma.ticketListing.create({
          data: {
            matchId: matchToUpdate.id,
            ...listing
          }
        });
      }
      console.log(`Seeded tickets for Match ${update.num}`);
    } else {
      console.log(`Match ${update.num} not found in DB!`);
    }
  }

  console.log("All done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
