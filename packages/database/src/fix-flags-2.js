const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.ltpphkvnqraoebmwglwe:tq%21PzC.%21d6e%21r8X@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&pool_timeout=15"
    }
  }
});

const fixes = {
  'Switzerland': 'https://flagcdn.com/w320/ch.png',
  'Haiti': 'https://flagcdn.com/w320/ht.png',
  'Tunisia': 'https://flagcdn.com/w320/tn.png',
  'Cabo Verde': 'https://flagcdn.com/w320/cv.png',
  'Saudi Arabia': 'https://flagcdn.com/w320/sa.png',
  'Uruguay': 'https://flagcdn.com/w320/uy.png',
  'Portugal': 'https://flagcdn.com/w320/pt.png',
};

async function main() {
  for (const [name, flagUrl] of Object.entries(fixes)) {
    const res = await prisma.team.updateMany({
      where: { name: { equals: name, mode: 'insensitive' } },
      data: { flagUrl }
    });
    console.log(`Updated ${res.count} rows for ${name} to ${flagUrl}`);
  }
}

main().finally(() => prisma.$disconnect());
