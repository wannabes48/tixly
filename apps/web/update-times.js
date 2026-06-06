const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const schedule = [
  { "date": "Fri 12 Jun", "time": "03:00", "round": "Group Stage", "group": "A", "fixture": "MEX vs RSA" },
  { "date": "Fri 12 Jun", "time": "10:00", "round": "Group Stage", "group": "A", "fixture": "KOR vs CZE" },
  { "date": "Sat 13 Jun", "time": "03:00", "round": "Group Stage", "group": "B", "fixture": "CAN vs BIH" },
  { "date": "Sat 13 Jun", "time": "09:00", "round": "Group Stage", "group": "D", "fixture": "USA vs PAR" },
  { "date": "Sun 14 Jun", "time": "03:00", "round": "Group Stage", "group": "B", "fixture": "QAT vs SUI" },
  { "date": "Sun 14 Jun", "time": "06:00", "round": "Group Stage", "group": "C", "fixture": "BRA vs MAR" },
  { "date": "Sun 14 Jun", "time": "09:00", "round": "Group Stage", "group": "C", "fixture": "HAI vs SCO" },
  { "date": "Sun 14 Jun", "time": "12:00", "round": "Group Stage", "group": "D", "fixture": "AUS vs TUR" },
  { "date": "Mon 15 Jun", "time": "01:00", "round": "Group Stage", "group": "E", "fixture": "GER vs CUW" },
  { "date": "Mon 15 Jun", "time": "04:00", "round": "Group Stage", "group": "F", "fixture": "NED vs JPN" },
  { "date": "Mon 15 Jun", "time": "07:00", "round": "Group Stage", "group": "E", "fixture": "CIV vs ECU" },
  { "date": "Mon 15 Jun", "time": "10:00", "round": "Group Stage", "group": "F", "fixture": "SWE vs TUN" },
  { "date": "Tue 16 Jun", "time": "00:00", "round": "Group Stage", "group": "H", "fixture": "ESP vs CPV" },
  { "date": "Tue 16 Jun", "time": "03:00", "round": "Group Stage", "group": "G", "fixture": "BEL vs EGY" },
  { "date": "Tue 16 Jun", "time": "06:00", "round": "Group Stage", "group": "H", "fixture": "KSA vs URU" },
  { "date": "Tue 16 Jun", "time": "09:00", "round": "Group Stage", "group": "G", "fixture": "IRN vs NZL" },
  { "date": "Wed 17 Jun", "time": "03:00", "round": "Group Stage", "group": " ", "fixture": "FRA vs SEN" },
  { "date": "Wed 17 Jun", "time": "06:00", "round": "Group Stage", "group": null, "fixture": "IRQ vs NOR" },
  { "date": "Wed 17 Jun", "time": "09:00", "round": "Group Stage", "group": "J", "fixture": "ARG vs ALG" },
  { "date": "Wed 17 Jun", "time": "12:00", "round": "Group Stage", "group": "J", "fixture": "AUT vs JOR" },
  { "date": "Thu 18 Jun", "time": "01:00", "round": "Group Stage", "group": "K", "fixture": "POR vs COD" },
  { "date": "Thu 18 Jun", "time": "04:00", "round": "Group Stage", "group": "L", "fixture": "ENG vs CRO" },
  { "date": "Thu 18 Jun", "time": "07:00", "round": "Group Stage", "group": "L", "fixture": "GHA vs PAN" },
  { "date": "Thu 18 Jun", "time": "10:00", "round": "Group Stage", "group": "K", "fixture": "UZB vs COL" },
  { "date": "Fri 19 Jun", "time": "00:00", "round": "Group Stage", "group": "A", "fixture": "CZE vs RSA" },
  { "date": "Fri 19 Jun", "time": "03:00", "round": "Group Stage", "group": "B", "fixture": "SUI vs BIH" },
  { "date": "Fri 19 Jun", "time": "06:00", "round": "Group Stage", "group": "B", "fixture": "CAN vs QAT" },
  { "date": "Fri 19 Jun", "time": "09:00", "round": "Group Stage", "group": "A", "fixture": "MEX vs KOR" },
  { "date": "Sat 20 Jun", "time": "03:00", "round": "Group Stage", "group": "D", "fixture": "USA vs AUS" },
  { "date": "Sat 20 Jun", "time": "06:00", "round": "Group Stage", "group": "C", "fixture": "SCO vs MAR" },
  { "date": "Sat 20 Jun", "time": "09:00", "round": "Group Stage", "group": "C", "fixture": "BRA vs HAI" },
  { "date": "Sat 20 Jun", "time": "12:00", "round": "Group Stage", "group": "D", "fixture": "TUR vs PAR" },
  { "date": "Sun 21 Jun", "time": "01:00", "round": "Group Stage", "group": "F", "fixture": "NED vs SWE" },
  { "date": "Sun 21 Jun", "time": "04:00", "round": "Group Stage", "group": "E", "fixture": "GER vs CIV" },
  { "date": "Sun 21 Jun", "time": "08:00", "round": "Group Stage", "group": "E", "fixture": "ECU vs CUW" },
  { "date": "Sun 21 Jun", "time": "12:00", "round": "Group Stage", "group": "F", "fixture": "TUN vs JPN" },
  { "date": "Mon 22 Jun", "time": "00:00", "round": "Group Stage", "group": "H", "fixture": "ESP vs KSA" },
  { "date": "Mon 22 Jun", "time": "03:00", "round": "Group Stage", "group": "G", "fixture": "BEL vs IRN" },
  { "date": "Mon 22 Jun", "time": "06:00", "round": "Group Stage", "group": "H", "fixture": "URU vs CPV" },
  { "date": "Mon 22 Jun", "time": "09:00", "round": "Group Stage", "group": "G", "fixture": "NZL vs EGY" },
  { "date": "Tue 23 Jun", "time": "01:00", "round": "Group Stage", "group": "J", "fixture": "ARG vs AUT" },
  { "date": "Tue 23 Jun", "time": "05:00", "round": "Group Stage", "group": "1", "fixture": "FRA vs IRQ" },
  { "date": "Tue 23 Jun", "time": "08:00", "round": "Group Stage", "group": null, "fixture": "NOR vs SEN" },
  { "date": "Tue 23 Jun", "time": "11:00", "round": "Group Stage", "group": "J", "fixture": "JOR vs ALG" },
  { "date": "Wed 24 Jun", "time": "01:00", "round": "Group Stage", "group": "K", "fixture": "POR vs UZB" },
  { "date": "Wed 24 Jun", "time": "04:00", "round": "Group Stage", "group": "L", "fixture": "ENG vs GHA" },
  { "date": "Wed 24 Jun", "time": "07:00", "round": "Group Stage", "group": "L", "fixture": "PAN vs CRO" },
  { "date": "Wed 24 Jun", "time": "10:00", "round": "Group Stage", "group": "K", "fixture": "COL vs COD" },
  { "date": "Thu 25 Jun", "time": "03:00", "round": "Group Stage", "group": "B", "fixture": "SUI vs CAN" },
  { "date": "Thu 25 Jun", "time": "03:00", "round": "Group Stage", "group": "B", "fixture": "BIH vs QAT" },
  { "date": "Thu 25 Jun", "time": "06:00", "round": "Group Stage", "group": "C", "fixture": "SCO vs BRA" },
  { "date": "Thu 25 Jun", "time": "06:00", "round": "Group Stage", "group": "C", "fixture": "MAR vs HAI" },
  { "date": "Thu 25 Jun", "time": "09:00", "round": "Group Stage", "group": "A", "fixture": "CZE vs MEX" },
  { "date": "Thu 25 Jun", "time": "09:00", "round": "Group Stage", "group": "A", "fixture": "RSA vs KOR" },
  { "date": "Fri 26 Jun", "time": "04:00", "round": "Group Stage", "group": "E", "fixture": "CUW vs CIV" },
  { "date": "Fri 26 Jun", "time": "04:00", "round": "Group Stage", "group": "E", "fixture": "ECU vs GER" },
  { "date": "Fri 26 Jun", "time": "07:00", "round": "Group Stage", "group": "F", "fixture": "JPN vs SWE" },
  { "date": "Fri 26 Jun", "time": "07:00", "round": "Group Stage", "group": "F", "fixture": "TUN vs NED" },
  { "date": "Fri 26 Jun", "time": "10:00", "round": "Group Stage", "group": "D", "fixture": "TUR vs USA" },
  { "date": "Fri 26 Jun", "time": "10:00", "round": "Group Stage", "group": "D", "fixture": "PAR vs AUS" },
  { "date": "Sat 27 Jun", "time": "03:00", "round": "Group Stage", "group": "1", "fixture": "NOR vs FRA" },
  { "date": "Sat 27 Jun", "time": "03:00", "round": "Group Stage", "group": " ", "fixture": "SEN vs IRQ" },
  { "date": "Sat 27 Jun", "time": "08:00", "round": "Group Stage", "group": "H", "fixture": "URU vs ESP" },
  { "date": "Sat 27 Jun", "time": "08:00", "round": "Group Stage", "group": "H", "fixture": "CPV vs KSA" },
  { "date": "Sat 27 Jun", "time": "11:00", "round": "Group Stage", "group": "G", "fixture": "NZL vs BEL" },
  { "date": "Sat 27 Jun", "time": "11:00", "round": "Group Stage", "group": "G", "fixture": "EGY vs IRN" },
  { "date": "Sun 28 Jun", "time": "05:00", "round": "Group Stage", "group": "L", "fixture": "PAN vs ENG" },
  { "date": "Sun 28 Jun", "time": "05:00", "round": "Group Stage", "group": "L", "fixture": "CRO vs GHA" },
  { "date": "Sun 28 Jun", "time": "07:30", "round": "Group Stage", "group": "K", "fixture": "COL vs POR" },
  { "date": "Sun 28 Jun", "time": "07:30", "round": "Group Stage", "group": "K", "fixture": "COD vs UZB" },
  { "date": "Sun 28 Jun", "time": "10:00", "round": "Group Stage", "group": "J", "fixture": "JOR vs ARG" },
  { "date": "Sun 28 Jun", "time": "10:00", "round": "Group Stage", "group": "J", "fixture": "ALG vs AUT" },
  { "date": "Mon 29 Jun", "time": "03:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Tue 30 Jun", "time": "01:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Tue 30 Jun", "time": "04:30", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Tue 30 Jun", "time": "09:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Wed 01 Jul", "time": "01:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Wed 01 Jul", "time": "05:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Wed 01 Jul", "time": "09:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Thu 02 Jul", "time": "00:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Thu 02 Jul", "time": "04:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Thu 02 Jul", "time": "08:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Fri 03 Jul", "time": "03:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Fri 03 Jul", "time": "07:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Fri 03 Jul", "time": "11:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sat 04 Jul", "time": "02:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sat 04 Jul", "time": "06:00", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sat 04 Jul", "time": "09:30", "round": "Round of 32", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sun 05 Jul", "time": "01:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sun 05 Jul", "time": "05:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Mon 06 Jul", "time": "04:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Mon 06 Jul", "time": "08:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Tue 07 Jul", "time": "03:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Tue 07 Jul", "time": "08:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Wed 08 Jul", "time": "00:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Wed 08 Jul", "time": "04:00", "round": "Round of 16", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Fri 10 Jul", "time": "04:00", "round": "Quarter-Finals", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sat 11 Jul", "time": "03:00", "round": "Quarter-Finals", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sun 12 Jul", "time": "05:00", "round": "Quarter-Finals", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sun 12 Jul", "time": "09:00", "round": "Quarter-Finals", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Wed 15 Jul", "time": "03:00", "round": "Semi-Finals", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Thu 16 Jul", "time": "03:00", "round": "Semi-Finals", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Sun 19 Jul", "time": "05:00", "round": "Bronze Final", "group": null, "fixture": "TBC vs TBC" },
  { "date": "Mon 20 Jul", "time": "03:00", "round": "Final", "group": null, "fixture": "TBC vs TBC" }
];

async function run() {
  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    const matchNumber = i + 1;
    const slug = `match-${matchNumber}`;
    
    // Parse the date in SGT (GMT+0800)
    // "Fri 12 Jun" -> "12 Jun"
    // "03:00" -> "03:00:00"
    const datePart = item.date.split(' ').slice(1).join(' '); // "12 Jun"
    const timePart = item.time + ":00";
    const dateStr = `${datePart} 2026 ${timePart} GMT+0800`;
    const kickoffUtc = new Date(dateStr);
    
    await prisma.match.update({
      where: { slug },
      data: { kickoffUtc }
    });
  }
  console.log(`Updated ${schedule.length} matches!`);
}

run().catch(e => {
  console.error(e);
}).finally(() => {
  prisma.$disconnect();
});
