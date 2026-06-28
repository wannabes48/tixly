import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { name: { contains: "Ivoire", mode: 'insensitive' } },
        { name: { contains: "Ivory", mode: 'insensitive' } }
      ]
    }
  });
  console.log("Found teams:", teams);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
