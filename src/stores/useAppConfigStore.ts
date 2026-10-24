import { create } from 'zustand';
import type { LicenseSessionStatus, StreamerEnvironmentStatus } from '@/types/tauri.types';
import { invokeTyped } from '@/api/tauri-bridge';

export type ActiveWorkspaceTab = 'roblox' | 'minecraft' | 'catalog' | 'admin' | 'settings';

interface AppConfigState {
  streamerUsername: string;
  activeTab: ActiveWorkspaceTab;
  isConnectedTikTok: boolean;
  isConnectingTikTok: boolean;
  license: LicenseSessionStatus | null;
  environment: StreamerEnvironmentStatus | null;

  setStreamerUsername: (username: string) => void;
  setActiveTab: (tab: ActiveWorkspaceTab) => void;
  setConnectedTikTok: (status: boolean) => void;
  setConnectingTikTok: (status: boolean) => void;
  setLicense: (license: LicenseSessionStatus) => void;
  setEnvironment: (env: StreamerEnvironmentStatus) => void;

  initAppState: () => Promise<void>;
}

export const useAppConfigStore = create<AppConfigState>((set) => ({
  streamerUsername: 'robertogames444',
  activeTab: 'roblox',
  isConnectedTikTok: false,
  isConnectingTikTok: false,
  license: null,
  environment: null,

  setStreamerUsername: (streamerUsername) => set({ streamerUsername }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setConnectedTikTok: (isConnectedTikTok) => set({ isConnectedTikTok }),
  setConnectingTikTok: (isConnectingTikTok) => set({ isConnectingTikTok }),
  setLicense: (license) => set({ license }),
  setEnvironment: (environment) => set({ environment }),

  initAppState: async () => {
    try {
      const [lic, env, cfgStr] = await Promise.allSettled([
        invokeTyped('get_license_status'),
        invokeTyped('check_streamer_environment'),
        invokeTyped('load_config')
      ]);

      if (lic.status === 'fulfilled') {
        set({ license: lic.value });
      }
      if (env.status === 'fulfilled') {
        set({ environment: env.value });
      }
      if (cfgStr.status === 'fulfilled' && cfgStr.value) {
        try {
          const parsed = JSON.parse(cfgStr.value);
          if (parsed.streamerUsername) {
            set({ streamerUsername: parsed.streamerUsername });
          }
        } catch {
          // Mantener 'robertogames444' por defecto
        }
      }
    } catch (err) {
      console.warn('[AppConfigStore] Inicialización parcial:', err);
    }
  }
}));
