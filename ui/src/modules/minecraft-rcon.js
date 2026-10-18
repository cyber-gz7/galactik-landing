import { showToast } from '../core/toast.js';
import { enhanceRconWorkspace } from './minecraft-workspace.js';

export function initMinecraftRcon({ app, store, rconBridge, crearServidorMinecraft, lanzarServidorMinecraft, giftRegistry, renderGiftsTable }) {
  const rconConsole = document.getElementById('rcon-console-log');
  const serverPathEl = document.getElementById('mc-detected-server-path');
  const playerNickInput = document.getElementById('mc-player-nick');
  const statusPill = document.getElementById('mc-server-status-pill');
  const installerModal = document.getElementById('modal-mc-installer');
  const installerLog = document.getElementById('mc-installer-log');
  const nightVisionToggles = document.querySelectorAll('#toggle-night-vision-mc, .toggle-night-vision');

  const defaultServerFolder = 'C:\\Proyectos\\GalacticLive\\minecraft_server_1.20.1';
  let activeServerFolder = localStorage.getItem('galactk_mc_folder') || defaultServerFolder;
  let activePlayerNick = localStorage.getItem('galactk_mc_player') || 'cj7_tutoriales';

  if (serverPathEl) serverPathEl.textContent = activeServerFolder;
  if (playerNickInput) {
    playerNickInput.value = activePlayerNick;
    store.state.targetPlayer = activePlayerNick;
    playerNickInput.addEventListener('input', e => {
      const val = e.target.value.trim() || 'cj7_tutoriales';
      activePlayerNick = val;
      store.state.targetPlayer = val;
      localStorage.setItem('galactk_mc_player', val);
      updateNightVisionState();
    });
  }

  function getInvoke() {
    return window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke || null;
  }

  async function updateNightVisionState(enabledOverride = null) {
    const invoke = getInvoke();
    if (!invoke) return;
    const isEnabled = enabledOverride !== null 
      ? enabledOverride 
      : Boolean(document.querySelector('#toggle-night-vision-mc')?.checked);
    try {
      await invoke('set_night_vision', {
        enabled: isEnabled,
        player: activePlayerNick || 'cj7_tutoriales',
        fallbackSeconds: 0
      });
    } catch (err) {
      console.warn('Error configurando visión nocturna:', err);
    }
  }

  nightVisionToggles.forEach(toggle => {
    toggle.addEventListener('change', async e => {
      const checked = e.target.checked;
      nightVisionToggles.forEach(t => { if (t !== toggle) t.checked = checked; });
      await updateNightVisionState(checked);
      showToast(checked 
        ? `👁️ Visión Nocturna Infinita ACTIVADA para ${activePlayerNick}` 
        : `👁️ Visión Nocturna Infinita DESACTIVADA`);
    });
  });

  async function checkServerStatus() {
    const invoke = getInvoke();
    if (!invoke) {
      if (statusPill) {
        statusPill.textContent = '● MODO NAVEGADOR';
        statusPill.style.color = '#ffb300';
      }
      return;
    }
    try {
      const exists = await invoke('check_server_exists', { folder: activeServerFolder });
      if (!exists) {
        if (statusPill) {
          statusPill.textContent = '● NO DETECTADO';
          statusPill.style.color = '#ff4a75';
          statusPill.style.borderColor = 'rgba(255, 74, 117, 0.4)';
          statusPill.style.background = 'rgba(255, 74, 117, 0.12)';
        }
        return;
      }
      const running = await invoke('check_server_running', { folder: activeServerFolder });
      if (running) {
        if (statusPill) {
          statusPill.textContent = '● EN EJECUCIÓN (PAPER 1.20.1)';
          statusPill.style.color = '#00ffa3';
          statusPill.style.borderColor = 'rgba(0, 255, 163, 0.4)';
          statusPill.style.background = 'rgba(0, 255, 163, 0.12)';
        }
      } else {
        if (statusPill) {
          statusPill.textContent = '● DETENIDO (LISTO)';
          statusPill.style.color = '#cbd5e1';
          statusPill.style.borderColor = 'rgba(203, 213, 225, 0.3)';
          statusPill.style.background = 'rgba(203, 213, 225, 0.08)';
        }
      }
    } catch (err) {
      console.warn('Error verificando estado de servidor:', err);
    }
  }

  // Comandos de servidor
  document.getElementById('btn-run-mc-server')?.addEventListener('click', async () => {
    const invoke = getInvoke();
    if (!invoke) return showToast('Requiere abrir la aplicación de escritorio Galactic Live');
    showToast('🚀 Desbloqueando locks y lanzando Servidor Paper 1.20.1...');
    if (statusPill) {
      statusPill.textContent = '● INICIANDO...';
      statusPill.style.color = '#ffab00';
    }
    try {
      const msg = await invoke('launch_server_bat', { folder: activeServerFolder });
      showToast(`✔ ${msg}`);
      if (rconConsole) rconConsole.textContent += `\n[SERVIDOR] ${msg}`;
      setTimeout(checkServerStatus, 2000);
      setTimeout(checkServerStatus, 6000);
    } catch (err) {
      showToast(`⚠️ Error al iniciar servidor: ${err.message || err}`);
      if (rconConsole) rconConsole.textContent += `\n[ERROR SERVIDOR] ${err.message || err}`;
      checkServerStatus();
    }
  });

  document.getElementById('btn-stop-mc-server')?.addEventListener('click', async () => {
    const invoke = getInvoke();
    if (!invoke) return showToast('Requiere abrir la aplicación de escritorio Galactic Live');
    showToast('⏹ Deteniendo procesos de servidor Minecraft...');
    try {
      const msg = await invoke('stop_server_process', { folder: activeServerFolder });
      showToast(`✔ ${msg}`);
      if (rconConsole) rconConsole.textContent += `\n[SERVIDOR] ${msg}`;
      setTimeout(checkServerStatus, 1500);
    } catch (err) {
      showToast(`⚠️ ${err.message || err}`);
      checkServerStatus();
    }
  });

  document.getElementById('btn-refresh-mc-server')?.addEventListener('click', async () => {
    showToast('🔄 Comprobando estado del servidor...');
    await checkServerStatus();
  });

  // Modal Asistente PaperMC
  document.getElementById('btn-open-mc-installer-modal')?.addEventListener('click', () => {
    if (installerModal) installerModal.style.display = 'flex';
  });
  document.getElementById('btn-close-mc-installer-modal')?.addEventListener('click', () => {
    if (installerModal) installerModal.style.display = 'none';
  });
  document.getElementById('btn-cancel-mc-installer')?.addEventListener('click', () => {
    if (installerModal) installerModal.style.display = 'none';
  });

  // Creación de servidor desde el instalador
  document.getElementById('btn-create-mc-server')?.addEventListener('click', async () => {
    showToast('⏳ Descargando y configurando Paper 1.20.1...');
    const targetFolder = document.getElementById('mc-server-folder')?.value.trim() || activeServerFolder;
    activeServerFolder = targetFolder;
    localStorage.setItem('galactk_mc_folder', targetFolder);
    if (serverPathEl) serverPathEl.textContent = targetFolder;

    await crearServidorMinecraft({
      carpeta: targetFolder,
      opNick: document.getElementById('mc-server-op')?.value.trim() || activePlayerNick,
      modo: document.getElementById('mc-server-mode')?.value || 'nopremium',
      ramGb: Number(document.getElementById('mc-server-ram')?.value) || 4,
      rconPass: document.getElementById('mc-server-rcon-pass')?.value.trim() || 'gz7livepassword',
      onLog: msg => { 
        if (installerLog) {
          installerLog.textContent += `\n${msg}`; 
          installerLog.scrollTop = installerLog.scrollHeight; 
        }
      }
    });
    checkServerStatus();
  });

  // RCON existente
  document.getElementById('btn-toggle-rcon-pass')?.addEventListener('click', () => {
    const inp = document.getElementById('rcon-pass-input');
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('btn-clear-rcon-log')?.addEventListener('click', () => {
    if (rconConsole) rconConsole.textContent = '[RCON] Consola limpia.';
  });

  document.getElementById('btn-save-rcon')?.addEventListener('click', async () => {
    store.setRconConfig({
      host: document.getElementById('rcon-host-input').value.trim(),
      port: Number(document.getElementById('rcon-port-input').value) || 25575,
      password: document.getElementById('rcon-pass-input').value
    });
    await app.persistConfig();
    if (rconConsole) rconConsole.textContent += `\n[RCON] Configuración guardada.`;
    showToast('✔ Configuración RCON guardada');
  });

  document.getElementById('btn-test-rcon')?.addEventListener('click', async () => {
    if (!window.__TAURI__) return showToast('La prueba RCON requiere abrir la aplicación de escritorio.');
    store.setRconConfig({
      host: document.getElementById('rcon-host-input').value.trim(),
      port: Number(document.getElementById('rcon-port-input').value) || 25575,
      password: document.getElementById('rcon-pass-input').value
    });
    const res = await rconBridge.testConnection();
    if (rconConsole) rconConsole.textContent += `\n[${res.success ? 'OK' : 'ERROR'}] ${res.message}`;
    showToast(res.success ? '✔ RCON Conectado' : `⚠️ RCON: ${res.message}`);
    if (res.success) {
      updateNightVisionState();
    }
  });

  // Verificar estado inicial
  checkServerStatus();
  updateNightVisionState();

  enhanceRconWorkspace({ app, store, rconBridge, giftRegistry, renderGiftsTable });
  return {};
}
