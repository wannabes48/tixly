import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating final Round of 32 Matches (79, 80, 82, 83, 84, 85, 87)...");

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

  const pricingTiers = {
    high: { CAT4: 1800, CAT3: 2700, CAT2: 5500, CAT1: 15500 },
    mid: { CAT4: 1100, CAT3: 1600, CAT2: 2800, CAT1: 5200 },
    low: { CAT4: 550, CAT3: 850, CAT2: 1400, CAT1: 2200 }
  };

  const matchUpdates = [
    { num: 79, home: "mexico", away: "ecuador", citySearch: "Mexico City", tier: 'mid' },
    { num: 80, home: "england", away: "dr-congo", citySearch: "Atlanta", tier: 'mid' },
    { num: 82, home: "belgium", away: "senegal", citySearch: "Seattle", tier: 'low' },
    { num: 83, home: "portugal", away: "croatia", citySearch: "Toronto", tier: 'mid' },
    { num: 84, home: "spain", away: "austria", citySearch: "Los Angeles", tier: 'mid' },
    { num: 85, home: "switzerland", away: "algeria", citySearch: "Vancouver", tier: 'low' },
    { num: 87, home: "colombia", away: "ghana", citySearch: "Kansas City", tier: 'low' }
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
          slug: `${homeTeam.slug}-vs-${awayTeam.slug}-jul-05-${update.num}` // Unique slug
        }
      });
      console.log(`Updated Match ${update.num}: ${homeTeam.name} vs ${awayTeam.name} at ${stadium.name}`);

      // Delete old listings for this match
      await prisma.ticketListing.deleteMany({ where: { matchId: matchToUpdate.id } });

      const tier = pricingTiers[update.tier as keyof typeof pricingTiers];
      
      const getPrice = (base: number) => {
        const variation = base * 0.1 * (Math.random() * 2 - 1);
        return Math.round((base + variation) / 10) * 10;
      };

      const listingsToCreate = [
        { category: 'CAT1', section: '102', row: 'A', quantity: 4, pricePerTicket: getPrice(tier.CAT1), deliveryMethod: 'MOBILE_TRANSFER' },
        { category: 'CAT2', section: '205', row: 'F', quantity: 2, pricePerTicket: getPrice(tier.CAT2), deliveryMethod: 'MOBILE_TRANSFER' },
        { category: 'CAT3', section: '315', row: 'K', quantity: 6, pricePerTicket: getPrice(tier.CAT3), deliveryMethod: 'MOBILE_TRANSFER' },
        { category: 'CAT4', section: '422', row: 'Z', quantity: 3, pricePerTicket: getPrice(tier.CAT4), deliveryMethod: 'MOBILE_TRANSFER' }
      ];

      for (const listing of listingsToCreate) {
        await prisma.ticketListing.create({
          data: {
            matchId: matchToUpdate.id,
            ...listing
          }
        });
      }
      console.log(`Seeded tickets for Match ${update.num} with ${update.tier} tier pricing`);
    } else {
      console.log(`Match ${update.num} not found in DB!`);
    }
  }

  console.log("All done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
