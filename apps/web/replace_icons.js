const fs = require('fs');
const path = require('path');

const files = [
  'src/app/[locale]/admin/page.tsx',
  'src/app/[locale]/checkout/confirmation/page.tsx',
  'src/app/[locale]/cities/[citySlug]/page.tsx',
  'src/app/[locale]/how-it-works/page.tsx',
  'src/app/[locale]/matches/page.tsx',
  'src/app/[locale]/schedule/page.tsx',
  'src/app/[locale]/sell/dashboard/page.tsx',
  'src/app/[locale]/stadiums/[stadiumSlug]/page.tsx',
  'src/app/[locale]/teams/[teamSlug]/page.tsx'
];

files.forEach(f => {
  const filePath = path.join('d:/tixly/apps/web', f);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/<Ticket\s+className=(["'].*?["'])\s*\/>/g, (match, p1) => {
     let cls = p1.substring(1, p1.length - 1);
     return `<img src="/ticket.png" alt="Ticket" className="${cls} object-contain" />`;
  });

  content = content.replace(/<Ticket\s+size=\{([0-9]+)\}\s+className=(["'].*?["'])\s*\/>/g, (match, p1, p2) => {
     let cls = p2.substring(1, p2.length - 1);
     return `<img src="/ticket.png" alt="Ticket" className="${cls} object-contain" width={${p1}} height={${p1}} />`;
  });
  
  content = content.replace(/Ticket,\s*/g, '');
  content = content.replace(/,\s*Ticket\b/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log("Replacements complete.");
