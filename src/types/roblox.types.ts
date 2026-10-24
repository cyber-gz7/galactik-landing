export type GvgActionType = 'PTS' | 'WIN';
export type GvgSlotPosition = 'SIDE' | 'BOTTOM';
export type GvgColumnSide = 'LEFT' | 'RIGHT';
export type GvgThemeStyle = 'TRANSPARENT' | 'GALACTIC' | 'CYBERPUNK' | 'MINIMAL';

export interface GvgSlotRule {
  readonly id: string;
  gift_name: string;
  icon_file: string;
  coins: number;
  label: string;
  action_type: GvgActionType;
  value: number;
  duration_seconds: number;
  is_bottom: boolean;
  sound_name?: string;
  sound_url?: string;
  sound_volume?: number;
  tiktokGiftId?: string;
}

export interface RobloxOverlayConfig {
  version: number;
  theme_style: GvgThemeStyle;
  win_label: string;
  win_theme: string;
  target_wins: number;
  current_wins: number;
  duel_scale: number;
  win_scale: number;
  icon_size: number;
  text_size: number;
  item_gap: number;
  sharpness: number;
  show_side_columns: boolean;
  show_win_in_sides: boolean;
  likes_current: number;
  likes_goal: number;
  likes_action: string;
  likes_action_value: number;
  center_red_name: string;
  center_red_coins: number;
  center_red_icon: string;
  center_red_sound_name?: string;
  center_red_sound_url?: string;
  center_blue_name: string;
  center_blue_coins: number;
  center_blue_icon: string;
  center_blue_sound_name?: string;
  center_blue_sound_url?: string;
  left_rules: GvgSlotRule[];
  right_rules: GvgSlotRule[];
}

export interface MoveSlotPayload {
  sourceId: string;
  targetId?: string;
  targetSide: GvgColumnSide;
  targetPos: GvgSlotPosition;
  insertBefore?: boolean;
  appendToCategory?: boolean;
}
