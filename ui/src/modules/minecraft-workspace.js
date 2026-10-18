import { showToast } from '../core/toast.js';

export function enhanceRconWorkspace({ app, store, rconBridge, giftRegistry, renderGiftsTable }) {
  const pane = document.getElementById('tab-rcon');
  if (!pane) return;

  const liveState = document.getElementById('rcon-live-state');
  store.on('rcon:status', status => {
    if (liveState) {
      liveState.textContent = typeof status === 'string' ? status : store.getState().rconStatus;
    }
  });

  const consoleEl = document.getElementById('rcon-console-log');
  if (!consoleEl) return;

  // Si ya existe la barra de comandos interactivos, no duplicar
  if (pane.querySelector('.rcon-interactive-quick-bar')) return;

  const commands = document.createElement('div');
  commands.className = 'rcon-command-bar rcon-interactive-quick-bar';
  commands.style.marginBottom = '12px';
  commands.innerHTML = `
    <div style="display: flex; gap: 8px; width: 100%;">
      <input class="input-field rcon-manual-cmd" style="flex: 1; font-family: var(--font-mono); font-size: 12px;" aria-label="Comando Minecraft" placeholder="Ej: /title @a title {&quot;text&quot;:&quot;¡Hola Stream!&quot;,&quot;color&quot;:&quot;gold&quot;}">
      <button class="btn-primary btn-send-manual-rcon" type="button" style="white-space: nowrap;">⚡ Enviar RCON</button>
    </div>
    <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
      <button class="btn-micro" data-cmd="/totems dar {jugador} totems=124">🛡️ +124 Tótems</button>
      <button class="btn-micro" data-cmd="/effect give {jugador} minecraft:night_vision infinite 0 true">👁️ Visión Nocturna</button>
      <button class="btn-micro" data-cmd="/trueno {jugador}">⚡ Trueno</button>
      <button class="btn-micro" data-cmd="/kit armadura {jugador}">⚔️ Kit Armadura</button>
      <button class="btn-micro" data-cmd="/dragon">🐉 Dragón</button>
      <button class="btn-micro" data-cmd="/la_parka">💀 La Parka</button>
      <button class="btn-micro" data-cmd="/solcruel">☀️ Sol Cruel</button>
      <button class="btn-micro" data-cmd="/list">👥 /list</button>
    </div>
  `;
  consoleEl.before(commands);

  const cmdInput = commands.querySelector('.rcon-manual-cmd');
  const btnSend = commands.querySelector('.btn-send-manual-rcon');

  const send = async (command) => {
    if (!window.__TAURI__) return showToast('Abre GALACTK PANEL en escritorio para enviar comandos RCON nativos.');
    const targetPlayer = store.getState()?.targetPlayer || 'cj7_tutoriales';
    const cleanCmd = (command || '').replace(/{jugador}|{player}|{target}/gi, targetPlayer).trim();
    if (!cleanCmd) return;
    try {
      const result = await rconBridge.sendCommand(cleanCmd);
      consoleEl.textContent += `\n> ${cleanCmd}\n${result || '[OK] Ejecutado'}`;
    } catch (error) {
      consoleEl.textContent += `\n[ERROR] ${error.message}`;
    }
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };

  btnSend?.addEventListener('click', () => send(cmdInput.value));
  cmdInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send(cmdInput.value);
    }
  });

  commands.querySelectorAll('[data-cmd]').forEach(b => {
    b.addEventListener('click', () => {
      const targetPlayer = store.getState()?.targetPlayer || 'cj7_tutoriales';
      const c = b.dataset.cmd.replace(/{jugador}|{player}|{target}/gi, targetPlayer);
      cmdInput.value = c;
      send(c);
    });
  });
}
