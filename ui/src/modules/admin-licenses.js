// Módulo de Administración de Licencias & Streamers — GALACTK PANEL
// Aprobación en 1 Clic, Gestión de HWID y Control de Duración en Supabase sin SQL

import { showToast } from '../core/toast.js';

const SUPABASE_URL = 'https://dcsxkcextfdabuewfvek.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV';

async function supabaseApi(endpoint, method = 'GET', body = null) {
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const opts = { method, headers };
  if (body) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${SUPABASE_URL}${endpoint}`, opts);
  if (!res.ok) {
    let errDetail = '';
    try {
      const j = await res.json();
      errDetail = j.message || j.error || j.hint || JSON.stringify(j);
    } catch (_) {
      errDetail = await res.text();
    }
    throw new Error(errDetail || `HTTP Error ${res.status}`);
  }

  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}

export class AdminLicensesModule {
  constructor(context = {}) {
    this.context = context;
    this.streamers = [];
    this.isLoading = false;
    this.searchFilter = '';
    this.container = null;
    this.refreshTimer = null;
  }

  init() {
    this.container = document.getElementById('admin-licenses-view-container');
    this.render();
    this.loadStreamers();
  }

  async loadStreamers(silent = false) {
    if (this.isLoading && !silent) return;
    this.isLoading = true;
    if (!silent) this.renderLoadingState();

    try {
      const data = await supabaseApi('/rest/v1/streamers?select=*&order=created_at.desc');
      this.streamers = Array.isArray(data) ? data : [];
      this.updateSidebarBadge();
      this.render();
    } catch (err) {
      console.error('[ADMIN LICENSES] Error cargando streamers:', err);
      if (!silent) {
        showToast(`⚠️ Error al cargar streamers: ${err?.message || err}`);
        this.renderErrorState(err?.message || String(err));
      }
    } finally {
      this.isLoading = false;
    }
  }

  updateSidebarBadge() {
    const pendingCount = this.streamers.filter(s => !s.is_active).length;
    const badge = document.getElementById('badge-admin-pending-count');
    if (badge) {
      if (pendingCount > 0) {
        badge.textContent = `🔔 ${pendingCount} PENDIENTE${pendingCount > 1 ? 'S' : ''}`;
        badge.style.background = 'rgba(245, 158, 11, 0.25)';
        badge.style.color = '#fbbf24';
        badge.style.borderColor = 'rgba(245, 158, 11, 0.6)';
      } else {
        badge.textContent = 'ADMIN';
        badge.style.background = 'rgba(56, 189, 248, 0.15)';
        badge.style.color = '#38bdf8';
        badge.style.borderColor = 'rgba(56, 189, 248, 0.35)';
      }
    }
  }

  formatTimeRemaining(expiresAt) {
    if (!expiresAt || expiresAt === 0 || Number(expiresAt) === 0) {
      return { label: '♾️ Vitalicio / Ilimitado', status: 'vitalicio', color: '#00ffa3' };
    }
    const now = Math.floor(Date.now() / 1000);
    const diff = Number(expiresAt) - now;
    if (diff <= 0) {
      return { label: '⚠️ Licencia Expirada', status: 'expired', color: '#ff2a5f' };
    }
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    if (days > 0) {
      return { label: `⏳ ${days}d ${hours}h restantes`, status: 'active', color: '#38bdf8' };
    }
    const mins = Math.floor((diff % 3600) / 60);
    return { label: `⚡ ${hours}h ${mins}m restantes`, status: 'ending_soon', color: '#fbbf24' };
  }

  renderLoadingState() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-muted);">
        <div style="font-size: 32px; animation: pulse 1s infinite;">🛰️</div>
        <div style="margin-top: 12px; font-family: var(--font-display); font-size: 15px; color: var(--neon-cyan);">
          Sincronizando con Supabase Cloud...
        </div>
      </div>
    `;
  }

  renderErrorState(msg) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="padding: 30px; background: rgba(255,42,95,0.08); border: 1.5px solid var(--color-danger); border-radius: 14px; text-align: center; margin: 20px 0;">
        <div style="font-size: 28px; color: var(--color-danger); margin-bottom: 8px;">⚠️</div>
        <h3 style="color: #fff; margin: 0 0 8px;">Error al conectar con la base de datos de licencias</h3>
        <p style="color: var(--text-muted); font-size: 13px; max-width: 600px; margin: 0 auto 16px;">${msg}</p>
        <button type="button" class="btn-primary" id="btn-admin-retry-fetch" style="padding: 8px 18px;">
          🔄 Reintentar Conexión
        </button>
      </div>
    `;
    document.getElementById('btn-admin-retry-fetch')?.addEventListener('click', () => this.loadStreamers());
  }

  render() {
    this.container = document.getElementById('admin-licenses-view-container');
    if (!this.container) return;

    const pending = this.streamers.filter(s => !s.is_active);
    const active = this.streamers.filter(s => s.is_active);

    const filteredActive = this.searchFilter.trim()
      ? active.filter(s => {
          const q = this.searchFilter.toLowerCase();
          return (s.username || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
        })
      : active;

    this.container.innerHTML = `
      <div class="admin-licenses-layout">
        <!-- Hero Header -->
        <div class="page-hero-title">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span>👑 GESTIÓN DE LICENCIAS &amp; STREAMERS (PANEL ADMIN)</span>
            ${pending.length > 0 ? `<span class="btn-micro" style="background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.6); color: #fbbf24; font-size: 11px;">🔔 ${pending.length} SOLICITUDES PENDIENTES</span>` : ''}
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn-secondary" id="btn-admin-refresh-streamers" style="display: inline-flex; align-items: center; gap: 6px;">
              🔄 <span>Actualizar</span>
            </button>
            <button type="button" class="btn-primary" id="btn-admin-open-create-modal" style="display: inline-flex; align-items: center; gap: 6px;">
              ➕ <span>Crear Streamer Manual</span>
            </button>
          </div>
        </div>

        <div class="info-banner-box" style="margin-bottom: 20px; border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.06);">
          Administra en vivo los accesos de tu agencia. Cuando un nuevo streamer se descarga el instalador y solicita acceso, su máquina aparece inmediatamente en <strong>Solicitudes Pendientes</strong>. Puedes aprobarlo en 1 clic eligiendo los días que durará su prueba sin escribir código SQL.
        </div>

        <!-- ================= SECCIÓN 1: SOLICITUDES PENDIENTES ================= -->
        <div class="section-card" style="margin-bottom: 22px; border: 1.5px solid ${pending.length > 0 ? 'rgba(245,158,11,0.6)' : 'var(--border-subtle)'}; box-shadow: ${pending.length > 0 ? '0 0 25px rgba(245,158,11,0.1)' : 'none'};">
          <div class="panel-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="panel-title" style="color: #fbbf24;">🔔 1. Solicitudes Pendientes de Aprobación (${pending.length})</span>
            </div>
            <span style="font-size: 12px; color: var(--text-muted);">Los streamers en esta lista esperan tu visto bueno para poder entrar al panel.</span>
          </div>

          ${pending.length === 0 ? `
            <div style="padding: 24px; text-align: center; color: var(--text-muted); background: rgba(10,15,24,0.5); border-radius: 12px;">
              <div style="font-size: 26px; margin-bottom: 6px;">✨</div>
              <strong style="color: #fff; font-size: 14px;">No hay solicitudes pendientes en este momento</strong>
              <p style="font-size: 12px; margin: 4px 0 0;">Cada vez que un streamer nuevo solicite acceso en la ventana de login, aparecerá aquí al instante.</p>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${pending.map(s => this.renderPendingItem(s)).join('')}
            </div>
          `}
        </div>

        <!-- ================= SECCIÓN 2: STREAMERS ACTIVOS ================= -->
        <div class="section-card">
          <div class="panel-header" style="flex-wrap: wrap; gap: 12px;">
            <div>
              <span class="panel-title">🟢 2. Streamers Activos &amp; Licencias en Curso (${active.length})</span>
              <p style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">
                Añade más días con un clic, libera la máquina (HWID) si formateó o cambió de PC, o suspende el acceso al instante.
              </p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="text" id="admin-search-streamers" class="input-field" placeholder="🔍 Filtrar por @usuario o email..." value="${this.searchFilter}" style="width: 250px; font-size: 12px; padding: 7px 12px;" />
            </div>
          </div>

          ${active.length === 0 ? `
            <div style="padding: 24px; text-align: center; color: var(--text-muted);">
              No hay streamers activos registrados aún. Haz clic en <strong>[➕ Crear Streamer Manual]</strong> para añadir el primero.
            </div>
          ` : `
            <div style="overflow-x: auto;">
              <table class="custom-table" style="font-size: 12.5px;">
                <thead>
                  <tr>
                    <th>Streamer / TikTok</th>
                    <th>Correo</th>
                    <th>Vigencia / Tiempo</th>
                    <th>Equipo (HWID)</th>
                    <th>MC Plugins</th>
                    <th style="text-align: right;">Acciones de 1 Clic</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredActive.map(s => this.renderActiveRow(s)).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>

      <!-- Modal Crear Streamer Manual -->
      <div id="modal-admin-create-streamer" class="modal-overlay" style="display: none; z-index: 10006;">
        <div class="modal-card" style="max-width: 520px;">
          <div class="panel-header" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px; margin-bottom: 14px;">
            <div>
              <span class="panel-title">➕ Alta Manual de Streamer</span>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Crea y activa una licencia directa sin código SQL</div>
            </div>
            <button type="button" id="btn-close-admin-create-modal" class="btn-secondary" style="padding: 4px 10px;">✕</button>
          </div>

          <form id="form-admin-create-streamer" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                Correo Electrónico *
              </label>
              <input type="email" id="modal-adm-email" class="input-field" placeholder="streamer@gmail.com" required style="width: 100%;" />
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                Usuario de TikTok (@Username) *
              </label>
              <input type="text" id="modal-adm-username" class="input-field" placeholder="@streamer_tiktok" required style="width: 100%;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                  Duración de Licencia
                </label>
                <select id="modal-adm-duration" class="table-select" style="width: 100%; padding: 8px;">
                  <option value="7">7 Días (1 Semana)</option>
                  <option value="15">15 Días (2 Semanas)</option>
                  <option value="30" selected>30 Días (1 Mes)</option>
                  <option value="90">90 Días (3 Meses)</option>
                  <option value="365">365 Días (1 Año)</option>
                  <option value="0">♾️ Vitalicio / Permanente</option>
                </select>
              </div>

              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">
                  HWID (PC Asignada)
                </label>
                <input type="text" id="modal-adm-hwid" class="input-field" value="*" placeholder="* = Auto-enlazar en 1er login" style="width: 100%;" />
              </div>
            </div>

            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; margin-top: 4px;">
              <input type="checkbox" id="modal-adm-allow-mc" checked />
              <span>Habilitar Plugins de Minecraft RCON &amp; Servidor</span>
            </label>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button type="submit" class="btn-primary" style="flex: 2; padding: 11px;">
                🚀 Guardar y Activar Inmediatamente
              </button>
              <button type="button" class="btn-secondary" id="btn-cancel-admin-create" style="flex: 1;">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderPendingItem(s) {
    const hwid = s.bound_hwid || '*';
    const id = s.id;
    return `
      <div class="card-panel" style="padding: 14px 18px; border: 1px solid rgba(245,158,11,0.3); background: rgba(16,24,38,0.7); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 14px; min-width: 240px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: rgba(245,158,11,0.15); border: 1.5px solid rgba(245,158,11,0.4); display: flex; align-items: center; justify-content: center; font-size: 20px;">
            👤
          </div>
          <div>
            <div style="font-weight: 900; font-size: 15px; color: #fff;">@${s.username || 'streamer'}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${s.email || 'Sin correo'}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--neon-cyan); margin-top: 2px;">
              HWID: ${hwid}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 11.5px; color: var(--text-muted);">Duración:</span>
            <select class="table-select pending-duration-select" data-id="${id}" style="padding: 6px 8px; font-size: 12px;">
              <option value="7" selected>7 Días (Semana)</option>
              <option value="15">15 Días (Quincena)</option>
              <option value="30">30 Días (1 Mes)</option>
              <option value="0">♾️ Vitalicio</option>
            </select>
          </div>

          <button type="button" class="btn-primary btn-approve-streamer" data-id="${id}" style="padding: 8px 16px; font-size: 12.5px; font-weight: 800; background: linear-gradient(135deg, #059669, #10b981);">
            ✅ Aprobar Licencia
          </button>
          <button type="button" class="btn-danger btn-reject-streamer" data-id="${id}" data-name="${s.username}" style="padding: 8px 12px; font-size: 12px;">
            🗑️ Rechazar
          </button>
        </div>
      </div>
    `;
  }

  renderActiveRow(s) {
    const timeInfo = this.formatTimeRemaining(s.expires_at);
    const hwidDisplay = !s.bound_hwid || s.bound_hwid === '*' ? '🌐 Libre (*)' : s.bound_hwid;
    const isLockedHwid = s.bound_hwid && s.bound_hwid !== '*';

    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: #fff;">@${s.username || 'streamer'}</div>
          ${s.role === 'ADMIN' ? '<span class="btn-micro" style="background: rgba(245,158,11,0.2); color:#fbbf24; border-color: rgba(245,158,11,0.4); margin-top:2px;">ADMIN GZ7</span>' : ''}
        </td>
        <td style="color: var(--text-muted); font-size: 12px;">${s.email || '-'}</td>
        <td>
          <span style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; color: ${timeInfo.color}; background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 6px;">
            ${timeInfo.label}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <code style="font-size: 11px; color: ${isLockedHwid ? 'var(--neon-cyan)' : '#10b981'}; font-family: var(--font-mono);">${hwidDisplay}</code>
            ${isLockedHwid ? `
              <button type="button" class="btn-micro btn-reset-hwid" data-id="${s.id}" data-name="${s.username}" title="Liberar PC para que pueda vincular una nueva máquina" style="padding: 2px 6px;">
                🔄 Liberar PC
              </button>
            ` : ''}
          </div>
        </td>
        <td>
          <span style="color: ${s.allow_mc_plugins ? '#10b981' : 'var(--text-muted)'}; font-size: 11.5px; font-weight: 700;">
            ${s.allow_mc_plugins ? '✔ Sí (PRO)' : '✖ Solo Obby'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px; align-items: center;">
            <button type="button" class="btn-secondary btn-add-time" data-id="${s.id}" data-days="7" title="Sumar 7 días" style="padding: 5px 8px; font-size: 11px;">
              +7d
            </button>
            <button type="button" class="btn-secondary btn-add-time" data-id="${s.id}" data-days="30" title="Sumar 30 días" style="padding: 5px 8px; font-size: 11px;">
              +30d
            </button>
            <button type="button" class="btn-secondary btn-suspend-streamer" data-id="${s.id}" data-name="${s.username}" title="Suspender temporalmente" style="padding: 5px 8px; font-size: 11px; color: #fbbf24;">
              ⛔ Suspender
            </button>
            <button type="button" class="btn-danger btn-delete-streamer" data-id="${s.id}" data-name="${s.username}" title="Eliminar streamer" style="padding: 5px 8px; font-size: 11px;">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  bindEvents() {
    document.getElementById('btn-admin-refresh-streamers')?.addEventListener('click', () => {
      this.loadStreamers();
      showToast('🔄 Lista de streamers actualizada');
    });

    const searchInput = document.getElementById('admin-search-streamers');
    searchInput?.addEventListener('input', e => {
      this.searchFilter = e.target.value;
      this.render();
      const newInp = document.getElementById('admin-search-streamers');
      if (newInp) {
        newInp.focus();
        newInp.setSelectionRange(newInp.value.length, newInp.value.length);
      }
    });

    // 1. Aprobar Solicitud
    this.container.querySelectorAll('.btn-approve-streamer').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const select = this.container.querySelector(`.pending-duration-select[data-id="${id}"]`);
        const days = Number(select?.value) || 7;
        btn.disabled = true;
        btn.textContent = 'Aprobando...';
        try {
          const expiresAt = days === 0 ? 0 : Math.floor(Date.now() / 1000) + (days * 86400);
          await supabaseApi(`/rest/v1/streamers?id=eq.${id}`, 'PATCH', {
            is_active: true,
            expires_at: expiresAt,
            allow_mc_plugins: true
          });
          showToast(`✅ Licencia aprobada con éxito (${days === 0 ? 'Vitalicia' : days + ' días'})`);
          await this.loadStreamers(true);
        } catch (e) {
          showToast(`⚠️ Error al aprobar: ${e?.message || e}`);
          btn.disabled = false;
          btn.textContent = '✅ Aprobar Licencia';
        }
      });
    });

    // 2. Rechazar / Eliminar Solicitud
    this.container.querySelectorAll('.btn-reject-streamer, .btn-delete-streamer').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name || 'el streamer';
        if (!confirm(`¿Estás seguro de eliminar a @${name}?`)) return;
        try {
          await supabaseApi(`/rest/v1/streamers?id=eq.${id}`, 'DELETE');
          showToast(`🗑️ @${name} eliminado de la base de datos.`);
          await this.loadStreamers(true);
        } catch (e) {
          showToast(`⚠️ Error al eliminar: ${e?.message || e}`);
        }
      });
    });

    // 3. Sumar tiempo (+7d, +30d)
    this.container.querySelectorAll('.btn-add-time').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const addDays = Number(btn.dataset.days) || 7;
        const streamer = this.streamers.find(s => s.id === id);
        if (!streamer) return;
        try {
          const now = Math.floor(Date.now() / 1000);
          const currentExp = Number(streamer.expires_at) || now;
          const base = currentExp > now ? currentExp : now;
          const newExp = base + (addDays * 86400);
          await supabaseApi(`/rest/v1/streamers?id=eq.${id}`, 'PATCH', {
            expires_at: newExp,
            is_active: true
          });
          showToast(`⏳ +${addDays} días sumados a @${streamer.username}`);
          await this.loadStreamers(true);
        } catch (e) {
          showToast(`⚠️ Error al sumar tiempo: ${e?.message || e}`);
        }
      });
    });

    // 4. Liberar PC (Reset HWID)
    this.container.querySelectorAll('.btn-reset-hwid').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        try {
          await supabaseApi(`/rest/v1/streamers?id=eq.${id}`, 'PATCH', {
            bound_hwid: '*'
          });
          showToast(`🔄 PC liberada para @${name}. Podrá iniciar sesión en su nueva máquina.`);
          await this.loadStreamers(true);
        } catch (e) {
          showToast(`⚠️ Error al liberar PC: ${e?.message || e}`);
        }
      });
    });

    // 5. Suspender Streamer
    this.container.querySelectorAll('.btn-suspend-streamer').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        try {
          await supabaseApi(`/rest/v1/streamers?id=eq.${id}`, 'PATCH', {
            is_active: false
          });
          showToast(`⛔ @${name} suspendido. No podrá ingresar hasta que lo reactives.`);
          await this.loadStreamers(true);
        } catch (e) {
          showToast(`⚠️ Error al suspender: ${e?.message || e}`);
        }
      });
    });

    // 6. Modal Crear Streamer Manual
    const modal = document.getElementById('modal-admin-create-streamer');
    document.getElementById('btn-admin-open-create-modal')?.addEventListener('click', () => {
      if (modal) modal.style.display = 'flex';
    });
    document.getElementById('btn-close-admin-create-modal')?.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
    document.getElementById('btn-cancel-admin-create')?.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });

    document.getElementById('form-admin-create-streamer')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('modal-adm-email')?.value.trim();
      const username = document.getElementById('modal-adm-username')?.value.trim().replace(/^@/, '');
      const days = Number(document.getElementById('modal-adm-duration')?.value) || 30;
      const hwid = document.getElementById('modal-adm-hwid')?.value.trim() || '*';
      const allowMc = Boolean(document.getElementById('modal-adm-allow-mc')?.checked);

      if (!email || !username) {
        showToast('⚠️ Completa correo y usuario de TikTok');
        return;
      }

      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creando streamer...';
      }

      try {
        const expiresAt = days === 0 ? 0 : Math.floor(Date.now() / 1000) + (days * 86400);
        await supabaseApi('/rest/v1/streamers', 'POST', {
          email,
          username,
          bound_hwid: hwid,
          role: 'STREAMER',
          allow_mc_plugins: allowMc,
          is_active: true,
          expires_at: expiresAt
        });
        showToast(`🎉 ¡Streamer @${username} creado y activado!`);
        if (modal) modal.style.display = 'none';
        e.target.reset();
        await this.loadStreamers(true);
      } catch (err) {
        showToast(`⚠️ Error al crear streamer: ${err?.message || err}`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 Guardar y Activar Inmediatamente';
        }
      }
    });
  }
}

export function initAdminLicenses(context) {
  const adminMod = new AdminLicensesModule(context);
  adminMod.init();
  return {
    render: () => adminMod.loadStreamers(),
    module: adminMod
  };
}
