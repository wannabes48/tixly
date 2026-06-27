import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating ticket prices based on market tiers...");

  // Match identifiers (by team slug or match number)
  const highDemandMatchNumbers = [86, 81, 76]; // ARG v CPV, USA v BIH, BRA v JPN
  const midDemandMatchNumbers = [75, 77, 74, 79]; // NED v MAR, FRA v SWE, GER v PAR, MEX v TBD
  const lowDemandMatchNumbers = [73, 85, 78, 88]; // RSA v CAN, SUI v TBD, CIV v NOR, AUS v EGY

  // Base prices per category for each tier
  const pricingTiers = {
    high: { CAT4: 1800, CAT3: 2700, CAT2: 5500, CAT1: 15500 },
    mid: { CAT4: 1100, CAT3: 1600, CAT2: 2800, CAT1: 5200 },
    low: { CAT4: 550, CAT3: 850, CAT2: 1400, CAT1: 2200 }
  };

  const updateMatchTickets = async (matchNumbers: number[], tier: keyof typeof pricingTiers) => {
    for (const num of matchNumbers) {
      const match = await prisma.match.findFirst({
        where: { matchNumber: num }
      });
      if (match) {
        const listings = await prisma.ticketListing.findMany({
          where: { matchId: match.id }
        });

        for (const listing of listings) {
          // Add some random variation (±10%) to make it look realistic
          const basePrice = pricingTiers[tier][listing.category as keyof typeof pricingTiers['high']] || 1000;
          const variation = basePrice * 0.1 * (Math.random() * 2 - 1);
          const newPrice = Math.round((basePrice + variation) / 10) * 10; // Round to nearest 10

          await prisma.ticketListing.update({
            where: { id: listing.id },
            data: { pricePerTicket: newPrice }
          });
        }
        console.log(`Updated prices for Match ${num} (Tier: ${tier})`);
      } else {
        console.log(`Match ${num} not found.`);
      }
    }
  };

  await updateMatchTickets(highDemandMatchNumbers, 'high');
  await updateMatchTickets(midDemandMatchNumbers, 'mid');
  await updateMatchTickets(lowDemandMatchNumbers, 'low');

  console.log("All ticket prices updated.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
