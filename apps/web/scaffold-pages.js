const fs = require('fs');
const path = require('path');

const requiredFiles = [
  '/page.tsx',
  '/matches/page.tsx',
  '/matches/[matchId]/page.tsx',
  '/checkout/layout.tsx',
  '/checkout/page.tsx',
  '/checkout/protection/page.tsx',
  '/checkout/payment/page.tsx',
  '/checkout/confirmation/page.tsx',
  '/teams/page.tsx',
  '/teams/[teamSlug]/page.tsx',
  '/cities/page.tsx',
  '/cities/[citySlug]/page.tsx',
  '/stadiums/page.tsx',
  '/stadiums/[stadiumSlug]/page.tsx',
  '/schedule/page.tsx',
  '/standings/page.tsx',
  '/sell/page.tsx',
  '/sell/register/page.tsx',
  '/sell/login/page.tsx',
  '/sell/list/page.tsx',
  '/sell/dashboard/page.tsx',
  '/admin/layout.tsx',
  '/admin/page.tsx',
  '/account/page.tsx',
  '/how-it-works/page.tsx',
  '/buyer-protection/page.tsx',
  '/faq/page.tsx',
  '/contact/page.tsx',
  '/track-order/page.tsx',
  '/terms/page.tsx',
  '/privacy/page.tsx',
  '/cookies/page.tsx',
  '/about/page.tsx'
];

const basePath = 'd:/tixly/apps/web/src/app/[locale]';

requiredFiles.forEach(file => {
  const fullPath = path.join(basePath, file);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    
    // Capitalize the path parts to make a component name
    let compName = file.replace(/\[|\]/g, '').replace(/[^a-zA-Z0-9]/g, ' ').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    if (!compName || compName === 'PageTsx') compName = 'Home';
    compName = compName.replace('Tsx', 'Page');
    
    if (file.endsWith('layout.tsx')) {
        fs.writeFileSync(fullPath, `export default function ${compName}({ children }: { children: React.ReactNode }) {\n  return (\n    <div>\n      {children}\n    </div>\n  );\n}\n`);
    } else {
        fs.writeFileSync(fullPath, `export default function ${compName}() {\n  return (\n    <div className="min-h-screen pt-32 pb-20 container mx-auto px-4">\n      <h1 className="text-4xl font-bold text-brand-navy">${compName}</h1>\n    </div>\n  );\n}\n`);
    }
    console.log('Created missing file:', file);
  }
});
