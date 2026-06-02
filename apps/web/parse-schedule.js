const fs = require('fs');

const text = fs.readFileSync('raw-schedule.txt', 'utf8');
const lines = text.split('\n').filter(l => l.trim().length > 0);

const parsedMatches = [];
let currentRound = '';
let currentDate = null;
let matchCounter = 1;

for (const line of lines) {
  if (line.includes('FIFA World Cup 2026') && line.includes('fixtures')) {
    if (line.includes('Group Stage')) currentRound = 'Group Stage';
    else if (line.includes('Round of 32')) currentRound = 'Round of 32';
    else if (line.includes('Round of 16')) currentRound = 'Round of 16';
    else if (line.includes('quarter-final')) currentRound = 'Quarter-Finals';
    else if (line.includes('semi-final')) currentRound = 'Semi-Finals';
    continue;
  }
  if (line.includes('FIFA World Cup 2026 bronze final')) {
    currentRound = 'Third Place';
    continue;
  }
  if (line.includes('FIFA World Cup 2026 Final')) {
    currentRound = 'Final';
    continue;
  }
  
  const dayMatch = line.match(/^[A-Z][a-z]+, \d{1,2} [A-Z][a-z]+ \d{4}$/);
  if (dayMatch) {
    currentDate = new Date(line);
    continue;
  }

  if (line.includes(' v ')) {
    let homeStr, awayStr, stadiumStr, mNum;
    
    // Normalize dashes
    const normalizedLine = line.replace(/–/g, '-');
    
    if (normalizedLine.startsWith('Match ')) {
      const parts = normalizedLine.split(' - ');
      mNum = parseInt(parts[0].replace('Match ', ''));
      const teamsPart = parts[1].trim();
      stadiumStr = parts.slice(2).join('-').trim();
      const [h, a] = teamsPart.split(' v ');
      homeStr = h.trim();
      awayStr = a.trim();
    } else {
      mNum = matchCounter++;
      const parts = normalizedLine.split('-');
      
      const teamsPart = parts[0].trim();
      const [h, a] = teamsPart.split(' v ');
      homeStr = h.trim();
      awayStr = a.trim();
      
      if (parts.length >= 3) {
        stadiumStr = parts.slice(2).join('-').trim();
      } else {
        // Fallback for cases without Group info
        stadiumStr = parts[parts.length - 1].trim();
      }
    }
    
    parsedMatches.push({
      matchNumber: mNum,
      round: currentRound,
      home: homeStr,
      away: awayStr,
      stadium: stadiumStr,
      date: currentDate
    });
  }
}

fs.writeFileSync('parsed-matches.json', JSON.stringify(parsedMatches, null, 2));
console.log('Parsed', parsedMatches.length, 'matches to parsed-matches.json');
