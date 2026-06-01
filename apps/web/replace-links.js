const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const allFiles = walkSync('d:/tixly/apps/web/src');

allFiles.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    if (content.includes("import Link from 'next/link'") || content.includes('import Link from "next/link"')) {
       content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/, "import { Link } from '@/navigation';");
       modified = true;
    }

    // Revert the `/${locale}` injection from earlier.
    // e.g. href={`/${locale}/something`} -> href={`/something`}
    if (content.includes('`/${locale}')) {
       // Replace href={`/${locale}/matches`} with href="/matches"
       // We'll just replace `/${locale}` with empty string if it's inside a template literal.
       // E.g. href={`/${locale}/matches`} -> href={`/matches`} 
       content = content.replace(/`\/\$\{locale\}([^`]*)`/g, '`$1`');
       
       // Clean up empty template literals if they became static strings: href={`/matches`} -> href="/matches"
       content = content.replace(/href=\{`([^$]*?)`\}/g, 'href="$1"');
       
       // Handle cases where we had href={`/${locale}`} and it became href={``}
       content = content.replace(/href=\{``\}/g, 'href="/"');
       content = content.replace(/href=""/g, 'href="/"');

       modified = true;
    }

    if (modified) {
       fs.writeFileSync(file, content, 'utf8');
    }
  }
});
console.log('Links replaced.');
