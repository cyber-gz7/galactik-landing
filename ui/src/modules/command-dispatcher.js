import { EventEmitter, store } from '../store.js';
import { permissionManager } from './permission-manager.js';
import { songQueue } from './music-queue.js';
import { showToast } from '../core/toast.js';
import { rconBridge } from '../rcon.js';
import { ttsEngine } from '../tts.js';

export class CommandDispatcher extends EventEmitter {
  constructor() {
    super();
  }

  async dispatchChat(user, comment, rawEvent = {}) {
    const cleanUser = permissionManager.normalizeUser(user);
    const text = String(comment || '').trim();
    if (!text) return;

    // 1. Acumulación pasiva de puntos por interacción
    permissionManager.addPoints(cleanUser, 2);

    // 2. Comandos de Asignación de Roles: @usuario -> mod / mvp / vip / default
    const roleAssignMatch = text.match(/^@?([a-zA-Z0-9_.-]+)\s*(?:->|=>|=)\s*(mod|mods|mvp|vip|default)$/i);
    if (roleAssignMatch) {
      return this.handleRoleAssignment(cleanUser, roleAssignMatch[1], roleAssignMatch[2]);
    }

    // 3. Comandos con prefijo '!'
    if (!text.startsWith('!')) return;

    const parts = text.slice(1).split(/\s+/);
    const cmd = (parts[0] || '').toLowerCase();
    const args = parts.slice(1);
    const fullArgStr = args.join(' ');

    switch (cmd) {
      case 'alerta':
      case 'alert':
      case 'mvp':
        return this.handleAlertCommand(cleanUser, args[0]);

      case 'sr':
      case 'song':
      case 'cancion':
      case 'songrequest':
        return this.handleSongRequest(cleanUser, fullArgStr);

      case 'skip':
      case 'next':
      case 'saltar':
        return this.handleSkipCommand(cleanUser);

      case 'pause':
      case 'pausar':
        return this.handlePauseCommand(cleanUser);

      case 'resume':
      case 'play':
      case 'reanudar':
        return this.handleResumeCommand(cleanUser);

      case 'volume':
      case 'vol':
      case 'volumen':
        return this.handleVolumeCommand(cleanUser, args[0]);

      case 'puntos':
      case 'points':
      case 'pts':
        return this.handlePointsQuery(cleanUser);

      case 'caos':
      case 'chaos':
        return this.handleChaosCommand(cleanUser, fullArgStr);

      default:
        break;
    }
  }

  async handleRoleAssignment(sender, targetUser, targetRole) {
    const isSenderMod = permissionManager.hasRole(sender, 'mods');
    if (!isSenderMod) {
      showToast(`@${sender}: Solo los moderadores pueden asignar roles.`);
      return { ok: false, error: 'No autorizado' };
    }

    const res = permissionManager.setRole(targetUser, targetRole);
    if (res.ok) {
      const msg = `👑 Rol actualizado: @${res.user} ahora es [${res.role.toUpperCase()}]`;
      showToast(msg);
      this.emit('command:feedback', { type: 'role_assigned', message: msg, user: res.user, role: res.role });
      return { ok: true, message: msg };
    }

    showToast(`Error: ${res.error}`);
    return res;
  }

  async handleAlertCommand(user, tipoArg) {
    const isModOrMvp = permissionManager.hasRole(user, 'mvp');
    const userRole = permissionManager.getRole(user);

    // Si no tiene rol mod o mvp, verificar si tiene suficientes puntos
    if (!isModOrMvp) {
      const cost = permissionManager.pointCosts.alerta || 25;
      const currentPts = permissionManager.getPoints(user);
      if (currentPts < cost) {
        const msg = `@${user}: Necesitas rol MOD/MVP o ${cost} puntos (Tienes: ${currentPts} pts).`;
        showToast(msg);
        return { ok: false, error: msg };
      }
    }

    // Rate Limiting (Anti-Spam): Cooldown individual (30s) y Cooldown global (10s)
    const cdCheck = permissionManager.checkVisualCooldown(user);
    if (!cdCheck.allowed) {
      showToast(cdCheck.message);
      this.emit('command:feedback', { type: 'cooldown', message: cdCheck.message, user });
      return { ok: false, error: cdCheck.message };
    }

    // Consumir cooldowns activos
    permissionManager.consumeVisualCooldown(user);

    // Si es viewer común que canjeó con puntos, deducir costo
    if (!isModOrMvp) {
      permissionManager.deductPoints(user, permissionManager.pointCosts.alerta || 25);
    }

    // Resolver video y template asignado
    const alertPreset = permissionManager.getAlertPreset(tipoArg || 'entrada');
    const alertPayload = {
      user: `@${user}`,
      tipo: alertPreset.tipo,
      template: alertPreset.template, // Si es "", la capa de texto en alerta.html NO renderiza texto
      videoUrl: alertPreset.videoUrl,
      duration: alertPreset.duration || 5.0,
      audioUrl: alertPreset.audioUrl || '',
      badge: userRole === 'mods' ? '👑 MODERADOR' : (userRole === 'mvp' ? '⭐ MVP CYBER' : '🔥 ALERTA VIP')
    };

    // Despacho a través de Tauri Invoke y/o HTTP hacia overlay_server
    await this.dispatchAlertToOverlay(alertPayload);

    const confirmationMsg = `🎬 Alerta MVP lanzada por @${user} (${alertPreset.tipo})`;
    showToast(confirmationMsg);
    this.emit('command:feedback', { type: 'alert_triggered', user, preset: alertPreset });
    return { ok: true, alert: alertPayload };
  }

  async dispatchAlertToOverlay(alertData) {
    // 1. Invocar vía Tauri IPC si está en la app de escritorio
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      try {
        await invoke('emit_custom_alert', {
          alert_json: JSON.stringify(alertData)
        });
        return;
      } catch (_) {}
    }

    // 2. Fallback vía HTTP POST /api/alerta/trigger
    try {
      await fetch('http://127.0.0.1:4000/api/alerta/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert: alertData })
      });
    } catch (_) {}
  }

  async handleSongRequest(user, query) {
    if (!query) {
      showToast(`@${user}: Uso: !sr <link o nombre de YouTube>`);
      return { ok: false, error: 'Query vacía' };
    }

    const res = await songQueue.addRequest(query, user);
    if (!res.ok) {
      showToast(`@${user}: ${res.error}`);
      return res;
    }

    const toastMsg = res.playing
      ? `▶️ Reproduciendo ahora: ${res.track.title} (@${user})`
      : `🎵 Canción añadida (#${res.position}): ${res.track.title} (@${user})`;

    showToast(toastMsg);
    this.emit('command:feedback', { type: 'song_added', user, track: res.track, playing: res.playing });
    return res;
  }

  async handleSkipCommand(user) {
    const isMod = permissionManager.hasRole(user, 'mods');
    if (!isMod) {
      const skipCost = permissionManager.pointCosts.skip || 50;
      const pts = permissionManager.getPoints(user);
      if (pts < skipCost) {
        const msg = `@${user}: Solo los mods pueden saltar canciones (o canjea por ${skipCost} pts).`;
        showToast(msg);
        return { ok: false, error: msg };
      }
      permissionManager.deductPoints(user, skipCost);
    }

    const res = songQueue.skip(`Saltado por @${user}`);
    const msg = `⏭️ Canción saltada por @${user}`;
    showToast(msg);
    this.emit('command:feedback', { type: 'song_skipped', user });
    return { ok: true, message: msg };
  }

  async handlePauseCommand(user) {
    if (!permissionManager.hasRole(user, 'mods')) {
      showToast(`@${user}: Solo moderadores pueden pausar la música.`);
      return { ok: false, error: 'No autorizado' };
    }
    songQueue.pause();
    showToast(`⏸️ Música pausada por @${user}`);
    return { ok: true };
  }

  async handleResumeCommand(user) {
    if (!permissionManager.hasRole(user, 'mods')) {
      showToast(`@${user}: Solo moderadores pueden reanudar la música.`);
      return { ok: false, error: 'No autorizado' };
    }
    songQueue.resume();
    showToast(`▶️ Música reanudada por @${user}`);
    return { ok: true };
  }

  async handleVolumeCommand(user, volumeArg) {
    if (!permissionManager.hasRole(user, 'mods')) {
      showToast(`@${user}: Solo moderadores pueden cambiar el volumen.`);
      return { ok: false, error: 'No autorizado' };
    }
    const vol = parseInt(volumeArg, 10);
    if (isNaN(vol) || vol < 0 || vol > 100) {
      showToast(`@${user}: Uso: !volume <0-100>`);
      return { ok: false, error: 'Volumen inválido' };
    }
    songQueue.setVolume(vol);
    showToast(`🔊 Volumen establecido en ${vol}% por @${user}`);
    return { ok: true, volume: vol };
  }

  handlePointsQuery(user) {
    const pts = permissionManager.getPoints(user);
    const role = permissionManager.getRole(user).toUpperCase();
    const msg = `💎 @${user} tiene ${pts} puntos | Rol: ${role}`;
    showToast(msg);
    return { ok: true, points: pts, role };
  }

  async handleChaosCommand(user, targetArg) {
    const isModOrMvp = permissionManager.hasRole(user, 'mvp');
    if (!isModOrMvp) {
      const cost = 50;
      const currentPts = permissionManager.getPoints(user);
      if (currentPts < cost) {
        const msg = `@${user}: Necesitas rol MOD/MVP o ${cost} puntos para desatar !caos (Tienes: ${currentPts} pts).`;
        showToast(msg);
        return { ok: false, error: msg };
      }
      permissionManager.deductPoints(user, cost);
    }

    const targetPlayer = (targetArg || store.getState()?.streamerUsername || 'CJ7_TUTORIALES').trim().replace(/[^a-zA-Z0-9_]/g, '_') || 'CJ7_TUTORIALES';
    const cmd = `survival caos ${user} ${targetPlayer}`;
    try {
      await rconBridge.sendCommand(cmd);
    } catch (e) {
      console.warn('Error enviando comando caos RCON:', e);
    }

    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      try {
        await invoke('emit_custom_alert', {
          alert_json: JSON.stringify({
            title: '¡MODO CAOS ACTIVADO!',
            subtitle: `@${user} desató el caos absoluto en la partida`,
            videoUrl: '/s2e_media/videos/public/any/1778416845980_goose-chaos-rush.webm',
            chromaEnabled: true,
            chromaMode: 'auto',
            chromaColor: '#00ff00',
            duration: 5.5,
            isModeratorCommand: true
          })
        });
      } catch (_) {}
    }

    ttsEngine.speak(`¡Alerta de Caos! ${user} desató el caos en Minecraft`);
    showToast(`🔥 ¡Comando !caos ejecutado por @${user}!`);
    return { ok: true, message: `Caos activado por @${user}` };
  }
}

export const commandDispatcher = new CommandDispatcher();
