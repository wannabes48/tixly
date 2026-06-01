import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const isoMappings: Record<string, string> = {
  'Switzerland': 'ch',
  'Haiti': 'ht',
  'Tunisia': 'tn',
  'Cabo Verde': 'cv',
  'Saudi Arabia': 'sa',
  'Uruguay': 'uy',
  'Portugal': 'pt',
  'Mexico': 'mx',
  'South Africa': 'za',
  'Canada': 'ca',
  'Qatar': 'qa',
  'Brazil': 'br',
  'Morocco': 'ma',
  'USA': 'us',
  'Paraguay': 'py',
  'Australia': 'au',
  'Germany': 'de',
  'Curaçao': 'cw',
  'Côte d\'Ivoire': 'ci',
  'Ecuador': 'ec',
  'Japan': 'jp',
  'Belgium': 'be',
  'Egypt': 'eg',
  'IR Iran': 'ir',
  'New Zealand': 'nz',
  'Spain': 'es',
  'France': 'fr',
  'Senegal': 'sn',
  'Norway': 'no',
  'Argentina': 'ar',
  'Algeria': 'dz',
  'Austria': 'at',
  'Jordan': 'jo',
  'Uzbekistan': 'uz',
  'Colombia': 'co',
  'Croatia': 'hr',
  'Ghana': 'gh',
  'Panama': 'pa',
  'South Korea': 'kr',
  'Scotland': 'gb-sct',
  'Netherlands': 'nl',
  'England': 'gb-eng',
  'Winner UEFA Playoff D': 'un',
  'Winner UEFA Playoff A': 'un',
  'Winner UEFA Playoff C': 'un',
  'Winner UEFA Playoff B': 'un',
  'Winner FIFA Playoff 2': 'un',
  'Winner FIFA Playoff 1': 'un'
};

async function main() {
  const teams = await prisma.team.findMany();
  for (const team of teams) {
    const code = isoMappings[team.name];
    if (code) {
      const flagUrl = `https://flagcdn.com/w320/${code}.png`;
      await prisma.team.update({
        where: { id: team.id },
        data: { flagUrl, countryCode: code.toUpperCase() }
      });
      console.log(`Updated ${team.name} -> ${flagUrl}`);
    } else {
      console.log(`Skipped ${team.name} (not found in mapping)`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
