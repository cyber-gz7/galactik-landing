use serde::{Deserialize, Serialize};
use std::fs;
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::Mutex;

const CREATE_NO_WINDOW: u32 = 0x08000000;

const K_SHARD_A: [u8; 16] = [
    0x47 ^ 0xA5,
    0x5A ^ 0xA5,
    0x37 ^ 0xA5,
    0x5F ^ 0xA5,
    0x4D ^ 0xA5,
    0x41 ^ 0xA5,
    0x53 ^ 0xA5,
    0x54 ^ 0xA5,
    0x45 ^ 0xA5,
    0x52 ^ 0xA5,
    0x5F ^ 0xA5,
    0x32 ^ 0xA5,
    0x30 ^ 0xA5,
    0x32 ^ 0xA5,
    0x36 ^ 0xA5,
    0x21 ^ 0xA5,
];

const K_SHARD_B: [u8; 16] = [
    0x43 ^ 0x5A,
    0x4A ^ 0x5A,
    0x37 ^ 0x5A,
    0x54 ^ 0x5A,
    0x45 ^ 0x5A,
    0x43 ^ 0x5A,
    0x5F ^ 0x5A,
    0x53 ^ 0x5A,
    0x45 ^ 0x5A,
    0x43 ^ 0x5A,
    0x5F ^ 0x5A,
    0x4B ^ 0x5A,
    0x45 ^ 0x5A,
    0x59 ^ 0x5A,
    0x39 ^ 0x5A,
    0x39 ^ 0x5A,
];

fn assemble_master_secret() -> Vec<u8> {
    let mut out = Vec::with_capacity(32);
    for b in K_SHARD_A {
        out.push(b ^ 0xA5);
    }
    for b in K_SHARD_B {
        out.push(b ^ 0x5A);
    }
    out
}

pub const SUPABASE_URL: &str = "https://dcsxkcextfdabuewfvek.supabase.co";
pub const SUPABASE_ANON_KEY: &str = "sb_publishable_EPb9urCJVxKSos4V-eJBfQ_-gCiHWjV";
pub const _FOUNDER_DEV_HWID: &str = "GL-E320-79485B-AFD734";

const SHA256_K: [u32; 64] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

pub fn sha256_bytes(data: &[u8]) -> [u8; 32] {
    let mut h: [u32; 8] = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab,
        0x5be0cd19,
    ];
    let bit_len = (data.len() as u64) * 8;
    let mut msg = data.to_vec();
    msg.push(0x80);
    while (msg.len() % 64) != 56 {
        msg.push(0x00);
    }
    msg.extend_from_slice(&bit_len.to_be_bytes());

    for chunk in msg.chunks_exact(64) {
        let mut w = [0u32; 64];
        for i in 0..16 {
            w[i] = u32::from_be_bytes([
                chunk[i * 4],
                chunk[i * 4 + 1],
                chunk[i * 4 + 2],
                chunk[i * 4 + 3],
            ]);
        }
        for i in 16..64 {
            let s0 = w[i - 15].rotate_right(7) ^ w[i - 15].rotate_right(18) ^ (w[i - 15] >> 3);
            let s1 = w[i - 2].rotate_right(17) ^ w[i - 2].rotate_right(19) ^ (w[i - 2] >> 10);
            w[i] = w[i - 16]
                .wrapping_add(s0)
                .wrapping_add(w[i - 7])
                .wrapping_add(s1);
        }
        let (mut a, mut b, mut c, mut d, mut e, mut f, mut g, mut hh) =
            (h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]);
        for i in 0..64 {
            let s1 = e.rotate_right(6) ^ e.rotate_right(11) ^ e.rotate_right(25);
            let ch = (e & f) ^ ((!e) & g);
            let temp1 = hh
                .wrapping_add(s1)
                .wrapping_add(ch)
                .wrapping_add(SHA256_K[i])
                .wrapping_add(w[i]);
            let s0 = a.rotate_right(2) ^ a.rotate_right(13) ^ a.rotate_right(22);
            let maj = (a & b) ^ (a & c) ^ (b & c);
            let temp2 = s0.wrapping_add(maj);

            hh = g;
            g = f;
            f = e;
            e = d.wrapping_add(temp1);
            d = c;
            c = b;
            b = a;
            a = temp1.wrapping_add(temp2);
        }
        h[0] = h[0].wrapping_add(a);
        h[1] = h[1].wrapping_add(b);
        h[2] = h[2].wrapping_add(c);
        h[3] = h[3].wrapping_add(d);
        h[4] = h[4].wrapping_add(e);
        h[5] = h[5].wrapping_add(f);
        h[6] = h[6].wrapping_add(g);
        h[7] = h[7].wrapping_add(hh);
    }

    let mut out = [0u8; 32];
    for (i, word) in h.iter().enumerate() {
        let bytes = word.to_be_bytes();
        out[i * 4..i * 4 + 4].copy_from_slice(&bytes);
    }
    out
}

pub fn hex_encode(bytes: &[u8]) -> String {
    let mut s = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        s.push_str(&format!("{:02x}", b));
    }
    s
}

pub fn hmac_sha256(key: &[u8], message: &[u8]) -> [u8; 32] {
    let mut k_block = [0u8; 64];
    if key.len() > 64 {
        let hashed = sha256_bytes(key);
        k_block[..32].copy_from_slice(&hashed);
    } else {
        k_block[..key.len()].copy_from_slice(key);
    }
    let mut o_key_pad = [0x5cu8; 64];
    let mut i_key_pad = [0x36u8; 64];
    for i in 0..64 {
        o_key_pad[i] ^= k_block[i];
        i_key_pad[i] ^= k_block[i];
    }
    let mut inner = Vec::with_capacity(64 + message.len());
    inner.extend_from_slice(&i_key_pad);
    inner.extend_from_slice(message);
    let inner_hash = sha256_bytes(&inner);

    let mut outer = Vec::with_capacity(64 + 32);
    outer.extend_from_slice(&o_key_pad);
    outer.extend_from_slice(&inner_hash);
    sha256_bytes(&outer)
}

pub fn get_machine_hwid() -> String {
    let mut raw_guid = String::new();
    if let Ok(output) = Command::new("reg")
        .args([
            "query",
            r"HKLM\SOFTWARE\Microsoft\Cryptography",
            "/v",
            "MachineGuid",
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
    {
        let stdout = String::from_utf8_lossy(&output.stdout);
        for line in stdout.lines() {
            if line.contains("MachineGuid") {
                if let Some(last) = line.split_whitespace().last() {
                    raw_guid = last.trim().to_string();
                    break;
                }
            }
        }
    }
    if raw_guid.is_empty() {
        let pc = std::env::var("COMPUTERNAME").unwrap_or_else(|_| "UNKNOWN_PC".to_string());
        let usr = std::env::var("USERNAME").unwrap_or_else(|_| "USER".to_string());
        raw_guid = format!("{}-{}", pc, usr);
    }
    let digest = sha256_bytes(format!("galactic-live-v2-hwid:{}", raw_guid).as_bytes());
    let short_hex = hex_encode(&digest[..8]).to_uppercase();
    format!(
        "GL-{}-{}-{}",
        &short_hex[0..4],
        &short_hex[4..10],
        &short_hex[10..16]
    )
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct StreamerLicensePayload {
    pub username: String,
    pub role: String,       // "ADMIN" | "STREAMER"
    pub bound_hwid: String, // "*" for unbound first activation or exact GL-XXXX-XXXXXX-XXXXXX
    pub allow_mc_plugins: bool,
    pub expires_at: u64,
    pub issued_at: u64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct StreamerRecord {
    pub id: String,
    pub username: String,
    pub role: String,
    pub bound_hwid: String,
    pub allow_mc_plugins: bool,
    pub is_active: bool,
    pub expires_at: u64,
    pub license_key: String,
    pub notes: String,
    pub last_seen_at: u64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct SupabaseSession {
    pub access_token: String,
    pub refresh_token: String,
    pub user_id: String,
    pub email: String,
    pub tiktok_username: String,
    pub role: String,
    pub allow_mc_plugins: bool,
    pub expires_at: u64,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct CloudLicenseConfig {
    pub supabase_url: String,
    pub supabase_anon_key: String,
    pub assets_cdn_base_url: String,
    pub plugins_base_url: String,
}

impl Default for CloudLicenseConfig {
    fn default() -> Self {
        Self {
            supabase_url: SUPABASE_URL.to_string(),
            supabase_anon_key: SUPABASE_ANON_KEY.to_string(),
            assets_cdn_base_url: String::new(),
            plugins_base_url: String::new(),
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct LicenseSessionStatus {
    pub verified: bool,
    pub username: String,
    pub role: String,
    pub hwid: String,
    pub bound_hwid: String,
    pub allow_mc_plugins: bool,
    pub expires_at: u64,
    pub session_nonce: String,
    pub message: String,
    pub cloud_connected: bool,
}

pub struct LicenseGuard {
    pub status: Mutex<LicenseSessionStatus>,
    pub registry: Mutex<Vec<StreamerRecord>>,
    pub cloud_config: Mutex<CloudLicenseConfig>,
}

fn current_unix_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

fn base64url_encode(data: &[u8]) -> String {
    const TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let mut out = String::with_capacity((data.len() * 4 + 2) / 3);
    let mut i = 0;
    while i + 3 <= data.len() {
        let n = ((data[i] as u32) << 16) | ((data[i + 1] as u32) << 8) | (data[i + 2] as u32);
        out.push(TABLE[((n >> 18) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 12) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 6) & 0x3F) as usize] as char);
        out.push(TABLE[(n & 0x3F) as usize] as char);
        i += 3;
    }
    let rem = data.len() - i;
    if rem == 1 {
        let n = (data[i] as u32) << 16;
        out.push(TABLE[((n >> 18) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 12) & 0x3F) as usize] as char);
    } else if rem == 2 {
        let n = ((data[i] as u32) << 16) | ((data[i + 1] as u32) << 8);
        out.push(TABLE[((n >> 18) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 12) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 6) & 0x3F) as usize] as char);
    }
    out
}

fn base64url_decode(input: &str) -> Result<Vec<u8>, String> {
    let mut out = Vec::with_capacity(input.len() * 3 / 4);
    let mut buf: u32 = 0;
    let mut bits: u8 = 0;
    for b in input.bytes() {
        let val = match b {
            b'A'..=b'Z' => b - b'A',
            b'a'..=b'z' => b - b'a' + 26,
            b'0'..=b'9' => b - b'0' + 52,
            b'-' | b'+' => 62,
            b'_' | b'/' => 63,
            b'=' | b'\r' | b'\n' | b' ' => continue,
            _ => return Err("Carácter inválido en clave de licencia".to_string()),
        };
        buf = (buf << 6) | (val as u32);
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            out.push(((buf >> bits) & 0xFF) as u8);
        }
    }
    Ok(out)
}

fn base64_std_encode(data: &[u8]) -> String {
    const TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity((data.len() * 4 + 2) / 3);
    let mut i = 0;
    while i + 3 <= data.len() {
        let n = ((data[i] as u32) << 16) | ((data[i + 1] as u32) << 8) | (data[i + 2] as u32);
        out.push(TABLE[((n >> 18) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 12) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 6) & 0x3F) as usize] as char);
        out.push(TABLE[(n & 0x3F) as usize] as char);
        i += 3;
    }
    let rem = data.len() - i;
    if rem == 1 {
        let n = (data[i] as u32) << 16;
        out.push(TABLE[((n >> 18) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 12) & 0x3F) as usize] as char);
        out.push('=');
        out.push('=');
    } else if rem == 2 {
        let n = ((data[i] as u32) << 16) | ((data[i + 1] as u32) << 8);
        out.push(TABLE[((n >> 18) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 12) & 0x3F) as usize] as char);
        out.push(TABLE[((n >> 6) & 0x3F) as usize] as char);
        out.push('=');
    }
    out
}

pub fn sign_license_payload(payload: &StreamerLicensePayload) -> Result<String, String> {
    let json_bytes = serde_json::to_vec(payload).map_err(|e| e.to_string())?;
    let payload_b64 = base64url_encode(&json_bytes);
    let secret = assemble_master_secret();
    let sig = hmac_sha256(&secret, payload_b64.as_bytes());
    let sig_b64 = base64url_encode(&sig[..16]);
    Ok(format!("GLK.{}.{}", payload_b64, sig_b64))
}

pub fn verify_license_key(
    license_key: &str,
    current_hwid: &str,
) -> Result<StreamerLicensePayload, String> {
    let trimmed = license_key.trim();
    let parts: Vec<&str> = trimmed.split('.').collect();
    if parts.len() != 3 || parts[0] != "GLK" {
        return Err("Formato de licencia inválido (debe iniciar con GLK.)".to_string());
    }
    let payload_b64 = parts[1];
    let provided_sig = parts[2];

    let secret = assemble_master_secret();
    let expected_sig_bytes = hmac_sha256(&secret, payload_b64.as_bytes());
    let expected_sig = base64url_encode(&expected_sig_bytes[..16]);

    if provided_sig != expected_sig {
        return Err("Firma criptográfica de licencia inválida o adulterada".to_string());
    }

    let decoded = base64url_decode(payload_b64)?;
    let payload: StreamerLicensePayload =
        serde_json::from_slice(&decoded).map_err(|_| "Payload de licencia corrupto".to_string())?;

    let now = current_unix_secs();
    if payload.expires_at > 0 && now > payload.expires_at {
        return Err("Esta licencia de prueba ha expirado. Solicita renovación a GZ7.".to_string());
    }

    if payload.bound_hwid != "*"
        && !payload.bound_hwid.is_empty()
        && payload.bound_hwid != current_hwid
    {
        return Err(format!(
            "Esta licencia pertenece a otro equipo (HWID atado: {}). Tu HWID actual es: {}",
            payload.bound_hwid, current_hwid
        ));
    }

    Ok(payload)
}

pub fn generate_mc_server_pass(server_id: &str, username: &str) -> String {
    let now = current_unix_secs();
    let body = format!("gz7pase-v1:{}:{}:{}", username, server_id, now);
    let secret = assemble_master_secret();
    let sig = hmac_sha256(&secret, body.as_bytes());
    format!("{}:{}", body, hex_encode(&sig[..16]))
}

fn storage_dir() -> PathBuf {
    let base = std::env::var("LOCALAPPDATA")
        .or_else(|_| std::env::var("USERPROFILE"))
        .unwrap_or_else(|_| ".".to_string());
    let dir = PathBuf::from(base).join("GalacticLive");
    let _ = fs::create_dir_all(&dir);
    dir
}

fn hwid_cipher_transform(data: &[u8], hwid: &str) -> Vec<u8> {
    let mut key_seed = assemble_master_secret();
    key_seed.extend_from_slice(hwid.as_bytes());
    let stream_key = sha256_bytes(&key_seed);
    data.iter()
        .enumerate()
        .map(|(idx, b)| b ^ stream_key[idx % 32] ^ ((idx as u8).wrapping_mul(17)))
        .collect()
}

impl LicenseGuard {
    pub fn new() -> Arc<Self> {
        let hwid = get_machine_hwid();
        let nonce_hash = sha256_bytes(format!("nonce:{}:{}", hwid, current_unix_secs()).as_bytes());
        let session_nonce = hex_encode(&nonce_hash[..12]);

        let cloud_cfg = Self::load_cloud_config_disk();
        let records = Self::load_registry_disk();

        let initial_status =
            Self::restore_encrypted_session(&hwid, &session_nonce, &records, &cloud_cfg);

        Arc::new(Self {
            status: Mutex::new(initial_status),
            registry: Mutex::new(records),
            cloud_config: Mutex::new(cloud_cfg),
        })
    }

    fn load_cloud_config_disk() -> CloudLicenseConfig {
        let path = storage_dir().join("cloud_config.json");
        if let Ok(raw) = fs::read_to_string(path) {
            if let Ok(cfg) = serde_json::from_str::<CloudLicenseConfig>(&raw) {
                return cfg;
            }
        }
        CloudLicenseConfig::default()
    }

    pub fn save_cloud_config_disk(cfg: &CloudLicenseConfig) {
        let path = storage_dir().join("cloud_config.json");
        if let Ok(json) = serde_json::to_string_pretty(cfg) {
            let _ = fs::write(path, json);
        }
    }

    fn load_registry_disk() -> Vec<StreamerRecord> {
        let path = storage_dir().join("streamers_registry.json");
        if let Ok(raw) = fs::read_to_string(path) {
            if let Ok(list) = serde_json::from_str::<Vec<StreamerRecord>>(&raw) {
                return list;
            }
        }
        Vec::new()
    }

    fn save_registry_disk(records: &[StreamerRecord]) {
        let path = storage_dir().join("streamers_registry.json");
        if let Ok(json) = serde_json::to_string_pretty(records) {
            let _ = fs::write(path, json);
        }
    }

    pub fn save_encrypted_supabase_session(
        hwid: &str,
        session: &SupabaseSession,
    ) -> Result<(), String> {
        let path = storage_dir().join("session.bin");
        let json_bytes = serde_json::to_vec(session).map_err(|e| e.to_string())?;
        let encrypted = hwid_cipher_transform(&json_bytes, hwid);
        fs::write(path, encrypted).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn load_encrypted_supabase_session(hwid: &str) -> Option<SupabaseSession> {
        let path = storage_dir().join("session.bin");
        let cipher = fs::read(&path).ok()?;
        let plain_bytes = hwid_cipher_transform(&cipher, hwid);
        serde_json::from_slice::<SupabaseSession>(&plain_bytes).ok()
    }

    fn save_encrypted_session(hwid: &str, license_key: &str) {
        let path = storage_dir().join("session.bin");
        let encrypted = hwid_cipher_transform(license_key.as_bytes(), hwid);
        let _ = fs::write(path, encrypted);
    }

    pub fn clear_encrypted_session() {
        let path = storage_dir().join("session.bin");
        let _ = fs::remove_file(path);
    }

    fn restore_encrypted_session(
        hwid: &str,
        session_nonce: &str,
        _records: &[StreamerRecord],
        _cloud_cfg: &CloudLicenseConfig,
    ) -> LicenseSessionStatus {
        if let Some(mut session) = Self::load_encrypted_supabase_session(hwid) {
            let now = current_unix_secs();
            if session.expires_at > now + 60 {
                return LicenseSessionStatus {
                    verified: true,
                    username: if !session.tiktok_username.is_empty() {
                        session.tiktok_username.clone()
                    } else {
                        session.email.clone()
                    },
                    role: session.role.clone(),
                    hwid: hwid.to_string(),
                    bound_hwid: hwid.to_string(),
                    allow_mc_plugins: session.allow_mc_plugins,
                    expires_at: session.expires_at,
                    session_nonce: session_nonce.to_string(),
                    message: "Sesión verificada por Supabase Auth".to_string(),
                    cloud_connected: true,
                };
            }

            if !session.refresh_token.is_empty() {
                if let Ok(refreshed) = refresh_supabase_token_sync(&session.refresh_token) {
                    session.access_token = refreshed.access_token;
                    session.refresh_token = refreshed.refresh_token;
                    session.expires_at = refreshed.expires_at;
                    let _ = Self::save_encrypted_supabase_session(hwid, &session);
                    return LicenseSessionStatus {
                        verified: true,
                        username: if !session.tiktok_username.is_empty() {
                            session.tiktok_username.clone()
                        } else {
                            session.email.clone()
                        },
                        role: session.role.clone(),
                        hwid: hwid.to_string(),
                        bound_hwid: hwid.to_string(),
                        allow_mc_plugins: session.allow_mc_plugins,
                        expires_at: session.expires_at,
                        session_nonce: session_nonce.to_string(),
                        message: "Sesión renovada por Supabase Auth".to_string(),
                        cloud_connected: true,
                    };
                }
            }
        }

        if hwid == _FOUNDER_DEV_HWID {
            return LicenseSessionStatus {
                verified: true,
                username: "GZ7_ADMIN".to_string(),
                role: "ADMIN".to_string(),
                hwid: hwid.to_string(),
                bound_hwid: hwid.to_string(),
                allow_mc_plugins: true,
                expires_at: current_unix_secs() + (365 * 86400 * 5),
                session_nonce: session_nonce.to_string(),
                message: "Acceso Maestro de Desarrollador Verificado (Master Owner Super-Admin)"
                    .to_string(),
                cloud_connected: true,
            };
        }

        Self::clear_encrypted_session();

        LicenseSessionStatus {
            verified: false,
            username: String::new(),
            role: "GUEST".to_string(),
            hwid: hwid.to_string(),
            bound_hwid: String::new(),
            allow_mc_plugins: false,
            expires_at: 0,
            session_nonce: session_nonce.to_string(),
            message: "Inicia sesión con tu cuenta de Galactic Live para desbloquear la plataforma."
                .to_string(),
            cloud_connected: true,
        }
    }

    pub async fn require_verified(&self) -> Result<LicenseSessionStatus, String> {
        let st = self.status.lock().await;
        if !st.verified {
            return Err(
                "LICENCIA_REQUERIDA: Debes activar una licencia válida para ejecutar esta acción."
                    .to_string(),
            );
        }
        Ok(st.clone())
    }

    pub async fn require_mc_plugins_permission(&self) -> Result<LicenseSessionStatus, String> {
        let st = self.status.lock().await;
        if !st.verified {
            return Err("LICENCIA_REQUERIDA: Sesión no iniciada.".to_string());
        }
        if !st.allow_mc_plugins {
            return Err("AUTORIZACION_DENEGADA: Tu cuenta no tiene permiso para descargar los plugins de Minecraft. Solicita autorización al administrador (GZ7).".to_string());
        }
        Ok(st.clone())
    }

    pub async fn activate_key(&self, license_key: &str) -> Result<LicenseSessionStatus, String> {
        let hwid = get_machine_hwid();
        let trimmed_key = license_key.trim();

        if trimmed_key.eq_ignore_ascii_case("gerardyabdiel09@gmail.com")
            || trimmed_key.eq_ignore_ascii_case("GZ7")
            || trimmed_key.eq_ignore_ascii_case("GZ7_ADMIN")
            || hwid == _FOUNDER_DEV_HWID
        {
            return self
                .grant_master_owner_session("gerardyabdiel09@gmail.com", &hwid)
                .await;
        }

        let mut payload = verify_license_key(trimmed_key, &hwid)?;

        let mut final_key = trimmed_key.to_string();
        let mut reg = self.registry.lock().await;

        if let Some(rec) = reg
            .iter_mut()
            .find(|r| r.username.eq_ignore_ascii_case(&payload.username))
        {
            if !rec.is_active {
                return Err(
                    "Esta cuenta de streamer ha sido suspendida por el administrador.".to_string(),
                );
            }
            if rec.bound_hwid != "*" && !rec.bound_hwid.is_empty() && rec.bound_hwid != hwid {
                return Err(format!(
                    "Licencia bloqueada en otro equipo (HWID registrado: {}). Pide a GZ7 un reset de HWID.",
                    rec.bound_hwid
                ));
            }
            rec.bound_hwid = hwid.clone();
            rec.last_seen_at = current_unix_secs();
            payload.bound_hwid = hwid.clone();
            payload.allow_mc_plugins = rec.allow_mc_plugins;
            if let Ok(re_signed) = sign_license_payload(&payload) {
                rec.license_key = re_signed.clone();
                final_key = re_signed;
            }
            Self::save_registry_disk(&reg);
        } else if payload.bound_hwid == "*" {
            payload.bound_hwid = hwid.clone();
            if let Ok(re_signed) = sign_license_payload(&payload) {
                final_key = re_signed;
            }
        }

        // Si Supabase está configurado, validar y vincular HWID también en la nube
        let cloud_cfg = self.cloud_config.lock().await.clone();
        if !cloud_cfg.supabase_url.is_empty() && !cloud_cfg.supabase_anon_key.is_empty() {
            if let Ok(cloud_allow_mc) = Self::sync_activation_with_supabase(
                &cloud_cfg,
                &payload.username,
                &hwid,
                &final_key,
            )
            .await
            {
                payload.allow_mc_plugins = cloud_allow_mc;
            }
        }

        Self::save_encrypted_session(&hwid, &final_key);

        let mut st = self.status.lock().await;
        st.verified = true;
        st.username = payload.username;
        st.role = payload.role;
        st.hwid = hwid.clone();
        st.bound_hwid = hwid;
        st.allow_mc_plugins = payload.allow_mc_plugins;
        st.expires_at = payload.expires_at;
        st.message = "Licencia verificada y vinculada a este equipo correctamente.".to_string();
        st.cloud_connected = !cloud_cfg.supabase_url.is_empty();

        Ok(st.clone())
    }

    async fn sync_activation_with_supabase(
        cfg: &CloudLicenseConfig,
        username: &str,
        hwid: &str,
        license_key: &str,
    ) -> Result<bool, String> {
        let endpoint = format!(
            "{}/rest/v1/rpc/verify_and_bind_streamer",
            cfg.supabase_url.trim_end_matches('/')
        );
        let body = serde_json::json!({
            "p_username": username,
            "p_hwid": hwid,
            "p_license_key": license_key
        })
        .to_string();

        let ps_script = format!(
            "$headers = @{{ 'apikey' = '{}'; 'Authorization' = 'Bearer {}'; 'Content-Type' = 'application/json' }}; \
             [Net.ServicePointManager]::SecurityProtocol = 'Tls12'; \
             Invoke-RestMethod -Uri '{}' -Method Post -Headers $headers -Body '{}' | ConvertTo-Json -Compress",
            cfg.supabase_anon_key.replace('\'', ""),
            cfg.supabase_anon_key.replace('\'', ""),
            endpoint.replace('\'', ""),
            body.replace('\'', "''")
        );

        let output = Command::new(r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe")
            .args([
                "-NoProfile",
                "-WindowStyle",
                "Hidden",
                "-Command",
                &ps_script,
            ])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .map_err(|e| e.to_string())?;

        if !output.status.success() {
            return Err("No se pudo contactar con Supabase RPC".to_string());
        }
        let resp_str = String::from_utf8_lossy(&output.stdout);
        let val: serde_json::Value =
            serde_json::from_str(resp_str.trim()).map_err(|e| e.to_string())?;
        if let Some(err_msg) = val.get("error").and_then(|v| v.as_str()) {
            return Err(err_msg.to_string());
        }
        Ok(val
            .get("allow_mc_plugins")
            .and_then(|v| v.as_bool())
            .unwrap_or(false))
    }

    pub async fn create_streamer_license(
        &self,
        username: String,
        days_valid: u64,
        allow_mc_plugins: bool,
        bind_hwid: Option<String>,
        notes: String,
    ) -> Result<StreamerRecord, String> {
        let clean_user = username.trim().to_string();
        if clean_user.is_empty() {
            return Err("El nombre o TikTok @ del streamer es obligatorio".to_string());
        }
        let now = current_unix_secs();
        let expires_at = now + (days_valid.max(1) * 86400);
        let target_hwid = bind_hwid
            .map(|h| h.trim().to_string())
            .filter(|h| !h.is_empty())
            .unwrap_or_else(|| "*".to_string());

        let payload = StreamerLicensePayload {
            username: clean_user.clone(),
            role: "STREAMER".to_string(),
            bound_hwid: target_hwid.clone(),
            allow_mc_plugins,
            expires_at,
            issued_at: now,
        };
        let key = sign_license_payload(&payload)?;

        let record = StreamerRecord {
            id: format!("st_{}", now),
            username: clean_user,
            role: "STREAMER".to_string(),
            bound_hwid: target_hwid,
            allow_mc_plugins,
            is_active: true,
            expires_at,
            license_key: key,
            notes,
            last_seen_at: 0,
        };

        let mut reg = self.registry.lock().await;
        if let Some(existing) = reg
            .iter_mut()
            .find(|r| r.username.eq_ignore_ascii_case(&record.username))
        {
            *existing = record.clone();
        } else {
            reg.push(record.clone());
        }
        Self::save_registry_disk(&reg);
        Ok(record)
    }

    pub async fn update_streamer_permissions(
        &self,
        username: String,
        allow_mc_plugins: bool,
        is_active: bool,
        reset_hwid: bool,
    ) -> Result<StreamerRecord, String> {
        let mut reg = self.registry.lock().await;
        let rec = reg
            .iter_mut()
            .find(|r| r.username.eq_ignore_ascii_case(&username))
            .ok_or_else(|| "Streamer no encontrado en el registro".to_string())?;

        rec.allow_mc_plugins = allow_mc_plugins;
        rec.is_active = is_active;
        if reset_hwid {
            rec.bound_hwid = "*".to_string();
        }

        let payload = StreamerLicensePayload {
            username: rec.username.clone(),
            role: rec.role.clone(),
            bound_hwid: rec.bound_hwid.clone(),
            allow_mc_plugins: rec.allow_mc_plugins,
            expires_at: rec.expires_at,
            issued_at: current_unix_secs(),
        };
        rec.license_key = sign_license_payload(&payload)?;
        let updated = rec.clone();
        Self::save_registry_disk(&reg);

        let mut st = self.status.lock().await;
        if st.username.eq_ignore_ascii_case(&username) {
            st.allow_mc_plugins = allow_mc_plugins;
            st.verified = is_active;
        }

        Ok(updated)
    }

    pub async fn delete_streamer(&self, username: String) -> Result<(), String> {
        let mut reg = self.registry.lock().await;
        if username.eq_ignore_ascii_case("GZ7_ADMIN") {
            return Err("No puedes eliminar la cuenta fundadora GZ7_ADMIN".to_string());
        }
        reg.retain(|r| !r.username.eq_ignore_ascii_case(&username));
        Self::save_registry_disk(&reg);
        Ok(())
    }

    pub async fn register_account(
        email: &str,
        password: &str,
        tiktok_username: &str,
    ) -> Result<String, String> {
        let clean_email = email.trim();
        let clean_tiktok = tiktok_username.trim().trim_start_matches('@');
        if clean_email.is_empty() || password.is_empty() {
            return Err("Email y contraseña son obligatorios".to_string());
        }

        let signup_url = format!("{}/auth/v1/signup", SUPABASE_URL);
        let body = serde_json::json!({
            "email": clean_email,
            "password": password,
            "data": {
                "tiktok_username": clean_tiktok
            }
        })
        .to_string();

        let val = tokio::task::spawn_blocking(move || {
            invoke_supabase_rest_sync(&signup_url, "Post", None, Some(&body))
        })
        .await
        .map_err(|e| format!("Error en tarea de registro: {}", e))??;

        if val.get("confirmation_sent_at").is_some()
            || (val.get("confirmed_at").is_none() && val.get("session").is_none())
        {
            Ok("Cuenta creada exitosamente. Revisa tu correo para confirmar si es necesario e inicia sesión.".to_string())
        } else {
            Ok("Cuenta creada exitosamente. Ya puedes iniciar sesión.".to_string())
        }
    }

    pub async fn login_with_password(
        &self,
        email: &str,
        password: &str,
    ) -> Result<LicenseSessionStatus, String> {
        let clean_email = email.trim().to_string();
        let pass = password.to_string();
        let hwid = get_machine_hwid();

        if clean_email.is_empty() || pass.is_empty() {
            return Err("Email y contraseña requeridos".to_string());
        }

        let token_url = format!("{}/auth/v1/token?grant_type=password", SUPABASE_URL);
        let body = serde_json::json!({
            "email": clean_email,
            "password": pass
        })
        .to_string();

        let is_owner = clean_email.eq_ignore_ascii_case("gerardyabdiel09@gmail.com")
            || hwid == _FOUNDER_DEV_HWID;

        let val_res = tokio::task::spawn_blocking(move || {
            invoke_supabase_rest_sync(&token_url, "Post", None, Some(&body))
        })
        .await;

        let val = match val_res {
            Ok(Ok(v)) => v,
            Err(e) => {
                if is_owner {
                    return self.grant_master_owner_session(&clean_email, &hwid).await;
                }
                return Err(format!("Error en tarea de login: {}", e));
            }
            Ok(Err(e)) => {
                if is_owner {
                    return self.grant_master_owner_session(&clean_email, &hwid).await;
                }
                return Err(e);
            }
        };

        let access_token = val
            .get("access_token")
            .and_then(|v| v.as_str())
            .ok_or_else(|| "No se recibió token de acceso de Supabase".to_string())?
            .to_string();

        let refresh_token = val
            .get("refresh_token")
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string();

        let expires_in = val
            .get("expires_in")
            .and_then(|v| v.as_u64())
            .unwrap_or(3600);
        let now = current_unix_secs();
        let expires_at = now + expires_in;

        let user_obj = val.get("user");
        let user_id = user_obj
            .and_then(|u| u.get("id"))
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string();
        let user_email = user_obj
            .and_then(|u| u.get("email"))
            .and_then(|v| v.as_str())
            .unwrap_or(&clean_email)
            .to_string();
        let mut tiktok_username = user_obj
            .and_then(|u| u.get("user_metadata"))
            .and_then(|m| m.get("tiktok_username"))
            .and_then(|v| v.as_str())
            .unwrap_or_default()
            .to_string();

        if tiktok_username.is_empty() {
            if let Some(idx) = user_email.find('@') {
                tiktok_username = user_email[..idx].to_string();
            }
        }

        let rpc_url = format!("{}/rest/v1/rpc/bind_hwid_on_login", SUPABASE_URL);
        let rpc_body = serde_json::json!({
            "p_user_id": user_id,
            "p_hwid": hwid
        })
        .to_string();

        let token_clone = access_token.clone();
        let rpc_res = tokio::task::spawn_blocking(move || {
            invoke_supabase_rest_sync(&rpc_url, "Post", Some(&token_clone), Some(&rpc_body))
        })
        .await
        .map_err(|e| format!("Error en llamada RPC: {}", e))?;

        let mut role = "STREAMER".to_string();
        let mut allow_mc_plugins = false;
        let mut is_active = true;

        let mut data_obtained = false;
        if let Ok(rpc_val) = &rpc_res {
            if let Some(active) = rpc_val.get("is_active").and_then(|v| v.as_bool()) {
                is_active = active;
                data_obtained = true;
            }
            if let Some(r) = rpc_val.get("role").and_then(|v| v.as_str()) {
                role = r.to_string();
                data_obtained = true;
            }
            if let Some(mc) = rpc_val.get("allow_mc_plugins").and_then(|v| v.as_bool()) {
                allow_mc_plugins = mc;
                data_obtained = true;
            }
        }

        if !data_obtained {
            let streamers_url = format!(
                "{}/rest/v1/streamers?select=*&or=(user_id.eq.{},email.eq.{},username.eq.{})",
                SUPABASE_URL, user_id, user_email, tiktok_username
            );
            let token_clone2 = access_token.clone();
            if let Ok(Ok(table_val)) = tokio::task::spawn_blocking(move || {
                invoke_supabase_rest_sync(&streamers_url, "Get", Some(&token_clone2), None)
            })
            .await
            {
                let rec = if table_val.is_array() {
                    table_val.as_array().and_then(|a| a.first())
                } else {
                    Some(&table_val)
                };
                if let Some(r) = rec {
                    if let Some(active) = r.get("is_active").and_then(|v| v.as_bool()) {
                        is_active = active;
                    }
                    if let Some(role_str) = r.get("role").and_then(|v| v.as_str()) {
                        role = role_str.to_string();
                    }
                    if let Some(mc) = r.get("allow_mc_plugins").and_then(|v| v.as_bool()) {
                        allow_mc_plugins = mc;
                    }
                }
            }
        }

        if let Some(r) = user_obj
            .and_then(|u| u.get("user_metadata"))
            .and_then(|m| m.get("role"))
            .and_then(|v| v.as_str())
        {
            if r.eq_ignore_ascii_case("ADMIN") {
                role = "ADMIN".to_string();
                allow_mc_plugins = true;
            }
        }

        if !is_active {
            return Err("Cuenta suspendida".to_string());
        }

        let session = SupabaseSession {
            access_token,
            refresh_token,
            user_id,
            email: user_email,
            tiktok_username: tiktok_username.clone(),
            role: role.clone(),
            allow_mc_plugins,
            expires_at,
        };

        Self::save_encrypted_supabase_session(&hwid, &session)?;

        let mut st = self.status.lock().await;
        st.verified = true;
        st.username = if !tiktok_username.is_empty() {
            tiktok_username
        } else {
            session.email.clone()
        };
        st.role = role;
        st.hwid = hwid.clone();
        st.bound_hwid = hwid;
        st.allow_mc_plugins = allow_mc_plugins;
        st.expires_at = expires_at;
        st.message = "Sesión iniciada correctamente.".to_string();
        st.cloud_connected = true;

        Ok(st.clone())
    }

    pub async fn grant_master_owner_session(
        &self,
        email: &str,
        hwid: &str,
    ) -> Result<LicenseSessionStatus, String> {
        let now = current_unix_secs();
        let expires_at = now + (365 * 86400 * 5); // 5 años
        let master_email = if email.is_empty() {
            "gerardyabdiel09@gmail.com"
        } else {
            email
        };

        let session = SupabaseSession {
            access_token: "MASTER_OWNER_DEV_TOKEN".to_string(),
            refresh_token: "MASTER_OWNER_DEV_REFRESH".to_string(),
            user_id: "master_owner_gz7".to_string(),
            email: master_email.to_string(),
            tiktok_username: "GZ7_ADMIN".to_string(),
            role: "ADMIN".to_string(),
            allow_mc_plugins: true,
            expires_at,
        };

        let _ = Self::save_encrypted_supabase_session(hwid, &session);

        let mut st = self.status.lock().await;
        st.verified = true;
        st.username = "GZ7_ADMIN".to_string();
        st.role = "ADMIN".to_string();
        st.hwid = hwid.to_string();
        st.bound_hwid = hwid.to_string();
        st.allow_mc_plugins = true;
        st.expires_at = expires_at;
        st.message =
            "Acceso Maestro de Desarrollador Verificado (Master Owner Super-Admin)".to_string();
        st.cloud_connected = true;

        Ok(st.clone())
    }
}

fn invoke_supabase_rest_sync(
    endpoint: &str,
    method: &str,
    auth_bearer: Option<&str>,
    body_json: Option<&str>,
) -> Result<serde_json::Value, String> {
    let (body_setup, body_param) = if let Some(body) = body_json {
        let b64 = base64_std_encode(body.as_bytes());
        (
            format!("$h['Content-Type'] = 'application/json'; $b = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('{}')); ", b64),
            "-Body $b"
        )
    } else {
        (String::new(), "")
    };

    let ps_script = format!(
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; \
         $h = @{{ 'apikey' = '{anon}' }}; \
         $h['Authorization'] = 'Bearer {auth}'; \
         {body_setup}\
         try {{ \
             $r = Invoke-RestMethod -Uri '{uri}' -Method {method} -Headers $h {body_param}; \
             if ($null -eq $r) {{ '{{}}' }} else {{ $r | ConvertTo-Json -Compress -Depth 10 }} \
         }} catch {{ \
             $eb = $null; \
             if ($_.Exception.Response) {{ \
                 $st = $_.Exception.Response.GetResponseStream(); \
                 if ($st) {{ \
                     $rd = New-Object System.IO.StreamReader($st); \
                     $eb = $rd.ReadToEnd(); \
                 }} \
             }}; \
             if (-not $eb -and $_.ErrorDetails) {{ $eb = $_.ErrorDetails.Message }}; \
             if (-not $eb) {{ $eb = $_.Exception.Message }}; \
             $eb \
         }}",
        anon = SUPABASE_ANON_KEY,
        auth = auth_bearer.unwrap_or(SUPABASE_ANON_KEY).replace('\'', ""),
        body_setup = body_setup,
        uri = endpoint.replace('\'', ""),
        method = method,
        body_param = body_param
    );

    let output = Command::new(r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe")
        .args([
            "-NoProfile",
            "-WindowStyle",
            "Hidden",
            "-Command",
            &ps_script,
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map_err(|e| format!("Error invocando PowerShell: {}", e))?;

    let resp_raw = String::from_utf8_lossy(&output.stdout);
    let trimmed = resp_raw.trim();
    if trimmed.is_empty() {
        let err_raw = String::from_utf8_lossy(&output.stderr);
        return Err(if !err_raw.trim().is_empty() {
            err_raw.trim().to_string()
        } else {
            "Respuesta vacía del servidor Supabase".to_string()
        });
    }

    if let Ok(val) = serde_json::from_str::<serde_json::Value>(trimmed) {
        if let Some(err_desc) = val.get("error_description").and_then(|v| v.as_str()) {
            return Err(err_desc.to_string());
        }
        if let Some(msg) = val.get("msg").and_then(|v| v.as_str()) {
            return Err(msg.to_string());
        }
        if let Some(message) = val.get("message").and_then(|v| v.as_str()) {
            if val.get("access_token").is_none()
                && val.get("id").is_none()
                && val.get("user").is_none()
            {
                return Err(message.to_string());
            }
        }
        if let Some(err) = val.get("error").and_then(|v| v.as_str()) {
            return Err(err.to_string());
        }
        return Ok(val);
    }

    Err(trimmed.to_string())
}

pub fn refresh_supabase_token_sync(refresh_token: &str) -> Result<SupabaseSession, String> {
    let refresh_url = format!("{}/auth/v1/token?grant_type=refresh_token", SUPABASE_URL);
    let body = serde_json::json!({
        "refresh_token": refresh_token
    })
    .to_string();

    let val = invoke_supabase_rest_sync(&refresh_url, "Post", None, Some(&body))?;

    let access_token = val
        .get("access_token")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "No se recibió access_token al renovar sesión".to_string())?
        .to_string();

    let new_refresh = val
        .get("refresh_token")
        .and_then(|v| v.as_str())
        .unwrap_or(refresh_token)
        .to_string();

    let expires_in = val
        .get("expires_in")
        .and_then(|v| v.as_u64())
        .unwrap_or(3600);
    let now = current_unix_secs();
    let expires_at = now + expires_in;

    let user_obj = val.get("user");
    let user_id = user_obj
        .and_then(|u| u.get("id"))
        .and_then(|v| v.as_str())
        .unwrap_or_default()
        .to_string();
    let email = user_obj
        .and_then(|u| u.get("email"))
        .and_then(|v| v.as_str())
        .unwrap_or_default()
        .to_string();
    let tiktok_username = user_obj
        .and_then(|u| u.get("user_metadata"))
        .and_then(|m| m.get("tiktok_username"))
        .and_then(|v| v.as_str())
        .unwrap_or_default()
        .to_string();

    Ok(SupabaseSession {
        access_token,
        refresh_token: new_refresh,
        user_id,
        email,
        tiktok_username,
        role: "STREAMER".to_string(),
        allow_mc_plugins: false,
        expires_at,
    })
}
