import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const sgtSchedulePath = path.join(__dirname, '../../sgt_schedule.json');
  const sgtSchedule = JSON.parse(fs.readFileSync(sgtSchedulePath, 'utf8'));

  // Manual mapping for the missing ones
  const manualMapping = {
    'CZE': 'Czechia',
    'BIH': 'Bosnia and Herzegovina',
    'TUR': 'Türkiye',
    'CUW': 'Curaçao',
    'SWE': 'Sweden',
    'IRQ': 'Iraq',
    'COD': 'Congo DR',
    'TUN': 'Tunisia'
  };

  const dbMatches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true }
  });

  const monthMap = { 'Jun': '06', 'Jul': '07' };
  
  for (const sgtMatch of sgtSchedule) {
    if (!sgtMatch.fixture || sgtMatch.fixture === "TBC vs TBC") continue;

    const parts = sgtMatch.fixture.split(' vs ');
    const homeCode = parts[0].trim();
    const awayCode = parts[1].trim();

    // Only process if it includes a manually mapped code
    if (!manualMapping[homeCode] && !manualMapping[awayCode]) continue;

    // Use seedData.json for others if needed, but we can just find them in db
    // Wait, let's just find by finding teams that match the codes in manualMapping OR let's just use a full map
    // Actually, I can just use fuzzy match with the manual mapping
    const getTeamName = (code) => {
        if (manualMapping[code]) return manualMapping[code];
        // We know the other ones like CAN, GER, AUS are in the DB with their usual names
        const common = {
            'CAN': 'Canada', 'KOR': 'Korea Republic', 'RSA': 'South Africa',
            'GER': 'Germany', 'POR': 'Portugal', 'SUI': 'Switzerland',
            'PAR': 'Paraguay', 'NED': 'Netherlands', 'ECU': 'Ecuador',
            'COL': 'Colombia', 'QAT': 'Qatar', 'MEX': 'Mexico',
            'CIV': "Côte d'Ivoire", 'JPN': 'Japan', 'USA': 'USA',
            'SEN': 'Senegal', 'UZB': 'Uzbekistan', 'AUS': 'Australia',
            'FRA': 'France', 'HAI': 'Haiti', 'MAR': 'Morocco', 'BRA': 'Brazil'
        };
        return common[code];
    };

    const homeExpected = getTeamName(homeCode);
    const awayExpected = getTeamName(awayCode);

    if (!homeExpected || !awayExpected) {
        console.log(`Still missing mapping for ${homeCode} or ${awayCode}`);
        continue;
    }

    const dbMatch = dbMatches.find(m => {
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
        console.log(`Patched ${dbMatch.homeTeam.name} vs ${dbMatch.awayTeam.name} to ${matchDate.toISOString()}`);
    } else {
        console.log(`Still could not find DB match for ${homeExpected} vs ${awayExpected}`);
    }
  }

  console.log('Finished patching missing matches!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
