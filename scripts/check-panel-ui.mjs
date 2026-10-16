import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/GZ7/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.cwd();
const fixture = [{nombre:'Rose',coins:1,imagen:'rose-1-coins.webp',regiones:[]},{nombre:'GG',coins:1,imagen:'gg-1-coins.webp',regiones:[]}];
// The UI uses a tiny fixture; prohibited catalogues and target are never opened.
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = decodeURIComponent(url.pathname);
  if (file.includes('gifts-data')) { res.setHeader('Content-Type','text/javascript'); return res.end(`export const CATALOGO_GIFTS = ${JSON.stringify(fixture)};`); }
  if (file.endsWith('license-client.js')) { res.setHeader('Content-Type','text/javascript'); return res.end('export const licenseClient = {};'); }
  if (file.includes('/gifts/')) { res.setHeader('Content-Type','image/svg+xml'); return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text y="30" font-size="28">🎁</text></svg>'); }
  if (file.includes('target') || file.includes('..')) { res.statusCode=403; return res.end(); }
  file = file === '/' ? '/ui/index.html' : file;
  if (!/^\/(ui|docs|src-tauri\/templates)\//.test(file)) { res.statusCode=404; return res.end(); }
  try { const data = await fs.readFile(path.join(base,file)); res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream'); res.end(data); }
  catch { res.statusCode=404; res.end(); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel:'msedge', headless:true });
const page = await browser.newPage({ viewport:{width:1340,height:840} });
const errors=[];
page.on('pageerror', error => errors.push(error.message));
page.on('console', msg => { if(msg.type()==='error' && !msg.text().includes('Failed to load resource')) errors.push(msg.text()); });
await page.route('**/*', async route => {
  if (route.request().url().startsWith(origin)) return route.continue();
  if (route.request().url().includes('/api/gvg/control')) {
    const payload=route.request().postDataJSON();
    await page.evaluate(p => {
      const s=window.__testGvg;
      if(p.action==='add_wins') s.wins+=p.value;
      if(p.action==='set_wins') s.wins=p.value;
      if(p.action==='add_points') s[p.team==='RED'?'red_points':'blue_points']+=p.value;
      window.__emitGvg();
    },payload);
    return route.fulfill({json:{ok:true}});
  }
  return route.fulfill({status:200,contentType:'application/json',body:'{}'});
});
await page.addInitScript(() => {
  window.__testGvg = {wins:0,target_wins:10,red_points:0,blue_points:0,goal_action:'HOLD',show_side_columns:true};
  const streams=[];
  window.EventSource=class { constructor(){ streams.push(this); setTimeout(()=>{this.onopen?.(); window.__emitGvg();},100); } close(){} };
  window.__emitGvg=()=>streams.forEach(s=>s.onmessage?.({data:JSON.stringify({type:'gvg',gift_vs_gift:window.__testGvg})}));
  window.__TAURI__={core:{invoke:async (command,args)=>{
    if(command==='load_config') return '{}';
    if(command==='check_for_updates') return {available:false,current_version:'2.0.2'};
    if(command==='update_roblox_overlay_config') { Object.assign(window.__testGvg,JSON.parse(args.config_json)); window.__emitGvg(); }
    return null;
  }}};
});
try {
  await page.goto(origin+'/ui/index.html');
  await page.waitForSelector('#obby-tab-live',{timeout:20000,state:'attached'});
  await page.click('[data-tab="tab-roblox"]');
  await page.click('.gvg-win-delta[data-delta="-5"]');
  await page.waitForFunction(()=>document.getElementById('gvg-current-wins').value==='-5');
  assert(await page.locator('#gvg-current-wins').evaluate(el=>el.classList.contains('wins-negative')));
  await page.click('.gvg-point-delta[data-team="RED"][data-delta="10"]');
  await page.waitForFunction(()=>document.querySelector('.duel-direction').textContent.includes('FRENAR'));
  await page.locator('.main-view-container').evaluate(el=>el.scrollTop=0);
  await page.screenshot({path:path.join(process.env.TEMP,'galactk-panel-live.png')});
  const overflow=[];
  for (const size of [{width:1340,height:840},{width:1020,height:660},{width:760,height:800}]) {
    await page.setViewportSize(size);
    for(const view of ['tab-inicio','tab-roblox','tab-minecraft','tab-catalog','tab-sounds','tab-alertas','tab-tts','tab-tops','tab-rcon']) {
      await page.click(`[data-tab="${view}"]`);
      const panels = view==='tab-roblox' ? ['live','rules','theme','profile'] : [null];
      for (const panel of panels) {
        if(panel) await page.click(`#obby-tab-${panel}`);
        const bad=await page.evaluate(()=>{
          const root=document.querySelector('.main-view-container');
          return [...root.querySelectorAll('.tab-pane.active *')].filter(el=>{
            if(!el.getClientRects().length || el.closest('[hidden]') || (el instanceof SVGElement && el.tagName !== 'svg')) return false;
            const rect=el.getBoundingClientRect();
            return rect.width>0 && (rect.right>root.getBoundingClientRect().right+2 || rect.left<root.getBoundingClientRect().left-2);
          }).slice(0,4).map(el=>({tag:el.tagName,id:el.id,class:el.getAttribute('class'),style:el.getAttribute('style'),parent:el.parentElement.id || el.parentElement.className,text:el.textContent.slice(0,80)}));
        });
        if(bad.length) overflow.push({width:size.width,view,panel,bad});
      }
    }
  }
  await page.setViewportSize({width:1340,height:840});
  await page.click('[data-tab="tab-roblox"]'); await page.click('#obby-tab-rules');
  await page.fill('#obby-rule-search','not-a-gift');
  assert.equal(await page.locator('[data-slot-id].roblox-slot-row').count(),0);
  await page.fill('#obby-rule-search','');
  const imported = await page.evaluate(async () => {
    const {parseObbyConfigImport} = await import('/ui/src/modules/obby-config.js');
    const config = parseObbyConfigImport({actions:[{giftName:'Lion',Extra:'Resta -15 wins',duration:7,audioUrl:'https://example.com/lion.mp3'}]});
    const roundtrip = parseObbyConfigImport({robloxOverlayConfig:config});
    return roundtrip.left_rules[0];
  });
  assert.equal(imported.value,-15); assert.equal(imported.duration_seconds,7); assert.equal(imported.action_type,'WIN');
  await page.goto(origin+'/src-tauri/templates/gift-vs-gift.html?theme=transparent');
  await page.evaluate(()=>{window.__testGvg.wins=-15;window.__testGvg.red_points=25;window.__emitGvg();});
  await page.waitForFunction(()=>document.getElementById('val-wins').textContent==='-15');
  assert.equal(await page.locator('#val-wins').evaluate(el=>getComputedStyle(el).color),'rgb(255, 23, 68)');
  for(const selector of ['body','#win-counter','#duel-arena','.rule-item']) {
    assert.equal(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
  }
  console.log(JSON.stringify({errors,overflow,importRoundtrip:'PASS',overlayDebtAndGhost:'PASS',screenshot:path.join(process.env.TEMP,'galactk-panel-live.png')},null,2));
  if(errors.length || overflow.length) process.exitCode=1;
} finally { await browser.close(); server.close(); }
