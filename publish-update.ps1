<#
.SYNOPSIS
  Script de Publicación y Despliegue de Actualizaciones en 1 Clic para GALACTK PANEL.
.DESCRIPTION
  Actualiza los números de versión en tauri.conf.json, Cargo.toml y ui/src/modules/auto-updater.js,
  compila el instalador NSIS de producción y publica el release en GitHub automáticamente.
.PARAMETER Version
  Nueva versión SemVer (ej. "2.0.3").
.PARAMETER Notes
  Notas del parche / descripción del release.
#>
param(
    [string]$Version = "2.0.3",
    [string]$Notes = "Actualización y mejoras en GALACTK PANEL"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 GALACTK PANEL — Publicador de Actualizaciones OTA" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Validar formato de versión
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Host "❌ Error: La versión '$Version' debe tener formato semver x.y.z (ej: 2.0.3)" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Actualizando versión a v$Version en configuración..." -ForegroundColor Yellow

# Restaurar PATH del sistema
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + 
            [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + 
            "C:\Program Files\nodejs;C:\Program Files\Git\cmd;C:\Users\GZ7\.cargo\bin;C:\Program Files\GitHub CLI"

$ProjectRoot = "C:\Proyectos\GalacticLive"
$TauriConfPath = Join-Path $ProjectRoot "src-tauri\tauri.conf.json"
$CargoTomlPath = Join-Path $ProjectRoot "src-tauri\Cargo.toml"
$AutoUpdaterJsPath = Join-Path $ProjectRoot "ui\src\modules\auto-updater.js"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Actualizar tauri.conf.json (sin BOM para que serde_json no falle)
if (Test-Path $TauriConfPath) {
    $tauriContent = Get-Content -Raw -Path $TauriConfPath -Encoding UTF8
    $tauriUpdated = $tauriContent -replace '("version"\s*:\s*")[^"]+(")', "`${1}$Version`${2}"
    [System.IO.File]::WriteAllText($TauriConfPath, $tauriUpdated, $utf8NoBom)
    Write-Host "  ✔ tauri.conf.json actualizado a v$Version" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ No se encontró $TauriConfPath" -ForegroundColor Red
}

# Actualizar Cargo.toml (SOLO en la sección [package], sin tocar dependencies)
if (Test-Path $CargoTomlPath) {
    $cargoContent = Get-Content -Raw -Path $CargoTomlPath -Encoding UTF8
    $cargoRegex = [regex]'(\[package\][\s\S]*?version\s*=\s*")[^"]+(")'
    $cargoUpdated = $cargoRegex.Replace($cargoContent, "`${1}$Version`${2}", 1)
    [System.IO.File]::WriteAllText($CargoTomlPath, $cargoUpdated, $utf8NoBom)
    Write-Host "  ✔ Cargo.toml ([package]) actualizado a v$Version" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ No se encontró $CargoTomlPath" -ForegroundColor Red
}

# Actualizar ui/src/modules/auto-updater.js
if (Test-Path $AutoUpdaterJsPath) {
    $jsContent = Get-Content -Raw -Path $AutoUpdaterJsPath -Encoding UTF8
    $jsUpdated = $jsContent -replace "const CURRENT_VERSION = '[^']+';", "const CURRENT_VERSION = '$Version';"
    [System.IO.File]::WriteAllText($AutoUpdaterJsPath, $jsUpdated, $utf8NoBom)
    Write-Host "  ✔ auto-updater.js sincronizado a v$Version" -ForegroundColor Green
}

# 2. Compilar aplicación de producción con Tauri CLI
Write-Host "`n[2/5] Compilando instalador de producción (NSIS)..." -ForegroundColor Yellow
$BuildStart = Get-Date

Set-Location $ProjectRoot
$buildArgs = @("build")
& npx.cmd @tauri-apps/cli @buildArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error durante la compilación de Tauri." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "  ✔ Compilación finalizada con éxito." -ForegroundColor Green

# 3. Ubicar instalador .exe generado
Write-Host "`n[3/5] Localizando instalador .exe en target/release/bundle/nsis/..." -ForegroundColor Yellow
$NsisDir = Join-Path $ProjectRoot "src-tauri\target\release\bundle\nsis"

if (-not (Test-Path $NsisDir)) {
    Write-Host "❌ No se encontró la carpeta de salida NSIS: $NsisDir" -ForegroundColor Red
    exit 1
}

$Installer = Get-ChildItem -Path $NsisDir -Filter "*.exe" | 
             Where-Object { $_.LastWriteTime -ge $BuildStart.AddMinutes(-5) } | 
             Sort-Object LastWriteTime -Descending | 
             Select-Object -First 1

if (-not $Installer) {
    $Installer = Get-ChildItem -Path $NsisDir -Filter "*.exe" | 
                 Sort-Object LastWriteTime -Descending | 
                 Select-Object -First 1
}

if (-not $Installer) {
    Write-Host "❌ No se encontró ningún instalador .exe generado en $NsisDir" -ForegroundColor Red
    exit 1
}

$InstallerPath = $Installer.FullName
$InstallerSizeMb = [math]::Round($Installer.Length / 1MB, 2)
Write-Host "  ✔ Instalador localizado: $($Installer.Name) ($InstallerSizeMb MB)" -ForegroundColor Green
Write-Host "    Ruta: $InstallerPath" -ForegroundColor Gray

# 4. Publicar release en GitHub (cyber-gz7/galactik-landing)
Write-Host "`n[4/5] Preparando publicación en GitHub Releases..." -ForegroundColor Yellow
$RepoName = "cyber-gz7/galactik-landing"
$TagName = "v$Version"

function Write-OutputInstructions($path, $tag, $repo) {
    Write-Host "`n----------------------------------------------------------" -ForegroundColor Cyan
    Write-Host " INSTRUCCIONES PARA SUBIR MANUALMENTE EL INSTALADOR:" -ForegroundColor Cyan
    Write-Host " 1. Entra a: https://github.com/$repo/releases/new" -ForegroundColor White
    Write-Host " 2. Crea un nuevo Tag: $tag" -ForegroundColor White
    Write-Host " 3. Título del Release: GALACTK PANEL $tag" -ForegroundColor White
    Write-Host " 4. Arrastra y suelta el instalador generado:" -ForegroundColor Yellow
    Write-Host "    $path" -ForegroundColor Green
    Write-Host " 5. Marca 'Set as the latest release' y haz clic en 'Publish release'." -ForegroundColor White
    Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
}

$ghCommand = Get-Command gh -ErrorAction SilentlyContinue

if ($ghCommand) {
    Write-Host "  ✔ GitHub CLI (gh) detectado. Publicando release $TagName..." -ForegroundColor Cyan
    try {
        & gh release create $TagName $InstallerPath --title "GALACTK PANEL $TagName" --notes "$Notes" --latest --repo $RepoName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n==========================================================" -ForegroundColor Green
            Write-Host " 🎉 ¡ACTUALIZACIÓN PUBLICADA CON ÉXITO EN GITHUB RELEASES!" -ForegroundColor Green
            Write-Host " Tag: $TagName" -ForegroundColor White
            Write-Host " Repositorio: https://github.com/$RepoName/releases/tag/$TagName" -ForegroundColor Cyan
            Write-Host " A todos los streamers les aparecerá el botón '🚀 ¡Nueva Versión $TagName Lista!' al abrir la app." -ForegroundColor White
            Write-Host "==========================================================" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Advertencia: 'gh release create' retornó código $LASTEXITCODE. Revisa si el tag ya existe o si falta autenticar 'gh auth login'." -ForegroundColor Yellow
            Write-OutputInstructions $InstallerPath $TagName $RepoName
        }
    } catch {
        Write-Host "⚠️ Error ejecutando gh: $_" -ForegroundColor Yellow
        Write-OutputInstructions $InstallerPath $TagName $RepoName
    }
} else {
    Write-Host "  ℹ GitHub CLI (gh) no está instalado en el sistema." -ForegroundColor Yellow
    Write-OutputInstructions $InstallerPath $TagName $RepoName
}

Write-Host "`n[5/5] Proceso finalizado." -ForegroundColor Cyan
