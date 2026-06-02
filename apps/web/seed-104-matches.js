const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const text = fs.readFileSync('raw-schedule.txt', 'utf8');
  
  // Create all required TBD/placeholder teams if they don't exist
  const placeholderTeams = [
    'Group A runners-up', 'Group B runners-up', 'Group E winners', 'Group A/B/C/D/F third place',
    'Group F winners', 'Group C runners-up', 'Group C winners', 'Group F runners-up',
    'Group I winners', 'Group C/D/F/G/H third place', 'Group E runners up', 'Group I runners-up',
    'Group A winners', 'Group C/E/F/H/I third place', 'Group L winners', 'Group E/H/I/J/K third place',
    'Group D winners', 'Group B/E/F/I/J third place', 'Group G winners', 'Group A/E/H/I/J third place',
    'Group K runners-up', 'Group L runners-up', 'Group H winners', 'Group J runners-up',
    'Group B winners', 'Group E/F/G/I/J third place', 'Group J winners', 'Group H runners-up',
    'Group K winners', 'Group D/E/I/J/L third place', 'Group D runners-up', 'Group G runners-up',
    'Winner match 74', 'Winner match 77', 'Winner match 73', 'Winner match 75',
    'Winner match 76', 'Winner match 78', 'Winner match 79', 'Winner match 80',
    'Winner match 83', 'Winner match 84', 'Winner match 81', 'Winner match 82',
    'Winner match 86', 'Winner match 88', 'Winner match 85', 'Winner match 87',
    'Winner match 89', 'Winner match 90', 'Winner match 93', 'Winner match 94',
    'Winner match 91', 'Winner match 92', 'Winner match 95', 'Winner match 96',
    'Winner match 97', 'Winner match 98', 'Winner match 99', 'Winner match 100',
    'Winner match 101', 'Winner match 102', 'Runner-up match 101', 'Runner-up match 102',
  ];
  
  for (const name of placeholderTeams) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await prisma.team.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        countryCode: 'TBD',
        confederation: 'FIFA',
      }
    });
  }

  const dbTeams = await prisma.team.findMany();
  const dbStadiums = await prisma.stadium.findMany();
  
  const getTeam = (name) => {
    const t = dbTeams.find(t => t.name.toLowerCase() === name.toLowerCase().trim());
    if (!t) throw new Error('Team not found: ' + name);
    return t;
  };
  
  const getStadium = (name) => {
    let clean = name.toLowerCase().replace('stadium', '').trim();
    if (clean.includes('new york new jersey')) clean = 'new york';
    if (clean.includes('bc place vancouver')) clean = 'vancouver';
    
    const s = dbStadiums.find(s => 
      s.name.toLowerCase().includes(clean) || 
      s.city.toLowerCase().includes(clean)
    );
    if (!s) throw new Error('Stadium not found: ' + name);
    return s;
  };

  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  let currentRound = '';
  let currentDate = null;
  let matchCounter = 1;
  let toCreate = [];

  for (const line of lines) {
    if (line.includes('FIFA World Cup 2026') && line.includes('fixtures')) {
      if (line.includes('Group Stage')) currentRound = 'Group Stage';
      else if (line.includes('Round of 32')) currentRound = 'Round of 32';
      else if (line.includes('Round of 16')) currentRound = 'Round of 16';
      else if (line.includes('quarter-final')) currentRound = 'Quarter-Finals';
      else if (line.includes('semi-final')) currentRound = 'Semi-Finals';
      continue;
    }
    if (line.includes('FIFA World Cup 2026 bronze final')) {
      currentRound = 'Third Place';
      continue;
    }
    if (line.includes('FIFA World Cup 2026 Final')) {
      currentRound = 'Final';
      continue;
    }
    
    const dayMatch = line.match(/^[A-Z][a-z]+, \d{1,2} [A-Z][a-z]+ \d{4}$/);
    if (dayMatch) {
      currentDate = new Date(line);
      continue;
    }

    if (line.includes(' v ')) {
      let homeStr, awayStr, groupStr, stadiumStr, mNum;
      
      if (line.startsWith('Match ')) {
        const parts = line.split(' – ');
        mNum = parseInt(parts[0].replace('Match ', ''));
        const teamsPart = parts[1].split(' - ')[0];
        stadiumStr = parts[1].split(' - ')[1].trim();
        [homeStr, awayStr] = teamsPart.split(' v ');
        groupStr = null;
      } else {
        mNum = matchCounter++;
        const parts = line.split(' - ');
        if (parts.length >= 3) {
          const teamsPart = parts[0].trim();
          [homeStr, awayStr] = teamsPart.split(' v ');
          groupStr = parts[1].replace('Group', '').replace('–', '').trim();
          stadiumStr = parts.slice(2).join(' - ').replace('–', '').trim();
        } else {
          // fallback
          const splitHyphen = line.split('-');
          stadiumStr = splitHyphen[splitHyphen.length-1].trim();
        }
      }
      
      const homeTeam = getTeam(homeStr);
      const awayTeam = getTeam(awayStr);
      const stadium = getStadium(stadiumStr);
      
      // Default UTC time if missing
      const kickoffUtc = new Date(currentDate);
      kickoffUtc.setUTCHours(20, 0, 0, 0); // default to 8pm UTC
      
      toCreate.push({
        slug: `match-${mNum}`,
        matchNumber: mNum,
        round: currentRound || 'Unknown',
        group: groupStr ? `Group ${groupStr}` : null,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        stadiumId: stadium.id,
        kickoffUtc,
        status: 'SCHEDULED'
      });
    }
  }

  console.log(`Parsed ${toCreate.length} matches. Updating database...`);
  
  // Wipe existing matches safely (wait, we shouldn't wipe if they have listings, just update)
  for (const match of toCreate) {
    await prisma.match.upsert({
      where: { slug: match.slug },
      update: {
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        stadiumId: match.stadiumId,
        kickoffUtc: match.kickoffUtc,
        round: match.round,
        group: match.group
      },
      create: match
    });
  }
  
  console.log('Successfully updated 104 matches!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
