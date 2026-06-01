import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Reading seedData.json...');
  const dataPath = path.join(__dirname, 'seedData.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const { host_cities, matches, teams } = JSON.parse(rawData);

  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies
  await prisma.order.deleteMany({});
  await prisma.ticketListing.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.stadium.deleteMany({});

  console.log('Seeding Stadiums (Host Cities)...');
  for (const city of host_cities) {
    await prisma.stadium.create({
      data: {
        id: `stadium_${city.id}`,
        name: city.venue_name,
        slug: city.venue_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        city: city.city_name,
        countryCode: city.country === 'USA' ? 'US' : city.country === 'Mexico' ? 'MX' : 'CA',
        capacity: 80000, // mock capacity
      }
    });
  }

  console.log('Seeding Teams...');
  for (const team of teams) {
    await prisma.team.create({
      data: {
        id: `team_${team.id}`,
        name: team.team_name,
        slug: team.team_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        countryCode: team.fifa_code,
        confederation: 'FIFA', // Mock confederation
        flagUrl: team.is_placeholder ? null : `https://flagcdn.com/w320/${team.fifa_code.substring(0, 2).toLowerCase()}.png`, // Approximation
      }
    });
  }

  console.log('Seeding Matches...');
  for (const match of matches) {
    // If it's a knockout match, it might not have teams yet
    if (!match.home_team_id || !match.away_team_id) continue;

    const newMatch = await prisma.match.create({
      data: {
        id: `match_${match.id}`,
        slug: `match-${match.match_number}`,
        matchNumber: match.match_number,
        round: match.stage_id === 1 ? 'Group Stage' : 'Knockout',
        group: match.match_label.startsWith('Group') ? match.match_label.replace('Group ', '') : null,
        homeTeamId: `team_${Math.floor(match.home_team_id)}`,
        awayTeamId: `team_${Math.floor(match.away_team_id)}`,
        stadiumId: `stadium_${match.city_id}`,
        kickoffUtc: new Date(match.kickoff_at),
        status: 'SCHEDULED'
      }
    });

    // Generate random mock ticket listings for this match
    const categories = ['CAT1', 'CAT2', 'CAT3', 'CAT4'];
    for (let i = 0; i < 5; i++) {
      await prisma.ticketListing.create({
        data: {
          matchId: newMatch.id,
          category: categories[Math.floor(Math.random() * categories.length)],
          quantity: Math.floor(Math.random() * 4) + 1,
          pricePerTicket: Math.floor(Math.random() * 400) + 100,
          deliveryMethod: 'MOBILE_TRANSFER',
          status: 'ACTIVE'
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
