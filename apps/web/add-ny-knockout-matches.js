const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMatches() {
  const stadium = await prisma.stadium.findFirst({
    where: { city: { contains: 'New York' } }
  });

  const teams = await prisma.team.findMany({
    where: {
      name: {
        in: [
          'Winner FIFA Playoff 1',
          'Winner FIFA Playoff 2',
          'Winner UEFA Playoff A',
          'Winner UEFA Playoff B',
          'Winner UEFA Playoff C',
          'Winner UEFA Playoff D',
        ]
      }
    }
  });

  const getTeam = (name) => teams.find(t => t.name === name);

  const matches = [
    {
      slug: 'match-ny-r32',
      matchNumber: 73, // placeholder
      round: 'Round of 32',
      homeTeamId: getTeam('Winner FIFA Playoff 1').id,
      awayTeamId: getTeam('Winner FIFA Playoff 2').id,
      stadiumId: stadium.id,
      kickoffUtc: new Date('2026-06-30T21:00:00Z'),
      status: 'SCHEDULED',
    },
    {
      slug: 'match-ny-r16',
      matchNumber: 89, // placeholder
      round: 'Round of 16',
      homeTeamId: getTeam('Winner UEFA Playoff A').id,
      awayTeamId: getTeam('Winner UEFA Playoff B').id,
      stadiumId: stadium.id,
      kickoffUtc: new Date('2026-07-05T20:00:00Z'),
      status: 'SCHEDULED',
    },
    {
      slug: 'match-ny-final',
      matchNumber: 104,
      round: 'Final',
      homeTeamId: getTeam('Winner UEFA Playoff C').id,
      awayTeamId: getTeam('Winner UEFA Playoff D').id,
      stadiumId: stadium.id,
      kickoffUtc: new Date('2026-07-19T19:00:00Z'),
      status: 'SCHEDULED',
    }
  ];

  for (const match of matches) {
    await prisma.match.upsert({
      where: { slug: match.slug },
      update: match,
      create: match,
    });
  }

  console.log('Successfully added 3 Knockout matches for New York!');
}

addMatches()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
