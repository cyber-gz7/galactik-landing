import { songQueue } from './music-queue.js';
import { permissionManager } from './permission-manager.js';
import { commandDispatcher } from './command-dispatcher.js';
import { showToast } from '../core/toast.js';

export function initMusicMods() {
  const container = document.getElementById('tab-music-mods');
  if (!container) return;

  renderMusicModsView(container);
  bindMusicModsEvents(container);

  return {
    songQueue,
    permissionManager,
    commandDispatcher
  };
}

function renderMusicModsView(container) {
  container.innerHTML = `
    <div class="page-hero-title">
      <span class="eyebrow" style="color: #00f0ff; letter-spacing: 2px; font-weight: 800;">GALACTK STREAM ENGINE</span>
      <h1 style="font-family: 'Orbitron', sans-serif; font-size: 26px; color: #fff; margin: 4px 0 16px 0; display: flex; align-items: center; gap: 12px;">
        🎵 Reproductor de Música &amp; Control de Moderadores
        <span class="module-badge" style="background: rgba(0,240,255,0.15); color: #00f0ff; border: 1px solid rgba(0,240,255,0.4); font-size: 11px; padding: 2px 8px; border-radius: 6px;">V2.0 LIVE</span>
      </h1>
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">
        Control de solicitudes de canciones (YouTube IFrame API, límite 5 min), gestión de roles por chat (<code style="color: #38bdf8;">@usuario -&gt; mod</code>) y rate-limiting anti-spam.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px; align-items: start;">
      
      <!-- COLUMNA IZQUIERDA: REPRODUCTOR DE MÚSICA & QUEUE -->
      <div style="display: flex; flex-direction: column; gap: 18px;">
        
        <!-- CARD: NOW PLAYING & REPRODUCTOR -->
        <div class="section-card" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">🎧</span>
              <h2 style="font-size: 17px; font-weight: 700; color: #fff;">Reproduciendo Ahora</h2>
            </div>
            <div id="player-status-badge" style="background: rgba(148, 163, 184, 0.15); color: #94a3b8; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; text-transform: uppercase;">
              En Espera
            </div>
          </div>

          <!-- Miniatura & Título de Canción -->
          <div style="display: flex; gap: 16px; align-items: center; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 12px; margin-bottom: 16px;">
            <img id="np-thumb" src="https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" alt="Miniatura" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" />
            <div style="flex: 1; overflow: hidden;">
              <div id="np-track-title" style="font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                No hay canciones en reproducción
              </div>
              <div id="np-track-author" style="font-size: 13px; color: #38bdf8; margin-top: 2px;">
                Escribe <code style="background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px;">!sr &lt;link&gt;</code> en el chat para pedir música
              </div>
              <div id="np-track-req" style="font-size: 12px; color: #64748b; margin-top: 2px;">
                Pedido por: -
              </div>
            </div>
          </div>

          <!-- Controles de Reproducción -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" id="btn-music-play-pause" class="btn-primary" style="background: #0284c7; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span id="play-pause-icon">▶️</span> <span id="play-pause-text">Reanudar</span>
              </button>
              <button type="button" id="btn-music-skip" style="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                ⏭️ Saltar
              </button>
              <button type="button" id="btn-music-clear" style="background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); padding: 8px 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                🗑️ Limpiar Cola
              </button>
            </div>

            <!-- Control de Volumen -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">🔊</span>
              <input type="range" id="music-vol-slider" min="0" max="100" value="80" style="width: 100px; accent-color: #00f0ff; cursor: pointer;" />
              <span id="music-vol-label" style="font-size: 13px; font-weight: 700; color: #94a3b8; width: 34px;">80%</span>
            </div>
          </div>

          <!-- Contenedor oculto / embebido para el iframe de YouTube -->
          <div id="music-player-container" style="margin-top: 16px; border-radius: 8px; overflow: hidden; height: 160px; background: #000; border: 1px solid rgba(255,255,255,0.08);">
            <div id="yt-player-frame"></div>
          </div>
        </div>

        <!-- CARD: AGREGAR CANCIÓN & COLA EN ESPERA -->
        <div class="section-card" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <span>📋 Lista de Reproducción (SongQueue)</span>
            <span style="font-size: 12px; color: #fbbf24; font-weight: 600;">Máx 5 minutos por canción</span>
          </h2>

          <!-- Formulario rápido de Song Request -->
          <form id="sr-manual-form" style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="sr-manual-input" placeholder="Pega un link de YouTube o título... (ej. !sr https://youtu.be/...)" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 14px;" />
            <button type="submit" style="background: #00f0ff; color: #020617; border: none; border-radius: 8px; padding: 10px 18px; font-weight: 800; cursor: pointer; white-space: nowrap;">
              + Encolar
            </button>
          </form>

          <!-- Lista de canciones en espera -->
          <div id="song-queue-list" style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            <div style="text-align: center; color: #64748b; padding: 24px; font-size: 13px;">
              No hay canciones encoladas. Solicita una con <code style="color: #38bdf8;">!sr &lt;link&gt;</code>.
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMNA DERECHA: CONTROL DE MODERADORES, ROLES Y COOLDOWNS -->
      <div style="display: flex; flex-direction: column; gap: 18px;">
        
        <!-- CARD: GESTIÓN DE ROLES -->
        <div class="section-card" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️ Gestión de Roles (roles.json)</span>
          </h2>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
            Asigna privilegios a moderadores y fans MVP. También ejecutable en chat: <code style="color: #38bdf8;">@usuario -&gt; mod</code>.
          </p>

          <!-- Formulario Asignar Rol -->
          <form id="role-assign-form" style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
            <input type="text" id="role-user-input" placeholder="@usuario de TikTok" style="flex: 1; min-width: 140px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 12px; color: #fff; font-size: 13px;" />
            <select id="role-select" style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 12px; color: #fff; font-size: 13px; cursor: pointer;">
              <option value="mods">👑 MODERADOR (mods)</option>
              <option value="mvp">⭐ MVP (Animación)</option>
              <option value="vip">🔥 VIP (Privilegiado)</option>
              <option value="default">👤 DEFAULT (Estándar)</option>
            </select>
            <button type="submit" style="background: #3b82f6; color: #fff; border: none; border-radius: 8px; padding: 8px 14px; font-weight: 700; cursor: pointer;">
              Asignar
            </button>
          </form>

          <!-- Badges de Usuarios por Rol -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <span style="font-size: 12px; font-weight: 800; color: #60a5fa; text-transform: uppercase;">MODERADORES (mods):</span>
              <div id="roles-mods-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;"></div>
            </div>
            <div>
              <span style="font-size: 12px; font-weight: 800; color: #fbbf24; text-transform: uppercase;">CYBER MVP (mvp):</span>
              <div id="roles-mvp-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;"></div>
            </div>
            <div>
              <span style="font-size: 12px; font-weight: 800; color: #c084fc; text-transform: uppercase;">VIP:</span>
              <div id="roles-vip-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;"></div>
            </div>
          </div>
        </div>

        <!-- CARD: SISTEMA DE PUNTOS Y ANTI-SPAM (COOLDOWNS) -->
        <div class="section-card" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>⏱️ Anti-Spam &amp; Cooldowns Activos</span>
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Cooldown Individual</div>
              <div id="cd-individual-val" style="font-size: 20px; font-weight: 900; color: #00f0ff; margin-top: 4px;">30s</div>
              <div style="font-size: 11px; color: #64748b;">Por usuario (!alerta)</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Cooldown Global</div>
              <div id="cd-global-val" style="font-size: 20px; font-weight: 900; color: #f59e0b; margin-top: 4px;">10s</div>
              <div style="font-size: 11px; color: #64748b;">Protección CPU OBS</div>
            </div>
          </div>

          <!-- Disparadores de Prueba MVP -->
          <div style="margin-top: 10px;">
            <div style="font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px;">
              Pruebas Rápidas de Alertas MVP Verticales:
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="btn-test-alert" data-tipo="entrada" style="background: rgba(0,240,255,0.15); color: #00f0ff; border: 1px solid rgba(0,240,255,0.4); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
                👑 !alerta entrada
              </button>
              <button type="button" class="btn-test-alert" data-tipo="cyber" style="background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.4); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
                ⚡ !alerta cyber
              </button>
              <button type="button" class="btn-test-alert" data-tipo="gg" style="background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
                🔥 !alerta gg
              </button>
              <button type="button" class="btn-test-alert" data-tipo="clean" style="background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
                🎬 !alerta clean (Sin texto)
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

function bindMusicModsEvents(container) {
  // 1. Play / Pause
  const btnPlayPause = container.querySelector('#btn-music-play-pause');
  const playPauseText = container.querySelector('#play-pause-text');
  const playPauseIcon = container.querySelector('#play-pause-icon');
  const playerStatusBadge = container.querySelector('#player-status-badge');

  btnPlayPause?.addEventListener('click', () => {
    if (songQueue.isPlaying) {
      songQueue.pause();
    } else {
      if (!songQueue.currentTrack && songQueue.queue.length > 0) {
        songQueue.playNext();
      } else {
        songQueue.resume();
      }
    }
  });

  // 2. Skip
  const btnSkip = container.querySelector('#btn-music-skip');
  btnSkip?.addEventListener('click', () => {
    songQueue.skip('Botón Skip UI');
    showToast('⏭️ Canción saltada');
  });

  // 3. Clear Queue
  const btnClear = container.querySelector('#btn-music-clear');
  btnClear?.addEventListener('click', () => {
    songQueue.clearQueue();
    showToast('🗑️ Cola de canciones vaciada');
  });

  // 4. Volume Slider
  const volSlider = container.querySelector('#music-vol-slider');
  const volLabel = container.querySelector('#music-vol-label');
  volSlider?.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    volLabel.textContent = `${val}%`;
    songQueue.setVolume(val);
  });

  // 5. Manual Song Request Form
  const srForm = container.querySelector('#sr-manual-form');
  const srInput = container.querySelector('#sr-manual-input');
  srForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = srInput.value.trim();
    if (!val) return;
    srInput.value = '';
    const cleanQuery = val.replace(/^!sr\s+/i, '');
    const res = await songQueue.addRequest(cleanQuery, 'Streamer');
    if (res.ok) {
      showToast(res.playing ? `▶️ Reproduciendo: ${res.track.title}` : `🎵 Encolada: ${res.track.title}`);
    } else {
      showToast(`Error: ${res.error}`);
    }
  });

  // 6. Role Assignment Form
  const roleForm = container.querySelector('#role-assign-form');
  const roleUserInput = container.querySelector('#role-user-input');
  const roleSelect = container.querySelector('#role-select');
  roleForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = roleUserInput.value.trim();
    const role = roleSelect.value;
    if (!user) return;
    roleUserInput.value = '';
    const res = permissionManager.setRole(user, role);
    if (res.ok) {
      showToast(`👑 @${res.user} asignado como [${res.role.toUpperCase()}]`);
      updateRolesLists(container);
    } else {
      showToast(`Error: ${res.error}`);
    }
  });

  // 7. Test Alert Buttons
  container.querySelectorAll('.btn-test-alert').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.tipo;
      commandDispatcher.handleAlertCommand('Streamer', tipo);
    });
  });

  // Sincronización en tiempo real con eventos de SongQueue
  songQueue.on('playback:state', ({ state, track }) => {
    if (state === 'playing') {
      playPauseIcon.textContent = '⏸️';
      playPauseText.textContent = 'Pausar';
      playerStatusBadge.textContent = 'En Vivo';
      playerStatusBadge.style.background = 'rgba(34, 197, 94, 0.2)';
      playerStatusBadge.style.color = '#4ade80';
    } else {
      playPauseIcon.textContent = '▶️';
      playPauseText.textContent = 'Reanudar';
      playerStatusBadge.textContent = 'Pausado';
      playerStatusBadge.style.background = 'rgba(234, 179, 8, 0.2)';
      playerStatusBadge.style.color = '#facc15';
    }
  });

  songQueue.on('queue:updated', ({ queue, current }) => {
    updateNowPlayingUI(container, current);
    updateQueueListUI(container, queue);
  });

  permissionManager.on('roles:updated', () => {
    updateRolesLists(container);
  });

  // Carga inicial
  updateRolesLists(container);
  updateNowPlayingUI(container, songQueue.currentTrack);
  updateQueueListUI(container, songQueue.queue);
}

function updateNowPlayingUI(container, track) {
  const titleEl = container.querySelector('#np-track-title');
  const authorEl = container.querySelector('#np-track-author');
  const reqEl = container.querySelector('#np-track-req');
  const thumbEl = container.querySelector('#np-thumb');

  if (track) {
    titleEl.textContent = track.title || 'Canción Activa';
    authorEl.textContent = track.author || 'YouTube';
    reqEl.textContent = `Pedido por: @${track.requestedBy || 'Streamer'}`;
    if (track.thumbnail) thumbEl.src = track.thumbnail;
  } else {
    titleEl.textContent = 'No hay canciones en reproducción';
    authorEl.textContent = 'Escribe !sr <link> en el chat para pedir música';
    reqEl.textContent = 'Pedido por: -';
    thumbEl.src = 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg';
  }
}

function updateQueueListUI(container, queue) {
  const listEl = container.querySelector('#song-queue-list');
  if (!listEl) return;

  if (!queue || queue.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; color: #64748b; padding: 24px; font-size: 13px;">
        No hay canciones encoladas. Solicita una con <code style="color: #38bdf8;">!sr &lt;link&gt;</code>.
      </div>
    `;
    return;
  }

  listEl.innerHTML = queue.map((t, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px 12px;">
      <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
        <span style="font-size: 12px; font-weight: 800; color: #00f0ff;">#${idx + 1}</span>
        <div style="overflow: hidden;">
          <div style="font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px;">
            ${escapeHtml(t.title)}
          </div>
          <div style="font-size: 11px; color: #94a3b8;">
            Por: @${escapeHtml(t.requestedBy)}
          </div>
        </div>
      </div>
      <button type="button" class="btn-remove-song" data-id="${t.id}" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 14px;" title="Eliminar de la cola">
        ✕
      </button>
    </div>
  `).join('');

  listEl.querySelectorAll('.btn-remove-song').forEach(btn => {
    btn.addEventListener('click', () => {
      songQueue.removeTrack(btn.dataset.id);
      showToast('Canción retirada de la lista');
    });
  });
}

function updateRolesLists(container) {
  const modsList = container.querySelector('#roles-mods-list');
  const mvpList = container.querySelector('#roles-mvp-list');
  const vipList = container.querySelector('#roles-vip-list');

  const renderChips = (users, color, bg) => {
    if (!users || users.length === 0) {
      return '<span style="font-size: 11px; color: #64748b;">(Sin usuarios asignados)</span>';
    }
    return users.map(u => `
      <span style="display: inline-flex; align-items: center; gap: 4px; background: ${bg}; color: ${color}; border: 1px solid ${color}40; border-radius: 999px; padding: 2px 8px; font-size: 12px; font-weight: 700;">
        @${escapeHtml(u)}
        <span class="btn-remove-role" data-user="${escapeHtml(u)}" style="cursor: pointer; opacity: 0.6; margin-left: 2px;">×</span>
      </span>
    `).join('');
  };

  if (modsList) modsList.innerHTML = renderChips(permissionManager.roles.mods, '#60a5fa', 'rgba(59,130,246,0.15)');
  if (mvpList) mvpList.innerHTML = renderChips(permissionManager.roles.mvp, '#fbbf24', 'rgba(245,158,11,0.15)');
  if (vipList) vipList.innerHTML = renderChips(permissionManager.roles.vip, '#c084fc', 'rgba(168,85,247,0.15)');

  container.querySelectorAll('.btn-remove-role').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = btn.dataset.user;
      permissionManager.setRole(u, 'default');
      showToast(`Rol de @${u} restablecido a default`);
    });
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
