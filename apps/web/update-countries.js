const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const updates = [
    { name: 'Korea Republic', countryCode: 'KR', confederation: 'AFC' },
    { name: 'Czechia', countryCode: 'CZ', confederation: 'UEFA' },
    { name: 'Bosnia and Herzegovina', countryCode: 'BA', confederation: 'UEFA' },
    { name: 'Türkiye', countryCode: 'TR', confederation: 'UEFA' },
    { name: 'Sweden', countryCode: 'SE', confederation: 'UEFA' },
    { name: 'Iraq', countryCode: 'IQ', confederation: 'AFC' },
    { name: 'Congo DR', countryCode: 'CD', confederation: 'CAF' }
  ];

  for (const t of updates) {
    await prisma.team.updateMany({
      where: { name: t.name },
      data: { countryCode: t.countryCode, confederation: t.confederation }
    });
    console.log(`Updated ${t.name}`);
  }
}
run().finally(() => process.exit());
