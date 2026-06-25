import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const matchSlugs = [
    'match-r32-1', 'match-r32-2', 'match-r32-3', 'match-r32-4', 
    'match-r32-5', 'match-r32-6', 'match-r32-7', 'match-r32-8'
  ];

  for (const slug of matchSlugs) {
    const match = await prisma.match.findUnique({
      where: { slug }
    });

    if (!match) {
      console.log(`Match ${slug} not found, skipping...`);
      continue;
    }

    // Create 4 distinct listings for each match (CAT1 to CAT4)
    const listingsToCreate = [
      { category: 'CAT1', section: '102', row: 'A', quantity: 4, pricePerTicket: 850.00, deliveryMethod: 'MOBILE_TRANSFER' },
      { category: 'CAT2', section: '205', row: 'F', quantity: 2, pricePerTicket: 450.00, deliveryMethod: 'MOBILE_TRANSFER' },
      { category: 'CAT3', section: '315', row: 'K', quantity: 6, pricePerTicket: 220.00, deliveryMethod: 'MOBILE_TRANSFER' },
      { category: 'CAT4', section: '422', row: 'Z', quantity: 3, pricePerTicket: 110.00, deliveryMethod: 'MOBILE_TRANSFER' },
      { category: 'CAT1', section: 'VIP', row: 'VIP', quantity: 2, pricePerTicket: 1.00, deliveryMethod: 'MOBILE_TRANSFER' } // 1 dollar ticket for testing
    ];

    let count = 0;
    for (const listing of listingsToCreate) {
      await prisma.ticketListing.create({
        data: {
          matchId: match.id,
          ...listing
        }
      });
      count++;
    }

    console.log(`Created ${count} ticket listings for match ${slug}`);
  }

  console.log("All tickets seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
