const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const capacities = [
    { city: 'vancouver', capacity: 48821 },
    { city: 'toronto', capacity: 44315 },
    { city: 'mexico city', capacity: 72766 },
    { city: 'monterrey', capacity: 50113 },
    { city: 'guadalajara', capacity: 44330 },
    { city: 'dallas', capacity: 70122 },
    { city: 'new york', capacity: 78576 },
    { city: 'atlanta', capacity: 67382 },
    { city: 'kansas city', capacity: 67513 },
    { city: 'houston', capacity: 68311 },
    { city: 'los angeles', capacity: 69650 },
    { city: 'philadelphia', capacity: 65827 },
    { city: 'san francisco', capacity: 69391 },
    { city: 'seattle', capacity: 65123 },
    { city: 'miami', capacity: 64091 },
    { city: 'boston', capacity: 63815 }
  ];

  const dbStadiums = await prisma.stadium.findMany();
  
  for (const item of capacities) {
    const dbStadium = dbStadiums.find(s => s.city.toLowerCase().includes(item.city));
    if (dbStadium) {
      await prisma.stadium.update({
        where: { id: dbStadium.id },
        data: { capacity: item.capacity }
      });
      console.log(`Updated ${dbStadium.name} capacity to ${item.capacity}`);
    } else {
      console.log(`WARNING: Could not find stadium for city: ${item.city}`);
    }
  }
  
  console.log('Finished updating stadium capacities!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
