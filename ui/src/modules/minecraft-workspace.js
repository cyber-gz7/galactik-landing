import { showToast } from '../core/toast.js';
import { createLinkHub } from '../core/shell.js';
export function enhanceRconWorkspace({ app, store, rconBridge, giftRegistry, renderGiftsTable }) {
  const pane = document.getElementById('tab-rcon');
  if (!pane) return;
  const intro = document.createElement('div'); intro.className = 'module-hero';
  intro.innerHTML = '<span class="eyebrow">CONEXIÓN CON TU MUNDO</span><h1>Minecraft Java <span class="module-badge">BETA</span></h1><p>Conecta RCON y convierte los regalos en comandos de tu servidor.</p><div class="beta-banner">Módulo RCON Beta — Arquitectura lista para conexión con servidor Java · <strong id="rcon-live-state">En espera de servidor</strong></div>';
  pane.prepend(intro);
  intro.after(createLinkHub('http://127.0.0.1:4000/mc_overlay.html', 'Tu actividad de Minecraft en pantalla'));
  store.on('rcon:status', status => {
    document.getElementById('rcon-live-state').textContent = typeof status === 'string' ? status : store.getState().rconStatus;
  });
  const consoleEl = document.getElementById('rcon-console-log');
  const commands = document.createElement('div'); commands.className = 'rcon-command-bar';
  commands.innerHTML = '<input class="input-field" aria-label="Comando Minecraft" placeholder="/title @a title {\"text\":\"Hola, stream\"}"><button class="btn-primary" type="button">Enviar</button><div class="rcon-command-bar"><button class="btn-micro" data-command="/summon minecraft:pig ~ ~ ~">/summon</button><button class="btn-micro" data-command="/effect give @a minecraft:speed 10 1">/effect</button><button class="btn-micro" data-command="title">/title</button></div>';
  consoleEl.before(commands);
  const send = async command => {
    if (!window.__TAURI__) return showToast('Abre GALACTK PANEL para usar la conexión RCON nativa.');
    if (!command.trim()) return;
    try {
      const result = await rconBridge.sendCommand(command);
      consoleEl.textContent += `\n> ${command}\n${result || 'Comando enviado'}`;
    } catch (error) { consoleEl.textContent += `\n[ERROR] ${error.message}`; }
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };
  commands.querySelector('button').onclick = () => send(commands.querySelector('input').value);
  commands.querySelectorAll('[data-command]').forEach(button => { button.onclick = () => { commands.querySelector('input').value = button.dataset.command === 'title' ? '/title @a title {"text":"GALACTK PANEL","color":"aqua"}' : button.dataset.command; }; });
  const mapping = document.createElement('div'); mapping.className = 'section-card';
  mapping.innerHTML = '<div class="panel-header"><div><span class="eyebrow">EVENTOS DEL SERVIDOR</span><h2>Regalo → Comando</h2><p>Los cambios usan el mismo mapa de regalos de Minecraft.</p></div><button class="btn-secondary" id="rcon-add-mapping">+ Añadir regla</button></div><div id="rcon-mapping-list"></div>';
  pane.append(mapping);
  const render = () => {
    const list = mapping.querySelector('#rcon-mapping-list'); list.replaceChildren();
    giftRegistry.getAll().forEach(gift => {
      const row = document.createElement('div'); row.className = 'rcon-mapping-row';
      const name = document.createElement('input'); name.className = 'input-field'; name.value = gift.name; name.setAttribute('aria-label', 'Nombre del regalo');
      const command = document.createElement('input'); command.className = 'input-field'; command.value = gift.command || ''; command.setAttribute('aria-label', `Comando de ${gift.name}`);
      const test = document.createElement('button'); test.className = 'btn-secondary'; test.textContent = '▶'; test.title = 'Enviar comando al servidor'; test.onclick = () => send(command.value);
      const remove = document.createElement('button'); remove.className = 'btn-danger'; remove.textContent = '×'; remove.title = 'Eliminar regla'; remove.onclick = async () => { giftRegistry.setAll(giftRegistry.getAll().filter(g => g.id !== gift.id)); await app.persistConfig(); render(); renderGiftsTable(); };
      const save = async () => { const all = giftRegistry.getAll(); const item = all.find(g => g.id === gift.id); if (!item) return; item.name = name.value.trim(); item.command = command.value; giftRegistry.setAll(all); await app.persistConfig(); renderGiftsTable(); };
      name.onchange = save; command.onchange = save; row.append(name, command, test, remove); list.append(row);
    });
  };
  mapping.querySelector('#rcon-add-mapping').onclick = async () => {
    giftRegistry.setAll([...giftRegistry.getAll(), { id: crypto.randomUUID(), name:'Rose', coins:1, command:'/summon minecraft:pig ~ ~ ~', faction:'BUENOS', enabled:true }]);
    await app.persistConfig(); render(); renderGiftsTable();
  };
  render();
}
