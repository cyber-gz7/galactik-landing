import { create } from 'zustand';
import type { StreamerRecord, StreamerRole } from '@/types/tauri.types';
import { invokeTyped } from '@/api/tauri-bridge';

const MOCK_STREAMERS: StreamerRecord[] = [
  {
    username: 'robertogames444',
    license_key: 'GL-ROBERTO-PRO-2026',
    role: 'STREAMER',
    hwid: 'GL-HWID-88371-AF89B',
    allow_mc_plugins: true,
    expires_at: 1799999999,
    created_at: 1700000000,
    is_active: true
  },
  {
    username: 'cj7_tutoriales',
    license_key: 'GL-CJ7-ADMIN-MASTER',
    role: 'ADMIN',
    hwid: 'GL-E320-79485B-AFD734',
    allow_mc_plugins: true,
    expires_at: 1999999999,
    created_at: 1690000000,
    is_active: true
  },
  {
    username: 'tiktok_gamer_pe',
    license_key: 'GL-PE-TRIAL-8821',
    role: 'TRIAL',
    hwid: 'GL-HWID-UNBOUND-99',
    allow_mc_plugins: false,
    expires_at: 1712000000,
    created_at: 1710000000,
    is_active: false
  }
];

interface AdminLicensesState {
  streamers: StreamerRecord[];
  isLoading: boolean;
  searchFilter: string;
  errorMessage: string | null;

  setSearchFilter: (filter: string) => void;
  loadStreamers: () => Promise<void>;
  toggleActive: (username: string) => Promise<void>;
  toggleMcPlugins: (username: string) => Promise<void>;
  resetHwid: (username: string) => Promise<void>;
  renewLicenseDays: (username: string, days: number) => Promise<void>;
  changeRole: (username: string, role: StreamerRole) => Promise<void>;
}

export const useAdminLicensesStore = create<AdminLicensesState>((set, get) => ({
  streamers: MOCK_STREAMERS,
  isLoading: false,
  searchFilter: '',
  errorMessage: null,

  setSearchFilter: (searchFilter) => set({ searchFilter }),

  loadStreamers: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const result = await invokeTyped('admin_list_streamers');
      if (Array.isArray(result) && result.length > 0) {
        set({ streamers: result });
      }
    } catch {
      // Si corre en web o dev sin backend admin activo, conservar los streamers mockeados
    } finally {
      set({ isLoading: false });
    }
  },

  toggleActive: async (username) => {
    const list = get().streamers;
    const target = list.find((s) => s.username === username);
    if (!target) return;
    const nextActive = !target.is_active;

    set({
      streamers: list.map((s) =>
        s.username === username ? { ...s, is_active: nextActive } : s
      )
    });

    try {
      await invokeTyped('admin_update_streamer', {
        username,
        is_active: nextActive
      });
    } catch (err) {
      console.warn('Error actualizando streamer en backend:', err);
    }
  },

  toggleMcPlugins: async (username) => {
    const list = get().streamers;
    const target = list.find((s) => s.username === username);
    if (!target) return;
    const nextMc = !target.allow_mc_plugins;

    set({
      streamers: list.map((s) =>
        s.username === username ? { ...s, allow_mc_plugins: nextMc } : s
      )
    });

    try {
      await invokeTyped('admin_update_streamer', {
        username,
        allow_mc_plugins: nextMc
      });
    } catch (err) {
      console.warn('Error actualizando plugins MC en backend:', err);
    }
  },

  resetHwid: async (username) => {
    const list = get().streamers;
    set({
      streamers: list.map((s) =>
        s.username === username ? { ...s, hwid: '*' } : s
      )
    });

    try {
      await invokeTyped('admin_update_streamer', {
        username,
        reset_hwid: true
      });
    } catch (err) {
      console.warn('Error reseteando HWID en backend:', err);
    }
  },

  renewLicenseDays: async (username, days) => {
    const list = get().streamers;
    const nowSecs = Math.floor(Date.now() / 1000);
    const addSecs = days * 86400;

    set({
      streamers: list.map((s) => {
        if (s.username !== username) return s;
        const currentExp = s.expires_at > nowSecs ? s.expires_at : nowSecs;
        return { ...s, expires_at: currentExp + addSecs, is_active: true };
      })
    });
  },

  changeRole: async (username, role) => {
    set({
      streamers: get().streamers.map((s) =>
        s.username === username ? { ...s, role } : s
      )
    });
  }
}));
