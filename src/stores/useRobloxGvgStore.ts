import { create } from 'zustand';
import type {
  RobloxOverlayConfig,
  GvgSlotRule,
  MoveSlotPayload
} from '@/types/roblox.types';
import { reorderSlotRules } from '@/lib/reorder-slots';
import { invokeTyped } from '@/api/tauri-bridge';

// Preset Oficial 1:1 replicando exactamente la imagen de duelo (18 regalos)
export const OFFICIAL_DEFAULT_ROBLOX_CONFIG: RobloxOverlayConfig = {
  version: 4,
  theme_style: 'TRANSPARENT',
  win_label: 'WIN',
  win_theme: 'AUTO',
  target_wins: 15,
  current_wins: 7,
  duel_scale: 100,
  win_scale: 100,
  icon_size: 48,
  text_size: 20,
  item_gap: 8,
  sharpness: 140,
  show_side_columns: true,
  show_win_in_sides: false,
  likes_current: 25049,
  likes_goal: 30000,
  likes_action: '-1 WIN',
  likes_action_value: -1,
  center_red_name: 'Rose',
  center_red_coins: 1,
  center_red_icon: 'rose-1-coins.webp',
  center_blue_name: 'GG',
  center_blue_coins: 1,
  center_blue_icon: 'gg-1-coins.webp',
  left_rules: [
    { id: 'L1', gift_name: 'Lion', icon_file: 'lion-29999-coins.webp', coins: 29999, label: '-20 WIN', action_type: 'WIN', value: -20, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5883' },
    { id: 'L2', gift_name: 'Whale Diving', icon_file: 'whale-diving-2150-coins.webp', coins: 2150, label: '-10 WIN', action_type: 'WIN', value: -10, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5756' },
    { id: 'L3', gift_name: 'Motorcycle', icon_file: 'motorcycle-888-coins.webp', coins: 888, label: '-5 WIN', action_type: 'WIN', value: -5, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5660' },
    { id: 'L4', gift_name: 'Money Gun', icon_file: 'money-gun-500-coins.webp', coins: 500, label: '-3 WIN', action_type: 'WIN', value: -3, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5659' },
    { id: 'L5', gift_name: 'Coral', icon_file: 'coral-499-coins.webp', coins: 499, label: '-2 WIN', action_type: 'WIN', value: -2, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5877' },
    { id: 'L6', gift_name: 'Swan', icon_file: 'swan-699-coins.webp', coins: 699, label: '-1 WIN', action_type: 'WIN', value: -1, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5759' },
    { id: 'L7', gift_name: 'Rose', icon_file: 'rose-1-coins.webp', coins: 1, label: '+1', action_type: 'PTS', value: 1, duration_seconds: 5, is_bottom: true, tiktokGiftId: '5655' },
    { id: 'L8', gift_name: 'Rosa', icon_file: 'rose-1-coins.webp', coins: 1, label: '+10', action_type: 'PTS', value: 10, duration_seconds: 5, is_bottom: true, tiktokGiftId: '5655' },
    { id: 'L9', gift_name: 'Doughnut', icon_file: 'doughnut-30-coins.webp', coins: 30, label: '+50', action_type: 'PTS', value: 50, duration_seconds: 5, is_bottom: true, tiktokGiftId: '5269' }
  ],
  right_rules: [
    { id: 'R1', gift_name: 'Flying Jets', icon_file: 'flying-jets-4888-coins.webp', coins: 4888, label: '+20 WIN', action_type: 'WIN', value: 20, duration_seconds: 5, is_bottom: false, tiktokGiftId: '6338' },
    { id: 'R2', gift_name: 'Falcon', icon_file: 'falcon-10999-coins.webp', coins: 10999, label: '+10 WIN', action_type: 'WIN', value: 10, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5898' },
    { id: 'R3', gift_name: 'Cruiser', icon_file: 'cruiser-7499-coins.webp', coins: 7499, label: '+5 WIN', action_type: 'WIN', value: 5, duration_seconds: 5, is_bottom: false, tiktokGiftId: '5896' },
    { id: 'R4', gift_name: 'Blooming Ribbons', icon_file: 'blooming-ribbons-1000-coins.webp', coins: 1000, label: '+3 WIN', action_type: 'WIN', value: 3, duration_seconds: 5, is_bottom: false, tiktokGiftId: '6468' },
    { id: 'R5', gift_name: 'Lollipop Gift Box', icon_file: 'lollipop-gift-box-650-coins.webp', coins: 650, label: '+2 WIN', action_type: 'WIN', value: 2, duration_seconds: 5, is_bottom: false, tiktokGiftId: '6467' },
    { id: 'R6', gift_name: "Creator's Cap", icon_file: 'creator-s-cap-99-coins.webp', coins: 99, label: '+1 WIN', action_type: 'WIN', value: 1, duration_seconds: 5, is_bottom: false, tiktokGiftId: '6466' },
    { id: 'R7', gift_name: 'GG', icon_file: 'gg-1-coins.webp', coins: 1, label: '+1', action_type: 'PTS', value: 1, duration_seconds: 5, is_bottom: true, tiktokGiftId: '6064' },
    { id: 'R8', gift_name: 'Panda', icon_file: 'panda-5-coins.webp', coins: 5, label: '+10', action_type: 'PTS', value: 10, duration_seconds: 5, is_bottom: true, tiktokGiftId: '5487' },
    { id: 'R9', gift_name: 'Heart Me', icon_file: 'heart-me-1-coins.webp', coins: 1, label: '+50', action_type: 'PTS', value: 50, duration_seconds: 5, is_bottom: true, tiktokGiftId: '7934' }
  ]
};

interface RobloxGvgState {
  config: RobloxOverlayConfig;
  filterQuery: string;
  filterType: string;
  isSyncing: boolean;

  setFilterQuery: (query: string) => void;
  setFilterType: (type: string) => void;
  setConfig: (config: RobloxOverlayConfig) => void;
  loadOfficialPreset: () => void;

  updateSlot: (slotId: string, patch: Partial<GvgSlotRule>) => void;
  moveSlot: (payload: MoveSlotPayload) => void;
  updateSetting: <K extends keyof RobloxOverlayConfig>(key: K, value: RobloxOverlayConfig[K]) => void;

  syncToBackend: (immediate?: boolean) => Promise<void>;
}

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useRobloxGvgStore = create<RobloxGvgState>((set, get) => ({
  config: OFFICIAL_DEFAULT_ROBLOX_CONFIG,
  filterQuery: '',
  filterType: 'ALL',
  isSyncing: false,

  setFilterQuery: (filterQuery) => set({ filterQuery }),
  setFilterType: (filterType) => set({ filterType }),
  setConfig: (config) => {
    set({ config });
    get().syncToBackend(true);
  },

  loadOfficialPreset: () => {
    set({ config: JSON.parse(JSON.stringify(OFFICIAL_DEFAULT_ROBLOX_CONFIG)) });
    get().syncToBackend(true);
  },

  updateSlot: (slotId, patch) => {
    const cfg = get().config;
    const updateList = (rules: GvgSlotRule[]) =>
      rules.map((s) => (s.id === slotId ? { ...s, ...patch } : s));

    set({
      config: {
        ...cfg,
        left_rules: updateList(cfg.left_rules),
        right_rules: updateList(cfg.right_rules)
      }
    });
    // Sliders e inputs de texto usan sincronización debounced para no saturar IPC
    get().syncToBackend(false);
  },

  moveSlot: (payload) => {
    const newConfig = reorderSlotRules(get().config, payload);
    set({ config: newConfig });
    // Drag & Drop ejecuta sincronización inmediata (onDrop)
    get().syncToBackend(true);
  },

  updateSetting: (key, value) => {
    set((state) => ({
      config: {
        ...state.config,
        [key]: value
      }
    }));
    get().syncToBackend(false);
  },

  syncToBackend: async (immediate = false) => {
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
      syncDebounceTimer = null;
    }

    const executeSync = async () => {
      try {
        set({ isSyncing: true });
        const json = JSON.stringify(get().config);
        await invokeTyped('update_roblox_overlay_config', { config_json: json });
      } catch (err) {
        console.warn('[RobloxGvgStore] Error sincronizando con Rust:', err);
      } finally {
        set({ isSyncing: false });
      }
    };

    if (immediate) {
      await executeSync();
    } else {
      syncDebounceTimer = setTimeout(executeSync, 200);
    }
  }
}));
