import { create } from 'zustand';
import type { AppUpdateInfo, UpdateProgressPayload } from '@/types/tauri.types';
import { invokeTyped } from '@/api/tauri-bridge';

const CURRENT_VERSION = '2.2.2';

interface AutoUpdaterState {
  currentVersion: string;
  updateInfo: AppUpdateInfo | null;
  isChecking: boolean;
  isDownloading: boolean;
  isModalOpen: boolean;
  downloadProgress: UpdateProgressPayload | null;
  errorMessage: string | null;

  checkForUpdates: (manual?: boolean) => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
  startUpdate: () => Promise<void>;
}

export const useAutoUpdaterStore = create<AutoUpdaterState>((set, get) => ({
  currentVersion: CURRENT_VERSION,
  updateInfo: null,
  isChecking: false,
  isDownloading: false,
  isModalOpen: false,
  downloadProgress: null,
  errorMessage: null,

  checkForUpdates: async (manual = false) => {
    set({ isChecking: true, errorMessage: null });
    try {
      const info = await invokeTyped('check_for_updates');
      set({ updateInfo: info });
      if (manual && info?.available) {
        set({ isModalOpen: true });
      }
    } catch {
      // Mock / fallback de comprobación
      set({
        updateInfo: {
          available: false,
          current_version: CURRENT_VERSION,
          version: CURRENT_VERSION,
          body: 'Estás ejecutando la versión más reciente.',
          date: '2026-10-23'
        }
      });
    } finally {
      set({ isChecking: false });
    }
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  startUpdate: async () => {
    const info = get().updateInfo;
    if (!info?.available) return;

    set({ isDownloading: true, errorMessage: null });
    try {
      await invokeTyped('download_and_install_update', {
        download_url: `https://github.com/cyber-gz7/galactik-landing/releases/download/v${info.version}/GALACTK_PANEL_v${info.version}_x64-setup.exe`
      });
    } catch (err) {
      set({
        errorMessage: err instanceof Error ? err.message : String(err),
        isDownloading: false
      });
    }
  }
}));
