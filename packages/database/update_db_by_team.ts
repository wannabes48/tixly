import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedDataPath = path.join(__dirname, 'src', 'seedData.json');
  const sgtSchedulePath = path.join(__dirname, '../../sgt_schedule.json');
  
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
  const sgtSchedule = JSON.parse(fs.readFileSync(sgtSchedulePath, 'utf8'));

  // Create a map from fifa_code to team_name
  const fifaToName = {};
  for (const team of seedData.teams) {
    fifaToName[team.fifa_code] = team.team_name;
  }

  // Fetch all matches from DB
  const dbMatches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true }
  });

  const monthMap = { 'Jun': '06', 'Jul': '07' };
  
  for (const sgtMatch of sgtSchedule) {
    if (!sgtMatch.fixture || sgtMatch.fixture === "TBC vs TBC") {
        // TBC vs TBC are knockout rounds, they can be matched sequentially based on round or just left alone for now.
        // Actually, let's map them sequentially for the remaining knockout matches.
        continue; 
    }

    // fixture is "MEX vs RSA"
    const parts = sgtMatch.fixture.split(' vs ');
    const homeCode = parts[0].trim();
    const awayCode = parts[1].trim();

    const homeExpected = fifaToName[homeCode];
    const awayExpected = fifaToName[awayCode];

    // Find the match in the DB that matches these teams
    // Note: the db team names might be slightly different.
    // Let's do a loose match or exact match
    const dbMatch = dbMatches.find(m => {
        // fuzzy match name
        const matchHome = m.homeTeam.name.toLowerCase();
        const matchAway = m.awayTeam.name.toLowerCase();
        
        const isMatch = (expected, actual) => {
            if (!expected) return false;
            const exp = expected.toLowerCase();
            return exp === actual || 
                   (exp === 'south korea' && actual === 'korea republic') ||
                   (exp === 'united states' && actual === 'usa');
        };

        return (isMatch(homeExpected, matchHome) && isMatch(awayExpected, matchAway)) ||
               (isMatch(homeExpected, matchAway) && isMatch(awayExpected, matchHome));
    });

    if (dbMatch) {
        const dateParts = sgtMatch.date.split(' ');
        const day = dateParts[1].padStart(2, '0');
        const month = monthMap[dateParts[2]];
        const time = sgtMatch.time; // HH:mm
        const sgtDateString = `2026-${month}-${day}T${time}:00+08:00`;
        const matchDate = new Date(sgtDateString);

        await prisma.match.update({
            where: { id: dbMatch.id },
            data: { kickoffUtc: matchDate }
        });
        console.log(`Updated ${dbMatch.homeTeam.name} vs ${dbMatch.awayTeam.name} to ${matchDate.toISOString()}`);
    } else {
        console.log(`Could not find DB match for ${sgtMatch.fixture} (${homeExpected} vs ${awayExpected})`);
    }
  }

  // Handle TBC vs TBC (knockout)
  let tbcIndex = 0;
  const tbcMatches = sgtSchedule.filter(m => !m.fixture || m.fixture === "TBC vs TBC");
  const dbTbcMatches = dbMatches.filter(m => m.round !== "Group Stage");

  // Sort them by matchNumber
  dbTbcMatches.sort((a,b) => a.matchNumber - b.matchNumber);

  for (let i = 0; i < Math.min(tbcMatches.length, dbTbcMatches.length); i++) {
    const sgtMatch = tbcMatches[i];
    const dbMatch = dbTbcMatches[i];

    const dateParts = sgtMatch.date.split(' ');
    const day = dateParts[1].padStart(2, '0');
    const month = monthMap[dateParts[2]];
    const time = sgtMatch.time; // HH:mm
    const sgtDateString = `2026-${month}-${day}T${time}:00+08:00`;
    const matchDate = new Date(sgtDateString);

    await prisma.match.update({
        where: { id: dbMatch.id },
        data: { kickoffUtc: matchDate }
    });
    console.log(`Updated Knockout Match ${dbMatch.matchNumber} to ${matchDate.toISOString()}`);
  }

  console.log('Finished updating DB times by fixture matching!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
