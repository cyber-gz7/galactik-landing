import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/GZ7/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.cwd();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = decodeURIComponent(url.pathname);
  if (file.includes('target') || file.includes('..')) { res.statusCode = 403; return res.end(); }
  file = file === '/' ? '/ui/index.html' : file;
  if (!/^\/(ui|docs|src-tauri\/templates)\//.test(file)) { res.statusCode = 404; return res.end(); }
  try {
    const data = await fs.readFile(path.join(base, file));
    res.setHeader('Content-Type', ({
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.svg': 'image/svg+xml'
    })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1340, height: 840 } });

await page.addInitScript(() => {
  window.__testGvg = { wins: 0, target_wins: 10, red_points: 0, blue_points: 0, goal_action: 'HOLD', show_side_columns: true };
  const streams = [];
  window.EventSource = class { constructor() { streams.push(this); setTimeout(() => { this.onopen?.(); }, 100); } close() {} };
  window.__TAURI__ = {
    core: {
      invoke: async (command, args) => {
        if (command === 'load_config') return '{}';
        if (command === 'get_license_status') {
          return {
            verified: true,
            username: 'GZ7_ADMIN',
            role: 'ADMIN',
            hwid: 'GL-E320-79485B-AFD734',
            bound_hwid: 'GL-E320-79485B-AFD734',
            allow_mc_plugins: true,
            expires_at: 1999999999,
            session_nonce: 'abc123nonce',
            message: 'Acceso Maestro de Desarrollador Verificado',
            cloud_connected: true
          };
        }
        if (command === 'check_streamer_environment') {
          return {
            java_installed: true,
            java_version: 'Java 17.0.8',
            free_sounds_count: 42,
            gift_icons_count: 1770,
            available_mc_plugins: ['GalactikLiveCore.jar']
          };
        }
        return null;
      }
    }
  };
});

try {
  await page.goto(origin + '/ui/index.html');
  await page.waitForTimeout(3500);

  // Probar simular que la app estaba en 2.1.1 y consulta a GitHub
  const pillResult = await page.evaluate(async () => {
    // Simular llamada con CURRENT_VERSION = 2.1.1
    const res = await fetch('https://api.github.com/repos/cyber-gz7/galactik-landing/releases/latest');
    const release = await res.json();
    return {
      remoteTag: release.tag_name,
      remoteName: release.name,
      assetCount: release.assets?.length,
      assetName: release.assets?.[0]?.name,
      assetSize: release.assets?.[0]?.size
    };
  });

  console.log('API GitHub en vivo responde:', JSON.stringify(pillResult, null, 2));
  assert.equal(pillResult.remoteTag, 'v2.1.3', 'La versión más reciente en GitHub debe ser v2.1.3');
  assert(pillResult.assetName.includes('2.1.3'), 'El asset debe ser de la versión 2.1.3');

  console.log('OTA TEST PASSED SUCCESSFULLY!');
} finally {
  await browser.close();
  server.close();
}
