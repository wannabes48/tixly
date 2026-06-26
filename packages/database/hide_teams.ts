import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Hiding Denmark, Poland, Wales, and Jamaica...");

  const teamsToHide = ['denmark', 'poland', 'wales', 'jamaica'];

  await prisma.team.updateMany({
    where: { slug: { in: teamsToHide } },
    data: { countryCode: 'TBD' }
  });

  console.log("Successfully removed them from active teams list.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
