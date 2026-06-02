const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const parsedMatches = JSON.parse(fs.readFileSync('parsed-matches.json', 'utf8'));
  
  const allTeams = Array.from(new Set(parsedMatches.flatMap(m => [m.home, m.away])));
  
  console.log('Upserting teams concurrently...');
  const teamPromises = allTeams.map(name => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return prisma.team.upsert({
      where: { slug },
      update: {},
      create: { name, slug, countryCode: 'TBD', confederation: 'FIFA' }
    }).then(dbTeam => ({ name, dbTeam }));
  });
  
  const teamResults = await Promise.all(teamPromises);
  const teamMap = {};
  teamResults.forEach(r => teamMap[r.name] = r.dbTeam);
  
  console.log('Teams upserted!');
  
  const dbStadiums = await prisma.stadium.findMany();
  const getStadium = (name) => {
    let clean = name.toLowerCase().replace('stadium', '').trim();
    if (clean.includes('new york new jersey')) clean = 'new york';
    if (clean.includes('bc place vancouver')) clean = 'vancouver';
    
    const s = dbStadiums.find(s => s.name.toLowerCase().includes(clean) || s.city.toLowerCase().includes(clean));
    if (!s) throw new Error('Stadium not found: ' + name);
    return s;
  };
  
  console.log('Upserting matches concurrently...');
  const matchPromises = parsedMatches.map(m => {
    const homeTeamId = teamMap[m.home].id;
    const awayTeamId = teamMap[m.away].id;
    const stadiumId = getStadium(m.stadium).id;
    
    const kickoffUtc = new Date(m.date);
    kickoffUtc.setUTCHours(20, 0, 0, 0); 
    
    const slug = `match-${m.matchNumber}`;
    
    const payload = {
      matchNumber: m.matchNumber,
      round: m.round,
      homeTeamId,
      awayTeamId,
      stadiumId,
      kickoffUtc,
      status: 'SCHEDULED'
    };
    
    return prisma.match.upsert({
      where: { slug },
      update: payload,
      create: { ...payload, slug }
    });
  });
  
  await Promise.all(matchPromises);
  
  console.log('Successfully updated 104 matches!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
