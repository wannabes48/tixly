import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedDataPath = path.join(__dirname, 'src', 'seedData.json');
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  for (let i = 0; i < seedData.matches.length; i++) {
    const dbMatch = seedData.matches[i];
    
    // We update the match by matchNumber
    await prisma.match.updateMany({
      where: { matchNumber: dbMatch.match_number },
      data: {
        kickoffUtc: new Date(dbMatch.kickoff_at)
      }
    });

    console.log(`Updated Match ${dbMatch.match_number} to ${dbMatch.kickoff_at}`);
  }

  console.log('Finished updating all matches in database.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
