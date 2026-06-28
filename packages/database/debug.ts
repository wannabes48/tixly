import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const match73 = await prisma.match.findFirst({ where: { matchNumber: 73 }, include: { homeTeam: true, awayTeam: true } });
  console.log("Current Match 73:", match73);
  
  const matchById = await prisma.match.findUnique({ where: { id: 'cmpwf6yk30001a9743t0t16lc' }, include: { homeTeam: true, awayTeam: true } });
  console.log("Match by ID:", matchById);

  const coteDIvoire = await prisma.team.findFirst({ where: { name: { contains: "Ivoire" } } });
  console.log("Côte d'Ivoire team:", coteDIvoire);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
