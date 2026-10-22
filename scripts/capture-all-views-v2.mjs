import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/GZ7/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.cwd();
const artifactDir = 'C:/Users/GZ7/.gemini/antigravity/brain/e3613b1c-5281-4d78-8800-995e70087987';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = decodeURIComponent(url.pathname);
  if (file.includes('gifts-data')) { res.setHeader('Content-Type','text/javascript'); return res.end(`export const CATALOGO_GIFTS = [];`); }
  if (file.endsWith('license-client.js')) { res.setHeader('Content-Type','text/javascript'); return res.end('export const licenseClient = {};'); }
  if (file.includes('target') || file.includes('..')) { res.statusCode=403; return res.end(); }
  file = file === '/' ? '/ui/index.html' : file;
  try {
    const data = await fs.readFile(path.join(base, file));
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404; res.end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.addInitScript(() => {
  window.__testGvg = { wins: 0, target_wins: 10, red_points: 0, blue_points: 0, goal_action: 'HOLD', show_side_columns: true };
  const streams = [];
  window.EventSource = class { constructor() {} close() {} };
  window.__TAURI__ = {
    core: {
      invoke: async (cmd) => {
        if (cmd === 'load_config') return '{}';
        if (cmd === 'check_for_updates') return { available: false, current_version: '2.1.1' };
        return null;
      }
    }
  };
});

try {
  await page.goto(origin + '/ui/index.html');
  await page.waitForTimeout(2800);

  // 1. Captura de la pantalla de Inicio completa
  const inicioPath = path.join(artifactDir, 'galactik-live-inicio-vector.png');
  await page.screenshot({ path: inicioPath });
  console.log('✔ Inicio guardado en:', inicioPath);

  // 2. Primer plano (Close-up) exclusivo de las tarjetas de perfil de stream
  const profilesEl = await page.$('.profile-cards-grid');
  if (profilesEl) {
    const profileCloseUpPath = path.join(artifactDir, 'galactik-live-perfiles-closeup.png');
    await profilesEl.screenshot({ path: profileCloseUpPath });
    console.log('✔ Close-up de perfiles guardado en:', profileCloseUpPath);
  }

  // 3. Captura de Roblox Obby
  await page.click('[data-tab="tab-roblox"]');
  await page.waitForTimeout(700);
  const robloxPath = path.join(artifactDir, 'galactik-live-roblox-vector.png');
  await page.screenshot({ path: robloxPath });
  console.log('✔ Roblox guardado en:', robloxPath);

  // 4. Captura de la arena Rosa vs GG en primer plano (Close-up)
  const arenaEl = await page.$('.gvg-duel-arena');
  if (arenaEl) {
    const arenaCloseUpPath = path.join(artifactDir, 'galactik-live-arena-closeup.png');
    await arenaEl.screenshot({ path: arenaCloseUpPath });
    console.log('✔ Close-up de arena guardado en:', arenaCloseUpPath);
  }

  // 5. Captura de Reglas y regalos
  const rulesTab = await page.$('#obby-tab-rules');
  if (rulesTab) {
    await rulesTab.click();
    await page.waitForTimeout(700);
    const rulesPath = path.join(artifactDir, 'galactik-live-rules-vector.png');
    await page.screenshot({ path: rulesPath });
    console.log('✔ Reglas guardado en:', rulesPath);
  }

  // 6. Captura de Minecraft
  await page.click('[data-tab="tab-minecraft"]');
  await page.waitForTimeout(700);
  const mcPath = path.join(artifactDir, 'galactik-live-minecraft-vector.png');
  await page.screenshot({ path: mcPath });
  console.log('✔ Minecraft guardado en:', mcPath);

} finally {
  await browser.close();
  server.close();
}
