const fs = require('fs');

const seedDataPath = 'd:/tixly/packages/database/src/seedData.json';
const sgtSchedulePath = 'd:/tixly/sgt_schedule.json';

const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
const sgtSchedule = JSON.parse(fs.readFileSync(sgtSchedulePath, 'utf8'));

if (seedData.matches.length !== sgtSchedule.length) {
  console.error(`Length mismatch! seedData matches: ${seedData.matches.length}, sgtSchedule: ${sgtSchedule.length}`);
}

const monthMap = {
  'Jun': '06',
  'Jul': '07'
};

for (let i = 0; i < sgtSchedule.length; i++) {
  const sgtMatch = sgtSchedule[i];
  const dbMatch = seedData.matches[i];

  // sgtMatch.date is like "Fri 12 Jun" or "Sun 14 Jun"
  // sgtMatch.time is like "03:00"
  const dateParts = sgtMatch.date.split(' ');
  const day = dateParts[1].padStart(2, '0');
  const month = monthMap[dateParts[2]];
  const time = sgtMatch.time; // HH:mm

  // The tournament is in 2026
  // Construct a date string in SGT: "2026-MM-DDTHH:mm:00+08:00"
  const sgtDateString = `2026-${month}-${day}T${time}:00+08:00`;
  
  // Convert to UTC Date
  const dateObj = new Date(sgtDateString);
  const utcString = dateObj.toISOString();

  // Output formatting example to check logic
  if (i < 5) {
    console.log(`Mapping ${sgtMatch.fixture} (${sgtMatch.date} ${sgtMatch.time} SGT) -> ${utcString}`);
  }

  // Update seedData
  dbMatch.kickoff_at = utcString;
}

fs.writeFileSync(seedDataPath, JSON.stringify(seedData, null, 2));
console.log('Successfully updated seedData.json with correct UTC times!');
