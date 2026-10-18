use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, Mutex};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct DuelState {
    pub position: f32,
    pub wins_left: i32,
    pub wins_right: i32,
    pub team_left_name: String,
    pub team_right_name: String,
    pub gift_scale: u32,
    pub last_event: Option<String>,
}

impl Default for DuelState {
    fn default() -> Self {
        Self {
            position: 50.0,
            wins_left: 0,
            wins_right: 0,
            team_left_name: "TEAM ROJO".to_string(),
            team_right_name: "TEAM AZUL".to_string(),
            gift_scale: 100,
            last_event: None,
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct RobloxRuleItem {
    pub id: String,
    pub gift_name: String,
    pub icon_file: String,
    pub coins: u32,
    pub label: String,
    pub action_type: String, // "WIN" | "PTS"
    pub value: i32,
    pub is_bottom: bool,
    #[serde(default)]
    pub sound_name: String,
    #[serde(default)]
    pub sound_url: String,
    #[serde(default = "default_sound_volume")]
    pub sound_volume: f32,
    #[serde(default = "default_duration_seconds")]
    pub duration_seconds: u32,
}

fn default_sound_volume() -> f32 {
    1.0
}
fn default_duration_seconds() -> u32 {
    5
}
fn default_center_red_name() -> String {
    "Rose".to_string()
}
fn default_center_blue_name() -> String {
    "GG".to_string()
}
fn default_center_coins() -> u32 {
    1
}
fn default_theme_style() -> String {
    "GALACTIC".to_string()
}
fn default_win_label() -> String {
    "WIN".to_string()
}
fn default_win_theme() -> String {
    "AUTO".to_string()
}
fn default_icon_size() -> u32 {
    48
}
fn default_text_size() -> u32 {
    20
}
fn default_item_gap() -> u32 {
    8
}
fn default_sharpness() -> u32 {
    140
}
fn default_scale_100() -> u32 {
    100
}
fn default_goal_action() -> String {
    "INCREASE_TARGET".to_string()
}
fn default_true() -> bool {
    true
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct GiftVsGiftState {
    pub wins: i32,
    pub target_wins: i32,
    pub red_points: i32,
    pub blue_points: i32,
    pub last_action: String,
    #[serde(default = "default_goal_action")]
    pub goal_action: String,
    #[serde(default = "default_true")]
    pub show_side_columns: bool,
    #[serde(default = "default_center_red_name")]
    pub center_red_name: String,
    pub center_red_icon: String,
    #[serde(default = "default_center_coins")]
    pub center_red_coins: u32,
    #[serde(default)]
    pub center_red_sound_name: String,
    #[serde(default)]
    pub center_red_sound_url: String,
    #[serde(default = "default_center_blue_name")]
    pub center_blue_name: String,
    pub center_blue_icon: String,
    #[serde(default = "default_center_coins")]
    pub center_blue_coins: u32,
    #[serde(default)]
    pub center_blue_sound_name: String,
    #[serde(default)]
    pub center_blue_sound_url: String,
    #[serde(default = "default_theme_style")]
    pub theme_style: String,
    #[serde(default = "default_win_label")]
    pub win_label: String,
    #[serde(default = "default_win_theme")]
    pub win_theme: String,
    #[serde(default)]
    pub show_win_in_sides: bool,
    #[serde(default = "default_icon_size")]
    pub icon_size: u32,
    #[serde(default = "default_text_size")]
    pub text_size: u32,
    #[serde(default = "default_item_gap")]
    pub item_gap: u32,
    #[serde(default = "default_sharpness")]
    pub sharpness: u32,
    #[serde(default = "default_scale_100")]
    pub win_scale: u32,
    #[serde(default = "default_scale_100")]
    pub duel_scale: u32,
    pub left_rules: Vec<RobloxRuleItem>,
    pub right_rules: Vec<RobloxRuleItem>,
}

impl Default for GiftVsGiftState {
    fn default() -> Self {
        Self {
            wins: 0,
            target_wins: 10,
            red_points: 0,
            blue_points: 0,
            last_action: String::new(),
            goal_action: default_goal_action(),
            show_side_columns: true,
            center_red_name: "Rose".to_string(),
            center_red_icon: "rose-1-coins.webp".to_string(),
            center_red_coins: 1,
            center_red_sound_name: String::new(),
            center_red_sound_url: String::new(),
            center_blue_name: "GG".to_string(),
            center_blue_icon: "gg-1-coins.webp".to_string(),
            center_blue_coins: 1,
            center_blue_sound_name: String::new(),
            center_blue_sound_url: String::new(),
            theme_style: "GALACTIC".to_string(),
            win_label: "WIN".to_string(),
            win_theme: "AUTO".to_string(),
            show_win_in_sides: false,
            icon_size: 48,
            text_size: 20,
            item_gap: 8,
            sharpness: 140,
            win_scale: 100,
            duel_scale: 100,
            left_rules: vec![
                RobloxRuleItem {
                    id: "L1".into(),
                    gift_name: "Doughnut".into(),
                    icon_file: "doughnut-30-coins.webp".into(),
                    coins: 30,
                    label: "+30 PTS".into(),
                    action_type: "PTS".into(),
                    value: 30,
                    is_bottom: false,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "L2".into(),
                    gift_name: "Game Controller".into(),
                    icon_file: "game-controller-100-coins.webp".into(),
                    coins: 100,
                    label: "+100 PTS".into(),
                    action_type: "PTS".into(),
                    value: 100,
                    is_bottom: false,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "L3".into(),
                    gift_name: "Corgi".into(),
                    icon_file: "corgi-299-coins.webp".into(),
                    coins: 299,
                    label: "+299 PTS".into(),
                    action_type: "PTS".into(),
                    value: 299,
                    is_bottom: false,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "L4".into(),
                    gift_name: "Bear with Rose".into(),
                    icon_file: "bear-with-rose-400-coins.webp".into(),
                    coins: 400,
                    label: "-1 WIN".into(),
                    action_type: "WIN".into(),
                    value: -1,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "L5".into(),
                    gift_name: "Private Jet".into(),
                    icon_file: "private-jet-4888-coins.webp".into(),
                    coins: 4888,
                    label: "-15 WINS".into(),
                    action_type: "WIN".into(),
                    value: -15,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "L6".into(),
                    gift_name: "Lion".into(),
                    icon_file: "lion-29999-coins.webp".into(),
                    coins: 29999,
                    label: "-15 WINS".into(),
                    action_type: "WIN".into(),
                    value: -15,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
            ],
            right_rules: vec![
                RobloxRuleItem {
                    id: "R1".into(),
                    gift_name: "Heart Me".into(),
                    icon_file: "heart-me-1-coins.webp".into(),
                    coins: 1,
                    label: "+10 PTS".into(),
                    action_type: "PTS".into(),
                    value: 10,
                    is_bottom: false,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "R2".into(),
                    gift_name: "Capybara".into(),
                    icon_file: "capybara-30-coins.webp".into(),
                    coins: 30,
                    label: "+30 PTS".into(),
                    action_type: "PTS".into(),
                    value: 30,
                    is_bottom: false,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "R3".into(),
                    gift_name: "Treasure Chest".into(),
                    icon_file: "treasure-chest-1500-coins.webp".into(),
                    coins: 1500,
                    label: "+5 WINS".into(),
                    action_type: "WIN".into(),
                    value: 5,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "R4".into(),
                    gift_name: "Money Gun".into(),
                    icon_file: "money-gun-500-coins.webp".into(),
                    coins: 500,
                    label: "+1 WIN".into(),
                    action_type: "WIN".into(),
                    value: 1,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "R5".into(),
                    gift_name: "Whale Diving".into(),
                    icon_file: "whale-diving-2150-coins.webp".into(),
                    coins: 2150,
                    label: "+5 WINS".into(),
                    action_type: "WIN".into(),
                    value: 5,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
                RobloxRuleItem {
                    id: "R6".into(),
                    gift_name: "Falcon".into(),
                    icon_file: "falcon-10999-coins.webp".into(),
                    coins: 10999,
                    label: "+20 WINS".into(),
                    action_type: "WIN".into(),
                    value: 20,
                    is_bottom: true,
                    sound_name: String::new(),
                    sound_url: String::new(),
                    sound_volume: 1.0,
                    duration_seconds: 5,
                },
            ],
        }
    }
}

pub struct OverlayServerState {
    pub duel: Arc<Mutex<DuelState>>,
    pub gift_vs_gift: Arc<Mutex<GiftVsGiftState>>,
    pub mc_overlay: Arc<Mutex<serde_json::Value>>,
    pub roles: Arc<Mutex<serde_json::Value>>,
    pub song_queue: Arc<Mutex<Vec<serde_json::Value>>>,
    pub now_playing: Arc<Mutex<Option<serde_json::Value>>>,
    pub last_global_alert_ms: Arc<Mutex<u64>>,
    pub user_last_alert_ms: Arc<Mutex<HashMap<String, u64>>>,
    pub top_settings: Arc<Mutex<serde_json::Value>>,
    pub session_mvp: Arc<Mutex<serde_json::Value>>,
    pub tx: broadcast::Sender<String>,
}

impl OverlayServerState {
    pub fn new() -> Self {
        let (tx, _) = broadcast::channel(150);
        let default_mc = serde_json::json!({
            "style": "carousel",
            "showTotems": true,
            "totems": 10,
            "maxTotems": 20,
            "faction": "BUENOS",
            "items": [
                { "id": "1", "gift_name": "Rosa", "icon_file": "rose-1-coins.webp", "coins": 1, "action_label": "Zombie", "faction": "MALOS" },
                { "id": "2", "gift_name": "GG", "icon_file": "gg-1-coins.webp", "coins": 5, "action_label": "Creeper", "faction": "MALOS" },
                { "id": "3", "gift_name": "Heart Me", "icon_file": "heart-me-1-coins.webp", "coins": 1, "action_label": "+1 Totem", "faction": "BUENOS" },
                { "id": "4", "gift_name": "Doughnut", "icon_file": "doughnut-30-coins.webp", "coins": 30, "action_label": "Lluvia TNT", "faction": "MALOS" },
                { "id": "5", "gift_name": "Capybara", "icon_file": "capybara-30-coins.webp", "coins": 30, "action_label": "5 Diamantes", "faction": "BUENOS" },
                { "id": "6", "gift_name": "Game Controller", "icon_file": "game-controller-100-coins.webp", "coins": 100, "action_label": "Warden Boss", "faction": "MALOS" },
                { "id": "7", "gift_name": "Galaxy", "icon_file": "galaxy-1000-coins.webp", "coins": 1000, "action_label": "Arcangel Solar", "faction": "BUENOS" },
                { "id": "8", "gift_name": "Lion", "icon_file": "lion-29999-coins.webp", "coins": 29999, "action_label": "La Parka Final", "faction": "MALOS" }
            ]
        });

        let initial_roles = match std::fs::read_to_string(r"C:\Proyectos\GalacticLive\roles.json") {
            Ok(content) => serde_json::from_str::<serde_json::Value>(&content).unwrap_or_else(|_| serde_json::json!({
                "roles": { "mods": ["gz7", "admin", "mod_cyber"], "mvp": ["vip_gamer", "mvp_donor"], "vip": ["amigo_vip"], "default": [] },
                "points": { "gz7": 9999, "mod_cyber": 500, "vip_gamer": 200 }
            })),
            Err(_) => serde_json::json!({
                "roles": { "mods": ["gz7", "admin", "mod_cyber"], "mvp": ["vip_gamer", "mvp_donor"], "vip": ["amigo_vip"], "default": [] },
                "points": { "gz7": 9999, "mod_cyber": 500, "vip_gamer": 200 }
            }),
        };

        let default_top_settings = serde_json::json!({
            "metric": "coins",
            "limit": 5,
            "showCrown": true,
            "showShimmer": true,
            "mockActive": false
        });

        let default_session_mvp = serde_json::json!({
            "username": "Nadie aún",
            "giftName": "",
            "coins": 0
        });

        Self {
            duel: Arc::new(Mutex::new(DuelState::default())),
            gift_vs_gift: Arc::new(Mutex::new(GiftVsGiftState::default())),
            mc_overlay: Arc::new(Mutex::new(default_mc)),
            roles: Arc::new(Mutex::new(initial_roles)),
            song_queue: Arc::new(Mutex::new(Vec::new())),
            now_playing: Arc::new(Mutex::new(None)),
            last_global_alert_ms: Arc::new(Mutex::new(0)),
            user_last_alert_ms: Arc::new(Mutex::new(HashMap::new())),
            top_settings: Arc::new(Mutex::new(default_top_settings)),
            session_mvp: Arc::new(Mutex::new(default_session_mvp)),
            tx,
        }
    }

    pub async fn set_scale(&self, scale: u32) {
        let mut d = self.duel.lock().await;
        d.gift_scale = scale.clamp(40, 300);
        let msg = serde_json::json!({
            "type": "scale",
            "duel": &*d
        })
        .to_string();
        let _ = self.tx.send(msg);
    }

    pub async fn push_duel(&self, side: &str, power: f32, donor: &str, gift_name: &str) {
        let mut d = self.duel.lock().await;
        let shift = power * 1.5;
        if side.eq_ignore_ascii_case("LEFT") {
            d.position = (d.position - shift).max(0.0);
        } else {
            d.position = (d.position + shift).min(100.0);
        }

        d.last_event = Some(format!("{} envió {}", donor, gift_name));

        let mut win_event = None;
        if d.position <= 0.0 {
            d.wins_left += 1;
            d.position = 50.0;
            win_event = Some(serde_json::json!({
                "type": "win",
                "data": { "winner": "LEFT", "name": &d.team_left_name, "wins": d.wins_left },
                "duel": &*d
            }));
        } else if d.position >= 100.0 {
            d.wins_right += 1;
            d.position = 50.0;
            win_event = Some(serde_json::json!({
                "type": "win",
                "data": { "winner": "RIGHT", "name": &d.team_right_name, "wins": d.wins_right },
                "duel": &*d
            }));
        }

        let push_msg = serde_json::json!({
            "type": "push",
            "duel": &*d,
            "data": {
                "side": side,
                "power": power,
                "user": donor,
                "title": gift_name
            }
        })
        .to_string();
        let _ = self.tx.send(push_msg);

        if let Some(w) = win_event {
            let _ = self.tx.send(w.to_string());
        }
    }

    pub async fn modify_win(&self, delta: i32) {
        let mut g = self.gift_vs_gift.lock().await;
        g.wins += delta;
        g.last_action = format!("{:+} WIN", delta);
        if g.wins >= g.target_wins {
            match g.goal_action.as_str() {
                "INCREASE_TARGET" => g.target_wins = g.wins + 1,
                "SHOW_VICTORY" => g.last_action = "META_ALCANZADA".to_string(),
                _ => {}
            }
        }
        self.broadcast_gvg(&g).await;
    }

    pub async fn set_wins(&self, wins: i32) {
        let mut g = self.gift_vs_gift.lock().await;
        g.wins = wins;
        g.last_action = "SET_WINS".to_string();
        if g.wins >= g.target_wins {
            match g.goal_action.as_str() {
                "INCREASE_TARGET" => g.target_wins = g.wins + 1,
                "SHOW_VICTORY" => g.last_action = "META_ALCANZADA".to_string(),
                _ => {}
            }
        }
        self.broadcast_gvg(&g).await;
    }

    pub async fn set_target_wins(&self, target: i32) {
        let mut g = self.gift_vs_gift.lock().await;
        g.target_wins = target.max(1);
        self.broadcast_gvg(&g).await;
    }

    pub async fn reset_wins(&self) {
        let mut g = self.gift_vs_gift.lock().await;
        g.wins = 0;
        g.last_action = "RESET_WINS".to_string();
        self.broadcast_gvg(&g).await;
    }

    pub async fn reset_ronda(&self) {
        let mut g = self.gift_vs_gift.lock().await;
        g.red_points = 0;
        g.blue_points = 0;
        g.last_action = "RESET_RONDA".to_string();
        self.broadcast_gvg(&g).await;
    }

    pub async fn add_gvg_points(&self, team: &str, points: i32) {
        let mut g = self.gift_vs_gift.lock().await;
        if team.eq_ignore_ascii_case("RED") {
            g.red_points = (g.red_points + points).max(0);
        } else {
            g.blue_points = (g.blue_points + points).max(0);
        }
        self.broadcast_gvg(&g).await;
    }

    pub async fn set_gvg_points(&self, team: &str, points: i32) {
        let mut g = self.gift_vs_gift.lock().await;
        if team.eq_ignore_ascii_case("RED") {
            g.red_points = points.max(0);
        } else {
            g.blue_points = points.max(0);
        }
        g.last_action = format!("SET_{}", team.to_ascii_uppercase());
        self.broadcast_gvg(&g).await;
    }

    pub async fn set_goal_action(&self, action: &str) {
        let mut g = self.gift_vs_gift.lock().await;
        g.goal_action = match action {
            "SHOW_VICTORY" => "SHOW_VICTORY",
            "HOLD" => "HOLD",
            _ => "INCREASE_TARGET",
        }
        .to_string();
        self.broadcast_gvg(&g).await;
    }

    pub async fn set_side_columns(&self, visible: bool) {
        let mut g = self.gift_vs_gift.lock().await;
        g.show_side_columns = visible;
        self.broadcast_gvg(&g).await;
    }

    pub async fn update_roblox_config(&self, config_json: &str) -> Result<(), String> {
        let parsed: serde_json::Value = serde_json::from_str(config_json)
            .map_err(|e| format!("JSON inválido en update_roblox_config: {}", e))?;
        let mut g = self.gift_vs_gift.lock().await;
        if let Some(tw) = parsed.get("target_wins").and_then(|v| v.as_i64()) {
            g.target_wins = (tw as i32).max(1);
        }
        if let Some(ga) = parsed.get("goal_action").and_then(|v| v.as_str()) {
            g.goal_action = match ga {
                "SHOW_VICTORY" => "SHOW_VICTORY",
                "HOLD" => "HOLD",
                _ => "INCREASE_TARGET",
            }
            .to_string();
        }
        if let Some(sc) = parsed.get("show_side_columns").and_then(|v| v.as_bool()) {
            g.show_side_columns = sc;
        }
        if let Some(crn) = parsed.get("center_red_name").and_then(|v| v.as_str()) {
            g.center_red_name = crn.to_string();
        }
        if let Some(cri) = parsed.get("center_red_icon").and_then(|v| v.as_str()) {
            g.center_red_icon = cri.to_string();
        }
        if let Some(crc) = parsed.get("center_red_coins").and_then(|v| v.as_u64()) {
            g.center_red_coins = (crc as u32).max(1);
        }
        if let Some(cbn) = parsed.get("center_blue_name").and_then(|v| v.as_str()) {
            g.center_blue_name = cbn.to_string();
        }
        if let Some(cbi) = parsed.get("center_blue_icon").and_then(|v| v.as_str()) {
            g.center_blue_icon = cbi.to_string();
        }
        if let Some(cbc) = parsed.get("center_blue_coins").and_then(|v| v.as_u64()) {
            g.center_blue_coins = (cbc as u32).max(1);
        }
        if let Some(ts) = parsed.get("theme_style").and_then(|v| v.as_str()) {
            g.theme_style = ts.to_string();
        }
        if let Some(wl) = parsed.get("win_label").and_then(|v| v.as_str()) {
            let trimmed = wl.trim();
            g.win_label = if trimmed.is_empty() {
                "WIN".to_string()
            } else {
                trimmed.to_string()
            };
        }
        if let Some(wt) = parsed.get("win_theme").and_then(|v| v.as_str()) {
            g.win_theme = wt.to_string();
        }
        if let Some(sws) = parsed.get("show_win_in_sides").and_then(|v| v.as_bool()) {
            g.show_win_in_sides = sws;
        }
        if let Some(is) = parsed.get("icon_size").and_then(|v| v.as_u64()) {
            g.icon_size = (is as u32).clamp(24, 110);
        }
        if let Some(txs) = parsed.get("text_size").and_then(|v| v.as_u64()) {
            g.text_size = (txs as u32).clamp(11, 48);
        }
        if let Some(ig) = parsed.get("item_gap").and_then(|v| v.as_u64()) {
            g.item_gap = (ig as u32).clamp(0, 36);
        }
        if let Some(sh) = parsed.get("sharpness").and_then(|v| v.as_u64()) {
            g.sharpness = (sh as u32).clamp(100, 240);
        }
        if let Some(ws) = parsed.get("win_scale").and_then(|v| v.as_u64()) {
            g.win_scale = (ws as u32).clamp(50, 200);
        }
        if let Some(ds) = parsed.get("duel_scale").and_then(|v| v.as_u64()) {
            g.duel_scale = (ds as u32).clamp(50, 200);
        }
        if let Some(lr) = parsed.get("left_rules") {
            if let Ok(rules) = serde_json::from_value::<Vec<RobloxRuleItem>>(lr.clone()) {
                g.left_rules = rules;
            }
        }
        if let Some(rr) = parsed.get("right_rules") {
            if let Ok(rules) = serde_json::from_value::<Vec<RobloxRuleItem>>(rr.clone()) {
                g.right_rules = rules;
            }
        }
        self.broadcast_gvg(&g).await;
        Ok(())
    }

    pub async fn update_mc_overlay(&self, config_json: &str) -> Result<(), String> {
        let parsed: serde_json::Value = serde_json::from_str(config_json)
            .map_err(|e| format!("JSON inválido en update_mc_overlay: {}", e))?;
        let mut mc = self.mc_overlay.lock().await;
        *mc = parsed.clone();
        let msg = serde_json::json!({
            "type": "mc_overlay",
            "mc_overlay": &*mc
        })
        .to_string();
        let _ = self.tx.send(msg);
        Ok(())
    }

    pub async fn broadcast_gvg(&self, gvg: &GiftVsGiftState) {
        let msg = serde_json::json!({
            "type": "gvg",
            "gift_vs_gift": gvg
        })
        .to_string();
        let _ = self.tx.send(msg);
    }

    pub async fn emit_gift(&self, user: &str, title: &str, coins: u32) {
        let d = self.duel.lock().await;
        let gvg = self.gift_vs_gift.lock().await;
        let mc = self.mc_overlay.lock().await;
        let msg = serde_json::json!({
            "type": "gift",
            "duel": &*d,
            "gift_vs_gift": &*gvg,
            "mc_overlay": &*mc,
            "data": {
                "user": user,
                "title": title,
                "coins": coins
            }
        })
        .to_string();
        let _ = self.tx.send(msg);
    }

    pub async fn emit_like(&self, user: &str, count: u32) {
        let d = self.duel.lock().await;
        let msg = serde_json::json!({
            "type": "like",
            "duel": &*d,
            "data": {
                "user": user,
                "count": count
            }
        })
        .to_string();
        let _ = self.tx.send(msg);
    }

    pub async fn emit_custom_alert(&self, alert_json: &str) -> Result<(), String> {
        let parsed: serde_json::Value = serde_json::from_str(alert_json)
            .map_err(|e| format!("JSON inválido en emit_custom_alert: {}", e))?;
        let d = self.duel.lock().await;
        let msg_val = if parsed.get("type").and_then(|t| t.as_str()) == Some("CUSTOM_ALERT") {
            let mut obj = parsed.clone();
            obj["duel"] = serde_json::json!(&*d);
            obj["alert"] = parsed.clone();
            obj
        } else {
            serde_json::json!({
                "type": "custom_alert",
                "duel": &*d,
                "alert": parsed
            })
        };
        let msg = msg_val.to_string();
        let _ = self.tx.send(msg);
        Ok(())
    }

    pub async fn check_visual_cooldown(&self, user: &str) -> Result<(), String> {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0);
        let mut last_global = self.last_global_alert_ms.lock().await;
        if now.saturating_sub(*last_global) < 10_000 {
            let wait_sec = (10_000 - now.saturating_sub(*last_global) + 999) / 1000;
            return Err(format!("Cooldown global activo. Espera {}s para no saturar OBS.", wait_sec));
        }
        let mut user_map = self.user_last_alert_ms.lock().await;
        let clean_user = user.trim().trim_start_matches('@').to_ascii_lowercase();
        let user_last = user_map.get(&clean_user).copied().unwrap_or(0);
        if now.saturating_sub(user_last) < 30_000 {
            let wait_sec = (30_000 - now.saturating_sub(user_last) + 999) / 1000;
            return Err(format!("Cooldown personal activo (@{}). Espera {}s.", clean_user, wait_sec));
        }
        *last_global = now;
        user_map.insert(clean_user, now);
        Ok(())
    }

    pub async fn update_session_mvp(&self, username: &str, gift_name: &str, coins: u64) {
        let mut mvp = self.session_mvp.lock().await;
        *mvp = serde_json::json!({
            "username": username,
            "giftName": gift_name,
            "coins": coins
        });
        let msg = serde_json::json!({
            "type": "NEW_SESSION_MVP",
            "data": &*mvp
        })
        .to_string();
        let _ = self.tx.send(msg);
    }
}

fn percent_decode(input: &str) -> String {
    let mut bytes = Vec::with_capacity(input.len());
    let mut chars = input.as_bytes().iter().copied();
    while let Some(b) = chars.next() {
        if b == b'%' {
            let h1 = chars.next();
            let h2 = chars.next();
            if let (Some(c1), Some(c2)) = (h1, h2) {
                let hex = [c1, c2];
                if let Ok(s) = std::str::from_utf8(&hex) {
                    if let Ok(val) = u8::from_str_radix(s, 16) {
                        bytes.push(val);
                        continue;
                    }
                }
            }
            bytes.push(b'%');
        } else {
            bytes.push(b);
        }
    }
    String::from_utf8_lossy(&bytes).to_string()
}

fn content_type_for_path(p: &str) -> &'static str {
    let lower = p.to_ascii_lowercase();
    if lower.ends_with(".mp3") {
        "audio/mpeg"
    } else if lower.ends_with(".wav") {
        "audio/wav"
    } else if lower.ends_with(".ogg") {
        "audio/ogg"
    } else if lower.ends_with(".mp4") {
        "video/mp4"
    } else if lower.ends_with(".webm") {
        "video/webm"
    } else if lower.ends_with(".gif") {
        "image/gif"
    } else if lower.ends_with(".png") {
        "image/png"
    } else if lower.ends_with(".jpg") || lower.ends_with(".jpeg") {
        "image/jpeg"
    } else {
        "image/webp"
    }
}

fn is_giant_rose_gift(name: &str, coins: i32) -> bool {
    let n = name.to_ascii_lowercase();
    n.contains("gigante")
        || n.contains("giant")
        || n == "rosa (10)"
        || n == "rosa 10"
        || (n.contains("rosa") && coins == 10)
}

fn is_super_gg_gift(name: &str, coins: i32) -> bool {
    let n = name.to_ascii_lowercase();
    n.contains("super gg")
        || n.contains("supergg")
        || n.contains("súper gg")
        || (n == "gg" && coins >= 100)
}

fn is_rose_gift(name: &str, gift_id: u64, coins: i32) -> bool {
    if is_giant_rose_gift(name, coins) {
        return false;
    }
    if gift_id == 5655 {
        return true;
    }
    let n = name.to_ascii_lowercase();
    n == "rose"
        || n == "rosa"
        || n == "rosa roja"
        || n == "red rose"
        || n == "rosa oscura"
        || n == "rosa de luz"
        || n.contains("(rosa)")
        || n.contains("(rose)")
        || n.contains("empuje rojo")
        || n.starts_with("rose ")
        || n.starts_with("rosa ")
        || n.ends_with(" rose")
        || n.ends_with(" rosa")
        || n.split(|c: char| !c.is_alphanumeric())
            .any(|w| w == "rose" || w == "rosa")
}

fn is_gg_gift(name: &str, gift_id: u64, coins: i32) -> bool {
    if is_super_gg_gift(name, coins) {
        return false;
    }
    if gift_id == 6064 || gift_id == 6093 || gift_id == 7214 {
        return true;
    }
    let n = name.to_ascii_lowercase();
    n == "gg"
        || n.starts_with("gg ")
        || n.ends_with(" gg")
        || n.contains("(gg)")
        || n.contains("empuje azul")
        || n == "gg bendicion"
        || n == "gg 2025"
        || n.split(|c: char| !c.is_alphanumeric()).any(|w| w == "gg")
}

fn matches_gift_rule(
    rule_gift: &str,
    rule_coins: u32,
    incoming_name: &str,
    incoming_id: u64,
    incoming_coins: i32,
) -> bool {
    let r = rule_gift.trim().to_ascii_lowercase();
    let i = incoming_name.trim().to_ascii_lowercase();
    if r.is_empty() || i.is_empty() {
        return false;
    }

    // 1. Rosa básica (1 moneda) vs regalos compuestos (ej: Bear with Rose de 400 coins):
    if (i == "rose" || i == "rosa" || incoming_id == 5655) && incoming_coins <= 1 {
        return (r == "rose" || r == "rosa") && rule_coins <= 1;
    }
    if (r == "rose" || r == "rosa") && rule_coins <= 1 {
        return (i == "rose" || i == "rosa" || incoming_id == 5655) && incoming_coins <= 1;
    }

    // 2. GG básico (1 moneda) vs regalos compuestos:
    if (i == "gg" || incoming_id == 6064 || incoming_id == 6093 || incoming_id == 7214)
        && incoming_coins <= 1
    {
        return r == "gg" && rule_coins <= 1;
    }
    if r == "gg" && rule_coins <= 1 {
        return (i == "gg" || incoming_id == 6064 || incoming_id == 6093 || incoming_id == 7214)
            && incoming_coins <= 1;
    }

    // 3. Super GG (100 monedas):
    let r_is_super_gg = r.contains("super gg") || r.contains("supergg") || r.contains("súper gg");
    let i_is_super_gg = is_super_gg_gift(incoming_name, incoming_coins);
    if r_is_super_gg {
        return i_is_super_gg;
    }
    if i_is_super_gg {
        return false;
    }

    // 4. Rosa Gigante (10 monedas):
    let r_is_giant_rose =
        r.contains("gigante") || r.contains("giant") || (r.contains("rosa") && rule_coins == 10);
    let i_is_giant_rose = is_giant_rose_gift(incoming_name, incoming_coins);
    if r_is_giant_rose {
        return i_is_giant_rose;
    }
    if i_is_giant_rose {
        return false;
    }

    let clean_r = r.split('(').next().unwrap_or("").trim();
    let clean_i = i.split('(').next().unwrap_or("").trim();

    if clean_r == clean_i || r == i {
        return true;
    }

    // Traducciones y alias frecuentes de regalos de victorias y duelos
    let is_same_alias = match clean_r {
        "cruiser" | "crucero" | "barco" | "yate" => {
            clean_i == "cruiser" || clean_i == "crucero" || clean_i == "barco" || clean_i == "yate"
        }
        "coral" => clean_i == "coral",
        "falcon" | "halcon" | "halcón" | "aguila" => {
            clean_i == "falcon" || clean_i == "halcon" || clean_i == "halcón" || clean_i == "aguila"
        }
        "lion" | "leon" | "león" => clean_i == "lion" || clean_i == "leon" || clean_i == "león",
        "bear with rose" | "oso con rosa" | "bear" | "oso" => {
            clean_i.contains("bear") || clean_i.contains("oso")
        }
        "fireworks" | "fuegos artificiales" | "fuegos" => {
            clean_i.contains("firework") || clean_i.contains("fuego")
        }
        _ => false,
    };
    if is_same_alias {
        return true;
    }

    let min_len = clean_r.len().min(clean_i.len());
    if min_len >= 3 && (clean_r.contains(clean_i) || clean_i.contains(clean_r)) {
        return true;
    }

    false
}

pub fn start_overlay_http_server(state: Arc<OverlayServerState>) {
    std::thread::spawn(move || {
        let rt = match tokio::runtime::Builder::new_multi_thread()
            .enable_all()
            .build()
        {
            Ok(r) => r,
            Err(e) => {
                eprintln!("[OVERLAY] Error al inicializar runtime de Tokio: {}", e);
                return;
            }
        };

        rt.block_on(async move {
            let mut attempts = 0;
            let listener = loop {
                match TcpListener::bind("0.0.0.0:4000").await {
                    Ok(l) => break l,
                    Err(_) => match TcpListener::bind("127.0.0.1:4000").await {
                        Ok(l) => break l,
                        Err(e2) => {
                            attempts += 1;
                            if attempts >= 20 {
                                eprintln!(
                                    "[OVERLAY] Fallo definitivo al vincular puerto 4000: {}",
                                    e2
                                );
                                return;
                            }
                            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
                        }
                    },
                }
            };

            loop {
                if let Ok((stream, _)) = listener.accept().await {
                    let st = Arc::clone(&state);
                    tokio::spawn(async move {
                        handle_connection(stream, st).await;
                    });
                }
            }
        });
    });
}

async fn handle_connection(mut stream: TcpStream, state: Arc<OverlayServerState>) {
    let _ = stream.set_nodelay(true);
    let mut buffer = [0u8; 4096];
    let n = match stream.read(&mut buffer).await {
        Ok(n) if n > 0 => n,
        _ => return,
    };

    let req_str = String::from_utf8_lossy(&buffer[..n]);
    let first_line = req_str.lines().next().unwrap_or("");
    let parts: Vec<&str> = first_line.split_whitespace().collect();
    if parts.len() < 2 {
        return;
    }

    let method = parts[0];
    let path = parts[1].split('?').next().unwrap_or("/");

    if method == "OPTIONS" {
        let response = "HTTP/1.1 200 OK\r\n\
Access-Control-Allow-Origin: *\r\n\
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS\r\n\
Access-Control-Allow-Headers: Content-Type, Range\r\n\
Content-Length: 0\r\n\r\n";
        let _ = stream.write_all(response.as_bytes()).await;
        return;
    }

    if path.starts_with("/s2e_media/") {
        let raw_rel = path.trim_start_matches("/s2e_media/");
        let decoded_rel = percent_decode(raw_rel).replace('\\', "/");
        if !decoded_rel.contains("..") {
            let base_dir = crate::asset_sync::resolve_s2e_media_dir();
            let mut file_path = base_dir.join(decoded_rel.replace('/', "\\"));
            if !file_path.exists() && decoded_rel.starts_with("custom/") {
                let custom_name = decoded_rel.trim_start_matches("custom/");
                let alt_custom = crate::asset_sync::resolve_custom_media_dir().join(custom_name);
                if alt_custom.exists() {
                    file_path = alt_custom;
                }
            }
            if !file_path.exists() && decoded_rel.starts_with("audio/public/") {
                let _ = crate::asset_sync::ensure_sound_downloaded(&decoded_rel).await;
            }
            if file_path.exists() {
                if let Ok(bytes) = tokio::fs::read(&file_path).await {
                    let ctype = content_type_for_path(&decoded_rel);
                    let header = format!(
                        "HTTP/1.1 200 OK\r\n\
Access-Control-Allow-Origin: *\r\n\
Accept-Ranges: bytes\r\n\
Content-Type: {}\r\n\
Cache-Control: public, max-age=86400\r\n\
Content-Length: {}\r\n\
Connection: close\r\n\r\n",
                        ctype,
                        bytes.len()
                    );
                    let _ = stream.write_all(header.as_bytes()).await;
                    let _ = stream.write_all(&bytes).await;
                    return;
                }
            }
        }
    }

    if path.starts_with("/gifts/") {
        let decoded = percent_decode(path.trim_start_matches("/gifts/"));
        let filename = decoded
            .trim_start_matches("gifts/")
            .trim_start_matches("/gifts/");
        if !filename.contains("..") {
            let file_path = crate::asset_sync::resolve_gifts_dir().join(filename);
            if file_path.exists() {
                if let Ok(bytes) = tokio::fs::read(&file_path).await {
                    let header = format!(
                        "HTTP/1.1 200 OK\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: image/webp\r\n\
Cache-Control: public, max-age=86400\r\n\
Content-Length: {}\r\n\
Connection: close\r\n\r\n",
                        bytes.len()
                    );
                    let _ = stream.write_all(header.as_bytes()).await;
                    let _ = stream.write_all(&bytes).await;
                    return;
                }
            }
        }
    }

    fn load_template(filename: &str, embedded: &'static str) -> String {
        let dev_path = std::path::PathBuf::from(r"C:\Proyectos\GalacticLive\src-tauri\templates")
            .join(filename);
        if let Ok(content) = std::fs::read_to_string(&dev_path) {
            return content;
        }
        embedded.to_string()
    }

    match path {
        "/"
        | "/gift-vs-gift"
        | "/gift-vs-gift.html"
        | "/duelo.html"
        | "/roblox.html"
        | "/villanos-heroes.html"
        | "/roblox-lados.html"
        | "/rosas-vs-ggs.html"
        | "/wins.html"
        | "/win.html"
        | "/villanos.html"
        | "/heroes.html" => {
            let body = load_template(
                "gift-vs-gift.html",
                include_str!("../templates/gift-vs-gift.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/galactic-gp" | "/galactic-gp.html" => {
            let body = load_template(
                "galactic-gp.html",
                include_str!("../templates/galactic-gp.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/mc_overlay.html" | "/mc_carrusel.html" | "/mc_estatico.html" | "/mc_plano.html" => {
            let body = load_template(
                "mc_overlay.html",
                include_str!("../templates/mc_overlay.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/mvp.html" => {
            let body = load_template("mvp.html", include_str!("../templates/mvp.html"));
            send_html_response(&mut stream, &body).await;
        }
        "/top_rotativo.html" | "/metas.html" | "/racha.html" => {
            let body = load_template(
                "top_rotativo.html",
                include_str!("../templates/top_rotativo.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/contador.html" => {
            let body = load_template("contador.html", include_str!("../templates/contador.html"));
            send_html_response(&mut stream, &body).await;
        }
        "/alerta.html" => {
            let body = load_template("alerta.html", include_str!("../templates/alerta.html"));
            send_html_response(&mut stream, &body).await;
        }
        "/gift_mappings.json" => {
            let file_path = std::path::PathBuf::from(r"C:\Proyectos\GalacticLive\gift_mappings.json");
            if let Ok(content) = std::fs::read_to_string(&file_path) {
                send_json_response(&mut stream, &content).await;
            } else {
                send_json_response(&mut stream, "{}").await;
            }
        }
        "/cronometro.html" => {
            let body = load_template(
                "cronometro.html",
                include_str!("../templates/cronometro.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/top_donadores.html" => {
            let body = load_template(
                "top_donadores.html",
                include_str!("../templates/top_donadores.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/top_likes.html" => {
            let body = load_template("top_likes.html", include_str!("../templates/top_likes.html"));
            send_html_response(&mut stream, &body).await;
        }
        "/overlay-top.html" | "/overlay-top" => {
            let body = load_template(
                "overlay-top.html",
                include_str!("../templates/overlay-top.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/overlay_hud.html" | "/overlay_hud" | "/hud.html" | "/hud" => {
            let body = load_template(
                "overlay_hud.html",
                include_str!("../templates/overlay_hud.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/overlay_cinematic.html" | "/overlay_cinematic" | "/cinematic.html" | "/cinematic" => {
            let body = load_template(
                "overlay_cinematic.html",
                include_str!("../templates/overlay_cinematic.html"),
            );
            send_html_response(&mut stream, &body).await;
        }
        "/api/estado" => {
            let d = state.duel.lock().await;
            let gvg = state.gift_vs_gift.lock().await;
            let mc = state.mc_overlay.lock().await;
            let body = serde_json::json!({
                "duel": &*d,
                "gift_vs_gift": &*gvg,
                "mc_overlay": &*mc
            })
            .to_string();
            send_json_response(&mut stream, &body).await;
        }
        "/api/gvg/control" if method == "POST" => {
            let raw_body = req_str
                .split_once("\r\n\r\n")
                .map(|(_, b)| b)
                .unwrap_or("")
                .trim();
            match serde_json::from_str::<serde_json::Value>(raw_body) {
                Ok(payload) => {
                    let action = payload.get("action").and_then(|v| v.as_str()).unwrap_or("");
                    let value = payload.get("value").and_then(|v| v.as_i64()).unwrap_or(0) as i32;
                    let team = payload
                        .get("team")
                        .and_then(|v| v.as_str())
                        .unwrap_or("RED");
                    match action {
                        "add_points" => state.add_gvg_points(team, value).await,
                        "set_points" => state.set_gvg_points(team, value).await,
                        "add_wins" => state.modify_win(value).await,
                        "set_wins" => state.set_wins(value).await,
                        "set_target" => state.set_target_wins(value).await,
                        "reset_points" => state.reset_ronda().await,
                        "reset_wins" => state.reset_wins().await,
                        "set_goal_action" => {
                            state
                                .set_goal_action(
                                    payload
                                        .get("goal_action")
                                        .and_then(|v| v.as_str())
                                        .unwrap_or("INCREASE_TARGET"),
                                )
                                .await
                        }
                        "set_side_columns" => {
                            state
                                .set_side_columns(
                                    payload
                                        .get("visible")
                                        .and_then(|v| v.as_bool())
                                        .unwrap_or(true),
                                )
                                .await
                        }
                        _ => {
                            send_json_response(
                                &mut stream,
                                r#"{"ok":false,"error":"Acción de control no permitida"}"#,
                            )
                            .await;
                            return;
                        }
                    }
                    send_json_response(&mut stream, r#"{"ok":true}"#).await;
                }
                Err(_) => {
                    send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await
                }
            }
        }
        "/api/roles" => {
            if method == "POST" {
                let raw_body = req_str
                    .split_once("\r\n\r\n")
                    .map(|(_, b)| b)
                    .unwrap_or("")
                    .trim();
                match serde_json::from_str::<serde_json::Value>(raw_body) {
                    Ok(payload) => {
                        let mut r = state.roles.lock().await;
                        *r = payload.clone();
                        let _ = std::fs::write(
                            r"C:\Proyectos\GalacticLive\roles.json",
                            serde_json::to_string_pretty(&payload).unwrap_or_default(),
                        );
                        let update_msg = serde_json::json!({
                            "type": "roles_updated",
                            "roles": payload
                        })
                        .to_string();
                        let _ = state.tx.send(update_msg);
                        send_json_response(&mut stream, r#"{"ok":true}"#).await;
                    }
                    Err(_) => {
                        send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                    }
                }
            } else {
                let r = state.roles.lock().await;
                send_json_response(&mut stream, &r.to_string()).await;
            }
        }
        "/api/music/queue" => {
            if method == "POST" {
                let raw_body = req_str
                    .split_once("\r\n\r\n")
                    .map(|(_, b)| b)
                    .unwrap_or("")
                    .trim();
                match serde_json::from_str::<serde_json::Value>(raw_body) {
                    Ok(track) => {
                        let dur = track.get("duration").and_then(|v| v.as_u64()).unwrap_or(0);
                        if dur > 300 {
                            send_json_response(
                                &mut stream,
                                r#"{"ok":false,"error":"La canción supera el límite de 5 minutos permitidos."}"#,
                            )
                            .await;
                            return;
                        }
                        let mut q = state.song_queue.lock().await;
                        q.push(track.clone());
                        let np = state.now_playing.lock().await;
                        let msg = serde_json::json!({
                            "type": "music_queue_update",
                            "queue": &*q,
                            "now_playing": &*np
                        })
                        .to_string();
                        let _ = state.tx.send(msg);
                        let resp = serde_json::json!({
                            "ok": true,
                            "track": track,
                            "position": q.len()
                        })
                        .to_string();
                        send_json_response(&mut stream, &resp).await;
                    }
                    Err(_) => {
                        send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                    }
                }
            } else if method == "DELETE" {
                let mut q = state.song_queue.lock().await;
                q.clear();
                let np = state.now_playing.lock().await;
                let msg = serde_json::json!({
                    "type": "music_queue_update",
                    "queue": &*q,
                    "now_playing": &*np
                })
                .to_string();
                let _ = state.tx.send(msg);
                send_json_response(&mut stream, r#"{"ok":true,"queue":[]}"#).await;
            } else {
                let q = state.song_queue.lock().await;
                let np = state.now_playing.lock().await;
                let body = serde_json::json!({
                    "now_playing": &*np,
                    "queue": &*q
                })
                .to_string();
                send_json_response(&mut stream, &body).await;
            }
        }
        "/api/music/control" if method == "POST" => {
            let raw_body = req_str
                .split_once("\r\n\r\n")
                .map(|(_, b)| b)
                .unwrap_or("")
                .trim();
            match serde_json::from_str::<serde_json::Value>(raw_body) {
                Ok(payload) => {
                    let action = payload.get("action").and_then(|v| v.as_str()).unwrap_or("skip");
                    let value = payload.get("value").cloned();
                    let msg = serde_json::json!({
                        "type": "music_control",
                        "action": action,
                        "value": value
                    })
                    .to_string();
                    let _ = state.tx.send(msg);
                    send_json_response(&mut stream, r#"{"ok":true}"#).await;
                }
                Err(_) => {
                    send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                }
            }
        }
        "/api/music/now-playing" => {
            if method == "POST" {
                let raw_body = req_str
                    .split_once("\r\n\r\n")
                    .map(|(_, b)| b)
                    .unwrap_or("")
                    .trim();
                match serde_json::from_str::<serde_json::Value>(raw_body) {
                    Ok(payload) => {
                        let track = payload.get("track").cloned().unwrap_or(serde_json::Value::Null);
                        let mut np = state.now_playing.lock().await;
                        *np = if track.is_null() { None } else { Some(track.clone()) };
                        let msg = serde_json::json!({
                            "type": "now_playing",
                            "track": track
                        })
                        .to_string();
                        let _ = state.tx.send(msg);
                        send_json_response(&mut stream, r#"{"ok":true}"#).await;
                    }
                    Err(_) => {
                        send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                    }
                }
            } else {
                let np = state.now_playing.lock().await;
                let body = serde_json::json!({ "now_playing": &*np }).to_string();
                send_json_response(&mut stream, &body).await;
            }
        }
        "/api/top-settings" => {
            if method == "POST" {
                let raw_body = req_str
                    .split_once("\r\n\r\n")
                    .map(|(_, b)| b)
                    .unwrap_or("")
                    .trim();
                match serde_json::from_str::<serde_json::Value>(raw_body) {
                    Ok(payload) => {
                        let mut s = state.top_settings.lock().await;
                        *s = payload.clone();
                        let update_msg = serde_json::json!({
                            "type": "top_settings",
                            "settings": payload
                        })
                        .to_string();
                        let _ = state.tx.send(update_msg);
                        send_json_response(&mut stream, r#"{"ok":true}"#).await;
                    }
                    Err(_) => {
                        send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                    }
                }
            } else {
                let s = state.top_settings.lock().await;
                send_json_response(&mut stream, &s.to_string()).await;
            }
        }
        "/api/session-mvp" => {
            if method == "POST" {
                let raw_body = req_str
                    .split_once("\r\n\r\n")
                    .map(|(_, b)| b)
                    .unwrap_or("")
                    .trim();
                match serde_json::from_str::<serde_json::Value>(raw_body) {
                    Ok(payload) => {
                        let username = payload.get("username").and_then(|v| v.as_str()).unwrap_or("Nadie aún");
                        let gift_name = payload.get("giftName").and_then(|v| v.as_str()).unwrap_or("");
                        let coins = payload.get("coins").and_then(|v| v.as_u64()).unwrap_or(0);
                        state.update_session_mvp(username, gift_name, coins).await;
                        send_json_response(&mut stream, r#"{"ok":true}"#).await;
                    }
                    Err(_) => {
                        send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                    }
                }
            } else {
                let m = state.session_mvp.lock().await;
                send_json_response(&mut stream, &m.to_string()).await;
            }
        }
        "/api/alerta/trigger" if method == "POST" => {
            let raw_body = req_str
                .split_once("\r\n\r\n")
                .map(|(_, b)| b)
                .unwrap_or("")
                .trim();
            match serde_json::from_str::<serde_json::Value>(raw_body) {
                Ok(payload) => {
                    let is_custom_alert = payload.get("type").and_then(|v| v.as_str()) == Some("CUSTOM_ALERT");
                    let skip_cd = payload.get("skip_cooldown").and_then(|v| v.as_bool()).unwrap_or(false) || is_custom_alert;
                    let user = payload
                        .get("user")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Viewer");
                    if !skip_cd {
                        if let Err(cd_err) = state.check_visual_cooldown(user).await {
                            let err_body = serde_json::json!({
                                "ok": false,
                                "error": cd_err
                            })
                            .to_string();
                            send_json_response(&mut stream, &err_body).await;
                            return;
                        }
                    }
                    let alert_data = payload.get("alert").cloned().unwrap_or(payload.clone());
                    let d = state.duel.lock().await;
                    let msg = serde_json::json!({
                        "type": if is_custom_alert { "CUSTOM_ALERT" } else { "custom_alert" },
                        "duel": &*d,
                        "alert": alert_data
                    })
                    .to_string();
                    let _ = state.tx.send(msg);
                    send_json_response(&mut stream, r#"{"ok":true}"#).await;
                }
                Err(_) => {
                    send_json_response(&mut stream, r#"{"ok":false,"error":"JSON inválido"}"#).await;
                }
            }
        }
        "/api/tiktok-webhook" => {
            if let Some(body_idx) = req_str.find("\r\n\r\n") {
                let mut raw_body = req_str[body_idx + 4..].to_string();
                if raw_body.trim().is_empty() {
                    let mut extra = [0u8; 4096];
                    if let Ok(n2) = stream.read(&mut extra).await {
                        if n2 > 0 {
                            raw_body = String::from_utf8_lossy(&extra[..n2]).to_string();
                        }
                    }
                }
                if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(raw_body.trim()) {
                    let ev_name = parsed
                        .get("event")
                        .and_then(|v| v.as_str())
                        .unwrap_or("gift");
                    let ev_data = parsed.get("data").cloned().unwrap_or(serde_json::json!({}));

                    if ev_name == "gift" {
                        let gift_name = ev_data
                            .get("giftName")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .trim();
                        let gift_id = ev_data.get("giftId").and_then(|v| v.as_u64()).unwrap_or(0);
                        let repeat_count = ev_data
                            .get("repeatCount")
                            .and_then(|v| v.as_i64())
                            .unwrap_or(1)
                            .max(1) as i32;
                        let mut diamond_count = ev_data
                            .get("diamondCount")
                            .and_then(|v| v.as_i64())
                            .unwrap_or(1)
                            .max(1) as i32;

                        let lower_n = gift_name.to_ascii_lowercase();
                        if lower_n.contains("gigante")
                            || lower_n.contains("giant rose")
                            || lower_n == "rosa gigante"
                            || lower_n == "rosa 10"
                            || lower_n == "rosa (10)"
                        {
                            if diamond_count <= 1 {
                                diamond_count = 10;
                            }
                        } else if lower_n.contains("super gg")
                            || lower_n.contains("supergg")
                            || lower_n.contains("súper gg")
                        {
                            if diamond_count <= 1 {
                                diamond_count = 100;
                            }
                        }

                        let mut g = state.gift_vs_gift.lock().await;
                        let mut handled = false;

                        // 1. PRIORIDAD: REGLAS LATERALES (Héroes y Villanos)
                        // Si el regalo donado está en la lista de reglas (ej: Rosa Gigante L2, Super GG R4, etc.)
                        let mut lateral_match = None;
                        for r in &g.left_rules {
                            if matches_gift_rule(
                                &r.gift_name,
                                r.coins,
                                gift_name,
                                gift_id,
                                diamond_count,
                            ) {
                                lateral_match = Some((
                                    "LEFT",
                                    r.action_type.clone(),
                                    r.value,
                                    r.coins,
                                    r.label.clone(),
                                ));
                                break;
                            }
                        }
                        if lateral_match.is_none() {
                            for r in &g.right_rules {
                                if matches_gift_rule(
                                    &r.gift_name,
                                    r.coins,
                                    gift_name,
                                    gift_id,
                                    diamond_count,
                                ) {
                                    lateral_match = Some((
                                        "RIGHT",
                                        r.action_type.clone(),
                                        r.value,
                                        r.coins,
                                        r.label.clone(),
                                    ));
                                    break;
                                }
                            }
                        }

                        if let Some((side, action_type, value, rule_coins, rule_label)) =
                            lateral_match
                        {
                            let is_win_action = action_type.eq_ignore_ascii_case("WIN")
                                || rule_label.to_ascii_uppercase().contains("WIN")
                                || rule_label.to_ascii_uppercase().contains("VIC");
                            if is_win_action {
                                let effective_val = if value != 0 {
                                    value
                                } else {
                                    let clean_lbl = rule_label
                                        .to_ascii_uppercase()
                                        .replace("WIN", "")
                                        .replace("VIC", "")
                                        .trim()
                                        .to_string();
                                    clean_lbl.parse::<i32>().unwrap_or(if side == "LEFT" {
                                        -1
                                    } else {
                                        1
                                    })
                                };
                                g.wins += effective_val * repeat_count;
                                g.last_action = format!("{:+}", effective_val * repeat_count);
                                if g.wins >= g.target_wins {
                                    match g.goal_action.as_str() {
                                        "INCREASE_TARGET" => g.target_wins = g.wins + 1,
                                        "SHOW_VICTORY" => {
                                            g.last_action = "META_ALCANZADA".to_string()
                                        }
                                        _ => {}
                                    }
                                }
                            } else {
                                let pts_each = if value != 0 {
                                    value.abs()
                                } else if rule_coins > 0 {
                                    rule_coins as i32
                                } else {
                                    diamond_count
                                };
                                let total_pts = pts_each * repeat_count;
                                if side == "LEFT" {
                                    g.red_points = (g.red_points + total_pts).max(0);
                                    g.last_action = format!("+{} RED", total_pts);
                                } else {
                                    g.blue_points = (g.blue_points + total_pts).max(0);
                                    g.last_action = format!("+{} BLUE", total_pts);
                                }
                            }
                            handled = true;
                        }

                        // 2. REGALOS CENTRALES (Rosa vs GG)
                        // - Rosa normal (1 moneda) = +1 punto por cada rosa (repeat_count * 1)
                        // - GG normal (1 moneda) = +1 punto por cada GG (repeat_count * 1)
                        // - Rosa Gigante = 10 puntos por cada rosa gigante
                        // - Super GG = 100 puntos por cada super gg
                        if !handled {
                            if is_rose_gift(gift_name, gift_id, diamond_count)
                                || matches_gift_rule(
                                    &g.center_red_name,
                                    g.center_red_coins,
                                    gift_name,
                                    gift_id,
                                    diamond_count,
                                )
                            {
                                let coins_each = if diamond_count > 1 {
                                    diamond_count
                                } else {
                                    (g.center_red_coins as i32).max(1)
                                };
                                let pts = repeat_count * coins_each;
                                g.red_points = (g.red_points + pts).max(0);
                                g.last_action = format!("+{} RED", pts);
                            } else if is_gg_gift(gift_name, gift_id, diamond_count)
                                || matches_gift_rule(
                                    &g.center_blue_name,
                                    g.center_blue_coins,
                                    gift_name,
                                    gift_id,
                                    diamond_count,
                                )
                            {
                                let coins_each = if diamond_count > 1 {
                                    diamond_count
                                } else {
                                    (g.center_blue_coins as i32).max(1)
                                };
                                let pts = repeat_count * coins_each;
                                g.blue_points = (g.blue_points + pts).max(0);
                                g.last_action = format!("+{} BLUE", pts);
                            } else if is_giant_rose_gift(gift_name, diamond_count) {
                                let pts = repeat_count * diamond_count.max(10);
                                g.red_points = (g.red_points + pts).max(0);
                                g.last_action = format!("+{} RED", pts);
                            } else if is_super_gg_gift(gift_name, diamond_count) {
                                let pts = repeat_count * diamond_count.max(100);
                                g.blue_points = (g.blue_points + pts).max(0);
                                g.last_action = format!("+{} BLUE", pts);
                            }
                        }

                        let gvg_copy = g.clone();
                        drop(g);
                        state.broadcast_gvg(&gvg_copy).await;

                        let msg = serde_json::json!({
                            "type": "tiktok_event",
                            "event": ev_name,
                            "data": ev_data
                        })
                        .to_string();
                        let _ = state.tx.send(msg);

                        let resp_body = serde_json::json!({
                            "ok": true,
                            "giftName": gift_name,
                            "repeatCount": repeat_count,
                            "diamondCount": diamond_count,
                            "ruleType": if handled { "LATERAL" } else { "CENTRAL" },
                            "redPoints": gvg_copy.red_points,
                            "bluePoints": gvg_copy.blue_points,
                            "wins": gvg_copy.wins,
                            "lastAction": gvg_copy.last_action
                        })
                        .to_string();
                        send_json_response(&mut stream, &resp_body).await;
                        return;
                    }

                    let msg = serde_json::json!({
                        "type": "tiktok_event",
                        "event": ev_name,
                        "data": ev_data
                    })
                    .to_string();
                    let _ = state.tx.send(msg);
                }
            }
            send_json_response(&mut stream, r#"{"ok":true}"#).await;
        }
        "/api/eventos" => {
            handle_sse_stream(stream, state).await;
        }
        "/api/test-gift" => {
            if let Some(body_idx) = req_str.find("\r\n\r\n") {
                let mut raw_body = req_str[body_idx + 4..].to_string();
                if raw_body.trim().is_empty() {
                    let mut extra = [0u8; 4096];
                    if let Ok(n2) = stream.read(&mut extra).await {
                        if n2 > 0 {
                            raw_body = String::from_utf8_lossy(&extra[..n2]).to_string();
                        }
                    }
                }
                if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(raw_body.trim()) {
                    let gift_name = parsed
                        .get("giftName")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Rose")
                        .trim();
                    let coins = parsed
                        .get("coins")
                        .and_then(|v| v.as_i64())
                        .unwrap_or(1)
                        .max(1) as i32;
                    let repeat_count = parsed
                        .get("repeatCount")
                        .and_then(|v| v.as_i64())
                        .unwrap_or(1)
                        .max(1) as i32;
                    let donor = parsed
                        .get("donor")
                        .and_then(|v| v.as_str())
                        .unwrap_or("Tester")
                        .trim();
                    let side = parsed
                        .get("side")
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .trim()
                        .to_ascii_uppercase();

                    let mut g = state.gift_vs_gift.lock().await;
                    let pts = coins * repeat_count;

                    if side == "LEFT"
                        || is_rose_gift(gift_name, 5655, coins)
                        || gift_name.eq_ignore_ascii_case(&g.center_red_name)
                    {
                        g.red_points = (g.red_points + pts).max(0);
                        g.last_action = format!("+{} RED ({})", pts, donor);
                    } else if side == "RIGHT"
                        || is_gg_gift(gift_name, 6064, coins)
                        || gift_name.eq_ignore_ascii_case(&g.center_blue_name)
                    {
                        g.blue_points = (g.blue_points + pts).max(0);
                        g.last_action = format!("+{} BLUE ({})", pts, donor);
                    } else if side == "RESET" {
                        g.red_points = 0;
                        g.blue_points = 0;
                        g.last_action = "RESET TOTAL".to_string();
                    } else {
                        g.red_points = (g.red_points + pts).max(0);
                        g.last_action = format!("+{} RED", pts);
                    }

                    let gvg_copy = g.clone();
                    drop(g);
                    state.broadcast_gvg(&gvg_copy).await;

                    let tiktok_evt = serde_json::json!({
                        "type": "tiktok_event",
                        "event": "gift",
                        "data": {
                            "giftName": gift_name,
                            "diamondCount": coins,
                            "repeatCount": repeat_count,
                            "uniqueId": donor,
                            "nickname": donor
                        }
                    })
                    .to_string();
                    let _ = state.tx.send(tiktok_evt);

                    let resp = serde_json::json!({
                        "ok": true,
                        "redPoints": gvg_copy.red_points,
                        "bluePoints": gvg_copy.blue_points,
                        "wins": gvg_copy.wins,
                        "lastAction": gvg_copy.last_action
                    })
                    .to_string();
                    send_json_response(&mut stream, &resp).await;
                    return;
                }
            }
            send_json_response(&mut stream, r#"{"ok":false,"error":"Invalid payload"}"#).await;
        }
        _ => {
            let response = "HTTP/1.1 404 Not Found\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: text/plain\r\n\
Content-Length: 9\r\n\r\nNot Found";
            let _ = stream.write_all(response.as_bytes()).await;
        }
    }
}

async fn send_html_response(stream: &mut TcpStream, body: &str) {
    let bytes = body.as_bytes();
    let header = format!(
        "HTTP/1.1 200 OK\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: text/html; charset=utf-8\r\n\
Content-Length: {}\r\n\
Connection: close\r\n\r\n",
        bytes.len()
    );
    let _ = stream.write_all(header.as_bytes()).await;
    let _ = stream.write_all(bytes).await;
}

async fn send_json_response(stream: &mut TcpStream, body: &str) {
    let bytes = body.as_bytes();
    let header = format!(
        "HTTP/1.1 200 OK\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: application/json; charset=utf-8\r\n\
Content-Length: {}\r\n\
Connection: close\r\n\r\n",
        bytes.len()
    );
    let _ = stream.write_all(header.as_bytes()).await;
    let _ = stream.write_all(bytes).await;
}

async fn handle_sse_stream(mut stream: TcpStream, state: Arc<OverlayServerState>) {
    let _ = stream.set_nodelay(true);
    let header = "HTTP/1.1 200 OK\r\n\
Access-Control-Allow-Origin: *\r\n\
Content-Type: text/event-stream\r\n\
Cache-Control: no-cache\r\n\
Connection: keep-alive\r\n\r\n";
    if stream.write_all(header.as_bytes()).await.is_err() {
        return;
    }
    let _ = stream.flush().await;

    let init_json = {
        let d = state.duel.lock().await;
        let gvg = state.gift_vs_gift.lock().await;
        let mc = state.mc_overlay.lock().await;
        let np = state.now_playing.lock().await;
        let tops = state.top_settings.lock().await;
        let mvp = state.session_mvp.lock().await;
        serde_json::json!({
            "type": "init",
            "duel": &*d,
            "gift_vs_gift": &*gvg,
            "mc_overlay": &*mc,
            "now_playing": &*np,
            "top_settings": &*tops,
            "session_mvp": &*mvp
        })
        .to_string()
    };
    let initial_msg = format!("data: {}\n\n", init_json);
    if stream.write_all(initial_msg.as_bytes()).await.is_err() {
        return;
    }
    let _ = stream.flush().await;

    let mut rx = state.tx.subscribe();
    loop {
        match rx.recv().await {
            Ok(msg) => {
                let packet = format!("data: {}\n\n", msg);
                if stream.write_all(packet.as_bytes()).await.is_err() {
                    break;
                }
                let _ = stream.flush().await;
            }
            Err(broadcast::error::RecvError::Lagged(_)) => continue,
            Err(_) => break,
        }
    }
}
