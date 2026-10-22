import { normalizeMinecraftRule, MC_EVENT_TYPES } from './minecraft-events.js';
import { buscarGifts, limpiarArchivoGift, tiktokGiftIdDeNombre } from '../gifts.js';
import { S2E_MC_ACTION_ICONS } from '../s2e-catalog.js';
import { showToast } from '../core/toast.js';
import { rconBridge } from '../rcon.js';
import { soundManager } from '../sounds.js';
import { store } from '../store.js';

const STYLE_URLS = { carousel: 'http://localhost:4000/mc_carrusel.html', static: 'http://localhost:4000/mc_estatico.html', flat: 'http://localhost:4000/mc_plano.html' };
const STYLE_NAMES = { carousel: 'Carrusel', static: 'Cuadrícula', flat: 'Plano' };
const TYPE_NAMES = { gift: 'Regalo', follow: 'Nuevo seguidor', likes_user: 'Likes por persona', likes_total: 'Meta global de likes', share: 'Compartido', subscribe: 'Suscripción', comment: 'Comentario con texto' };
const TYPE_ICONS = { follow: '➕', likes_user: '❤️', likes_total: '💗', share: '↗', subscribe: '⭐', comment: '💬' };
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function initMinecraftConfigWorkspace({ app, giftRegistry, giftUrl, openS2EAudioModal }) {
  const pane = document.getElementById('tab-minecraft');
  if (!pane) return;
  const nightVisionChecked = document.getElementById('toggle-night-vision-mc')?.checked !== false;
  pane.innerHTML = `
    <div class="mc-config-heading"><div><span class="eyebrow">MINECRAFT · CENTRO DE CONTROL</span><h1>Overlay y eventos</h1><p>Elige el estilo, configura disparadores y edita sus comandos en un solo lugar.</p></div><label class="mc-config-toggle"><input type="checkbox" id="toggle-night-vision-mc" ${nightVisionChecked ? 'checked' : ''}> Visión nocturna</label></div>
    <section class="section-card mc-config-section"><div class="mc-config-section-head"><div><h2>Estilo del overlay</h2><p>La vista previa no ejecuta comandos.</p></div><button type="button" class="btn-secondary" id="mc-copy-url">Copiar URL para OBS</button></div>
      <div class="mc-config-style-options" role="group" aria-label="Estilo del overlay"><button type="button" data-mc-style="carousel"><strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>Carrusel</strong><span>Regalos en movimiento</span></button><button type="button" data-mc-style="static"><strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>Cuadrícula</strong><span>Todos a la vista</span></button><button type="button" data-mc-style="flat"><strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="18" y2="12"/></svg>Plano</strong><span>Cinta compacta</span></button></div>
      <div class="mc-config-preview"><iframe id="mc-config-preview-frame" title="Vista previa del overlay Minecraft" loading="lazy"></iframe></div><p class="mc-config-url" id="mc-config-url"></p></section>
    <section class="section-card mc-config-section"><div class="mc-config-section-head"><div><h2>Ajustes del overlay</h2><p>Los controles afectan los tres estilos.</p></div></div>
      <div class="mc-config-settings"><label>Escala <output id="mc-scale-value"></output><input type="range" data-mc-setting="mcOverlayScale" min="60" max="160" step="5"></label><label>Velocidad del carrusel <output id="mc-speed-value"></output><input type="range" data-mc-setting="mcOverlaySpeed" min="10" max="60" step="2"></label><label>Tamaño del texto <output id="mc-font-value"></output><input type="range" data-mc-setting="mcOverlayFontSize" min="9" max="17" step="0.5"></label><label>Fondo de las tarjetas <output id="mc-opacity-value"></output><input type="range" data-mc-setting="mcOverlayOpacity" min="0" max="100" step="5"></label></div></section>
    <section class="section-card mc-config-section mc-config-events-section"><div class="mc-config-section-head"><div><h2>Eventos configurados <span id="mc-event-count" class="mc-count"></span></h2><p>Una fila por disparador. Abre Editar para ajustar regalo, acción, comando, imagen y sonido.</p></div><div class="mc-config-add"><select id="mc-new-event-type" class="table-select" aria-label="Tipo de evento"><option value="gift">Regalo de TikTok</option>${MC_EVENT_TYPES.map(type => `<option value="${type}">${TYPE_NAMES[type]}</option>`).join('')}</select><button type="button" class="btn-primary" id="mc-add-event">+ Añadir evento</button></div></div>
      <div class="mc-list-head" aria-hidden="true"><span>DISPARADOR</span><span>ACCIÓN Y COMANDO</span><span>SONIDO</span><span>ACTIVO</span><span>PROBAR</span><span>EDITAR</span></div><div id="mc-config-event-list" class="mc-config-event-list"></div>
      <div class="mc-config-footer"><span id="mc-config-status" role="status">Configuración lista</span><button type="button" class="btn-primary" id="mc-save-all">Guardar y actualizar overlay</button></div></section>
    <div class="mc-dialog-backdrop" id="mc-event-dialog" hidden><div class="mc-dialog" role="dialog" aria-modal="true" aria-labelledby="mc-dialog-title">
      <div class="mc-dialog-head"><div><span class="eyebrow">EDITOR DE EVENTOS</span><h2 id="mc-dialog-title">Configurar evento</h2></div><button type="button" class="mc-icon-button" data-dialog="close" aria-label="Cerrar">✕</button></div>
      <div class="mc-dialog-body"><div class="mc-editor-trigger"><span id="mc-editor-icon" class="mc-config-event-icon">🎁</span><div><strong id="mc-editor-type"></strong><p id="mc-editor-subtitle"></p></div></div>
        <div id="mc-gift-picker" class="mc-picker-block" hidden><div class="mc-picker-head"><strong>Seleccionar regalo</strong><input id="mc-gift-search" class="input-field" placeholder="Buscar regalo, moneda o ID" aria-label="Buscar regalo"></div><div id="mc-gift-grid" class="mc-gift-grid"></div></div>
        <div class="mc-editor-grid"><label>Acción visible en el overlay<input class="input-field" data-editor-field="label" placeholder="Ej. TNT, Nuevo seguidor"></label><label id="mc-editor-threshold-wrap" hidden>Umbral de likes<input class="input-field" type="number" min="1" data-editor-field="threshold"></label><label id="mc-editor-comment-wrap" hidden>Texto del comentario<input class="input-field" data-editor-field="matchText" placeholder="Palabra o frase que activa este evento"></label><label id="mc-editor-mult-wrap" hidden>Insignia<input class="input-field" data-editor-field="mult" placeholder="Ej. x10"></label><label id="mc-editor-totem-wrap" hidden>Cambio de tótems<input class="input-field" type="number" data-editor-field="totemDelta"></label><label id="mc-editor-repetition-wrap" hidden>Repetición visual<input class="input-field" type="number" min="1" data-editor-field="repetition"></label></div>
        <label class="mc-editor-command">Comandos RCON <small>Uno por línea. Usa {jugador} y {donador}.</small><textarea class="input-field" rows="5" data-editor-field="command" placeholder="/comando {jugador} {donador}"></textarea></label>
        <div id="mc-editor-image-wrap" class="mc-editor-command" hidden><label for="mc-editor-image-url">Imagen visible en el overlay</label><div class="mc-image-field"><input id="mc-editor-image-url" class="input-field" data-editor-field="imageUrl" placeholder="Sin imagen seleccionada"><button type="button" class="btn-secondary" data-dialog="image">Seleccionar imagen</button></div></div>
        <div class="mc-editor-sound"><div><strong>Sonido</strong><span id="mc-editor-sound-name">Sin sonido seleccionado</span></div><button type="button" class="btn-secondary" data-dialog="sound">🎵 Elegir audio</button><button type="button" class="btn-secondary" data-dialog="clear-sound">Quitar</button></div>
      </div><div class="mc-dialog-footer"><button type="button" class="btn-danger" data-dialog="delete">Eliminar</button><div><button type="button" class="btn-secondary" data-dialog="close">Cancelar</button><button type="button" class="btn-primary" data-dialog="save">Guardar evento</button></div></div>
    </div></div>
    <div class="mc-dialog-backdrop mc-image-dialog-backdrop" id="mc-image-dialog" hidden><div class="mc-dialog mc-image-dialog" role="dialog" aria-modal="true" aria-labelledby="mc-image-title"><div class="mc-dialog-head"><div><span class="eyebrow">GALERÍA MINECRAFT</span><h2 id="mc-image-title">Seleccionar imagen</h2></div><button type="button" class="mc-icon-button" data-image-action="close" aria-label="Cerrar">✕</button></div><div class="mc-dialog-body"><input id="mc-image-search" class="input-field" placeholder="Buscar imagen de Minecraft"><div id="mc-image-grid" class="mc-image-grid"></div></div><div class="mc-dialog-footer"><button type="button" class="btn-secondary" data-image-action="clear">Quitar imagen</button><button type="button" class="btn-primary" data-image-action="close">Volver al editor</button></div></div></div>`;
  const listEl = pane.querySelector('#mc-config-event-list');
  const statusEl = pane.querySelector('#mc-config-status');
  const frame = pane.querySelector('#mc-config-preview-frame');
  const dialog = pane.querySelector('#mc-event-dialog');
  const imageDialog = pane.querySelector('#mc-image-dialog');
  let editor = null;
  let pendingSave = Promise.resolve();
  const selected = () => editor?.kind === 'gift' ? giftRegistry.getAll()[editor.index] : app.mcEventRules[editor?.index];
  async function save() {
    statusEl.textContent = 'Guardando…';
    pendingSave = pendingSave.then(async () => {
      try { statusEl.textContent = await app.persistConfig() ? 'Guardado y sincronizado con OBS' : 'No se pudo guardar'; }
      catch (error) { statusEl.textContent = 'No se pudo guardar'; console.error(error); }
    });
    return pendingSave;
  }
  function renderStyle() {
    const style = STYLE_URLS[app.mcOverlayStyle] ? app.mcOverlayStyle : 'carousel';
    pane.querySelectorAll('[data-mc-style]').forEach(button => {
      const active = button.dataset.mcStyle === style;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const url = STYLE_URLS[style];
    pane.querySelector('#mc-config-url').textContent = url;
    if (frame.dataset.style !== style) { frame.src = url; frame.dataset.style = style; }
  }
  function renderSettings() {
    for (const [key, id, suffix] of [['mcOverlayScale', 'mc-scale-value', '%'], ['mcOverlaySpeed', 'mc-speed-value', ' s'], ['mcOverlayFontSize', 'mc-font-value', ' px'], ['mcOverlayOpacity', 'mc-opacity-value', '%']]) {
      pane.querySelector(`[data-mc-setting="${key}"]`).value = app[key];
      pane.querySelector(`#${id}`).textContent = `${app[key]}${suffix}`;
    }
  }
  function row(kind, item, index) {
    const gift = kind === 'gift';
    const name = gift ? item.name : TYPE_NAMES[item.type];
    const icon = gift ? `<img src="${escapeHtml(giftUrl(item.icon_file, item.name, item.coins))}" alt="" loading="lazy">` : `<span class="mc-config-event-icon">${TYPE_ICONS[item.type] || '⚡'}</span>`;
    const subtitle = gift ? `🎁 Regalo · ${item.coins} monedas` : item.type === 'likes_user' || item.type === 'likes_total' ? `${item.threshold} likes` : item.type === 'comment' ? `Coincide con «${item.matchText || 'sin texto'}»` : 'Evento de TikTok';
    const label = gift ? item.action_label || item.overlayLabel || item.name : item.label || name;
    return `<article class="mc-config-event" data-kind="${kind}" data-index="${index}"><div class="mc-event-trigger">${icon}<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(subtitle)}</span></div></div><div class="mc-event-action"><strong>${escapeHtml(label)}</strong><code>${escapeHtml(item.command || 'Sin comando RCON')}</code></div><div class="mc-event-audio">${item.audioName || item.soundName ? `♫ ${escapeHtml(item.audioName || item.soundName)}` : '<span>Sin sonido</span>'}</div><label class="mc-config-enabled" title="Activar o desactivar"><input type="checkbox" data-field="enabled" ${item.enabled !== false ? 'checked' : ''}><span class="sr-only">Activar ${escapeHtml(name)}</span></label><button type="button" class="mc-test-button" data-action="test" title="Probar comando en Minecraft">▶ Probar</button><button type="button" class="mc-edit-button" data-action="edit">Editar <span aria-hidden="true">›</span></button></article>`;
  }
  function renderList() {
    const gifts = giftRegistry.getAll();
    listEl.innerHTML = gifts.map((item, i) => row('gift', item, i)).join('') + app.mcEventRules.map((item, i) => row('rule', item, i)).join('');
    if (!listEl.innerHTML) listEl.innerHTML = '<p class="mc-empty">Aún no hay eventos. Añade el primero arriba.</p>';
    pane.querySelector('#mc-event-count').textContent = gifts.length + app.mcEventRules.length;
  }
  window.__renderMinecraftWorkspace = renderList;
  function renderGiftPicker() {
    const grid = pane.querySelector('#mc-gift-grid');
    const gifts = buscarGifts({ q: pane.querySelector('#mc-gift-search').value }).slice(0, 120);
    grid.innerHTML = gifts.map((gift, i) => `<button type="button" data-gift-index="${i}" title="${escapeHtml(gift.nombre)} · ${gift.coins} monedas"><img src="${escapeHtml(giftUrl(gift.archivo, gift.nombre, gift.coins))}" alt=""><span>${escapeHtml(gift.nombre)}</span><small>${gift.coins} 💎</small></button>`).join('') || '<p>No se encontraron regalos.</p>';
    grid._results = gifts;
  }
  function renderImagePicker() {
    const query = pane.querySelector('#mc-image-search').value.trim().toLocaleLowerCase();
    const matches = S2E_MC_ACTION_ICONS.filter(icon => icon.name.toLocaleLowerCase().includes(query));
    const grid = pane.querySelector('#mc-image-grid');
    grid.innerHTML = matches.map((icon, index) => `<button type="button" data-image-index="${index}" title="${escapeHtml(icon.name)}"><img src="${escapeHtml(icon.url)}" alt="" loading="lazy"><span>${escapeHtml(icon.name)}</span></button>`).join('') || '<p>No se encontraron imágenes.</p>';
    grid._results = matches;
  }
  function openEditor(kind, index, isNew = false) {
    editor = { kind, index, isNew, giftChoice: null, soundName: '', soundUrl: '' };
    const item = selected();
    if (!item) return;
    dialog.hidden = false;
    const gift = kind === 'gift';
    pane.querySelector('#mc-dialog-title').textContent = isNew ? 'Añadir evento' : 'Editar evento';
    pane.querySelector('#mc-editor-type').textContent = gift ? item.name : TYPE_NAMES[item.type];
    pane.querySelector('#mc-editor-subtitle').textContent = gift ? `${item.coins} monedas · Regalo de TikTok` : 'Disparador de TikTok';
    pane.querySelector('#mc-editor-icon').innerHTML = gift ? `<img src="${escapeHtml(giftUrl(item.icon_file, item.name, item.coins))}" alt="">` : TYPE_ICONS[item.type] || '⚡';
    pane.querySelector('#mc-gift-picker').hidden = !gift;
    pane.querySelector('#mc-editor-threshold-wrap').hidden = gift || !item.type.startsWith('likes');
    pane.querySelector('#mc-editor-comment-wrap').hidden = gift || item.type !== 'comment';
    pane.querySelector('#mc-editor-mult-wrap').hidden = !gift;
    pane.querySelector('#mc-editor-totem-wrap').hidden = !gift;
    pane.querySelector('#mc-editor-repetition-wrap').hidden = !gift;
    pane.querySelector('#mc-editor-image-wrap').hidden = false;
    for (const field of dialog.querySelectorAll('[data-editor-field]')) {
      const key = field.dataset.editorField;
      field.value = key === 'label' && gift ? (item.action_label || item.overlayLabel || '') : key === 'imageUrl' && gift ? (item.action_image || '') : (item[key] ?? '');
    }
    editor.soundName = gift ? item.audioName || '' : item.soundName || '';
    editor.soundUrl = gift ? item.audioUrl || '' : item.soundUrl || '';
    pane.querySelector('#mc-editor-sound-name').textContent = editor.soundName || 'Sin sonido seleccionado';
    if (gift) { pane.querySelector('#mc-gift-search').value = ''; renderGiftPicker(); }
    dialog.querySelector('[data-editor-field="label"]').focus();
  }
  function closeEditor() { dialog.hidden = true; editor = null; }
  function discardNew() {
    if (!editor?.isNew) return;
    if (editor.kind === 'gift') giftRegistry.setAll(giftRegistry.getAll().filter((_, i) => i !== editor.index));
    else app.mcEventRules.splice(editor.index, 1);
    renderList();
  }
  pane.addEventListener('click', async event => {
    const imageAction = event.target.closest('[data-image-action]')?.dataset.imageAction;
    if (imageAction) {
      if (imageAction === 'clear') pane.querySelector('[data-editor-field="imageUrl"]').value = '';
      imageDialog.hidden = true;
      return;
    }
    const imageChoice = event.target.closest('[data-image-index]');
    if (imageChoice && editor) {
      const icon = pane.querySelector('#mc-image-grid')._results[Number(imageChoice.dataset.imageIndex)];
      pane.querySelector('[data-editor-field="imageUrl"]').value = icon.url;
      imageDialog.hidden = true;
      return;
    }
    const styleButton = event.target.closest('[data-mc-style]');
    if (styleButton) { app.mcOverlayStyle = styleButton.dataset.mcStyle; renderStyle(); await save(); return; }
    if (event.target.closest('#mc-copy-url')) { await navigator.clipboard.writeText(STYLE_URLS[app.mcOverlayStyle] || STYLE_URLS.carousel); showToast(`URL del overlay ${STYLE_NAMES[app.mcOverlayStyle] || 'Carrusel'} copiada`); return; }
    if (event.target.closest('#mc-save-all')) { await save(); return; }
    if (event.target.closest('#mc-add-event')) {
      const type = pane.querySelector('#mc-new-event-type').value;
      if (type === 'gift') {
        const gifts = giftRegistry.getAll();
        gifts.push({ id: `gift_${Date.now()}`, name: 'Rose', coins: 1, icon_file: 'rose-1-coins.webp', tiktokGiftId: 5655, enabled: true, command: '', action_label: '', mult: '', audioName: '', audioUrl: '' });
        giftRegistry.setAll(gifts);
        openEditor('gift', gifts.length - 1, true);
      } else { app.mcEventRules.push(normalizeMinecraftRule({ type, label: TYPE_NAMES[type] })); openEditor('rule', app.mcEventRules.length - 1, true); }
      return;
    }
    const giftButton = event.target.closest('[data-gift-index]');
    if (giftButton && editor?.kind === 'gift') {
      const gift = pane.querySelector('#mc-gift-grid')._results[Number(giftButton.dataset.giftIndex)];
      editor.giftChoice = gift;
      pane.querySelectorAll('[data-gift-index]').forEach(el => el.classList.toggle('selected', el === giftButton));
      pane.querySelector('#mc-editor-type').textContent = gift.nombre;
      pane.querySelector('#mc-editor-subtitle').textContent = `${gift.coins} monedas · Regalo de TikTok`;
      pane.querySelector('#mc-editor-icon').innerHTML = `<img src="${escapeHtml(giftUrl(gift.archivo, gift.nombre, gift.coins))}" alt="">`;
      return;
    }
    const dialogAction = event.target.closest('[data-dialog]')?.dataset.dialog;
    if (dialogAction && editor) {
      if (dialogAction === 'close') { discardNew(); closeEditor(); return; }
      if (dialogAction === 'image') {
        imageDialog.hidden = false;
        pane.querySelector('#mc-image-search').value = '';
        renderImagePicker();
        pane.querySelector('#mc-image-search').focus();
        return;
      }
      if (dialogAction === 'sound') {
        openS2EAudioModal(editor.soundName ? { name: editor.soundName, url: editor.soundUrl } : null, chosen => {
          if (!editor) return;
          editor.soundName = chosen?.name || ''; editor.soundUrl = chosen?.url || '';
          pane.querySelector('#mc-editor-sound-name').textContent = editor.soundName || 'Sin sonido seleccionado';
        }); return;
      }
      if (dialogAction === 'clear-sound') { editor.soundName = ''; editor.soundUrl = ''; pane.querySelector('#mc-editor-sound-name').textContent = 'Sin sonido seleccionado'; return; }
      if (dialogAction === 'delete') {
        if (editor.kind === 'gift') giftRegistry.setAll(giftRegistry.getAll().filter((_, i) => i !== editor.index));
        else app.mcEventRules.splice(editor.index, 1);
        closeEditor(); renderList(); await save(); return;
      }
      if (dialogAction === 'save') {
        const item = selected();
        for (const field of dialog.querySelectorAll('[data-editor-field]')) {
          const key = field.dataset.editorField;
          if (field.closest('[hidden]')) continue;
          const value = key === 'threshold' || key === 'repetition' ? Math.max(1, Number(field.value) || 1) : key === 'totemDelta' ? Number(field.value) || 0 : field.value.trim();
          const savedKey = editor.kind === 'gift' ? (key === 'label' ? 'action_label' : key === 'imageUrl' ? 'action_image' : key) : key;
          item[savedKey] = value;
        }
        if (editor.kind === 'gift') {
          if (editor.giftChoice) Object.assign(item, { name: editor.giftChoice.nombre, coins: editor.giftChoice.coins, icon_file: limpiarArchivoGift(editor.giftChoice.archivo), tiktokGiftId: editor.giftChoice.id || tiktokGiftIdDeNombre(editor.giftChoice.nombre, 5655) });
          item.audioName = editor.soundName; item.audioUrl = editor.soundUrl;
          giftRegistry.setAll(giftRegistry.getAll());
        } else { item.soundName = editor.soundName; item.soundUrl = editor.soundUrl; }
        closeEditor(); renderList(); await save(); return;
      }
    }
    const rowEl = event.target.closest('.mc-config-event');
    if (rowEl && event.target.closest('[data-action="test"]')) {
      const kind = rowEl.dataset.kind;
      const index = Number(rowEl.dataset.index);
      const item = kind === 'gift' ? giftRegistry.getAll()[index] : app.mcEventRules[index];
      const cmdRaw = (item?.command || '').trim();
      if (!cmdRaw) {
        showToast('⚠️ Este evento no tiene comandos configurados.');
        return;
      }

      // 1. Reproducción de audio configurado
      const audioUrl = item.audioUrl || item.soundUrl || '';
      const audioName = item.audioName || item.soundName || '';
      try {
        if (audioUrl) {
          soundManager.playUrl(audioUrl);
        } else if (audioName) {
          soundManager.playSound(audioName);
        } else if (kind === 'gift' && item.name) {
          soundManager.playForGift(item.name, item.coins || 1);
        }
      } catch (sndErr) {
        console.warn('[MC TEST SOUND]', sndErr);
      }

      // 2. Asegurar credenciales RCON
      const currentRcon = store.getState().rconConfig || {};
      if (!currentRcon.password) {
        const passFromDom = document.getElementById('rcon-pass-input')?.value?.trim();
        const fallbackPass = passFromDom || 'sseOr_24rlJfFpnh8oTqOUbu';
        store.setRconConfig({ password: fallbackPass });
      }

      const playerNick = localStorage.getItem('galactk_mc_player') || 'cj7_tutoriales';
      const lines = cmdRaw.split('\n').map(l => l.trim()).filter(Boolean);
      showToast(`⚡ Probando ${item.name || item.label || 'evento'} (${lines.length} comando${lines.length > 1 ? 's' : ''})...`);
      
      let sentCount = 0;
      let lastErr = null;
      for (const line of lines) {
        let clean = line
          .replace(/{jugador}|{player}|{target}|{nickname}/gi, playerNick)
          .replace(/{donador}|{donor}|{user}/gi, 'Tester')
          .trim();
        if (clean.startsWith('/')) clean = clean.slice(1);
        try {
          await rconBridge.sendCommand(clean);
          sentCount++;
        } catch (err) {
          console.warn('[MC TEST RCON]', err);
          lastErr = err.message || err;
        }
      }

      if (lastErr) {
        showToast(`⚠️ RCON: ${lastErr}`);
      } else {
        showToast(`✔ ${sentCount} comando(s) RCON y audio ejecutados`);
      }
      return;
    }
    if (rowEl && event.target.closest('[data-action="edit"]')) openEditor(rowEl.dataset.kind, Number(rowEl.dataset.index));
  });
  pane.addEventListener('change', async event => {
    const slider = event.target.closest('[data-mc-setting]');
    if (slider) { app[slider.dataset.mcSetting] = Number(slider.value); renderSettings(); await save(); return; }
    const field = event.target.closest('.mc-config-event [data-field="enabled"]');
    const rowEl = event.target.closest('.mc-config-event');
    if (!field || !rowEl) return;
    const item = rowEl.dataset.kind === 'gift' ? giftRegistry.getAll()[Number(rowEl.dataset.index)] : app.mcEventRules[Number(rowEl.dataset.index)];
    item.enabled = field.checked;
    if (rowEl.dataset.kind === 'gift') giftRegistry.setAll(giftRegistry.getAll());
    await save();
  });
  pane.addEventListener('input', event => {
    if (event.target.id === 'mc-gift-search') { renderGiftPicker(); return; }
    if (event.target.id === 'mc-image-search') { renderImagePicker(); return; }
    const slider = event.target.closest('[data-mc-setting]');
    if (!slider) return;
    app[slider.dataset.mcSetting] = Number(slider.value);
    renderSettings(); app.syncMcOverlayToBackend();
  });
  dialog.addEventListener('click', event => { if (event.target === dialog && editor) { discardNew(); closeEditor(); } });
  imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.hidden = true; });
  pane.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !editor) return;
    if (!imageDialog.hidden) { imageDialog.hidden = true; return; }
    if (!dialog.hidden) { discardNew(); closeEditor(); }
  });
  renderStyle(); renderSettings(); renderList();
  return { render: renderList };
}
