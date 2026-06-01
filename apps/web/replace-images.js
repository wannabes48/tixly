const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/[locale]/cities/page.tsx',
  'src/app/[locale]/cities/[citySlug]/page.tsx',
  'src/app/[locale]/matches/page.tsx',
  'src/app/[locale]/matches/[matchId]/page.tsx',
  'src/app/[locale]/schedule/page.tsx',
  'src/app/[locale]/stadiums/page.tsx',
  'src/app/[locale]/stadiums/[stadiumSlug]/page.tsx',
  'src/app/[locale]/standings/page.tsx',
  'src/app/[locale]/teams/page.tsx',
  'src/app/[locale]/teams/[teamSlug]/page.tsx',
  'src/components/home/CityGrid.tsx',
  'src/components/home/MatchCarousel.tsx',
];

function processFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if there's any <img
  if (!content.includes('<img ')) return;

  // Add import if not exists
  if (!content.includes("import Image from 'next/image'")) {
    // Find the last import statement or the beginning of the file
    const importRegex = /^import\s+.*?;?\s*$/gm;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    if (lastImportIndex === 0) {
      content = "import Image from 'next/image';\n" + content;
    } else {
      content = content.slice(0, lastImportIndex) + "\nimport Image from 'next/image';" + content.slice(lastImportIndex);
    }
  }

  // Replace <img ... /> with <Image fill ... />
  // We need to capture src, alt, className and other attributes
  const imgRegex = /<img\s+([^>]+?)\s*\/?>/g;
  
  content = content.replace(imgRegex, (match, attrs) => {
    // If it already has width or height, just replace img with Image
    if (attrs.includes('width=') || attrs.includes('height=')) {
      return `<Image ${attrs} />`;
    }

    // Otherwise add fill
    // Check if parent has relative positioning? We can't do that statically easily.
    // Let's just add width={120} height={80} for flags and width={800} height={600} for stadium/cities, 
    // OR we can just use `fill` and let the user ensure parents are `relative`.
    // Wait, adding `width={500} height={300}` is safer if we don't know the parent, but `object-cover` implies they were relying on the container.
    // Next.js 13+ Image supports sizes. Let's use `width={500} height={300}` just as an arbitrary fallback, but wait, `fill` is better if `className="w-full h-full"` is present!
    
    if (attrs.includes('w-full') && attrs.includes('h-full')) {
      // Remove w-full h-full from className and add fill? No, we can keep w-full h-full in className and just pass width/height or fill.
      // Next 13 `fill` is a boolean prop. Let's just use `fill`.
      // Note: the parent MUST have `position: relative`, `absolute`, or `fixed`.
      // We will instead just provide generic width/height to avoid breaking layouts.
      // E.g., for flags: width={64} height={48} (aspect-videoish).
      // For stadiums: width={800} height={600}
      
      let w = 800;
      let h = 600;
      if (attrs.includes('flag') || attrs.includes('flagUrl')) {
        w = 120;
        h = 80;
      }
      return `<Image ${attrs} width={${w}} height={${h}} />`;
    }
    
    // Default fallback
    let w = 400;
    let h = 300;
    if (attrs.includes('flag') || attrs.includes('flagUrl')) {
      w = 64;
      h = 48;
    }
    return `<Image ${attrs} width={${w}} height={${h}} />`;
  });

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

filesToUpdate.forEach(processFile);
