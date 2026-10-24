export type StreamerRole = 'ADMIN' | 'STREAMER' | 'TRIAL';

export interface LicenseSessionStatus {
  verified: boolean;
  username: string;
  role: StreamerRole;
  hwid: string;
  bound_hwid: string;
  allow_mc_plugins: boolean;
  expires_at: number;
  session_nonce: string;
  cloud_connected: boolean;
  message?: string;
}

export interface StreamerEnvironmentStatus {
  java_installed: boolean;
  java_version: string;
  free_sounds_count: number;
  gift_icons_count: number;
  available_mc_plugins: string[];
}

export interface AppUpdateInfo {
  available: boolean;
  current_version: string;
  version: string;
  body: string;
  date: string;
}

export interface UpdateProgressPayload {
  downloaded_bytes: number;
  total_bytes: number | null;
  percentage: number;
  status: 'downloading' | 'installing' | 'ready';
}

export interface StreamerRecord {
  username: string;
  license_key: string;
  role: StreamerRole;
  hwid: string;
  allow_mc_plugins: boolean;
  expires_at: number;
  created_at: number;
  is_active: boolean;
}
