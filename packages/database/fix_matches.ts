import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting match fix...");

  // 1. Delete 1 dollar test tickets across the board
  await prisma.ticketListing.deleteMany({
    where: { pricePerTicket: 1.00 }
  });
  console.log("Deleted $1 test tickets.");

  // 2. Delete the incorrectly named matches and their associated tickets
  for (let i = 1; i <= 8; i++) {
    const slug = `match-r32-${i}`;
    const match = await prisma.match.findUnique({ where: { slug } });
    if (match) {
      await prisma.ticketListing.deleteMany({ where: { matchId: match.id } });
      await prisma.match.delete({ where: { id: match.id } });
      console.log(`Deleted incorrect match: ${slug}`);
    }
  }

  // 3. Update existing match numbers
  const matchUpdates = [
    { num: 73, home: "south-africa", away: "canada", citySearch: "Los Angeles", timeEAT: "2026-06-28T22:00:00+03:00" },
    { num: 74, home: "germany", away: "group-abcdf-3rd", citySearch: "Boston", timeEAT: "2026-06-29T23:30:00+03:00" },
    { num: 75, home: "group-f-1st", away: "morocco", citySearch: "Monterrey", timeEAT: "2026-06-30T04:00:00+03:00" },
    { num: 76, home: "brazil", away: "group-f-2nd", citySearch: "Houston", timeEAT: "2026-06-29T20:00:00+03:00" },
    { num: 79, home: "mexico", away: "group-cephi-3rd", citySearch: "Mexico City", timeEAT: "2026-07-01T20:00:00+03:00" },
    { num: 81, home: "usa", away: "group-befij-3rd", citySearch: "San Francisco", timeEAT: "2026-07-02T03:00:00+03:00" },
    { num: 85, home: "switzerland", away: "group-efgij-3rd", citySearch: "Vancouver", timeEAT: "2026-07-03T06:00:00+03:00" },
    { num: 86, home: "argentina", away: "group-h-2nd", citySearch: "Miami", timeEAT: "2026-07-04T01:00:00+03:00" }
  ];

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

  for (const update of matchUpdates) {
    const homeTeam = await getTeam(update.home);
    const awayTeam = await getTeam(update.away);
    const stadium = await getStadium(update.citySearch);
    const kickoffUtc = new Date(update.timeEAT);

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
          kickoffUtc,
          round: "Round of 32"
        }
      });
      console.log(`Updated Match ${update.num}: ${homeTeam.name} vs ${awayTeam.name} at ${stadium.name}`);

      // Delete old listings for this match to avoid duplicates, then seed new ones
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
