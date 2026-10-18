import { store } from '../store.js';
import { overlayServer } from '../overlay-server.js';
import { showToast } from '../core/toast.js';

const STORAGE_KEY = 'galactik_top_settings';

const SVG_ICONS = {
  eye: '<svg class="icon-svg icon-eye" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg class="icon-svg icon-eye-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
  crown: '<svg class="icon-svg icon-crown" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFA751" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>',
  gem: '<svg class="icon-svg icon-gem" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>',
  heart: '<svg class="icon-svg icon-heart" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  sparkles: '<svg class="icon-svg icon-sparkles" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
  copy: '<svg class="icon-svg icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  check: '<svg class="icon-svg icon-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  play: '<svg class="icon-svg icon-play" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
};

export class TopsWidgetManager {
  constructor() {
    this.settings = this.loadStoredSettings();
    this.isAccordionOpen = true;
    this.donors = new Map();
    this.likers = new Map();
    this.mockInterval = null;

    this.mockData = [
      { user: 'CyberGhost', coins: 14200, likes: 38400 },
      { user: 'NeonValkyrie', coins: 11500, likes: 29100 },
      { user: 'AstroSamurai', coins: 8900, likes: 24500 },
      { user: 'QuantumGamer', coins: 6400, likes: 18200 },
      { user: 'PixelQueen', coins: 5100, likes: 14700 },
      { user: 'SolarPhantom', coins: 3900, likes: 11200 },
      { user: 'NovaStriker', coins: 2800, likes: 8900 },
      { user: 'HyperGlitch', coins: 2100, likes: 6400 },
      { user: 'VortexRider', coins: 1500, likes: 4300 },
      { user: 'CosmoStreamer', coins: 900, likes: 2700 }
    ];

    this.setupListeners();
  }

  loadStoredSettings() {
    const defaultSettings = {
      metric: 'coins',
      limit: 5,
      showCrown: true,
      showShimmer: true,
      mockActive: false
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return Object.assign(defaultSettings, JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Error leyendo galactik_top_settings:', e);
    }
    return defaultSettings;
  }

  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {}

    this.broadcastSettings();
  }

  async broadcastSettings() {
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      try {
        await invoke('update_top_settings', { settings: this.settings });
        return;
      } catch (err) {
        console.warn('Tauri update_top_settings fallback a HTTP:', err);
      }
    }

    try {
      await fetch('http://127.0.0.1:4000/api/top-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.settings)
      });
    } catch (err) {}
  }

  setupListeners() {
    store.on('history:entry', entry => {
      if (!entry) return;
      if (entry.type === 'gift') {
        const user = String(entry.user || 'Donador').replace(/^@/, '');
        const coins = Number(entry.coins) || 1;
        const current = this.donors.get(user) || 0;
        this.donors.set(user, current + coins);
        if (this.settings.metric === 'coins' && !this.settings.mockActive) {
          this.renderPreview();
        }
      }
    });

    store.on('stats:change', stats => {
      if (!stats) return;
      if (stats.lastLikeUser && stats.likeIncrement) {
        const user = String(stats.lastLikeUser).replace(/^@/, '');
        const current = this.likers.get(user) || 0;
        this.likers.set(user, current + Number(stats.likeIncrement || 1));
        if (this.settings.metric === 'likes' && !this.settings.mockActive) {
          this.renderPreview();
        }
      }
    });
  }

  mount(containerEl) {
    if (!containerEl) return;
    this.container = containerEl;
    this.renderUI();
    this.bindEvents();
    this.syncControls();
    this.renderPreview();
    if (this.settings.mockActive) {
      this.startMockEngine();
    }
  }

  renderUI() {
    this.container.innerHTML = `
      <div class="tops-modular-widget">
        <div class="tops-widget-header">
          <div class="widget-heading">
            <span class="eyebrow">BROWSER SOURCE OBS</span>
            <h2 class="widget-title">Widget de Rankings en Tiempo Real</h2>
          </div>
          <div class="widget-header-actions">
            <button type="button" class="btn-preview-toggle" id="btn-toggle-tops-preview" title="Alternar Vista Previa">
              <span class="preview-icon-slot">${SVG_ICONS.eye}</span>
              <span id="preview-toggle-label">Ocultar Preview</span>
            </button>
          </div>
        </div>

        <div class="tops-preview-accordion" id="tops-preview-accordion">
          <div class="checkerboard-stage">
            <div class="stage-badge">PREVIEW WYSIWYG · 320PX</div>
            <div id="tops-mini-canvas" class="tops-mini-canvas"></div>
          </div>
        </div>

        <div class="tops-controls-panel">
          <div class="controls-row">
            <div class="control-group">
              <label class="control-label">Métrica Activa</label>
              <div class="segmented-control" id="tops-metric-group">
                <button type="button" class="segmented-btn" data-metric="coins">
                  ${SVG_ICONS.gem} <span>Monedas / Diamantes</span>
                </button>
                <button type="button" class="segmented-btn" data-metric="likes">
                  ${SVG_ICONS.heart} <span>Taps / Likes</span>
                </button>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">Rango Visible</label>
              <div class="segmented-control" id="tops-limit-group">
                <button type="button" class="segmented-btn" data-limit="1">Top 1</button>
                <button type="button" class="segmented-btn" data-limit="3">Top 3</button>
                <button type="button" class="segmented-btn" data-limit="5">Top 5</button>
                <button type="button" class="segmented-btn" data-limit="10">Top 10</button>
              </div>
            </div>
          </div>

          <div class="controls-row visual-toggles-row">
            <div class="toggle-option-card">
              <label class="switch-wrap">
                <input type="checkbox" id="tops-crown-toggle" />
                <span class="switch-slider"></span>
              </label>
              <div class="toggle-text">
                <div class="toggle-title">${SVG_ICONS.crown} Corona Dorada para Top 1</div>
                <div class="toggle-sub">Acento cromático brillante y vector realzado</div>
              </div>
            </div>

            <div class="toggle-option-card">
              <label class="switch-wrap">
                <input type="checkbox" id="tops-shimmer-toggle" />
                <span class="switch-slider"></span>
              </label>
              <div class="toggle-text">
                <div class="toggle-title">${SVG_ICONS.sparkles} Animación de Shimmer</div>
                <div class="toggle-sub">Barrido de luz suave sobre el primer puesto</div>
              </div>
            </div>

            <div class="toggle-option-card mock-toggle-card">
              <label class="switch-wrap">
                <input type="checkbox" id="tops-mock-toggle" />
                <span class="switch-slider"></span>
              </label>
              <div class="toggle-text">
                <div class="toggle-title">${SVG_ICONS.play} Datos de Prueba (Mock Engine)</div>
                <div class="toggle-sub">10 usuarios dinámicos con reordenamiento FLIP</div>
              </div>
            </div>
          </div>

          <div class="tops-url-bar-card">
            <div class="url-info">
              <span class="url-label">Browser Source URL (OBS / TikTok Studio):</span>
              <input type="text" id="tops-overlay-url-input" class="input-field tops-url-input" value="http://localhost:4000/overlay-top.html" readonly />
            </div>
            <div class="url-actions">
              <button type="button" class="btn-primary" id="btn-copy-tops-overlay-url">
                ${SVG_ICONS.copy} <span>Copiar URL</span>
              </button>
              <button type="button" class="btn-secondary" id="btn-manual-test-tops">
                ${SVG_ICONS.play} <span>Simular Interacción</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  syncControls() {
    const metricBtns = this.container.querySelectorAll('#tops-metric-group .segmented-btn');
    metricBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.metric === this.settings.metric);
    });

    const limitBtns = this.container.querySelectorAll('#tops-limit-group .segmented-btn');
    limitBtns.forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.limit) === Number(this.settings.limit));
    });

    const crownInput = this.container.querySelector('#tops-crown-toggle');
    if (crownInput) crownInput.checked = Boolean(this.settings.showCrown);

    const shimmerInput = this.container.querySelector('#tops-shimmer-toggle');
    if (shimmerInput) shimmerInput.checked = Boolean(this.settings.showShimmer);

    const mockInput = this.container.querySelector('#tops-mock-toggle');
    if (mockInput) mockInput.checked = Boolean(this.settings.mockActive);
  }

  bindEvents() {
    const toggleBtn = this.container.querySelector('#btn-toggle-tops-preview');
    const accordion = this.container.querySelector('#tops-preview-accordion');
    const toggleLabel = this.container.querySelector('#preview-toggle-label');
    const iconSlot = this.container.querySelector('.preview-icon-slot');

    toggleBtn?.addEventListener('click', () => {
      this.isAccordionOpen = !this.isAccordionOpen;
      if (this.isAccordionOpen) {
        accordion.style.maxHeight = accordion.scrollHeight + 'px';
        accordion.style.opacity = '1';
        toggleLabel.textContent = 'Ocultar Preview';
        iconSlot.innerHTML = SVG_ICONS.eye;
        this.renderPreview();
      } else {
        accordion.style.maxHeight = '0px';
        accordion.style.opacity = '0';
        toggleLabel.textContent = 'Mostrar Preview';
        iconSlot.innerHTML = SVG_ICONS.eyeOff;
      }
    });

    this.container.querySelectorAll('#tops-metric-group .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.metric = btn.dataset.metric;
        this.syncControls();
        this.saveSettings();
        this.renderPreview();
      });
    });

    this.container.querySelectorAll('#tops-limit-group .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.settings.limit = Number(btn.dataset.limit) || 5;
        this.syncControls();
        this.saveSettings();
        this.renderPreview();
      });
    });

    this.container.querySelector('#tops-crown-toggle')?.addEventListener('change', e => {
      this.settings.showCrown = e.target.checked;
      this.saveSettings();
      this.renderPreview();
    });

    this.container.querySelector('#tops-shimmer-toggle')?.addEventListener('change', e => {
      this.settings.showShimmer = e.target.checked;
      this.saveSettings();
      this.renderPreview();
    });

    this.container.querySelector('#tops-mock-toggle')?.addEventListener('change', e => {
      this.settings.mockActive = e.target.checked;
      if (this.settings.mockActive) {
        this.startMockEngine();
      } else {
        this.stopMockEngine();
      }
      this.saveSettings();
      this.renderPreview();
    });

    const copyBtn = this.container.querySelector('#btn-copy-tops-overlay-url');
    copyBtn?.addEventListener('click', () => {
      const urlInput = this.container.querySelector('#tops-overlay-url-input');
      if (urlInput) {
        navigator.clipboard.writeText(urlInput.value);
        copyBtn.innerHTML = `${SVG_ICONS.check} <span>Copiado</span>`;
        showToast('Enlace copiado al portapapeles');
        setTimeout(() => {
          copyBtn.innerHTML = `${SVG_ICONS.copy} <span>Copiar URL</span>`;
        }, 1800);
      }
    });

    this.container.querySelector('#btn-manual-test-tops')?.addEventListener('click', () => {
      const randomNick = 'CyberViewer_' + Math.floor(Math.random() * 90 + 10);
      if (this.settings.metric === 'likes') {
        const count = Math.floor(Math.random() * 500) + 100;
        const current = this.likers.get(randomNick) || 0;
        this.likers.set(randomNick, current + count);
        overlayServer.emitLike(randomNick, count);
        showToast(`Simulados +${count} Taps de @${randomNick}`);
      } else {
        const coins = [10, 30, 100, 500, 1000][Math.floor(Math.random() * 5)];
        const current = this.donors.get(randomNick) || 0;
        this.donors.set(randomNick, current + coins);
        overlayServer.emitGift(randomNick, 'Galaxy', coins);
        showToast(`Simulados +${coins} Diamantes de @${randomNick}`);
      }
      this.renderPreview();
    });
  }

  startMockEngine() {
    if (this.mockInterval) clearInterval(this.mockInterval);
    this.mockInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * this.mockData.length);
      this.mockData[idx].coins += Math.floor(Math.random() * 600) + 150;
      this.mockData[idx].likes += Math.floor(Math.random() * 2000) + 400;
      if (this.isAccordionOpen) {
        this.renderPreview();
      }
    }, 2400);
  }

  stopMockEngine() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  getCurrentList() {
    if (this.settings.mockActive) {
      return this.mockData.map(item => ({
        user: item.user,
        score: this.settings.metric === 'likes' ? item.likes : item.coins
      })).sort((a, b) => b.score - a.score).slice(0, this.settings.limit);
    }

    const sourceMap = this.settings.metric === 'likes' ? this.likers : this.donors;
    const arr = [];
    sourceMap.forEach((score, user) => {
      arr.push({ user, score });
    });
    arr.sort((a, b) => b.score - a.score);
    return arr.slice(0, this.settings.limit);
  }

  renderPreview() {
    if (!this.isAccordionOpen) return;
    const canvas = this.container?.querySelector('#tops-mini-canvas');
    if (!canvas) return;

    const items = this.getCurrentList();
    const metricIcon = this.settings.metric === 'likes' ? SVG_ICONS.heart : SVG_ICONS.gem;
    const metricTitle = this.settings.metric === 'likes' ? 'TOP LIKES' : 'TOP DONADORES';

    const prevPositions = new Map();
    canvas.querySelectorAll('.mini-row').forEach(row => {
      const u = row.dataset.user;
      if (u) prevPositions.set(u, row.getBoundingClientRect().top);
    });

    let rowsHtml = '';
    if (items.length === 0) {
      rowsHtml = '<div class="mini-empty">Sin datos registrados aún</div>';
    } else {
      items.forEach((item, index) => {
        const rank = index + 1;
        let rankClass = 'rank-4-plus';
        let rankBadge = rank < 10 ? '0' + rank : String(rank);

        if (rank === 1) {
          rankClass = 'rank-1';
          if (this.settings.showCrown) rankClass += ' glow-active';
          if (this.settings.showShimmer) rankClass += ' shimmer-active';
          rankBadge = '#1';
        } else if (rank === 2) {
          rankClass = 'rank-2';
          rankBadge = '02';
        } else if (rank === 3) {
          rankClass = 'rank-3';
          rankBadge = '03';
        }

        const crown = (rank === 1 && this.settings.showCrown) ? SVG_ICONS.crown : '';

        rowsHtml += `
          <div class="mini-row ${rankClass}" data-user="${item.user}">
            <div class="row-left">
              <span class="rank-badge">${rankBadge}</span>
              <div class="user-info">
                ${crown}
                <span class="user-name">@${item.user}</span>
              </div>
            </div>
            <div class="score-badge">
              <span>${Number(item.score).toLocaleString('en-US')}</span>
              <span class="score-icon">${metricIcon}</span>
            </div>
          </div>
        `;
      });
    }

    canvas.innerHTML = `
      <div class="mini-header">
        <div class="header-left">
          <span class="metric-icon-slot">${metricIcon}</span>
          <span class="header-title">${metricTitle}</span>
        </div>
        <div class="header-live">
          <span class="live-dot"></span>
          <span>LIVE</span>
        </div>
      </div>
      <div class="mini-list" id="mini-list-rows">
        ${rowsHtml}
      </div>
    `;

    canvas.querySelectorAll('.mini-row').forEach(row => {
      const u = row.dataset.user;
      if (u && prevPositions.has(u)) {
        const delta = prevPositions.get(u) - row.getBoundingClientRect().top;
        if (Math.abs(delta) > 1) {
          row.style.transform = `translateY(${delta}px)`;
          row.style.transition = 'none';
          requestAnimationFrame(() => {
            row.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            row.style.transform = 'translateY(0)';
          });
        }
      }
    });

    const accordion = this.container.querySelector('#tops-preview-accordion');
    if (accordion && this.isAccordionOpen) {
      accordion.style.maxHeight = accordion.scrollHeight + 'px';
    }
  }
}

export const topsWidget = new TopsWidgetManager();

export function initTopsWidget() {
  const mountEl = document.getElementById('tops-widget-mount');
  if (mountEl) {
    topsWidget.mount(mountEl);
  }
  return { manager: topsWidget };
}

