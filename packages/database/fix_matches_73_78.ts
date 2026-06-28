import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing Match 73 and Match 78...");

  // Match 73 fix (cmpwf6yk30001a9743t0t16lc) -> South Africa v Canada
  const southAfrica = await prisma.team.findUnique({ where: { slug: "south-africa" } });
  const canada = await prisma.team.findUnique({ where: { slug: "canada" } });
  const laStadium = await prisma.stadium.findFirst({ where: { city: { contains: "Los Angeles", mode: "insensitive" } } });

  if (southAfrica && canada && laStadium) {
    await prisma.match.update({
      where: { id: "cmpwf6yk30001a9743t0t16lc" },
      data: {
        homeTeamId: southAfrica.id,
        awayTeamId: canada.id,
        stadiumId: laStadium.id,
        slug: "south-africa-vs-canada-jul-05-73"
      }
    });
    console.log("Fixed Match 73: South Africa vs Canada");
  }

  // Match 78 fix -> Update Côte d'Ivoire to the correct Ivory Coast team
  const match78 = await prisma.match.findFirst({ where: { matchNumber: 78 } });
  const correctIvoryCoast = await prisma.team.findUnique({ where: { slug: "ivory-coast" } });

  if (match78 && correctIvoryCoast) {
    await prisma.match.update({
      where: { id: match78.id },
      data: {
        homeTeamId: correctIvoryCoast.id,
        slug: `ivory-coast-vs-norway-jul-05-78`
      }
    });
    console.log("Fixed Match 78: Ivory Coast vs Norway");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
