import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

// Official FIFA Face Value Pricing (USD)
const faceValues = {
  groupNeutral: { CAT1: 950, CAT2: 700, CAT3: 160, CAT4: 60 }, // Avgs of ranges
  groupHost:    { CAT1: 2117, CAT2: 1450, CAT3: 550, CAT4: 60 },
  round32:      { CAT1: 540, CAT2: 440, CAT3: 225, CAT4: 60 },
  round16:      { CAT1: 640, CAT2: 515, CAT3: 240, CAT4: 60 },
  quarter:      { CAT1: 1775, CAT2: 1200, CAT3: 450, CAT4: 60 },
  semi:         { CAT1: 3295, CAT2: 2350, CAT3: 930, CAT4: 60 },
  third:        { CAT1: 800, CAT2: 600, CAT3: 250, CAT4: 60 },
  final:        { CAT1: 7302, CAT2: 5000, CAT3: 1845, CAT4: null },
};

// SeatPick Resale Market Data
const teamPricingRankings = {
  "Mexico": { avg_start: 1107, avg_price: 2529 },
  "Portugal": { avg_start: 1000, avg_price: 1987 },
  "Brazil": { avg_start: 1023, avg_price: 1824 },
  "Colombia": { avg_start: 892, avg_price: 1740 },
  "United States": { avg_start: 658, avg_price: 1450 },
  "South Korea": { avg_start: 570, avg_price: 1353 },
  "Scotland": { avg_start: 751, avg_price: 1328 },
  "Argentina": { avg_start: 699, avg_price: 1326 },
  "South Africa": { avg_start: 537, avg_price: 1305 },
  "England": { avg_start: 617, avg_price: 1233 },
  "Morocco": { avg_start: 613, avg_price: 1196 },
  "Spain": { avg_start: 556, avg_price: 1090 },
  "Canada": { avg_start: 452, avg_price: 1064 },
  "Germany": { avg_start: 480, avg_price: 1040 },
  "France": { avg_start: 483, avg_price: 1029 },
  "Ecuador": { avg_start: 481, avg_price: 983 },
  "Bosnia & Herzegovina": { avg_start: 283, avg_price: 828 },
  "Netherlands": { avg_start: 367, avg_price: 823 },
  "Ghana": { avg_start: 391, avg_price: 779 },
  "Uzbekistan": { avg_start: 342, avg_price: 748 },
  "Congo - Kinshasa": { avg_start: 341, avg_price: 742 },
  "Sweden": { avg_start: 268, avg_price: 719 },
  "Austria": { avg_start: 377, avg_price: 713 },
  "Côte d'Ivoire": { avg_start: 361, avg_price: 710 },
  "Switzerland": { avg_start: 293, avg_price: 637 },
};

async function main() {
  console.log('Fetching users to assign listings...');
  const users = await prisma.user.findMany();
  
  // If no users, we should create a few mock sellers.
  let sellers = users.filter(u => u.email?.includes('seller'));
  if (sellers.length === 0) {
    sellers = await Promise.all([
      prisma.user.upsert({ where: { email: 'seller1@tixly.com' }, update: {}, create: { name: 'John D.', email: 'seller1@tixly.com', kycStatus: 'VERIFIED' } }),
      prisma.user.upsert({ where: { email: 'seller2@tixly.com' }, update: {}, create: { name: 'Sarah M.', email: 'seller2@tixly.com', kycStatus: 'VERIFIED' } }),
    ]);
  }

  console.log('Fetching all matches and their teams/stadiums...');
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    }
  });

  console.log('Deleting all existing Ticket Holds and Listings...');
  await prisma.ticketHold.deleteMany({});
  await prisma.ticketListing.deleteMany({});

  console.log('Generating dynamic secondary market listings...');
  
  const categories = ['CAT1', 'CAT2', 'CAT3', 'CAT4'];

  for (const match of matches) {
    const isHostNationMatch = 
      match.homeTeam?.name === 'United States' || match.awayTeam?.name === 'United States' ||
      match.homeTeam?.name === 'Mexico' || match.awayTeam?.name === 'Mexico' ||
      match.homeTeam?.name === 'Canada' || match.awayTeam?.name === 'Canada';

    let roundFaceValue;
    if (match.matchNumber <= 72) {
      roundFaceValue = isHostNationMatch ? faceValues.groupHost : faceValues.groupNeutral;
    } else if (match.matchNumber <= 88) {
      roundFaceValue = faceValues.round32;
    } else if (match.matchNumber <= 96) {
      roundFaceValue = faceValues.round16;
    } else if (match.matchNumber <= 100) {
      roundFaceValue = faceValues.quarter;
    } else if (match.matchNumber <= 102) {
      roundFaceValue = faceValues.semi;
    } else if (match.matchNumber === 103) {
      roundFaceValue = faceValues.third;
    } else {
      roundFaceValue = faceValues.final;
    }

    // Determine target pricing based on team rankings
    const homeTeamRanking = teamPricingRankings[match.homeTeam?.name as keyof typeof teamPricingRankings];
    const awayTeamRanking = teamPricingRankings[match.awayTeam?.name as keyof typeof teamPricingRankings];
    
    let targetAvgPrice = 1603; // Tournament average
    let targetStartPrice = 677;

    if (match.matchNumber === 104) {
      // 2026 World Cup Final special pricing
      targetAvgPrice = 16094;
      targetStartPrice = 6349;
    } else if (homeTeamRanking || awayTeamRanking) {
      // Use the higher of the two team's averages
      const p1 = homeTeamRanking?.avg_price || 0;
      const p2 = awayTeamRanking?.avg_price || 0;
      const s1 = homeTeamRanking?.avg_start || 0;
      const s2 = awayTeamRanking?.avg_start || 0;
      
      targetAvgPrice = Math.max(p1, p2) || targetAvgPrice;
      targetStartPrice = Math.max(s1, s2) || targetStartPrice;
    }

    // Override for Mexico vs South Africa
    if ((match.homeTeam?.name === 'Mexico' && match.awayTeam?.name === 'South Africa') ||
        (match.homeTeam?.name === 'South Africa' && match.awayTeam?.name === 'Mexico')) {
      targetAvgPrice = 4994;
    }

    // Generate 5 listings per match
    for (let i = 0; i < 5; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)] as 'CAT1' | 'CAT2' | 'CAT3' | 'CAT4';
      const basePrice = roundFaceValue[cat];
      
      if (basePrice === null) continue;

      // Make the lowest priced listing approximate the targetStartPrice
      // and others scale up towards targetAvgPrice
      let finalPrice;
      if (i === 0) {
        // Cheapest ticket (Start Price)
        finalPrice = targetStartPrice * (0.9 + Math.random() * 0.2);
      } else {
        // Higher priced tickets (Avg Price)
        finalPrice = targetAvgPrice * (0.8 + Math.random() * 0.6);
      }
      
      // Ensure CAT1 is generally more expensive than CAT3 in reality, though resale markets fluctuate
      if (cat === 'CAT1') finalPrice *= 1.5;
      if (cat === 'CAT4') finalPrice *= 0.6;

      // Generate section/row realistically
      let section = 'General Admission';
      let row = 'TBD';
      if (cat === 'CAT1') {
        section = `Sec 1${Math.floor(Math.random() * 30)}`;
        row = `Row ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`;
      } else if (cat === 'CAT2') {
        section = `Sec 2${Math.floor(Math.random() * 30)}`;
        row = `Row ${Math.floor(Math.random() * 20)}`;
      } else if (cat === 'CAT3') {
        section = `Sec 3${Math.floor(Math.random() * 30)}`;
        row = `Row ${String.fromCharCode(65 + Math.floor(Math.random() * 15))}`;
      } else {
        section = `Sec 4${Math.floor(Math.random() * 30)}`;
        row = `Row ${Math.floor(Math.random() * 30)}`;
      }

      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];

      await prisma.ticketListing.create({
        data: {
          matchId: match.id,
          category: cat,
          quantity: Math.floor(Math.random() * 4) + 1,
          pricePerTicket: Math.floor(finalPrice),
          deliveryMethod: 'MOBILE_TRANSFER',
          status: 'ACTIVE',
          section,
          row,
          sellerId: randomSeller.id,
        }
      });
    }
  }

  console.log('Successfully updated all ticket prices to match SeatPick & FIFA official data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
