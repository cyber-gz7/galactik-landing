import { create } from 'zustand';
import type {
  MinecraftRule,
  MinecraftRconConfig,
  MinecraftOverlaySettings
} from '../types';
import { invokeTyped } from '@/api/tauri-bridge';

export const OFFICIAL_MINECRAFT_RULES: MinecraftRule[] = [
  { id: 'mc_1', type: 'gift', name: 'Rosa', icon_file: 'rose-1-coins.webp', coins: 1, action_label: '⚡ Rayo Trueno', command: 'trueno {jugador} {donador} rayos=8 potencia=8', totemDelta: 0, enabled: true, tiktokGiftId: '5655' },
  { id: 'mc_2', type: 'gift', name: 'GG', icon_file: 'gg-1-coins.webp', coins: 1, action_label: '🧨 TNT Box 100%', command: 'survival tntbox {jugador}', totemDelta: 0, enabled: true, tiktokGiftId: '6064' },
  { id: 'mc_3', type: 'gift', name: 'Maracas', icon_file: 'maracas-1-coins.webp', coins: 1, action_label: '🛡️ +1 Tótem Stack', mult: '+1', command: 'totems dar {jugador} {cantidad}', totemDelta: 1, enabled: true, tiktokGiftId: '8892' },
  { id: 'mc_4', type: 'gift', name: 'Ice Cream Cone', icon_file: 'ice-cream-cone-1-coins.webp', coins: 1, action_label: '🛡️ Kit Cuero Niv 10', mult: 'KIT', command: 'survival kit cuero {jugador}', totemDelta: 1, enabled: true, tiktokGiftId: '5827' },
  { id: 'mc_5', type: 'gift', name: 'Heart Me', icon_file: 'heart-me-1-coins.webp', coins: 1, action_label: '💀 Esqueleto Hostil', mult: 'x1', command: 'survival skeleton {jugador}', totemDelta: -1, enabled: true, tiktokGiftId: '7934' },
  { id: 'mc_6', type: 'gift', name: 'Cute Cat', icon_file: 'cute-cat-5-coins.webp', coins: 5, action_label: '🛡️ Escudo Energía', mult: 'ESCUDO', command: 'escudo {jugador} {donador}', totemDelta: 5, enabled: true, tiktokGiftId: '5333' },
  { id: 'mc_7', type: 'gift', name: 'Finger Heart', icon_file: 'finger-heart-5-coins.webp', coins: 5, action_label: '⚡ Super Rayo (DPS)', mult: 'RAYO', command: 'superrayo {jugador} {donador} dano=18 potencia=8', totemDelta: -2, enabled: true, tiktokGiftId: '5487' },
  { id: 'mc_8', type: 'gift', name: 'Fireball', icon_file: 'fireball-5-coins.webp', coins: 5, action_label: '⚔️ Corona Espadas', mult: 'x1', command: 'corona {jugador} {donador}', totemDelta: -3, enabled: true, tiktokGiftId: '5650' },
  { id: 'mc_9', type: 'gift', name: 'Doughnut', icon_file: 'doughnut-30-coins.webp', coins: 30, action_label: '🎠 Carrusel Mágico', mult: 'x1', command: 'carrusel {jugador} {donador}', totemDelta: -10, enabled: true, tiktokGiftId: '5879' },
  { id: 'mc_10', type: 'gift', name: 'Capybara', icon_file: 'capybara-30-coins.webp', coins: 30, action_label: '🛡️ +10 Tótems Stack', mult: '+10', command: 'totems dar {jugador} 10', totemDelta: 10, enabled: true, tiktokGiftId: '6562' },
  { id: 'mc_11', type: 'gift', name: 'Paper Crane', icon_file: 'paper-crane-99-coins.webp', coins: 99, action_label: '🛡️ Kit Netherite Niv 10', mult: 'GOD', command: 'survival kit netherite {jugador}', totemDelta: 20, enabled: true, tiktokGiftId: '5659' },
  { id: 'mc_12', type: 'gift', name: 'Sun Crown', icon_file: 'sun-crown-199-coins.webp', coins: 199, action_label: '☀️ Sol Cruel (DPS 10)', mult: 'SOL', command: 'solcruel {jugador} {donador} dps=10 duracion=20', totemDelta: -30, enabled: true, tiktokGiftId: '6800' },
  { id: 'mc_13', type: 'gift', name: 'Money Gun', icon_file: 'money-gun-500-coins.webp', coins: 500, action_label: '✧ Arcángel Metatrón', mult: 'BOSS', command: 'arcangel {jugador} {donador}', totemDelta: -60, enabled: true, tiktokGiftId: '7168' },
  { id: 'mc_14', type: 'gift', name: 'Galaxy', icon_file: 'galaxy-1000-coins.webp', coins: 1000, action_label: '🐉 6 Dragones (DPS 10)', mult: 'DRAGON', command: 'dragon {jugador} {donador} dragones=6 dps=10.0 duracion=25', totemDelta: -100, enabled: true, tiktokGiftId: '5994' },
  { id: 'mc_follow', type: 'follow', name: 'Nuevo Seguidor', icon_file: 'rose-1-coins.webp', action_label: '🍎 Manzana Dorada', command: 'give {jugador} golden_apple 1', enabled: true },
  { id: 'mc_likes', type: 'likes_total', name: 'Meta de Likes', icon_file: 'heart-me-1-coins.webp', action_label: '🎉 Lluvia de Diamantes', threshold: 5000, command: 'give {jugador} diamond 3', enabled: true }
];

export interface RconLogEntry {
  id: string;
  time: string;
  command: string;
  response: string;
  isError: boolean;
}

interface MinecraftStudioState {
  rules: MinecraftRule[];
  rconConfig: MinecraftRconConfig;
  overlaySettings: MinecraftOverlaySettings;
  consoleLogs: RconLogEntry[];
  isSendingCommand: boolean;
  isSaving: boolean;

  setPlayer: (player: string) => void;
  setRconConfig: (patch: Partial<MinecraftRconConfig>) => void;
  setOverlaySettings: (patch: Partial<MinecraftOverlaySettings>) => void;

  updateRule: (ruleId: string, patch: Partial<MinecraftRule>) => void;
  deleteRule: (ruleId: string) => void;
  addRule: (rule: MinecraftRule) => void;

  sendRconCommand: (rawCmd: string, donor?: string) => Promise<string>;
  clearConsoleLogs: () => void;
  toggleNightVision: (enabled: boolean) => Promise<void>;
  syncToBackend: (immediate?: boolean) => Promise<void>;
}

let mcSyncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useMinecraftStudioStore = create<MinecraftStudioState>((set, get) => ({
  rules: OFFICIAL_MINECRAFT_RULES,
  rconConfig: {
    host: '127.0.0.1',
    port: 25575,
    password: 'minecraft_stream',
    player: 'CJ7_TUTORIALES',
    status: 'CONNECTED',
    lastLog: 'RCON Bridge Online (Localhost:25575)'
  },
  overlaySettings: {
    style: 'carousel',
    scale: 100,
    speed: 25,
    fontSize: 13,
    opacity: 90,
    nightVision: true
  },
  consoleLogs: [
    {
      id: 'init_1',
      time: new Date().toLocaleTimeString(),
      command: '/list',
      response: 'Conectado a PaperMC 1.20.1 (0/20 jugadores)',
      isError: false
    }
  ],
  isSendingCommand: false,
  isSaving: false,

  setPlayer: (player) => {
    set((s) => ({
      rconConfig: { ...s.rconConfig, player }
    }));
    get().syncToBackend(false);
  },

  setRconConfig: (patch) => {
    set((s) => ({
      rconConfig: { ...s.rconConfig, ...patch }
    }));
  },

  setOverlaySettings: (patch) => {
    set((s) => ({
      overlaySettings: { ...s.overlaySettings, ...patch }
    }));
    get().syncToBackend(false);
  },

  updateRule: (ruleId, patch) => {
    set((s) => ({
      rules: s.rules.map((r) => (r.id === ruleId ? { ...r, ...patch } : r))
    }));
    get().syncToBackend(false);
  },

  deleteRule: (ruleId) => {
    set((s) => ({
      rules: s.rules.filter((r) => r.id !== ruleId)
    }));
    get().syncToBackend(true);
  },

  addRule: (rule) => {
    set((s) => ({
      rules: [rule, ...s.rules]
    }));
    get().syncToBackend(true);
  },

  sendRconCommand: async (rawCmd: string, donor = 'Streamer') => {
    const { rconConfig } = get();
    const cleanPlayer = (rconConfig.player || 'CJ7_TUTORIALES').trim().replace(/[^a-zA-Z0-9_]/g, '_');
    const cleanDonor = donor.trim().replace(/[^a-zA-Z0-9_]/g, '_');

    const formattedCmd = rawCmd
      .replace(/{jugador}|{player}|{target}/gi, cleanPlayer)
      .replace(/{donador}|{donor}/gi, cleanDonor)
      .trim();

    if (!formattedCmd) return '';

    set({ isSendingCommand: true });
    const timestamp = new Date().toLocaleTimeString();

    try {
      const response = await invokeTyped('send_rcon', {
        host: rconConfig.host,
        port: rconConfig.port,
        password: rconConfig.password,
        command: formattedCmd
      });

      const entry: RconLogEntry = {
        id: `log_${Date.now()}_${Math.random()}`,
        time: timestamp,
        command: formattedCmd,
        response: response || '[OK] Comando ejecutado en servidor',
        isError: false
      };

      set((s) => ({
        consoleLogs: [entry, ...s.consoleLogs].slice(0, 50),
        rconConfig: { ...s.rconConfig, status: 'CONNECTED', lastLog: `OK: ${formattedCmd}` }
      }));

      return response;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const entry: RconLogEntry = {
        id: `log_${Date.now()}_${Math.random()}`,
        time: timestamp,
        command: formattedCmd,
        response: `[ERROR] ${errMsg}`,
        isError: true
      };

      set((s) => ({
        consoleLogs: [entry, ...s.consoleLogs].slice(0, 50),
        rconConfig: { ...s.rconConfig, status: 'ERROR', lastLog: `Error: ${errMsg}` }
      }));

      return errMsg;
    } finally {
      set({ isSendingCommand: false });
    }
  },

  clearConsoleLogs: () => set({ consoleLogs: [] }),

  toggleNightVision: async (enabled: boolean) => {
    const { rconConfig, overlaySettings } = get();
    set({
      overlaySettings: { ...overlaySettings, nightVision: enabled }
    });

    try {
      await invokeTyped('set_night_vision', {
        enabled,
        player: rconConfig.player,
        host: rconConfig.host,
        port: rconConfig.port,
        password: rconConfig.password
      });
    } catch (err) {
      console.warn('Error alternando visión nocturna:', err);
    }
  },

  syncToBackend: async (immediate = false) => {
    if (mcSyncDebounceTimer) {
      clearTimeout(mcSyncDebounceTimer);
      mcSyncDebounceTimer = null;
    }

    const executeSync = async () => {
      try {
        set({ isSaving: true });
        const { rules, overlaySettings, rconConfig } = get();
        const payload = JSON.stringify({ rules, overlaySettings, rconConfig });
        await invokeTyped('update_mc_overlay_config', { config_json: payload });
      } catch (err) {
        console.warn('[MinecraftStore] Error sincronizando con Rust:', err);
      } finally {
        set({ isSaving: false });
      }
    };

    if (immediate) {
      await executeSync();
    } else {
      mcSyncDebounceTimer = setTimeout(executeSync, 250);
    }
  }
}));
