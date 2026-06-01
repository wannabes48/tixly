const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/[locale]/matches/page.tsx',
  'src/app/[locale]/matches/[matchId]/page.tsx',
  'src/app/[locale]/teams/[teamSlug]/page.tsx',
  'src/app/[locale]/cities/[citySlug]/page.tsx',
  'src/app/[locale]/stadiums/[stadiumSlug]/page.tsx',
];

function processFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace force-dynamic with revalidate = 300
  if (content.includes("export const dynamic = 'force-dynamic';")) {
    content = content.replace(
      "export const dynamic = 'force-dynamic';", 
      "export const revalidate = 300;"
    );
  } else if (!content.includes("export const revalidate = 300;")) {
    content += "\nexport const revalidate = 300;\n";
  }

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

filesToUpdate.forEach(processFile);
