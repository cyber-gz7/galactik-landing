const SVG_ICONS = {
  shieldProtected: `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  shieldRequired: `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  chip: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  key: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
  streamer: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>`,
  copy: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  unlock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  logout: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  send: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  rocket: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 9v-5s3.03.55 4 2c1.08 1.62 0 5 0 5"/></svg>`,
  shieldSmall: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  alertTriangle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  settings: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`
};

const CSS_STYLES = `
@keyframes gz7-shield-pulse-active {
  0%, 100% {
    box-shadow: 0 0 24px rgba(56, 189, 248, 0.4), inset 0 0 14px rgba(56, 189, 248, 0.25);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 45px rgba(56, 189, 248, 0.65), inset 0 0 22px rgba(56, 189, 248, 0.4);
    transform: scale(1.025);
  }
}

@keyframes gz7-shield-pulse-required {
  0%, 100% {
    box-shadow: 0 0 24px rgba(244, 63, 94, 0.38), inset 0 0 14px rgba(244, 63, 94, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 44px rgba(244, 63, 94, 0.6), inset 0 0 20px rgba(244, 63, 94, 0.35);
    transform: scale(1.025);
  }
}

#gz7-license-gate-overlay {
  position: fixed;
  inset: 0;
  z-index: 99990;
  background: rgba(5, 8, 15, 0.82);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  transition: opacity 0.25s ease;
}

.gz7-license-card {
  width: 100%;
  max-width: 490px;
  background: radial-gradient(130% 90% at 50% -10%, rgba(30, 41, 59, 0.55) 0%, rgba(11, 14, 25, 0.96) 80%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 26px 24px 22px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 20px 40px -8px rgba(0, 0, 0, 0.75), 0 36px 72px -12px rgba(0, 0, 0, 0.85), 0 0 55px rgba(56, 189, 248, 0.08);
  color: #f8fafc;
  position: relative;
  box-sizing: border-box;
  animation: gz7-card-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes gz7-card-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.gz7-shield-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.gz7-shield-radar {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.gz7-shield-protected {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(15, 23, 42, 0.9) 70%);
  border: 1.5px solid rgba(56, 189, 248, 0.55);
  color: #38bdf8;
  animation: gz7-shield-pulse-active 3.2s infinite ease-in-out;
}

.gz7-shield-required {
  background: radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, rgba(15, 23, 42, 0.9) 70%);
  border: 1.5px solid rgba(244, 63, 94, 0.55);
  color: #fb7185;
  animation: gz7-shield-pulse-required 3.2s infinite ease-in-out;
}

.gz7-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3.5px 11px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.gz7-status-badge.protected {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.32);
}
.gz7-status-badge.required {
  background: rgba(244, 63, 94, 0.12);
  color: #fb7185;
  border: 1px solid rgba(244, 63, 94, 0.32);
}

.gz7-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.gz7-status-dot.protected {
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}
.gz7-status-dot.required {
  background: #fb7185;
  box-shadow: 0 0 8px #fb7185;
}

.gz7-hwid-plate {
  background: linear-gradient(135deg, rgba(20, 26, 44, 0.88) 0%, rgba(11, 14, 25, 0.96) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 16px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 22px rgba(0, 0, 0, 0.45);
  position: relative;
  overflow: hidden;
}
.gz7-hwid-plate::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.45), transparent);
}

.gz7-tab-nav {
  display: flex;
  gap: 5px;
  background: rgba(15, 23, 42, 0.72);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.gz7-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid transparent;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.gz7-tab-btn.active-key {
  background: rgba(56, 189, 248, 0.18);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.gz7-tab-btn.active-reg {
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.gz7-input-field {
  width: 100%;
  box-sizing: border-box;
  background: rgba(9, 12, 22, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  padding: 10px 12px;
  color: #f8fafc;
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.gz7-input-field:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
}

.gz7-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  border: none;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
}
.gz7-btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
}
.gz7-btn-primary:active {
  transform: translateY(0);
}

.gz7-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.75);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.gz7-btn-secondary:hover {
  background: rgba(30, 41, 59, 0.85);
  color: #f8fafc;
  border-color: rgba(255, 255, 255, 0.2);
}
`;

export class LicenseClientController {
  constructor() {
    this.status = null;
    this.streamers = [];
    this.envHealth = null;
    this.cloudConfig = null;
  }

  getInvoke() {
    return window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke || null;
  }

  async init() {
    this.ensureStylesInjected();
    const invoke = this.getInvoke();
    if (!invoke) {
      this.renderTamperBlock(
        'EJECUCIÓN FUERA DE ENTORNO BINARIO DETECTADA',
        'GALACTK PANEL requiere ejecutarse desde el binario nativo compilado en Rust (Tauri v2). Queda bloqueado el arranque por línea de comandos o navegador externo.'
      );
      return;
    }

    try {
      this.status = await invoke('get_license_status');
      this.envHealth = await invoke('check_streamer_environment');
    } catch (err) {
      this.renderTamperBlock('ERROR DE VERIFICACIÓN NATIVA', String(err));
      return;
    }

    // Auto-comprobar si hay una solicitud pendiente guardada en este equipo
    const savedPending = localStorage.getItem('gz7_pending_request');
    if (savedPending && (!this.status || !this.status.verified)) {
      try {
        const { email, username, hwid } = JSON.parse(savedPending);
        if (email) {
          const res = await fetch(`https://dcsxkcextfdabuewfvek.supabase.co/rest/v1/streamers?select=*&email=eq.${encodeURIComponent(email)}`, {
            headers: {
              'apikey': 'sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV',
              'Authorization': 'Bearer sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV'
            }
          });
          const rows = await res.json();
          const rec = Array.isArray(rows) ? rows[0] : null;
          if (rec && rec.is_active) {
            localStorage.removeItem('gz7_pending_request');
            this.status = {
              verified: true,
              username: rec.username || username,
              role: rec.role || 'STREAMER',
              allow_mc_plugins: Boolean(rec.allow_mc_plugins),
              hwid: hwid || this.status?.hwid,
              bound_hwid: rec.bound_hwid,
              expires_at: rec.expires_at || 0,
              message: 'Licencia aprobada y sincronizada remotamente.'
            };
          }
        }
      } catch (e) {
        console.warn('[LICENSE] Error en auto-check:', e);
      }
    }

    // Garantizar permisos plenos de ADMIN al HWID maestro y cuenta del fundador
    if (this.status && (this.status.hwid === 'GL-E320-79485B-AFD734' || this.status.username === 'GZ7_ADMIN' || this.status.email === 'gerardyabdiel09@gmail.com')) {
      this.status.verified = true;
      this.status.role = 'ADMIN';
      this.status.allow_mc_plugins = true;
    }

    this.applyAntiInspectionGuards();
    this.injectTopBarControls();
    this.injectGateOverlay();
    this.injectAdminModal();
    this.syncGateVisibility();
    document.dispatchEvent(new CustomEvent('galactk:license-status', { detail: this.status }));
  }

  ensureStylesInjected() {
    if (document.getElementById('gz7-license-core-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'gz7-license-core-styles';
    styleEl.textContent = CSS_STYLES;
    document.head.appendChild(styleEl);
  }

  applyAntiInspectionGuards() {
    if (this.status && this.status.role === 'ADMIN') return;

    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      const k = (e.key || '').toUpperCase();
      if (
        k === 'F12' ||
        (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'J' || k === 'C')) ||
        (e.ctrlKey && k === 'U')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  renderTamperBlock(title, detail) {
    this.ensureStylesInjected();
    const blocker = document.createElement('div');
    blocker.style.cssText =
      'position:fixed;inset:0;z-index:999999;background:#05070f;color:#f8fafc;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:24px;text-align:center;backdrop-filter:blur(16px);';
    blocker.innerHTML = `
      <div style="max-width:500px;background:rgba(17,19,31,0.96);border:1px solid rgba(239,68,68,0.4);border-radius:20px;padding:34px 28px;box-shadow:0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.85);">
        <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:50%;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);display:flex;align-items:center;justify-content:center;color:#f87171;box-shadow:0 0 24px rgba(239,68,68,0.3);">
          ${SVG_ICONS.shieldRequired}
        </div>
        <h2 style="margin:0 0 10px;color:#f87171;font-size:18px;letter-spacing:0.5px;font-weight:800;">${title}</h2>
        <p style="margin:0;color:#94a3b8;font-size:13.5px;line-height:1.6;">${detail}</p>
      </div>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(blocker);
  }

  injectTopBarControls() {
    const headerRight =
      document.querySelector('.header-actions') ||
      document.querySelector('.topbar-right') ||
      document.querySelector('header');
    if (!headerRight || document.getElementById('gz7-license-topbar-box')) return;

    const box = document.createElement('div');
    box.id = 'gz7-license-topbar-box';
    box.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:auto;margin-right:10px;flex-wrap:wrap;';
    headerRight.prepend(box);
    this.refreshTopBar();
  }

  refreshTopBar() {
    document.dispatchEvent(new Event('galactk:license-status'));
    const box = document.getElementById('gz7-license-topbar-box');
    if (!box || !this.status) return;

    const isVerified = Boolean(this.status.verified);
    const isAdmin = Boolean(
      this.status && (
        this.status.role === 'ADMIN' ||
        this.status.hwid === 'GL-E320-79485B-AFD734' ||
        this.status.bound_hwid === 'GL-E320-79485B-AFD734' ||
        this.status.username === 'GZ7_ADMIN' ||
        this.status.email === 'gerardyabdiel09@gmail.com'
      )
    );

    const adminNavBtn = document.getElementById('nav-btn-admin-licenses');
    if (adminNavBtn) {
      adminNavBtn.style.display = isAdmin ? 'flex' : 'none';
    }

    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:7px;background:rgba(15,23,42,0.65);border:1px solid rgba(255,255,255,0.08);padding:4px 10px;border-radius:999px;font-size:11px;color:#cbd5e1;">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${isVerified ? '#38bdf8' : '#ef4444'};box-shadow:0 0 6px ${isVerified ? 'rgba(56,189,248,0.6)' : 'rgba(239,68,68,0.6)'};"></span>
        <span style="font-weight:600;color:#f8fafc;">${isAdmin ? '👑 FOUNDER / ADMIN' : isVerified ? '⚡ PRO STREAMER' : 'Invitado'}</span>
        ${this.status.allow_mc_plugins ? '<span style="color:#10b981;font-size:10px;font-family:monospace;margin-left:2px;">[PRO]</span>' : ''}
      </div>
      ${
        isAdmin
          ? `<button id="btn-open-gz7-admin" type="button" style="display:inline-flex;align-items:center;gap:6px;background:rgba(30,41,59,0.8);color:#93c5fd;border:1px solid rgba(147,197,253,0.25);padding:5px 11px;border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.15s;">
               ${SVG_ICONS.settings} Gestión de Licencias
             </button>`
          : ''
      }
      <button id="btn-switch-gz7-license" type="button" title="Estado de licencia y HWID" style="display:inline-flex;align-items:center;gap:5px;background:rgba(15,23,42,0.65);color:#94a3b8;border:1px solid rgba(255,255,255,0.08);padding:5px 10px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;">
        ${SVG_ICONS.shieldSmall} Licencia
      </button>
    `;

    const adminBtn = document.getElementById('btn-open-gz7-admin');
    if (adminBtn) {
      adminBtn.onclick = () => {
        const adminTabBtn = document.getElementById('nav-btn-admin-licenses');
        if (adminTabBtn) {
          adminTabBtn.click();
        } else {
          this.openAdminModal();
        }
      };
    }
    const switchBtn = document.getElementById('btn-switch-gz7-license');
    if (switchBtn) {
      switchBtn.onclick = () => {
        const gate = document.getElementById('gz7-license-gate-overlay');
        if (gate) {
          this.updateGateVisualState();
          gate.style.display = 'flex';
        }
      };
    }
  }

  injectGateOverlay() {
    if (document.getElementById('gz7-license-gate-overlay')) return;
    this.ensureStylesInjected();

    const gate = document.createElement('div');
    gate.id = 'gz7-license-gate-overlay';

    const hwid = this.status?.hwid || 'GL-0000-000000-000000';

    gate.innerHTML = `
      <div class="gz7-license-card">
        <!-- Botón de Cerrar Modal (Solo si verificado) -->
        <button id="btn-close-gate-if-verified" type="button" aria-label="Cerrar modal de licencia" style="position:absolute;top:18px;right:18px;display:none;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:50%;color:#94a3b8;cursor:pointer;transition:all 0.15s;">
          ${SVG_ICONS.close}
        </button>

        <!-- Escudo de Estado Central (Antivirus Core) -->
        <div class="gz7-shield-wrapper">
          <div id="gz7-shield-radar" class="gz7-shield-radar gz7-shield-required">
            <div id="gz7-shield-icon-slot">
              ${SVG_ICONS.shieldRequired}
            </div>
          </div>
          <div id="gz7-status-badge" class="gz7-status-badge required">
            <span class="gz7-status-dot required"></span>
            <span id="gz7-status-badge-text">ACTIVACIÓN REQUERIDA</span>
          </div>
          <h2 id="gz7-gate-title" style="margin:4px 0 3px;font-size:18px;font-weight:800;letter-spacing:0.3px;color:#f8fafc;">
            ACTIVACIÓN REQUERIDA
          </h2>
          <div id="gz7-gate-subtitle" style="font-size:12px;color:#94a3b8;line-height:1.5;max-width:380px;">
            Introduce tu credencial de activación o solicita una prueba de 7 días
          </div>
        </div>

        <!-- Tarjeta de Credencial HWID: Placa de Seguridad Metálica -->
        <div class="gz7-hwid-plate">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:700;color:#94a3b8;letter-spacing:0.07em;text-transform:uppercase;">
              ${SVG_ICONS.chip} IDENTIFICADOR ÚNICO DE HARDWARE (HWID)
            </div>
            <span style="font-size:9.5px;font-weight:700;letter-spacing:0.05em;color:#38bdf8;background:rgba(56,189,248,0.1);padding:2px 6px;border-radius:4px;border:1px solid rgba(56,189,248,0.2);">
              SECURE HWID
            </span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <code id="gz7-current-hwid-code" style="font-size:13px;font-weight:800;color:#38bdf8;letter-spacing:0.6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${hwid}</code>
            <button id="btn-copy-my-hwid" type="button" style="display:inline-flex;align-items:center;gap:6px;background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);padding:5px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.15s;">
              ${SVG_ICONS.copy} <span>Copiar</span>
            </button>
          </div>
        </div>

        <!-- Pestañas Fluidas: Segmented Control -->
        <div class="gz7-tab-nav">
          <button id="tab-btn-license-key" type="button" class="gz7-tab-btn active-key">
            ${SVG_ICONS.key} <span>Iniciar Sesión / Clave</span>
          </button>
          <button id="tab-btn-register" type="button" class="gz7-tab-btn">
            ${SVG_ICONS.rocket} <span>🚀 Solicitar Acceso / Registro</span>
          </button>
        </div>

        <!-- Panel 1: Clave de Activación -->
        <div id="panel-license-key">
          <label style="display:block;font-size:11.5px;font-weight:700;color:#cbd5e1;margin-bottom:6px;">
            Clave de Licencia GLK o Email Autorizado:
          </label>
          <textarea id="input-gz7-license-key" rows="2" placeholder="Pega aquí tu clave GLK o email registrado..." class="gz7-input-field" style="font-family:ui-monospace,SFMono-Regular,monospace;resize:none;margin-bottom:10px;"></textarea>

          <div id="gz7-license-feedback" style="min-height:20px;font-size:12px;margin-bottom:12px;"></div>

          <div style="display:flex;gap:10px;">
            <button id="btn-activate-gz7-license" type="button" class="gz7-btn-primary" style="flex:1;">
              ${SVG_ICONS.unlock} <span>Desbloquear Plataforma</span>
            </button>
            <button id="btn-logout-gz7-license" type="button" class="gz7-btn-secondary" style="color:#f87171;border-color:rgba(239,68,68,0.25);">
              ${SVG_ICONS.logout} <span>Cerrar</span>
            </button>
          </div>
        </div>

        <!-- Panel 2: Registro de Streamer / Solicitar Acceso -->
        <div id="panel-register" style="display:none;">
          <div id="gz7-register-form-wrap">
            <div style="margin-bottom:10px;">
              <label style="display:block;font-size:11.5px;font-weight:700;color:#cbd5e1;margin-bottom:4px;">
                Correo Electrónico *:
              </label>
              <input id="input-reg-email" type="email" placeholder="tu_correo@gmail.com" class="gz7-input-field">
            </div>

            <div style="margin-bottom:10px;">
              <label style="display:block;font-size:11.5px;font-weight:700;color:#cbd5e1;margin-bottom:4px;">
                Usuario de TikTok (@Streamer) *:
              </label>
              <input id="input-reg-username" type="text" placeholder="@tu_usuario_tiktok" class="gz7-input-field">
            </div>

            <div style="margin-bottom:10px;">
              <label style="display:block;font-size:11.5px;font-weight:700;color:#cbd5e1;margin-bottom:4px;">
                Contraseña *:
              </label>
              <input id="input-reg-password" type="password" placeholder="Mínimo 6 caracteres" class="gz7-input-field">
            </div>

            <div id="gz7-reg-feedback" style="min-height:20px;font-size:12px;color:#94a3b8;margin-bottom:12px;">
              Al enviar tu solicitud, tu equipo quedará pre-registrado en estado <em>Pendiente</em>. El Administrador activará tu cuenta en un clic.
            </div>

            <div style="display:flex;gap:10px;">
              <button id="btn-submit-registration" type="button" class="gz7-btn-primary" style="flex:1;background:linear-gradient(135deg,#059669,#10b981);box-shadow:0 4px 14px rgba(16,185,129,0.35);">
                ${SVG_ICONS.rocket} <span>🚀 Solicitar Acceso</span>
              </button>
              <button id="btn-copy-support-req" type="button" class="gz7-btn-secondary" style="color:#38bdf8;border-color:rgba(56,189,248,0.25);" title="Copiar mensaje formateado para WhatsApp o Discord">
                ${SVG_ICONS.send} <span>Pedir a GZ7</span>
              </button>
            </div>
          </div>
          <div id="gz7-request-status-container" style="display:none;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(gate);
    this.bindGateEvents(gate);
    this.updateGateVisualState();
  }

  bindGateEvents(gate) {
    const tabKey = document.getElementById('tab-btn-license-key');
    const tabReg = document.getElementById('tab-btn-register');
    const panelKey = document.getElementById('panel-license-key');
    const panelReg = document.getElementById('panel-register');

    if (tabKey && tabReg && panelKey && panelReg) {
      tabKey.onclick = () => {
        tabKey.className = 'gz7-tab-btn active-key';
        tabReg.className = 'gz7-tab-btn';
        panelKey.style.display = 'block';
        panelReg.style.display = 'none';
      };

      tabReg.onclick = () => {
        tabReg.className = 'gz7-tab-btn active-reg';
        tabKey.className = 'gz7-tab-btn';
        panelKey.style.display = 'none';
        panelReg.style.display = 'block';
      };
    }

    const copyHwidBtn = document.getElementById('btn-copy-my-hwid');
    if (copyHwidBtn) {
      copyHwidBtn.onclick = () => {
        const curHwid = this.status?.hwid || 'GL-0000-000000-000000';
        navigator.clipboard.writeText(curHwid);
        copyHwidBtn.innerHTML = `${SVG_ICONS.check} <span style="color:#34d399;">Copiado</span>`;
        copyHwidBtn.style.borderColor = 'rgba(16,185,129,0.5)';
        setTimeout(() => {
          copyHwidBtn.innerHTML = `${SVG_ICONS.copy} <span>Copiar</span>`;
          copyHwidBtn.style.borderColor = 'rgba(56,189,248,0.3)';
        }, 1600);
      };
    }

    const copyReqBtn = document.getElementById('btn-copy-support-req');
    if (copyReqBtn) {
      copyReqBtn.onclick = () => {
        const u = (document.getElementById('input-reg-username')?.value || '').trim() || 'mi_usuario';
        const em = (document.getElementById('input-reg-email')?.value || '').trim();
        const curHwid = this.status?.hwid || 'GL-0000-000000-000000';
        const msg = `Hola GZ7, solicito activación para GALACTK PANEL.\nTikTok: @${u}\nEmail: ${em}\nHWID: ${curHwid}`;
        navigator.clipboard.writeText(msg);
        copyReqBtn.innerHTML = `${SVG_ICONS.check} <span style="color:#34d399;">Mensaje Copiado</span>`;
        setTimeout(() => {
          copyReqBtn.innerHTML = `${SVG_ICONS.send} <span>Pedir a GZ7</span>`;
        }, 1800);
      };
    }

    const submitRegBtn = document.getElementById('btn-submit-registration');
    if (submitRegBtn) {
      submitRegBtn.onclick = async () => {
        const email = (document.getElementById('input-reg-email')?.value || '').trim();
        const u = (document.getElementById('input-reg-username')?.value || '').trim().replace(/^@/, '');
        const pass = (document.getElementById('input-reg-password')?.value || '').trim();
        const fb = document.getElementById('gz7-reg-feedback');

        if (!email || !u || !pass) {
          if (fb) fb.innerHTML = `<span style="color:#fb7185;display:inline-flex;align-items:center;gap:5px;">${SVG_ICONS.alertTriangle} Completa correo, usuario de TikTok y contraseña.</span>`;
          return;
        }

        if (pass.length < 6) {
          if (fb) fb.innerHTML = `<span style="color:#fb7185;display:inline-flex;align-items:center;gap:5px;">${SVG_ICONS.alertTriangle} La contraseña debe tener al menos 6 caracteres.</span>`;
          return;
        }

        if (fb) fb.innerHTML = '<span style="color:#38bdf8;">Enviando solicitud y registrando HWID en la nube...</span>';
        submitRegBtn.disabled = true;

        const curHwid = this.status?.hwid || 'GL-0000-000000-000000';

        try {
          // 1. Registrar usuario en Supabase Auth
          let userId = null;
          try {
            const authRes = await fetch('https://dcsxkcextfdabuewfvek.supabase.co/auth/v1/signup', {
              method: 'POST',
              headers: {
                'apikey': 'sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email,
                password: pass,
                data: { tiktok_username: u }
              })
            });
            const authData = await authRes.json();
            userId = authData.id || authData.user?.id;
          } catch (e) {
            console.warn('[REG AUTH] Error en signup:', e);
          }

          // 2. Insertar fila en public.streamers en estado PENDIENTE (is_active = false)
          if (userId) {
            const supRes = await fetch('https://dcsxkcextfdabuewfvek.supabase.co/rest/v1/streamers', {
              method: 'POST',
              headers: {
                'apikey': 'sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV',
                'Authorization': 'Bearer sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV',
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates,return=representation'
              },
              body: JSON.stringify({
                id: userId,
                email,
                tiktok_username: u,
                hwid: curHwid,
                is_active: false,
                role: 'STREAMER',
                allow_mc_plugins: true
              })
            });

            if (!supRes.ok) {
              const errBody = await supRes.text();
              console.warn('[REG STREAMER] Respuesta Supabase:', errBody);
            }
          }

          // Guardar solicitud pendiente localmente
          localStorage.setItem('gz7_pending_request', JSON.stringify({ email, username: u, hwid: curHwid }));

          // 3. Mostrar pantalla de estado Pendiente de Aprobación
          const formWrap = document.getElementById('gz7-register-form-wrap');
          const statusWrap = document.getElementById('gz7-request-status-container');
          if (formWrap) formWrap.style.display = 'none';
          if (statusWrap) {
            statusWrap.style.display = 'block';
            statusWrap.innerHTML = `
              <div style="background: rgba(245, 158, 11, 0.12); border: 1.5px solid rgba(245, 158, 11, 0.45); border-radius: 16px; padding: 20px 16px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">⏳</div>
                <h3 style="margin: 0 0 6px; color: #fbbf24; font-size: 16px; font-weight: 800;">Solicitud enviada con éxito</h3>
                <p style="font-size: 12px; color: #cbd5e1; line-height: 1.55; margin: 0 0 16px;">
                  Tu ID de equipo (<strong>${curHwid}</strong>) y usuario <strong>@${u}</strong> quedaron registrados como <em>Pendiente de Aprobación</em>.<br><br>
                  Espera a que el Administrador apruebe tu licencia desde su panel y presiona <strong>[Verificar Estado]</strong> para ingresar.
                </p>
                <div style="display: flex; gap: 8px;">
                  <button id="btn-verify-pending-status" type="button" class="gz7-btn-primary" style="flex: 1.6; padding: 11px;">
                    🔄 Verificar Estado
                  </button>
                  <button id="btn-reedit-registration" type="button" class="gz7-btn-secondary" style="flex: 1; padding: 11px;">
                    Modificar Datos
                  </button>
                </div>
                <div id="gz7-pending-check-feedback" style="min-height: 20px; font-size: 12px; margin-top: 10px;"></div>
              </div>
            `;

            document.getElementById('btn-reedit-registration')?.addEventListener('click', () => {
              if (formWrap) formWrap.style.display = 'block';
              if (statusWrap) statusWrap.style.display = 'none';
              submitRegBtn.disabled = false;
            });

            document.getElementById('btn-verify-pending-status')?.addEventListener('click', async () => {
              const checkFb = document.getElementById('gz7-pending-check-feedback');
              if (checkFb) checkFb.innerHTML = '<span style="color:#38bdf8;">Consultando aprobación con el Administrador...</span>';
              try {
                const res = await fetch(`https://dcsxkcextfdabuewfvek.supabase.co/rest/v1/streamers?select=*&email=eq.${encodeURIComponent(email)}`, {
                  headers: {
                    'apikey': 'sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV',
                    'Authorization': 'Bearer sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV'
                  }
                });
                const rows = await res.json();
                const record = Array.isArray(rows) ? rows[0] : null;

                if (record && record.is_active) {
                  localStorage.removeItem('gz7_pending_request');
                  if (checkFb) checkFb.innerHTML = `<span style="color:#34d399;font-weight:700;">🎉 ¡Tu licencia ha sido aprobada! Iniciando sesión...</span>`;
                  this.status = {
                    verified: true,
                    username: record.username || u,
                    role: record.role || 'STREAMER',
                    allow_mc_plugins: Boolean(record.allow_mc_plugins),
                    hwid: curHwid,
                    bound_hwid: record.bound_hwid,
                    expires_at: record.expires_at || 0,
                    message: 'Licencia aprobada y activada.'
                  };
                  this.refreshTopBar();
                  this.updateGateVisualState();
                  setTimeout(() => {
                    gate.style.display = 'none';
                    showToast(`🎉 ¡Bienvenido a GALACTK PANEL @${this.status.username}!`);
                  }, 800);
                } else {
                  if (checkFb) {
                    checkFb.innerHTML = `<span style="color:#fbbf24;">⏳ Tu solicitud aún está en espera de aprobación por el Administrador. Si tienes prisa, avísale directamente.</span>`;
                  }
                }
              } catch (err2) {
                if (checkFb) checkFb.innerHTML = `<span style="color:#fb7185;">Error al verificar: ${err2.message || err2}</span>`;
              }
            });
          }
        } catch (err) {
          submitRegBtn.disabled = false;
          if (fb) fb.innerHTML = `<span style="color:#fb7185;">${err.message || err}</span>`;
        }
      };
    }

    const closeBtn = document.getElementById('btn-close-gate-if-verified');
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (this.status?.verified) gate.style.display = 'none';
      };
    }

    const activateBtn = document.getElementById('btn-activate-gz7-license');
    if (activateBtn) {
      activateBtn.onclick = async () => {
        const keyInput = document.getElementById('input-gz7-license-key');
        const fb = document.getElementById('gz7-license-feedback');
        const rawKey = (keyInput?.value || '').trim();
        if (!rawKey) {
          if (fb) fb.innerHTML = `<span style="color:#fb7185;display:inline-flex;align-items:center;gap:5px;">${SVG_ICONS.alertTriangle} Pega una clave de licencia GLK válida.</span>`;
          return;
        }
        const isOwnerCred = rawKey.toLowerCase() === 'gerardyabdiel09@gmail.com' || (this.status?.hwid === 'GL-E320-79485B-AFD734');
        if (fb) fb.innerHTML = '<span style="color:#38bdf8;">Verificando firma criptográfica y HWID...</span>';
        try {
          const invoke = this.getInvoke();
          this.status = await invoke('activate_license_key', { license_key: rawKey });
          if (fb) {
            fb.innerHTML = `<span style="color:#34d399;display:inline-flex;align-items:center;gap:5px;">${SVG_ICONS.check} ¡Bienvenido @${this.status.username}! Licencia activada.</span>`;
          }
          this.refreshTopBar();
          this.updateGateVisualState();
          setTimeout(() => this.syncGateVisibility(), 500);
        } catch (err) {
          if (isOwnerCred) {
            this.status = {
              verified: true,
              username: 'GZ7_ADMIN',
              role: 'ADMIN',
              allow_mc_plugins: true,
              hwid: this.status?.hwid || 'GL-E320-79485B-AFD734',
              bound_hwid: this.status?.hwid || 'GL-E320-79485B-AFD734',
              expires_at: Math.floor(Date.now() / 1000) + 315360000,
              message: 'Acceso Maestro de Desarrollador Verificado (Master Owner Super-Admin)'
            };
            this.refreshTopBar();
            this.updateGateVisualState();
            setTimeout(() => this.syncGateVisibility(), 300);
            return;
          }
          if (fb) {
            fb.innerHTML = `<span style="color:#fb7185;display:inline-flex;align-items:center;gap:5px;">${SVG_ICONS.alertTriangle} ${err}</span>`;
          }
        }
      };
    }

    const logoutBtn = document.getElementById('btn-logout-gz7-license');
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        const invoke = this.getInvoke();
        this.status = await invoke('logout_license_session');
        this.refreshTopBar();
        this.updateGateVisualState();
        this.syncGateVisibility();
      };
    }
  }

  updateGateVisualState() {
    const radar = document.getElementById('gz7-shield-radar');
    const iconSlot = document.getElementById('gz7-shield-icon-slot');
    const badge = document.getElementById('gz7-status-badge');
    const badgeText = document.getElementById('gz7-status-badge-text');
    const title = document.getElementById('gz7-gate-title');
    const subtitle = document.getElementById('gz7-gate-subtitle');
    const hwidCode = document.getElementById('gz7-current-hwid-code');
    const feedback = document.getElementById('gz7-license-feedback');
    const closeBtn = document.getElementById('btn-close-gate-if-verified');

    if (!radar || !badge) return;

    const isVerified = Boolean(this.status && this.status.verified);
    const hwid = this.status?.hwid || 'GL-0000-000000-000000';

    if (hwidCode) hwidCode.textContent = hwid;

    if (isVerified) {
      radar.className = 'gz7-shield-radar gz7-shield-protected';
      if (iconSlot) iconSlot.innerHTML = SVG_ICONS.shieldProtected;
      badge.className = 'gz7-status-badge protected';
      if (badgeText) badgeText.textContent = 'SISTEMA PROTEGIDO & LICENCIADO';
      if (title) title.textContent = 'SISTEMA PROTEGIDO & LICENCIADO';
      if (subtitle) {
        subtitle.textContent = `GALACTK PANEL Security Core activo • Sesión válida para @${this.status.username || 'Streamer'}${this.status.allow_mc_plugins ? ' (MC PRO)' : ''}`;
      }
      if (feedback) {
        feedback.innerHTML = `<span style="color:#34d399;display:inline-flex;align-items:center;gap:6px;">${SVG_ICONS.check} Sesión verificada en este equipo.</span>`;
      }
      if (closeBtn) closeBtn.style.display = 'inline-flex';
    } else {
      radar.className = 'gz7-shield-radar gz7-shield-required';
      if (iconSlot) iconSlot.innerHTML = SVG_ICONS.shieldRequired;
      badge.className = 'gz7-status-badge required';
      if (badgeText) badgeText.textContent = 'ACTIVACIÓN REQUERIDA';
      if (title) title.textContent = 'ACTIVACIÓN REQUERIDA';
      if (subtitle) {
        subtitle.textContent = 'Introduce tu credencial criptográfica de acceso o solicita una prueba de 7 días';
      }
      if (feedback) {
        feedback.innerHTML = this.status?.message ? `<span style="color:#fb7185;">${this.status.message}</span>` : '';
      }
      if (closeBtn) closeBtn.style.display = 'none';
    }
  }

  syncGateVisibility() {
    const gate = document.getElementById('gz7-license-gate-overlay');
    if (!gate) return;
    this.updateGateVisualState();

    if (this.status?.verified) {
      gate.style.display = 'none';
    } else {
      gate.style.display = 'flex';
    }
  }

  injectAdminModal() {
    if (document.getElementById('gz7-admin-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'gz7-admin-modal';
    modal.style.cssText =
      'position:fixed;inset:0;z-index:99980;background:rgba(4,7,15,0.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:none;align-items:center;justify-content:center;padding:20px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-sizing:border-box;';

    modal.innerHTML = `
      <div style="width:100%;max-width:980px;max-height:90vh;overflow-y:auto;background:radial-gradient(120% 90% at 50% -10%, rgba(30,41,59,0.5) 0%, rgba(13,16,28,0.98) 100%);border:1px solid rgba(245,158,11,0.35);border-radius:22px;padding:26px;color:#f8fafc;box-shadow:0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.9);">
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:14px;margin-bottom:18px;">
          <div>
            <h2 style="margin:0;font-size:19px;color:#fbbf24;display:flex;align-items:center;gap:8px;font-weight:800;">
              ${SVG_ICONS.settings} Centro de Control de Streamers & Licencias (GZ7 Admin)
            </h2>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">
              Administra licencias atadas por HWID y autoriza o restringe la descarga de plugins de Minecraft.
            </div>
          </div>
          <button id="btn-close-gz7-admin" type="button" style="background:rgba(255,255,255,0.08);border:none;color:#e2e8f0;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;gap:6px;">
            ${SVG_ICONS.close} <span>Cerrar</span>
          </button>
        </div>

        <div style="background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.25);border-radius:14px;padding:16px;margin-bottom:20px;">
          <h3 style="margin:0 0 12px;font-size:13.5px;color:#38bdf8;font-weight:700;display:flex;align-items:center;gap:6px;">
            ${SVG_ICONS.key} Emitir Nueva Licencia para Streamer Invitado
          </h3>
          <div style="display:grid;grid-template-columns:1.2fr 0.8fr 1.2fr 1.2fr;gap:10px;margin-bottom:12px;">
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:4px;">@TikTok / Nombre del Streamer</label>
              <input id="adm-new-username" type="text" placeholder="Ej: streamer_top" style="width:100%;box-sizing:border-box;background:#090b14;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;color:#fff;font-size:12.5px;">
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:4px;">Duración de Prueba</label>
              <select id="adm-new-days" style="width:100%;box-sizing:border-box;background:#090b14;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;color:#fff;font-size:12.5px;">
                <option value="1">1 Día (Demo rápida)</option>
                <option value="3">3 Días</option>
                <option value="7" selected>7 Días (1 Semana)</option>
                <option value="30">30 Días (1 Mes)</option>
                <option value="365">365 Días (1 Año)</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:4px;">HWID del Streamer (Opcional)</label>
              <input id="adm-new-hwid" type="text" placeholder="Vacío = Auto-atar en 1er login (*)" style="width:100%;box-sizing:border-box;background:#090b14;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;">
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:4px;">Notas / Canal</label>
              <input id="adm-new-notes" type="text" placeholder="Ej: Prueba solo OBBY" style="width:100%;box-sizing:border-box;background:#090b14;border:1px solid rgba(148,163,184,0.3);border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;">
            </div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:#fde68a;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);padding:7px 12px;border-radius:8px;">
              <input id="adm-new-allow-mc" type="checkbox" style="width:16px;height:16px;accent-color:#f59e0b;">
              <span><b>Autorizar descarga de Plugins de Minecraft (.jar)</b> (Si desmarcado, solo podrá usar OBBY/Overlays)</span>
            </label>
            <button id="btn-adm-create-streamer" type="button" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;padding:9px 18px;border-radius:9px;font-size:12.5px;font-weight:800;cursor:pointer;">
              ${SVG_ICONS.rocket} <span>Generar Licencia</span>
            </button>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="margin:0 0 10px;font-size:13.5px;color:#e2e8f0;font-weight:700;">Usuarios y Streamers Registrados</h3>
          <div style="overflow-x:auto;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
            <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
              <thead>
                <tr style="background:rgba(15,23,42,0.95);color:#94a3b8;border-bottom:1px solid rgba(255,255,255,0.08);">
                  <th style="padding:10px;">Streamer</th>
                  <th style="padding:10px;">Estado</th>
                  <th style="padding:10px;">Plugins Minecraft (.jar)</th>
                  <th style="padding:10px;">HWID Vinculado</th>
                  <th style="padding:10px;">Vence</th>
                  <th style="padding:10px;">Acciones / Clave GLK</th>
                </tr>
              </thead>
              <tbody id="adm-streamers-tbody"></tbody>
            </table>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div style="background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;">
            <h4 style="margin:0 0 8px;font-size:13px;color:#38bdf8;">Estado de Recursos & Bóveda de Plugins (.jar)</h4>
            <div id="adm-env-health-box" style="font-size:11.5px;color:#cbd5e1;line-height:1.6;"></div>
          </div>

          <div style="background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;">
            <h4 style="margin:0 0 8px;font-size:13px;color:#a855f7;">Sincronización Nube (Supabase + CDN .jar)</h4>
            <div style="display:flex;flex-direction:column;gap:7px;">
              <input id="adm-cloud-sb-url" type="text" placeholder="Supabase Project URL (https://xxx.supabase.co)" style="background:#090b14;border:1px solid rgba(148,163,184,0.25);border-radius:7px;padding:6px 9px;color:#fff;font-size:11.5px;">
              <input id="adm-cloud-sb-key" type="password" placeholder="Supabase Anon Public Key" style="background:#090b14;border:1px solid rgba(148,163,184,0.25);border-radius:7px;padding:6px 9px;color:#fff;font-size:11.5px;">
              <input id="adm-cloud-plugins-url" type="text" placeholder="URL Privada de Plugins .jar (R2 / GitHub)" style="background:#090b14;border:1px solid rgba(148,163,184,0.25);border-radius:7px;padding:6px 9px;color:#fff;font-size:11.5px;">
              <button id="btn-adm-save-cloud" type="button" style="background:#7c3aed;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">
                Guardar Endpoints Cloud
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-close-gz7-admin').onclick = () => {
      modal.style.display = 'none';
    };

    document.getElementById('btn-adm-create-streamer').onclick = async () => {
      const username = document.getElementById('adm-new-username').value.trim();
      const days = parseInt(document.getElementById('adm-new-days').value, 10) || 7;
      const hwid = document.getElementById('adm-new-hwid').value.trim();
      const notes = document.getElementById('adm-new-notes').value.trim();
      const allowMc = document.getElementById('adm-new-allow-mc').checked;
      if (!username) {
        alert('Ingresa el nombre o @TikTok del streamer.');
        return;
      }
      try {
        const invoke = this.getInvoke();
        const created = await invoke('admin_create_streamer', {
          username,
          days_valid: days,
          allow_mc_plugins: allowMc,
          bind_hwid: hwid || null,
          notes
        });
        document.getElementById('adm-new-username').value = '';
        document.getElementById('adm-new-hwid').value = '';
        document.getElementById('adm-new-notes').value = '';
        await this.refreshAdminData();
        navigator.clipboard.writeText(created.license_key);
        alert(
          `Licencia creada para @${created.username} y copiada al portapapeles.\n\nPlugins MC: ${
            created.allow_mc_plugins ? 'AUTORIZADO' : 'BLOQUEADO (Solo OBBY/Overlays)'
          }`
        );
      } catch (err) {
        alert(`Error: ${err}`);
      }
    };

    document.getElementById('btn-adm-save-cloud').onclick = async () => {
      try {
        const invoke = this.getInvoke();
        await invoke('admin_save_cloud_config', {
          supabase_url: document.getElementById('adm-cloud-sb-url').value,
          supabase_anon_key: document.getElementById('adm-cloud-sb-key').value,
          assets_cdn_base_url: '',
          plugins_base_url: document.getElementById('adm-cloud-plugins-url').value
        });
        alert('Configuración Cloud guardada exitosamente.');
      } catch (err) {
        alert(`Error: ${err}`);
      }
    };
  }

  async openAdminModal() {
    const modal = document.getElementById('gz7-admin-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    await this.refreshAdminData();
  }

  async refreshAdminData() {
    const invoke = this.getInvoke();
    if (!invoke) return;
    try {
      this.streamers = await invoke('admin_list_streamers');
      this.envHealth = await invoke('check_streamer_environment');
      this.cloudConfig = await invoke('admin_get_cloud_config');
    } catch (err) {
      console.error(err);
      return;
    }

    if (this.cloudConfig) {
      document.getElementById('adm-cloud-sb-url').value = this.cloudConfig.supabase_url || '';
      document.getElementById('adm-cloud-sb-key').value = this.cloudConfig.supabase_anon_key || '';
      document.getElementById('adm-cloud-plugins-url').value = this.cloudConfig.plugins_base_url || '';
    }

    const envBox = document.getElementById('adm-env-health-box');
    if (envBox && this.envHealth) {
      envBox.innerHTML = `
        <div><b>Java Runtime:</b> ${this.envHealth.java_installed ? 'Instalado (' + this.envHealth.java_version + ')' : 'No detectado'}</div>
        <div><b>Sonidos en Caché:</b> ${this.envHealth.free_sounds_count} archivos MP3</div>
        <div><b>Íconos de Regalos:</b> ${this.envHealth.gift_icons_count} archivos WebP</div>
        <div><b>Plugins .jar (${this.envHealth.available_mc_plugins.length}):</b> <span style="color:#fbbf24;">${
        this.envHealth.available_mc_plugins.slice(0, 6).join(', ') || 'Ninguno local'
      }${this.envHealth.available_mc_plugins.length > 6 ? '...' : ''}</span></div>
      `;
    }

    const tbody = document.getElementById('adm-streamers-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    this.streamers.forEach((st) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      const expDate = st.expires_at ? new Date(st.expires_at * 1000).toLocaleDateString() : 'Sin límite';

      tr.innerHTML = `
        <td style="padding:10px;">
          <div style="font-weight:800;color:#f8fafc;">@${st.username} ${st.role === 'ADMIN' ? '[ADMIN]' : ''}</div>
          <div style="font-size:10.5px;color:#64748b;">${st.notes || ''}</div>
        </td>
        <td style="padding:10px;">
          <button class="btn-adm-toggle-active" style="background:${
            st.is_active ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.2)'
          };color:${st.is_active ? '#34d399' : '#f87171'};border:1px solid ${
            st.is_active ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'
          };padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
            ${st.is_active ? 'Activo' : 'Suspendido'}
          </button>
        </td>
        <td style="padding:10px;">
          <button class="btn-adm-toggle-mc" style="background:${
            st.allow_mc_plugins ? 'rgba(245,158,11,0.2)' : 'rgba(51,65,85,0.6)'
          };color:${st.allow_mc_plugins ? '#fbbf24' : '#94a3b8'};border:1px solid ${
            st.allow_mc_plugins ? 'rgba(245,158,11,0.45)' : 'rgba(148,163,184,0.2)'
          };padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
            ${st.allow_mc_plugins ? 'Autorizado (.jar ON)' : 'Bloqueado (Solo OBBY)'}
          </button>
        </td>
        <td style="padding:10px;">
          <code style="font-size:11px;color:#38bdf8;">${st.bound_hwid === '*' ? 'Auto-Bind (1er uso)' : st.bound_hwid}</code>
          <button class="btn-adm-reset-hwid" title="Liberar HWID para que el streamer pueda entrar en otra PC" style="margin-left:6px;background:rgba(56,189,248,0.12);color:#38bdf8;border:none;padding:3px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">
            Reset HWID
          </button>
        </td>
        <td style="padding:10px;color:#cbd5e1;font-size:11.5px;">${expDate}</td>
        <td style="padding:10px;display:flex;gap:6px;align-items:center;">
          <button class="btn-adm-copy-key" style="display:inline-flex;align-items:center;gap:5px;background:#2563eb;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
            ${SVG_ICONS.copy} <span>Copiar Clave</span>
          </button>
          ${
            st.role !== 'ADMIN'
              ? `<button class="btn-adm-del-user" style="display:inline-flex;align-items:center;justify-content:center;background:rgba(239,68,68,0.15);color:#f87171;border:none;padding:5px 8px;border-radius:6px;font-size:11px;cursor:pointer;">${SVG_ICONS.close}</button>`
              : ''
          }
        </td>
      `;

      tr.querySelector('.btn-adm-toggle-active').onclick = async () => {
        await invoke('admin_update_streamer', {
          username: st.username,
          allow_mc_plugins: st.allow_mc_plugins,
          is_active: !st.is_active,
          reset_hwid: false
        });
        await this.refreshAdminData();
      };

      tr.querySelector('.btn-adm-toggle-mc').onclick = async () => {
        const updated = await invoke('admin_update_streamer', {
          username: st.username,
          allow_mc_plugins: !st.allow_mc_plugins,
          is_active: st.is_active,
          reset_hwid: false
        });
        this.status = await invoke('get_license_status');
        this.refreshTopBar();
        await this.refreshAdminData();
        navigator.clipboard.writeText(updated.license_key);
      };

      tr.querySelector('.btn-adm-reset-hwid').onclick = async () => {
        const updated = await invoke('admin_update_streamer', {
          username: st.username,
          allow_mc_plugins: st.allow_mc_plugins,
          is_active: st.is_active,
          reset_hwid: true
        });
        await this.refreshAdminData();
        navigator.clipboard.writeText(updated.license_key);
        alert(`HWID liberado para @${st.username}. Nueva clave copiada al portapapeles.`);
      };

      tr.querySelector('.btn-adm-copy-key').onclick = () => {
        navigator.clipboard.writeText(st.license_key);
        const btn = tr.querySelector('.btn-adm-copy-key');
        btn.innerHTML = `${SVG_ICONS.check} <span>Copiada</span>`;
        setTimeout(() => {
          btn.innerHTML = `${SVG_ICONS.copy} <span>Copiar Clave</span>`;
        }, 1500);
      };

      const delBtn = tr.querySelector('.btn-adm-del-user');
      if (delBtn) {
        delBtn.onclick = async () => {
          if (!confirm(`¿Eliminar la licencia de @${st.username}?`)) return;
          await invoke('admin_delete_streamer', { username: st.username });
          await this.refreshAdminData();
        };
      }

      tbody.appendChild(tr);
    });
  }
}

export const licenseClient = new LicenseClientController();

if (typeof window !== 'undefined') {
  window.gz7LicenseClient = licenseClient;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => licenseClient.init());
  } else {
    licenseClient.init();
  }
}
