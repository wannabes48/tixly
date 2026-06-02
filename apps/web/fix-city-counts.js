const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const matches = await prisma.match.findMany({ include: { stadium: true } });
  
  const cityCounts = {};
  for (const m of matches) {
    const city = m.stadium.city;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  }

  let code = fs.readFileSync('./src/components/home/CityGrid.tsx', 'utf8');
  
  // Replace the matches count dynamically
  const mapping = [
    { slug: 'new-york-nj', dbCity: 'New York/New Jersey' },
    { slug: 'los-angeles', dbCity: 'Los Angeles' },
    { slug: 'dallas', dbCity: 'Dallas' },
    { slug: 'houston', dbCity: 'Houston' },
    { slug: 'atlanta', dbCity: 'Atlanta' },
    { slug: 'philadelphia', dbCity: 'Philadelphia' },
    { slug: 'seattle', dbCity: 'Seattle' },
    { slug: 'san-francisco', dbCity: 'San Francisco Bay Area' },
    { slug: 'boston', dbCity: 'Boston' },
    { slug: 'miami', dbCity: 'Miami' },
    { slug: 'kansas-city', dbCity: 'Kansas City' },
    { slug: 'mexico-city', dbCity: 'Mexico City' },
    { slug: 'guadalajara', dbCity: 'Guadalajara' },
    { slug: 'monterrey', dbCity: 'Monterrey' },
    { slug: 'toronto', dbCity: 'Toronto' },
    { slug: 'vancouver', dbCity: 'Vancouver' },
  ];

  for (const item of mapping) {
    const count = cityCounts[item.dbCity] || 0;
    const regex = new RegExp(`slug: "${item.slug}",\\s*matches: \\d+`);
    code = code.replace(regex, `slug: "${item.slug}",  matches: ${count}`);
  }

  fs.writeFileSync('./src/components/home/CityGrid.tsx', code);
  console.log('CityGrid updated!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
