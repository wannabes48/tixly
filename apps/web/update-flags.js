const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const teams = await prisma.team.findMany({
    where: { flagUrl: null, countryCode: { not: 'TBD' } }
  });

  for (const t of teams) {
    const flagUrl = `https://flagcdn.com/w320/${t.countryCode.toLowerCase()}.png`;
    await prisma.team.update({
      where: { id: t.id },
      data: { flagUrl }
    });
    console.log(`Updated ${t.name} flagUrl to ${flagUrl}`);
  }
}
run().catch(console.error).finally(() => process.exit());
