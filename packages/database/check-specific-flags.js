const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany({ select: { name: true, flagUrl: true }});
  console.log(teams.filter(t => ['England', 'Scotland', 'Wales', 'Netherlands', 'South Korea'].includes(t.name)));
}
main().finally(() => prisma.$disconnect());
