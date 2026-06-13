import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchNumber: 'asc' }
  });

  console.log(matches.slice(0, 10).map(m => `Match ${m.matchNumber}: ${m.homeTeam.name} vs ${m.awayTeam.name} at ${m.kickoffUtc}`));
}

main().then(() => prisma.$disconnect());
