const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find an upcoming match that is at least tomorrow
  const match = await prisma.match.findFirst({
    where: { kickoffUtc: { gt: tomorrow } },
    orderBy: { kickoffUtc: 'asc' }
  });

  if (!match) {
    console.error('No upcoming matches found!');
    process.exit(1);
  }

  // Find a seller (create one if none exist)
  let user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!user) {
    user = await prisma.user.findFirst();
  }

  const listing = await prisma.ticketListing.create({
    data: {
      matchId: match.id,
      sellerId: user?.id,
      section: 'TEST',
      row: '1',
      category: 'CAT1',
      quantity: 10,
      pricePerTicket: 1, // $1 Ticket
      status: 'ACTIVE',
      deliveryMethod: 'MOBILE_TRANSFER',
    }
  });

  console.log(`Successfully created $1 ticket listing (ID: ${listing.id}) for match ${match.id}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
