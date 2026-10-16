import { showToast } from '../core/toast.js';
import { enhanceRconWorkspace } from './minecraft-workspace.js';
export function initMinecraftRcon({ app, store, rconBridge, crearServidorMinecraft, lanzarServidorMinecraft, giftRegistry, renderGiftsTable }) {
const rconConsole = document.getElementById('rcon-console-log');
document.getElementById('btn-toggle-rcon-pass')?.addEventListener('click', () => {
  const inp = document.getElementById('rcon-pass-input');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

document.getElementById('btn-clear-rcon-log')?.addEventListener('click', () => {
  rconConsole.textContent = '[RCON] Consola limpia.';
});

document.getElementById('btn-save-rcon')?.addEventListener('click', async () => {
  store.setRconConfig({
    host: document.getElementById('rcon-host-input').value.trim(),
    port: Number(document.getElementById('rcon-port-input').value) || 25575,
    password: document.getElementById('rcon-pass-input').value
  });
  await app.persistConfig();
  rconConsole.textContent += `\n[RCON] Configuración guardada.`;
  showToast('✔ Configuración RCON guardada');
});

document.getElementById('btn-test-rcon')?.addEventListener('click', async () => {
  if (!window.__TAURI__) return showToast('La prueba RCON requiere abrir la aplicación de escritorio.');
  store.setRconConfig({
    host: document.getElementById('rcon-host-input').value.trim(),
    port: Number(document.getElementById('rcon-port-input').value) || 25575,
    password: document.getElementById('rcon-pass-input').value
  });
  const res = await rconBridge.testConnection();
  rconConsole.textContent += `\n[${res.success ? 'OK' : 'ERROR'}] ${res.message}`;
  showToast(res.success ? '✔ RCON Conectado' : `⚠️ RCON: ${res.message}`);
});

document.getElementById('btn-create-mc-server')?.addEventListener('click', async () => {
  const logEl = document.getElementById('mc-installer-log');
  showToast('⏳ Descargando y configurando Paper 1.20.1...');
  await crearServidorMinecraft({
    carpeta: document.getElementById('mc-server-folder').value.trim(),
    opNick: document.getElementById('mc-server-op').value.trim(),
    modo: document.getElementById('mc-server-mode').value,
    ramGb: Number(document.getElementById('mc-server-ram').value) || 4,
    rconPass: document.getElementById('mc-server-rcon-pass').value.trim(),
    onLog: msg => { logEl.textContent += `\n${msg}`; logEl.scrollTop = logEl.scrollHeight; }
  });
});

document.getElementById('btn-run-mc-server')?.addEventListener('click', async () => {
  const logEl = document.getElementById('mc-installer-log');
  showToast('▶ Iniciando servidor Minecraft...');
  await lanzarServidorMinecraft(
    document.getElementById('mc-server-folder').value.trim(),
    msg => { logEl.textContent += `\n${msg}`; }
  );
});


enhanceRconWorkspace({ app, store, rconBridge, giftRegistry, renderGiftsTable });
return {};
}
