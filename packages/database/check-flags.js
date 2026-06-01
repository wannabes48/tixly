const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany({ select: { name: true, flagUrl: true }});
  const missing = teams.filter(t => !t.flagUrl || t.flagUrl === '' || t.flagUrl.includes('undefined'));
  console.log('Missing flags:', missing);
}
main().finally(() => prisma.$disconnect());
