import { limpiarArchivoGift, archivoDeGift } from '../gifts.js';

export const DEFAULT_ROBLOX_CONFIG = {
  rules_schema_version: 3,
  target_wins: 10,
  goal_action: 'INCREASE_TARGET',
  show_side_columns: true,
  center_red_name: 'Rose',
  center_red_icon: 'rose-1-coins.webp',
  center_red_coins: 1,
  center_red_sound_name: '',
  center_red_sound_url: '',
  center_blue_name: 'GG',
  center_blue_icon: 'gg-1-coins.webp',
  center_blue_coins: 1,
  center_blue_sound_name: '',
  center_blue_sound_url: '',
  theme_style: 'GALACTIC',
  win_label: 'WIN',
  win_theme: 'AUTO',
  show_win_in_sides: false,
  icon_size: 48,
  text_size: 20,
  item_gap: 8,
  sharpness: 140,
  win_scale: 100,
  duel_scale: 100,
  left_rules: [
    { id: 'L1', gift_name: 'Doughnut', icon_file: 'doughnut-30-coins.webp', coins: 30, label: '+30 PTS', action_type: 'PTS', value: 30, duration_seconds: 5, is_bottom: false, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'L2', gift_name: 'Game Controller', icon_file: 'game-controller-100-coins.webp', coins: 100, label: '+100 PTS', action_type: 'PTS', value: 100, duration_seconds: 5, is_bottom: false, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'L3', gift_name: 'Corgi', icon_file: 'corgi-299-coins.webp', coins: 299, label: '+299 PTS', action_type: 'PTS', value: 299, duration_seconds: 5, is_bottom: false, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'L4', gift_name: 'Bear with Rose', icon_file: 'bear-with-rose-400-coins.webp', coins: 400, label: '-1 WIN', action_type: 'WIN', value: -1, duration_seconds: 5, is_bottom: true, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'L5', gift_name: 'Private Jet', icon_file: 'private-jet-4888-coins.webp', coins: 4888, label: '-15 WINS', action_type: 'WIN', value: -15, duration_seconds: 5, is_bottom: true, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'L6', gift_name: 'Lion', icon_file: 'lion-29999-coins.webp', coins: 29999, label: '-15 WINS', action_type: 'WIN', value: -15, duration_seconds: 5, is_bottom: true, sound_name: '', sound_url: '', sound_volume: 1.0 }
  ],
  right_rules: [
    { id: 'R1', gift_name: 'Heart Me', icon_file: 'heart-me-1-coins.webp', coins: 1, label: '+10 PTS', action_type: 'PTS', value: 10, duration_seconds: 5, is_bottom: false, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'R2', gift_name: 'Capybara', icon_file: 'capybara-30-coins.webp', coins: 30, label: '+30 PTS', action_type: 'PTS', value: 30, duration_seconds: 5, is_bottom: false, sound_name: '', sound_url: '', sound_volume: 1.0 },
    { id: 'R3', gift_name: 'Money Gun', icon_file: 'money-gun-500-coins.webp', coins: 500, label: '+1 WIN', action_type: 'WIN', value: 1, duration_seconds: 5, is_bottom: true, sound_name: '', sound_url: '', sound_volume: 1.0 }
  ]
};

const cloneObbyDefaults = () => JSON.parse(JSON.stringify(DEFAULT_ROBLOX_CONFIG));
const signedNumberFrom = (...values) => {
  for (const raw of values) {
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    const match = String(raw ?? '').match(/[+-]?\d+(?:\.\d+)?/);
    if (match) return Number(match[0]);
  }
  return 0;
};

export function parseObbyConfigImport(source) {
  let raw = source;
  if (typeof raw === 'string') {
    const text = raw.trim();
    try { raw = JSON.parse(text); }
    catch (_) {
      try { raw = JSON.parse(atob(text)); }
      catch (_) { throw new Error('El archivo o código de perfil no contiene JSON válido'); }
    }
  }
  if (!raw || typeof raw !== 'object') throw new Error('Configuración Obby inválida');

  const own = raw.robloxOverlayConfig || raw.galactic_obby || raw.config?.robloxOverlayConfig || raw.config || raw;
  if (own && (Array.isArray(own.left_rules) || Array.isArray(own.right_rules))) {
    const normalized = { ...cloneObbyDefaults(), ...own, rules_schema_version: 3 };
    const normalizeRule = (rule, side, index) => ({
      id: String(rule.id || `${side === 'LEFT' ? 'L' : 'R'}${Date.now()}_${index}`),
      gift_name: String(rule.gift_name || rule.giftName || rule.name || 'Regalo'),
      icon_file: limpiarArchivoGift(rule.icon_file || rule.icon || archivoDeGift(rule.gift_name || rule.giftName || rule.name, rule.coins || 1)),
      coins: Math.max(1, Number(rule.coins || rule.cost || 1)),
      label: String(rule.label || `${Number(rule.value) >= 0 ? '+' : ''}${Number(rule.value) || 0} ${String(rule.action_type).toUpperCase() === 'WIN' ? 'WIN' : 'PTS'}`),
      action_type: String(rule.action_type || rule.action || 'PTS').toUpperCase().includes('WIN') ? 'WIN' : 'PTS',
      value: Number(rule.value ?? rule.points ?? 0),
      duration_seconds: Math.max(0, Number(rule.duration_seconds ?? rule.duration ?? 5)),
      is_bottom: String(rule.action_type || rule.action || '').toUpperCase().includes('WIN'),
      sound_name: String(rule.sound_name || rule.audioName || ''),
      sound_url: String(rule.sound_url || rule.audio || rule.audioUrl || ''),
      sound_volume: Number(rule.sound_volume ?? rule.volume ?? 1)
    });
    normalized.left_rules = (own.left_rules || []).map((r, i) => normalizeRule(r, 'LEFT', i));
    normalized.right_rules = (own.right_rules || []).map((r, i) => normalizeRule(r, 'RIGHT', i));
    return normalized;
  }

  const actions = raw.actions || raw.events || raw.profile?.actions || raw.profile?.events || raw.data?.actions || raw.data?.events;
  if (!Array.isArray(actions)) throw new Error('No se encontraron actions, events ni reglas GALACTK PANEL');
  const config = cloneObbyDefaults();
  config.left_rules = [];
  config.right_rules = [];
  actions.forEach((item, index) => {
    const extra = [item.Extra, item.extra, item.action, item.type, item.event, item.description, item.name].filter(Boolean).join(' ');
    const normalizedText = extra.toLowerCase();
    const isRight = /derecha|\bder\b|right|h[eé]roe|a favor/.test(normalizedText);
    const isLeft = /izquierda|\bizq\b|left|villano|en contra/.test(normalizedText);
    const isWins = /\bwins?\b/.test(normalizedText) || (/suma|resta/.test(normalizedText) && !isLeft && !isRight);
    const giftName = String(item.gift_name || item.giftName || item.gift?.name || item.trigger?.giftName || item.name || `Regalo ${index + 1}`);
    let value = signedNumberFrom(item.value, item.amount, item.points, item.wins, item.Extra, item.extra, item.description);
    if (/resta|subtract|minus/.test(normalizedText) && value > 0) value *= -1;
    const actionType = isWins ? 'WIN' : 'PTS';
    const side = isWins ? (value < 0 ? 'LEFT' : 'RIGHT') : (isRight && !isLeft ? 'RIGHT' : 'LEFT');
    const rule = {
      id: `${side === 'LEFT' ? 'L' : 'R'}IMP_${Date.now()}_${index}`,
      gift_name: giftName,
      icon_file: limpiarArchivoGift(item.icon_file || item.icon || item.gift?.icon || archivoDeGift(giftName, item.coins || item.cost || 1)),
      coins: Math.max(1, Number(item.coins || item.cost || item.gift?.coins || 1)),
      label: `${value >= 0 ? '+' : ''}${value} ${actionType === 'WIN' ? 'WIN' : 'PTS'}`,
      action_type: actionType,
      value,
      duration_seconds: Math.max(0, Number(item.duration_seconds ?? item.duration ?? item.seconds ?? 5)),
      is_bottom: isWins,
      sound_name: String(item.sound_name || item.audioName || item.sound?.name || ''),
      sound_url: String(item.sound_url || item.audioUrl || item.audio || item.sound?.url || ''),
      sound_volume: Number(item.sound_volume ?? item.volume ?? 1)
    };
    (side === 'LEFT' ? config.left_rules : config.right_rules).push(rule);
  });
  config.target_wins = Math.max(1, Number(raw.target_wins || raw.targetWins || raw.goal || 10));
  config.theme_style = String(raw.theme_style || raw.theme || 'GALACTIC').toUpperCase();
  return config;
}

