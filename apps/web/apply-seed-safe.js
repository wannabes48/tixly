const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const parsedMatches = JSON.parse(fs.readFileSync('parsed-matches.json', 'utf8'));
  const allTeams = Array.from(new Set(parsedMatches.flatMap(m => [m.home, m.away])));
  
  console.log('Inserting missing teams...');
  const existingTeams = await prisma.team.findMany();
  const existingTeamNames = new Set(existingTeams.map(t => t.name.toLowerCase()));
  
  const teamsToCreate = allTeams.filter(name => !existingTeamNames.has(name.toLowerCase())).map(name => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    countryCode: 'TBD',
    confederation: 'FIFA'
  }));
  
  if (teamsToCreate.length > 0) {
    await prisma.team.createMany({ data: teamsToCreate, skipDuplicates: true });
    console.log(`Created ${teamsToCreate.length} missing teams.`);
  }
  
  const dbTeams = await prisma.team.findMany();
  const teamMap = {};
  dbTeams.forEach(t => teamMap[t.name.toLowerCase()] = t);
  
  const dbStadiums = await prisma.stadium.findMany();
  const getStadium = (name) => {
    let clean = name.toLowerCase().replace('stadium', '').replace('estadio', '').trim();
    if (clean.includes('new york new jersey')) clean = 'new york';
    if (clean.includes('bc place vancouver')) clean = 'vancouver';
    const s = dbStadiums.find(s => s.name.toLowerCase().includes(clean) || s.city.toLowerCase().includes(clean));
    if (!s) throw new Error('Stadium not found: ' + name);
    return s;
  };
  
  console.log('Updating matches safely sequentially...');
  for (let i = 0; i < parsedMatches.length; i++) {
    const m = parsedMatches[i];
    
    const homeTeamId = teamMap[m.home.toLowerCase()].id;
    const awayTeamId = teamMap[m.away.toLowerCase()].id;
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
    
    const existing = await prisma.match.findUnique({ where: { slug }});
    if (existing) {
      await prisma.match.update({ where: { slug }, data: payload });
    } else {
      await prisma.match.create({ data: { ...payload, slug } });
    }
    
    await delay(100); // 100ms delay to prevent connection pool exhaustion
    if ((i + 1) % 10 === 0) console.log(`Processed ${i + 1} matches...`);
  }
  
  console.log('Successfully updated 104 matches!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
