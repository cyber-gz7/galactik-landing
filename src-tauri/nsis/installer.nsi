; ============================================================
; Galactic Live — Instalador Limpio
; GZ7 · CJ7TEC  —  Script NSIS personalizado
; ============================================================
; Este script es procesado por el bundler de Tauri v2 como
; "template". Tauri inyecta macros de instalación estándar;
; aquí solo sobreescribimos / completamos la sección Uninstall.
; ============================================================

!define APP_NAME      "Galactic Live"
!define APP_EXE       "GalacticLive.exe"
!define SIDECAR_EXE   "node.exe"
!define UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\GalacticLive"
!define USERDATA_DIR  "$LOCALAPPDATA\GalacticLive"

; --- Metadata básica (Tauri puede sobreescribir estos valores) ---
Name            "${APP_NAME}"
OutFile         "GalacticLive-Setup.exe"
InstallDir      "$LOCALAPPDATA\Programs\GalacticLive"
RequestExecutionLevel user

; ============================================================
; DESINSTALADOR — sección principal
; ============================================================
Section "Uninstall"

  ; ── 1. Matar procesos activos antes de tocar archivos ──────
  DetailPrint "Deteniendo procesos activos..."
  ExecWait '"$SYSDIR\taskkill.exe" /F /IM "${APP_EXE}" /T'
  ExecWait '"$SYSDIR\taskkill.exe" /F /IM "${SIDECAR_EXE}" /T'
  ; Pausa para que el SO libere file handles
  Sleep 800

  ; ── 2. Eliminar directorio de instalación completo ─────────
  DetailPrint "Eliminando archivos de instalación..."
  RMDir /r "$INSTDIR"

  ; ── 3. Limpiar accesos directos ────────────────────────────
  DetailPrint "Eliminando accesos directos..."
  Delete "$DESKTOP\${APP_NAME}.lnk"
  Delete "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"
  RMDir  "$SMPROGRAMS\${APP_NAME}"

  ; ── 4. Eliminar entrada de Programas y características ─────
  DetailPrint "Eliminando entrada del registro..."
  DeleteRegKey HKCU "${UNINSTALL_KEY}"

  ; ── 5. Datos de usuario — solo con confirmación explícita ──
  IfFileExists "${USERDATA_DIR}\*.*" AskUserData SkipUserData
  AskUserData:
    MessageBox MB_YESNO|MB_ICONQUESTION \
      "¿Eliminar también tu configuración guardada, sesión y datos de usuario de ${APP_NAME}?$\n$\n\
      Esto borrará: overlays, presets, config TikTok, sesión y credenciales.$\n$\n\
      Si planeas reinstalar, responde NO para conservar tus ajustes." \
      IDNO SkipUserData
      DetailPrint "Eliminando datos de usuario en ${USERDATA_DIR}..."
      RMDir /r "${USERDATA_DIR}"
  SkipUserData:

  DetailPrint "Desinstalación completada."

SectionEnd
; ============================================================
; FIN DEL SCRIPT
; ============================================================
