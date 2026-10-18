import { EventEmitter } from '../store.js';

export class PermissionManager extends EventEmitter {
  constructor() {
    super();
    this.roles = {
      mods: ['gz7', 'admin', 'mod_cyber'],
      mvp: ['vip_gamer', 'mvp_donor'],
      vip: ['amigo_vip'],
      default: []
    };
    this.points = new Map([
      ['gz7', 9999],
      ['mod_cyber', 500],
      ['vip_gamer', 200]
    ]);
    this.initialPoints = 100;
    this.pointCosts = {
      alerta: 25,
      skip: 50,
      sr: 10
    };
    this.cooldowns = {
      individualSeconds: 30,
      globalSeconds: 10
    };
    this.mvpAlerts = {
      entrada: {
        videoUrl: '/s2e_media/videos/public/any/mvp_entrada.mp4',
        template: 'MODERADOR EN LINEA: {user}',
        duration: 5.0
      },
      cyber: {
        videoUrl: '/s2e_media/videos/public/any/cyber_alerta.mp4',
        template: '{user} NUEVO CYBER MVP',
        duration: 6.0
      },
      gg: {
        videoUrl: '/s2e_media/videos/public/any/mvp_gg.mp4',
        template: '{user} ACTIVO EL MODO HYPE',
        duration: 4.5
      },
      clean: {
        videoUrl: '/s2e_media/videos/public/any/mvp_entrada.mp4',
        template: '',
        duration: 4.0
      }
    };

    this.sessionMVP = {
      username: "Nadie aún",
      giftName: "",
      coins: 0
    };

    this.lastGlobalAlertMs = 0;
    this.userLastAlertMs = new Map();
    this.roleLevels = {
      mods: 3,
      mvp: 2,
      vip: 1,
      default: 0
    };

    this.init();
  }

  async init() {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/roles');
      if (res.ok) {
        const data = await res.json();
        this.applyConfig(data);
      } else {
        this.loadFromLocalStorage();
      }
    } catch (_) {
      this.loadFromLocalStorage();
    }
  }

  loadFromLocalStorage() {
    try {
      const local = localStorage.getItem('galactk_roles_config');
      if (local) {
        this.applyConfig(JSON.parse(local));
      }
    } catch (_) {}
  }

  applyConfig(data) {
    if (!data) return;
    if (data.roles) {
      this.roles = {
        mods: Array.isArray(data.roles.mods) ? data.roles.mods.map(u => this.normalizeUser(u)) : [],
        mvp: Array.isArray(data.roles.mvp) ? data.roles.mvp.map(u => this.normalizeUser(u)) : [],
        vip: Array.isArray(data.roles.vip) ? data.roles.vip.map(u => this.normalizeUser(u)) : [],
        default: Array.isArray(data.roles.default) ? data.roles.default.map(u => this.normalizeUser(u)) : []
      };
    }
    if (data.points && typeof data.points === 'object') {
      for (const [u, pts] of Object.entries(data.points)) {
        this.points.set(this.normalizeUser(u), Number(pts) || 0);
      }
    }
    if (data.initialPoints) this.initialPoints = Number(data.initialPoints) || 100;
    if (data.cooldowns) {
      this.cooldowns.individualSeconds = Math.max(30, Number(data.cooldowns.individualSeconds) || 30);
      this.cooldowns.globalSeconds = Math.max(10, Number(data.cooldowns.globalSeconds) || 10);
    }
    if (data.mvp_alerts) {
      this.mvpAlerts = { ...this.mvpAlerts, ...data.mvp_alerts };
    }
    this.emit('roles:updated', this.exportConfig());
  }

  exportConfig() {
    const pointsObj = {};
    for (const [u, pts] of this.points.entries()) {
      pointsObj[u] = pts;
    }
    return {
      roles: this.roles,
      points: pointsObj,
      initialPoints: this.initialPoints,
      pointCosts: this.pointCosts,
      cooldowns: this.cooldowns,
      mvp_alerts: this.mvpAlerts
    };
  }

  async saveConfig() {
    const config = this.exportConfig();
    try {
      localStorage.setItem('galactk_roles_config', JSON.stringify(config));
    } catch (_) {}

    try {
      await fetch('http://127.0.0.1:4000/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (_) {}

    this.emit('roles:updated', config);
  }

  normalizeUser(user) {
    return String(user || '')
      .replace(/^@+/, '')
      .toLowerCase()
      .trim();
  }

  getRole(user) {
    const clean = this.normalizeUser(user);
    if (!clean) return 'default';
    if (this.roles.mods.includes(clean)) return 'mods';
    if (this.roles.mvp.includes(clean)) return 'mvp';
    if (this.roles.vip.includes(clean)) return 'vip';
    return 'default';
  }

  hasRole(user, requiredRole) {
    const userRole = this.getRole(user);
    const userLevel = this.roleLevels[userRole] ?? 0;
    const reqLevel = this.roleLevels[requiredRole] ?? 0;
    return userLevel >= reqLevel;
  }

  setRole(user, targetRole) {
    const clean = this.normalizeUser(user);
    const roleKey = String(targetRole || '').toLowerCase().trim();
    if (!clean) return { ok: false, error: 'Usuario inválido' };

    const validRoles = ['mods', 'mod', 'mvp', 'vip', 'default'];
    if (!validRoles.includes(roleKey)) {
      return { ok: false, error: `Rol no válido. Usar: mods, mvp, vip o default` };
    }

    const canonicalRole = roleKey === 'mod' ? 'mods' : roleKey;

    for (const group of ['mods', 'mvp', 'vip', 'default']) {
      this.roles[group] = this.roles[group].filter(u => u !== clean);
    }

    if (canonicalRole !== 'default') {
      this.roles[canonicalRole].push(clean);
    }

    this.saveConfig();
    return { ok: true, user: clean, role: canonicalRole };
  }

  getPoints(user) {
    const clean = this.normalizeUser(user);
    if (!this.points.has(clean)) {
      this.points.set(clean, this.initialPoints);
    }
    return this.points.get(clean);
  }

  addPoints(user, amount) {
    const clean = this.normalizeUser(user);
    const current = this.getPoints(clean);
    const delta = Math.max(0, Number(amount) || 0);
    const updated = current + delta;
    this.points.set(clean, updated);
    this.saveConfig();
    return updated;
  }

  deductPoints(user, amount) {
    const clean = this.normalizeUser(user);
    const cost = Math.max(0, Number(amount) || 0);
    const current = this.getPoints(clean);
    if (current < cost) {
      return { ok: false, current, needed: cost };
    }
    const updated = current - cost;
    this.points.set(clean, updated);
    this.saveConfig();
    return { ok: true, current: updated, deducted: cost };
  }

  checkVisualCooldown(user) {
    const clean = this.normalizeUser(user);
    const now = Date.now();
    const globalLimitMs = this.cooldowns.globalSeconds * 1000;
    const userLimitMs = this.cooldowns.individualSeconds * 1000;

    const globalDiff = now - this.lastGlobalAlertMs;
    if (globalDiff < globalLimitMs) {
      const waitSec = Math.ceil((globalLimitMs - globalDiff) / 1000);
      return {
        allowed: false,
        reason: 'COOLDOWN_GLOBAL',
        remainingSeconds: waitSec,
        message: `Cooldown global activo. Espera ${waitSec}s para no saturar OBS.`
      };
    }

    const lastUserAlert = this.userLastAlertMs.get(clean) || 0;
    const userDiff = now - lastUserAlert;
    if (userDiff < userLimitMs) {
      const waitSec = Math.ceil((userLimitMs - userDiff) / 1000);
      return {
        allowed: false,
        reason: 'COOLDOWN_INDIVIDUAL',
        remainingSeconds: waitSec,
        message: `Cooldown personal activo (@${clean}). Espera ${waitSec}s.`
      };
    }

    return { allowed: true };
  }

  consumeVisualCooldown(user) {
    const clean = this.normalizeUser(user);
    const now = Date.now();
    this.lastGlobalAlertMs = now;
    this.userLastAlertMs.set(clean, now);
  }

  getAlertPreset(tipo = 'entrada') {
    const cleanTipo = String(tipo || 'entrada').toLowerCase().trim();
    if (this.mvpAlerts[cleanTipo]) {
      return { ...this.mvpAlerts[cleanTipo], tipo: cleanTipo };
    }
    return { ...this.mvpAlerts['entrada'], tipo: 'entrada' };
  }

  evaluateSessionMVP(donor, giftName, coins) {
    const c = Math.max(0, Number(coins) || 0);
    const cleanName = String(donor || '').trim() || 'Anónimo';
    const cleanGift = String(giftName || '').trim() || 'Regalo';

    if (c > this.sessionMVP.coins) {
      this.sessionMVP = {
        username: cleanName,
        giftName: cleanGift,
        coins: c
      };
      this.broadcastSessionMVP();
      return true;
    }
    return false;
  }

  async broadcastSessionMVP() {
    this.emit('mvp:updated', this.sessionMVP);

    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      try {
        await invoke('emit_session_mvp', {
          username: this.sessionMVP.username,
          gift_name: this.sessionMVP.giftName,
          coins: this.sessionMVP.coins
        });
      } catch (_) {}
    }

    try {
      await fetch('http://127.0.0.1:4000/api/session-mvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.sessionMVP)
      });
    } catch (_) {}
  }

  getSessionMVP() {
    return { ...this.sessionMVP };
  }

  resetSessionMVP() {
    this.sessionMVP = {
      username: 'Nadie aún',
      giftName: '',
      coins: 0
    };
    this.broadcastSessionMVP();
  }
}

export const permissionManager = new PermissionManager();
