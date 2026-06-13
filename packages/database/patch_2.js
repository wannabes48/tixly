const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function m() {
  await prisma.match.updateMany({
    where: {
      OR: [
        { homeTeam: { name: 'Cabo Verde' }, awayTeam: { name: 'Saudi Arabia' } },
        { homeTeam: { name: 'Saudi Arabia' }, awayTeam: { name: 'Cabo Verde' } }
      ]
    },
    data: { stadiumId: 'stadium_4' }
  });

  await prisma.match.updateMany({
    where: {
      OR: [
        { homeTeam: { name: 'IR Iran' }, awayTeam: { name: 'Egypt' } },
        { homeTeam: { name: 'Egypt' }, awayTeam: { name: 'IR Iran' } }
      ]
    },
    data: { stadiumId: 'stadium_11' }
  });
}

m().then(() => prisma.$disconnect());
