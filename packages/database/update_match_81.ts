import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Match 81...");

  // Upsert Bosnia and Herzegovina
  const bosnia = await prisma.team.upsert({
    where: { slug: 'bosnia-and-herzegovina' },
    update: {},
    create: {
      name: "Bosnia and Herzegovina",
      slug: "bosnia-and-herzegovina",
      countryCode: "BA", // Correct ISO code
      confederation: "UEFA",
      flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg"
    }
  });
  console.log(`Ensured team exists: ${bosnia.name}`);

  // Find Match 81
  const match = await prisma.match.findFirst({
    where: { matchNumber: 81 }
  });

  if (!match) {
    console.log("Match 81 not found.");
    return;
  }

  // Update Match 81
  await prisma.match.update({
    where: { id: match.id },
    data: {
      awayTeamId: bosnia.id,
      // Re-generate the slug to match the real teams? 
      // It's probably better to update the slug so the URL makes sense.
      slug: 'usa-vs-bosnia-and-herzegovina-jul-02'
    }
  });

  console.log("Successfully updated Match 81 to USA vs Bosnia and Herzegovina.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
