const fs = require('fs');
const path = require('path');
const { chromium } = require('/root/.bun/install/global/node_modules/playwright-core');

async function renderIcons() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const svgContent = fs.readFileSync(path.resolve('public/icon.svg'), 'utf8');

  const targets = [
    { file: 'public/pwa-512x512.png', size: 512 },
    { file: 'public/pwa-maskable-512x512.png', size: 512 },
    { file: 'public/pwa-192x192.png', size: 192 },
    { file: 'public/apple-touch-icon.png', size: 180 },
    { file: 'dist/pwa-512x512.png', size: 512 },
    { file: 'dist/pwa-maskable-512x512.png', size: 512 },
    { file: 'dist/pwa-192x192.png', size: 192 },
    { file: 'dist/apple-touch-icon.png', size: 180 }
  ];

  for (const target of targets) {
    const page = await browser.newPage({
      viewport: { width: target.size, height: target.size }
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; display: flex; align-items: center; justify-content: center; width: ${target.size}px; height: ${target.size}px; overflow: hidden; }
    svg { width: ${target.size}px; height: ${target.size}px; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

    await page.setContent(html);
    const dir = path.dirname(target.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await page.screenshot({ path: target.file, omitBackground: true });
    await page.close();
    console.log(`Rendered: ${target.file} (${target.size}x${target.size})`);
  }

  await browser.close();
  console.log('All icons rendered perfectly!');
}

renderIcons().catch((err) => {
  console.error('Render error:', err);
  process.exit(1);
});
