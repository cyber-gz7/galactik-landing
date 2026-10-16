use crate::license_guard::{hex_encode, sha256_bytes, LicenseGuard};
use serde::{Deserialize, Serialize};
use std::fs;
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::Command;

const CREATE_NO_WINDOW: u32 = 0x08000000;

pub fn get_app_data_root() -> PathBuf {
    let base = std::env::var("LOCALAPPDATA")
        .or_else(|_| std::env::var("USERPROFILE"))
        .unwrap_or_else(|_| ".".to_string());
    let dir = PathBuf::from(base).join("GalacticLive");
    let _ = fs::create_dir_all(&dir);
    dir
}

pub fn resolve_s2e_media_dir() -> PathBuf {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(exe_dir) = exe.parent() {
            for sub in [
                "s2e_media",
                "resources/s2e_media",
                "resources/_up_/s2e_media",
            ] {
                let candidate = exe_dir.join(sub.replace('/', "\\"));
                if candidate.exists() {
                    return candidate;
                }
            }
            if let Some(parent) = exe_dir.parent() {
                let parent_media = parent.join("s2e_media");
                if parent_media.exists() {
                    return parent_media;
                }
            }
        }
    }
    if let Ok(local_app) = std::env::var("LOCALAPPDATA") {
        let local_prog = PathBuf::from(&local_app)
            .join("Programs")
            .join("GZ7Live")
            .join("s2e_media");
        if local_prog.exists() {
            return local_prog;
        }
        let local_prog_lower = PathBuf::from(&local_app)
            .join("Programs")
            .join("gz7live")
            .join("s2e_media");
        if local_prog_lower.exists() {
            return local_prog_lower;
        }
    }
    let fallback = get_app_data_root().join("s2e_media");
    let _ = fs::create_dir_all(fallback.join("audio").join("public"));
    let _ = fs::create_dir_all(fallback.join("custom"));
    fallback
}

pub fn resolve_custom_media_dir() -> PathBuf {
    let media_dir = resolve_s2e_media_dir().join("custom");
    if fs::create_dir_all(&media_dir).is_ok() {
        return media_dir;
    }
    let fallback = get_app_data_root().join("s2e_media").join("custom");
    let _ = fs::create_dir_all(&fallback);
    fallback
}

pub fn resolve_gifts_dir() -> PathBuf {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(exe_dir) = exe.parent() {
            for candidate in [
                exe_dir.join("ui").join("gifts"),
                exe_dir.join("gifts"),
                exe_dir.join("..").join("ui").join("gifts"),
                exe_dir.join("..").join("..").join("ui").join("gifts"),
                exe_dir
                    .join("..")
                    .join("..")
                    .join("..")
                    .join("ui")
                    .join("gifts"),
            ] {
                if candidate.exists() {
                    return candidate;
                }
            }
        }
    }
    let dev_path = PathBuf::from(r"C:\Proyectos\GalacticLive\ui\gifts");
    if dev_path.exists() {
        return dev_path;
    }
    if let Ok(local_app) = std::env::var("LOCALAPPDATA") {
        for folder in ["GZ7Live", "gz7live", "GalacticLive", "galacticlive"] {
            let candidate = PathBuf::from(&local_app)
                .join("Programs")
                .join(folder)
                .join("ui")
                .join("gifts");
            if candidate.exists() {
                return candidate;
            }
        }
    }
    let fallback = get_app_data_root().join("gifts");
    let _ = fs::create_dir_all(&fallback);
    fallback
}

pub fn resolve_plugins_vault_dir() -> PathBuf {
    let vault = get_app_data_root().join("plugins-autorizados");
    let _ = fs::create_dir_all(&vault);
    vault
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct EnvironmentHealth {
    pub java_installed: bool,
    pub java_version: String,
    pub free_sounds_count: usize,
    pub gift_icons_count: usize,
    pub available_mc_plugins: Vec<String>,
    pub s2e_media_path: String,
    pub gifts_path: String,
    pub app_data_path: String,
}

fn count_files_in_dir(dir: &Path, ext: &str) -> usize {
    if let Ok(entries) = fs::read_dir(dir) {
        entries
            .flatten()
            .filter(|e| {
                e.path()
                    .extension()
                    .and_then(|s| s.to_str())
                    .map(|s| s.eq_ignore_ascii_case(ext))
                    .unwrap_or(false)
            })
            .count()
    } else {
        0
    }
}

fn discover_local_plugin_sources() -> Vec<PathBuf> {
    let mut dirs = vec![resolve_plugins_vault_dir()];
    if let Ok(exe) = std::env::current_exe() {
        if let Some(exe_dir) = exe.parent() {
            dirs.push(exe_dir.join("plugins-mc"));
        }
    }
    if let Ok(appdata) = std::env::var("APPDATA") {
        dirs.push(
            PathBuf::from(appdata)
                .join("MiniLive")
                .join("plugins-cuenta"),
        );
    }
    if let Ok(profile) = std::env::var("USERPROFILE") {
        dirs.push(
            PathBuf::from(&profile)
                .join("Desktop")
                .join("MINESERVER")
                .join("plugins"),
        );
        dirs.push(
            PathBuf::from(&profile)
                .join("Desktop")
                .join("mi-startup-mvp")
                .join("PLUGINS_MINELIVE"),
        );
    }
    dirs
}

pub fn check_environment_health() -> EnvironmentHealth {
    let mut java_installed = false;
    let mut java_version = "No detectado (Instala Java 17+)".to_string();

    if let Ok(out) = Command::new("java")
        .arg("-version")
        .creation_flags(CREATE_NO_WINDOW)
        .output()
    {
        let combined = format!(
            "{}\n{}",
            String::from_utf8_lossy(&out.stderr),
            String::from_utf8_lossy(&out.stdout)
        );
        if let Some(first_line) = combined.lines().find(|l| !l.trim().is_empty()) {
            java_installed = out.status.success() || first_line.to_lowercase().contains("version");
            java_version = first_line.trim().to_string();
        }
    }

    let media_dir = resolve_s2e_media_dir();
    let gifts_dir = resolve_gifts_dir();
    let free_sounds_count = count_files_in_dir(&media_dir.join("audio").join("public"), "mp3");
    let gift_icons_count = count_files_in_dir(&gifts_dir, "webp");

    let mut plugins_set = std::collections::BTreeSet::new();
    for dir in discover_local_plugin_sources() {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                let p = entry.path();
                if p.extension().and_then(|s| s.to_str()) == Some("jar") {
                    if let Some(name) = p.file_name().and_then(|n| n.to_str()) {
                        plugins_set.insert(name.to_string());
                    }
                }
            }
        }
    }

    EnvironmentHealth {
        java_installed,
        java_version,
        free_sounds_count,
        gift_icons_count,
        available_mc_plugins: plugins_set.into_iter().collect(),
        s2e_media_path: media_dir.to_string_lossy().to_string(),
        gifts_path: gifts_dir.to_string_lossy().to_string(),
        app_data_path: get_app_data_root().to_string_lossy().to_string(),
    }
}

pub async fn download_bytes_silent(url: &str, referer: Option<&str>) -> Result<Vec<u8>, String> {
    let ref_clause = if let Some(r) = referer {
        format!("$wc.Headers.Add('Referer', '{}'); ", r.replace('\'', ""))
    } else {
        String::new()
    };
    let ps_cmd = format!(
        "& {{ [Net.ServicePointManager]::SecurityProtocol='Tls12'; $wc = New-Object Net.WebClient; {}$wc.DownloadData('{}') }}",
        ref_clause,
        url.replace('\'', "%27")
    );
    let output = Command::new(r"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe")
        .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", &ps_cmd])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map_err(|e| format!("Error iniciando descarga segura: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).trim().to_string());
    }
    Ok(output.stdout)
}

pub async fn ensure_sound_downloaded(relative_audio_path: &str) -> Result<String, String> {
    let clean_rel = relative_audio_path
        .trim_start_matches('/')
        .trim_start_matches("s2e_media/");
    let media_dir = resolve_s2e_media_dir();
    let local_target = media_dir.join(clean_rel.replace('/', "\\"));

    if local_target.exists() {
        return Ok(format!("http://localhost:4000/s2e_media/{}", clean_rel));
    }

    if let Some(parent) = local_target.parent() {
        let _ = fs::create_dir_all(parent);
    }

    let encoded_rel = clean_rel.replace(' ', "%20");
    let upstream_url = format!(
        "https://streamtoearnprod1.s3.eu-central-1.amazonaws.com/{}",
        encoded_rel
    );
    let bytes = download_bytes_silent(&upstream_url, Some("https://app.streamtoearn.io/")).await?;
    fs::write(&local_target, &bytes)
        .map_err(|e| format!("Error guardando audio en caché local: {}", e))?;
    Ok(format!("http://localhost:4000/s2e_media/{}", clean_rel))
}

pub fn preload_core_soundpack() {
    std::thread::spawn(|| {
        if let Ok(rt) = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
        {
            rt.block_on(async {
                let core_sounds = [
                    "audio/public/1708877462401_crack_the_whip.mp3",
                    "audio/public/1791367188643_police-siren-sound-effect.mp3",
                    "audio/public/1699891902848_thunder-v1.mp3",
                    "audio/public/1709334254471_epic-song-30s.mp3",
                    "audio/public/1699518576778_tnt.mp3",
                    "audio/public/1699892960228_wow-anime.mp3",
                    "audio/public/1699891800834_zombie-minecraft.mp3",
                    "audio/public/1701804998094_wilhelm-scream.mp3",
                ];

                let target_dir = get_app_data_root().join("s2e_media");
                let _ = fs::create_dir_all(target_dir.join("audio").join("public"));

                for rel in core_sounds {
                    let local_path = target_dir.join(rel.replace('/', "\\"));
                    if !local_path.exists() {
                        let _ = ensure_sound_downloaded(rel).await;
                    }
                }
            });
        }
    });
}

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct PluginDeployReport {
    pub deployed_count: usize,
    pub deployed_files: Vec<String>,
    pub target_plugins_dir: String,
    pub pass_token_injected: String,
}

pub async fn deploy_authorized_mc_plugins(
    server_folder: &str,
    guard: &LicenseGuard,
) -> Result<PluginDeployReport, String> {
    let session = guard.require_mc_plugins_permission().await?;

    let target_plugins_dir = PathBuf::from(server_folder).join("plugins");
    fs::create_dir_all(&target_plugins_dir)
        .map_err(|e| format!("Error creando carpeta plugins del servidor: {}", e))?;

    let mut deployed_files = Vec::new();
    let sources = discover_local_plugin_sources();

    for src_dir in sources {
        if let Ok(entries) = fs::read_dir(&src_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().and_then(|s| s.to_str()) == Some("jar") {
                    if let Some(fname) = path.file_name().and_then(|n| n.to_str()) {
                        let dest = target_plugins_dir.join(fname);
                        if !dest.exists() || src_dir != target_plugins_dir {
                            if fs::copy(&path, &dest).is_ok() {
                                if !deployed_files.contains(&fname.to_string()) {
                                    deployed_files.push(fname.to_string());
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Si es la PC de un streamer externo y aún no tiene los .jar en caché, descargarlos desde plugins_base_url
    if deployed_files.is_empty() {
        let cloud_cfg = guard.cloud_config.lock().await.clone();
        if !cloud_cfg.plugins_base_url.is_empty() {
            let core_plugins = [
                "MiniLiveCore-1.0.0.jar",
                "MiniLiveRuleta-1.0.0.jar",
                "MiniLiveEscudo-1.0.0.jar",
                "MiniLiveTotems-1.0.0.jar",
            ];
            let vault = resolve_plugins_vault_dir();
            for jar_name in core_plugins {
                let url = format!(
                    "{}/{}",
                    cloud_cfg.plugins_base_url.trim_end_matches('/'),
                    jar_name
                );
                if let Ok(bytes) = download_bytes_silent(&url, None).await {
                    if bytes.len() > 1024 && bytes.starts_with(b"PK") {
                        let vault_file = vault.join(jar_name);
                        let _ = fs::write(&vault_file, &bytes);
                        let dest = target_plugins_dir.join(jar_name);
                        if fs::write(&dest, &bytes).is_ok() {
                            deployed_files.push(jar_name.to_string());
                        }
                    }
                }
            }
        }
    }

    let server_hash = hex_encode(&sha256_bytes(server_folder.as_bytes())[..6]);
    let pass_token = crate::license_guard::generate_mc_server_pass(&server_hash, &session.username);

    // Escribir archivo de pase firmado en plugins/GalacticLive/session_pass.txt para que el plugin Java lo valide
    let gl_plugin_dir = target_plugins_dir.join("GalacticLive");
    let _ = fs::create_dir_all(&gl_plugin_dir);
    let _ = fs::write(gl_plugin_dir.join("session_pass.txt"), &pass_token);

    Ok(PluginDeployReport {
        deployed_count: deployed_files.len(),
        deployed_files,
        target_plugins_dir: target_plugins_dir.to_string_lossy().to_string(),
        pass_token_injected: pass_token,
    })
}
