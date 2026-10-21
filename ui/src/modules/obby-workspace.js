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
  hero.querySelector('span').innerHTML = '<div class="banner-hero-content"><span class="eyebrow" style="color:var(--gk-cyan);font-weight:800;letter-spacing:0.12em;">ROBLOX OBBY <small class="module-badge" style="background:rgba(0,217,255,0.18);color:var(--gk-cyan);border:1px solid rgba(0,217,255,0.4);vertical-align:middle;margin-left:6px;">PRO</small></span><h1>Editor Gift vs Gift</h1><p>Configura duelos, regalos y eventos interactivos para tu transmisión.</p></div>';
  const saveAllBtn = document.getElementById('btn-save-roblox-overlay');
  if (saveAllBtn) {
    saveAllBtn.innerHTML = '💾 Guardar Todo en Vivo';
    saveAllBtn.className = 'btn-primary btn-save-hero';
  }
  const profileCode = document.getElementById('obby-profile-code').parentElement;
  const importButton = document.getElementById('btn-import-obby-json');
  const exportButton = document.getElementById('btn-export-obby-json');
  const presetButton = document.getElementById('btn-reset-roblox-overlay');
  presetButton.textContent = '↻ Cargar preset OBBY BIKE GALACTIK';
  const hub = document.createElement('div');
  hub.className = 'link-hub';
  hub.innerHTML = '<div class="hub-heading"><div><span class="eyebrow">LISTO EN 3 PASOS</span><h2>Lleva el duelo a tu transmisión</h2></div></div><ol class="quick-steps"><li><b>1</b> Copia el link</li><li><b>2</b> Fuente de navegador en OBS / LIVE Studio</li><li><b>3</b> Controla en vivo</li></ol>';
  const status = document.getElementById('gvg-live-status');
  status.setAttribute('data-overlay-status', ''); status.textContent = 'Esperando servidor';
  hub.querySelector('.hub-heading').append(status);
  const urlBar = document.getElementById('gvg-overlay-url').parentElement;
  urlBar.removeAttribute('style'); urlBar.className = 'link-bar';
  const reset = document.getElementById('btn-gvg-reset-points'); reset.textContent = '↻ Reset 0 – 0';
  live.querySelector('.panel-header').append(reset);
  document.getElementById('btn-gvg-copy-url').textContent = 'Copiar link';
  document.getElementById('btn-gvg-open-overlay').textContent = 'Previsualizar ↗';
  hub.append(urlBar);
  hub.insertAdjacentHTML('beforeend', '<p>Fuente de navegador a 1080 × 1920 · Escala y coloca el duelo sobre tu gameplay.</p>');
  hero.after(hub);
  const tabs = document.createElement('div'); tabs.className = 'workspace-tabs epic-nav-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Configuración Obby');
  const panels = {};
  const tabIcons = {
    live: '🎮',
    rules: '🎁',
    theme: '✏️',
    profile: '📄'
  };
  const tabSubtitles = {
    live: 'Gestiona el duelo en tiempo real',
    rules: 'Configura eventos y recompensas',
    theme: 'Personaliza tu overlay',
    profile: 'Perfiles y configuración'
  };
  for (const [id, label] of [['live', 'Controles en vivo'], ['rules', 'Reglas y regalos'], ['theme', 'Apariencia y tema'], ['profile', 'Importar / Exportar']]) {
    const button = document.createElement('button'); button.type = 'button'; button.id = `obby-tab-${id}`;
    button.innerHTML = `<span class="tab-btn-icon">${tabIcons[id] || '⚡'}</span><div class="tab-btn-meta"><strong>${label}</strong><small>${tabSubtitles[id] || ''}</small></div>`;
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
  hub.after(tabs);
  panels.live.append(live);
  panels.theme.append(themes, links);
  panels.rules.append(center, rules);
  const profile = document.createElement('div'); profile.className = 'section-card profile-transfer';
  profile.innerHTML = '<span class="eyebrow">PERFILES PORTÁTILES</span><h2>Tu configuración, donde transmitas</h2><p>Importa un perfil de GALACTK PANEL o acciones compatibles de Interactive App. Exporta tus reglas, sonidos y apariencia en un solo archivo.</p><div class="profile-actions"></div>';
  profile.querySelector('.profile-actions').append(importButton, exportButton, presetButton);
  profile.append(profileCode); panels.profile.append(profile);
  live.classList.add('live-console');
  live.querySelector('.panel-title').textContent = 'Control del directo';
  live.querySelector('.panel-header p').textContent = 'Los cambios se reflejan al instante en tu overlay.';
  const scoreGrid = document.getElementById('gvg-red-points').parentElement.parentElement.parentElement;
  scoreGrid.className = 'live-score-grid';
  const redCard = document.getElementById('gvg-red-points').parentElement.parentElement;
  const blueCard = document.getElementById('gvg-blue-points').parentElement.parentElement;
  redCard.className = 'score-card villain'; blueCard.className = 'score-card hero';
  const winsCard = document.getElementById('gvg-current-wins').parentElement.parentElement.parentElement;
  winsCard.className = 'score-card wins-card';
  winsCard.insertAdjacentHTML('afterbegin', '<div class="eyebrow">META DEL PARKOUR</div><p class="wins-hint" id="wins-debt-hint">Cada victoria cuenta. También puedes restar WINS.</p>');
  const duelStatus = document.createElement('div'); duelStatus.className = 'duel-direction'; duelStatus.textContent = 'Empate · La siguiente donación decide';
  scoreGrid.after(duelStatus);
  overlayEvents.subscribe(payload => {
    const state = payload.gift_vs_gift; if (!state) return;
    duelStatus.textContent = state.red_points > state.blue_points ? '⏸ FRENAR / REINICIO · Villanos lideran' : state.blue_points > state.red_points ? '🚲 AVANZAR · Héroes lideran' : 'Empate · La siguiente donación decide';
    winsCard.classList.toggle('in-debt', state.wins < 0);
    document.getElementById('wins-debt-hint').textContent = state.wins < 0 ? `Deuda de ${Math.abs(state.wins)} WINS · recupera el terreno` : 'Cada victoria cuenta. También puedes restar WINS.';
    app.robloxOverlayConfig.target_wins = state.target_wins;
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
