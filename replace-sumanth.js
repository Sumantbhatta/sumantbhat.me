const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        filelist = walkSync(dir + '/' + file, filelist);
      }
    }
    else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

const root = 'd:/sumanthbhat.me';
const files = walkSync(root);

// Rename files
for (const file of files) {
  const filename = path.basename(file);
  if (filename.toLowerCase().includes('casper')) {
    const newFilename = filename.replace(/casper/gi, match => {
      if (match === 'Casper') return 'Sumanth';
      if (match === 'casper') return 'sumanth';
      if (match === 'CASPER') return 'SUMANTH';
      return 'Sumanth';
    });
    const newFile = path.join(path.dirname(file), newFilename);
    console.log(`Renaming ${file} to ${newFile}`);
    fs.renameSync(file, newFile);
  }
}

// Re-gather files after renaming
const files2 = walkSync(root);

// Replace content
for (const file of files2) {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.md')) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/Casper's/g, "Sumanth's")
      .replace(/casper's/g, "sumanth's")
      .replace(/Caspers/g, "Sumanths")
      .replace(/caspers/g, "sumanths")
      .replace(/Casper/g, "Sumanth")
      .replace(/casper/g, "sumanth");
    
    if (content !== newContent) {
      console.log(`Updating content of ${file}`);
      fs.writeFileSync(file, newContent, 'utf8');
    }
  }
}

// Rename the caspers-caviar-next directory if it's there
const oldDir = 'd:/sumanthbhat.me/caspers-caviar-next';
const newDir = 'd:/sumanthbhat.me/sumanths-caviar-next';
if (fs.existsSync(oldDir)) {
  fs.renameSync(oldDir, newDir);
  console.log(`Renamed directory ${oldDir} to ${newDir}`);
}

console.log("Done!");
