import { app } from './core/app-controller.js';
import { soundManager, renderWaveformSvg } from './sounds.js';
import { S2E_PUBLIC_AUDIOS, S2E_ALERT_VIDEOS, S2E_MC_ACTION_ICONS } from './s2e-catalog.js';
import { CATALOGO_GIFTS, archivoDeGift, buscarGifts, coinsDeGift, giftsEquivalentes, tiktokGiftIdDeNombre } from './gifts.js';
import { ttsEngine } from './tts.js';

let currentAudioModalCallback = null;
let currentAudioModalState = {
  tab: 'public',
  selectedAudio: null,
  playerType: 'priority',
  priority: 5,
  multiplier: false,
  volume: 100,
  search: '',
  tag: 'all',
  sortBy: 'name_asc'
};
let previewAudioInstance = null;

let editingPresetEventRef = null;
let activeAlertTriggerId = null;
let liveChromaRaf = null;
let liveChromaAutoKey = null;

function notifyToast(msg) {
  const el = document.getElementById('galactic-toast');
  const txt = document.getElementById('galactic-toast-text');
  if (el && txt) {
    txt.textContent = msg;
    el.style.display = 'flex';
    clearTimeout(window.__s2eToastTimer);
    window.__s2eToastTimer = setTimeout(() => {
      el.style.display = 'none';
    }, 2800);
  }
}

function resolveGiftImgPath(iconFileOrUrl) {
  if (!iconFileOrUrl) return './gifts/rose-1-coins.webp';
  if (iconFileOrUrl === 'LIKE_HEART' || iconFileOrUrl === 'FOLLOW_ICON' || iconFileOrUrl === 'SHARE_ICON') {
    return iconFileOrUrl;
  }
  if (iconFileOrUrl.startsWith('http') || iconFileOrUrl.startsWith('data:') || iconFileOrUrl.startsWith('./')) {
    return iconFileOrUrl;
  }
  const clean = iconFileOrUrl.replace(/^\/+/, '').replace(/^gifts\//, '');
  return `./gifts/${clean}`;
}

export function initS2EStudio() {
  if (document.getElementById('s2e-presets-studio-card')) return;

  injectNavTab();
  injectAlertasChromaTabPane();
  injectAudioSelectorModal();
  injectMcActionEditorModal();
  enhanceSoundboardWithS2E();

  renderS2EPresetsStudio();
  renderAlertasChromaStudio();
}

function injectNavTab() {
  const nav = document.getElementById('main-nav-tabs');
  if (!nav || document.querySelector('[data-tab="tab-alertas"]')) return;

  const soundsTabBtn = nav.querySelector('[data-tab="tab-sounds"]');
  const alertBtn = document.createElement('button');
  alertBtn.type = 'button';
  alertBtn.className = 'nav-tab-btn';
  alertBtn.setAttribute('data-tab', 'tab-alertas');
  alertBtn.innerHTML = '🎬 Alertas & Croma';

  if (soundsTabBtn && soundsTabBtn.nextSibling) {
    nav.insertBefore(alertBtn, soundsTabBtn.nextSibling);
  } else {
    nav.appendChild(alertBtn);
  }

  alertBtn.addEventListener('click', () => {
    document.querySelectorAll('#main-nav-tabs .nav-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    alertBtn.classList.add('active');
    const pane = document.getElementById('tab-alertas');
    if (pane) pane.classList.add('active');
    renderAlertasChromaStudio();
  });
}

function injectMinecraftPreajustesSection() {
  const mcSection = document.getElementById('tab-minecraft');
  if (!mcSection) return;

  const wrapper = document.createElement('div');
  wrapper.id = 's2e-presets-studio-card';
  wrapper.className = 'section-card';
  wrapper.style.marginBottom = '18px';
  wrapper.style.background = 'linear-gradient(180deg, rgba(16, 20, 28, 0.98), rgba(10, 14, 20, 0.99))';
  wrapper.style.border = '1.5px solid rgba(59, 130, 246, 0.45)';

  wrapper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="background:#1668dc;color:#fff;font-weight:900;font-size:11px;padding:4px 10px;border-radius:6px;letter-spacing:0.5px;">
          STREAM TO EARN STUDIO
        </span>
        <span class="panel-title" style="font-size:16px;">
          ⛏️ Vista Previa del Overlay &amp; Mis Preajustes de Minecraft (Con Catálogo de 258 Audios Divertidos)
        </span>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--neon-cyan);background:#02060d;padding:6px 12px;border-radius:8px;border:1px solid rgba(0,240,255,0.3);">
          http://localhost:4000/mc_overlay.html?style=s2e
        </div>
        <button type="button" class="btn-primary" id="btn-copy-s2e-overlay-url" style="padding:7px 12px;font-size:12px;">
          📋 Copiar URL Tira S2E
        </button>
        <button type="button" class="btn-secondary" id="btn-activate-s2e-strip-style" style="padding:7px 12px;font-size:12px;">
          🎯 Usar Tira S2E en OBS
        </button>
      </div>
    </div>

    <!-- BARRA EN VIVO DE AJUSTES DEL OVERLAY (TAMAÑO, VELOCIDAD, TEXTO, TRANSPARENCIA) -->
    <div class="mc-overlay-live-controls-bar" style="background:rgba(14, 20, 32, 0.85);border:1.5px solid rgba(0, 240, 255, 0.28);border-radius:12px;padding:12px 16px;margin-bottom:14px;box-shadow:0 8px 24px rgba(0,0,0,0.5);">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">🎛️</span>
          <strong style="color:#fff;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;">Personalización en Vivo del Overlay (OBS)</strong>
          <span style="font-size:11px;color:#38bdf8;background:rgba(56,189,248,0.12);padding:2px 8px;border-radius:99px;border:1px solid rgba(56,189,248,0.3);">Cambios en Caliente</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" class="btn-primary" id="btn-sync-live-overlay-now" style="padding:6px 14px;font-size:11.5px;background:#0284c7;display:inline-flex;align-items:center;gap:6px;">
            🔄 Sincronizar OBS Ahora
          </button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:14px;align-items:center;">
        <!-- Slider 1: Escala / Tamaño General -->
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <label style="font-size:11px;font-weight:700;color:#94a3b8;">🔍 Tamaño / Escala</label>
            <span id="label-mc-overlay-scale" style="font-family:var(--font-mono);font-size:11px;color:#38bdf8;font-weight:800;">100%</span>
          </div>
          <input type="range" id="slider-mc-overlay-scale" min="60" max="160" value="100" step="5" style="width:100%;accent-color:#0284c7;cursor:pointer;" />
        </div>

        <!-- Slider 2: Velocidad de Rotación -->
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <label style="font-size:11px;font-weight:700;color:#94a3b8;">⚡ Velocidad Carrusel</label>
            <span id="label-mc-overlay-speed" style="font-family:var(--font-mono);font-size:11px;color:#fbbf24;font-weight:800;">28s</span>
          </div>
          <input type="range" id="slider-mc-overlay-speed" min="10" max="60" value="28" step="2" style="width:100%;accent-color:#fbbf24;cursor:pointer;" />
        </div>

        <!-- Slider 3: Tamaño de Fuente / Texto -->
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <label style="font-size:11px;font-weight:700;color:#94a3b8;">🔤 Tamaño Texto</label>
            <span id="label-mc-overlay-font-size" style="font-family:var(--font-mono);font-size:11px;color:#10b981;font-weight:800;">11.5px</span>
          </div>
          <input type="range" id="slider-mc-overlay-font-size" min="9" max="17" value="11.5" step="0.5" style="width:100%;accent-color:#10b981;cursor:pointer;" />
        </div>

        <!-- Slider 4: Fondo 100% Transparente vs Vidrio -->
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <label style="font-size:11px;font-weight:700;color:#94a3b8;">✨ Fondo Transparente</label>
            <span id="label-mc-overlay-opacity" style="font-family:var(--font-mono);font-size:11px;color:#f43f5e;font-weight:800;">72% (Vidrio)</span>
          </div>
          <input type="range" id="slider-mc-overlay-opacity" min="0" max="100" value="72" step="5" style="width:100%;accent-color:#f43f5e;cursor:pointer;" />
        </div>
      </div>
    </div>

    <!-- Tira blanca/limpia idéntica a Stream To Earn con 1x, 10x, 32x, 500x + Mob + Regalo -->
    <div class="s2e-strip-preview" id="s2e-mc-strip-preview" title="Haz clic en cualquier columna para probar la acción y su sonido divertido"></div>

    <!-- Cabecera Mis preajustes + Botón Nuevo preajuste -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-size:16px;font-weight:800;color:#f3f4f6;">Mis preajustes</span>
      <div style="display:flex;gap:8px;">
        <button type="button" class="s2e-btn-select-audio" id="btn-s2e-new-preset" style="display:inline-flex;align-items:center;gap:6px;">
          ➕ Nuevo preajuste
        </button>
      </div>
    </div>

    <!-- Pastillas de selección de Preajuste (Survival gz7, Survival, etc.) -->
    <div class="s2e-presets-bar" id="s2e-preset-pills-bar"></div>

    <!-- Barra de control del Preajuste Activo (Checkbox, Nombre, Play delay, Detener eventos, Añadir evento) -->
    <div class="s2e-presets-bar" style="background:#14161a;">
      <div style="display:flex;align-items:center;gap:12px;">
        <input type="checkbox" id="s2e-active-preset-check" checked style="width:18px;height:18px;accent-color:#1668dc;cursor:pointer;" />
        <span style="font-size:20px;">🧊</span>
        <strong id="s2e-active-preset-title" style="font-size:17px;color:#fff;">Survival gz7</strong>
        <span id="s2e-active-preset-count-badge" style="font-family:var(--font-mono);font-size:11px;color:#10b981;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.35);padding:3px 9px;border-radius:99px;">
          24 / ∞ Eventos Activos (Sin Límite)
        </span>
      </div>

      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <button type="button" class="btn-primary" id="btn-s2e-activate-to-overlay" style="padding:7px 15px;font-size:12px;font-weight:800;background:linear-gradient(135deg, #10b981, #059669);box-shadow:0 0 14px rgba(16,185,129,0.45);border:none;cursor:pointer;">
          🎯 Activar en Overlay (OBS)
        </button>
        <label style="font-size:12px;color:#9ca3af;">Play delay</label>
        <select id="s2e-play-delay-select" class="table-select" style="background:#1f242d;color:#fff;padding:6px 10px;border-radius:8px;">
          <option value="Off">Off</option>
          <option value="0.5">0.5s</option>
          <option value="1">1s</option>
          <option value="2">2s</option>
          <option value="5">5s</option>
        </select>

        <button type="button" class="s2e-btn-select-audio" id="btn-s2e-stop-events" style="background:#1d4ed8;">
          🔄 Detener eventos
        </button>
        <button type="button" class="s2e-btn-select-audio" id="btn-s2e-add-event">
          ➕ Añadir evento al preajuste
        </button>
        <button type="button" class="btn-secondary" id="btn-s2e-rename-preset" style="padding:6px 12px;font-size:12px;">
          ✏️ Renombrar
        </button>
      </div>
    </div>

    <!-- Lista de Eventos del Preajuste (Con Regalo/Likes, Mob Minecraft, Audio + Waveform y Botón Play) -->
    <div class="s2e-event-list" id="s2e-preset-events-list"></div>
  `;

  const firstCard = mcSection.querySelector('.section-card');
  if (firstCard && firstCard.nextSibling) {
    mcSection.insertBefore(wrapper, firstCard.nextSibling);
  } else {
    mcSection.appendChild(wrapper);
  }

  // Listeners de controles en vivo del overlay (OBS)
  const sliderScale = document.getElementById('slider-mc-overlay-scale');
  const labelScale = document.getElementById('label-mc-overlay-scale');
  sliderScale?.addEventListener('input', async e => {
    const val = Number(e.target.value) || 100;
    if (labelScale) labelScale.textContent = `${val}%`;
    app.mcOverlayScale = val;
    await app.syncMcOverlayToBackend();
  });

  const sliderSpeed = document.getElementById('slider-mc-overlay-speed');
  const labelSpeed = document.getElementById('label-mc-overlay-speed');
  sliderSpeed?.addEventListener('input', async e => {
    const val = Number(e.target.value) || 28;
    if (labelSpeed) labelSpeed.textContent = `${val}s`;
    app.mcOverlaySpeed = val;
    await app.syncMcOverlayToBackend();
  });

  const sliderFontSize = document.getElementById('slider-mc-overlay-font-size');
  const labelFontSize = document.getElementById('label-mc-overlay-font-size');
  sliderFontSize?.addEventListener('input', async e => {
    const val = Number(e.target.value) || 11.5;
    if (labelFontSize) labelFontSize.textContent = `${val}px`;
    app.mcOverlayFontSize = val;
    await app.syncMcOverlayToBackend();
  });

  const sliderOpacity = document.getElementById('slider-mc-overlay-opacity');
  const labelOpacity = document.getElementById('label-mc-overlay-opacity');
  sliderOpacity?.addEventListener('input', async e => {
    const val = Number(e.target.value);
    if (labelOpacity) labelOpacity.textContent = val === 0 ? '0% (100% Transparente)' : `${val}% (Vidrio)`;
    app.mcOverlayOpacity = val;
    await app.syncMcOverlayToBackend();
  });

  document.getElementById('btn-sync-live-overlay-now')?.addEventListener('click', async () => {
    await app.syncMcOverlayToBackend();
    await app.persistConfig();
    notifyToast('🔄 Overlay de OBS sincronizado en vivo (escala, velocidad, texto y transparencia)');
  });

  document.getElementById('btn-copy-s2e-overlay-url')?.addEventListener('click', () => {
    const url = 'http://localhost:4000/mc_overlay.html?style=s2e';
    navigator.clipboard.writeText(url);
    notifyToast(`📋 Copiada URL de Tira S2E: ${url}`);
  });

  document.getElementById('btn-activate-s2e-strip-style')?.addEventListener('click', async () => {
    app.mcOverlayStyle = 's2e';
    await app.persistConfig();
    notifyToast('🎯 Estilo Tira StreamToEarn (1x/10x/500x) activado en tu Overlay de Minecraft');
  });

  document.getElementById('btn-s2e-activate-to-overlay')?.addEventListener('click', async () => {
    await app.activatePreset(app.activeS2EPresetId);
    notifyToast(`🎯 ¡Preajuste "${app.getActiveS2EPreset()?.name}" activado y transmitiendo al Overlay de OBS!`);
  });

  document.getElementById('s2e-active-preset-check')?.addEventListener('change', async e => {
    const p = app.getActiveS2EPreset();
    if (p) {
      p.active = e.target.checked;
      await app.syncMcOverlayToBackend();
      await app.persistConfig();
      notifyToast(p.active ? `✔ Preajuste "${p.name}" activado en Overlay` : `⏸ Preajuste "${p.name}" pausado`);
    }
  });

  document.getElementById('s2e-play-delay-select')?.addEventListener('change', async e => {
    const p = app.getActiveS2EPreset();
    if (p) {
      p.playDelay = e.target.value;
      await app.persistConfig();
      notifyToast(`⏱ Play delay ajustado a: ${p.playDelay}`);
    }
  });

  document.getElementById('btn-s2e-stop-events')?.addEventListener('click', () => {
    soundManager.stopAll();
    notifyToast('⏹ Todos los sonidos y eventos en cola detenidos');
  });

  document.getElementById('btn-s2e-new-preset')?.addEventListener('click', async () => {
    const name = prompt('Nombre del nuevo preajuste de Minecraft:', `Survival Custom ${app.s2ePresets.length + 1}`);
    if (!name || !name.trim()) return;
    const basePreset = app.getActiveS2EPreset();
    const clonedEvents = basePreset ? JSON.parse(JSON.stringify(basePreset.events.slice(0, 8))) : [];
    const newPreset = {
      id: 'preset_' + Date.now(),
      name: name.trim(),
      isUser: true,
      game: 'Minecraft',
      playDelay: 'Off',
      active: true,
      events: clonedEvents
    };
    app.s2ePresets.unshift(newPreset);
    await app.activatePreset(newPreset.id);
    notifyToast(`✔ Nuevo preajuste "${newPreset.name}" creado y activado en Overlay`);
  });

  document.getElementById('btn-s2e-rename-preset')?.addEventListener('click', async () => {
    const p = app.getActiveS2EPreset();
    if (!p) return;
    const newName = prompt('Nuevo nombre para el preajuste:', p.name);
    if (newName && newName.trim()) {
      p.name = newName.trim();
      renderS2EPresetsStudio();
      await app.persistConfig();
      notifyToast(`✔ Preajuste renombrado a "${p.name}"`);
    }
  });

  document.getElementById('btn-s2e-add-event')?.addEventListener('click', async () => {
    const p = app.getActiveS2EPreset();
    if (!p) return;
    const newEv = {
      id: 'ev_' + Date.now(),
      active: true,
      trigger: {
        action: 'SelectedGift',
        value: '',
        giftId: 5655,
        giftName: 'Rose',
        coins: 1,
        iconUrl: './gifts/rose-1-coins.webp'
      },
      func: {
        name: 'Zombie Raid',
        repetition: 5,
        imageUrl: 'http://localhost:4000/s2e_media/images/public/Minecraft/1730216866942_creeper-charged.png',
        commands: ['/execute at {playername} run summon zombie ~ ~ ~']
      },
      audio: {
        name: 'crack_the_whip.mp3',
        path: '/audio/public/1708877462401_crack_the_whip.mp3',
        url: 'http://localhost:4000/s2e_media/audio/public/1708877462401_crack_the_whip.mp3',
        volume: 100,
        playerType: 'priority',
        priority: 5,
        multiplier: false,
        peaks: ''
      }
    };
    p.events.unshift(newEv);
    renderS2EPresetsStudio();
    await app.syncMcOverlayToBackend();
    await app.persistConfig();
    notifyToast('➕ Nuevo evento añadido y sincronizado con el Overlay');
  });
}

export function renderS2EPresetsStudio() {
  const stripEl = document.getElementById('s2e-mc-strip-preview');
  const pillsBar = document.getElementById('s2e-preset-pills-bar');
  const eventsList = document.getElementById('s2e-preset-events-list');
  const presetTitle = document.getElementById('s2e-active-preset-title');
  const presetCheck = document.getElementById('s2e-active-preset-check');
  const delaySelect = document.getElementById('s2e-play-delay-select');
  const countBadge = document.getElementById('s2e-active-preset-count-badge');

  if (!stripEl || !pillsBar || !eventsList) return;

  const activePreset = app.getActiveS2EPreset();
  if (!activePreset) return;

  if (presetTitle) presetTitle.textContent = activePreset.name;
  if (presetCheck) presetCheck.checked = activePreset.active !== false;
  if (delaySelect) delaySelect.value = activePreset.playDelay || 'Off';
  if (countBadge) {
    const activeCount = (activePreset.events || []).filter(e => e.active !== false).length;
    countBadge.textContent = `${activeCount} / ∞ Eventos Activos (Sin Límite)`;
  }

  // Sincronizar valores de sliders de personalización en vivo
  const sliderScale = document.getElementById('slider-mc-overlay-scale');
  const labelScale = document.getElementById('label-mc-overlay-scale');
  if (sliderScale && app.mcOverlayScale) {
    sliderScale.value = app.mcOverlayScale;
    if (labelScale) labelScale.textContent = `${app.mcOverlayScale}%`;
  }

  const sliderSpeed = document.getElementById('slider-mc-overlay-speed');
  const labelSpeed = document.getElementById('label-mc-overlay-speed');
  if (sliderSpeed && app.mcOverlaySpeed) {
    sliderSpeed.value = app.mcOverlaySpeed;
    if (labelSpeed) labelSpeed.textContent = `${app.mcOverlaySpeed}s`;
  }

  const sliderFontSize = document.getElementById('slider-mc-overlay-font-size');
  const labelFontSize = document.getElementById('label-mc-overlay-font-size');
  if (sliderFontSize && app.mcOverlayFontSize) {
    sliderFontSize.value = app.mcOverlayFontSize;
    if (labelFontSize) labelFontSize.textContent = `${app.mcOverlayFontSize}px`;
  }

  const sliderOpacity = document.getElementById('slider-mc-overlay-opacity');
  const labelOpacity = document.getElementById('label-mc-overlay-opacity');
  if (sliderOpacity && app.mcOverlayOpacity !== undefined) {
    sliderOpacity.value = app.mcOverlayOpacity;
    if (labelOpacity) labelOpacity.textContent = Number(app.mcOverlayOpacity) === 0 ? '0% (100% Transparente)' : `${app.mcOverlayOpacity}% (Vidrio)`;
  }

  // 1. Renderizar pastillas de Preajustes
  pillsBar.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;">` +
    app.s2ePresets.map(p => `
      <button type="button" class="s2e-preset-pill ${p.id === activePreset.id ? 'active' : ''}" data-pid="${p.id}">
        <span>🧊</span>
        <span>${p.name}</span>
        <span style="opacity:0.75;font-size:11px;">(${(p.events || []).length})</span>
      </button>
    `).join('') +
    `</div>`;

  pillsBar.querySelectorAll('.s2e-preset-pill').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = btn.getAttribute('data-pid');
      await app.activatePreset(pid);
      notifyToast(`🎯 Preajuste cargado y sincronizado con el Overlay: ${app.getActiveS2EPreset()?.name}`);
    });
  });

  // 2. Renderizar Tira Visual de Acciones de Minecraft
  const stripEvents = (activePreset.events || []).filter(e => e.active !== false).slice(0, 12);
  stripEl.innerHTML = stripEvents.map((ev, idx) => {
    const rep = Number(ev.func?.repetition) || 1;
    const mcImg = ev.func?.imageUrl || 'http://localhost:4000/s2e_media/images/public/Minecraft/1730216866942_creeper-charged.png';
    const act = ev.trigger?.action || 'SelectedGift';
    let trigHtml = '';
    if (act === 'LikeForEach' || act === 'Like') {
      trigHtml = `<div class="s2e-strip-heart">❤️ ${ev.trigger?.value || 200}</div>`;
    } else if (act === 'Follow') {
      trigHtml = `<div class="s2e-strip-heart" style="background:#2563eb;">➕ Follow</div>`;
    } else {
      const fallbackFile = archivoDeGift(ev.trigger?.giftName, ev.trigger?.coins) || 'rose-1-coins.webp';
      const gUrl = (ev.trigger?.iconUrl && ev.trigger.iconUrl.startsWith('http'))
        ? ev.trigger.iconUrl
        : resolveGiftImgPath(fallbackFile);
      trigHtml = `<img src="${gUrl}" class="s2e-strip-trig-img" onerror="this.src='./gifts/rose-1-coins.webp'" />`;
    }

    return `
      <div class="s2e-strip-col" data-strip-idx="${idx}" title="Click para probar: ${ev.func?.name || 'Acción'} (${ev.audio?.name || 'Sin audio'})">
        <div class="s2e-strip-mult">${rep}x</div>
        <img src="${mcImg}" class="s2e-strip-mc-img" onerror="this.src='./gifts/rose-1-coins.webp'" />
        ${trigHtml}
      </div>
    `;
  }).join('');

  stripEl.querySelectorAll('.s2e-strip-col').forEach(col => {
    col.addEventListener('click', () => {
      const ev = stripEvents[Number(col.getAttribute('data-strip-idx'))];
      if (ev) {
        app.executeS2EPresetEvent(ev, 'GZ7_Tester', 1);
        notifyToast(`▶ Probando acción: ${ev.func?.name} + Audio: ${ev.audio?.name || 'ninguno'}`);
      }
    });
  });

  // 3. Renderizar Lista de Eventos del Preajuste (Diseño Espacioso Apple Glass / Galactic)
  eventsList.innerHTML = (activePreset.events || []).map((ev, idx) => {
    const act = ev.trigger?.action || 'SelectedGift';
    const rep = Number(ev.func?.repetition) || 1;
    const mcImg = ev.func?.imageUrl || 'http://localhost:4000/s2e_media/images/public/Minecraft/1730216866942_creeper-charged.png';
    const audName = ev.audio?.name || 'Sin audio';
    const waveformSvg = renderWaveformSvg(ev.audio?.peaks || '', audName, 40, 24);
    const mainCmd = (ev.func?.commands && ev.func.commands[0]) || '';

    // Clasificación Clara de Rol (Héroe Salvación vs Ataque Destructivo)
    const isHero = /kit|totem|escudo|aliado|apple/i.test(mainCmd + ' ' + (ev.func?.name || ''));
    const badgeTypeHtml = isHero
      ? `<span class="s2e-type-badge hero">🛡️ SALVACIÓN</span>`
      : `<span class="s2e-type-badge attack">⚔️ ATAQUE</span>`;

    let trigIconHtml = '';
    let trigTitle = ev.trigger?.giftName || 'Regalo';
    let trigSub = '';

    if (act === 'LikeForEach' || act === 'Like') {
      trigIconHtml = `<div class="s2e-trig-icon-box heart">❤️</div>`;
      trigTitle = `${ev.trigger?.value || 50} Likes`;
      trigSub = `<span class="s2e-coin-pill likes">META LIKES</span>`;
    } else if (act === 'Follow') {
      trigIconHtml = `<div class="s2e-trig-icon-box follow">🐺</div>`;
      trigTitle = 'Seguidor';
      trigSub = `<span class="s2e-coin-pill follow">FOLLOW</span>`;
    } else {
      const fallbackFile = archivoDeGift(ev.trigger?.giftName, ev.trigger?.coins) || 'rose-1-coins.webp';
      const gUrl = (ev.trigger?.iconUrl && ev.trigger.iconUrl.startsWith('http'))
        ? ev.trigger.iconUrl
        : resolveGiftImgPath(fallbackFile);
      trigIconHtml = `<div class="s2e-trig-icon-box"><img src="${gUrl}" onerror="this.src='./gifts/rose-1-coins.webp'" /></div>`;
      const coins = ev.trigger?.coins || 1;
      trigSub = `<span class="s2e-coin-pill coins">🪙 ${coins} ${coins === 1 ? 'Moneda' : 'Monedas'}</span>`;
    }

    return `
      <div class="s2e-event-row ${ev.active === false ? 'disabled' : ''}" data-ev-idx="${idx}">
        <!-- Columna 1: Disparador TikTok (Regalo / Likes) -->
        <div class="s2e-col-trigger" data-edit-trig="${idx}" title="Haz clic para cambiar el Regalo o Disparador de TikTok">
          ${trigIconHtml}
          <div class="s2e-meta-box">
            <span class="s2e-sub-label">DISPARADOR TIKTOK</span>
            <strong class="s2e-main-title">${trigTitle}</strong>
            <div>${trigSub}</div>
          </div>
        </div>

        <!-- Columna 2: Acción Minecraft & Comando RCON Visible -->
        <div class="s2e-col-action" data-edit-fn="${idx}" title="Haz clic para editar la acción de Minecraft, ícono o comando RCON">
          <div class="s2e-mob-icon-box">
            <img src="${mcImg}" onerror="this.src='./gifts/rose-1-coins.webp'" />
            ${rep > 1 ? `<span class="s2e-mult-pill">x${rep}</span>` : ''}
          </div>
          <div class="s2e-action-meta">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
              ${badgeTypeHtml}
              <strong class="s2e-action-name">${ev.func?.name || 'Acción'}</strong>
            </div>
            <div class="s2e-rcon-pill" title="Comando RCON a ejecutar en PaperMC">
              <code>${mainCmd || '/execute ...'}</code>
            </div>
          </div>
        </div>

        <!-- Columna 3: Audio Divertido + Forma de Onda -->
        <div class="s2e-col-audio" data-pick-audio="${idx}" title="Haz clic para abrir el catálogo de 258 sonidos de Stream To Earn">
          <div class="s2e-audio-meta">
            <span class="s2e-audio-name">🔊 ${audName}</span>
            <span class="s2e-audio-vol">Vol: ${ev.audio?.volume ?? 100}% &bull; ${ev.audio?.playerType || 'Prioridad'}</span>
          </div>
          <div class="s2e-waveform-box">${waveformSvg}</div>
        </div>

        <!-- Columna 4: Controles de Fila (Switch, Test Play, Edit, Delete) -->
        <div class="s2e-col-controls">
          <label class="s2e-switch" title="Activar / Desactivar este evento">
            <input type="checkbox" class="s2e-ev-active-check" data-idx="${idx}" ${ev.active !== false ? 'checked' : ''} />
            <span class="s2e-slider"></span>
          </label>
          <button type="button" class="s2e-btn-icon play btn-s2e-test-ev" data-idx="${idx}" title="Probar RCON y Audio en Vivo" style="width:auto;padding:6px 10px;font-size:11px;font-weight:700;background:rgba(255,179,0,0.18);border:1px solid rgba(255,179,0,0.6);color:#ffde73;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            ▶ Probar
          </button>
          <button type="button" class="s2e-btn-icon edit" data-edit-fn="${idx}" title="Editar evento completo">
            ✏️
          </button>
          <button type="button" class="s2e-btn-icon delete btn-s2e-del-ev" data-idx="${idx}" title="Eliminar fila">
            ✕
          </button>
        </div>
      </div>
    `;
  }).join('');

  eventsList.querySelectorAll('[data-pick-audio]').forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = Number(cell.getAttribute('data-pick-audio'));
      const ev = activePreset.events[idx];
      if (!ev) return;
      openS2EAudioModal(ev.audio, async selectedAudioConfig => {
        ev.audio = selectedAudioConfig;
        if (ev.trigger?.action === 'SelectedGift' && ev.trigger?.giftName) {
          soundManager.assignSoundToGift(
            ev.trigger.giftName,
            selectedAudioConfig ? (selectedAudioConfig.name || selectedAudioConfig.id) : ''
          );
        }
        renderS2EPresetsStudio();
        await app.persistConfig();
        notifyToast(selectedAudioConfig ? `🔊 Audio "${selectedAudioConfig.name}" asignado a ${ev.func?.name}` : '🔇 Audio deseleccionado');
      });
    });
  });

  eventsList.querySelectorAll('[data-edit-fn]').forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = Number(cell.getAttribute('data-edit-fn'));
      const ev = activePreset.events[idx];
      if (ev) openMcActionEditorModal(ev);
    });
  });

  eventsList.querySelectorAll('[data-edit-trig]').forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = Number(cell.getAttribute('data-edit-trig'));
      const ev = activePreset.events[idx];
      if (ev) openMcActionEditorModal(ev, true);
    });
  });

  eventsList.querySelectorAll('.s2e-ev-active-check').forEach(chk => {
    chk.addEventListener('change', async () => {
      const idx = Number(chk.getAttribute('data-idx'));
      const ev = activePreset.events[idx];
      if (ev) {
        ev.active = chk.checked;
        renderS2EPresetsStudio();
        await app.persistConfig();
      }
    });
  });

  eventsList.querySelectorAll('.btn-s2e-test-ev').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-idx'));
      const ev = activePreset.events[idx];
      if (ev) {
        app.executeS2EPresetEvent(ev, 'GZ7_Tester', 1);
        notifyToast(`▶ Ejecutando: ${ev.func?.name} (${ev.audio?.name || 'sin audio'})`);
      }
    });
  });

  eventsList.querySelectorAll('.btn-s2e-del-ev').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = Number(btn.getAttribute('data-idx'));
      activePreset.events.splice(idx, 1);
      renderS2EPresetsStudio();
      await app.syncMcOverlayToBackend();
      await app.persistConfig();
      notifyToast('🗑 Evento eliminado del preajuste y overlay');
    });
  });
}

// =========================================================================
// MODAL SELECCIONAR AUDIO (RÉPLICA 1:1 DE CAPTURA 2 CON 258 AUDIOS S2E)
// =========================================================================
function injectAudioSelectorModal() {
  if (document.getElementById('modal-s2e-audio')) return;

  const allTagsMap = new Map();
  S2E_PUBLIC_AUDIOS.forEach(a => {
    (a.tags || []).forEach(t => {
      allTagsMap.set(t, (allTagsMap.get(t) || 0) + 1);
    });
  });
  const sortedTags = [...allTagsMap.entries()].sort((a, b) => b[1] - a[1]);

  const modal = document.createElement('div');
  modal.id = 'modal-s2e-audio';
  modal.className = 'modal-overlay';
  modal.style.display = 'none';
  modal.style.zIndex = '10000';

  modal.innerHTML = `
    <div class="s2e-audio-modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="font-size:20px;font-weight:800;color:#fff;margin:0;">Seleccionar audio</h2>
        <button type="button" id="btn-close-s2e-audio-modal" class="btn-secondary" style="padding:4px 10px;font-size:16px;">✕</button>
      </div>

      <!-- Pestañas Público Audio / Mis Nube Audio -->
      <div style="display:flex;justify-content:space-between;align-items:center;background:#111214;padding:6px;border-radius:12px;">
        <div style="display:flex;gap:8px;">
          <button type="button" class="s2e-preset-pill active" id="tab-btn-public-audio">
            Público Audio (${S2E_PUBLIC_AUDIOS.length})
          </button>
          <button type="button" class="s2e-preset-pill" id="tab-btn-custom-audio">
            Mis Nube Audio / Subidos
          </button>
        </div>

        <label class="s2e-btn-select-audio" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
          📂 Subir MP3/WAV Propio
          <input type="file" id="s2e-upload-audio-input" accept="audio/*" style="display:none;" />
        </label>
      </div>

      <!-- Selected audio box -->
      <div class="s2e-selected-audio-box">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <button type="button" class="s2e-play-btn" id="btn-s2e-play-selected" style="width:42px;height:42px;border-radius:10px;">
              ▶
            </button>
            <div>
              <div style="font-size:12px;color:#93c5fd;">Selected audio</div>
              <div id="s2e-selected-audio-name" style="font-size:16px;font-weight:800;color:#fff;">crack_the_whip.mp3</div>
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            <button type="button" id="btn-s2e-deselect-audio" style="background:rgba(239,68,68,0.12);color:#fca5a5;border:1px solid rgba(239,68,68,0.35);padding:7px 14px;border-radius:8px;cursor:pointer;font-weight:700;">
              🔇 Deseleccionar
            </button>
            <button type="button" id="btn-s2e-confirm-audio" class="s2e-btn-select-audio" style="background:#10b981;padding:7px 16px;">
              ✔ Aplicar Audio
            </button>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-mono);font-size:11px;color:#cbd5e1;">0:00</span>
          <div id="s2e-selected-audio-waveform" style="flex:1;"></div>
          <span id="s2e-selected-audio-dur" style="font-family:var(--font-mono);font-size:11px;color:#cbd5e1;">0:01</span>
        </div>
      </div>

      <!-- Playback settings -->
      <div class="s2e-playback-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <strong style="font-size:14px;color:#fff;">🎚️ Playback settings</strong>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:#cbd5e1;">
            <input type="checkbox" id="s2e-audio-multiplier-check" style="width:16px;height:16px;accent-color:#1668dc;" />
            <span>Multiplicador</span>
          </label>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:20px;align-items:center;">
          <div>
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">Tipo de reproductor</div>
            <div style="display:flex;gap:8px;">
              <select id="s2e-audio-player-type" class="table-select" style="flex:1;background:#141518;color:#fff;padding:8px 10px;border-radius:8px;">
                <option value="priority">! Prioridad</option>
                <option value="once">1️⃣ Una vez (Once)</option>
                <option value="overlap">🔊 Superponer (Overlap)</option>
              </select>
              <input type="number" id="s2e-audio-priority-input" value="5" min="1" max="10" class="input-field" style="width:68px;text-align:center;font-weight:800;background:#141518;" />
            </div>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#9ca3af;margin-bottom:6px;">
              <span>Volumen de este disparador</span>
              <strong id="s2e-audio-vol-label" style="color:#60a5fa;">100%</strong>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:16px;">🔊</span>
              <input type="range" id="s2e-audio-vol-slider" min="5" max="100" value="100" style="flex:1;accent-color:#3b82f6;cursor:pointer;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de búsqueda, Tag (All tags 258) y Sort by -->
      <div style="display:grid;grid-template-columns:1.4fr 1fr 0.9fr;gap:10px;align-items:center;">
        <input type="text" id="s2e-audio-search-input" class="input-field" placeholder="🔍 Buscar sonido (ej. countdown, sponge-bob, laser, angel, tnt, scream)..." style="background:#141518;" />
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:12px;color:#9ca3af;">Tag</span>
          <select id="s2e-audio-tag-select" class="table-select" style="flex:1;background:#141518;color:#fff;padding:8px;">
            <option value="all">All tags (${S2E_PUBLIC_AUDIOS.length})</option>
            ${sortedTags.map(([t, c]) => `<option value="${t}">${t} (${c})</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:12px;color:#9ca3af;">Sort by</span>
          <select id="s2e-audio-sort-select" class="table-select" style="flex:1;background:#141518;color:#fff;padding:8px;">
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="dur_asc">Duración (Cortos)</option>
            <option value="dur_desc">Duración (Largos)</option>
            <option value="pop">Más Populares</option>
          </select>
        </div>
      </div>

      <!-- Lista con scroll de los 258 sonidos con botón Play, Seleccionar, Nombre, Onda y Duración -->
      <div class="s2e-audio-list-scroll" id="s2e-audio-catalog-list"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    if (previewAudioInstance) {
      try { previewAudioInstance.pause(); } catch (e) {}
      previewAudioInstance = null;
    }
    modal.style.display = 'none';
  };

  document.getElementById('btn-close-s2e-audio-modal')?.addEventListener('click', closeModal);

  document.getElementById('tab-btn-public-audio')?.addEventListener('click', () => {
    currentAudioModalState.tab = 'public';
    document.getElementById('tab-btn-public-audio').classList.add('active');
    document.getElementById('tab-btn-custom-audio').classList.remove('active');
    renderAudioModalCatalogList();
  });

  document.getElementById('tab-btn-custom-audio')?.addEventListener('click', () => {
    currentAudioModalState.tab = 'custom';
    document.getElementById('tab-btn-custom-audio').classList.add('active');
    document.getElementById('tab-btn-public-audio').classList.remove('active');
    renderAudioModalCatalogList();
  });

  document.getElementById('s2e-upload-audio-input')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = String(reader.result);
      let finalUrl = base64Data;
      try {
        const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
        if (invoke) {
          finalUrl = await invoke('save_uploaded_media', {
            filename: file.name,
            base64_data: base64Data
          });
        }
      } catch (err) {}

      const added = soundManager.addOrUpdateSound({
        name: file.name,
        category: 'memes',
        durationType: 'corto',
        url: finalUrl
      });
      currentAudioModalState.selectedAudio = {
        name: added.name,
        url: added.url,
        path: added.url,
        peaks: '',
        durationFormatted: '00:03.000'
      };
      updateSelectedAudioBoxUI();
      renderAudioModalCatalogList();
      notifyToast(`📂 Audio propio subido y seleccionado: ${file.name}`);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('btn-s2e-play-selected')?.addEventListener('click', () => {
    const sel = currentAudioModalState.selectedAudio;
    if (!sel) return;
    playPreviewInModal(sel.url, sel.id || sel.name);
  });

  document.getElementById('btn-s2e-deselect-audio')?.addEventListener('click', () => {
    currentAudioModalState.selectedAudio = null;
    updateSelectedAudioBoxUI();
    if (currentAudioModalCallback) {
      currentAudioModalCallback(null);
    }
    closeModal();
  });

  document.getElementById('btn-s2e-confirm-audio')?.addEventListener('click', () => {
    applyAndCloseAudioModal();
  });

  document.getElementById('s2e-audio-vol-slider')?.addEventListener('input', e => {
    currentAudioModalState.volume = Number(e.target.value) || 100;
    document.getElementById('s2e-audio-vol-label').textContent = `${currentAudioModalState.volume}%`;
  });

  document.getElementById('s2e-audio-player-type')?.addEventListener('change', e => {
    currentAudioModalState.playerType = e.target.value;
  });

  document.getElementById('s2e-audio-priority-input')?.addEventListener('change', e => {
    currentAudioModalState.priority = Number(e.target.value) || 5;
  });

  document.getElementById('s2e-audio-multiplier-check')?.addEventListener('change', e => {
    currentAudioModalState.multiplier = e.target.checked;
  });

  document.getElementById('s2e-audio-search-input')?.addEventListener('input', e => {
    currentAudioModalState.search = e.target.value;
    renderAudioModalCatalogList();
  });

  document.getElementById('s2e-audio-tag-select')?.addEventListener('change', e => {
    currentAudioModalState.tag = e.target.value;
    renderAudioModalCatalogList();
  });

  document.getElementById('s2e-audio-sort-select')?.addEventListener('change', e => {
    currentAudioModalState.sortBy = e.target.value;
    renderAudioModalCatalogList();
  });
}

function playPreviewInModal(url, soundId = '') {
  if (previewAudioInstance) {
    try {
      previewAudioInstance.pause();
      previewAudioInstance.currentTime = 0;
    } catch (e) {}
    previewAudioInstance = null;
  }
  if (!url && soundId) {
    soundManager.playSound(soundId, currentAudioModalState.volume || 100);
    return;
  }
  if (!url) return;
  try {
    previewAudioInstance = new Audio(url);
    previewAudioInstance.volume = Math.max(0.05, Math.min(1, (currentAudioModalState.volume || 100) / 100));
    previewAudioInstance.play().catch(() => {
      if (soundId) soundManager.playSound(soundId, currentAudioModalState.volume || 100);
    });
  } catch (e) {
    if (soundId) soundManager.playSound(soundId, currentAudioModalState.volume || 100);
  }
}

function applyAndCloseAudioModal() {
  const modal = document.getElementById('modal-s2e-audio');
  if (previewAudioInstance) {
    try { previewAudioInstance.pause(); } catch (e) {}
    previewAudioInstance = null;
  }
  if (currentAudioModalCallback) {
    const sel = currentAudioModalState.selectedAudio;
    if (!sel) {
      currentAudioModalCallback(null);
    } else {
      currentAudioModalCallback({
        id: sel.id || sel.name,
        name: sel.name,
        path: sel.path || sel.url || sel.id || '',
        url: sel.url || '',
        peaks: sel.peaks || '',
        volume: Number(document.getElementById('s2e-audio-vol-slider')?.value) || 100,
        playerType: document.getElementById('s2e-audio-player-type')?.value || 'priority',
        priority: Number(document.getElementById('s2e-audio-priority-input')?.value) || 5,
        multiplier: Boolean(document.getElementById('s2e-audio-multiplier-check')?.checked)
      });
    }
  }
  if (modal) modal.style.display = 'none';
}

function updateSelectedAudioBoxUI() {
  const sel = currentAudioModalState.selectedAudio;
  const nameEl = document.getElementById('s2e-selected-audio-name');
  const waveEl = document.getElementById('s2e-selected-audio-waveform');
  const durEl = document.getElementById('s2e-selected-audio-dur');

  if (!sel) {
    if (nameEl) nameEl.textContent = 'Ningún audio seleccionado';
    if (waveEl) waveEl.innerHTML = renderWaveformSvg('', 'empty', 60, 28);
    if (durEl) durEl.textContent = '0:00';
    return;
  }

  if (nameEl) nameEl.textContent = sel.name;
  if (waveEl) waveEl.innerHTML = renderWaveformSvg(sel.peaks || '', sel.name, 62, 28);
  const secs = Math.max(1, Math.round(Number(sel.duration) || 2));
  if (durEl) durEl.textContent = `0:${String(secs).padStart(2, '0')}`;
}

function renderAudioModalCatalogList() {
  const listEl = document.getElementById('s2e-audio-catalog-list');
  if (!listEl) return;

  let items = currentAudioModalState.tab === 'custom'
    ? soundManager.getCustomSounds()
    : [...soundManager.getSynthSounds(), ...S2E_PUBLIC_AUDIOS];

  const q = (currentAudioModalState.search || '').trim().toLowerCase();
  if (q) {
    items = items.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  if (currentAudioModalState.tag && currentAudioModalState.tag !== 'all') {
    items = items.filter(a => (a.tags || []).includes(currentAudioModalState.tag));
  }

  const sort = currentAudioModalState.sortBy;
  if (sort === 'name_asc') items.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'name_desc') items.sort((a, b) => b.name.localeCompare(a.name));
  else if (sort === 'dur_asc') items.sort((a, b) => (a.duration || 0) - (b.duration || 0));
  else if (sort === 'dur_desc') items.sort((a, b) => (b.duration || 0) - (a.duration || 0));
  else if (sort === 'pop') items.sort((a, b) => (b.selectionCount || 0) - (a.selectionCount || 0));

  if (items.length === 0) {
    listEl.innerHTML = `<div style="padding:28px;text-align:center;color:#9ca3af;">No se encontraron audios con ese filtro. Puedes subir cualquier archivo MP3/WAV con el botón superior.</div>`;
    return;
  }

  listEl.innerHTML = items.map((item, idx) => {
    const isSel = currentAudioModalState.selectedAudio?.name === item.name || currentAudioModalState.selectedAudio?.id === item.id;
    const wave = renderWaveformSvg(item.peaks || '', item.name, 34, 22);
    return `
      <div class="s2e-audio-row" style="${isSel ? 'background:rgba(37,99,235,0.18);' : ''}">
        <button type="button" class="s2e-play-btn btn-row-preview-audio" data-idx="${idx}" style="width:36px;height:32px;background:#1e293b;border:1px solid #3b82f6;">
          ▶
        </button>
        <button type="button" class="s2e-btn-select-audio btn-row-pick-audio" data-idx="${idx}">
          ${isSel ? '✔ Elegido' : 'Seleccionar'}
        </button>
        <div style="font-size:13px;font-weight:600;color:#f3f4f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${item.name}">
          ${item.name}
        </div>
        <div>${wave}</div>
        <div style="font-family:var(--font-mono);font-size:11px;color:#9ca3af;text-align:right;">
          ${item.durationFormatted || '00:02.000'}
        </div>
      </div>
    `;
  }).join('');

  listEl.querySelectorAll('.btn-row-preview-audio').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = items[Number(btn.getAttribute('data-idx'))];
      if (item) playPreviewInModal(item.url, item.id || item.name);
    });
  });

  listEl.querySelectorAll('.btn-row-pick-audio').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = items[Number(btn.getAttribute('data-idx'))];
      if (!item) return;
      currentAudioModalState.selectedAudio = item;
      updateSelectedAudioBoxUI();
      playPreviewInModal(item.url, item.id || item.name);
      applyAndCloseAudioModal();
    });
  });
}

export function openS2EAudioModal(initialAudioObj = null, onSelectCallback = null) {
  currentAudioModalCallback = onSelectCallback;
  const fallback = S2E_PUBLIC_AUDIOS.find(a => a.name === 'crack_the_whip.mp3') || S2E_PUBLIC_AUDIOS[0];
  if (initialAudioObj && (initialAudioObj.name || initialAudioObj.url || initialAudioObj.id)) {
    const ref = initialAudioObj.name || initialAudioObj.url || initialAudioObj.id;
    const matched = soundManager.resolveSound(ref) || S2E_PUBLIC_AUDIOS.find(a => a.name === ref || a.url === ref) || initialAudioObj;
    currentAudioModalState.selectedAudio = {
      ...matched,
      id: matched.id || initialAudioObj.id || initialAudioObj.name,
      name: matched.name || initialAudioObj.name,
      url: initialAudioObj.url || matched.url || '',
      peaks: initialAudioObj.peaks || matched.peaks || ''
    };
    currentAudioModalState.volume = initialAudioObj.volume ?? 100;
    currentAudioModalState.playerType = initialAudioObj.playerType || 'priority';
    currentAudioModalState.priority = initialAudioObj.priority ?? 5;
    currentAudioModalState.multiplier = Boolean(initialAudioObj.multiplier);
  } else {
    currentAudioModalState.selectedAudio = fallback;
    currentAudioModalState.volume = 100;
    currentAudioModalState.playerType = 'priority';
    currentAudioModalState.priority = 5;
    currentAudioModalState.multiplier = false;
  }

  document.getElementById('s2e-audio-vol-slider').value = currentAudioModalState.volume;
  document.getElementById('s2e-audio-vol-label').textContent = `${currentAudioModalState.volume}%`;
  document.getElementById('s2e-audio-player-type').value = currentAudioModalState.playerType;
  document.getElementById('s2e-audio-priority-input').value = currentAudioModalState.priority;
  document.getElementById('s2e-audio-multiplier-check').checked = currentAudioModalState.multiplier;

  updateSelectedAudioBoxUI();
  renderAudioModalCatalogList();

  const modal = document.getElementById('modal-s2e-audio');
  if (modal) modal.style.display = 'flex';
}

// =========================================================================
// MODAL DE EDICIÓN DE ACCIÓN MINECRAFT Y DISPARADOR PARA PREAJUSTES S2E
// =========================================================================
function injectMcActionEditorModal() {
  if (document.getElementById('modal-s2e-fn')) return;

  const modal = document.createElement('div');
  modal.id = 'modal-s2e-fn';
  modal.className = 'modal-overlay';
  modal.style.display = 'none';
  modal.style.zIndex = '9999';

  modal.innerHTML = `
    <div class="modal-card" style="max-width:760px;">
      <div class="panel-header" style="border-bottom:1px solid var(--border-subtle);padding-bottom:10px;margin-bottom:12px;">
        <span class="panel-title">⛏️ Configurar Evento y Acción de Minecraft del Preajuste</span>
        <button type="button" id="btn-close-s2e-fn-modal" class="btn-secondary" style="padding:4px 10px;">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px;">
        <div>
          <label style="font-size:12px;color:var(--text-muted);">Tipo de Disparador TikTok</label>
          <select id="s2e-fn-trig-type" class="table-select" style="width:100%;margin-top:4px;padding:8px;">
            <option value="SelectedGift">🎁 Regalo de TikTok</option>
            <option value="LikeForEach">❤️ Cada X Me gusta (Likes)</option>
            <option value="Follow">➕ Nuevo Seguidor (Follow)</option>
          </select>
        </div>
        <div>
          <label style="font-size:12px;color:var(--text-muted);">Regalo (o Cantidad de Likes)</label>
          <input type="text" id="s2e-fn-trig-gift" list="gz7-s2e-gifts-datalist" class="input-field" placeholder="Rose / Rosa, GG, Dona, Galaxia o 200" style="width:100%;margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px;color:var(--text-muted);">Monedas / Diamantes</label>
          <input type="number" id="s2e-fn-trig-coins" class="input-field" value="1" min="1" style="width:100%;margin-top:4px;" />
        </div>
      </div>

      <!-- BOTONERA DE 1 CLIC PARA SELECCIÓN RÁPIDA DE REGALOS -->
      <div style="margin-bottom:12px;">
        <label style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:6px;display:block;">⚡ Regalos Populares (1 Clic para Seleccionar)</label>
        <div id="s2e-quick-gifts-grid" style="display:flex;flex-wrap:wrap;gap:6px;max-height:105px;overflow-y:auto;padding:6px;background:rgba(0,0,0,0.35);border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
          <button type="button" class="s2e-quick-gift-pill" data-gname="Rosa" data-gcoins="1" data-gicon="rose-1-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/rose-1-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Rosa <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="GG" data-gcoins="1" data-gicon="gg-1-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/gg-1-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> GG <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Maracas" data-gcoins="1" data-gicon="maracas-1-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/maracas-1-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Maracas <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Ice Cream Cone" data-gcoins="1" data-gicon="ice-cream-cone-1-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/ice-cream-cone-1-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Helado <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Heart Me" data-gcoins="1" data-gicon="heart-me-1-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/heart-me-1-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Heart Me <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="TikTok" data-gcoins="1" data-gicon="tiktok-1-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/tiktok-1-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> TikTok <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Cute Cat" data-gcoins="5" data-gicon="cute-cat-5-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/cute-cat-5-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Gato <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">5🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Finger Heart" data-gcoins="5" data-gicon="finger-heart-5-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/finger-heart-5-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Finger Heart <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">5🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Mic" data-gcoins="5" data-gicon="mic-5-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/mic-5-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Mic <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">5🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Fireball" data-gcoins="5" data-gicon="fireball-5-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/fireball-5-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Fireball <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">5🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Rosa" data-gcoins="10" data-gicon="rosa-10-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/rosa-10-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Rosa 10 <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">10🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Balloons" data-gcoins="10" data-gicon="balloons-10-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/balloons-10-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Globos <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">10🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Perfume" data-gcoins="15" data-gicon="perfume-15-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/perfume-15-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Perfume <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">15🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Doughnut" data-gcoins="30" data-gicon="doughnut-30-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/doughnut-30-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Dona <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">30🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Capybara" data-gcoins="30" data-gicon="capybara-30-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/capybara-30-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Capibara <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">30🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Paper Crane" data-gcoins="99" data-gicon="paper-crane-99-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/paper-crane-99-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Grulla <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">99🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Cap" data-gcoins="99" data-gicon="cap-99-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/cap-99-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Gorra <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">99🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Game Controller" data-gcoins="100" data-gicon="game-controller-100-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/game-controller-100-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Mando <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">100🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Sun Crown" data-gcoins="199" data-gicon="sun-crown-199-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/sun-crown-199-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Corona Sol <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">199🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Hearts" data-gcoins="199" data-gicon="hearts-199-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/hearts-199-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Corazones <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">199🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Panda Climb" data-gcoins="199" data-gicon="panda-climb-199-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/panda-climb-199-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Panda <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">199🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Boxing Gloves" data-gcoins="299" data-gicon="boxing-gloves-299-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/boxing-gloves-299-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Guantes <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">299🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Money Gun" data-gcoins="500" data-gicon="money-gun-500-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/money-gun-500-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Money Gun <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">500🪙</span>
          </button>
          <button type="button" class="s2e-quick-gift-pill" data-gname="Galaxy" data-gcoins="1000" data-gicon="galaxy-1000-coins.webp" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:3px 8px;cursor:pointer;color:#e2e8f0;font-size:11px;">
            <img src="./gifts/galaxy-1000-coins.webp" style="width:18px;height:18px;object-fit:contain;" /> Galaxia <span style="color:#fbbf24;font-family:var(--font-mono);font-size:10px;">1000🪙</span>
          </button>
        </div>
      </div>

      <datalist id="gz7-s2e-gifts-datalist">
        <option value="Rose">Rosa / Rose (1 💎)</option>
        <option value="GG">GG (1 💎)</option>
        <option value="Heart Me">Me gusta / Heart Me (1 💎)</option>
        <option value="Finger Heart">Corazón con dedos / Finger Heart (5 💎)</option>
        <option value="Rosa">Rosa (10 💎)</option>
        <option value="Doughnut">Dona / Doughnut (30 💎)</option>
        <option value="Capybara">Capibara / Capybara (30 💎)</option>
        <option value="Ice Cream Cone">Helado / Ice Cream Cone (1 💎)</option>
        <option value="Paper Crane">Grulla / Paper Crane (99 💎)</option>
        <option value="Little Crown">Coronita / Little Crown (99 💎)</option>
        <option value="Cap">Gorra / Cap (99 💎)</option>
        <option value="Hat and Mustache">Sombrero y bigote (99 💎)</option>
        <option value="Game Controller">Control / Game Controller (100 💎)</option>
        <option value="Hand Hearts">Manos corazón / Hand Hearts (100 💎)</option>
        <option value="Money Gun">Pistola de billetes / Money Gun (500 💎)</option>
        <option value="Galaxy">Galaxia / Galaxy (1000 💎)</option>
        <option value="Fireworks">Fuegos artificiales / Fireworks (1088 💎)</option>
        <option value="Treasure Chest">Cofre del tesoro / Treasure Chest (1500 💎)</option>
        <option value="Whale Diving">Ballena / Whale Diving (2150 💎)</option>
        <option value="Falcon">Halcón / Falcon (10999 💎)</option>
        <option value="Lion">León / Lion (29999 💎)</option>
        <option value="TikTok Universe">Universo TikTok (44999 💎)</option>
        ${CATALOGO_GIFTS.slice(0, 600).map(g => `<option value="${g.nombre}">${g.nombre} (${g.coins} 💎)</option>`).join('')}
      </datalist>

      <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:12px;">
        <div>
          <label style="font-size:12px;color:var(--text-muted);">Nombre de la Función / Mob en Pantalla</label>
          <input type="text" id="s2e-fn-name" class="input-field" placeholder="ej. kabom kaboom, DOG, TNT, Dragon" style="width:100%;margin-top:4px;" />
        </div>
        <div>
          <label style="font-size:12px;color:var(--text-muted);">Multiplicador (1x, 10x, 32x, 500x)</label>
          <input type="number" id="s2e-fn-rep" class="input-field" value="1" min="1" max="1000" style="width:100%;margin-top:4px;" />
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:12px;color:var(--text-muted);">Comando(s) RCON de Minecraft (1 por línea, usa {playername} y {nickname})</label>
        <textarea id="s2e-fn-commands" class="input-field" rows="3" style="width:100%;margin-top:4px;font-family:var(--font-mono);font-size:12px;"></textarea>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:12px;color:var(--text-muted);">Ícono Oficial de Minecraft (Haz clic para elegir)</label>
        <div id="s2e-fn-icons-grid" class="modal-picker-grid" style="max-height:170px;margin-top:6px;"></div>
      </div>

      <div style="display:flex;gap:10px;">
        <button type="button" class="btn-primary" id="btn-save-s2e-fn" style="flex:2;padding:11px;">
          💾 Guardar Cambios en el Preajuste
        </button>
        <button type="button" class="btn-secondary" id="btn-cancel-s2e-fn" style="flex:1;">
          Cancelar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll('.s2e-quick-gift-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const gname = btn.getAttribute('data-gname');
      const gcoins = btn.getAttribute('data-gcoins');
      const gicon = btn.getAttribute('data-gicon');
      document.getElementById('s2e-fn-trig-type').value = 'SelectedGift';
      document.getElementById('s2e-fn-trig-gift').value = gname;
      document.getElementById('s2e-fn-trig-coins').value = gcoins;
      modal.dataset.selectedGiftIcon = gicon;
      modal.querySelectorAll('.s2e-quick-gift-pill').forEach(b => {
        b.style.borderColor = b === btn ? '#38bdf8' : 'rgba(255,255,255,0.1)';
        b.style.background = b === btn ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)';
      });
      notifyToast(`🎁 Regalo "${gname}" (${gcoins} 🪙) seleccionado`);
    });
  });

  document.getElementById('s2e-fn-trig-gift')?.addEventListener('change', e => {
    const val = String(e.target.value || '').trim();
    if (!val || document.getElementById('s2e-fn-trig-type')?.value !== 'SelectedGift') return;
    const matches = buscarGifts({ q: val });
    if (matches.length > 0) {
      document.getElementById('s2e-fn-trig-coins').value = matches[0].coins;
    } else {
      document.getElementById('s2e-fn-trig-coins').value = coinsDeGift(val);
    }
  });

  const iconsGrid = document.getElementById('s2e-fn-icons-grid');
  if (iconsGrid) {
    iconsGrid.innerHTML = S2E_MC_ACTION_ICONS.map(ic => `
      <div class="modal-picker-card s2e-mc-icon-card" data-url="${ic.url}">
        <img src="${ic.url}" class="modal-picker-img" loading="lazy" />
        <div class="modal-picker-name">${ic.name}</div>
      </div>
    `).join('');

    iconsGrid.querySelectorAll('.s2e-mc-icon-card').forEach(card => {
      card.addEventListener('click', () => {
        iconsGrid.querySelectorAll('.s2e-mc-icon-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        modal.dataset.selectedMcImg = card.getAttribute('data-url');
      });
    });
  }

  document.getElementById('btn-close-s2e-fn-modal')?.addEventListener('click', () => { modal.style.display = 'none'; });
  document.getElementById('btn-cancel-s2e-fn')?.addEventListener('click', () => { modal.style.display = 'none'; });

  document.getElementById('btn-save-s2e-fn')?.addEventListener('click', async () => {
    if (!editingPresetEventRef) return;
    const trigType = document.getElementById('s2e-fn-trig-type').value;
    const trigGiftOrVal = document.getElementById('s2e-fn-trig-gift').value.trim() || 'Rose';
    const trigCoins = Number(document.getElementById('s2e-fn-trig-coins').value) || 1;
    const fnName = document.getElementById('s2e-fn-name').value.trim() || 'Acción';
    const fnRep = Math.max(1, Number(document.getElementById('s2e-fn-rep').value) || 1);
    const cmds = document.getElementById('s2e-fn-commands').value.split('\n').map(s => s.trim()).filter(Boolean);

    editingPresetEventRef.trigger.action = trigType;
    if (trigType === 'LikeForEach') {
      editingPresetEventRef.trigger.value = String(parseInt(trigGiftOrVal, 10) || 200);
      editingPresetEventRef.trigger.giftName = `${editingPresetEventRef.trigger.value} Me gusta`;
      editingPresetEventRef.trigger.iconUrl = 'LIKE_HEART';
    } else if (trigType === 'Follow') {
      editingPresetEventRef.trigger.giftName = 'Seguir';
      editingPresetEventRef.trigger.iconUrl = 'FOLLOW_ICON';
    } else {
      const foundList = buscarGifts({ q: trigGiftOrVal });
      const foundGift = CATALOGO_GIFTS.find(g => g.nombre.toLowerCase() === trigGiftOrVal.toLowerCase()) || foundList[0];
      editingPresetEventRef.trigger.giftName = foundGift ? foundGift.nombre : trigGiftOrVal;
      editingPresetEventRef.trigger.giftId = foundGift?.id || tiktokGiftIdDeNombre(editingPresetEventRef.trigger.giftName, 0);
      if (modal.dataset.selectedGiftIcon) {
        editingPresetEventRef.trigger.iconUrl = resolveGiftImgPath(modal.dataset.selectedGiftIcon);
      } else {
        editingPresetEventRef.trigger.iconUrl = resolveGiftImgPath(foundGift ? foundGift.archivo : archivoDeGift(trigGiftOrVal, trigCoins));
      }
    }

    editingPresetEventRef.func.name = fnName;
    editingPresetEventRef.func.repetition = fnRep;
    editingPresetEventRef.func.commands = cmds.length ? cmds : ['/execute at {playername} run summon zombie ~ ~ ~'];
    if (modal.dataset.selectedMcImg) {
      editingPresetEventRef.func.imageUrl = modal.dataset.selectedMcImg;
    }

    modal.style.display = 'none';
    renderS2EPresetsStudio();
    await app.persistConfig();
    notifyToast(`✔ Evento "${fnName}" actualizado en el preajuste`);
  });
}

function openMcActionEditorModal(ev) {
  editingPresetEventRef = ev;
  const modal = document.getElementById('modal-s2e-fn');
  if (!modal) return;

  modal.dataset.selectedGiftIcon = '';
  modal.querySelectorAll('.s2e-quick-gift-pill').forEach(b => {
    b.style.borderColor = 'rgba(255,255,255,0.1)';
    b.style.background = 'rgba(255,255,255,0.05)';
  });

  document.getElementById('s2e-fn-trig-type').value = ev.trigger?.action || 'SelectedGift';
  document.getElementById('s2e-fn-trig-gift').value = ev.trigger?.action === 'LikeForEach' ? (ev.trigger?.value || '200') : (ev.trigger?.giftName || 'Rose');
  document.getElementById('s2e-fn-trig-coins').value = ev.trigger?.coins || 1;
  document.getElementById('s2e-fn-name').value = ev.func?.name || 'Acción';
  document.getElementById('s2e-fn-rep').value = ev.func?.repetition || 1;
  document.getElementById('s2e-fn-commands').value = (ev.func?.commands || []).join('\n');
  modal.dataset.selectedMcImg = ev.func?.imageUrl || '';

  modal.style.display = 'flex';
}

// =========================================================================
// PESTAÑA 🎬 ALERTAS & CROMA KEY (CROMA AUTO, VIDEO, SONIDO & VOZ TTS)
// =========================================================================
function injectAlertasChromaTabPane() {
  const mainContainer = document.querySelector('.main-view-container');
  if (!mainContainer || document.getElementById('tab-alertas')) return;

  const section = document.createElement('section');
  section.className = 'tab-pane';
  section.id = 'tab-alertas';

  section.innerHTML = `
    <div class="page-hero-title">
      <span>🎬 ALERTAS, ANIMACIONES CROMA KEY (AUTO), VIDEO, SONIDO &amp; VOZ TTS</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="font-family:var(--font-mono);font-size:12px;color:var(--neon-cyan);background:rgba(0,240,255,0.1);padding:6px 12px;border-radius:8px;border:1px solid var(--border-active);">
          http://localhost:4000/alerta.html
        </span>
        <button type="button" class="btn-primary" id="btn-copy-alertas-overlay-url">
          📋 Copiar URL de Alertas (OBS / Live Studio)
        </button>
      </div>
    </div>

    <!-- Barra Superior Idéntica a Captura 3 de Stream To Earn (Álbumes: Quiereme | Editar | Nuevo álbum | Nuevo disparador) -->
    <div class="s2e-presets-bar" style="background:#181a1f;padding:14px 18px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="font-size:15px;font-weight:700;color:#e5e7eb;" id="s2e-albums-count-label">Álbumes (1/∞):</span>
        <select id="s2e-alert-album-select" class="table-select" style="min-width:210px;background:#111317;color:#fff;padding:8px 12px;border-radius:8px;font-weight:700;"></select>
        <button type="button" class="s2e-btn-select-audio" id="btn-s2e-edit-album">Editar</button>
        <button type="button" class="s2e-btn-select-audio" id="btn-s2e-new-album">Nuevo álbum</button>
      </div>

      <div style="display:flex;align-items:center;gap:12px;">
        <div style="text-align:right;">
          <button type="button" class="s2e-btn-select-audio" id="btn-s2e-new-alert-trigger" style="padding:9px 18px;font-size:14px;">
            ➕ Nuevo disparador
          </button>
          <div style="font-size:11px;color:#10b981;margin-top:3px;font-family:var(--font-mono);" id="s2e-alert-limit-label">
            Límite de eventos: ∞ Ilimitado en Galactic Live
          </div>
        </div>
      </div>
    </div>

    <!-- Layout de 2 Columnas: Lista + Configurador (Izquierda) y Vista Previa Chroma Key en Tiempo Real (Derecha) -->
    <div style="display:grid;grid-template-columns:1.15fr 0.85fr;gap:18px;">
      <!-- Columna Izquierda: Disparadores del Álbum + Editor Completo -->
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="section-card">
          <div class="panel-header">
            <span class="panel-title">⚡ Disparadores Configurados en este Álbum</span>
            <span style="font-size:12px;color:var(--text-muted);">Haz clic en un disparador para editar su Croma, Video, Audio o Voz TTS</span>
          </div>
          <div id="s2e-alert-triggers-list" style="display:flex;flex-direction:column;gap:8px;"></div>
        </div>

        <!-- Editor del Disparador Seleccionado -->
        <div class="section-card" id="s2e-alert-trigger-editor-card">
          <div class="panel-header">
            <span class="panel-title">🪄 Editor de Animación con Chroma Key + Croma Auto + Sonido + TTS</span>
            <button type="button" class="btn-primary" id="btn-save-alert-trigger" style="padding:7px 14px;">
              💾 Guardar Disparador
            </button>
          </div>

          <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:10px;margin-bottom:12px;">
            <div>
              <label style="font-size:12px;color:var(--text-muted);">Nombre de la Alerta</label>
              <input type="text" id="al-edit-name" class="input-field" style="width:100%;margin-top:4px;" />
            </div>
            <div>
              <label style="font-size:12px;color:var(--text-muted);">Evento Disparador</label>
              <select id="al-edit-trig-type" class="table-select" style="width:100%;margin-top:4px;padding:9px;">
                <option value="SelectedGift">🎁 Regalo Específico</option>
                <option value="AnyGift">🌟 Cualquier Regalo</option>
                <option value="Like">❤️ Likes</option>
                <option value="Follow">➕ Nuevo Seguidor</option>
                <option value="Subscribe">👑 Suscripción</option>
                <option value="Share">🔄 Compartir</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;color:var(--text-muted);">Regalo TikTok (ej. Rose, GG, Galaxy)</label>
              <input type="text" id="al-edit-gift-name" list="gz7-s2e-gifts-datalist" class="input-field" placeholder="Rose / Rosa / GG / Dona" style="width:100%;margin-top:4px;" />
            </div>
          </div>

          <!-- Selección de Video / Animación + Subida Local -->
          <div style="background:rgba(4,10,20,0.8);border:1px solid var(--border-subtle);border-radius:10px;padding:12px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <strong style="font-size:13px;color:var(--neon-cyan);">🎥 1. Video o Animación (Catálogo Stream To Earn o Archivo Propio)</strong>
              <label class="s2e-btn-select-audio" style="cursor:pointer;font-size:12px;padding:6px 12px;">
                📂 Subir Video MP4 / WebM / GIF
                <input type="file" id="al-upload-video-input" accept="video/*,image/gif" style="display:none;" />
              </label>
            </div>

            <select id="al-edit-video-select" class="table-select" style="width:100%;padding:9px;margin-bottom:10px;">
              <option value="">-- Sin Video (Solo Sonido / TTS) --</option>
              ${S2E_ALERT_VIDEOS.map(v => `<option value="${v.url}">${v.isUser ? '⭐ [MI VIDEO] ' : '🎬 '}${v.name} (${v.duration}s)</option>`).join('')}
            </select>

            <!-- Controles de Chroma Key & Croma Auto -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;margin-bottom:10px;">
              <label class="tts-check-box-card" style="margin:0;">
                <input type="checkbox" id="al-edit-chroma-enabled" checked />
                <div>
                  <div style="font-weight:800;font-size:13px;color:#fff;">Activar Chroma Key</div>
                  <div style="font-size:11px;color:var(--text-muted);">Elimina el fondo del video en vivo</div>
                </div>
              </label>

              <div>
                <label style="font-size:11px;color:var(--text-muted);">Modo de Croma</label>
                <select id="al-edit-chroma-mode" class="table-select" style="width:100%;margin-top:3px;padding:8px;border-color:var(--neon-cyan);color:var(--neon-cyan);font-weight:800;">
                  <option value="auto">🪄 Croma Auto (Detecta el color de fondo solo)</option>
                  <option value="manual">🎨 Color Manual (Elegir Verde/Azul/Negro)</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:12px;align-items:center;">
              <div style="display:flex;align-items:center;gap:6px;">
                <input type="color" id="al-edit-chroma-color" value="#00ff00" style="width:36px;height:32px;border:none;background:transparent;cursor:pointer;" title="Color Croma Manual" />
                <button type="button" class="btn-micro btn-quick-chroma" data-color="#00ff00">🟢 Verde</button>
                <button type="button" class="btn-micro btn-quick-chroma" data-color="#0000ff">🔵 Azul</button>
                <button type="button" class="btn-micro btn-quick-chroma" data-color="#000000">⚫ Negro</button>
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
                  <span>Tolerancia Croma</span>
                  <span id="al-edit-sim-val" style="color:var(--neon-cyan);font-weight:800;">38%</span>
                </div>
                <input type="range" id="al-edit-similarity" min="5" max="85" value="38" style="width:100%;accent-color:var(--neon-cyan);" />
              </div>

              <div>
                <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
                  <span>Suavizado Antihalo</span>
                  <span id="al-edit-smooth-val" style="color:var(--neon-cyan);font-weight:800;">12%</span>
                </div>
                <input type="range" id="al-edit-smoothness" min="2" max="40" value="12" style="width:100%;accent-color:var(--neon-cyan);" />
              </div>
            </div>
          </div>

          <!-- Selección de Sonido Divertido (258 Audios S2E) + Voz TTS -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
            <div style="background:rgba(4,10,20,0.8);border:1px solid var(--border-subtle);border-radius:10px;padding:12px;">
              <strong style="font-size:13px;color:var(--neon-cyan);display:block;margin-bottom:8px;">🔊 2. Sonido Divertido</strong>
              <div id="al-edit-audio-box" class="s2e-audio-cell" style="margin-bottom:8px;">
                <span id="al-edit-audio-name" style="font-weight:700;color:#fff;">crack_the_whip.mp3</span>
              </div>
              <button type="button" class="s2e-btn-select-audio" id="btn-al-open-audio-modal" style="width:100%;">
                🎵 Elegir entre los 258 Audios S2E
              </button>
            </div>

            <div style="background:rgba(4,10,20,0.8);border:1px solid var(--border-subtle);border-radius:10px;padding:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <strong style="font-size:13px;color:var(--neon-cyan);">🎙️ 3. Voz TTS en Alerta</strong>
                <input type="checkbox" id="al-edit-tts-enabled" checked style="width:16px;height:16px;accent-color:var(--neon-cyan);" />
              </div>
              <label style="font-size:11px;color:var(--text-muted);">Mensaje que leerá la voz ({user}, {gift}, {coins})</label>
              <input type="text" id="al-edit-tts-template" class="input-field" value="¡{user} ha enviado {gift}!" style="width:100%;margin-top:4px;" />
            </div>
          </div>

          <!-- Texto en Pantalla y Duración -->
          <div style="display:grid;grid-template-columns:1fr 1fr 95px;gap:10px;">
            <div>
              <label style="font-size:11px;color:var(--text-muted);">Título en Pantalla</label>
              <input type="text" id="al-edit-title-tpl" class="input-field" value="⚡ {user}" style="width:100%;margin-top:3px;" />
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);">Subtítulo en Pantalla</label>
              <input type="text" id="al-edit-sub-tpl" class="input-field" value="Envió {gift} ({coins} 💎)" style="width:100%;margin-top:3px;" />
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);">Duración (s)</label>
              <input type="number" id="al-edit-duration" class="input-field" value="4.5" step="0.5" min="1" max="30" style="width:100%;margin-top:3px;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Monitor de Vista Previa en Vivo con Croma Auto Aplicado -->
      <div class="section-card" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div class="panel-header">
            <div>
              <span class="panel-title">👁️ Monitor en Vivo: Animación con Croma Auto</span>
              <p style="font-size:12px;color:var(--text-muted);margin-top:2px;">
                El fondo cuadriculado indica transparencia real. Así saldrá tu animación sobre el juego en OBS o TikTok LIVE Studio.
              </p>
            </div>
            <span id="chroma-auto-detected-badge" class="btn-micro" style="color:#10b981;border-color:#10b981;">
              🪄 CROMA AUTO LISTO
            </span>
          </div>

          <div class="chroma-checkerboard" style="height:310px;margin:12px 0;flex-direction:column;gap:10px;padding:12px;">
            <video id="al-preview-hidden-video" crossorigin="anonymous" playsinline loop muted style="display:none;"></video>
            <canvas id="al-preview-chroma-canvas" style="max-width:100%;max-height:210px;object-fit:contain;"></canvas>
            <div style="background:rgba(8,14,28,0.92);border:1.5px solid var(--neon-cyan);border-radius:14px;padding:8px 20px;text-align:center;box-shadow:0 0 20px rgba(0,240,255,0.35);">
              <div id="al-preview-title-text" style="font-family:var(--font-display);font-weight:900;font-size:16px;color:var(--neon-cyan);">⚡ @GZ7_Viewer</div>
              <div id="al-preview-sub-text" style="font-weight:800;font-size:14px;color:var(--color-gold);">Envió Rose (1 💎)</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <button type="button" class="btn-primary" id="btn-test-alert-live-now" style="width:100%;padding:13px;font-size:14px;">
            🚀 Probar Alerta Completa Ahora (Video Croma + Sonido + Voz TTS + OBS)
          </button>
          <button type="button" class="btn-secondary" id="btn-stop-alert-preview" style="width:100%;">
            ⏹ Detener Vista Previa / Audio
          </button>
        </div>
      </div>
    </div>
  `;

  mainContainer.appendChild(section);

  document.getElementById('btn-copy-alertas-overlay-url')?.addEventListener('click', () => {
    const url = 'http://localhost:4000/alerta.html';
    navigator.clipboard.writeText(url);
    notifyToast(`📋 Copiada URL de Alertas con Croma: ${url}`);
  });

  document.getElementById('s2e-alert-album-select')?.addEventListener('change', async e => {
    app.activeAlertAlbumId = e.target.value;
    activeAlertTriggerId = null;
    renderAlertasChromaStudio();
    await app.persistConfig();
  });

  document.getElementById('btn-s2e-new-album')?.addEventListener('click', async () => {
    const name = prompt('Nombre del nuevo álbum de alertas:', `Álbum ${app.alertAlbums.length + 1}`);
    if (!name || !name.trim()) return;
    const newAlb = {
      id: 'album_' + Date.now(),
      name: name.trim(),
      triggers: []
    };
    app.alertAlbums.push(newAlb);
    app.activeAlertAlbumId = newAlb.id;
    activeAlertTriggerId = null;
    renderAlertasChromaStudio();
    await app.persistConfig();
    notifyToast(`✔ Álbum "${newAlb.name}" creado`);
  });

  document.getElementById('btn-s2e-edit-album')?.addEventListener('click', async () => {
    const alb = app.getActiveAlertAlbum();
    if (!alb) return;
    const name = prompt('Renombrar álbum de alertas:', alb.name);
    if (name && name.trim()) {
      alb.name = name.trim();
      renderAlertasChromaStudio();
      await app.persistConfig();
      notifyToast(`✔ Álbum renombrado a "${alb.name}"`);
    }
  });

  document.getElementById('btn-s2e-new-alert-trigger')?.addEventListener('click', async () => {
    const alb = app.getActiveAlertAlbum();
    if (!alb) return;
    const newTrig = {
      id: 'trig_' + Date.now(),
      active: true,
      name: `Disparador #${(alb.triggers || []).length + 1}`,
      triggerType: 'SelectedGift',
      giftName: 'Rose',
      giftCoins: 1,
      likeThreshold: 100,
      videoUrl: S2E_ALERT_VIDEOS[0]?.url || 'http://localhost:4000/s2e_media/videos/public/any/1789666307528_screen-cover-boo-rush.webm',
      videoName: S2E_ALERT_VIDEOS[0]?.name || 'Animación Croma',
      chromaEnabled: true,
      chromaMode: 'auto',
      chromaColor: '#00ff00',
      similarity: 38,
      smoothness: 12,
      audioName: 'crack_the_whip.mp3',
      audioUrl: 'http://localhost:4000/s2e_media/audio/public/1708877462401_crack_the_whip.mp3',
      audioVolume: 100,
      playerType: 'priority',
      priority: 5,
      multiplier: false,
      ttsEnabled: true,
      ttsTemplate: '¡{user} envió {gift}!',
      titleTemplate: '⚡ {user}',
      subtitleTemplate: 'Envió {gift} ({coins} 💎)',
      duration: 4.5
    };
    alb.triggers.unshift(newTrig);
    activeAlertTriggerId = newTrig.id;
    renderAlertasChromaStudio();
    await app.persistConfig();
    notifyToast('➕ Nuevo disparador de alerta añadido');
  });

  // Upload custom video for Chroma Key
  document.getElementById('al-upload-video-input')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    notifyToast(`⏳ Procesando video "${file.name}"...`);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = String(reader.result);
      let finalUrl = base64Data;
      try {
        const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
        if (invoke) {
          finalUrl = await invoke('save_uploaded_media', {
            filename: file.name,
            base64_data: base64Data
          });
        }
      } catch (err) {}

      const sel = document.getElementById('al-edit-video-select');
      if (sel) {
        const opt = document.createElement('option');
        opt.value = finalUrl;
        opt.textContent = `⭐ [SUBIDO] ${file.name}`;
        sel.insertBefore(opt, sel.firstChild);
        sel.value = finalUrl;
      }
      syncCurrentAlertEditorFields();
      startLiveChromaPreview();
      await app.persistConfig();
      notifyToast(`🎬 Video "${file.name}" cargado con Croma Auto`);
    };
    reader.readAsDataURL(file);
  });

  document.querySelectorAll('.btn-quick-chroma').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('al-edit-chroma-mode').value = 'manual';
      document.getElementById('al-edit-chroma-color').value = btn.getAttribute('data-color');
      syncCurrentAlertEditorFields();
      startLiveChromaPreview();
    });
  });

  [
    'al-edit-name',
    'al-edit-trig-type',
    'al-edit-gift-name',
    'al-edit-video-select',
    'al-edit-chroma-enabled',
    'al-edit-chroma-mode',
    'al-edit-chroma-color',
    'al-edit-similarity',
    'al-edit-smoothness',
    'al-edit-tts-enabled',
    'al-edit-tts-template',
    'al-edit-title-tpl',
    'al-edit-sub-tpl',
    'al-edit-duration'
  ].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => {
      if (id === 'al-edit-similarity') {
        document.getElementById('al-edit-sim-val').textContent = `${el.value}%`;
      }
      if (id === 'al-edit-smoothness') {
        document.getElementById('al-edit-smooth-val').textContent = `${el.value}%`;
      }
      syncCurrentAlertEditorFields();
      if (id.includes('video') || id.includes('chroma')) {
        startLiveChromaPreview();
      }
    });
  });

  document.getElementById('btn-al-open-audio-modal')?.addEventListener('click', () => {
    const trig = getSelectedAlertTrigger();
    if (!trig) return;
    openS2EAudioModal(
      {
        name: trig.audioName,
        url: trig.audioUrl,
        volume: trig.audioVolume,
        playerType: trig.playerType,
        priority: trig.priority,
        multiplier: trig.multiplier
      },
      async selectedAudio => {
        if (selectedAudio) {
          trig.audioName = selectedAudio.name;
          trig.audioUrl = selectedAudio.url;
          trig.audioVolume = selectedAudio.volume;
          trig.playerType = selectedAudio.playerType;
          trig.priority = selectedAudio.priority;
          trig.multiplier = selectedAudio.multiplier;
        } else {
          trig.audioName = 'Sin sonido';
          trig.audioUrl = '';
        }
        renderAlertasChromaStudio();
        await app.persistConfig();
        notifyToast(`🔊 Audio de alerta actualizado: ${trig.audioName}`);
      }
    );
  });

  document.getElementById('btn-save-alert-trigger')?.addEventListener('click', async () => {
    syncCurrentAlertEditorFields();
    renderAlertasChromaStudio();
    await app.persistConfig();
    notifyToast('💾 Disparador de Alerta guardado y sincronizado con OBS');
  });

  document.getElementById('btn-test-alert-live-now')?.addEventListener('click', () => {
    syncCurrentAlertEditorFields();
    const trig = getSelectedAlertTrigger();
    if (!trig) return;
    startLiveChromaPreview();
    app.fireAlertTrigger(trig, {
      user: 'GZ7_Streamer',
      gift: trig.giftName || 'Rose',
      coins: trig.giftCoins || 100,
      count: 1
    });
    notifyToast(`🚀 Alerta "${trig.name}" disparada en OBS y en el Monitor Croma`);
  });

  document.getElementById('btn-stop-alert-preview')?.addEventListener('click', () => {
    soundManager.stopAll();
    if (liveChromaRaf) {
      cancelAnimationFrame(liveChromaRaf);
      liveChromaRaf = null;
    }
    const vid = document.getElementById('al-preview-hidden-video');
    if (vid) {
      try { vid.pause(); } catch (e) {}
    }
    notifyToast('⏹ Vista previa y audio detenidos');
  });
}

function getSelectedAlertTrigger() {
  const alb = app.getActiveAlertAlbum();
  if (!alb || !Array.isArray(alb.triggers) || alb.triggers.length === 0) return null;
  if (!activeAlertTriggerId) {
    activeAlertTriggerId = alb.triggers[0].id;
  }
  return alb.triggers.find(t => t.id === activeAlertTriggerId) || alb.triggers[0];
}

function syncCurrentAlertEditorFields() {
  const trig = getSelectedAlertTrigger();
  if (!trig) return;
  trig.name = document.getElementById('al-edit-name')?.value || trig.name;
  trig.triggerType = document.getElementById('al-edit-trig-type')?.value || 'SelectedGift';
  const rawInput = document.getElementById('al-edit-gift-name')?.value || 'Rose';
  const foundGift = CATALOGO_GIFTS.find(g => g.nombre.toLowerCase() === rawInput.toLowerCase() || giftsEquivalentes(g.nombre, rawInput));
  trig.giftName = foundGift ? foundGift.nombre : rawInput;
  trig.giftCoins = foundGift ? foundGift.coins : (coinsDeGift(rawInput) || 1);
  trig.giftId = foundGift?.id || tiktokGiftIdDeNombre(trig.giftName, 0);

  trig.videoUrl = document.getElementById('al-edit-video-select')?.value || '';
  trig.chromaEnabled = Boolean(document.getElementById('al-edit-chroma-enabled')?.checked);
  trig.chromaMode = document.getElementById('al-edit-chroma-mode')?.value || 'auto';
  trig.chromaColor = document.getElementById('al-edit-chroma-color')?.value || '#00ff00';
  trig.similarity = Number(document.getElementById('al-edit-similarity')?.value) || 38;
  trig.smoothness = Number(document.getElementById('al-edit-smoothness')?.value) || 12;
  trig.ttsEnabled = Boolean(document.getElementById('al-edit-tts-enabled')?.checked);
  trig.ttsTemplate = document.getElementById('al-edit-tts-template')?.value || '';
  trig.titleTemplate = document.getElementById('al-edit-title-tpl')?.value || '⚡ {user}';
  trig.subtitleTemplate = document.getElementById('al-edit-sub-tpl')?.value || 'Envió {gift}';
  trig.duration = Number(document.getElementById('al-edit-duration')?.value) || 4.5;

  const pTitle = document.getElementById('al-preview-title-text');
  const pSub = document.getElementById('al-preview-sub-text');
  if (pTitle) pTitle.textContent = trig.titleTemplate.replace(/\{user\}/gi, 'GZ7_Viewer');
  if (pSub) pSub.textContent = trig.subtitleTemplate.replace(/\{gift\}/gi, trig.giftName).replace(/\{coins\}/gi, String(trig.giftCoins || 1));
}

export function renderAlertasChromaStudio() {
  const albumSelect = document.getElementById('s2e-alert-album-select');
  const triggersList = document.getElementById('s2e-alert-triggers-list');
  const albumsCountLabel = document.getElementById('s2e-albums-count-label');
  if (!albumSelect || !triggersList) return;

  const activeAlbum = app.getActiveAlertAlbum();
  if (albumsCountLabel) {
    albumsCountLabel.textContent = `Álbumes (${app.alertAlbums.length}/∞):`;
  }

  albumSelect.innerHTML = app.alertAlbums.map(a =>
    `<option value="${a.id}" ${a.id === activeAlbum?.id ? 'selected' : ''}>${a.name} (${(a.triggers || []).length})</option>`
  ).join('');

  const triggers = activeAlbum?.triggers || [];
  const selectedTrig = getSelectedAlertTrigger();

  triggersList.innerHTML = triggers.map(t => {
    const isSel = selectedTrig && selectedTrig.id === t.id;
    return `
      <div class="s2e-event-row" data-trig-id="${t.id}" style="grid-template-columns:1.2fr 1fr 1fr auto;cursor:pointer;${isSel ? 'border-color:var(--neon-cyan);background:rgba(0,240,255,0.08);' : ''}">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:20px;">🎬</span>
          <div>
            <div style="font-weight:800;font-size:14px;color:#fff;">${t.name}</div>
            <div style="font-size:11px;color:var(--neon-cyan);">${t.triggerType} &bull; ${t.giftName || 'Todos'}</div>
          </div>
        </div>

        <div style="font-size:12px;color:#cbd5e1;">
          <div>🪄 Croma: <strong style="color:#10b981;">${t.chromaEnabled !== false ? (t.chromaMode === 'auto' ? 'AUTO' : t.chromaColor) : 'OFF'}</strong></div>
          <div style="font-size:11px;color:#9ca3af;">🔊 ${t.audioName || 'Sin audio'}</div>
        </div>

        <div style="font-size:12px;color:#cbd5e1;">
          <div>🎙️ TTS: <strong>${t.ttsEnabled ? 'Activado' : 'Off'}</strong></div>
          <div style="font-size:11px;color:#9ca3af;">⏱ ${t.duration || 4.5}s</div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;">
          <button type="button" class="s2e-play-btn btn-fire-trig-row" data-id="${t.id}" title="Probar esta alerta en vivo">▶</button>
          <button type="button" class="btn-micro btn-del-trig-row" data-id="${t.id}" style="color:#ef4444;">✕</button>
        </div>
      </div>
    `;
  }).join('');

  triggersList.querySelectorAll('.s2e-event-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      activeAlertTriggerId = row.getAttribute('data-trig-id');
      renderAlertasChromaStudio();
    });
  });

  triggersList.querySelectorAll('.btn-fire-trig-row').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      activeAlertTriggerId = id;
      renderAlertasChromaStudio();
      const trig = getSelectedAlertTrigger();
      if (trig) {
        app.fireAlertTrigger(trig, { user: 'GZ7_Tester', gift: trig.giftName, coins: trig.giftCoins || 1, count: 1 });
        notifyToast(`▶ Probando alerta: ${trig.name}`);
      }
    });
  });

  triggersList.querySelectorAll('.btn-del-trig-row').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (activeAlbum) {
        activeAlbum.triggers = activeAlbum.triggers.filter(x => x.id !== id);
        activeAlertTriggerId = activeAlbum.triggers[0]?.id || null;
        renderAlertasChromaStudio();
        await app.persistConfig();
        notifyToast('🗑 Disparador eliminado');
      }
    });
  });

  if (selectedTrig) {
    document.getElementById('al-edit-name').value = selectedTrig.name || '';
    document.getElementById('al-edit-trig-type').value = selectedTrig.triggerType || 'SelectedGift';
    document.getElementById('al-edit-gift-name').value = selectedTrig.giftName || 'Rose';

    const vSel = document.getElementById('al-edit-video-select');
    if (vSel) {
      if (selectedTrig.videoUrl && !Array.from(vSel.options).some(o => o.value === selectedTrig.videoUrl)) {
        const opt = document.createElement('option');
        opt.value = selectedTrig.videoUrl;
        opt.textContent = `⭐ ${selectedTrig.videoName || 'Video Personalizado'}`;
        vSel.insertBefore(opt, vSel.firstChild);
      }
      vSel.value = selectedTrig.videoUrl || '';
    }

    document.getElementById('al-edit-chroma-enabled').checked = selectedTrig.chromaEnabled !== false;
    document.getElementById('al-edit-chroma-mode').value = selectedTrig.chromaMode || 'auto';
    document.getElementById('al-edit-chroma-color').value = selectedTrig.chromaColor || '#00ff00';
    document.getElementById('al-edit-similarity').value = selectedTrig.similarity ?? 38;
    document.getElementById('al-edit-sim-val').textContent = `${selectedTrig.similarity ?? 38}%`;
    document.getElementById('al-edit-smoothness').value = selectedTrig.smoothness ?? 12;
    document.getElementById('al-edit-smooth-val').textContent = `${selectedTrig.smoothness ?? 12}%`;
    document.getElementById('al-edit-audio-name').textContent = `🔊 ${selectedTrig.audioName || 'Sin sonido'}`;
    document.getElementById('al-edit-tts-enabled').checked = Boolean(selectedTrig.ttsEnabled);
    document.getElementById('al-edit-tts-template').value = selectedTrig.ttsTemplate || '';
    document.getElementById('al-edit-title-tpl').value = selectedTrig.titleTemplate || '⚡ {user}';
    document.getElementById('al-edit-sub-tpl').value = selectedTrig.subtitleTemplate || 'Envió {gift}';
    document.getElementById('al-edit-duration').value = selectedTrig.duration || 4.5;

    startLiveChromaPreview();
  }
}

function startLiveChromaPreview() {
  const trig = getSelectedAlertTrigger();
  const vid = document.getElementById('al-preview-hidden-video');
  const canvas = document.getElementById('al-preview-chroma-canvas');
  const badge = document.getElementById('chroma-auto-detected-badge');
  if (!trig || !vid || !canvas) return;

  if (liveChromaRaf) {
    cancelAnimationFrame(liveChromaRaf);
    liveChromaRaf = null;
  }

  if (!trig.videoUrl) {
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  liveChromaAutoKey = null;

  if (vid.src !== trig.videoUrl) {
    vid.src = trig.videoUrl;
  }
  vid.muted = true;
  vid.loop = true;
  vid.play().catch(() => {});

  const parseHex = hex => {
    const c = String(hex || '#00ff00').replace('#', '');
    const n = parseInt(c, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };

  function renderLoop() {
    if (vid.paused || vid.ended) return;
    const vw = vid.videoWidth || 360;
    const vh = vid.videoHeight || 240;
    if (vw > 0 && vh > 0) {
      const scale = Math.min(1, 360 / vw, 220 / vh);
      const cw = Math.max(1, Math.round(vw * scale));
      const ch = Math.max(1, Math.round(vh * scale));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      ctx.drawImage(vid, 0, 0, cw, ch);

      if (trig.chromaEnabled !== false) {
        try {
          const frame = ctx.getImageData(0, 0, cw, ch);
          const d = frame.data;
          if (trig.chromaMode === 'auto' && !liveChromaAutoKey) {
            const coords = [[2, 2], [cw - 3, 2], [2, ch - 3], [cw - 3, ch - 3]];
            const samples = [];
            for (const [x, y] of coords) {
              const idx = (y * cw + x) * 4;
              if (d[idx + 3] > 180) samples.push([d[idx], d[idx + 1], d[idx + 2]]);
            }
            if (samples.length) {
              const avg = samples.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], [0, 0, 0]);
              liveChromaAutoKey = {
                r: Math.round(avg[0] / samples.length),
                g: Math.round(avg[1] / samples.length),
                b: Math.round(avg[2] / samples.length)
              };
              if (badge) {
                badge.textContent = `🪄 CROMA AUTO: RGB(${liveChromaAutoKey.r},${liveChromaAutoKey.g},${liveChromaAutoKey.b})`;
              }
            }
          } else if (trig.chromaMode !== 'auto' && badge) {
            badge.textContent = `🎨 CROMA MANUAL: ${trig.chromaColor}`;
          }

          const key = trig.chromaMode === 'auto' ? (liveChromaAutoKey || { r: 0, g: 255, b: 0 }) : parseHex(trig.chromaColor);
          const maxT = ((Number(trig.similarity) || 38) / 100) * 441.67;
          const ramp = ((Number(trig.smoothness) || 12) / 100) * 441.67;
          const isGreen = key.g > key.r + 30 && key.g > key.b + 30;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const dist = Math.sqrt((r - key.r) ** 2 + (g - key.g) ** 2 + (b - key.b) ** 2);
            if (dist < maxT) {
              d[i + 3] = 0;
            } else if (dist < maxT + ramp) {
              d[i + 3] = Math.round(d[i + 3] * ((dist - maxT) / ramp));
              if (isGreen && g > r && g > b) d[i + 1] = Math.round((r + b) * 0.5);
            }
          }
          ctx.putImageData(frame, 0, 0);
        } catch (e) {}
      }
    }
    liveChromaRaf = requestAnimationFrame(renderLoop);
  }

  liveChromaRaf = requestAnimationFrame(renderLoop);
}

function enhanceSoundboardWithS2E() {
  const sbSection = document.getElementById('tab-sounds');
  if (!sbSection) return;
  const header = sbSection.querySelector('.page-hero-title');
  if (header && !document.getElementById('btn-open-s2e-catalog-from-sounds')) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-open-s2e-catalog-from-sounds';
    btn.className = 'btn-primary';
    btn.innerHTML = `🎵 Abrir Selector Avanzado StreamToEarn (${S2E_PUBLIC_AUDIOS.length} Sonidos con Onda)`;
    btn.addEventListener('click', () => {
      openS2EAudioModal(null, selected => {
        if (selected) {
          if (selected.url) {
            soundManager.playUrl(selected.url, { volume: selected.volume });
          } else {
            soundManager.playSound(selected.id || selected.name, selected.volume);
          }
          notifyToast(`🔊 Reproduciendo: ${selected.name}`);
        }
      });
    });
    header.appendChild(btn);
  }
}

export function syncGiftWithActivePreset(giftObj) {
  if (!giftObj || !giftObj.name) return;
  const preset = app.getActiveS2EPreset();
  if (!preset || !Array.isArray(preset.events)) return;
  const ev = preset.events.find(e =>
    e.trigger?.action === 'SelectedGift' &&
    giftsEquivalentes(e.trigger?.giftName, giftObj.name, giftObj.tiktokGiftId, e.trigger?.giftId)
  );
  const soundRef = giftObj.audioUrl || giftObj.audioName || soundManager.getSoundForGift(giftObj.name) || '';
  const resolvedAudio = soundManager.resolveSound(soundRef);

  if (ev) {
    ev.trigger.giftName = giftObj.name;
    ev.trigger.coins = Number(giftObj.coins) || 1;
    ev.trigger.iconUrl = resolveGiftImgPath(giftObj.icon_file || archivoDeGift(giftObj.name, giftObj.coins));
    if (giftObj.command && !String(giftObj.command).startsWith('ROBLOX_EVENT:')) {
      ev.func = ev.func || {};
      ev.func.commands = [giftObj.command];
      ev.func.name = app.formatMcCommandLabel(giftObj.command, ev.func.name || giftObj.name);
    }
    if (soundRef) {
      ev.audio = {
        ...(ev.audio || {}),
        name: resolvedAudio?.name || giftObj.audioName || soundRef,
        path: resolvedAudio?.path || resolvedAudio?.url || giftObj.audioUrl || soundRef,
        url: resolvedAudio?.url || giftObj.audioUrl || '',
        peaks: resolvedAudio?.peaks || ev.audio?.peaks || '',
        volume: ev.audio?.volume ?? 100,
        playerType: ev.audio?.playerType || 'priority',
        priority: ev.audio?.priority ?? 5,
        multiplier: Boolean(ev.audio?.multiplier)
      };
    } else if (giftObj.audioName === '' && giftObj.audioUrl === '') {
      ev.audio = null;
    }
  }
  renderS2EPresetsStudio();
}

window.gz7S2EStudio = {
  openAudioPickerModal: openS2EAudioModal,
  openS2EAudioModal,
  getActivePreset: () => app.getActiveS2EPreset(),
  renderPresets: renderS2EPresetsStudio,
  renderAlertas: renderAlertasChromaStudio,
  syncGiftWithActivePreset
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initS2EStudio, 120));
} else {
  setTimeout(initS2EStudio, 120);
}
