import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  console.log('Generating mock users...');
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'seller1@tixly.com' },
      update: {},
      create: { name: 'John D.', email: 'seller1@tixly.com', kycStatus: 'VERIFIED' }
    }),
    prisma.user.upsert({
      where: { email: 'seller2@tixly.com' },
      update: {},
      create: { name: 'Sarah M.', email: 'seller2@tixly.com', kycStatus: 'VERIFIED' }
    }),
    prisma.user.upsert({
      where: { email: 'seller3@tixly.com' },
      update: {},
      create: { name: 'Michael T.', email: 'seller3@tixly.com', kycStatus: 'PENDING' }
    })
  ]);

  console.log('Updating all listings with mock sections, rows, and sellers...');
  
  const listings = await prisma.ticketListing.findMany();
  
  let count = 0;
  for (const listing of listings) {
    // Generate deterministic but realistic sections/rows based on category
    let section = '100';
    let row = 'A';
    
    if (listing.category === 'CAT1') {
      section = `Sec 1${Math.floor(Math.random() * 30)}`;
      row = `Row ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`;
    } else if (listing.category === 'CAT2') {
      section = `Sec 2${Math.floor(Math.random() * 30)}`;
      row = `Row ${Math.floor(Math.random() * 20)}`;
    } else {
      section = `Sec 3${Math.floor(Math.random() * 30)}`;
      row = `Row ${String.fromCharCode(65 + Math.floor(Math.random() * 15))}`;
    }

    const randomSeller = users[Math.floor(Math.random() * users.length)];

    await prisma.ticketListing.update({
      where: { id: listing.id },
      data: {
        section,
        row,
        sellerId: randomSeller.id
      }
    });
    
    count++;
    if (count % 100 === 0) console.log(`Updated ${count} listings...`);
  }

  console.log(`Finished updating ${count} listings!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
