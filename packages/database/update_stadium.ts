import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stadium = await prisma.stadium.findFirst({
    where: { name: { contains: "SoFi", mode: 'insensitive' } }
  });

  if (!stadium) {
    console.log("SoFi Stadium not found.");
    return;
  }

  // Find the match
  const match = await prisma.match.findUnique({
    where: { slug: 'match-r32-1' } // This was the slug assigned in the previous script
  });

  if (match) {
    await prisma.match.update({
      where: { id: match.id },
      data: { stadiumId: stadium.id }
    });
    console.log("Successfully updated match to SoFi Stadium.");
  } else {
    console.log("Match not found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
