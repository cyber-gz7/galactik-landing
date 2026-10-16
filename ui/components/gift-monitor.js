import { store } from '../src/store.js';
import { tikTokBridge } from '../src/tiktok.js';
import { app } from '../src/main.js';
import { giftRegistry, archivoDeGift, limpiarArchivoGift, giftsEquivalentes } from '../src/gifts.js';

export class GiftMonitorComponent extends HTMLElement {
  constructor() {
    super();
    this.history = [];
    this.maxItems = 15;
    this.isCollapsed = false;
    this.lastBackendResponse = null;
    this.activeEndpoint = 'http://localhost:4000/api/tiktok-webhook';
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    this.ensureSseActive();
  }

  disconnectedCallback() {
    if (this.unsubHistory) this.unsubHistory();
    if (this.unsubTikTokGift) this.unsubTikTokGift();
    if (this.unsubDuel) this.unsubDuel();
  }

  ensureSseActive() {
    // Si la conexión a TikTok todavía no fue iniciada manualmente, aseguramos
    // que el stream SSE esté activo para recibir los webhooks locales y cambios de estado
    if (tikTokBridge && !tikTokBridge.sseSource && typeof tikTokBridge.startSseEventStream === 'function') {
      try {
        tikTokBridge.startSseEventStream();
      } catch (_) {}
    }
  }

  setupListeners() {
    // 1. Escuchar eventos de regalo desde el TikTok Bridge (Live stream o SSE)
    this.unsubTikTokGift = tikTokBridge.on('gift', data => {
      this.processGiftItem(data, 'LIVE_TIKTOK');
    });

    // 2. Escuchar entradas del historial general
    this.unsubHistory = store.on('history:entry', entry => {
      if (entry && entry.type === 'gift') {
        const already = this.history.some(h => h.id === entry.id || (h.timestamp === entry.timestamp && h.giftName === entry.title));
        if (!already) {
          this.processGiftItem({
            giftName: entry.title?.replace(/\s*\(x\d+\)/, '') || 'Regalo',
            giftId: entry.giftId || 0,
            repeatCount: entry.repeatCount || 1,
            diamondCount: entry.coins || 1,
            nickname: entry.user || 'Donador'
          }, 'STORE_EVENT');
        }
      }
    });

    // 3. Escuchar empujes de duelo
    this.unsubDuel = store.on('duel:push', pushData => {
      this.updateDuelStatus(pushData);
    });
  }

  resolveGiftIcon(name = '', coins = 1) {
    let clean = limpiarArchivoGift('');
    try {
      clean = archivoDeGift(name, coins);
    } catch (_) {
      clean = 'rose-1-coins.webp';
    }
    return `./gifts/${clean}`;
  }

  calculateDiagnosis(giftName = '', diamondCount = 1, repeatCount = 1, giftId = 0) {
    const rawName = String(giftName || '').trim();
    const lowerName = rawName.toLowerCase();
    const count = Math.max(1, Number(repeatCount) || 1);
    let coinsEach = Number(diamondCount) || 1;

    // Normalización de regalos especiales conocidos
    const isGiantRose = lowerName.includes('gigante') || lowerName.includes('giant') || lowerName === 'rosa (10)' || lowerName === 'rosa 10' || (lowerName.includes('rosa') && coinsEach === 10);
    const isSuperGG = lowerName.includes('super gg') || lowerName.includes('supergg') || lowerName.includes('súper gg') || (lowerName === 'gg' && coinsEach >= 100);

    if (isGiantRose) {
      coinsEach = Math.max(10, coinsEach);
    } else if (isSuperGG) {
      coinsEach = Math.max(100, coinsEach);
    }

    const totalCoins = coinsEach * count;

    // Reglas activas de Roblox / Duelo
    const robloxCfg = app?.robloxOverlayConfig || {};
    const leftRules = robloxCfg.left_rules || [];
    const rightRules = robloxCfg.right_rules || [];

    // 1. Verificar si coincide con alguna Regla Lateral (Villanos vs Héroes)
    let matchedRule = null;
    let ruleSide = null;

    for (const r of leftRules) {
      if (giftsEquivalentes(r.gift_name, rawName, giftId, r.tiktokGiftId) || r.gift_name.toLowerCase() === lowerName) {
        matchedRule = r;
        ruleSide = 'LEFT';
        break;
      }
    }

    if (!matchedRule) {
      for (const r of rightRules) {
        if (giftsEquivalentes(r.gift_name, rawName, giftId, r.tiktokGiftId) || r.gift_name.toLowerCase() === lowerName) {
          matchedRule = r;
          ruleSide = 'RIGHT';
          break;
        }
      }
    }

    if (matchedRule) {
      const isWin = String(matchedRule.action_type).toUpperCase() === 'WIN';
      const ruleVal = Number(matchedRule.value) || 0;

      if (isWin) {
        const netWins = ruleVal * count;
        return {
          ruleType: 'LATERAL',
          ruleBadge: `REGLA LATERAL: ${matchedRule.id}`,
          ruleDescription: `Regla Lateral ${ruleSide === 'LEFT' ? 'Izquierda (Villanos)' : 'Derecha (Héroes)'} [${matchedRule.id}]: ${matchedRule.label}`,
          team: ruleSide === 'LEFT' ? 'RED' : 'BLUE',
          teamLabel: ruleSide === 'LEFT' ? 'Villanos (Rojo)' : 'Héroes (Azul)',
          pointsText: `${netWins > 0 ? '+' : ''}${netWins} WIN`,
          isWin: true,
          coinsEach,
          totalCoins
        };
      } else {
        const ptsEach = ruleVal !== 0 ? Math.abs(ruleVal) : (matchedRule.coins || coinsEach);
        const totalPts = ptsEach * count;
        return {
          ruleType: 'LATERAL',
          ruleBadge: `REGLA LATERAL: ${matchedRule.id}`,
          ruleDescription: `Regla Lateral ${ruleSide === 'LEFT' ? 'Izquierda (Villanos)' : 'Derecha (Héroes)'} [${matchedRule.id}]: ${matchedRule.label} (+${totalPts} pts)`,
          team: ruleSide === 'LEFT' ? 'RED' : 'BLUE',
          teamLabel: ruleSide === 'LEFT' ? 'Villanos (Rojo)' : 'Héroes (Azul)',
          pointsText: `+${totalPts} pts`,
          isWin: false,
          coinsEach,
          totalCoins
        };
      }
    }

    // 2. Reglas Centrales (Duelo Central: Rosa vs GG, Rosa Gigante, Super GG)
    const centerRedName = robloxCfg.center_red_name || 'Rose';
    const centerBlueName = robloxCfg.center_blue_name || 'GG';

    const isRose = giftsEquivalentes(centerRedName, rawName, giftId) || lowerName === 'rose' || lowerName === 'rosa' || giftId === 5655;
    const isGG = giftsEquivalentes(centerBlueName, rawName, giftId) || lowerName === 'gg' || giftId === 6064 || giftId === 6093 || giftId === 7214;

    if (isGiantRose) {
      const pts = totalCoins;
      return {
        ruleType: 'CENTRAL',
        ruleBadge: 'REGLA CENTRAL',
        ruleDescription: `Rosa Gigante detectada (10 pts c/u) • ${count}x10 = +${pts} pts al Equipo Rojo`,
        team: 'RED',
        teamLabel: 'Equipo Rojo (Villanos)',
        pointsText: `+${pts} pts`,
        isWin: false,
        coinsEach: 10,
        totalCoins: pts
      };
    }

    if (isSuperGG) {
      const pts = totalCoins;
      return {
        ruleType: 'CENTRAL',
        ruleBadge: 'REGLA CENTRAL',
        ruleDescription: `Super GG detectado (100 pts c/u) • ${count}x100 = +${pts} pts al Equipo Azul`,
        team: 'BLUE',
        teamLabel: 'Equipo Azul (Héroes)',
        pointsText: `+${pts} pts`,
        isWin: false,
        coinsEach: 100,
        totalCoins: pts
      };
    }

    if (isRose) {
      const pts = count * Math.max(1, coinsEach);
      return {
        ruleType: 'CENTRAL',
        ruleBadge: 'REGLA CENTRAL',
        ruleDescription: `Duelo Central: ${count} Rosa(s) = +${pts} pts al Equipo Rojo`,
        team: 'RED',
        teamLabel: 'Equipo Rojo (Villanos)',
        pointsText: `+${pts} pts`,
        isWin: false,
        coinsEach: 1,
        totalCoins: pts
      };
    }

    if (isGG) {
      const pts = count * Math.max(1, coinsEach);
      return {
        ruleType: 'CENTRAL',
        ruleBadge: 'REGLA CENTRAL',
        ruleDescription: `Duelo Central: ${count} GG(s) = +${pts} pts al Equipo Azul`,
        team: 'BLUE',
        teamLabel: 'Equipo Azul (Héroes)',
        pointsText: `+${pts} pts`,
        isWin: false,
        coinsEach: 1,
        totalCoins: pts
      };
    }

    // Regalo general / perfil Minecraft
    const activeFaction = store.getState().activeFaction || 'BUENOS';
    const isBuenos = activeFaction === 'BUENOS';
    return {
      ruleType: 'GENERAL',
      ruleBadge: 'GENERAL',
      ruleDescription: `Regalo general (${totalCoins} diamantes) aplicado al perfil ${app.activeProfile?.toUpperCase() || 'GENERAL'}`,
      team: isBuenos ? 'BLUE' : 'RED',
      teamLabel: isBuenos ? 'Buenos (Azul)' : 'Malos (Rojo)',
      pointsText: `+${totalCoins} diamantes`,
      isWin: false,
      coinsEach,
      totalCoins
    };
  }

  processGiftItem(rawGift, source = 'LIVE') {
    if (!rawGift) return;
    const giftName = String(rawGift.giftName || rawGift.title || 'Regalo').trim();
    const count = Math.max(1, Number(rawGift.repeatCount || rawGift.count) || 1);
    const donor = String(rawGift.nickname || rawGift.uniqueId || rawGift.user || 'Donador').trim();
    const giftId = Number(rawGift.giftId) || 0;
    const initialCoins = Number(rawGift.diamondCount || rawGift.coins) || 1;

    const diag = this.calculateDiagnosis(giftName, initialCoins, count, giftId);

    const item = {
      id: 'gmon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString(),
      giftName,
      giftId,
      donor,
      count,
      iconUrl: this.resolveGiftIcon(giftName, diag.coinsEach),
      source,
      ...diag
    };

    this.history.unshift(item);
    if (this.history.length > this.maxItems) {
      this.history.pop();
    }

    this.renderFeed();
  }

  async sendWebhookTest(testConfig) {
    const { giftName, repeatCount, diamondCount, giftId, nickname, expectedLabel } = testConfig;
    const feedbackBadge = this.querySelector('#gmon-test-feedback');
    const startTime = performance.now();

    if (feedbackBadge) {
      feedbackBadge.className = 'gmon-feedback-pill running';
      feedbackBadge.innerHTML = `⏳ Enviando POST: ${giftName} x${repeatCount}...`;
    }

    const payload = {
      event: 'gift',
      data: {
        giftName,
        giftId: Number(giftId) || 0,
        repeatCount: Number(repeatCount) || 1,
        diamondCount: Number(diamondCount) || 1,
        nickname: nickname || 'GZ7_Tester',
        uniqueId: (nickname || 'gz7_tester').toLowerCase(),
        isLocalSimulation: true
      }
    };

    let responseOk = false;
    let respData = null;
    let latencyMs = 0;
    let errorMsg = null;

    const endpoints = [
      'http://localhost:4000/api/tiktok-webhook',
      'http://127.0.0.1:4000/api/tiktok-webhook'
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        latencyMs = Math.round(performance.now() - startTime);
        if (res.ok) {
          responseOk = true;
          this.activeEndpoint = url;
          try {
            respData = await res.json();
          } catch (_) {
            respData = { ok: true };
          }
          break;
        }
      } catch (err) {
        errorMsg = err?.message || 'Error de red';
      }
    }

    if (responseOk) {
      if (feedbackBadge) {
        feedbackBadge.className = 'gmon-feedback-pill success';
        feedbackBadge.innerHTML = `🟢 200 OK (${latencyMs}ms) &bull; ${expectedLabel} &bull; Backend Sincronizado`;
      }

      // Procesar de inmediato para retroalimentación instantánea en el Monitor
      this.processGiftItem({
        giftName,
        giftId,
        repeatCount,
        diamondCount,
        nickname
      }, 'SIMULADOR');

      // También alimentar el controlador de la app si está disponible
      if (app && typeof app.handleGiftEvent === 'function') {
        app.handleGiftEvent({
          giftName,
          giftId,
          repeatCount,
          diamondCount,
          nickname,
          uniqueId: nickname,
          isLocalSimulation: true
        });
      }
    } else {
      if (feedbackBadge) {
        feedbackBadge.className = 'gmon-feedback-pill error';
        feedbackBadge.innerHTML = `🔴 Error Webhook: ${errorMsg || 'Servidor no respondió'} (${latencyMs}ms)`;
      }

      // Aún si falla la red HTTP, procesamos localmente para asegurar verificación de la regla
      this.processGiftItem({
        giftName,
        giftId,
        repeatCount,
        diamondCount,
        nickname: `${nickname} (Local)`
      }, 'SIMULADOR_OFFLINE');
    }
  }

  updateDuelStatus(pushData) {
    const duelBadge = this.querySelector('#gmon-duel-status-badge');
    if (duelBadge && pushData) {
      duelBadge.innerHTML = `⚡ Último Empuje: <strong>${pushData.donor}</strong> (${pushData.giftName}) &bull; ${pushData.side}`;
    }
  }

  render() {
    this.innerHTML = `
      <section class="gmon-apple-card" id="gmon-main-wrapper">
        <!-- HEADER ESTILO APPLE DARK MODE CON ACENTOS CELESTE/AZUL -->
        <div class="gmon-header-row">
          <div class="gmon-title-group">
            <div class="gmon-apple-icon">📡</div>
            <div>
              <div class="gmon-title-text">
                MONITOR &amp; SIMULADOR DE REGALOS EN VIVO
                <span class="gmon-apple-badge">REAL-TIME FEED</span>
              </div>
              <div class="gmon-subtitle-text">
                Verificación fáctica de regalos TikTok &bull; Reglas Laterales vs Centrales &bull; Latencia cero
              </div>
            </div>
          </div>

          <div class="gmon-header-actions">
            <div class="gmon-live-indicator-pill" title="Backend Webhook activo en puerto 4000">
              <span class="gmon-pulse-dot"></span>
              <span id="gmon-backend-label">WEBHOOK ENGINE :4000</span>
            </div>
            <button type="button" class="gmon-btn-ghost" id="btn-gmon-clear" title="Limpiar los regalos del monitor">
              🧹 Limpiar
            </button>
            <button type="button" class="gmon-btn-ghost" id="btn-gmon-toggle" title="Minimizar o expandir monitor">
              ${this.isCollapsed ? '▼ Expandir' : '▲ Plegar'}
            </button>
          </div>
        </div>

        <!-- BARRA DEL SIMULADOR DE PRUEBAS RÁPIDO (1-CLIC) -->
        <div class="gmon-sim-section" id="gmon-sim-box">
          <div class="gmon-sim-header">
            <span class="gmon-sim-tag">🧪 SIMULADOR DE PRUEBAS 1-CLIC (POST /api/tiktok-webhook)</span>
            <div id="gmon-test-feedback" class="gmon-feedback-pill idle">
              Esperando prueba o regalo en vivo...
            </div>
          </div>

          <div class="gmon-buttons-grid">
            <!-- Botón 1: 1 Rosa (1 pt) -->
            <button type="button" class="gmon-quick-btn rose" id="btn-test-1-rosa">
              <div class="gmon-btn-top">
                <span class="gmon-btn-icon">🌹</span>
                <span class="gmon-btn-coins">1 💎</span>
              </div>
              <div class="gmon-btn-main">Test 1 Rosa</div>
              <div class="gmon-btn-sub">+1 pt Rojo (Central)</div>
            </button>

            <!-- Botón 2: 27 Rosas (27 pts) -->
            <button type="button" class="gmon-quick-btn rose-combo" id="btn-test-27-rosas">
              <div class="gmon-btn-top">
                <span class="gmon-btn-icon">🌹x27</span>
                <span class="gmon-btn-coins">27 💎</span>
              </div>
              <div class="gmon-btn-main">Test 27 Rosas</div>
              <div class="gmon-btn-sub">+27 pts Rojo (Combo)</div>
            </button>

            <!-- Botón 3: Rosa Gigante (10 pts) -->
            <button type="button" class="gmon-quick-btn giant-rose" id="btn-test-rosa-gigante">
              <div class="gmon-btn-top">
                <span class="gmon-btn-icon">🌺</span>
                <span class="gmon-btn-coins">10 💎</span>
              </div>
              <div class="gmon-btn-main">Test Rosa Gigante</div>
              <div class="gmon-btn-sub">+10 pts Rojo (Regla x10)</div>
            </button>

            <!-- Botón 4: 1 GG (1 pt) -->
            <button type="button" class="gmon-quick-btn gg" id="btn-test-1-gg">
              <div class="gmon-btn-top">
                <span class="gmon-btn-icon">🎮</span>
                <span class="gmon-btn-coins">1 💎</span>
              </div>
              <div class="gmon-btn-main">Test 1 GG</div>
              <div class="gmon-btn-sub">+1 pt Azul (Central)</div>
            </button>

            <!-- Botón 5: Super GG (100 pts) -->
            <button type="button" class="gmon-quick-btn super-gg" id="btn-test-super-gg">
              <div class="gmon-btn-top">
                <span class="gmon-btn-icon">⚡</span>
                <span class="gmon-btn-coins">100 💎</span>
              </div>
              <div class="gmon-btn-main">Test Super GG</div>
              <div class="gmon-btn-sub">+100 pts Azul (Regla x100)</div>
            </button>
          </div>
        </div>

        <!-- CUERPO COLAPSABLE: FEED EN VIVO DE LOS ÚLTIMOS 15 REGALOS -->
        <div class="gmon-feed-container ${this.isCollapsed ? 'collapsed' : ''}" id="gmon-feed-area">
          <div class="gmon-feed-meta-bar">
            <span style="display:flex; align-items:center; gap:6px;">
              <span class="gmon-dot-cyan"></span>
              <strong>FEED EN VIVO</strong> &bull; Lista de los últimos 15 regalos procesados
            </span>
            <span id="gmon-feed-counter" style="font-family:var(--font-mono); font-size:11.5px; color:var(--neon-cyan);">
              0 / 15 Regalos
            </span>
          </div>

          <div class="gmon-list" id="gmon-items-list">
            ${this.renderFeedHtml()}
          </div>
        </div>
      </section>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // 1. Limpiar
    this.querySelector('#btn-gmon-clear')?.addEventListener('click', () => {
      this.history = [];
      this.renderFeed();
      const fb = this.querySelector('#gmon-test-feedback');
      if (fb) {
        fb.className = 'gmon-feedback-pill idle';
        fb.textContent = 'Historial limpiado. Esperando nuevos regalos...';
      }
    });

    // 2. Plegar / Expandir
    this.querySelector('#btn-gmon-toggle')?.addEventListener('click', () => {
      this.isCollapsed = !this.isCollapsed;
      const feedArea = this.querySelector('#gmon-feed-area');
      const toggleBtn = this.querySelector('#btn-gmon-toggle');
      if (feedArea) feedArea.classList.toggle('collapsed', this.isCollapsed);
      if (toggleBtn) toggleBtn.textContent = this.isCollapsed ? '▼ Expandir' : '▲ Plegar';
    });

    // 3. Botón Test 1 Rosa
    this.querySelector('#btn-test-1-rosa')?.addEventListener('click', () => {
      this.sendWebhookTest({
        giftName: 'Rose',
        repeatCount: 1,
        diamondCount: 1,
        giftId: 5655,
        nickname: 'Tester_Rosa1',
        expectedLabel: '1 Rosa = 1 pt Rojo'
      });
    });

    // 4. Botón Test 27 Rosas
    this.querySelector('#btn-test-27-rosas')?.addEventListener('click', () => {
      this.sendWebhookTest({
        giftName: 'Rose',
        repeatCount: 27,
        diamondCount: 1,
        giftId: 5655,
        nickname: 'Tester_Rosas27',
        expectedLabel: '27 Rosas = 27 pts Rojo'
      });
    });

    // 5. Botón Test Rosa Gigante
    this.querySelector('#btn-test-rosa-gigante')?.addEventListener('click', () => {
      this.sendWebhookTest({
        giftName: 'Rosa Gigante',
        repeatCount: 1,
        diamondCount: 10,
        giftId: 0,
        nickname: 'Tester_RosaGigante',
        expectedLabel: 'Rosa Gigante = 10 pts Rojo'
      });
    });

    // 6. Botón Test 1 GG
    this.querySelector('#btn-test-1-gg')?.addEventListener('click', () => {
      this.sendWebhookTest({
        giftName: 'GG',
        repeatCount: 1,
        diamondCount: 1,
        giftId: 6064,
        nickname: 'Tester_GG1',
        expectedLabel: '1 GG = 1 pt Azul'
      });
    });

    // 7. Botón Test Super GG
    this.querySelector('#btn-test-super-gg')?.addEventListener('click', () => {
      this.sendWebhookTest({
        giftName: 'Super GG',
        repeatCount: 1,
        diamondCount: 100,
        giftId: 0,
        nickname: 'Tester_SuperGG',
        expectedLabel: 'Super GG = 100 pts Azul'
      });
    });
  }

  renderFeed() {
    const listEl = this.querySelector('#gmon-items-list');
    const countEl = this.querySelector('#gmon-feed-counter');
    if (listEl) {
      listEl.innerHTML = this.renderFeedHtml();
    }
    if (countEl) {
      countEl.textContent = `${this.history.length} / ${this.maxItems} Regalos`;
    }
  }

  renderFeedHtml() {
    if (this.history.length === 0) {
      return `
        <div class="gmon-empty-state">
          <div style="font-size:28px; margin-bottom:6px;">🎁</div>
          <div style="font-weight:700; color:#e2e8f0; font-size:13px;">No hay regalos registrados aún</div>
          <div style="font-size:11.5px; color:#64748b; margin-top:2px;">
            Haz clic en los botones de prueba superiores o recibe regalos en el Live para verificar puntos y reglas al instante.
          </div>
        </div>
      `;
    }

    return this.history.map((item, idx) => {
      const isRed = item.team === 'RED';
      const isBlue = item.team === 'BLUE';
      const isLateral = item.ruleType === 'LATERAL';

      const teamPillClass = isRed ? 'pill-red' : (isBlue ? 'pill-blue' : 'pill-neutral');
      const rulePillClass = isLateral ? 'pill-lateral' : 'pill-central';

      return `
        <div class="gmon-item-row ${idx === 0 ? 'gmon-item-new' : ''}" data-item-id="${item.id}">
          <!-- 1. Icono + Nombre + Donador -->
          <div class="gmon-item-avatar-col">
            <img src="${item.iconUrl}" class="gmon-gift-thumb" alt="${item.giftName}" onerror="this.src='./gifts/rose-1-coins.webp'" />
            <div>
              <div class="gmon-gift-title">
                <strong>${item.giftName}</strong>
                ${item.count > 1 ? `<span class="gmon-count-tag">x${item.count}</span>` : ''}
              </div>
              <div class="gmon-gift-donor">
                @${item.donor} &bull; <span class="gmon-time-tag">${item.timestamp}</span>
              </div>
            </div>
          </div>

          <!-- 2. Diamantes calculados -->
          <div class="gmon-item-diamonds-col">
            <div class="gmon-diamond-badge">
              💎 ${item.totalCoins}
            </div>
            <div class="gmon-diamond-sub">
              ${item.coinsEach} c/u
            </div>
          </div>

          <!-- 3. Puntos aplicados (Rojo o Azul) -->
          <div class="gmon-item-points-col">
            <div class="gmon-points-badge ${teamPillClass}">
              ${isRed ? '🔴' : (isBlue ? '🔵' : '⚪')} ${item.pointsText}
            </div>
            <div class="gmon-team-sub">
              ${item.teamLabel}
            </div>
          </div>

          <!-- 4. Regla aplicada (Central vs Lateral) -->
          <div class="gmon-item-rule-col">
            <div class="gmon-rule-badge ${rulePillClass}">
              ${item.ruleBadge}
            </div>
            <div class="gmon-rule-sub" title="${item.ruleDescription}">
              ${item.ruleDescription}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

customElements.define('gift-monitor', GiftMonitorComponent);
