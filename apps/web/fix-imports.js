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

const allFiles = walkSync('d:/tixly/apps/web/src/app');

allFiles.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import { authOptions }')) {
       // regex to match any path to route.ts
       content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+['"].*?api\/auth\/\[\.\.\.nextauth\]\/route['"];?/, 'import { authOptions } from "@/lib/auth";');
       fs.writeFileSync(file, content, 'utf8');
    }
  }
});
console.log('Imports fixed.');
