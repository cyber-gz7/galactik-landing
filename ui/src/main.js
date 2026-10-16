import { app, autoUpdater } from './core/app-controller.js';
import { showToast } from './core/toast.js';
import { overlayEvents } from './core/events.js';
import { initShell } from './core/shell.js';
export { app, autoUpdater };
export { DEFAULT_ROBLOX_CONFIG, parseObbyConfigImport } from './modules/obby-config.js';

// Modules register their own UI; one failed beta must not stop the live controls.
const modules = {};
async function boot() {
  initShell();
  await app.init();
  const { initDashboard } = await import('./core/dashboard.js');
  const context = initDashboard(modules);
  const entries = [
    ['alerts', './modules/alerts-chroma.js', 'initAlertsChroma'],
    ['obby', './modules/obby-gvg.js', 'initObbyGvg'],
    ['sounds', './modules/soundboard.js', 'initSoundboard'],
    ['minecraft', './modules/minecraft-rcon.js', 'initMinecraftRcon'],
    ['admin', './modules/admin-licenses.js', 'initAdminLicenses'],
    ['updater', './modules/auto-updater.js', 'initAutoUpdater']
  ];
  for (const [name, path, init] of entries) {
    try { modules[name] = (await import(path))[init](context); }
    catch (error) {
      console.error(`[GALACTK PANEL / ${name}]`, error);
      showToast(`No se pudo iniciar ${name}. Los demás módulos siguen disponibles.`);
    }
  }
  context.finish();
  overlayEvents.start();
  document.dispatchEvent(new Event('galactk:ready'));
}
boot().catch(error => {
  console.error('[GALACTK PANEL]', error);
  showToast('No se pudo iniciar el panel. Vuelve a abrir la aplicación.');
}).finally(() => document.getElementById('galactk-loading')?.remove());
