import { copyLink } from '../core/shell.js';
import { overlayEvents } from '../core/events.js';
export function enhanceObbyWorkspace({ app, render }) {
  const root = document.getElementById('tab-roblox');
  const cards = [...root.querySelectorAll(':scope > .section-card')];
  const live = cards.find(c => c.querySelector('#gvg-red-points')) || cards[0];
  const links = cards.find(c => c.querySelector('[data-url*="wins.html"]')) || cards[1];
  const themes = cards.find(c => c.querySelector('#roblox-theme-selector')) || cards[2];
  const center = cards.find(c => c.querySelector('#rbx-center-red-img')) || cards[3];
  const rules = cards.find(c => c.querySelector('.roblox-columns-editor') || c.querySelector('#roblox-left-slots-list')) || cards[4];
  const hero = root.querySelector('.page-hero-title');
  hero.className = 'page-hero-title module-hero-banner';
  hero.querySelector('span').innerHTML = `
    <div class="banner-hero-layout">
      <div class="banner-hero-cube-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gkHeroCubeGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <defs>
            <linearGradient id="gkHeroCubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#00f0ff"/>
            </linearGradient>
          </defs>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>
      <div class="banner-hero-content">
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="eyebrow" style="margin:0;color:#94a3b8;font-weight:700;font-size:11px;letter-spacing:0.1em;">ROBLOX OBBY</span>
          <span class="module-badge" style="background:rgba(0,217,255,0.14);color:var(--gk-cyan);border:1px solid rgba(0,217,255,0.45);font-size:10px;padding:2px 7px;">PRO</span>
        </div>
        <h1>Editor Gift vs Gift</h1>
        <p>Configura duelos, regalos y eventos interactivos para tu transmisión.</p>
      </div>
    </div>
  `;
  const saveAllBtn = document.getElementById('btn-save-roblox-overlay');
  if (saveAllBtn) {
    saveAllBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>GUARDAR TODO EN VIVO
    `;
    saveAllBtn.className = 'btn-primary btn-save-hero';
  }
  const profileCode = document.getElementById('obby-profile-code').parentElement;
  const importButton = document.getElementById('btn-import-obby-json');
  const exportButton = document.getElementById('btn-export-obby-json');
  const presetButton = document.getElementById('btn-reset-roblox-overlay');
  presetButton.textContent = '↻ Cargar preset OBBY BIKE GALACTIK';

  // HUB: 1. Conexión y vista previa (idéntico a la referencia)
  const hub = document.createElement('div');
  hub.className = 'section-card gvg-connection-card';
  hub.innerHTML = `
    <div class="gvg-card-header">
      <div class="gvg-card-title-group">
        <div class="gvg-card-icon-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <line x1="12" y1="20" x2="12.01" y2="20"/>
          </svg>
        </div>
        <div>
          <h2 class="gvg-card-heading">1. Conexión y vista previa</h2>
          <p class="gvg-card-subheading">Lleva el duelo a tu transmisión en 3 simples pasos.</p>
        </div>
      </div>
      <div class="gvg-card-header-actions">
        <span id="gvg-live-status-pill" class="gvg-status-pill"><span class="status-dot-active">●</span> Overlay conectado</span>
        <button type="button" class="btn-secondary btn-ver-obs" id="btn-ver-obs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>Ver en OBS
        </button>
      </div>
    </div>

    <div class="gvg-card-body-split">
      <div class="gvg-steps-col">
        <div class="gvg-steps-flow">
          <div class="gvg-step-item">
            <span class="step-num">1</span>
            <span class="step-txt">Copia el link</span>
            <span class="step-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gk-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>
          </div>
          <span class="step-arrow">›</span>
          <div class="gvg-step-item">
            <span class="step-num">2</span>
            <span class="step-txt">Abre en OBS / LIVE Studio</span>
            <span class="step-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gk-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </span>
          </div>
          <span class="step-arrow">›</span>
          <div class="gvg-step-item">
            <span class="step-num">3</span>
            <span class="step-txt">Controla en vivo</span>
            <span class="step-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gk-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="6"/>
                <path d="M6 12h4m-2-2v4m9-2h.01m3-2h.01"/>
              </svg>
            </span>
          </div>
        </div>

        <div class="gvg-url-row" id="gvg-url-mount">
          <!-- Aquí se inyectan el input de url, copiar y previsualizar -->
        </div>
      </div>

      <div class="gvg-preview-col">
        <div class="gvg-live-mini-stage">
          <div class="mini-stage-header">
            <span class="stage-tag"><span class="pulse-dot"></span> LIVE OVERLAY HUD</span>
            <span class="stage-res">9:16 VERTICAL</span>
          </div>
          <div class="mini-stage-arena">
            <div class="mini-fighter mini-villain">
              <div class="mini-avatar-pedestal">
                <img src="./gifts/rose-1-coins.webp" onerror="this.src='./galactk-logo.png'" alt="Rosa" />
              </div>
              <span class="mini-fighter-name">ROSA</span>
              <span class="mini-score-tag red">Villanos</span>
            </div>
            <div class="mini-vs-divider">
              <span class="mini-vs-label">VS</span>
              <div class="mini-clash-bar">
                <div class="mini-clash-left"></div>
                <div class="mini-clash-right"></div>
              </div>
            </div>
            <div class="mini-fighter mini-hero">
              <div class="mini-avatar-pedestal">
                <img src="./gifts/gg-1-coins.webp" onerror="this.src='./galactk-logo.png'" alt="GG" />
              </div>
              <span class="mini-fighter-name">GG</span>
              <span class="mini-score-tag blue">Héroes</span>
            </div>
          </div>
          <div class="mini-stage-footer">
            <div class="mini-goal-meter">
              <span class="meter-label">META WINS</span>
              <div class="meter-track"><div class="meter-fill" style="width: 50%;"></div></div>
              <span class="meter-val">10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const status = document.getElementById('gvg-live-status');
  status.setAttribute('data-overlay-status', ''); status.textContent = 'Esperando servidor';
  const urlBar = document.getElementById('gvg-overlay-url').parentElement;
  urlBar.removeAttribute('style'); urlBar.className = 'link-bar gvg-link-bar';
  const reset = document.getElementById('btn-gvg-reset-points'); reset.textContent = '↻ Reset 0 – 0';
  document.getElementById('btn-gvg-copy-url').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  `;
  document.getElementById('btn-gvg-copy-url').title = 'Copiar link';
  document.getElementById('btn-gvg-open-overlay').innerHTML = 'Previsualizar ↗';
  const urlMount = hub.querySelector('#gvg-url-mount');
  if (urlMount && urlBar) {
    urlMount.append(urlBar);
  }
  const verObsBtn = hub.querySelector('#btn-ver-obs');
  if (verObsBtn) {
    verObsBtn.onclick = () => {
      const openBtn = document.getElementById('btn-gvg-open-overlay');
      if (openBtn) openBtn.click();
    };
  }
  const tabs = document.createElement('div'); tabs.className = 'workspace-tabs epic-nav-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Configuración Obby');
  const panels = {};
  const tabIcons = {
    live: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4m-2-2v4m9-2h.01m3-2h.01"/></svg>`,
    rules: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
    theme: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    profile: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
  };
  const tabSubtitles = {
    live: 'Gestiona el duelo en tiempo real',
    rules: 'Configura eventos y recompensas',
    theme: 'Personaliza tu overlay',
    profile: 'Perfiles y configuración'
  };
  for (const [id, label] of [['live', 'Controles en vivo'], ['rules', 'Reglas y regalos'], ['theme', 'Apariencia y tema'], ['profile', 'Importar / Exportar']]) {
    const button = document.createElement('button'); button.type = 'button'; button.id = `obby-tab-${id}`;
    button.innerHTML = `<span class="tab-btn-icon">${tabIcons[id]}</span><div class="tab-btn-meta"><strong>${label}</strong><small>${tabSubtitles[id] || ''}</small></div>`;
    button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', `obby-panel-${id}`);
    const panel = document.createElement('section'); panel.id = `obby-panel-${id}`; panel.className = 'workspace-panel'; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', button.id);
    panels[id] = panel; root.append(panel); tabs.append(button);
    button.onclick = () => {
      Object.entries(panels).forEach(([key, node]) => { node.hidden = key !== id; });
      [...tabs.children].forEach(b => { const active = b === button; b.setAttribute('aria-selected', active); b.tabIndex = active ? 0 : -1; });
    };
    button.onkeydown = event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); const list = [...tabs.children]; const index = list.indexOf(button);
      const next = event.key === 'Home' ? list[0] : event.key === 'End' ? list.at(-1) : list[(index + (event.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      next.click(); next.focus();
    };
  }
  hero.after(tabs);
  panels.live.append(hub, live);
  panels.theme.append(themes, links);
  panels.rules.append(center, rules);
  const profile = document.createElement('div'); profile.className = 'section-card profile-transfer';
  profile.innerHTML = '<span class="eyebrow">PERFILES PORTÁTILES</span><h2>Tu configuración, donde transmitas</h2><p>Importa un perfil de GALACTK PANEL o acciones compatibles de Interactive App. Exporta tus reglas, sonidos y apariencia en un solo archivo.</p><div class="profile-actions"></div>';
  profile.querySelector('.profile-actions').append(importButton, exportButton, presetButton);
  profile.append(profileCode); panels.profile.append(profile);
  live.classList.add('live-console', 'gvg-control-section');
  const livePanelHeader = live.querySelector('.panel-header');
  livePanelHeader.innerHTML = `
    <div class="gvg-card-title-group">
      <div class="gvg-card-icon-badge" style="background:rgba(0,217,255,0.1);color:var(--gk-cyan);">
        🎮
      </div>
      <div>
        <h2 class="gvg-card-heading">2. Control del directo</h2>
        <p class="gvg-card-subheading">Los cambios se reflejan al instante en tu overlay.</p>
      </div>
    </div>
  `;
  livePanelHeader.append(reset);

  const scoreGrid = document.getElementById('gvg-red-points').parentElement.parentElement.parentElement;
  scoreGrid.className = 'live-score-grid gvg-duel-arena';
  const redCard = document.getElementById('gvg-red-points').parentElement.parentElement;
  const blueCard = document.getElementById('gvg-blue-points').parentElement.parentElement;
  redCard.className = 'score-card villain gvg-team-card-red';
  blueCard.className = 'score-card hero gvg-team-card-blue';

  // Inyectar la Insignia Hexagonal VS Cyberpunk Nativa
  const vsCenter = document.createElement('div');
  vsCenter.className = 'gvg-vs-center-wrap';
  vsCenter.innerHTML = `
    <div class="gvg-vs-cyber-badge" title="Duelo de Regalos en Directo">
      <svg width="74" height="74" viewBox="0 0 100 100" fill="none" class="vs-svg-frame">
        <defs>
          <linearGradient id="vsHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff2a85"/>
            <stop offset="50%" stop-color="#8b5cff"/>
            <stop offset="100%" stop-color="#00d9ff"/>
          </linearGradient>
          <linearGradient id="vsTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#e0f7ff"/>
          </linearGradient>
          <filter id="vsGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <polygon points="50,5 92,27 92,73 50,95 8,73 8,27" fill="#070e1b" stroke="url(#vsHexGrad)" stroke-width="2.5" filter="url(#vsGlow)"/>
        <polygon points="50,13 83,31 83,69 50,87 17,69 17,31" fill="rgba(11, 22, 38, 0.9)" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
        <path d="M52 16 L46 48 L54 52 L48 84" stroke="url(#vsHexGrad)" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
        <text x="50" y="59" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="28" fill="url(#vsTextGrad)" letter-spacing="1.5">VS</text>
      </svg>
    </div>
  `;
  redCard.after(vsCenter);

  // Re-estilizar contenido interno de tarjeta roja (Villanos / Rosa)
  redCard.innerHTML = `
    <div class="team-header-row">
      <span class="team-badge red">VILLANOS</span>
      <span class="team-title-red">Rosa · Columna Izquierda</span>
    </div>
    <div class="team-body-row">
      <div class="team-gift-pedestal red">
        <img src="./gifts/rose-1-coins.webp" class="team-gift-icon" onerror="this.src='./galactk-logo.png'" alt="Rosa" />
        <span class="pedestal-coin-chip">1 🪙</span>
      </div>
      <div class="team-counter-wrap">
        <input type="number" min="0" id="gvg-red-points" class="team-points-input" value="0" />
        <span class="team-counter-label">PUNTOS</span>
      </div>
      <div class="team-deltas-group">
        <button class="btn-delta-pill gvg-point-delta" data-team="RED" data-delta="1">+1</button>
        <button class="btn-delta-pill gvg-point-delta" data-team="RED" data-delta="-1">-1</button>
        <button class="btn-delta-pill gvg-point-delta" data-team="RED" data-delta="10">+10</button>
        <button class="btn-delta-pill gvg-point-delta" data-team="RED" data-delta="-10">-10</button>
      </div>
    </div>
  `;

  // Re-estilizar contenido interno de tarjeta azul (Héroes / GG)
  blueCard.innerHTML = `
    <div class="team-header-row">
      <span class="team-badge blue">HÉROES</span>
      <span class="team-title-blue">GG · Columna Derecha</span>
    </div>
    <div class="team-body-row">
      <div class="team-gift-pedestal blue">
        <img src="./gifts/gg-1-coins.webp" class="team-gift-icon" onerror="this.src='./galactk-logo.png'" alt="GG" />
        <span class="pedestal-coin-chip">1 🪙</span>
      </div>
      <div class="team-counter-wrap">
        <input type="number" min="0" id="gvg-blue-points" class="team-points-input" value="0" />
        <span class="team-counter-label">PUNTOS</span>
      </div>
      <div class="team-deltas-group">
        <button class="btn-delta-pill gvg-point-delta" data-team="BLUE" data-delta="1">+1</button>
        <button class="btn-delta-pill gvg-point-delta" data-team="BLUE" data-delta="-1">-1</button>
        <button class="btn-delta-pill gvg-point-delta" data-team="BLUE" data-delta="10">+10</button>
        <button class="btn-delta-pill gvg-point-delta" data-team="BLUE" data-delta="-10">-10</button>
      </div>
    </div>
  `;

  // Barra de estado de duelo / empate / +1 WIN para ambos
  const duelStatus = document.createElement('div');
  duelStatus.className = 'gvg-duel-status-bar duel-direction';
  duelStatus.innerHTML = `
    <div class="duel-status-badge">
      <span class="duel-scale-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="3" x2="12" y2="21"/>
          <polyline points="2 7 12 3 22 7"/>
          <path d="M5 21l-3-9h6l-3 9z"/>
          <path d="M19 21l-3-9h6l-3 9z"/>
        </svg>
      </span>
      <span class="duel-status-text" id="gvg-duel-status-text">Empate · La siguiente donación decide</span>
    </div>
    <button type="button" class="btn-plus-one-both" id="btn-plus-one-both">+1 WIN para ambos</button>
  `;
  scoreGrid.after(duelStatus);

  document.getElementById('btn-plus-one-both').onclick = () => {
    const redInp = document.getElementById('gvg-red-points');
    const blueInp = document.getElementById('gvg-blue-points');
    if (redInp) { redInp.value = Number(redInp.value || 0) + 1; redInp.dispatchEvent(new Event('change')); }
    if (blueInp) { blueInp.value = Number(blueInp.value || 0) + 1; blueInp.dispatchEvent(new Event('change')); }
  };

  // Re-vincular eventos a los nuevos botones delta
  document.querySelectorAll('.gvg-point-delta').forEach(btn => {
    btn.onclick = async () => {
      const team = btn.dataset.team;
      const delta = Number(btn.dataset.delta) || 0;
      const inp = document.getElementById(team === 'RED' ? 'gvg-red-points' : 'gvg-blue-points');
      if (inp) {
        inp.value = Math.max(0, Number(inp.value || 0) + delta);
        inp.dispatchEvent(new Event('change'));
      }
      try {
        await fetch('http://127.0.0.1:4000/api/gvg/control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_points', team, value: delta })
        });
      } catch (_) {}
    };
  });

  // CARD 3: META DEL PARKOUR
  const winsCard = document.getElementById('gvg-current-wins').parentElement.parentElement.parentElement;
  winsCard.className = 'section-card gvg-wins-section';
  winsCard.innerHTML = `
    <div class="gvg-card-header" style="margin-bottom:16px;">
      <div class="gvg-card-title-group">
        <div class="gvg-card-icon-badge" style="background:rgba(255,215,0,0.12);color:var(--color-gold);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
        </div>
        <div>
          <h2 class="gvg-card-heading">3. Meta del parkour</h2>
          <p class="gvg-card-subheading" id="wins-debt-hint">Cada victoria cuenta. También puedes restar WINS.</p>
        </div>
      </div>
    </div>

    <div class="gvg-wins-controls-grid">
      <!-- Tarjeta Wins Actuales -->
      <div class="gvg-kpi-card">
        <span class="kpi-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" fill="rgba(255,215,0,0.2)"/>
          </svg>
        </span>
        <div class="kpi-info">
          <span class="kpi-label">Wins actuales</span>
          <input type="number" id="gvg-current-wins" class="kpi-value-input" value="0" />
        </div>
      </div>

      <!-- Tarjeta Meta Total -->
      <div class="gvg-kpi-card">
        <span class="kpi-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="22" y1="12" x2="18" y2="12"/>
            <line x1="6" y1="12" x2="2" y2="12"/>
            <line x1="12" y1="6" x2="12" y2="2"/>
            <line x1="12" y1="22" x2="12" y2="18"/>
            <circle cx="12" cy="12" r="3" fill="#00D9FF"/>
          </svg>
        </span>
        <div class="kpi-info">
          <span class="kpi-label">Meta total de Wins</span>
          <input type="number" min="1" id="gvg-target-wins" class="kpi-value-input" value="10" />
        </div>
      </div>

      <!-- Botones de Wins -->
      <div class="gvg-win-deltas-row">
        <button class="btn-delta-pill gvg-win-delta" data-delta="1">+1 Win</button>
        <button class="btn-delta-pill gvg-win-delta" data-delta="-1">-1 Win</button>
        <button class="btn-delta-pill gvg-win-delta" data-delta="5">+5 Wins</button>
        <button class="btn-delta-pill gvg-win-delta" data-delta="-5">-5 Wins</button>
        <button class="btn-danger btn-reset-wins-pill" id="btn-gvg-reset-wins">Reset Wins</button>
      </div>

      <!-- Configuración al alcanzar la meta -->
      <div class="gvg-goal-config-group">
        <label class="gvg-goal-label">Cuando se alcanza la meta</label>
        <div style="display:flex;gap:8px;align-items:center;">
          <select id="gvg-goal-action" class="table-select gvg-goal-select">
            <option value="INCREASE_TARGET">Aumentar Meta</option>
            <option value="SHOW_VICTORY">Mostrar Victoria</option>
            <option value="HOLD">Mantener</option>
          </select>
          <div class="gvg-quick-target-adjust">
            <button type="button" class="btn-delta-pill" id="btn-target-minus" style="padding:6px 10px;">−10</button>
            <button type="button" class="btn-delta-pill" id="btn-target-plus" style="padding:6px 10px;">+10</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de progreso visual inferior -->
    <div class="gvg-progress-row">
      <div class="gvg-progress-track">
        <div class="gvg-progress-fill" id="gvg-progress-fill" style="width: 0%;"></div>
      </div>
      <span class="gvg-progress-fraction" id="gvg-progress-fraction">0 / 10</span>
      <label class="gvg-show-columns-toggle">
        <input type="checkbox" id="gvg-show-columns" checked />
        <span>Mostrar columnas laterales</span>
      </label>
    </div>
  `;

  // Control rápido de +/- 10 a la meta
  document.getElementById('btn-target-plus').onclick = () => {
    const t = document.getElementById('gvg-target-wins');
    if (t) { t.value = Number(t.value || 0) + 10; t.dispatchEvent(new Event('change')); }
  };
  document.getElementById('btn-target-minus').onclick = () => {
    const t = document.getElementById('gvg-target-wins');
    if (t) { t.value = Math.max(1, Number(t.value || 0) - 10); t.dispatchEvent(new Event('change')); }
  };

  // Re-vincular botones de wins
  document.querySelectorAll('.gvg-win-delta').forEach(btn => {
    btn.onclick = () => {
      const delta = Number(btn.dataset.delta) || 0;
      const inp = document.getElementById('gvg-current-wins');
      if (inp) {
        const nextVal = Number(inp.value || 0) + delta;
        inp.value = nextVal;
        inp.classList.toggle('wins-negative', nextVal < 0);
        inp.dispatchEvent(new Event('change'));
      }
    };
  });
  document.getElementById('btn-gvg-reset-wins').onclick = () => {
    const inp = document.getElementById('gvg-current-wins');
    if (inp) { inp.value = 0; inp.dispatchEvent(new Event('change')); }
  };
  overlayEvents.subscribe(payload => {
    const state = payload.gift_vs_gift; if (!state) return;
    const txt = state.red_points > state.blue_points ? '⏸ FRENAR / REINICIO · Villanos lideran' : state.blue_points > state.red_points ? '🚲 AVANZAR · Héroes lideran' : 'Empate · La siguiente donación decide';
    const statusEl = document.getElementById('gvg-duel-status-text');
    if (statusEl) statusEl.textContent = txt;
    winsCard.classList.toggle('in-debt', state.wins < 0);
    const winsInp = document.getElementById('gvg-current-wins');
    if (winsInp) winsInp.classList.toggle('wins-negative', Number(state.wins) < 0);
    const hintEl = document.getElementById('wins-debt-hint');
    if (hintEl) hintEl.textContent = state.wins < 0 ? `Deuda de ${Math.abs(state.wins)} WINS · recupera el terreno` : 'Cada victoria cuenta. También puedes restar WINS.';
    app.robloxOverlayConfig.target_wins = state.target_wins;
    
    // Actualizar barra de progreso y fracción
    const target = Number(state.target_wins) || 10;
    const wins = Number(state.wins) || 0;
    const percent = Math.max(0, Math.min(100, (wins / target) * 100));
    const fillEl = document.getElementById('gvg-progress-fill');
    const fracEl = document.getElementById('gvg-progress-fraction');
    if (fillEl) fillEl.style.width = `${percent}%`;
    if (fracEl) fracEl.textContent = `${wins} / ${target}`;
  });
  center.querySelector('.panel-title').textContent = 'Regalos principales · Rosa vs GG';
  rules.querySelector('.panel-title').textContent = 'Acciones de tu comunidad';
  const tools = document.createElement('div'); tools.className = 'rules-toolbar';
  tools.innerHTML = '<input class="input-field" id="obby-rule-search" placeholder="Buscar regalo o acción…" aria-label="Buscar acciones"><select id="obby-rule-filter" class="table-select" aria-label="Filtrar acciones"><option value="ALL">Todas las acciones</option><option value="LEFT">Izquierda</option><option value="RIGHT">Derecha</option><option value="WIN">WINS +/−</option><option value="ALERT">Solo alerta</option></select><span id="obby-rule-count" class="module-badge"></span>';
  rules.querySelector('.panel-header').after(tools);
  tools.querySelector('input').oninput = render; tools.querySelector('select').onchange = render;
  // Secondary controls (WIN settings row & manual test dock) remain in one disclosure
  const centerDetails = document.createElement('details'); centerDetails.className = 'advanced-details';
  centerDetails.innerHTML = '<summary>Opciones de WIN y pruebas con audio</summary>';
  const centerChildren = [...center.children];
  // Index 0 is panel-header, Index 1 is WIN options row, Index 2 is VS cards grid, Index 3 is WIN actions row, Index 4 is manual dock
  centerChildren.forEach((node, index) => {
    if (index === 1 || index === 3 || index === 4) {
      centerDetails.append(node);
    }
  });
  center.append(centerDetails);
  themes.querySelector('.panel-title').textContent = 'Elige cómo aparece tu overlay';
  themes.querySelector('.panel-header p').textContent = 'Vistas previas del estilo. Ghost deja visibles solo iconos y texto.';
  const names = { GALACTIC: 'Galactk', SOL: 'Solar', CONTRASTE: 'Contraste', MOVIMIENTO: 'Motion', NEON: 'Neón', transparent: 'Ghost · Transparente' };
  themes.querySelectorAll('.rbx-theme-btn').forEach(button => {
    const theme = button.dataset.theme;
    button.classList.add('theme-card'); button.setAttribute('aria-label', names[theme]);
    button.innerHTML = `<span class="theme-mini" data-style="${theme.toUpperCase()}"><span>🌹 <b>24</b></span><i>VS</i><span><b>18</b> 🎮</span></span><strong>${names[theme] || theme}</strong><small>${theme === 'transparent' ? 'Solo iconos y texto' : 'Texto + superficie'}</small>`;
  });
  links.querySelector('.panel-title').textContent = 'Overlays por separado';
  tabs.firstElementChild.click();
}
