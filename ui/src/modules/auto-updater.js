import { showToast } from '../core/toast.js';

const CURRENT_VERSION = '2.0.3';
const GITHUB_REPO = 'cyber-gz7/galactik-landing';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

let latestReleaseInfo = null;
let isChecking = false;
let isDownloading = false;
let progressUnlisten = null;

function parseSemver(vStr = '') {
  const clean = String(vStr).trim().replace(/^[vV]/, '');
  const parts = clean.split('-')[0].split('.').map(n => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  return {
    major: parts[0],
    minor: parts[1],
    patch: parts[2],
    raw: clean
  };
}

function isNewer(remoteStr, localStr) {
  const r = parseSemver(remoteStr);
  const l = parseSemver(localStr);
  if (r.major > l.major) return true;
  if (r.major < l.major) return false;
  if (r.minor > l.minor) return true;
  if (r.minor < l.minor) return false;
  return r.patch > l.patch;
}

function getTauriInvoke() {
  return window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke || null;
}

export function initAutoUpdater(context = {}) {
  injectUpdaterUi();
  setupTauriProgressListener();

  const btnManual = document.getElementById('btn-manual-check-update');
  if (btnManual) {
    btnManual.addEventListener('click', () => {
      checkForUpdates(true);
    });
  }

  setTimeout(() => {
    checkForUpdates(false);
  }, 2500);

  return {
    checkForUpdates,
    openUpdateModal,
    getVersion: () => CURRENT_VERSION
  };
}

function injectUpdaterUi() {
  const headerRight = document.querySelector('.header-status-area.topbar-right');
  if (headerRight) {
    if (!document.getElementById('topbar-update-slot')) {
      const slot = document.createElement('div');
      slot.id = 'topbar-update-slot';
      slot.className = 'topbar-update-slot';
      slot.style.display = 'none';
      headerRight.prepend(slot);
    }

    if (!document.getElementById('btn-manual-check-update')) {
      const verBadge = document.createElement('button');
      verBadge.type = 'button';
      verBadge.id = 'btn-manual-check-update';
      verBadge.className = 'status-badge galactk-version-badge';
      verBadge.title = `Versión actual v${CURRENT_VERSION} • Clic para buscar actualizaciones`;
      verBadge.innerHTML = `
        <span class="refresh-icon" id="updater-refresh-icon">🔄</span>
        <span class="version-label">v${CURRENT_VERSION}</span>
      `;
      headerRight.appendChild(verBadge);
    }
  }

  injectModalHtml();
}

function injectModalHtml() {
  if (document.getElementById('galactk-update-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'galactk-update-modal';
  modal.className = 'galactk-updater-backdrop';
  modal.style.display = 'none';

  modal.innerHTML = `
    <div class="galactk-updater-dialog">
      <div class="updater-dialog-header">
        <div class="updater-dialog-title-wrap">
          <span class="updater-icon-rocket">🚀</span>
          <div>
            <h3 class="updater-dialog-title" id="updater-dialog-title">Nueva Versión de GALACTK PANEL</h3>
            <p class="updater-dialog-subtitle" id="updater-dialog-subtitle">Actualización Oficial Disponible</p>
          </div>
        </div>
        <button type="button" class="updater-btn-close" id="updater-btn-close" title="Cerrar ventana">&times;</button>
      </div>

      <div class="updater-dialog-body">
        <div class="updater-meta-row">
          <div class="meta-item">
            <span class="meta-label">Versión Actual:</span>
            <span class="meta-value">v${CURRENT_VERSION}</span>
          </div>
          <div class="meta-arrow">➜</div>
          <div class="meta-item">
            <span class="meta-label">Nueva Versión:</span>
            <span class="meta-value new-version" id="updater-modal-new-version">v---</span>
          </div>
          <div class="meta-item" id="updater-meta-size-box">
            <span class="meta-label">Tamaño:</span>
            <span class="meta-value" id="updater-modal-size">~-- MB</span>
          </div>
        </div>

        <div class="updater-notes-box">
          <div class="notes-header">Notas del parche y novedades:</div>
          <div class="notes-content" id="updater-modal-notes">Cargando notas de la versión...</div>
        </div>

        <div class="updater-progress-area" id="updater-progress-area" style="display: none;">
          <div class="progress-labels">
            <span class="progress-status-text" id="updater-progress-status">Preparando descarga...</span>
            <span class="progress-pct-text" id="updater-progress-pct">0%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" id="updater-progress-fill"></div>
          </div>
          <p class="progress-subnote">El instalador reemplazará los archivos y reiniciará la suite automáticamente sin perder tus configuraciones.</p>
        </div>

        <div class="updater-error-box" id="updater-error-box" style="display: none;">
          <span class="error-icon">⚠️</span>
          <span class="error-msg" id="updater-error-msg">Ocurrió un error.</span>
        </div>
      </div>

      <div class="updater-dialog-footer">
        <button type="button" class="btn-updater-browser" id="updater-btn-browser" style="display: none;">
          🌐 Descargar en Navegador
        </button>
        <button type="button" class="btn-updater-cancel" id="updater-btn-cancel">
          Cancelar
        </button>
        <button type="button" class="btn-updater-install" id="updater-btn-install">
          ⚡ Actualizar e Instalar Ahora
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('updater-btn-close')?.addEventListener('click', closeUpdateModal);
  document.getElementById('updater-btn-cancel')?.addEventListener('click', closeUpdateModal);

  document.getElementById('updater-btn-install')?.addEventListener('click', () => {
    if (latestReleaseInfo) {
      startDownloadAndInstall(latestReleaseInfo);
    }
  });

  document.getElementById('updater-btn-browser')?.addEventListener('click', () => {
    if (latestReleaseInfo?.browserUrl) {
      window.open(latestReleaseInfo.browserUrl, '_blank');
    }
  });
}

async function setupTauriProgressListener() {
  const listen = window.__TAURI__?.event?.listen;
  if (!listen || progressUnlisten) return;

  try {
    progressUnlisten = await listen('update-progress', (event) => {
      const payload = event.payload || {};
      handleTauriProgressPayload(payload);
    });
  } catch (err) {
    console.warn('[AutoUpdater] No se pudo conectar listener de update-progress:', err);
  }
}

function handleTauriProgressPayload(payload) {
  const area = document.getElementById('updater-progress-area');
  const fill = document.getElementById('updater-progress-fill');
  const pctText = document.getElementById('updater-progress-pct');
  const statusText = document.getElementById('updater-progress-status');

  if (area) area.style.display = 'block';

  const pct = Math.max(0, Math.min(100, Math.round(payload.percentage || 0)));
  if (fill) fill.style.width = `${pct}%`;
  if (pctText) pctText.textContent = `${pct}%`;

  if (statusText) {
    if (payload.status === 'ready' || pct >= 100) {
      statusText.textContent = '¡Descarga completada! Iniciando instalador silencioso...';
      statusText.style.color = '#00E676';
    } else if (payload.status === 'installing') {
      statusText.textContent = 'Instalando actualización...';
      statusText.style.color = '#00F2FE';
    } else {
      if (payload.downloaded_bytes && payload.downloaded_bytes > 0) {
        const mb = (payload.downloaded_bytes / (1024 * 1024)).toFixed(1);
        statusText.textContent = `Descargando actualizador... (${mb} MB)`;
      } else {
        statusText.textContent = 'Descargando paquete de actualización...';
      }
      statusText.style.color = '#38BDF8';
    }
  }
}

export async function checkForUpdates(manual = false) {
  if (isChecking) return;
  isChecking = true;

  const refreshIcon = document.getElementById('updater-refresh-icon');
  if (refreshIcon) refreshIcon.classList.add('spinning');

  if (manual) {
    showToast('🔍 Buscando actualizaciones de GALACTK PANEL...');
  }

  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API respondió HTTP ${res.status}`);
    }

    const release = await res.json();
    const remoteTag = release.tag_name || release.name || '';
    const cleanRemote = remoteTag.replace(/^[vV]/, '');

    if (isNewer(cleanRemote, CURRENT_VERSION)) {
      const exeAsset = Array.isArray(release.assets)
        ? release.assets.find(a => a.name.toLowerCase().endsWith('.exe'))
        : null;

      const downloadUrl = exeAsset
        ? exeAsset.browser_download_url
        : release.html_url;

      const sizeBytes = exeAsset?.size || 0;
      const sizeMb = sizeBytes > 0 ? (sizeBytes / (1024 * 1024)).toFixed(1) : null;

      latestReleaseInfo = {
        version: cleanRemote,
        tag: remoteTag,
        downloadUrl,
        browserUrl: release.html_url || downloadUrl,
        sizeMb,
        body: release.body || 'Optimizaciones generales, parches de seguridad y mejoras en la suite.',
        publishedAt: release.published_at
      };

      showUpdatePill(latestReleaseInfo);

      if (manual) {
        showToast(`🚀 ¡Nueva versión v${cleanRemote} lista para instalar!`);
        openUpdateModal(latestReleaseInfo);
      }
    } else {
      hideUpdatePill();
      if (manual) {
        showToast(`✅ GALACTK PANEL está al día (v${CURRENT_VERSION})`);
      }
    }
  } catch (err) {
    console.warn('[AutoUpdater] Error consultando actualización:', err);
    if (manual) {
      showToast('⚠️ No se pudo comprobar actualización (sin conexión a GitHub)');
    }
  } finally {
    isChecking = false;
    if (refreshIcon) refreshIcon.classList.remove('spinning');
  }
}

function showUpdatePill(info) {
  const slot = document.getElementById('topbar-update-slot');
  if (!slot) return;

  slot.innerHTML = `
    <button type="button" class="galactk-update-pill" id="btn-topbar-update-pill" title="Actualización v${info.version} disponible">
      <span class="pill-pulse-dot"></span>
      <span class="pill-text">🚀 ¡Nueva Versión v${info.version} Lista!</span>
      <span class="pill-btn-action">⚡ Actualizar e Instalar</span>
    </button>
  `;
  slot.style.display = 'flex';

  document.getElementById('btn-topbar-update-pill')?.addEventListener('click', () => {
    openUpdateModal(info);
  });
}

function hideUpdatePill() {
  const slot = document.getElementById('topbar-update-slot');
  if (slot) {
    slot.style.display = 'none';
    slot.innerHTML = '';
  }
}

export function openUpdateModal(info = latestReleaseInfo) {
  if (!info) return;

  const modal = document.getElementById('galactk-update-modal');
  if (!modal) return;

  document.getElementById('updater-dialog-title').textContent = `Actualizar a GALACTK PANEL v${info.version}`;
  document.getElementById('updater-modal-new-version').textContent = `v${info.version}`;
  document.getElementById('updater-modal-size').textContent = info.sizeMb ? `${info.sizeMb} MB` : 'Instalador Oficial';
  document.getElementById('updater-modal-notes').textContent = info.body || 'Mejoras y correcciones para GALACTK PANEL.';

  const progressArea = document.getElementById('updater-progress-area');
  if (progressArea) progressArea.style.display = 'none';

  const errorBox = document.getElementById('updater-error-box');
  if (errorBox) errorBox.style.display = 'none';

  const btnInstall = document.getElementById('updater-btn-install');
  if (btnInstall) {
    btnInstall.disabled = false;
    btnInstall.style.display = 'inline-flex';
    btnInstall.textContent = '⚡ Actualizar e Instalar Ahora';
  }

  const btnBrowser = document.getElementById('updater-btn-browser');
  if (btnBrowser) btnBrowser.style.display = 'none';

  const btnCancel = document.getElementById('updater-btn-cancel');
  if (btnCancel) btnCancel.style.display = 'inline-flex';

  modal.style.display = 'flex';
}

export function closeUpdateModal() {
  if (isDownloading) {
    const confirmCancel = confirm('La actualización se está descargando en segundo plano. ¿Deseas cerrar esta ventana de progreso?');
    if (!confirmCancel) return;
  }
  const modal = document.getElementById('galactk-update-modal');
  if (modal) modal.style.display = 'none';
}

async function startDownloadAndInstall(info) {
  if (isDownloading) return;
  isDownloading = true;

  const btnInstall = document.getElementById('updater-btn-install');
  const btnCancel = document.getElementById('updater-btn-cancel');
  const btnBrowser = document.getElementById('updater-btn-browser');
  const progressArea = document.getElementById('updater-progress-area');
  const errorBox = document.getElementById('updater-error-box');
  const errorMsg = document.getElementById('updater-error-msg');
  const fill = document.getElementById('updater-progress-fill');
  const pctText = document.getElementById('updater-progress-pct');
  const statusText = document.getElementById('updater-progress-status');

  if (btnInstall) {
    btnInstall.disabled = true;
    btnInstall.textContent = '⏳ Descargando...';
  }
  if (btnCancel) btnCancel.style.display = 'none';
  if (errorBox) errorBox.style.display = 'none';
  if (progressArea) progressArea.style.display = 'block';

  if (fill) fill.style.width = '5%';
  if (pctText) pctText.textContent = '5%';
  if (statusText) {
    statusText.textContent = 'Conectando con el servidor de descargas...';
    statusText.style.color = '#38BDF8';
  }

  const invoke = getTauriInvoke();
  if (!invoke) {
    showErrorAndFallback('Tauri API no disponible en este entorno.');
    return;
  }

  try {
    await invoke('download_and_install_update', {
      download_url: info.downloadUrl
    });

    if (statusText) {
      statusText.textContent = '¡Descargado! Abriendo el instalador...';
      statusText.style.color = '#00E676';
    }
  } catch (err) {
    console.error('[AutoUpdater] Error en descarga e instalación:', err);
    showErrorAndFallback(typeof err === 'string' ? err : (err?.message || 'Error desconocido al descargar la actualización.'));
  }

  function showErrorAndFallback(message) {
    isDownloading = false;
    if (errorBox) {
      errorBox.style.display = 'flex';
      if (errorMsg) errorMsg.textContent = message;
    }
    if (btnInstall) btnInstall.style.display = 'none';
    if (btnCancel) {
      btnCancel.style.display = 'inline-flex';
      btnCancel.textContent = 'Cerrar';
    }
    if (btnBrowser) {
      btnBrowser.style.display = 'inline-flex';
    }
    if (statusText) {
      statusText.textContent = 'Fallo en la actualización automática.';
      statusText.style.color = '#FF1744';
    }
  }
}



