import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/GZ7/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.cwd();

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
  window.EventSource = class {
    constructor() { streams.push(this); setTimeout(() => { this.onopen?.(); window.__emitGvg(); }, 100); }
    close() {}
  };
  window.__emitGvg = () => streams.forEach(s => s.onmessage?.({ data: JSON.stringify({ type: 'gvg', gift_vs_gift: window.__testGvg }) }));
  window.__TAURI__ = {
    core: {
      invoke: async (cmd) => {
        if (cmd === 'load_config') return '{}';
        if (cmd === 'check_for_updates') return { available: false, current_version: '2.1.0' };
        return null;
      }
    }
  };
});

try {
  await page.goto(origin + '/ui/index.html');
  await page.waitForTimeout(2600); // esperar que el loader desaparezca
  
  // 1. Captura de la pestaña Inicio (Dashboard)
  await page.screenshot({ path: path.join(base, 'scripts/view-inicio.png') });
  console.log('✔ Captura Inicio guardada');

  // 2. Captura de la pestaña Roblox Obby (Duelo Gift vs Gift)
  await page.click('[data-tab="tab-roblox"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(base, 'scripts/view-roblox.png') });
  console.log('✔ Captura Roblox guardada');

  // 3. Captura de la subpestaña Reglas y Regalos
  const rulesTab = await page.$('#obby-tab-rules');
  if (rulesTab) {
    await rulesTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(base, 'scripts/view-roblox-rules.png') });
    console.log('✔ Captura Roblox Rules guardada');
  }

  // 4. Captura de la pestaña Minecraft
  await page.click('[data-tab="tab-minecraft"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(base, 'scripts/view-minecraft.png') });
  console.log('✔ Captura Minecraft guardada');

} finally {
  await browser.close();
  server.close();
}
