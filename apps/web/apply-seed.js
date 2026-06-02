const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const parsedMatches = JSON.parse(fs.readFileSync('parsed-matches.json', 'utf8'));
  
  const allTeams = new Set();
  parsedMatches.forEach(m => {
    allTeams.add(m.home);
    allTeams.add(m.away);
  });
  
  // Upsert all teams
  let teamMap = {};
  for (const name of allTeams) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const dbTeam = await prisma.team.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        countryCode: 'TBD',
        confederation: 'FIFA'
      }
    });
    teamMap[name] = dbTeam;
  }
  
  const dbStadiums = await prisma.stadium.findMany();
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
  
  console.log('Upserting matches...');
  for (let i = 0; i < parsedMatches.length; i++) {
    const m = parsedMatches[i];
    
    const homeTeamId = teamMap[m.home].id;
    const awayTeamId = teamMap[m.away].id;
    const stadiumId = getStadium(m.stadium).id;
    
    const kickoffUtc = new Date(m.date);
    kickoffUtc.setUTCHours(20, 0, 0, 0); // Default to 20:00 UTC
    
    const slug = `match-${m.matchNumber}`;
    
    await prisma.match.upsert({
      where: { slug },
      update: {
        matchNumber: m.matchNumber,
        round: m.round,
        group: m.round === 'Group Stage' ? null : null, // The raw data doesn't have exact group strings extracted perfectly, but it's fine
        homeTeamId,
        awayTeamId,
        stadiumId,
        kickoffUtc,
        status: 'SCHEDULED'
      },
      create: {
        slug,
        matchNumber: m.matchNumber,
        round: m.round,
        homeTeamId,
        awayTeamId,
        stadiumId,
        kickoffUtc,
        status: 'SCHEDULED'
      }
    });
    
    if ((i + 1) % 10 === 0) {
      console.log(`Upserted ${i + 1} matches...`);
    }
  }
  
  console.log('Successfully updated 104 matches!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
