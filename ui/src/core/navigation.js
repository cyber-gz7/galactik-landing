import { showToast } from './toast.js';
export function initNavigation({ app, renderCatalog, renderRobloxEditor, renderSoundboard, renderGiftsTable, renderS2EPresetsStudio, renderAlertasChromaStudio, renderAdminLicenses }) {
const modeButtons = document.querySelectorAll('.mode-btn');
const profileCards = document.querySelectorAll('.profile-select-card');
const navButtons = document.querySelectorAll('.nav-tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const footerModeText = document.getElementById('footer-mode-indicator');

const tabTitles = {
  'tab-inicio': 'Inicio • Panel',
  'tab-minecraft': 'Minecraft • Overlays & Tótems',
  'tab-roblox': 'Roblox Obby • Editor Gift vs Gift',
  'tab-catalog': 'Catálogo • 1,770 Regalos TikTok',
  'tab-sounds': 'Sonidos & Memes • Soundboard',
  'tab-tts': 'TTS Chat • Voz en Vivo',
  'tab-tops': 'Tops, Metas y MVP',
  'tab-rcon': 'Minecraft RCON & Servidor Local',
  'tab-music-mods': '🎵 Música & Control de Moderadores',
  'tab-alertas': 'Alertas de pantalla · BETA',
  'tab-admin-licenses': 'Admin • Licencias'
};

function switchTab(targetId) {
  if (!document.getElementById(targetId)) return;
  document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === targetId));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === targetId));

  const topbarLabel = document.getElementById('topbar-active-tab-label');
  if (topbarLabel && tabTitles[targetId]) {
    topbarLabel.textContent = tabTitles[targetId];
  }

  if (targetId === 'tab-catalog') renderCatalog();
  if (targetId === 'tab-roblox') renderRobloxEditor();
  if (targetId === 'tab-sounds') renderSoundboard();
  if (targetId === 'tab-minecraft') {
    renderGiftsTable();
    renderS2EPresetsStudio();
  }
  if (targetId === 'tab-alertas') renderAlertasChromaStudio();
  if (targetId === 'tab-admin-licenses' && renderAdminLicenses) renderAdminLicenses();
  document.querySelector('.main-view-container')?.scrollTo({ top:0 });
}

function applyProfileMode(profile) {
  app.activeProfile = profile;

  modeButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-profile') === profile));
  profileCards.forEach(c => {
    const isCurrent = c.getAttribute('data-select-profile') === profile;
    c.classList.toggle('active', isCurrent);
    const badge = c.querySelector('.profile-card-badge');
    if (badge) badge.textContent = isCurrent ? 'ACTIVO' : 'ELEGIR';
  });

  document.querySelectorAll('.mode-only-minecraft').forEach(el => {
    el.classList.toggle('hidden-by-mode', profile !== 'minecraft' && !el.classList.contains('nav-tab-btn'));
  });
  document.querySelectorAll('.mode-only-roblox').forEach(el => {
    el.classList.toggle('hidden-by-mode', profile !== 'roblox' && !el.classList.contains('nav-tab-btn'));
  });

  const labels = {
    minecraft: 'PERFIL ACTIVO: ⛏️ MODO MINECRAFT',
    roblox: 'PERFIL ACTIVO: 🚴 MODO ROBLOX (OBBY BICICLETA)',
    universal: 'PERFIL ACTIVO: 🌐 MODO STREAM UNIVERSAL'
  };
  if (footerModeText) footerModeText.textContent = labels[profile] || labels.minecraft;

  app.persistConfig();
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const prof = btn.getAttribute('data-profile');
    applyProfileMode(prof);
    showToast(`Modo cambiado a: ${prof.toUpperCase()}`);
    if (prof === 'roblox') switchTab('tab-roblox');
    else if (prof === 'minecraft') switchTab('tab-minecraft');
    else switchTab('tab-inicio');
  });
});

profileCards.forEach(card => {
  card.addEventListener('click', () => {
    const prof = card.getAttribute('data-select-profile');
    applyProfileMode(prof);
    showToast(`Perfil seleccionado: ${prof.toUpperCase()}`);
    if (prof === 'roblox') switchTab('tab-roblox');
    else if (prof === 'minecraft') switchTab('tab-minecraft');
  });
});

document.getElementById('main-nav-tabs').addEventListener('click', event => {
  const button = event.target.closest('[data-tab]');
  if (!button) return;
  if (button.dataset.tab === 'tab-roblox' && app.activeProfile !== 'roblox') applyProfileMode('roblox');
  if (['tab-minecraft','tab-rcon'].includes(button.dataset.tab) && app.activeProfile !== 'minecraft') applyProfileMode('minecraft');
  switchTab(button.dataset.tab);
});

// Control del Sidebar macOS Sequoia / iPadOS Colapsable
function initSidebarLayout() {
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtns = document.querySelectorAll('#sidebar-toggle-btn, #topbar-toggle-btn');
  if (!sidebar) return;

  const setCollapsed = (collapsed) => {
    sidebar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('sidebar-is-collapsed', collapsed);
    try { localStorage.setItem('gz7_sidebar_collapsed', collapsed ? '1' : '0'); } catch(e){}
  };

  try {
    if (localStorage.getItem('gz7_sidebar_collapsed') === '1') {
      setCollapsed(true);
    }
  } catch(e){}

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.contains('collapsed');
      setCollapsed(!isCollapsed);
    });
  });

  document.getElementById('btn-sidebar-license')?.addEventListener('click', () => {
    const isMaster = window.gz7LicenseClient?.status?.role === 'ADMIN' ||
                     window.gz7LicenseClient?.status?.hwid === 'GL-E320-79485B-AFD734' ||
                     window.gz7LicenseClient?.status?.username === 'GZ7_ADMIN' ||
                     window.gz7LicenseClient?.status?.email === 'gerardyabdiel09@gmail.com';
    if (isMaster) {
      document.getElementById('nav-btn-admin-licenses')?.click();
      return;
    }
    const gate = document.getElementById('gz7-license-gate-overlay');
    if (gate) {
      gate.style.display = 'flex';
    } else {
      document.getElementById('btn-switch-gz7-license')?.click();
    }
  });
}

initSidebarLayout();


return { switchTab, applyProfileMode };
}
