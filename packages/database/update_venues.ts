import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function parseTime(dateStr, timeStr) {
  const et = timeStr.split('/')[1].trim(); // "4:00PM"
  const match = et.match(/(\d+):(\d+)(AM|PM)/);
  let h = parseInt(match[1]);
  let m = parseInt(match[2]);
  if (match[3] === 'PM' && h !== 12) h += 12;
  if (match[3] === 'AM' && h === 12) h = 0;
  
  const utcHour = h + 4;
  
  const monthMap = { 'Jun': '06', 'Jul': '07' };
  const dParts = dateStr.split(' ');
  const month = monthMap[dParts[0]];
  const day = dParts[1].padStart(2, '0');
  
  const d = new Date(`2026-${month}-${day}T00:00:00Z`);
  d.setUTCHours(utcHour, m, 0, 0);
  return d;
}

const manualMapping = {
    'Curacao': 'Curaçao',
    'Turkiye': 'Türkiye',
    'Ivory Coast': "Côte d'Ivoire",
    'South Korea': 'Korea Republic',
    'United States': 'USA',
    'Congo DR': 'Congo DR',
    'Bosnia and Herzegovina': 'Bosnia and Herzegovina'
};

function getExpectedName(name) {
    if (manualMapping[name]) return manualMapping[name];
    return name;
}

async function main() {
  const venuesPath = path.join(__dirname, 'new_venues.json');
  const venuesData = JSON.parse(fs.readFileSync(venuesPath, 'utf8'));

  const dbMatches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true }
  });

  const dbStadiums = await prisma.stadium.findMany();

  for (const item of venuesData) {
    const rawVenue = item.venue.split(';')[0].trim();
    let stadiumName = rawVenue;
    if (stadiumName === 'Estadio BBVA Bancomer') stadiumName = 'Estadio BBVA';
    
    // Find stadium
    const stadium = dbStadiums.find(s => s.name.toLowerCase().includes(stadiumName.toLowerCase()) || stadiumName.toLowerCase().includes(s.name.toLowerCase()));
    
    if (!stadium) {
        console.log(`Could not find stadium for ${rawVenue}`);
        continue;
    }

    const expectedUtc = parseTime(item.date, item.time_pt_et);
    let targetMatch = null;

    if (item.match.includes('vs') && !item.match.includes('Round of')) {
        // Group stage match
        const parts = item.match.split(' vs ');
        const homeExpected = getExpectedName(parts[0].trim());
        const awayExpected = getExpectedName(parts[1].trim());

        targetMatch = dbMatches.find(m => {
            const matchHome = m.homeTeam.name;
            const matchAway = m.awayTeam.name;
            
            const isMatch = (expected, actual) => {
                if (!expected) return false;
                const exp = expected.toLowerCase();
                const act = actual.toLowerCase();
                return exp === act || (exp === 'saudia arabia' && act === 'saudi arabia');
            };

            return (isMatch(homeExpected, matchHome) && isMatch(awayExpected, matchAway)) ||
                   (isMatch(homeExpected, matchAway) && isMatch(awayExpected, matchHome));
        });
    } else {
        // Knockout match - find by exact time
        targetMatch = dbMatches.find(m => m.kickoffUtc.getTime() === expectedUtc.getTime());
    }

    if (targetMatch) {
        await prisma.match.update({
            where: { id: targetMatch.id },
            data: { stadiumId: stadium.id }
        });
        console.log(`Updated Match ${targetMatch.matchNumber} (${item.match}) to stadium ${stadium.name}`);
    } else {
        console.log(`Could not find DB match for ${item.match} at ${expectedUtc.toISOString()}`);
    }
  }

  console.log('Finished updating venues!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
