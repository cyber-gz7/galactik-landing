import { handleRobloxGiftVsGift } from '../modules/obby-engine.js';
import { store } from '../store.js';
import { tikTokBridge } from '../tiktok.js';
import { giftRegistry, PRESETS, archivoDeGift, limpiarArchivoGift, giftsEquivalentes, encontrarGrupoCanonicoGift } from '../gifts.js';
import { rconBridge } from '../rcon.js';
import { soundManager } from '../sounds.js';
import { ttsEngine } from '../tts.js';
import { overlayServer } from '../overlay-server.js';
import { S2E_PRESETS_CATALOG, S2E_ALERT_VIDEOS } from '../s2e-catalog.js';
import '../license-client.js';

import { DEFAULT_ROBLOX_CONFIG } from '../modules/obby-config.js';
import { commandDispatcher } from '../modules/command-dispatcher.js';
import { permissionManager } from '../modules/permission-manager.js';

export const DEFAULT_ALERT_ALBUMS = [
  {
    id: 'album_quiereme',
    name: 'Quiereme',
    triggers: [
      {
        id: 'trig_1',
        active: true,
        name: 'Alerta Croma Personalizada GZ7 (Quiéreme)',
        triggerType: 'SelectedGift',
        giftName: 'Quiereme',
        giftCoins: 1,
        likeThreshold: 100,
        videoUrl: S2E_ALERT_VIDEOS[0]?.url || 'http://localhost:4000/s2e_media/users/6a8a3541466456082538e291/videos/1791064113135_Sin título - 03 de octubre de 2026 a las 16.32.57.mp4',
        videoName: S2E_ALERT_VIDEOS[0]?.name || 'Sin título - 03 de octubre de 2026 a las 16.32.57.mp4',
        chromaEnabled: true,
        chromaMode: 'auto',
        chromaColor: '#00ff00',
        similarity: 38,
        smoothness: 12,
        audioName: 'crack_the_whip.mp3',
        audioUrl: 'http://localhost:4000/s2e_media/audio/public/1708877462401_crack_the_whip.mp3',
        audioVolume: 100,
        playerType: 'priority',
        priority: 5,
        multiplier: false,
        ttsEnabled: false,
        ttsTemplate: '',
        titleTemplate: '',
        subtitleTemplate: '',
        duration: 5
      },
      {
        id: 'trig_2',
        active: true,
        name: 'Jumpscare Boo Rush (Croma Auto)',
        triggerType: 'SelectedGift',
        giftName: 'GG',
        giftCoins: 1,
        likeThreshold: 200,
        videoUrl: 'http://localhost:4000/s2e_media/videos/public/any/1789666307528_screen-cover-boo-rush.webm',
        videoName: 'screen-cover-boo-rush.webm',
        chromaEnabled: true,
        chromaMode: 'auto',
        chromaColor: '#00ff00',
        similarity: 36,
        smoothness: 14,
        audioName: 'police-siren-sound-effect.mp3',
        audioUrl: 'http://localhost:4000/s2e_media/audio/public/1791367188643_police-siren-sound-effect.mp3',
        audioVolume: 100,
        playerType: 'priority',
        priority: 8,
        multiplier: false,
        ttsEnabled: true,
        ttsTemplate: '¡Alerta máxima! {user} activó {gift}',
        titleTemplate: '{user}',
        subtitleTemplate: '¡Activó Jumpscare con {gift}!',
        duration: 4.5
      },
      {
        id: 'trig_3',
        active: true,
        name: 'Martillo de Thor Épico',
        triggerType: 'SelectedGift',
        giftName: 'Heart Me',
        giftCoins: 1,
        likeThreshold: 500,
        videoUrl: 'http://localhost:4000/s2e_media/videos/public/any/1778416864780_pd-thor-hammer-flyby.webm',
        videoName: 'pd-thor-hammer-flyby.webm',
        chromaEnabled: true,
        chromaMode: 'auto',
        chromaColor: '#00ff00',
        similarity: 35,
        smoothness: 10,
        audioName: 'thunder-v1.mp3',
        audioUrl: 'http://localhost:4000/s2e_media/audio/public/1699891902848_thunder-v1.mp3',
        audioVolume: 100,
        playerType: 'priority',
        priority: 7,
        multiplier: false,
        ttsEnabled: true,
        ttsTemplate: '{user} invocó el poder del trueno con {gift}',
        titleTemplate: '{user}',
        subtitleTemplate: '¡Invocó el Martillo de Thor!',
        duration: 4.5
      }
    ]
  },
  {
    id: 'album_minecraft_vip',
    name: 'Alertas Bosses Minecraft',
    triggers: [
      {
        id: 'trig_mc_1',
        active: true,
        name: 'Cañón Alienígena Sci-Fi',
        triggerType: 'AnyGift',
        giftName: 'Galaxy',
        giftCoins: 100,
        likeThreshold: 500,
        videoUrl: 'http://localhost:4000/s2e_media/videos/public/any/1778416867025_pro-sci-fi-alien-bubble-cannon.webm',
        videoName: 'pro-sci-fi-alien-bubble-cannon.webm',
        chromaEnabled: true,
        chromaMode: 'auto',
        chromaColor: '#00ff00',
        similarity: 38,
        smoothness: 12,
        audioName: 'epic-song-30s.mp3',
        audioUrl: 'http://localhost:4000/s2e_media/audio/public/1709334254471_epic-song-30s.mp3',
        audioVolume: 100,
        playerType: 'priority',
        priority: 10,
        multiplier: false,
        ttsEnabled: true,
        ttsTemplate: '¡Increíble! {user} donó {gift} con {coins} diamantes',
        titleTemplate: '{user}',
        subtitleTemplate: 'Mega Donación: {gift} ({coins} Diamantes)',
        duration: 6
      }
    ]
  }
];

export const DEFAULT_GIFT_MAPPINGS = [
  {
    name: "Quiéreme",
    english_name: "Heart Me",
    tiktok_id: 7934,
    coins: 1,
    icon: "heart-me-1-coins.webp",
    command: "/survival thor {target}",
    description: "Alerta personalizada Quiéreme",
    media_path: "http://localhost:4000/s2e_media/users/6a8a3541466456082538e291/videos/1791064113135_Sin título - 03 de octubre de 2026 a las 16.32.57.mp4",
    video: "http://localhost:4000/s2e_media/users/6a8a3541466456082538e291/videos/1791064113135_Sin título - 03 de octubre de 2026 a las 16.32.57.mp4",
    template: ""
  }
];

class AppController {
  constructor() {
    this.isInitialized = false;
    this.activeProfile = 'minecraft';
    this.soundManager = soundManager;
    this.robloxOverlayConfig = JSON.parse(JSON.stringify(DEFAULT_ROBLOX_CONFIG));
    this.mcOverlayStyle = 'carousel';
    this.mcShowTotems = true;

    this.s2ePresets = JSON.parse(JSON.stringify(S2E_PRESETS_CATALOG));
    this.activeS2EPresetId = this.s2ePresets[0]?.id || '6a9c4ab5a3f80f466f2d6f01';
    this.likeAccumulator = 0;

    this.alertAlbums = JSON.parse(JSON.stringify(DEFAULT_ALERT_ALBUMS));
    this.activeAlertAlbumId = this.alertAlbums[0]?.id || 'album_quiereme';
    this.giftMappings = null;
  }

  getActiveS2EPreset() {
    return this.s2ePresets.find(p => p.id === this.activeS2EPresetId) || this.s2ePresets[0];
  }

  getActiveAlertAlbum() {
    return this.alertAlbums.find(a => a.id === this.activeAlertAlbumId) || this.alertAlbums[0];
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    await this.loadSavedConfig();
    await this.loadGiftMappings();
    this.setupTikTokListeners();
    this.setupStoreOverlaySync();
    await this.syncAllOverlaysToBackend();
    // Modular auto-updater is loaded via ui/src/modules/auto-updater.js
  }

  async loadGiftMappings() {
    try {
      const urls = ['/gift_mappings.json', 'http://localhost:4000/gift_mappings.json', '../gift_mappings.json'];
      for (const u of urls) {
        try {
          const res = await fetch(u);
          if (res.ok) {
            this.giftMappings = await res.json();
            return;
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  resolveGiftMapping(normalizedName, giftId) {
    const rawId = Number(giftId) || 0;
    const cleanNorm = String(normalizedName || '')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const isQuiereme = (
      rawId === 7934 ||
      cleanNorm === 'quiereme' ||
      cleanNorm === 'quiere-me' ||
      cleanNorm === 'love you' ||
      cleanNorm === 'heart me'
    );

    const items = [];
    if (this.giftMappings) {
      if (Array.isArray(this.giftMappings)) {
        items.push(...this.giftMappings);
      } else if (Array.isArray(this.giftMappings.items)) {
        items.push(...this.giftMappings.items);
      } else if (this.giftMappings.tiers && typeof this.giftMappings.tiers === 'object') {
        for (const k of Object.keys(this.giftMappings.tiers)) {
          const t = this.giftMappings.tiers[k];
          if (Array.isArray(t?.items)) items.push(...t.items);
        }
      }
    }

    for (const def of DEFAULT_GIFT_MAPPINGS) {
      if (!items.some(it => (it.tiktok_id && it.tiktok_id === def.tiktok_id) || it.name === def.name)) {
        items.push(def);
      }
    }

    for (const it of items) {
      const itId = Number(it.tiktok_id || it.giftId || it.gift_id || it.id) || 0;
      if (rawId > 0 && itId > 0 && rawId === itId) {
        return it;
      }
      const itNorm = String(it.name || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      const itEnNorm = String(it.english_name || it.englishName || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

      if (cleanNorm && (cleanNorm === itNorm || cleanNorm === itEnNorm)) {
        return it;
      }

      if (isQuiereme) {
        if (itId === 7934 || itNorm === 'quiereme' || itNorm === 'quiere-me' || itEnNorm === 'heart me' || itEnNorm === 'love you') {
          return it;
        }
      }
    }

    if (isQuiereme) {
      return DEFAULT_GIFT_MAPPINGS[0];
    }

    return null;
  }

  async emitCustomAlertPayload(payload) {
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      try {
        await invoke('emit_custom_alert', { alert_json: JSON.stringify(payload) });
        return;
      } catch (err) {
        console.warn('[Alerts] Fallback invoke -> HTTP:', err);
      }
    }
    try {
      await fetch('http://localhost:4000/api/alerta/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('[Alerts] Error enviando alerta HTTP:', e);
    }
  }

  setupStoreOverlaySync() {
    store.on('totems:change', () => this.syncMcOverlayToBackend());
    store.on('faction:change', () => this.syncMcOverlayToBackend());
  }

  async syncAllOverlaysToBackend() {
    await this.syncRobloxOverlayToBackend();
    await this.syncMcOverlayToBackend();
  }

  async syncRobloxOverlayToBackend() {
    try {
      const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
      if (invoke) {
        await invoke('update_roblox_overlay_config', {
          config_json: JSON.stringify(this.robloxOverlayConfig)
        });
      }
    } catch (err) {
      console.warn('Error sincronizando Roblox Overlay:', err);
    }
  }

  async syncMcOverlayToBackend() {
    try {
      const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
      if (!invoke) return;
      const st = store.getState();
      const gifts = giftRegistry.getAll();
      const items = gifts.map((g, idx) => {
        const cleanIcon = limpiarArchivoGift(g.icon_file || archivoDeGift(g.name, g.coins));
        const resolvedIcon = (cleanIcon === 'rose-1-coins.webp' && !/rose|rosa/i.test(String(g.name || '')))
          ? archivoDeGift(g.name, g.coins)
          : cleanIcon;
        const mappedSound = g.audioName || this.soundManager.getSoundForGift(g.name) || '';
        const resolvedSoundObj = this.soundManager.resolveSound(g.audioUrl || mappedSound);
        return {
          id: g.id || String(idx + 1),
          gift_name: g.name || 'Regalo',
          icon_file: resolvedIcon,
          action_image: g.action_image || '',
          repetition: Number(g.repetition) || 1,
          coins: Number(g.coins) || 1,
          action_label: g.overlayLabel || this.formatMcCommandLabel(g.command, g.name),
          faction: g.faction || 'BUENOS',
          command: g.command || '',
          sound_name: mappedSound,
          sound_url: g.audioUrl || resolvedSoundObj?.url || ''
        };
      });

      const payload = {
        style: this.mcOverlayStyle,
        theme_style: this.robloxOverlayConfig.theme_style || 'GALACTIC',
        showTotems: this.mcShowTotems,
        totems: st.totems,
        maxTotems: st.maxTotems,
        faction: st.activeFaction,
        items
      };
      await invoke('update_mc_overlay_config', {
        config_json: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Error sincronizando MC Overlay:', err);
    }
  }

  formatMcCommandLabel(cmd = '', fallback = 'Acción') {
    const c = String(cmd).toLowerCase();
    if (c.includes('zombie')) return 'Zombie';
    if (c.includes('creeper')) return 'Creeper';
    if (c.includes('tnt')) return 'Lluvia TNT';
    if (c.includes('warden')) return 'Warden Boss';
    if (c.includes('lightning')) return 'Rayo Divino';
    if (c.includes('diamond')) return 'Diamantes';
    if (c.includes('la_parka')) return 'La Parka';
    if (c.includes('sol_cruel')) return 'Sol Cruel';
    if (c.includes('arcangel')) return 'Arcángel';
    if (c.includes('deidad_solar')) return 'Deidad Solar';
    if (c.includes('fenix')) return 'Fénix';
    return fallback.length > 16 ? fallback.slice(0, 16) : fallback;
  }

  async loadSavedConfig() {
    try {
      const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
      if (invoke) {
        const configStr = await invoke('load_config');
        if (configStr && configStr.trim() && configStr !== '{}') {
          const config = JSON.parse(configStr);

          if (config.activeProfile) this.activeProfile = config.activeProfile;
          if (config.rcon) store.setRconConfig(config.rcon);
          if (config.streamerUsername) store.setTikTokStatus('DESCONECTADO', config.streamerUsername);
          if (config.activeFaction) store.setFaction(config.activeFaction);
          if (config.totems !== undefined) store.setTotems(config.totems);
          if (config.giftSoundMap) {
            this.soundManager.setGiftSoundMap(config.giftSoundMap);
          }
          if (config.currentPreset && PRESETS[config.currentPreset]) {
            giftRegistry.loadPreset(config.currentPreset);
          }
          if (Array.isArray(config.gifts) && config.gifts.length > 0) {
            const repairedGifts = config.gifts.map(g => {
              const rawIcon = limpiarArchivoGift(g.icon_file);
              const isNonRose = !/rose|rosa/i.test(String(g.name || ''));
              const finalIcon = (!g.icon_file || (rawIcon === 'rose-1-coins.webp' && isNonRose))
                ? archivoDeGift(g.name, g.coins)
                : rawIcon;
              return { ...g, icon_file: finalIcon };
            });
            giftRegistry.setAll(repairedGifts);
          }
          if (config.robloxOverlayConfig) {
            const useCurrentRules = Number(config.robloxOverlayConfig.rules_schema_version) === 3;
            const repairSlot = (s) => {
              const rawIcon = limpiarArchivoGift(s.icon_file);
              const isNonRose = !/rose|rosa/i.test(String(s.gift_name || ''));
              const finalIcon = (!s.icon_file || (rawIcon === 'rose-1-coins.webp' && isNonRose))
                ? archivoDeGift(s.gift_name, s.coins)
                : rawIcon;
              return {
                ...s,
                icon_file: finalIcon,
                sound_name: s.sound_name || '',
                sound_url: s.sound_url || '',
                sound_volume: s.sound_volume ?? 1.0,
                duration_seconds: Math.max(0, Number(s.duration_seconds ?? 5))
              };
            };
            const merged = {
              ...DEFAULT_ROBLOX_CONFIG,
              ...config.robloxOverlayConfig,
              left_rules: useCurrentRules && Array.isArray(config.robloxOverlayConfig.left_rules)
                ? config.robloxOverlayConfig.left_rules.map(repairSlot)
                : DEFAULT_ROBLOX_CONFIG.left_rules,
              right_rules: useCurrentRules && Array.isArray(config.robloxOverlayConfig.right_rules)
                ? config.robloxOverlayConfig.right_rules.map(repairSlot)
                : DEFAULT_ROBLOX_CONFIG.right_rules
            };
            merged.center_red_icon = limpiarArchivoGift(merged.center_red_icon || archivoDeGift(merged.center_red_name, merged.center_red_coins));
            merged.center_blue_icon = limpiarArchivoGift(merged.center_blue_icon || archivoDeGift(merged.center_blue_name, merged.center_blue_coins));
            merged.center_red_sound_name = merged.center_red_sound_name || '';
            merged.center_red_sound_url = merged.center_red_sound_url || '';
            merged.center_blue_sound_name = merged.center_blue_sound_name || '';
            merged.center_blue_sound_url = merged.center_blue_sound_url || '';
            this.robloxOverlayConfig = merged;
          }
          if (config.mcOverlayStyle) this.mcOverlayStyle = config.mcOverlayStyle;
          if (config.mcShowTotems !== undefined) this.mcShowTotems = config.mcShowTotems;
          if (Array.isArray(config.s2ePresets) && config.s2ePresets.length > 0) {
            this.s2ePresets = config.s2ePresets;
          }
          if (config.activeS2EPresetId) {
            this.activeS2EPresetId = config.activeS2EPresetId;
          }
          if (config.alertAlbums && config.alertAlbums.length > 0) {
            this.alertAlbums = config.alertAlbums;
          }
          if (config.activeAlertAlbumId) {
            this.activeAlertAlbumId = config.activeAlertAlbumId;
          }
          if (config.ttsConfig) {
            ttsEngine.updateConfig(config.ttsConfig);
          }
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar la configuración previa:', err);
    }
  }

  async persistConfig() {
    try {
      const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
      const state = store.getState();
      const payload = {
        activeProfile: this.activeProfile,
        rcon: state.rconConfig,
        streamerUsername: state.tikTokUsername,
        activeFaction: state.activeFaction,
        totems: state.totems,
        currentPreset: giftRegistry.currentPreset,
        gifts: giftRegistry.getAll(),
        giftSoundMap: this.soundManager.getGiftSoundMap(),
        robloxOverlayConfig: this.robloxOverlayConfig,
        mcOverlayStyle: this.mcOverlayStyle,
        mcShowTotems: this.mcShowTotems,
        s2ePresets: this.s2ePresets,
        activeS2EPresetId: this.activeS2EPresetId,
        alertAlbums: this.alertAlbums,
        activeAlertAlbumId: this.activeAlertAlbumId,
        ttsConfig: ttsEngine.config
      };

      if (invoke) {
        await invoke('save_config', { config_json: JSON.stringify(payload, null, 2) });
      }
      await this.syncAllOverlaysToBackend();
      return true;
    } catch (err) {
      console.error('Error al guardar config.json:', err);
      return false;
    }
  }

  setupTikTokListeners() {
    tikTokBridge.on('connecting', ({ username }) => {
      store.setTikTokStatus('CONECTANDO', username);
    });

    tikTokBridge.on('connected', ({ username }) => {
      store.setTikTokStatus('CONECTADO', username);
    });

    tikTokBridge.on('offline', ({ username, reason }) => {
      store.setTikTokStatus('OFFLINE', username);
    });

    tikTokBridge.on('disconnected', () => {
      store.setTikTokStatus('DESCONECTADO');
    });

    tikTokBridge.on('reconnecting', () => {
      store.setTikTokStatus('CONECTANDO');
    });

    tikTokBridge.on('chat', chatEvent => {
      const user = chatEvent.nickname || chatEvent.uniqueId || 'Viewer';
      const comment = String(chatEvent.comment || '').trim();

      commandDispatcher.dispatchChat(user, comment, chatEvent);
      ttsEngine.speakChat(user, comment, chatEvent);
      this.evaluateAlertTriggers('Comment', { user, comment });
    });

    tikTokBridge.on('gift', giftEvent => {
      this.handleGiftEvent(giftEvent);
    });

    tikTokBridge.on('like', likeEvent => {
      const count = Number(likeEvent.likeCount) || 1;
      const user = likeEvent.nickname || likeEvent.uniqueId || 'Viewer';
      store.incrementStats({ likes: count });
      overlayServer.emitLike(user, count);
      permissionManager.addPoints(user, Math.max(1, Math.round(count / 5)));
      this.handleLikePresetEvents(user, count);
      this.evaluateAlertTriggers('Like', { user, count });
    });

    tikTokBridge.on('follow', followEvent => {
      const user = followEvent.nickname || followEvent.uniqueId || 'Usuario';
      store.incrementStats({ followers: 1 });
      store.addHistory({
        type: 'follow',
        title: 'Nuevo Seguidor',
        user,
        detail: 'Comenzó a seguir el directo'
      });
      this.handleFollowPresetEvents(user);
      this.evaluateAlertTriggers('Follow', { user });
    });

    tikTokBridge.on('subscribe', subEvent => {
      const user = subEvent.nickname || subEvent.uniqueId || 'Usuario';
      store.addHistory({
        type: 'subscribe',
        title: 'Nueva Suscripción',
        user,
        detail: '¡Se ha suscrito al canal!'
      });
      soundManager.playSound('victoria_epica');
      this.evaluateAlertTriggers('Subscribe', { user });
    });

    tikTokBridge.on('share', shareEvent => {
      const user = shareEvent.nickname || shareEvent.uniqueId || 'Usuario';
      store.addHistory({
        type: 'share',
        title: 'Compartido',
        user,
        detail: 'Compartió la transmisión'
      });
      this.evaluateAlertTriggers('Share', { user });
    });
  }

  async executeS2EPresetEvent(ev, donor = 'GZ7_Viewer', repeatCount = 1) {
    if (!ev) return;
    const preset = this.getActiveS2EPreset();
    const delaySec = preset && preset.playDelay && preset.playDelay !== 'Off' ? ( parseFloat(preset.playDelay) || 0 ) : 0;

    const runAction = async () => {
      if (ev.audio && ev.audio.url) {
        soundManager.playUrl(ev.audio.url, {
          volume: ev.audio.volume ?? 100,
          playerType: ev.audio.playerType || 'priority',
          priority: ev.audio.priority ?? 5,
          multiplier: Boolean(ev.audio.multiplier),
          repeatCount
        });
      }

      const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
      if (invoke) {
        await invoke('emit_custom_alert', {
          alert_json: JSON.stringify({
            title: `@${donor}`,
            subtitle: `${ev.func?.repetition > 1 ? 'x' + ev.func.repetition + ' ' : ''}${ev.func?.name || 'Acción'} (${ev.trigger?.giftName || 'Evento'})`,
            imageUrl: ev.func?.imageUrl || '',
            duration: 3.5
          })
        });
      }

      if (this.activeProfile === 'minecraft' && Array.isArray(ev.func?.commands) && ev.func.commands.length > 0) {
        const cleanDonor = String(donor).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 16) || 'Viewer';
        const player = document.getElementById('mc-server-op')?.value?.trim() || 'GZ7';
        const reps = Math.min(25, Math.max(1, (Number(ev.func.repetition) || 1) * repeatCount));
        for (let r = 0; r < reps; r++) {
          for (const rawCmd of ev.func.commands) {
            const cmd = String(rawCmd)
              .replace(/^\/+/, '')
              .replace(/\{nickname\}/gi, cleanDonor)
              .replace(/\{donador\}/gi, cleanDonor)
              .replace(/\{playername\}/gi, player);
            try {
              await rconBridge.sendCommand(cmd);
            } catch (err) {}
          }
        }
      }
    };

    if (delaySec > 0) {
      setTimeout(runAction, delaySec * 1000);
    } else {
      await runAction();
    }
  }

  handleLikePresetEvents(user, count) {
    if (this.activeProfile !== 'minecraft') return;
    this.likeAccumulator += count;

    // Meta de 5,000 taps / likes para balancear el juego
    if (this.totalStreamLikes === undefined) this.totalStreamLikes = 0;
    const oldMilestone = Math.floor(this.totalStreamLikes / 5000);
    this.totalStreamLikes += count;
    const newMilestone = Math.floor(this.totalStreamLikes / 5000);
    if (newMilestone > oldMilestone) {
      const targetPlayer = (store.getState()?.streamerUsername || 'GZ7').replace(/[^a-zA-Z0-9_]/g, '_') || 'GZ7';
      const rewardCmd = Math.random() > 0.5 ? `survival totem ${targetPlayer}` : `survival apple_enchanted ${targetPlayer}`;
      rconBridge.sendCommand(rewardCmd).catch(() => {});
      store.addHistory({
        type: 'like_milestone',
        title: 'Meta 5,000 Likes',
        user: user || 'Comunidad',
        coins: 0,
        command: rewardCmd,
        detail: `Recompensa de Ayuda: /${rewardCmd}`
      });
    }

    const preset = this.getActiveS2EPreset();
    if (!preset || !preset.active) return;
    for (const ev of (preset.events || [])) {
      if (ev.active === false) continue;
      if (ev.trigger?.action === 'LikeForEach' || ev.trigger?.action === 'Like') {
        const threshold = Math.max(10, Number(ev.trigger.value) || 100);
        if (this.likeAccumulator >= threshold) {
          this.likeAccumulator %= threshold;
          this.executeS2EPresetEvent(ev, user, 1);
        }
      }
    }
  }

  handleFollowPresetEvents(user) {
    if (this.activeProfile !== 'minecraft') return;
    const preset = this.getActiveS2EPreset();
    if (!preset || !preset.active) return;
    for (const ev of (preset.events || [])) {
      if (ev.active === false) continue;
      if (ev.trigger?.action === 'Follow') {
        this.executeS2EPresetEvent(ev, user, 1);
      }
    }
  }

  async fireAlertTrigger(trig, ctx = {}) {
    if (!trig) return;
    const hasVisualMedia = Boolean(trig.videoUrl || trig.imageUrl || trig.isModeratorCommand);
    const user = ctx.user || 'GZ7_Viewer';
    const gift = ctx.gift || trig.giftName || 'Rose';
    const coins = ctx.coins || trig.giftCoins || 1;
    const count = ctx.count || 1;

    const replaceVars = (tpl = '') => String(tpl)
      .replace(/\{user\}/gi, user)
      .replace(/\{usuario\}/gi, user)
      .replace(/\{nickname\}/gi, user)
      .replace(/\{gift\}/gi, gift)
      .replace(/\{regalo\}/gi, gift)
      .replace(/\{coins\}/gi, String(coins))
      .replace(/\{count\}/gi, String(count))
      .replace(/\{cantidad\}/gi, String(count));

    const titleText = replaceVars(trig.titleTemplate || '{user}');
    const subText = replaceVars(trig.subtitleTemplate || 'Envió {gift} ({coins} Diamantes)');
    const ttsMsg = replaceVars(trig.ttsTemplate || '{user} envió {gift}');

    if (trig.audioUrl) {
      soundManager.playUrl(trig.audioUrl, {
        volume: trig.audioVolume ?? 100,
        playerType: trig.playerType || 'priority',
        priority: trig.priority ?? 5,
        multiplier: Boolean(trig.multiplier),
        repeatCount: count
      });
    }

    if (trig.ttsEnabled && ttsMsg.trim()) {
      ttsEngine.speak(ttsMsg);
    }

    // Filtro estricto: Solo emitir overlay visual si tiene video, imagen o comando moderador
    if (!hasVisualMedia) return;

    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      await invoke('emit_custom_alert', {
        alert_json: JSON.stringify({
          title: titleText,
          subtitle: subText,
          videoUrl: trig.videoUrl || '',
          imageUrl: trig.imageUrl || '',
          chromaEnabled: trig.chromaEnabled !== false,
          chromaMode: trig.chromaMode || 'auto',
          chromaColor: trig.chromaColor || '#00ff00',
          similarity: Number(trig.similarity) || 38,
          smoothness: Number(trig.smoothness) || 12,
          audioUrl: trig.audioUrl || '',
          audioVolume: Number(trig.audioVolume ?? 100),
          duration: Number(trig.duration) || 4.5
        })
      });
    }
  }

  evaluateAlertTriggers(eventType, ctx = {}) {
    // FILTRO ESTRICTO: Cero likes, follows, shares o comentarios en alertas visuales
    if (eventType === 'Like' || eventType === 'Follow' || eventType === 'Share' || eventType === 'Comment') {
      return;
    }
    const album = this.getActiveAlertAlbum();
    if (!album || !Array.isArray(album.triggers)) return;
    for (const trig of album.triggers) {
      if (trig.active === false) continue;
      // Descartar triggers sin media visual
      if (!trig.videoUrl && !trig.imageUrl && !trig.isModeratorCommand) continue;
      if (eventType === 'Gift') {
        if (trig.triggerType === 'AnyGift') {
          this.fireAlertTrigger(trig, ctx);
        } else if (trig.triggerType === 'SelectedGift') {
          if (giftsEquivalentes(trig.giftName, ctx.gift, ctx.giftId, trig.giftId)) {
            this.fireAlertTrigger(trig, ctx);
          }
        }
      } else if (eventType === trig.triggerType) {
        this.fireAlertTrigger(trig, ctx);
      }
    }
  }

  async handleGiftEvent(data) {
    const donor = data.nickname || data.uniqueId || 'Donador';
    const rawGiftId = Number(data.giftId) || 0;

    // Normalizar el nombre del regalo entrante antes de buscar en gift_mappings.json:
    // Eliminar tildes, caracteres especiales y convertir a minúsculas
    const rawGiftName = String(data.giftName || data.name || '').trim();
    const normalizedGiftName = rawGiftName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Permitir coincidencia tanto por giftId numérico como por nombre normalizado (quiereme, quiere-me, love you)
    const mappedGift = this.resolveGiftMapping(normalizedGiftName, rawGiftId);
    let handledMappedAlert = false;
    if (mappedGift && (mappedGift.media_path || mappedGift.video || mappedGift.videoUrl)) {
      handledMappedAlert = true;
      const payload = {
        type: "CUSTOM_ALERT",
        video: mappedGift.media_path || mappedGift.video || mappedGift.videoUrl,
        template: mappedGift.template || "" // Cadena vacía por defecto
      };
      await this.emitCustomAlertPayload(payload);
    }

    const canonGroup = encontrarGrupoCanonicoGift(data.giftName, rawGiftId);
    const giftName = (data.giftName && !/^gift#\d+$/i.test(String(data.giftName).trim()))
      ? String(data.giftName).trim()
      : (canonGroup ? (canonGroup.key === 'rose' ? 'Rose' : canonGroup.key === 'gg' ? 'GG' : canonGroup.names[0]) : (mappedGift?.name || 'Regalo'));
    const coins = Number(data.diamondCount) || (mappedGift?.coins || (canonGroup ? canonGroup.defaultCoins : 1));
    const repeatCount = Math.max(1, Number(data.repeatCount) || 1);
    const activeFaction = store.getState().activeFaction;
    const isSim = Boolean(data.isLocalSimulation);

    permissionManager.addPoints(donor, coins * repeatCount * 10);

    const giftEconomicValue = Math.max(Number(data.diamondCount) || 0, coins * repeatCount);
    permissionManager.evaluateSessionMVP(donor, giftName, giftEconomicValue);

    // Despacho de audio / puntos del duelo de inmediato
    const robloxSoundPlayed = await this.handleRobloxGiftVsGift(giftName, coins, repeatCount, donor, rawGiftId, isSim);

    let matchedS2E = false;
    if (this.activeProfile === 'minecraft') {
      const activePreset = window.gz7S2EStudio?.getActivePreset
        ? window.gz7S2EStudio.getActivePreset()
        : this.getActiveS2EPreset();
      if (activePreset && activePreset.active && Array.isArray(activePreset.events)) {
        for (const ev of activePreset.events) {
          if (ev.active === false) continue;
          if (ev.trigger?.action === 'SelectedGift') {
            if (giftsEquivalentes(ev.trigger.giftName, giftName, rawGiftId, ev.trigger.giftId)) {
              matchedS2E = true;
              await this.executeS2EPresetEvent(ev, donor, repeatCount);
            }
          }
        }
      }
    }

    if (!handledMappedAlert) {
      this.evaluateAlertTriggers('Gift', { user: donor, gift: giftName, giftId: rawGiftId, coins, count: repeatCount });
    }

    const resolution = giftRegistry.applyGift(
      rawGiftId || giftName,
      donor,
      activeFaction,
      store.getState(),
      giftName
    );

    const effectiveDelta = resolution.totemDelta * repeatCount;
    if (effectiveDelta !== 0) {
      store.modifyTotems(effectiveDelta);
    }

    store.emit('duel:push', {
      side: resolution.side,
      power: (resolution.power || 1) * repeatCount,
      donor,
      giftName: giftName || resolution.giftName
    });

    store.incrementStats({
      gifts: repeatCount,
      coins: coins * repeatCount
    });

    if (!matchedS2E && !robloxSoundPlayed) {
      if (resolution.rawGift?.audioUrl) {
        soundManager.playUrl(resolution.rawGift.audioUrl, {
          volume: resolution.rawGift.audioVolume ?? 100,
          repeatCount
        });
      } else if (resolution.rawGift?.audioName) {
        const found = soundManager.resolveSound(resolution.rawGift.audioName);
        if (found && found.url) {
          soundManager.playUrl(found.url, {
            volume: resolution.rawGift.audioVolume ?? 100,
            repeatCount
          });
        } else {
          soundManager.playSound(resolution.rawGift.audioName, resolution.rawGift.audioVolume ?? 100);
        }
      } else {
        soundManager.playForGift(giftName, coins, resolution.faction || activeFaction);
      }
    }
    ttsEngine.speakGift(donor, giftName, coins * repeatCount);

    let commandResult = '';
    if (this.activeProfile === 'minecraft' && !matchedS2E && resolution.shouldFire && resolution.command) {
      if (!resolution.command.startsWith('ROBLOX_EVENT:')) {
        try {
          commandResult = await rconBridge.sendCommand(resolution.command);
        } catch (err) {
          commandResult = `Error: ${err.message}`;
        }
      }
    } else if (this.activeProfile === 'roblox') {
      commandResult = `[ROBLOX OVERLAY] Procesado (${giftName} x${repeatCount})`;
    }

    store.addHistory({
      type: 'gift',
      title: `${giftName} (x${repeatCount})`,
      user: donor,
      coins: coins * repeatCount,
      faction: resolution.faction,
      totemDelta: effectiveDelta,
      command: resolution.command,
      commandResult,
      detail: `${coins * repeatCount} Diamantes • ${this.activeProfile.toUpperCase()}`
    });
  }

  handleRobloxGiftVsGift(...args) {
    return handleRobloxGiftVsGift.apply(this, args);
  }

  async triggerSimulation(giftId, donorName = 'GZ7_Tester', repeatCount = 1) {
    let gift = giftRegistry.getAll().find(g => g.id === giftId || g.tiktokGiftId == giftId);
    if (!gift && typeof giftId === 'string') {
      const normInput = giftId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      gift = giftRegistry.getAll().find(g => {
        const normG = String(g.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normG === normInput || (normInput === 'quiereme' && (normG === 'heart me' || g.tiktokGiftId === 7934));
      });
    }

    const mapped = this.resolveGiftMapping(typeof giftId === 'string' ? giftId : '', typeof giftId === 'number' ? giftId : 0);

    const finalGiftName = gift?.name || (typeof giftId === 'string' ? giftId : (mapped?.name || 'Quiéreme'));
    const finalGiftId = gift?.tiktokGiftId || (typeof giftId === 'number' ? giftId : (mapped?.tiktok_id || 7934));
    const finalCoins = gift?.coins || (mapped?.coins || 1);

    await this.handleGiftEvent({
      giftId: finalGiftId,
      giftName: finalGiftName,
      diamondCount: finalCoins,
      repeatCount: Number(repeatCount) || 1,
      uniqueId: donorName,
      nickname: donorName,
      isLocalSimulation: true
    });
  }
}

export class AutoUpdaterClient {
  constructor() {
    this.updateInfo = null;
    this.isUpdating = false;
  }

  getInvoke() {
    return window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke || null;
  }

  async init() {
    const invoke = this.getInvoke();
    if (!invoke) return;

    const listen = window.__TAURI__?.event?.listen;
    if (listen) {
      try {
        await listen('update-progress', (event) => {
          this.updateProgressBar(event.payload);
        });
      } catch (e) {
        console.warn('Error registrando listener de update-progress:', e);
      }
    }

    setTimeout(() => this.checkForUpdates(false), 3500);
  }

  async checkForUpdates(manual = false) {
    const invoke = this.getInvoke();
    if (!invoke || this.isUpdating) return;

    try {
      const res = await invoke('check_for_updates');
      if (res && res.available) {
        this.updateInfo = res;
        this.showUpdateBanner(res);
      } else if (manual) {
        this.showToast('GALACTK PANEL está actualizado (v' + (res?.current_version || '2.0.0') + ')');
      }
    } catch (err) {
      console.warn('Error verificando actualización:', err);
      if (manual) {
        this.showToast('Error al verificar: ' + err);
      }
    }
  }

  showUpdateBanner(info) {
    let banner = document.getElementById('gz7-updater-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'gz7-updater-banner';
      banner.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99995;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.98) 100%);
        border: 1px solid rgba(56, 189, 248, 0.45);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(56, 189, 248, 0.25);
        border-radius: 16px;
        padding: 16px 20px;
        color: #f8fafc;
        max-width: 380px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 10px;
        backdrop-filter: blur(16px);
      `;
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span style="font-weight:800;font-size:13px;color:#38bdf8;">Nueva versión ${info.version}</span>
        </div>
        <button id="btn-close-updater-banner" type="button" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:18px;line-height:1;padding:0;">&times;</button>
      </div>
      <div style="font-size:11.5px;color:#cbd5e1;line-height:1.4;">
        ${info.body ? info.body.slice(0, 140) : 'Hay una nueva actualización disponible con optimizaciones y parches para GALACTK PANEL.'}
      </div>
      <div id="gz7-updater-progress-container" style="display:none;flex-direction:column;gap:6px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;">
          <span id="gz7-updater-progress-status">Descargando...</span>
          <span id="gz7-updater-progress-pct">0%</span>
        </div>
        <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
          <div id="gz7-updater-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#0284c7,#38bdf8);transition:width 0.2s;"></div>
        </div>
      </div>
      <div id="gz7-updater-actions" style="display:flex;gap:8px;margin-top:2px;">
        <button id="btn-start-update" type="button" style="flex:1;background:linear-gradient(135deg,#0284c7,#38bdf8);border:none;color:#fff;font-weight:700;font-size:12px;padding:8px 14px;border-radius:8px;cursor:pointer;box-shadow:0 2px 10px rgba(2,132,199,0.35);">
          Actualizar ahora
        </button>
      </div>
    `;

    banner.style.display = 'flex';

    document.getElementById('btn-close-updater-banner').onclick = () => {
      banner.style.display = 'none';
    };

    document.getElementById('btn-start-update').onclick = () => {
      this.startInstall();
    };
  }

  async startInstall() {
    this.isUpdating = true;
    const actions = document.getElementById('gz7-updater-actions');
    if (actions) actions.style.display = 'none';
    const prog = document.getElementById('gz7-updater-progress-container');
    if (prog) prog.style.display = 'flex';

    const invoke = this.getInvoke();
    try {
      await invoke('install_update_with_progress');
    } catch (err) {
      console.error('Error instalando actualización:', err);
      const statusEl = document.getElementById('gz7-updater-progress-status');
      if (statusEl) {
        statusEl.textContent = 'Error: ' + err;
        statusEl.style.color = '#fb7185';
      }
      if (actions) actions.style.display = 'flex';
      this.isUpdating = false;
    }
  }

  updateProgressBar(payload) {
    const prog = document.getElementById('gz7-updater-progress-container');
    if (prog) prog.style.display = 'flex';
    const bar = document.getElementById('gz7-updater-progress-bar');
    const pct = document.getElementById('gz7-updater-progress-pct');
    const status = document.getElementById('gz7-updater-progress-status');

    const pctNum = Math.round(payload.percentage || 0);
    if (bar) bar.style.width = pctNum + '%';
    if (pct) pct.textContent = pctNum + '%';

    if (status) {
      if (payload.status === 'installing') {
        status.textContent = 'Instalando parche...';
      } else if (payload.status === 'ready') {
        status.textContent = '¡Listo! Reiniciando app...';
      } else {
        const mb = (payload.downloaded_bytes / (1024 * 1024)).toFixed(1);
        status.textContent = `Descargando... (${mb} MB)`;
      }
    }
  }

  showToast(msg) {
    let toast = document.getElementById('gz7-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gz7-toast';
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:rgba(15,23,42,0.92);border:1px solid rgba(56,189,248,0.3);color:#f8fafc;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.5);backdrop-filter:blur(10px);pointer-events:none;transition:opacity 0.3s;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  }
}

export const autoUpdater = new AutoUpdaterClient();
export const app = new AppController();
if (typeof window !== 'undefined') {
  window.gz7App = app;
  window.gz7AutoUpdater = autoUpdater;
}
