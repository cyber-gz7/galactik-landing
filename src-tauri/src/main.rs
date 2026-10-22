// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod asset_sync;
mod license_guard;
mod overlay_server;
mod rcon;

use asset_sync::{
    check_environment_health, deploy_authorized_mc_plugins, preload_core_soundpack,
    resolve_custom_media_dir, EnvironmentHealth, PluginDeployReport,
};
use license_guard::{
    generate_mc_server_pass, CloudLicenseConfig, LicenseGuard, LicenseSessionStatus, StreamerRecord,
};
use overlay_server::{start_overlay_http_server, OverlayServerState};
use serde::{Deserialize, Serialize};
use std::fs;
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use std::process::{Child, Command};
use std::sync::Arc;
use tauri::{Emitter, State};
use tauri_plugin_updater::UpdaterExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;
static TIKTOK_SIDECAR: tokio::sync::Mutex<Option<Child>> = tokio::sync::Mutex::const_new(None);
static MC_SERVER_PROCESS: tokio::sync::Mutex<Option<Child>> = tokio::sync::Mutex::const_new(None);
static MC_SERVER_FOLDER: tokio::sync::Mutex<Option<String>> = tokio::sync::Mutex::const_new(None);

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AppUpdateInfo {
    pub available: bool,
    pub current_version: String,
    pub version: String,
    pub body: String,
    pub date: String,
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct UpdateProgressPayload {
    pub downloaded_bytes: u64,
    pub total_bytes: Option<u64>,
    pub percentage: f32,
    pub status: String,
}

fn get_config_dir() -> Result<PathBuf, String> {
    let home = std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .map_err(|_| "No se pudo determinar el directorio de usuario".to_string())?;
    Ok(PathBuf::from(home).join(".gz7live"))
}

#[derive(Clone, Default)]
struct NightVisionConfig {
    pub enabled: bool,
    pub player: String,
    pub host: String,
    pub port: u16,
    pub password: String,
}

static NIGHT_VISION_CONFIG: tokio::sync::Mutex<NightVisionConfig> = tokio::sync::Mutex::const_new(NightVisionConfig {
    enabled: false,
    player: String::new(),
    host: String::new(),
    port: 25575,
    password: String::new(),
});

#[tauri::command]
async fn send_rcon(
    host: String,
    port: u16,
    password: String,
    command: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<String, String> {
    guard.require_verified().await?;
    let mut client = rcon::RconClient::connect(&host, port, &password).await?;
    let res = client.send_command(&command).await;

    // Inyección inmediata de Visión Nocturna Infinita anti-wipe si está activa
    let nv_cfg = {
        let lock = NIGHT_VISION_CONFIG.lock().await;
        lock.clone()
    };
    if nv_cfg.enabled && !nv_cfg.player.is_empty() && nv_cfg.host == host && nv_cfg.port == port {
        let nv_cmd = format!("effect give {} minecraft:night_vision infinite 0 true", nv_cfg.player);
        let _ = client.send_command(&nv_cmd).await;
    }

    res
}

#[tauri::command(rename_all = "snake_case")]
async fn set_night_vision(
    enabled: bool,
    player: String,
    host: String,
    port: u16,
    password: String,
) -> Result<(), String> {
    let mut lock = NIGHT_VISION_CONFIG.lock().await;
    lock.enabled = enabled;
    lock.player = player.trim().to_string();
    lock.host = host.trim().to_string();
    lock.port = port;
    lock.password = password.clone();

    if enabled && !lock.player.is_empty() && !lock.host.is_empty() {
        let p = lock.player.clone();
        let h = lock.host.clone();
        let pw = password;
        tokio::spawn(async move {
            if let Ok(mut client) = rcon::RconClient::connect(&h, port, &pw).await {
                let cmd1 = format!("effect give {} minecraft:night_vision infinite 0 true", p);
                if client.send_command(&cmd1).await.is_err() {
                    let cmd2 = format!("effect give {} minecraft:night_vision 999999 0 true", p);
                    let _ = client.send_command(&cmd2).await;
                }
            }
        });
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn inject_mc_session_pass(
    host: String,
    port: u16,
    password: String,
    server_id: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<String, String> {
    let session = guard.require_mc_plugins_permission().await?;
    let pass_token = generate_mc_server_pass(&server_id, &session.username);
    let mut client = rcon::RconClient::connect(&host, port, &password).await?;
    let _ = client
        .send_command(&format!("gz7pase {}", pass_token))
        .await;
    Ok(pass_token)
}

#[tauri::command(rename_all = "snake_case")]
async fn save_config(config_json: String) -> Result<(), String> {
    let dir = get_config_dir()?;
    fs::create_dir_all(&dir)
        .map_err(|e| format!("Error creando directorio de configuración: {}", e))?;
    let path = dir.join("config.json");
    fs::write(&path, config_json).map_err(|e| format!("Error guardando config.json: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn load_config() -> Result<String, String> {
    let dir = get_config_dir()?;
    let path = dir.join("config.json");
    if path.exists() {
        fs::read_to_string(&path).map_err(|e| format!("Error leyendo config.json: {}", e))
    } else {
        Ok(String::from("{}"))
    }
}

#[tauri::command(rename_all = "snake_case")]
async fn write_server_file(
    folder: String,
    filename: String,
    content: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<(), String> {
    guard.require_verified().await?;
    let base = PathBuf::from(&folder);
    fs::create_dir_all(&base).map_err(|e| format!("Error creando carpeta del servidor: {}", e))?;
    let target = base.join(filename);
    fs::write(&target, content).map_err(|e| format!("Error escribiendo archivo: {}", e))?;
    Ok(())
}

fn cleanup_server_locks_and_zombies(folder: &str) {
    let folder_path = PathBuf::from(folder);

    // 1. Matar procesos java.exe/javaw.exe huérfanos que corran paper.jar o apunten a esa carpeta
    let folder_name = folder_path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "minecraft_server".to_string());

    let ps_kill_cmd = format!(
        "$procs = Get-CimInstance Win32_Process -Filter \"name = 'java.exe' or name = 'javaw.exe'\"; \
         foreach ($p in $procs) {{ \
             if ($p.CommandLine -like '*paper.jar*' -or $p.CommandLine -like '*{f_name}*') {{ \
                 Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue; \
             }} \
         }}",
        f_name = folder_name
    );

    let _ = Command::new("powershell")
        .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_kill_cmd])
        .creation_flags(CREATE_NO_WINDOW)
        .output();

    std::thread::sleep(std::time::Duration::from_millis(300));

    // 2. Eliminar session.lock en world, world_nether, world_the_end
    for world_name in &["world", "world_nether", "world_the_end"] {
        let lock_file = folder_path.join(world_name).join("session.lock");
        if lock_file.exists() {
            let _ = fs::remove_file(&lock_file);
        }
    }

    // 3. Truncar logs/latest.log si está presente para evitar bloqueo de archivo
    let log_file = folder_path.join("logs").join("latest.log");
    if log_file.exists() {
        let _ = fs::OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(&log_file);
    }

    // 4. Asegurar eula.txt con eula=true
    let eula_file = folder_path.join("eula.txt");
    if !eula_file.exists() {
        let _ = fs::write(&eula_file, "eula=true\r\n");
    } else if let Ok(content) = fs::read_to_string(&eula_file) {
        if !content.to_lowercase().contains("eula=true") {
            let _ = fs::write(&eula_file, "eula=true\r\n");
        }
    }
}

#[tauri::command(rename_all = "snake_case")]
async fn launch_server_bat(
    folder: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<String, String> {
    guard.require_verified().await?;
    let base = PathBuf::from(&folder);
    if !base.exists() {
        return Err(format!("La carpeta del servidor no existe: {}", folder));
    }

    // Limpieza preventiva profunda de procesos java huérfanos y locks
    let folder_clone = folder.clone();
    tokio::task::spawn_blocking(move || {
        cleanup_server_locks_and_zombies(&folder_clone);
    })
    .await
    .map_err(|e| format!("Fallo en tarea de limpieza: {}", e))?;

    let bat_path = if base.join("iniciar.bat").exists() {
        base.join("iniciar.bat")
    } else if base.join("start.bat").exists() {
        base.join("start.bat")
    } else if base.join("run.bat").exists() {
        base.join("run.bat")
    } else {
        return Err("No se encontró iniciar.bat ni start.bat en la carpeta del servidor".to_string());
    };

    let child = Command::new("cmd")
        .args(["/c", bat_path.to_str().unwrap()])
        .current_dir(&folder)
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| format!("Error iniciando servidor: {}", e))?;

    {
        let mut proc_lock = MC_SERVER_PROCESS.lock().await;
        *proc_lock = Some(child);
        let mut f_lock = MC_SERVER_FOLDER.lock().await;
        *f_lock = Some(folder.clone());
    }

    Ok("Servidor Paper 1.20.1 iniciado en segundo plano sin consola externa".to_string())
}

#[tauri::command(rename_all = "snake_case")]
async fn stop_server_process(
    folder: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<String, String> {
    guard.require_verified().await?;
    {
        let mut proc_lock = MC_SERVER_PROCESS.lock().await;
        if let Some(mut child) = proc_lock.take() {
            let _ = child.kill();
        }
        let mut f_lock = MC_SERVER_FOLDER.lock().await;
        *f_lock = None;
    }
    let folder_clone = folder.clone();
    tokio::task::spawn_blocking(move || {
        cleanup_server_locks_and_zombies(&folder_clone);
    })
    .await
    .map_err(|e| format!("Fallo al detener servidor: {}", e))?;

    Ok("Servidor detenido y bloqueos liberados correctamente".to_string())
}

#[tauri::command(rename_all = "snake_case")]
async fn check_server_exists(folder: String) -> Result<bool, String> {
    let p = PathBuf::from(&folder);
    Ok(p.exists() && (p.join("paper.jar").exists() || p.join("iniciar.bat").exists() || p.join("start.bat").exists()))
}

#[tauri::command(rename_all = "snake_case")]
async fn check_server_running(folder: String) -> Result<bool, String> {
    let folder_path = PathBuf::from(&folder);
    let folder_name = folder_path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "minecraft_server".to_string());

    let ps_cmd = format!(
        "$procs = Get-CimInstance Win32_Process -Filter \"name = 'java.exe' or name = 'javaw.exe'\"; \
         $found = $false; \
         foreach ($p in $procs) {{ \
             if ($p.CommandLine -like '*paper.jar*' -or $p.CommandLine -like '*{f_name}*') {{ \
                 $found = $true; \
                 break; \
             }} \
         }}; \
         if ($found) {{ Write-Output 'RUNNING' }} else {{ Write-Output 'STOPPED' }}",
        f_name = folder_name
    );

    let out = tokio::task::spawn_blocking(move || {
        Command::new("powershell")
            .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_cmd])
            .creation_flags(CREATE_NO_WINDOW)
            .output()
    })
    .await
    .map_err(|e| e.to_string())?
    .map_err(|e| e.to_string())?;

    let text = String::from_utf8_lossy(&out.stdout);
    Ok(text.contains("RUNNING"))
}

#[tauri::command(rename_all = "snake_case")]
async fn download_file(
    url: String,
    target_path: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<String, String> {
    guard.require_verified().await?;
    if target_path.to_lowercase().ends_with(".jar")
        && !target_path.to_lowercase().ends_with("paper.jar")
    {
        guard.require_mc_plugins_permission().await?;
    }
    let target = PathBuf::from(&target_path);
    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Error creando directorio destino: {}", e))?;
    }
    let response = reqwest_download(&url).await?;
    fs::write(&target, response)
        .map_err(|e| format!("Error guardando archivo descargado: {}", e))?;
    Ok(format!("Descargado con éxito: {}", target_path))
}

#[tauri::command]
async fn get_license_status(
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<LicenseSessionStatus, String> {
    let st = guard.status.lock().await;
    Ok(st.clone())
}

#[tauri::command(rename_all = "snake_case")]
async fn activate_license_key(
    license_key: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<LicenseSessionStatus, String> {
    guard.activate_key(&license_key).await
}

#[tauri::command(rename_all = "snake_case")]
async fn login_with_password(
    email: String,
    password: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<LicenseSessionStatus, String> {
    guard.login_with_password(&email, &password).await
}

#[tauri::command(rename_all = "snake_case")]
async fn register_account(
    email: String,
    password: String,
    tiktok_username: String,
) -> Result<String, String> {
    LicenseGuard::register_account(&email, &password, &tiktok_username).await
}

#[tauri::command]
async fn logout_session(
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<LicenseSessionStatus, String> {
    LicenseGuard::clear_encrypted_session();
    let mut st = guard.status.lock().await;
    st.verified = false;
    st.username = String::new();
    st.role = "GUEST".to_string();
    st.bound_hwid = String::new();
    st.allow_mc_plugins = false;
    st.expires_at = 0;
    st.message = "Sesión cerrada. Inicia sesión para continuar.".to_string();
    st.cloud_connected = true;
    Ok(st.clone())
}

#[tauri::command]
async fn logout_license_session(
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<LicenseSessionStatus, String> {
    logout_session(guard).await
}

#[tauri::command]
async fn check_for_updates(app: tauri::AppHandle) -> Result<AppUpdateInfo, String> {
    let current_version = app.package_info().version.to_string();
    let updater = match app.updater() {
        Ok(u) => u,
        Err(e) => {
            return Ok(AppUpdateInfo {
                available: false,
                current_version: current_version.clone(),
                version: current_version,
                body: format!("Updater no disponible: {}", e),
                date: String::new(),
            });
        }
    };

    match updater.check().await {
        Ok(Some(upd)) => Ok(AppUpdateInfo {
            available: true,
            current_version,
            version: upd.version,
            body: upd.body.unwrap_or_default(),
            date: upd.date.map(|d| d.to_string()).unwrap_or_default(),
        }),
        Ok(None) => Ok(AppUpdateInfo {
            available: false,
            current_version: current_version.clone(),
            version: current_version,
            body: String::new(),
            date: String::new(),
        }),
        Err(e) => Ok(AppUpdateInfo {
            available: false,
            current_version: current_version.clone(),
            version: current_version,
            body: format!("Error verificando actualizaciones: {}", e),
            date: String::new(),
        }),
    }
}

#[tauri::command]
async fn install_update_with_progress(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    let update = updater
        .check()
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "No hay actualización disponible para instalar".to_string())?;

    let app_handle = app.clone();
    let mut downloaded = 0u64;

    update
        .download_and_install(
            move |chunk_length, content_length| {
                downloaded += chunk_length as u64;
                let pct = if let Some(total) = content_length {
                    if total > 0 {
                        ((downloaded as f64 / total as f64) * 100.0) as f32
                    } else {
                        0.0
                    }
                } else {
                    0.0
                };
                let _ = app_handle.emit(
                    "update-progress",
                    UpdateProgressPayload {
                        downloaded_bytes: downloaded,
                        total_bytes: content_length,
                        percentage: pct,
                        status: "downloading".to_string(),
                    },
                );
            },
            {
                let app_handle = app.clone();
                move || {
                    let _ = app_handle.emit(
                        "update-progress",
                        UpdateProgressPayload {
                            downloaded_bytes: downloaded,
                            total_bytes: None,
                            percentage: 100.0,
                            status: "installing".to_string(),
                        },
                    );
                }
            },
        )
        .await
        .map_err(|e| e.to_string())?;

    let _ = app.emit(
        "update-progress",
        UpdateProgressPayload {
            downloaded_bytes: downloaded,
            total_bytes: None,
            percentage: 100.0,
            status: "ready".to_string(),
        },
    );

    app.restart();
}

#[tauri::command(rename_all = "snake_case")]
async fn download_and_install_update(
    download_url: String,
    window: tauri::Window,
) -> Result<String, String> {
    let clean_url = download_url.trim().to_string();
    if clean_url.is_empty() {
        return Err("URL de descarga vacía".to_string());
    }

    let temp_exe = std::env::temp_dir().join("galactk-panel-update.exe");

    let _ = window.emit(
        "update-progress",
        UpdateProgressPayload {
            downloaded_bytes: 0,
            total_bytes: None,
            percentage: 5.0,
            status: "downloading".to_string(),
        },
    );

    let window_clone = window.clone();
    tokio::task::spawn(async move {
        for pct in [18.0, 35.0, 55.0, 75.0, 90.0] {
            tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
            let _ = window_clone.emit(
                "update-progress",
                UpdateProgressPayload {
                    downloaded_bytes: 0,
                    total_bytes: None,
                    percentage: pct,
                    status: "downloading".to_string(),
                },
            );
        }
    });

    let client = reqwest::Client::builder()
        .user_agent("GALACTK-PANEL-Updater/2.1")
        .build()
        .map_err(|e| format!("Error configurando cliente HTTP: {}", e))?;

    let resp = client
        .get(&clean_url)
        .send()
        .await
        .map_err(|e| format!("Error conectando con el servidor de descargas: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("Servidor de descarga devolvió HTTP {}", resp.status()));
    }

    let bytes = resp
        .bytes()
        .await
        .map_err(|e| format!("Error descargando datos del instalador: {}", e))?;

    std::fs::write(&temp_exe, &bytes)
        .map_err(|e| format!("Error guardando archivo temporal de actualización: {}", e))?;

    let meta = std::fs::metadata(&temp_exe).map_err(|e| e.to_string())?;
    if meta.len() < 1024 * 1024 {
        let _ = std::fs::remove_file(&temp_exe);
        return Err("El archivo descargado está incompleto o dañado.".to_string());
    }

    let _ = window.emit(
        "update-progress",
        UpdateProgressPayload {
            downloaded_bytes: meta.len(),
            total_bytes: Some(meta.len()),
            percentage: 100.0,
            status: "ready".to_string(),
        },
    );

    // Ejecutar el instalador nativo directamente sin powershell ni scripts intermediarios
    Command::new(&temp_exe)
        .spawn()
        .map_err(|e| format!("Error iniciando el instalador: {}", e))?;

    tokio::task::spawn(async {
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        std::process::exit(0);
    });

    Ok("Actualización descargada. Instalando...".to_string())
}

#[tauri::command]
async fn admin_list_streamers(
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<Vec<StreamerRecord>, String> {
    let st = guard.status.lock().await;
    if !st.verified || st.role != "ADMIN" {
        return Err(
            "Solo la cuenta administradora (GZ7) puede gestionar usuarios y licencias.".to_string(),
        );
    }
    drop(st);
    let reg = guard.registry.lock().await;
    Ok(reg.clone())
}

#[tauri::command(rename_all = "snake_case")]
async fn admin_create_streamer(
    username: String,
    days_valid: u64,
    allow_mc_plugins: bool,
    bind_hwid: Option<String>,
    notes: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<StreamerRecord, String> {
    let st = guard.status.lock().await;
    if !st.verified || st.role != "ADMIN" {
        return Err("Acceso restringido al administrador GZ7.".to_string());
    }
    drop(st);
    guard
        .create_streamer_license(username, days_valid, allow_mc_plugins, bind_hwid, notes)
        .await
}

#[tauri::command(rename_all = "snake_case")]
async fn admin_update_streamer(
    username: String,
    allow_mc_plugins: bool,
    is_active: bool,
    reset_hwid: bool,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<StreamerRecord, String> {
    let st = guard.status.lock().await;
    if !st.verified || st.role != "ADMIN" {
        return Err("Acceso restringido al administrador GZ7.".to_string());
    }
    drop(st);
    guard
        .update_streamer_permissions(username, allow_mc_plugins, is_active, reset_hwid)
        .await
}

#[tauri::command(rename_all = "snake_case")]
async fn admin_delete_streamer(
    username: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<(), String> {
    let st = guard.status.lock().await;
    if !st.verified || st.role != "ADMIN" {
        return Err("Acceso restringido al administrador GZ7.".to_string());
    }
    drop(st);
    guard.delete_streamer(username).await
}

#[tauri::command]
async fn admin_get_cloud_config(
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<CloudLicenseConfig, String> {
    let cfg = guard.cloud_config.lock().await;
    Ok(cfg.clone())
}

#[tauri::command(rename_all = "snake_case")]
async fn admin_save_cloud_config(
    supabase_url: String,
    supabase_anon_key: String,
    assets_cdn_base_url: String,
    plugins_base_url: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<CloudLicenseConfig, String> {
    let st = guard.status.lock().await;
    if !st.verified || st.role != "ADMIN" {
        return Err("Acceso restringido al administrador GZ7.".to_string());
    }
    drop(st);
    let new_cfg = CloudLicenseConfig {
        supabase_url: supabase_url.trim().to_string(),
        supabase_anon_key: supabase_anon_key.trim().to_string(),
        assets_cdn_base_url: assets_cdn_base_url.trim().to_string(),
        plugins_base_url: plugins_base_url.trim().to_string(),
    };
    LicenseGuard::save_cloud_config_disk(&new_cfg);
    let mut cfg = guard.cloud_config.lock().await;
    *cfg = new_cfg.clone();
    Ok(new_cfg)
}

#[tauri::command]
async fn check_streamer_environment() -> Result<EnvironmentHealth, String> {
    Ok(check_environment_health())
}

#[tauri::command(rename_all = "snake_case")]
async fn install_authorized_mc_plugins(
    server_folder: String,
    guard: State<'_, Arc<LicenseGuard>>,
) -> Result<PluginDeployReport, String> {
    deploy_authorized_mc_plugins(&server_folder, &guard).await
}

#[tauri::command]
async fn set_gift_scale(
    scale: u32,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.set_scale(scale).await;
    Ok(())
}

#[tauri::command]
async fn push_duel(
    side: String,
    power: f32,
    donor: String,
    gift_name: String,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.push_duel(&side, power, &donor, &gift_name).await;
    Ok(())
}

#[tauri::command]
async fn modify_gvg_win(
    delta: i32,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.modify_win(delta).await;
    Ok(())
}

#[tauri::command]
async fn set_gvg_target_wins(
    target: i32,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.set_target_wins(target).await;
    Ok(())
}

#[tauri::command]
async fn reset_gvg_wins(state: State<'_, Arc<OverlayServerState>>) -> Result<(), String> {
    state.reset_wins().await;
    Ok(())
}

#[tauri::command]
async fn reset_gvg_ronda(state: State<'_, Arc<OverlayServerState>>) -> Result<(), String> {
    state.reset_ronda().await;
    Ok(())
}

#[tauri::command]
async fn add_gvg_points(
    team: String,
    points: i32,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.add_gvg_points(&team, points).await;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn update_roblox_overlay_config(
    config_json: String,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.update_roblox_config(&config_json).await
}

#[tauri::command(rename_all = "snake_case")]
async fn update_mc_overlay_config(
    config_json: String,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.update_mc_overlay(&config_json).await
}

#[tauri::command]
async fn emit_overlay_gift(
    user: String,
    title: String,
    coins: u32,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.emit_gift(&user, &title, coins).await;
    Ok(())
}

#[tauri::command]
async fn emit_overlay_like(
    user: String,
    count: u32,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.emit_like(&user, count).await;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn emit_custom_alert(
    alert_json: String,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.emit_custom_alert(&alert_json).await
}

#[tauri::command(rename_all = "snake_case")]
async fn update_top_settings(
    settings: serde_json::Value,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    let mut s = state.top_settings.lock().await;
    *s = settings.clone();
    let update_msg = serde_json::json!({
        "type": "top_settings",
        "settings": settings
    })
    .to_string();
    let _ = state.tx.send(update_msg);
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn emit_session_mvp(
    username: String,
    gift_name: String,
    coins: u64,
    state: State<'_, Arc<OverlayServerState>>,
) -> Result<(), String> {
    state.update_session_mvp(&username, &gift_name, coins).await;
    Ok(())
}

fn decode_base64_simple(input: &str) -> Result<Vec<u8>, String> {
    let raw = if let Some(idx) = input.find(',') {
        &input[idx + 1..]
    } else {
        input
    };
    let mut out = Vec::with_capacity(raw.len() * 3 / 4);
    let mut buf: u32 = 0;
    let mut bits: u8 = 0;
    for b in raw.bytes() {
        let val = match b {
            b'A'..=b'Z' => b - b'A',
            b'a'..=b'z' => b - b'a' + 26,
            b'0'..=b'9' => b - b'0' + 52,
            b'+' => 62,
            b'/' => 63,
            b'=' | b'\r' | b'\n' | b' ' => continue,
            _ => continue,
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

#[tauri::command(rename_all = "snake_case")]
async fn save_uploaded_media(filename: String, base64_data: String) -> Result<String, String> {
    let safe_name: String = filename
        .chars()
        .map(|c| {
            if c.is_alphanumeric() || "._-".contains(c) {
                c
            } else {
                '_'
            }
        })
        .collect();
    let final_name = format!(
        "{}_{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis())
            .unwrap_or(0),
        safe_name
    );
    let custom_dir = resolve_custom_media_dir();
    fs::create_dir_all(&custom_dir).map_err(|e| format!("Error creando carpeta custom: {}", e))?;
    let bytes = decode_base64_simple(&base64_data)?;
    let target = custom_dir.join(&final_name);
    fs::write(&target, bytes).map_err(|e| format!("Error guardando media personalizado: {}", e))?;
    Ok(format!(
        "http://localhost:4000/s2e_media/custom/{}",
        final_name
    ))
}

#[tauri::command]
async fn speak_tts_native(text: String, rate: i32, volume: u32) -> Result<(), String> {
    let clean: String = text
        .chars()
        .filter(|c| c.is_alphanumeric() || c.is_whitespace() || ",.!?¡¿@-_:;()'\"".contains(*c))
        .take(240)
        .collect();
    let trimmed = clean.trim();
    if trimmed.is_empty() {
        return Ok(());
    }
    let clamped_rate = rate.clamp(-5, 5);
    let clamped_vol = volume.clamp(0, 100);
    let safe_text = trimmed
        .replace('\'', "''")
        .replace('\n', " ")
        .replace('\r', " ");
    let ps_cmd = format!(
        "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = {}; $s.Volume = {}; $s.Speak('{}');",
        clamped_rate,
        clamped_vol,
        safe_text
    );
    tokio::task::spawn_blocking(move || {
        let _ = Command::new(r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe")
            .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_cmd])
            .creation_flags(CREATE_NO_WINDOW)
            .output();
    });
    Ok(())
}

#[tauri::command]
async fn start_tiktok_sidecar(username: String, api_key: Option<String>) -> Result<String, String> {
    let clean: String = username
        .trim()
        .trim_start_matches('@')
        .chars()
        .filter(|c| c.is_alphanumeric() || "._-".contains(*c))
        .take(64)
        .collect();
    if clean.is_empty() {
        return Err("Usuario inválido".to_string());
    }

    // Solo detener el proceso iniciado por este panel; nunca cerrar otros node.exe del usuario.
    stop_tiktok_sidecar().await?;

    // Resolución dinámica del script tiktok-sidecar.mjs
    let mut resolved_script: Option<PathBuf> = None;
    let mut resolved_cwd: Option<PathBuf> = None;

    if let Ok(exe_dir) = std::env::current_exe().map(|p| p.parent().unwrap_or(&p).to_path_buf()) {
        let bundled = exe_dir.join("tiktok-runtime").join("tiktok-sidecar.mjs");
        let p1 = if bundled.exists() { bundled } else { exe_dir.join("tiktok-sidecar.mjs") };
        if p1.exists() {
            resolved_script = Some(p1);
            resolved_cwd = resolved_script.as_ref().and_then(|p| p.parent().map(|v| v.to_path_buf()));
        } else {
            let p2 = exe_dir.join("resources").join("tiktok-sidecar.mjs");
            if p2.exists() {
                resolved_script = Some(p2);
                resolved_cwd = Some(exe_dir.join("resources"));
            }
        }
    }

    if resolved_script.is_none() {
        let candidates = [
            PathBuf::from(r"C:\Proyectos\GalacticLive\tiktok-sidecar.mjs"),
            PathBuf::from(r"C:\Users\GZ7\AppData\Local\Programs\GZ7Live\tiktok-sidecar.mjs"),
        ];
        for c in &candidates {
            if c.exists() {
                resolved_script = Some(c.clone());
                resolved_cwd = c.parent().map(|p| p.to_path_buf());
                break;
            }
        }
    }

    if let (Some(script_path), Some(cwd)) = (resolved_script, resolved_cwd) {
        let bundled_node = cwd.join("node.exe");
        let bundled_node_str = bundled_node.to_string_lossy().to_string();
        let node_candidates = [bundled_node_str.as_str(), r"C:\Program Files\nodejs\node.exe", "node"];
        let mut last_error = String::new();
        for node_bin in node_candidates {
            let mut cmd = Command::new(node_bin);
            cmd.arg(&script_path).arg(&clean);
            if let Some(ref k) = api_key {
                let trimmed = k.trim();
                if !trimmed.is_empty() {
                    cmd.arg(trimmed);
                }
            }
            match cmd.current_dir(&cwd).creation_flags(CREATE_NO_WINDOW).spawn() {
                Ok(mut child) => {
                    tokio::time::sleep(tokio::time::Duration::from_millis(450)).await;
                    match child.try_wait() {
                        Ok(Some(status)) => {
                            last_error = format!("El conector terminó al iniciar ({})", status);
                            continue;
                        }
                        Err(error) => {
                            last_error = error.to_string();
                            continue;
                        }
                        Ok(None) => {}
                    }
                    *TIKTOK_SIDECAR.lock().await = Some(child);
                    return Ok(format!("Conector TikTok iniciado para @{}", clean));
                }
                Err(error) => last_error = error.to_string(),
            }
        }
        return Err(format!("No se pudo iniciar el conector TikTok: {}", last_error));
    }
    Err("No se encontró el conector TikTok en la instalación".to_string())
}

#[tauri::command]
async fn stop_tiktok_sidecar() -> Result<(), String> {
    if let Some(mut child) = TIKTOK_SIDECAR.lock().await.take() {
        let _ = child.kill();
        let _ = child.wait();
    }
    Ok(())
}

async fn reqwest_download(url: &str) -> Result<Vec<u8>, String> {
    let client = reqwest::Client::builder()
        .user_agent("GALACTK-PANEL/2.1")
        .build()
        .map_err(|e| format!("Error creando cliente HTTP: {}", e))?;
    let resp = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Error conectando: {}", e))?;
    if !resp.status().is_success() {
        return Err(format!("HTTP Error {}", resp.status()));
    }
    let bytes = resp.bytes().await.map_err(|e| format!("Error descargando datos: {}", e))?;
    Ok(bytes.to_vec())
}

fn main() {
    let overlay_state = Arc::new(OverlayServerState::new());
    let license_guard = LicenseGuard::new();
    start_overlay_http_server(Arc::clone(&overlay_state));
    preload_core_soundpack();

    // Bucle ligero de fondo para Visión Nocturna Infinita (anti-wipe por tótems)
    std::thread::spawn(|| {
        let rt = match tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
        {
            Ok(r) => r,
            Err(e) => {
                eprintln!("[NIGHT_VISION] Error iniciando runtime Tokio: {}", e);
                return;
            }
        };

        rt.block_on(async {
            loop {
                tokio::time::sleep(tokio::time::Duration::from_millis(2500)).await;
                let cfg = {
                    let lock = NIGHT_VISION_CONFIG.lock().await;
                    lock.clone()
                };
                if cfg.enabled && !cfg.player.is_empty() && !cfg.host.is_empty() {
                    if let Ok(mut client) = rcon::RconClient::connect(&cfg.host, cfg.port, &cfg.password).await {
                        let cmd1 = format!("effect give {} minecraft:night_vision infinite 0 true", cfg.player);
                        if client.send_command(&cmd1).await.is_err() {
                            let cmd2 = format!("effect give {} minecraft:night_vision 999999 0 true", cfg.player);
                            let _ = client.send_command(&cmd2).await;
                        }
                    }
                }
            }
        });
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } | tauri::WindowEvent::Destroyed = event {
                if let Ok(mut f_lock) = MC_SERVER_FOLDER.try_lock() {
                    if let Some(folder) = f_lock.take() {
                        cleanup_server_locks_and_zombies(&folder);
                    }
                }
                if let Ok(mut proc_lock) = MC_SERVER_PROCESS.try_lock() {
                    if let Some(mut child) = proc_lock.take() {
                        let _ = child.kill();
                    }
                }
                if let Ok(mut sc) = TIKTOK_SIDECAR.try_lock() {
                    if let Some(mut child) = sc.take() {
                        let _ = child.kill();
                    }
                }
            }
        })
        .manage(overlay_state)
        .manage(license_guard)
        .invoke_handler(tauri::generate_handler![
            check_for_updates,
            install_update_with_progress,
            download_and_install_update,
            login_with_password,
            register_account,
            logout_session,
            send_rcon,
            set_night_vision,
            inject_mc_session_pass,
            save_config,
            load_config,
            write_server_file,
            launch_server_bat,
            stop_server_process,
            check_server_exists,
            check_server_running,
            download_file,
            get_license_status,
            activate_license_key,
            logout_license_session,
            admin_list_streamers,
            admin_create_streamer,
            admin_update_streamer,
            admin_delete_streamer,
            admin_get_cloud_config,
            admin_save_cloud_config,
            check_streamer_environment,
            install_authorized_mc_plugins,
            set_gift_scale,
            push_duel,
            modify_gvg_win,
            set_gvg_target_wins,
            reset_gvg_wins,
            reset_gvg_ronda,
            add_gvg_points,
            update_roblox_overlay_config,
            update_mc_overlay_config,
            emit_overlay_gift,
            emit_overlay_like,
            emit_custom_alert,
            save_uploaded_media,
            speak_tts_native,
            start_tiktok_sidecar,
            stop_tiktok_sidecar,
            update_top_settings,
            emit_session_mvp
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
