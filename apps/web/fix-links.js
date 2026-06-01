const fs = require('fs');
const path = require('path');

const filePaths = [
  'src/components/Navbar.tsx',
  'src/components/Footer.tsx',
  'src/components/home/BuyerProtection.tsx',
  'src/components/home/CityGrid.tsx',
  'src/components/home/FAQ.tsx',
  'src/components/home/Hero.tsx',
  'src/components/home/HowItWorks.tsx',
  'src/components/home/MatchCarousel.tsx',
  'src/components/home/TeamGrid.tsx'
];

filePaths.forEach(relPath => {
  const p = path.join('d:/tixly/apps/web', relPath);
  let content = fs.readFileSync(p, 'utf8');
  
  if (!content.includes('useLocale')) {
    if (content.includes("'use client'") || content.includes('"use client"')) {
        content = content.replace(/(['"]use client['"];?)/, '$1\nimport { useLocale } from "next-intl";');
    } else {
        content = 'import { useLocale } from "next-intl";\n' + content;
    }
    
    // insert 'const locale = useLocale();' inside the component
    // we assume the component is 'export function Navbar()' etc
    content = content.replace(/export (default )?(async )?function ([A-Za-z0-9_]+)\([^)]*\) \{/, (match) => {
        return match + '\n  const locale = useLocale();\n';
    });
    
    // For Hero.tsx: href={f.round ? `/matches?round=${f.round}` : '/matches'}
    content = content.replace(/href=\{([^}]+)\}/g, (match, inner) => {
        if (inner.includes('`/${locale}/')) return match; 
        
        // if inner is a template literal like `/matches?round=${f.round}`
        if (inner.startsWith('`/') && !inner.startsWith('`/${locale}')) {
             return 'href={`/${locale}' + inner.slice(2) + '}';
        }
        return match;
    });

    // replace exact strings href="/something" to href={`/${locale}/something`}
    content = content.replace(/href="\/([^"]*)"/g, 'href={`/${locale}/$1`}');
    
    // fix href={`/${locale}/`} to href={`/${locale}`}
    content = content.replace(/href=\{`\/\$\{locale\}\/`\}/g, 'href={`/${locale}`}');
    
    fs.writeFileSync(p, content, 'utf8');
  }
});
console.log('Done');
