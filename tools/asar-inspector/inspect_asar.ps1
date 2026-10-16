#Requires -Version 5.1
<#
.SYNOPSIS
    Herramienta de inspección ASAR segura — GalacticLive Toolkit
.DESCRIPTION
    Copia un .asar externo a temp_dump\ antes de cualquier operación.
    JAMÁS toca el .asar original en AppData ni en ninguna instalación en vivo.
    Requiere tener `asar` instalado globalmente: npm install -g @electron/asar
.PARAMETER AsarPath
    Ruta absoluta al archivo .asar que quieres inspeccionar (solo lectura).
.PARAMETER Action
    "list"    → Lista todos los archivos dentro del .asar
    "extract" → Extrae contenido completo en temp_dump\<nombre>\
    "read"    → Lee un archivo específico interno sin extraer todo
.PARAMETER InternalFile
    (Solo para -Action read) Ruta interna dentro del .asar, ej: "app/main.js"
.EXAMPLE
    .\inspect_asar.ps1 -AsarPath "C:\Users\GZ7\AppData\Local\Programs\OtroApp\resources\app.asar" -Action list
.EXAMPLE
    .\inspect_asar.ps1 -AsarPath "C:\ruta\app.asar" -Action read -InternalFile "app/package.json"
#>

param(
    [Parameter(Mandatory)][string]$AsarPath,
    [ValidateSet("list","extract","read")][string]$Action = "list",
    [string]$InternalFile = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Rutas del sandbox ────────────────────────────────────────────────────────
$SCRIPT_DIR = $PSScriptRoot
$TEMP_DUMP  = Join-Path $SCRIPT_DIR "temp_dump"

# Zonas de AppData protegidas — inspector NUNCA opera directamente sobre ellas
$PROTECTED_PATHS = @(
    "$env:LOCALAPPDATA\Programs\minelive",
    "$env:APPDATA\MiniLive"
)

# ── Validaciones de seguridad ────────────────────────────────────────────────
if (-not (Test-Path $AsarPath)) {
    Write-Error "Archivo no encontrado: $AsarPath"
    exit 1
}

foreach ($zone in $PROTECTED_PATHS) {
    if ($AsarPath -like "$zone*") {
        Write-Error @"
OPERACIÓN BLOQUEADA: El archivo pertenece a una zona protegida.
  Ruta bloqueada : $AsarPath
  Zona protegida : $zone
Motivo: MineLive y MiniLive están protegidos. Nunca se inspeccionan directamente.
"@
        exit 2
    }
}

if ([System.IO.Path]::GetExtension($AsarPath) -ne ".asar") {
    Write-Error "El archivo especificado no tiene extensión .asar: $AsarPath"
    exit 1
}

# Verificar que asar CLI esté disponible
if (-not (Get-Command asar -ErrorAction SilentlyContinue)) {
    Write-Warning "asar CLI no encontrado. Instala con: npm install -g @electron/asar"
    exit 1
}

# ── Crear copia temporal en sandbox ─────────────────────────────────────────
$asarName    = [System.IO.Path]::GetFileNameWithoutExtension($AsarPath)
$timestamp   = Get-Date -Format "yyyyMMdd_HHmmss"
$sandboxName = "${asarName}_${timestamp}"
$sandboxAsar = Join-Path $TEMP_DUMP "${sandboxName}.asar"
$extractDir  = Join-Path $TEMP_DUMP $sandboxName

New-Item -ItemType Directory -Path $TEMP_DUMP -Force | Out-Null

Write-Host "[SANDBOX] Copiando .asar al sandbox temporal..." -ForegroundColor Cyan
Copy-Item -Path $AsarPath -Destination $sandboxAsar -Force
Write-Host "[SANDBOX] Copia creada: $sandboxAsar" -ForegroundColor Green
Write-Host "[PROTECCIÓN] Original intacto en: $AsarPath`n" -ForegroundColor DarkGray

# ── Ejecutar acción solicitada ───────────────────────────────────────────────
switch ($Action) {

    "list" {
        Write-Host "=== CONTENIDO DEL ASAR: $asarName ===" -ForegroundColor Yellow
        asar list $sandboxAsar
    }

    "extract" {
        New-Item -ItemType Directory -Path $extractDir -Force | Out-Null
        Write-Host "[EXTRAYENDO] → $extractDir" -ForegroundColor Cyan
        asar extract $sandboxAsar $extractDir
        Write-Host "[OK] Extracción completa en: $extractDir" -ForegroundColor Green
        Write-Host "Archivos extraídos:"
        Get-ChildItem $extractDir -Recurse | Select-Object FullName | Format-Table -AutoSize
    }

    "read" {
        if ([string]::IsNullOrWhiteSpace($InternalFile)) {
            Write-Error "Debes especificar -InternalFile para la acción 'read'."
            exit 1
        }
        Write-Host "=== CONTENIDO DE '$InternalFile' ===" -ForegroundColor Yellow
        asar ef $sandboxAsar $InternalFile /dev/stdout
    }
}

Write-Host "`n[INSPECTOR] Sesión completada. El sandbox queda en: $TEMP_DUMP" -ForegroundColor DarkCyan
Write-Host "[INSPECTOR] Para limpiar: Remove-Item '$TEMP_DUMP\$sandboxName*' -Recurse -Force" -ForegroundColor DarkGray
