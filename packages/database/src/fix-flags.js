const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

const fixes = {
  'South Korea': 'https://flagcdn.com/w320/kr.png',
  'Scotland': 'https://flagcdn.com/w320/gb-sct.png',
  'Netherlands': 'https://flagcdn.com/w320/nl.png',
  'England': 'https://flagcdn.com/w320/gb-eng.png',
  'Wales': 'https://flagcdn.com/w320/gb-wls.png'
};

async function main() {
  for (const [name, flagUrl] of Object.entries(fixes)) {
    const res = await prisma.team.updateMany({
      where: { name },
      data: { flagUrl }
    });
    console.log(`Updated ${res.count} rows for ${name} to ${flagUrl}`);
  }

  // Handle playoffs with FIFA placeholder
  const placeholder = 'https://flagcdn.com/w320/un.png'; // United Nations as placeholder
  const res2 = await prisma.team.updateMany({
    where: { flagUrl: null },
    data: { flagUrl: placeholder }
  });
  console.log(`Updated ${res2.count} playoff teams with placeholder flag`);
}

main().finally(() => prisma.$disconnect());
