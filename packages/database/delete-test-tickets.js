const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const testListings = await prisma.ticketListing.findMany({
    where: {
      section: 'TEST',
      pricePerTicket: 1
    }
  });

  if (testListings.length === 0) {
    console.log('No test listings found.');
    return;
  }

  for (const listing of testListings) {
    console.log(`Deleting data for test listing ${listing.id}...`);

    // Delete associated TicketHolds
    await prisma.ticketHold.deleteMany({
      where: { listingId: listing.id }
    });

    // Find associated Orders
    const orders = await prisma.order.findMany({
      where: { listingId: listing.id }
    });

    // Delete OrderLogs for those orders
    for (const order of orders) {
      await prisma.orderLog.deleteMany({
        where: { orderId: order.id }
      });
    }

    // Delete Orders
    await prisma.order.deleteMany({
      where: { listingId: listing.id }
    });

    // Delete TicketListing
    await prisma.ticketListing.delete({
      where: { id: listing.id }
    });

    console.log(`Successfully deleted test listing ${listing.id}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
