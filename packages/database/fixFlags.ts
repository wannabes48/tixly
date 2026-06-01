import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const customMappings: Record<string, string> = {
  'South Africa': 'za',
  'Germany': 'de',
  'England': 'gb-eng',
  'USA': 'us',
  'UK': 'gb',
  'Argentina': 'ar',
  'France': 'fr',
  'Brazil': 'br',
  'Mexico': 'mx',
  'Canada': 'ca',
  'Spain': 'es',
  'Italy': 'it',
  'Netherlands': 'nl',
  'Portugal': 'pt',
  'Belgium': 'be',
  'Croatia': 'hr',
  'Uruguay': 'uy',
  'Colombia': 'co',
  'Japan': 'jp',
  'South Korea': 'kr',
  'Saudi Arabia': 'sa',
  'Australia': 'au',
  'Morocco': 'ma',
  'Senegal': 'sn',
  'Nigeria': 'ng',
  'Ecuador': 'ec',
  'Denmark': 'dk'
};

async function main() {
  const teams = await prisma.team.findMany();
  for (const team of teams) {
    let code = customMappings[team.name] || team.countryCode.toLowerCase();
    if (code === 'xx' || !code) {
      // Just assign a random fallback or leave it
      code = 'un';
    }
    
    const flagUrl = `https://flagcdn.com/w320/${code}.png`;
    await prisma.team.update({
      where: { id: team.id },
      data: { flagUrl, countryCode: code.toUpperCase() }
    });
    console.log(`Updated ${team.name} -> ${flagUrl}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
