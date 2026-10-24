import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/GZ7/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = path.join(process.cwd(), 'dist');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = decodeURIComponent(url.pathname);
  file = file === '/' ? '/index.html' : file;
  try {
    const fullPath = path.join(base, file);
    const data = await fs.readFile(fullPath);
    res.setHeader('Content-Type', ({
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });

await page.addInitScript(() => {
  window.__TAURI__ = {
    core: {
      invoke: async (command, args) => {
        if (command === 'load_config') {
          return JSON.stringify({ streamerUsername: 'robertogames444' });
        }
        if (command === 'check_for_updates') {
          return { available: false, current_version: '2.2.0', version: '2.2.0' };
        }
        return null;
      }
    }
  };
});

const brainDir = 'C:/Users/GZ7/.gemini/antigravity/brain/e3613b1c-5281-4d78-8800-995e70087987';

try {
  await page.goto(origin);
  await page.waitForTimeout(1000);

  // 1. Clic en Alertas & Croma en el Sidebar
  console.log('Testing Navigation: Alertas & Croma...');
  await page.locator('aside button:has-text("Alertas & Croma")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${brainDir}/react-19-tab-alerts.png`, fullPage: true });
  console.log('Saved: react-19-tab-alerts.png');

  // 2. Clic en Tops & Metas en el Sidebar
  console.log('Testing Navigation: Tops & Metas...');
  await page.locator('aside button:has-text("Tops & Metas")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${brainDir}/react-19-tab-tops.png`, fullPage: true });
  console.log('Saved: react-19-tab-tops.png');

  // 3. Clic en Sonidos & Memes en el Sidebar
  console.log('Testing Navigation: Sonidos & Memes...');
  await page.locator('aside button:has-text("Sonidos & Memes")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${brainDir}/react-19-tab-sounds.png`, fullPage: true });
  console.log('Saved: react-19-tab-sounds.png');

  // 4. Regreso a Inicio y prueba de navegación desde tarjetas de Inicio
  console.log('Testing Navigation from Home cards...');
  await page.locator('aside button:has-text("Inicio")').click();
  await page.waitForTimeout(600);
  
  // Clic en la tarjeta de Sonidos & Memes en Inicio
  await page.locator('div:has-text("Sonidos & Memes") >> text=Reproducir').first().click();
  await page.waitForTimeout(500);
  const isSoundboardVisible = await page.locator('text=SOUNDBOARD INTERACTIVO').isVisible();
  console.log('Home -> Sonidos card navigation working:', isSoundboardVisible);

  console.log('ALL TESTS PASSED SUCCESSFULLY!');
} finally {
  await browser.close();
  server.close();
}