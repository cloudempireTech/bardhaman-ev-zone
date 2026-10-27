const fs = require('fs');
const path = require('path');

// Mandate 13: 180s hard watchdog timer
const watchdog = setTimeout(() => {
  console.error('[WATCHDOG] verify_assets.js exceeded 180s hard timeout');
  process.exit(1);
}, 180000).unref();

const projectDir = path.resolve(__dirname);
const htmlFiles = [
  'index.html',
  'about.html',
  'models.html',
  'fleet.html',
  'gallery.html',
  'reviews.html',
  'contact.html'
];

console.log(`Starting asset verification in: ${projectDir}`);

let totalErrors = 0;
let totalChecked = 0;

for (const file of htmlFiles) {
  const filePath = path.join(projectDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Missing HTML file: ${file}`);
    totalErrors++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Regex for img src
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      continue;
    }
    totalChecked++;
    const resolvedPath = path.resolve(projectDir, src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[MISSING ASSET] In ${file}: <img> src="${src}" not found on disk at ${resolvedPath}`);
      totalErrors++;
    } else {
      // console.log(`[OK] ${file} -> ${src}`);
    }
  }

  // Regex for video or source src
  const videoRegex = /<(?:video|source)[^>]+src=["']([^"']+)["']/gi;
  while ((match = videoRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      continue;
    }
    totalChecked++;
    const resolvedPath = path.resolve(projectDir, src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[MISSING ASSET] In ${file}: <video/source> src="${src}" not found on disk at ${resolvedPath}`);
      totalErrors++;
    } else {
      // console.log(`[OK] ${file} -> ${src}`);
    }
  }

  // Check link rel icon / apple-touch-icon / css
  const linkRegex = /<link[^>]+href=["']([^"']+)["']/gi;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('#')) {
      continue;
    }
    totalChecked++;
    const resolvedPath = path.resolve(projectDir, href);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[MISSING LINK] In ${file}: <link> href="${href}" not found on disk at ${resolvedPath}`);
      totalErrors++;
    }
  }

  // Check script src
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http://') || src.startsWith('https://')) {
      continue;
    }
    totalChecked++;
    const resolvedPath = path.resolve(projectDir, src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[MISSING SCRIPT] In ${file}: <script> src="${src}" not found on disk at ${resolvedPath}`);
      totalErrors++;
    }
  }
}

console.log(`\n========================================`);
console.log(`Verification Complete: Checked ${totalChecked} assets across ${htmlFiles.length} pages.`);
if (totalErrors === 0) {
  console.log(`[SUCCESS] 0 missing assets! All images, videos, stylesheets, and scripts exist!`);
  clearTimeout(watchdog);
  process.exit(0);
} else {
  console.error(`[FAILURE] Found ${totalErrors} missing assets! Please fix before deployment.`);
  clearTimeout(watchdog);
  process.exit(1);
}
