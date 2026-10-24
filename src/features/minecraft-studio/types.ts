export type MinecraftEventType =
  | 'gift'
  | 'follow'
  | 'likes_user'
  | 'likes_total'
  | 'share'
  | 'subscribe'
  | 'comment';

export interface MinecraftRule {
  id: string;
  type: MinecraftEventType;
  name: string;
  icon_file: string;
  action_label: string;
  command: string;
  coins?: number;
  tiktokGiftId?: string;
  mult?: string;
  totemDelta?: number;
  threshold?: number;
  matchText?: string;
  soundName?: string;
  enabled: boolean;
}

export interface MinecraftRconConfig {
  host: string;
  port: number;
  password: string;
  player: string;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
  lastLog?: string;
}

export interface MinecraftOverlaySettings {
  style: 'carousel' | 'static' | 'flat';
  scale: number;
  speed: number;
  fontSize: number;
  opacity: number;
  nightVision: boolean;
}
