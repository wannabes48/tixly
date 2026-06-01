import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed data
const stadiums = [
  { name: 'Estadio Azteca', slug: 'estadio-azteca', city: 'Mexico City', countryCode: 'MX', capacity: 83264, lat: 19.3029, lng: -99.1505 },
  { name: 'MetLife Stadium', slug: 'metlife-stadium', city: 'New York/New Jersey', countryCode: 'US', capacity: 82500, lat: 40.8128, lng: -74.0742 },
  { name: 'AT&T Stadium', slug: 'att-stadium', city: 'Dallas', countryCode: 'US', capacity: 80000, lat: 32.7473, lng: -97.0945 },
  { name: 'Arrowhead Stadium', slug: 'arrowhead-stadium', city: 'Kansas City', countryCode: 'US', capacity: 76416, lat: 39.0489, lng: -94.4839 },
  { name: 'NRG Stadium', slug: 'nrg-stadium', city: 'Houston', countryCode: 'US', capacity: 72220, lat: 29.6847, lng: -95.4107 },
  { name: 'Mercedes-Benz Stadium', slug: 'mercedes-benz-stadium', city: 'Atlanta', countryCode: 'US', capacity: 71000, lat: 33.7553, lng: -84.4006 },
  { name: 'SoFi Stadium', slug: 'sofi-stadium', city: 'Los Angeles', countryCode: 'US', capacity: 70240, lat: 33.9535, lng: -118.3390 },
  { name: 'Lincoln Financial Field', slug: 'lincoln-financial-field', city: 'Philadelphia', countryCode: 'US', capacity: 69796, lat: 39.9008, lng: -75.1675 },
  { name: 'Lumen Field', slug: 'lumen-field', city: 'Seattle', countryCode: 'US', capacity: 69000, lat: 47.5952, lng: -122.3316 },
  { name: 'Levi\'s Stadium', slug: 'levis-stadium', city: 'San Francisco Bay Area', countryCode: 'US', capacity: 68500, lat: 37.4032, lng: -121.9698 },
  { name: 'Gillette Stadium', slug: 'gillette-stadium', city: 'Boston', countryCode: 'US', capacity: 65878, lat: 42.0909, lng: -71.2643 },
  { name: 'Hard Rock Stadium', slug: 'hard-rock-stadium', city: 'Miami', countryCode: 'US', capacity: 64767, lat: 25.9580, lng: -80.2389 },
  { name: 'BC Place', slug: 'bc-place', city: 'Vancouver', countryCode: 'CA', capacity: 54500, lat: 49.2768, lng: -123.1120 },
  { name: 'Estadio BBVA', slug: 'estadio-bbva', city: 'Monterrey', countryCode: 'MX', capacity: 53500, lat: 25.6644, lng: -100.2444 },
  { name: 'Estadio Akron', slug: 'estadio-akron', city: 'Guadalajara', countryCode: 'MX', capacity: 49850, lat: 20.6817, lng: -103.4626 },
  { name: 'BMO Field', slug: 'bmo-field', city: 'Toronto', countryCode: 'CA', capacity: 30000, lat: 43.6332, lng: -79.4186 }
];

const teams = [
  { name: 'Argentina', slug: 'argentina', countryCode: 'AR', confederation: 'CONMEBOL' },
  { name: 'France', slug: 'france', countryCode: 'FR', confederation: 'UEFA' },
  { name: 'Brazil', slug: 'brazil', countryCode: 'BR', confederation: 'CONMEBOL' },
  { name: 'England', slug: 'england', countryCode: 'GB', confederation: 'UEFA' },
  { name: 'USA', slug: 'usa', countryCode: 'US', confederation: 'CONCACAF' },
  { name: 'Mexico', slug: 'mexico', countryCode: 'MX', confederation: 'CONCACAF' },
  { name: 'Canada', slug: 'canada', countryCode: 'CA', confederation: 'CONCACAF' },
  { name: 'Spain', slug: 'spain', countryCode: 'ES', confederation: 'UEFA' },
  { name: 'Germany', slug: 'germany', countryCode: 'DE', confederation: 'UEFA' },
  { name: 'Italy', slug: 'italy', countryCode: 'IT', confederation: 'UEFA' },
  { name: 'Netherlands', slug: 'netherlands', countryCode: 'NL', confederation: 'UEFA' },
  { name: 'Portugal', slug: 'portugal', countryCode: 'PT', confederation: 'UEFA' },
  { name: 'Belgium', slug: 'belgium', countryCode: 'BE', confederation: 'UEFA' },
  { name: 'Croatia', slug: 'croatia', countryCode: 'HR', confederation: 'UEFA' },
  { name: 'Uruguay', slug: 'uruguay', countryCode: 'UY', confederation: 'CONMEBOL' },
  { name: 'Colombia', slug: 'colombia', countryCode: 'CO', confederation: 'CONMEBOL' },
  // Adding placeholders for the rest up to 48
  ...Array.from({ length: 32 }).map((_, i) => ({
    name: `Team ${i + 17}`,
    slug: `team-${i + 17}`,
    countryCode: 'XX',
    confederation: 'FIFA'
  }))
];

async function main() {
  console.log('Seeding database...');
  
  const createdStadiums = [];
  for (const s of stadiums) {
    const stadium = await prisma.stadium.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    createdStadiums.push(stadium);
  }

  const createdTeams = [];
  for (const t of teams) {
    const team = await prisma.team.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    createdTeams.push(team);
  }

  let matchNumber = 1;
  const startDate = new Date('2026-06-11T20:00:00Z');
  
  for (let i = 0; i < 104; i++) {
    const homeTeam = createdTeams[i % 48];
    const awayTeam = createdTeams[(i + 1) % 48];
    const stadium = createdStadiums[i % 16];
    const matchDate = new Date(startDate.getTime() + (i * 12 * 60 * 60 * 1000));
    
    const mon = matchDate.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const dd = matchDate.getDate().toString().padStart(2, '0');
    const slug = `${homeTeam.slug}-vs-${awayTeam.slug}-${mon}-${dd}`;
    
    let round = 'Group Stage';
    if (i >= 72) round = 'Round of 32';
    if (i >= 88) round = 'Round of 16';
    if (i >= 96) round = 'Quarter-finals';
    if (i >= 100) round = 'Semi-finals';
    if (i === 102) round = 'Third place play-off';
    if (i === 103) round = 'Final';

    await prisma.match.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        matchNumber,
        round,
        group: round === 'Group Stage' ? `Group ${String.fromCharCode(65 + (i % 12))}` : null,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        stadiumId: stadium.id,
        kickoffUtc: matchDate,
      }
    });
    matchNumber++;
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
