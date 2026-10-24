import { invoke } from '@tauri-apps/api/core';
import type {
  LicenseSessionStatus,
  StreamerEnvironmentStatus,
  AppUpdateInfo,
  StreamerRecord
} from '@/types/tauri.types';

export interface TauriCommandMap {
  'load_config': { req: void; res: string };
  'save_config': { req: { config_json: string }; res: void };
  'get_license_status': { req: void; res: LicenseSessionStatus };
  'check_streamer_environment': { req: void; res: StreamerEnvironmentStatus };
  'update_roblox_overlay_config': { req: { config_json: string }; res: void };
  'update_mc_overlay_config': { req: { config_json: string }; res: void };
  'send_gvg_control': { req: { action_json: string }; res: void };
  'send_rcon': {
    req: {
      host: string;
      port: number;
      password: string;
      command: string;
    };
    res: string;
  };
  'set_night_vision': {
    req: {
      enabled: boolean;
      player: string;
      host: string;
      port: number;
      password: string;
    };
    res: void;
  };
  'check_for_updates': { req: void; res: AppUpdateInfo };
  'download_and_install_update': { req: { download_url: string }; res: string };
  'admin_list_streamers': { req: void; res: StreamerRecord[] };
  'admin_update_streamer': {
    req: {
      username: string;
      allow_mc_plugins?: boolean;
      is_active?: boolean;
      reset_hwid?: boolean;
    };
    res: void;
  };
  'emit_custom_alert': { req: { alert_json: string }; res: void };
  'update_top_settings': { req: { settings: unknown }; res: void };
  'emit_session_mvp': {
    req: {
      username: string;
      gift_name: string;
      coins: number;
    };
    res: void;
  };
  'modify_gvg_win': { req: { delta: number }; res: void };
  'reset_gvg_wins': { req: void; res: void };
}

export async function invokeTyped<K extends keyof TauriCommandMap>(
  command: K,
  args?: TauriCommandMap[K]['req']
): Promise<TauriCommandMap[K]['res']> {
  try {
    const rawArgs = (args ?? {}) as Record<string, unknown>;
    const result = await invoke<TauriCommandMap[K]['res']>(command, rawArgs);
    return result;
  } catch (error) {
    const errorMsg = typeof error === 'string'
      ? error
      : (error instanceof Error ? error.message : 'Error desconocido de comunicación IPC con Tauri');
    console.error(`[TauriIPC Error] Command "${command}":`, errorMsg);
    throw new Error(errorMsg);
  }
}
