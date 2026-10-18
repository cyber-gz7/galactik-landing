
import { app } from './app-controller.js';
import { store } from '../store.js';
import { tikTokBridge } from '../tiktok.js';
import { giftRegistry, PRESETS, CATALOGO_GIFTS, PAISES, buscarGifts, archivoDeGift, limpiarArchivoGift, tiktokGiftIdDeNombre } from '../gifts.js';
import { rconBridge } from '../rcon.js';
import { soundManager, renderWaveformSvg } from '../sounds.js';
import { ttsEngine } from '../tts.js';
import { crearServidorMinecraft, lanzarServidorMinecraft } from '../minecraft-installer.js';
import { openS2EAudioModal, renderS2EPresetsStudio, renderAlertasChromaStudio, syncGiftWithActivePreset } from '../s2e-studio.js';

import { showToast } from './toast.js';
import { initNavigation } from './navigation.js';

export function initDashboard(modules) {
const renderRobloxEditor = (...args) => modules.obby?.render(...args);
const renderSoundboard = (...args) => modules.sounds?.render(...args);
const renderAdminLicenses = (...args) => modules.admin?.render(...args);
const { switchTab, applyProfileMode } = initNavigation({ app, renderCatalog, renderRobloxEditor, renderSoundboard, renderGiftsTable, renderS2EPresetsStudio, renderAlertasChromaStudio, renderAdminLicenses });
function giftUrl(rawFile, name = '', coins = 1) {
  let clean = limpiarArchivoGift(rawFile);
  if (!rawFile || (clean === 'rose-1-coins.webp' && name && !/rose|rosa/i.test(String(name)))) {
    clean = archivoDeGift(name, coins);
  }
  return `./gifts/${clean}`;
}

// -----------------------------------------------------------------
// 1. GESTIÓN DE PERFILES / MODOS (MINECRAFT | ROBLOX | UNIVERSAL)
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// 2. CONEXIÓN TIKTOK LIVE (MOTOR ÚNICO MACIZO) Y ESTADÍSTICAS
// -----------------------------------------------------------------
const tiktokUserField = document.getElementById('dash-tiktok-username');
const btnConnectTikTok = document.getElementById('dash-btn-connect-tiktok');
const btnDisconnectTikTok = document.getElementById('dash-btn-disconnect-tiktok');
const dashStatusText = document.getElementById('dash-tiktok-status-text');
const dashSideStatusBadge = document.getElementById('dash-side-status-badge');
const dashSideStatusDot = document.getElementById('dash-side-status-dot');
const dashSideStatusLabel = document.getElementById('dash-side-status-label');
const headerTikTokBadge = document.getElementById('header-tiktok-badge');
const headerTikTokIndicator = document.getElementById('header-tiktok-indicator');
const headerTikTokText = document.getElementById('header-tiktok-text');

async function doConnectTikTok() {
  const username = tiktokUserField.value.trim();
  if (!username) {
    showToast('⚠️ Ingresa primero tu usuario de TikTok (ej. @gz7)');
    tiktokUserField.focus();
    return;
  }
  const cleanUser = username.replace(/^@+/, '').trim();
  showToast(`⚡ Verificando sala en vivo de @${cleanUser}...`);
  try {
    await tikTokBridge.connect(cleanUser);
    await app.persistConfig();
  } catch (err) {
    console.warn('Conexión TikTok:', err);
    showToast(`⚠️ ${err?.message || 'Error al conectar'}`);
  }
}

btnConnectTikTok?.addEventListener('click', doConnectTikTok);
tiktokUserField?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doConnectTikTok();
  }
});

btnDisconnectTikTok?.addEventListener('click', () => {
  tikTokBridge.disconnect();
  showToast('Desconectado de TikTok Live');
});

tikTokBridge.on('connected', ({ username }) => {
  const u = username || tiktokUserField.value.trim().replace(/^@/, '');
  showToast(`🟢 ¡EN VIVO! Conectado a TikTok Live (@${u})`);
});

tikTokBridge.on('offline', ({ username, reason }) => {
  const u = username || tiktokUserField.value.trim().replace(/^@/, '');
  showToast(`🔴 @${u} no está transmitiendo en vivo actualmente.`);
});

tikTokBridge.on('rate_limited', ({ username, minutes, message }) => {
  const u = username || tiktokUserField.value.trim().replace(/^@/, '');
  showToast(`⚠️ Límite de EulerStream alcanzado (${minutes} min para @${u}). Abre '🔑 API Key Euler' para conectar sin límites.`);
  const statusEl = document.getElementById('dash-tiktok-status-text');
  if (statusEl) {
    statusEl.textContent = `⏳ ESPERANDO (${minutes}m)`;
    statusEl.style.color = '#ffb300';
    statusEl.style.borderColor = 'rgba(255, 179, 0, 0.4)';
    statusEl.style.background = 'rgba(255, 179, 0, 0.12)';
  }
});

// Modal EulerStream API Key
const modalEulerKey = document.getElementById('modal-euler-key');
const inputEulerKey = document.getElementById('input-euler-api-key');

document.getElementById('btn-open-euler-key')?.addEventListener('click', () => {
  if (inputEulerKey) {
    inputEulerKey.value = localStorage.getItem('galactk_euler_key') || '';
  }
  if (modalEulerKey) {
    modalEulerKey.style.display = 'flex';
  }
});

document.getElementById('btn-close-euler-key-modal')?.addEventListener('click', () => {
  if (modalEulerKey) modalEulerKey.style.display = 'none';
});

document.getElementById('btn-cancel-euler-key')?.addEventListener('click', () => {
  if (modalEulerKey) modalEulerKey.style.display = 'none';
});

document.getElementById('btn-save-euler-key')?.addEventListener('click', () => {
  const val = inputEulerKey ? inputEulerKey.value.trim() : '';
  if (val) {
    localStorage.setItem('galactk_euler_key', val);
    showToast('🔑 API Key de EulerStream guardada con éxito.');
  } else {
    localStorage.removeItem('galactk_euler_key');
    showToast('🔑 API Key eliminada (modo anónimo activo).');
  }
  if (modalEulerKey) modalEulerKey.style.display = 'none';
});

document.getElementById('btn-clear-euler-key')?.addEventListener('click', () => {
  if (inputEulerKey) inputEulerKey.value = '';
  localStorage.removeItem('galactk_euler_key');
  showToast('Key limpiada');
});

document.getElementById('btn-fetch-emotes')?.addEventListener('click', () => {
  const username = tiktokUserField.value.trim() || store.getState().tikTokUsername || 'gz7';
  showToast(`😎 Emotes sincronizados para @${username.replace(/^@/, '')}`);
});

document.getElementById('btn-quick-test-gift')?.addEventListener('click', () => {
  const activeUser = tiktokUserField.value.trim().replace(/^@/, '') || store.getState().tikTokUsername || 'GZ7_Viewer';
  tikTokBridge.injectEvent('gift', {
    giftId: 5655,
    giftName: 'Rose',
    diamondCount: 1,
    repeatCount: 1,
    uniqueId: activeUser,
    nickname: activeUser
  });
  showToast(`🧪 Regalo de prueba disparado (Rose +1 💎 por @${activeUser})`);
});

document.getElementById('btn-open-gift-monitor')?.addEventListener('click', () => {
  switchTab('tab-catalog');
  const mon = document.querySelector('gift-monitor');
  if (mon) {
    mon.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showToast('📡 Abriendo Monitor y Simulador de Regalos');
});

document.getElementById('btn-quick-test-chroma')?.addEventListener('click', async () => {
  const activeUser = tiktokUserField.value.trim().replace(/^@/, '') || store.getState().tikTokUsername || 'GZ7_Viewer';
  const album = app.getActiveAlertAlbum();
  const firstTrig = album?.triggers?.[0];
  if (firstTrig) {
    await app.fireAlertTrigger(firstTrig, {
      user: activeUser,
      gift: firstTrig.giftName || 'Rose',
      coins: firstTrig.giftCoins || 1,
      count: 1
    });
    showToast(`🎬 Alerta Croma disparada: ${firstTrig.name} (@${activeUser})`);
  } else {
    showToast('🎬 Ve a la pestaña Alertas & Croma para configurar tu video');
  }
});

store.on('tiktok:status', ({ status, username }) => {
  if (username && tiktokUserField && !tiktokUserField.value) {
    tiktokUserField.value = username;
  }
  const cleanUser = (username || tiktokUserField?.value || '').trim().replace(/^@+/, '');
  const isConn = status === 'CONECTADO';
  const isConnecting = status === 'CONECTANDO';
  const isOffline = status === 'OFFLINE';
  const cls = isConn ? 'connected' : (isConnecting ? 'connecting' : 'disconnected');

  if (dashStatusText) {
    dashStatusText.textContent = isConn
      ? `● EN VIVO ${cleanUser ? '(@' + cleanUser + ')' : ''}`
      : (isConnecting ? `● CONECTANDO...` : (isOffline ? `● NO TRANSMITE (@${cleanUser})` : `● DESCONECTADO`));
    dashStatusText.style.background = isConn
      ? 'rgba(0, 255, 163, 0.16)'
      : (isConnecting ? 'rgba(255, 171, 0, 0.16)' : (isOffline ? 'rgba(255, 140, 0, 0.16)' : 'rgba(255, 42, 95, 0.12)'));
    dashStatusText.style.borderColor = isConn
      ? '#00ffa3'
      : (isConnecting ? '#ffab00' : (isOffline ? '#ff8c00' : 'rgba(255, 42, 95, 0.4)'));
    dashStatusText.style.color = isConn
      ? '#00ffa3'
      : (isConnecting ? '#ffab00' : (isOffline ? '#ffa500' : '#ff6b8b'));
    dashStatusText.style.boxShadow = isConn ? '0 0 14px rgba(0, 255, 163, 0.35)' : 'none';
  }

  if (dashSideStatusBadge && dashSideStatusDot && dashSideStatusLabel) {
    dashSideStatusDot.className = `status-indicator ${cls}`;
    dashSideStatusLabel.textContent = isConn
      ? `EN VIVO ${cleanUser ? '• @' + cleanUser : ''}`
      : (isConnecting ? 'CONECTANDO...' : (isOffline ? `NO TRANSMITE (@${cleanUser})` : 'DESCONECTADO'));
    dashSideStatusBadge.style.background = isConn
      ? 'rgba(0, 255, 163, 0.16)'
      : (isConnecting ? 'rgba(255, 171, 0, 0.16)' : (isOffline ? 'rgba(255, 140, 0, 0.16)' : 'rgba(255, 42, 95, 0.12)'));
    dashSideStatusBadge.style.borderColor = isConn
      ? '#00ffa3'
      : (isConnecting ? '#ffab00' : (isOffline ? '#ff8c00' : 'rgba(255, 42, 95, 0.45)'));
    dashSideStatusBadge.style.color = isConn
      ? '#00ffa3'
      : (isConnecting ? '#ffab00' : (isOffline ? '#ffa500' : '#ff6b8b'));
    dashSideStatusBadge.style.boxShadow = isConn ? '0 0 18px rgba(0, 255, 163, 0.4)' : 'none';
  }

  if (headerTikTokText) {
    headerTikTokText.textContent = isConn
      ? `TIKTOK: EN VIVO ${cleanUser ? '(@' + cleanUser + ')' : ''}`
      : (isOffline ? `TIKTOK: NO TRANSMITE (@${cleanUser})` : `TIKTOK: ${status}`);
  }
  if (headerTikTokIndicator) {
    headerTikTokIndicator.className = `status-indicator ${cls}`;
  }
  if (headerTikTokBadge) {
    headerTikTokBadge.style.background = isConn
      ? 'rgba(0, 255, 163, 0.16)'
      : (isOffline ? 'rgba(255, 140, 0, 0.16)' : 'rgba(4, 10, 20, 0.85)');
    headerTikTokBadge.style.borderColor = isConn
      ? '#00ffa3'
      : (isOffline ? '#ff8c00' : 'var(--border-subtle)');
    headerTikTokBadge.style.color = isConn
      ? '#00ffa3'
      : (isOffline ? '#ffa500' : 'var(--text-main)');
    headerTikTokBadge.style.boxShadow = isConn ? '0 0 14px rgba(0, 255, 163, 0.35)' : 'none';
  }

  if (btnConnectTikTok) btnConnectTikTok.style.display = isConn ? 'none' : 'inline-flex';
  if (btnDisconnectTikTok) btnDisconnectTikTok.style.display = isConn ? 'inline-flex' : 'none';
});

store.on('stats:change', stats => {
  document.getElementById('stat-likes').textContent = stats.likes.toLocaleString();
  document.getElementById('stat-gifts').textContent = stats.gifts.toLocaleString();
  document.getElementById('stat-coins').textContent = stats.coins.toLocaleString();
  document.getElementById('stat-followers').textContent = stats.followers.toLocaleString();
});

// -----------------------------------------------------------------
// 3. PANEL ROBLOX: CONTROL DE WINS, TEMAS, SLIDERS 720:1080 Y SLOTS
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// 4. CATÁLOGO DE REGALOS DE 3 COLUMNAS CON VISTA PREVIA (CAPTURA 2)
// -----------------------------------------------------------------
let catalogCategory = 'todos';
let catalogCoinFilter = 'todos';
let catalogCountry = 'todos';
let selectedCatalogGift = CATALOGO_GIFTS[0] || { nombre: 'Rose', coins: 1, archivo: 'rose-1-coins.webp', id: 5655 };

const countrySelect = document.getElementById('catalog-country-select');
const modalCountrySelect = document.getElementById('modal-picker-country');
if (countrySelect && modalCountrySelect) {
  const opts = PAISES.map(p => `<option value="${p.id}">${p.etiqueta}</option>`).join('');
  countrySelect.innerHTML = opts;
  modalCountrySelect.innerHTML = opts;
}

function updateCatalogPreview(gift) {
  if (!gift) return;
  selectedCatalogGift = gift;
  document.getElementById('preview-gift-img').src = giftUrl(gift.archivo, gift.nombre, gift.coins);
  document.getElementById('preview-gift-name').textContent = gift.nombre;
  document.getElementById('preview-gift-id').textContent = gift.id || Math.floor(1000 + gift.coins * 7);
  document.getElementById('preview-gift-coins').textContent = `${gift.coins.toLocaleString()} 💎`;
  const catLabel = gift.coins >= 1000 ? 'Premium' : (gift.coins >= 100 ? 'Animado' : 'Básico');
  document.getElementById('preview-gift-cat').textContent = catLabel;
  const regs = Array.isArray(gift.regiones) && gift.regiones.length ? gift.regiones.slice(0, 4).join(', ') : 'GLOBAL';
  document.getElementById('preview-gift-region').textContent = regs;
  const sndId = soundManager.getSoundForGift(gift.nombre);
  const sndObj = soundManager.getAllSounds().find(s => s.id === sndId);
  document.getElementById('preview-gift-sound').textContent = sndObj ? sndObj.name : 'Automático';
}

function renderCatalog() {
  const q = document.getElementById('catalog-search-input')?.value || '';
  let list = buscarGifts({ q, filtro: catalogCoinFilter, pais: catalogCountry });

  if (catalogCategory === 'populares') list = list.filter(g => [1, 5, 10, 20, 30, 99, 100, 500, 1000, 29999].includes(g.coins));
  else if (catalogCategory === 'basicos') list = list.filter(g => g.coins <= 30);
  else if (catalogCategory === 'animados') list = list.filter(g => g.coins > 30 && g.coins < 1000);
  else if (catalogCategory === 'destacados') list = list.filter(g => g.coins >= 100 && g.coins <= 5000);
  else if (catalogCategory === 'premium') list = list.filter(g => g.coins >= 1000);

  document.getElementById('catalog-total-display').textContent = `${list.length} / ${CATALOGO_GIFTS.length}`;
  const grid = document.getElementById('catalog-grid-container');
  if (!grid) return;

  const slice = list.slice(0, 800);
  grid.innerHTML = slice.map(g => {
    const cleanFile = limpiarArchivoGift(g.archivo);
    const isSel = selectedCatalogGift && selectedCatalogGift.nombre === g.nombre && selectedCatalogGift.coins === g.coins;
    return `
      <div class="gift-pro-card ${isSel ? 'selected' : ''}" data-gname="${g.nombre}" data-gcoins="${g.coins}" data-gfile="${cleanFile}">
        <img src="${giftUrl(cleanFile, g.nombre, g.coins)}" class="gift-hd-img" alt="${g.nombre}" loading="lazy" onerror="this.src='./gifts/rose-1-coins.webp'" />
        <div class="gift-pro-name">${g.nombre}</div>
        <div class="gift-pro-diamonds">${g.coins} 💎</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.gift-pro-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.gift-pro-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const found = list.find(x => x.nombre === card.dataset.gname && String(x.coins) === String(card.dataset.gcoins));
      if (found) updateCatalogPreview(found);
    });
  });
}

document.getElementById('catalog-search-input')?.addEventListener('input', renderCatalog);
countrySelect?.addEventListener('change', () => {
  catalogCountry = countrySelect.value;
  renderCatalog();
});

document.querySelectorAll('#cat-category-filters .filter-nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#cat-category-filters .filter-nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    catalogCategory = btn.getAttribute('data-cat');
    renderCatalog();
  });
});

document.querySelectorAll('#catalog-coin-pills-container .catalog-pill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#catalog-coin-pills-container .catalog-pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    catalogCoinFilter = btn.getAttribute('data-filter');
    renderCatalog();
  });
});

// Botones de la Vista Previa Derecha
document.getElementById('btn-preview-place-overlay')?.addEventListener('click', () => {
  if (!selectedCatalogGift) return;
  if (app.activeProfile === 'roblox') {
    openGiftModalForRobloxSlot('L1', selectedCatalogGift);
  } else {
    openGiftConfigModal({
      id: 'gift_' + Date.now(),
      name: selectedCatalogGift.nombre,
      coins: selectedCatalogGift.coins,
      icon_file: limpiarArchivoGift(selectedCatalogGift.archivo),
      tiktokGiftId: selectedCatalogGift.id || 5655,
      faction: 'BUENOS',
      command: `/summon zombie ~ ~ ~`,
      totemDelta: 1
    });
  }
});

document.getElementById('btn-preview-assign-sound')?.addEventListener('click', () => {
  if (!selectedCatalogGift) return;
  openS2EAudioModal(null, chosen => {
    if (chosen) {
      soundManager.assignSoundToGift(selectedCatalogGift.nombre, chosen.name);
      document.getElementById('preview-gift-sound').textContent = chosen.name;
      showToast(`🔊 Audio "${chosen.name}" asignado a "${selectedCatalogGift.nombre}"`);
    } else {
      soundManager.assignSoundToGift(selectedCatalogGift.nombre, '');
      document.getElementById('preview-gift-sound').textContent = 'Automático';
      showToast(`🔇 Audio deseleccionado para "${selectedCatalogGift.nombre}"`);
    }
  });
});

document.getElementById('btn-preview-fire-test')?.addEventListener('click', () => {
  if (!selectedCatalogGift) return;
  app.handleGiftEvent({
    giftName: selectedCatalogGift.nombre,
    diamondCount: selectedCatalogGift.coins,
    repeatCount: 1,
    nickname: 'GZ7_Preview'
  });
  showToast(`🧪 Prueba disparada: ${selectedCatalogGift.nombre} (${selectedCatalogGift.coins} 💎)`);
});

// -----------------------------------------------------------------
// 5. MODAL VISUAL DE REGALOS (SIRVE PARA ROBLOX Y MINECRAFT)
// -----------------------------------------------------------------
const modalEl = document.getElementById('modal-config-gift');
let modalCoinFilter = 'todos';

function updateModalSoundUI(soundName = '', soundUrl = '') {
  const resolved = soundName ? soundManager.resolveSound(soundName) : null;
  const finalName = resolved ? resolved.name : (soundName || '');
  const finalUrl = soundUrl || (resolved && resolved.url ? resolved.url : '');
  const nameInp = document.getElementById('modal-hidden-sound-name');
  const urlInp = document.getElementById('modal-hidden-sound-url');
  const lbl = document.getElementById('modal-gift-sound-label');
  if (nameInp) nameInp.value = finalName;
  if (urlInp) urlInp.value = finalUrl;
  if (lbl) {
    lbl.textContent = finalName ? `🔊 ${finalName}` : 'Automático (Según diamantes)';
    lbl.style.color = finalName ? 'var(--neon-cyan)' : '#cbd5e1';
  }
}

function renderModalPickerGrid() {
  const q = document.getElementById('modal-picker-search')?.value || '';
  const pais = document.getElementById('modal-picker-country')?.value || 'todos';
  const results = buscarGifts({ q, filtro: modalCoinFilter, pais }).slice(0, 600);
  const grid = document.getElementById('modal-picker-grid-container');
  if (!grid) return;

  const currentSelectedName = document.getElementById('modal-hidden-name')?.value || '';

  grid.innerHTML = results.map(g => {
    const cleanFile = limpiarArchivoGift(g.archivo);
    const isSel = g.nombre === currentSelectedName;
    return `
      <div class="modal-picker-card ${isSel ? 'selected' : ''}" data-name="${g.nombre}" data-coins="${g.coins}" data-file="${cleanFile}">
        <img src="${giftUrl(cleanFile, g.nombre, g.coins)}" class="modal-picker-img gift-hd-img" loading="lazy" onerror="this.src='./gifts/rose-1-coins.webp'" />
        <div class="modal-picker-name">${g.nombre}</div>
        <div class="modal-picker-coins">${g.coins} 💎</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.modal-picker-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.modal-picker-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const cleanFile = limpiarArchivoGift(card.dataset.file);
      document.getElementById('modal-hidden-name').value = card.dataset.name;
      document.getElementById('modal-hidden-coins').value = card.dataset.coins;
      document.getElementById('modal-gift-title').textContent = card.dataset.name;
      document.getElementById('modal-gift-coins-badge').textContent = `💎 ${card.dataset.coins}`;
      document.getElementById('modal-gift-icon').src = giftUrl(cleanFile, card.dataset.name, card.dataset.coins);
      document.getElementById('modal-gift-icon').dataset.file = cleanFile;

      const existingSound = soundManager.getSoundForGift(card.dataset.name);
      if (!document.getElementById('modal-hidden-sound-name')?.value && existingSound) {
        const resolved = soundManager.resolveSound(existingSound);
        updateModalSoundUI(resolved ? resolved.name : existingSound, resolved?.url || '');
      }
    });
  });
}

function openGiftModalForRobloxSlot(slotId, preselectedGift = null) {
  document.getElementById('modal-hidden-roblox-slot-id').value = slotId;
  document.getElementById('modal-mc-fields-section').style.display = 'none';

  let gName = 'Rose';
  let gCoins = 1;
  let gFile = 'rose-1-coins.webp';
  let slotLabel = slotId;
  let sName = '';
  let sUrl = '';

  if (slotId === 'CENTER_RED') {
    gName = app.robloxOverlayConfig.center_red_name || 'Rose';
    gCoins = app.robloxOverlayConfig.center_red_coins || 1;
    gFile = limpiarArchivoGift(app.robloxOverlayConfig.center_red_icon || 'rose-1-coins.webp');
    slotLabel = 'Duelo Izquierda (Rojo)';
    sName = app.robloxOverlayConfig.center_red_sound_name || soundManager.getSoundForGift(gName) || '';
    sUrl = app.robloxOverlayConfig.center_red_sound_url || '';
  } else if (slotId === 'CENTER_BLUE') {
    gName = app.robloxOverlayConfig.center_blue_name || 'GG';
    gCoins = app.robloxOverlayConfig.center_blue_coins || 1;
    gFile = limpiarArchivoGift(app.robloxOverlayConfig.center_blue_icon || 'gg-1-coins.webp');
    slotLabel = 'Duelo Derecha (Azul)';
    sName = app.robloxOverlayConfig.center_blue_sound_name || soundManager.getSoundForGift(gName) || '';
    sUrl = app.robloxOverlayConfig.center_blue_sound_url || '';
  } else {
    const allSlots = [...app.robloxOverlayConfig.left_rules, ...app.robloxOverlayConfig.right_rules];
    const slot = allSlots.find(s => s.id === slotId);
    gName = preselectedGift ? preselectedGift.nombre : (slot ? slot.gift_name : 'Lion');
    gCoins = preselectedGift ? preselectedGift.coins : (slot ? slot.coins : 29999);
    gFile = limpiarArchivoGift(preselectedGift ? preselectedGift.archivo : (slot ? slot.icon_file : 'lion-29999-coins.webp'));
    slotLabel = slot ? slot.label : slotId;
    sName = (slot && slot.sound_name) ? slot.sound_name : (soundManager.getSoundForGift(gName) || '');
    sUrl = (slot && slot.sound_url) ? slot.sound_url : '';
  }

  document.getElementById('modal-hidden-name').value = gName;
  document.getElementById('modal-hidden-coins').value = gCoins;
  document.getElementById('modal-gift-title').textContent = `Cambiar Regalo (${slotLabel}): ${gName}`;
  document.getElementById('modal-gift-coins-badge').textContent = `💎 ${gCoins}`;
  document.getElementById('modal-gift-icon').src = giftUrl(gFile, gName, gCoins);
  document.getElementById('modal-gift-icon').dataset.file = gFile;
  updateModalSoundUI(sName, sUrl);

  modalEl.style.display = 'flex';
  renderModalPickerGrid();
}

function openGiftConfigModal(giftObj = null) {
  document.getElementById('modal-hidden-roblox-slot-id').value = '';
  document.getElementById('modal-mc-fields-section').style.display = 'block';

  const g = giftObj || { id: 'gift_' + Date.now(), name: 'Rose', coins: 1, faction: 'BUENOS', command: '/summon zombie ~ ~ ~', totemDelta: 1 };
  const file = limpiarArchivoGift(g.icon_file || archivoDeGift(g.name, g.coins));
  const sName = g.audioName || soundManager.getSoundForGift(g.name) || '';
  const sUrl = g.audioUrl || '';

  document.getElementById('modal-hidden-gift-id').value = g.id;
  document.getElementById('modal-hidden-name').value = g.name;
  document.getElementById('modal-hidden-coins').value = g.coins;
  document.getElementById('modal-gift-title').textContent = g.name;
  document.getElementById('modal-gift-coins-badge').textContent = `💎 ${g.coins}`;
  document.getElementById('modal-gift-icon').src = giftUrl(file, g.name, g.coins);
  document.getElementById('modal-gift-icon').dataset.file = file;
  document.getElementById('modal-gift-faction').value = g.faction || 'BUENOS';
  document.getElementById('modal-gift-delta').value = g.totemDelta ?? 1;
  document.getElementById('modal-gift-command').value = g.command || '/summon zombie ~ ~ ~';
  updateModalSoundUI(sName, sUrl);

  modalEl.style.display = 'flex';
  renderModalPickerGrid();
}

document.getElementById('btn-modal-pick-sound')?.addEventListener('click', () => {
  const curName = document.getElementById('modal-hidden-sound-name')?.value || '';
  const curUrl = document.getElementById('modal-hidden-sound-url')?.value || '';
  const picker = window.gz7S2EStudio?.openAudioPickerModal || openS2EAudioModal;
  picker(curName ? { name: curName, url: curUrl } : null, chosen => {
    if (chosen) {
      updateModalSoundUI(chosen.name, chosen.url || '');
    } else {
      updateModalSoundUI('', '');
    }
  });
});

document.getElementById('btn-modal-test-sound')?.addEventListener('click', () => {
  const curName = document.getElementById('modal-hidden-sound-name')?.value || '';
  const curUrl = document.getElementById('modal-hidden-sound-url')?.value || '';
  const gName = document.getElementById('modal-hidden-name')?.value || 'Rose';
  if (curUrl) {
    soundManager.playUrl(curUrl, 1.0, curName || gName);
  } else if (curName) {
    soundManager.playSound(curName, 100);
  } else {
    soundManager.playForGift(gName);
  }
});

document.getElementById('btn-modal-clear-sound')?.addEventListener('click', () => {
  soundManager.stopAll();
  updateModalSoundUI('', '');
  showToast('🔇 Sonido restablecido a automático');
});

document.getElementById('btn-close-gift-modal')?.addEventListener('click', () => {
  soundManager.stopAll();
  modalEl.style.display = 'none';
});
document.getElementById('btn-cancel-modal-gift')?.addEventListener('click', () => {
  soundManager.stopAll();
  modalEl.style.display = 'none';
});
document.getElementById('modal-picker-search')?.addEventListener('input', renderModalPickerGrid);
document.getElementById('modal-picker-country')?.addEventListener('change', renderModalPickerGrid);

document.querySelectorAll('#modal-picker-pills-row .modal-picker-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#modal-picker-pills-row .modal-picker-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    modalCoinFilter = pill.getAttribute('data-filter');
    renderModalPickerGrid();
  });
});

document.querySelectorAll('.quick-cmd-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('modal-gift-command').value = btn.getAttribute('data-cmd');
  });
});

const handleSaveGiftModal = async () => {
  soundManager.stopAll();
  const rbxSlotId = document.getElementById('modal-hidden-roblox-slot-id').value;
  const newName = document.getElementById('modal-hidden-name').value || 'Rose';
  const newCoins = Number(document.getElementById('modal-hidden-coins').value) || 1;
  const newFile = limpiarArchivoGift(document.getElementById('modal-gift-icon').dataset.file || archivoDeGift(newName, newCoins));
  const chosenSoundName = document.getElementById('modal-hidden-sound-name')?.value || '';
  const chosenSoundUrl = document.getElementById('modal-hidden-sound-url')?.value || '';

  soundManager.assignSoundToGift(newName, chosenSoundName, chosenSoundUrl);

  if (rbxSlotId) {
    if (rbxSlotId === 'CENTER_RED') {
      app.robloxOverlayConfig.center_red_name = newName;
      app.robloxOverlayConfig.center_red_coins = newCoins;
      app.robloxOverlayConfig.center_red_icon = newFile;
      app.robloxOverlayConfig.center_red_sound_name = chosenSoundName;
      app.robloxOverlayConfig.center_red_sound_url = chosenSoundUrl;
    } else if (rbxSlotId === 'CENTER_BLUE') {
      app.robloxOverlayConfig.center_blue_name = newName;
      app.robloxOverlayConfig.center_blue_coins = newCoins;
      app.robloxOverlayConfig.center_blue_icon = newFile;
      app.robloxOverlayConfig.center_blue_sound_name = chosenSoundName;
      app.robloxOverlayConfig.center_blue_sound_url = chosenSoundUrl;
    } else {
      const allSlots = [...app.robloxOverlayConfig.left_rules, ...app.robloxOverlayConfig.right_rules];
      const slot = allSlots.find(s => s.id === rbxSlotId);
      if (slot) {
        slot.gift_name = newName;
        slot.coins = newCoins;
        slot.icon_file = newFile;
        slot.sound_name = chosenSoundName;
        slot.sound_url = chosenSoundUrl;
        slot.sound_volume = 1.0;
      }
    }
    renderRobloxEditor();
    await app.persistConfig();
    modalEl.style.display = 'none';
    showToast(`✔ Regalo "${newName}" ${chosenSoundName ? `y sonido "${chosenSoundName}" ` : ''}asignado en el Overlay Roblox`);
    return;
  }

  const id = document.getElementById('modal-hidden-gift-id').value || ('gift_' + Date.now());
  const faction = document.getElementById('modal-gift-faction').value;
  const totemDelta = Number(document.getElementById('modal-gift-delta').value) || 0;
  const command = document.getElementById('modal-gift-command').value.trim();

  const current = giftRegistry.getAll();
  const idx = current.findIndex(x => x.id === id);
  const entry = {
    id,
    name: newName,
    tiktokGiftId: tiktokGiftIdDeNombre(newName, (idx >= 0 && current[idx]?.tiktokGiftId) ? current[idx].tiktokGiftId : 5655),
    coins: newCoins,
    faction,
    command,
    totemDelta,
    icon_file: newFile,
    audioName: chosenSoundName,
    audioUrl: chosenSoundUrl
  };
  if (idx >= 0) current[idx] = entry;
  else current.push(entry);

  giftRegistry.setAll(current);
  syncGiftWithActivePreset(entry);
  renderGiftsTable();
  await app.persistConfig();
  modalEl.style.display = 'none';
  showToast(`✔ Regalo "${newName}" guardado en Overlay Minecraft y Preset S2E`);
};

document.getElementById('btn-save-gift')?.addEventListener('click', handleSaveGiftModal);
document.getElementById('btn-save-modal-gift')?.addEventListener('click', handleSaveGiftModal);

// -----------------------------------------------------------------
// 6. TABLA DE REGALOS Y ESTILOS OVERLAY MINECRAFT
// -----------------------------------------------------------------
function renderGiftsTable() {
  const tbody = document.getElementById('gifts-table-body');
  if (!tbody) return;
  const gifts = giftRegistry.getAll();

  tbody.innerHTML = gifts.map((g, idx) => {
    const imgUrl = giftUrl(g.icon_file, g.name, g.coins);
    const sndLabel = g.audioName || soundManager.getSoundForGift(g.name) || '';
    return `
      <tr data-idx="${idx}">
        <td>
          <button type="button" class="btn-secondary btn-pick-row-gift" data-idx="${idx}" style="width: 100%; justify-content: flex-start;">
            <img src="${imgUrl}" class="gift-hd-img" style="width: 30px; height: 30px; object-fit: contain;" onerror="this.src='./gifts/rose-1-coins.webp'" />
            <span>${g.name}</span>
          </button>
        </td>
        <td style="font-family: var(--font-mono); color: var(--color-gold); font-weight: 800;">${g.coins} 💎</td>
        <td>
          <select class="table-select row-faction" data-idx="${idx}">
            <option value="BUENOS" ${g.faction === 'BUENOS' ? 'selected' : ''}>BUENOS</option>
            <option value="MALOS" ${g.faction === 'MALOS' ? 'selected' : ''}>MALOS</option>
          </select>
        </td>
        <td>
          <input type="text" class="table-input row-cmd" data-idx="${idx}" value="${g.command || ''}" />
        </td>
        <td>
          <input type="number" class="table-input row-delta" data-idx="${idx}" value="${g.totemDelta ?? 0}" style="width: 70px;" />
        </td>
        <td>
          <div style="display: flex; gap: 4px; align-items: center;">
            <button type="button" class="btn-micro btn-sound-mc-row" data-idx="${idx}" title="Elegir sonido del banco gratis (258+ sonidos)" style="color: var(--neon-cyan); border-color: rgba(0,240,255,0.4); max-width: 138px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              🔊 ${sndLabel || 'Sonido'}
            </button>
            <button type="button" class="btn-micro btn-test-mc-row" data-idx="${idx}" title="Probar regalo y sonido">▶</button>
            <button type="button" class="btn-micro btn-del-mc-row" data-idx="${idx}" style="color: var(--color-danger);">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-pick-row-gift').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = giftRegistry.getAll()[Number(btn.dataset.idx)];
      if (g) openGiftConfigModal(g);
    });
  });

  tbody.querySelectorAll('.btn-sound-mc-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = giftRegistry.getAll();
      const idx = Number(btn.dataset.idx);
      const g = list[idx];
      if (!g) return;
      const currentSoundName = g.audioName || soundManager.getSoundForGift(g.name) || '';
      const picker = window.gz7S2EStudio?.openAudioPickerModal || openS2EAudioModal;
      picker(currentSoundName ? { name: currentSoundName, url: g.audioUrl || '' } : null, async chosen => {
        if (chosen) {
          g.audioName = chosen.name;
          g.audioUrl = chosen.url || '';
          soundManager.assignSoundToGift(g.name, chosen.name, chosen.url || '');
          showToast(`🔊 Audio "${chosen.name}" asignado a "${g.name}"`);
        } else {
          g.audioName = '';
          g.audioUrl = '';
          soundManager.assignSoundToGift(g.name, '');
          showToast(`🔇 Audio quitado de "${g.name}"`);
        }
        giftRegistry.setAll(list);
        syncGiftWithActivePreset(g);
        renderGiftsTable();
        await app.persistConfig();
      });
    });
  });

  tbody.querySelectorAll('.row-faction, .row-cmd, .row-delta').forEach(inp => {
    inp.addEventListener('change', async () => {
      const list = giftRegistry.getAll();
      const idx = Number(inp.dataset.idx);
      const g = list[idx];
      if (!g) return;
      if (inp.classList.contains('row-faction')) g.faction = inp.value;
      if (inp.classList.contains('row-cmd')) g.command = inp.value;
      if (inp.classList.contains('row-delta')) g.totemDelta = Number(inp.value) || 0;
      giftRegistry.setAll(list);
      syncGiftWithActivePreset(g);
      await app.persistConfig();
    });
  });

  tbody.querySelectorAll('.btn-test-mc-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = giftRegistry.getAll()[Number(btn.dataset.idx)];
      if (g) app.triggerSimulation(g.id, 'GZ7_Tester');
    });
  });

  tbody.querySelectorAll('.btn-del-mc-row').forEach(btn => {
    btn.addEventListener('click', async () => {
      const list = giftRegistry.getAll();
      list.splice(Number(btn.dataset.idx), 1);
      giftRegistry.setAll(list);
      renderGiftsTable();
      await app.persistConfig();
    });
  });
}

document.querySelectorAll('.btn-load-preset').forEach(btn => {
  btn.addEventListener('click', async () => {
    const presetId = btn.getAttribute('data-preset');
    const loaded = giftRegistry.loadPreset(presetId);
    if (loaded) {
      renderGiftsTable();
      await app.persistConfig();
      showToast(`✔ Preset cargado: ${loaded.nombre}`);
    }
  });
});

document.getElementById('btn-open-catalog-from-gifts')?.addEventListener('click', () => openGiftConfigModal(null));
document.getElementById('btn-add-gift-row')?.addEventListener('click', () => openGiftConfigModal(null));
document.getElementById('btn-restore-gifts-default')?.addEventListener('click', async () => {
  giftRegistry.resetDefaults();
  renderGiftsTable();
  await app.persistConfig();
  showToast('✔ Regalos restaurados a valores por defecto');
});
document.getElementById('btn-save-gifts')?.addEventListener('click', async () => {
  const list = giftRegistry.getAll();
  document.querySelectorAll('.row-faction').forEach(el => { list[Number(el.dataset.idx)].faction = el.value; });
  document.querySelectorAll('.row-cmd').forEach(el => { list[Number(el.dataset.idx)].command = el.value; });
  document.querySelectorAll('.row-delta').forEach(el => { list[Number(el.dataset.idx)].totemDelta = Number(el.value) || 0; });
  giftRegistry.setAll(list);
  list.forEach(g => syncGiftWithActivePreset(g));
  await app.persistConfig();
  showToast('✔ ¡Overlay de Minecraft, Preset S2E y comandos RCON actualizados!');
});

document.querySelectorAll('.btn-set-mc-style').forEach(btn => {
  btn.addEventListener('click', async () => {
    app.mcOverlayStyle = btn.getAttribute('data-style');
    document.querySelectorAll('.mc-style-card').forEach(c => {
      c.style.borderColor = c.getAttribute('data-mc-style') === app.mcOverlayStyle ? 'var(--neon-cyan)' : 'var(--border-subtle)';
    });
    await app.persistConfig();
    showToast(`✔ Estilo de Overlay Minecraft activado: ${app.mcOverlayStyle.toUpperCase()}`);
  });
});

document.getElementById('btn-toggle-faction')?.addEventListener('click', () => {
  store.toggleFaction();
  app.persistConfig();
  showToast(`🔄 Facción cambiada a: ${store.getState().activeFaction}`);
});

store.on('faction:change', faction => {
  const banner = document.getElementById('faction-banner');
  const title = document.getElementById('faction-name-display');
  if (banner) banner.className = `faction-toggle-panel ${faction.toLowerCase()}`;
  if (title) {
    title.textContent = `FACCIÓN: ${faction}`;
    title.style.color = faction === 'BUENOS' ? 'var(--neon-cyan)' : 'var(--color-malos)';
  }
});

// -----------------------------------------------------------------
// 7. SOUNDBOARD & MEMES INTERACTIVOS (266+ SONIDOS GRATIS)
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// 8. TTS CHAT LOCAL EN TAURI (ACTIVADO POR DEFECTO + CONTROLES PRO)
// -----------------------------------------------------------------
function initTtsControls() {
  const masterToggle = document.getElementById('tts-master-toggle');
  const masterBadge = document.getElementById('tts-master-status-badge');
  const masterStatusText = document.getElementById('tts-master-status-text');
  const volSlider = document.getElementById('tts-volume-slider');
  const volVal = document.getElementById('tts-volume-val');
  const volIcon = document.getElementById('tts-volume-icon');
  const speedSlider = document.getElementById('tts-speed-slider');
  const speedVal = document.getElementById('tts-speed-val');
  const pitchSlider = document.getElementById('tts-pitch-slider');
  const pitchVal = document.getElementById('tts-pitch-val');
  const voiceSelect = document.getElementById('tts-voice-select');
  const langSelect = document.getElementById('tts-lang-select');
  const randomVoiceCheck = document.getElementById('tts-random-voice-check');

  function updateMasterUI(isActive) {
    if (masterToggle) masterToggle.checked = Boolean(isActive);
    if (masterBadge) {
      masterBadge.classList.toggle('active', Boolean(isActive));
      masterBadge.classList.toggle('inactive', !isActive);
    }
    if (masterStatusText) {
      masterStatusText.textContent = isActive ? 'ACTIVO' : 'DESACTIVADO';
    }
  }

  function updateVolUI(val) {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    if (volVal) volVal.textContent = `${num}%`;
    if (volIcon) {
      if (num === 0) volIcon.textContent = '🔇';
      else if (num < 40) volIcon.textContent = '🔉';
      else volIcon.textContent = '🔊';
    }
  }

  function updateSpeedUI(val) {
    const num = Math.max(0.5, Math.min(2.0, Number(val) || 1.0));
    if (speedVal) speedVal.textContent = `${num.toFixed(1)}x`;
  }

  function updatePitchUI(val) {
    const num = Math.max(0.5, Math.min(1.5, Number(val) || 1.0));
    let label = `${num.toFixed(2)}`;
    if (num === 1.0) label += ' (Normal)';
    else if (num < 0.9) label += ' (Grave)';
    else if (num > 1.1) label += ' (Agudo)';
    if (pitchVal) pitchVal.textContent = label;
  }

  // Sincronizar estado inicial desde la configuración guardada
  updateMasterUI(ttsEngine.config.enabled);
  if (volSlider) {
    volSlider.value = ttsEngine.config.volume ?? 85;
    updateVolUI(volSlider.value);
  }
  if (speedSlider) {
    speedSlider.value = ttsEngine.config.speed ?? 1.0;
    updateSpeedUI(speedSlider.value);
  }
  if (pitchSlider) {
    pitchSlider.value = ttsEngine.config.pitch ?? 1.0;
    updatePitchUI(pitchSlider.value);
  }
  if (langSelect && ttsEngine.config.language) {
    langSelect.value = ttsEngine.config.language;
  }
  if (randomVoiceCheck) {
    randomVoiceCheck.checked = Boolean(ttsEngine.config.randomVoice);
  }
  document.querySelectorAll('input[name="tts-engine"]').forEach(radio => {
    radio.checked = radio.value === (ttsEngine.config.engine || 'local');
  });

  const populateVoices = () => {
    if (!voiceSelect) return;
    const systemVoices = ttsEngine.getVoicesList();
    const currentVal = ttsEngine.config.voiceName || 'tiktok:es_mx_002';

    let html = `
      <optgroup label="🌟 Voces Virales TikTok (Recomendado)">
        <option value="tiktok:es_mx_002">🎵 Voz TikTok Latam (Viral - Clásica)</option>
        <option value="tiktok:es_002">🎙️ Voz TikTok Masculina (Viral)</option>
        <option value="tiktok:es_mx_001">🎙️ Voz TikTok Femenina (Viral)</option>
      </optgroup>
      <optgroup label="⚡ Voces Naturales / Neurales (Edge / Google)">
        <option value="system:natural_male">🎙️ Narrador Natural Masculino (Alvaro / Jorge)</option>
        <option value="system:natural_female">🎙️ Narradora Natural Femenina (Dalia / Elvira)</option>
      </optgroup>
    `;

    if (systemVoices.length) {
      html += `<optgroup label="💻 Voces del Sistema (Locales SAPI)">`;
      html += systemVoices.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
      html += `</optgroup>`;
    }

    voiceSelect.innerHTML = html;
    voiceSelect.value = currentVal;
    if (!voiceSelect.value) {
      voiceSelect.value = 'tiktok:es_mx_002';
    }
  };
  populateVoices();
  document.getElementById('btn-refresh-voices')?.addEventListener('click', () => {
    populateVoices();
    showToast('🎙️ Lista de voces actualizada');
  });

  // 1. Interruptor Maestro ON / OFF
  masterToggle?.addEventListener('change', async e => {
    const isEnabled = e.target.checked;
    ttsEngine.updateConfig({ enabled: isEnabled });
    updateMasterUI(isEnabled);
    await app.persistConfig();
    showToast(isEnabled ? '🎙️ TTS Chat Activado' : '🔇 TTS Chat Desactivado y Silenciado');
  });

  // 2. Parar voz y vaciar cola
  document.getElementById('btn-tts-stop-voice')?.addEventListener('click', () => {
    ttsEngine.stop();
    showToast('⏹ Locución detenida y cola vaciada');
  });

  // 3. Restablecer valores de voz por defecto
  document.getElementById('btn-tts-reset-settings')?.addEventListener('click', async () => {
    ttsEngine.updateConfig({
      enabled: true,
      volume: 85,
      speed: 1.0,
      pitch: 1.0,
      voiceName: 'tiktok:es_mx_002',
      engine: 'tiktok'
    });
    updateMasterUI(true);
    if (volSlider) { volSlider.value = 85; updateVolUI(85); }
    if (speedSlider) { speedSlider.value = 1.0; updateSpeedUI(1.0); }
    if (pitchSlider) { pitchSlider.value = 1.0; updatePitchUI(1.0); }
    if (voiceSelect) voiceSelect.value = 'tiktok:es_mx_002';
    document.querySelectorAll('input[name="tts-engine"]').forEach(radio => {
      radio.checked = radio.value === 'tiktok';
    });
    await app.persistConfig();
    showToast('↺ Ajustes TTS restablecidos (Voz TikTok Latam, Vol: 85%, Vel: 1.0x)');
  });

  // 4. Control de Volumen (0% a 100%)
  volSlider?.addEventListener('input', e => {
    const val = Number(e.target.value);
    updateVolUI(val);
    ttsEngine.updateConfig({ volume: val });
  });
  volSlider?.addEventListener('change', () => {
    app.persistConfig();
  });

  // 5. Control de Velocidad (0.5x a 2.0x)
  speedSlider?.addEventListener('input', e => {
    const val = Number(e.target.value);
    updateSpeedUI(val);
    ttsEngine.updateConfig({ speed: val });
  });
  speedSlider?.addEventListener('change', () => {
    app.persistConfig();
  });

  // 6. Control de Tono (0.5 a 1.5)
  pitchSlider?.addEventListener('input', e => {
    const val = Number(e.target.value);
    updatePitchUI(val);
    ttsEngine.updateConfig({ pitch: val });
  });
  pitchSlider?.addEventListener('change', () => {
    app.persistConfig();
  });

  // 7. Selectores de Motor, Idioma y Voces
  document.querySelectorAll('input[name="tts-engine"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        let vName = ttsEngine.config.voiceName || 'tiktok:es_mx_002';
        if (radio.value === 'tiktok' && !vName.startsWith('tiktok:')) {
          vName = 'tiktok:es_mx_002';
        } else if (radio.value === 'edge' && !vName.startsWith('system:')) {
          vName = 'system:natural_male';
        }
        ttsEngine.updateConfig({ engine: radio.value, voiceName: vName });
        if (voiceSelect) voiceSelect.value = vName;
        app.persistConfig();
      }
    });
  });

  langSelect?.addEventListener('change', e => {
    ttsEngine.updateConfig({ language: e.target.value });
    app.persistConfig();
  });

  voiceSelect?.addEventListener('change', e => {
    const val = e.target.value;
    const isTikTok = val.startsWith('tiktok:');
    const isNeural = val.startsWith('system:');
    const newEngine = isTikTok ? 'tiktok' : (isNeural ? 'edge' : 'local');
    ttsEngine.updateConfig({
      voiceName: val,
      engine: newEngine
    });
    document.querySelectorAll('input[name="tts-engine"]').forEach(radio => {
      radio.checked = radio.value === newEngine;
    });
    app.persistConfig();
  });

  randomVoiceCheck?.addEventListener('change', e => {
    ttsEngine.updateConfig({ randomVoice: e.target.checked });
    app.persistConfig();
  });

  // 8. Probador Normal de Voz
  document.getElementById('btn-test-tts-speak')?.addEventListener('click', () => {
    const txt = document.getElementById('tts-test-input')?.value || 'Hola streamer, bienvenido a GALACTK PANEL';
    ttsEngine.speak(txt, true);
    showToast('🔊 Probando voz TTS...');
  });

  // 9. Probador del Sanitizador Léxico Anti-Locuras
  document.getElementById('btn-test-tts-sanitize')?.addEventListener('click', () => {
    const rawSample = "¡Holaa GZ7!! 🔥🚀😊 [rose] h̷e̷l̷l̷o̷ esternocleidomastoideo aaaaaaaa!!!! $50 S/. 100";
    const cleaned = ttsEngine.sanitizeText(rawSample);
    const inputEl = document.getElementById('tts-test-input');
    if (inputEl) inputEl.value = cleaned;
    ttsEngine.speak(cleaned);
    showToast('🛡️ Anti-Locuras: emojis, zalgo y spam purificados con fluidez');
  });
}

// -----------------------------------------------------------------
// 9. TOPS, METAS Y MVP + ESCALA Y COPIADO DE LINKS
// -----------------------------------------------------------------
document.querySelectorAll('#tops-subtabs .tops-subtab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tops-subtabs .tops-subtab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tops-active-url-input').value = btn.getAttribute('data-top-url');
  });
});

document.getElementById('btn-copy-tops-url')?.addEventListener('click', () => {
  const url = document.getElementById('tops-active-url-input').value;
  navigator.clipboard.writeText(url);
  const b = document.getElementById('btn-copy-tops-url');
  b.textContent = 'Copiado';
  showToast(`URL copiada: ${url}`);
  setTimeout(() => { b.textContent = 'Copiar URL'; }, 1500);
});

document.getElementById('btn-test-tops-event')?.addEventListener('click', () => {
  app.handleGiftEvent({
    giftName: 'Galaxy',
    diamondCount: 1000,
    repeatCount: 1,
    nickname: 'GZ7_MVP'
  });
  showToast('Evento simulado en Ranking y MVP (Galaxy 1,000 diamantes)');
});

document.querySelectorAll('.btn-copy-url').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-url');
    navigator.clipboard.writeText(url);
    const orig = btn.textContent;
    btn.textContent = 'Copiado';
    showToast(`Link copiado: ${url}`);
    setTimeout(() => { btn.textContent = orig; }, 1400);
  });
});

const syncScale = async (val) => {
  document.getElementById('overlay-gift-scale-val').textContent = val + '%';
  document.getElementById('mc-overlay-scale-label').textContent = val + '%';
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  if (invoke) await invoke('set_gift_scale', { scale: Number(val) });
};
document.getElementById('overlay-gift-scale-slider')?.addEventListener('input', e => syncScale(e.target.value));
document.getElementById('mc-overlay-scale-slider')?.addEventListener('input', e => syncScale(e.target.value));

// -----------------------------------------------------------------
// 10. RCON & INSTALADOR SERVIDOR MINECRAFT
// -----------------------------------------------------------------

return { app, store, rconBridge, soundManager, giftRegistry, giftUrl, renderWaveformSvg, renderRobloxEditor, renderGiftsTable, syncGiftWithActivePreset, openGiftModalForRobloxSlot, openS2EAudioModal, crearServidorMinecraft, lanzarServidorMinecraft, finish() {
applyProfileMode(app.activeProfile || 'roblox');
updateCatalogPreview(CATALOGO_GIFTS[0]);
renderCatalog();
renderGiftsTable();
initTtsControls();
} };
}
