---
name: skill-qa-release-builder
description: Sub-Agente 4 - Auditoría, Testing & Build v2.0.5. Ejecuta validaciones de sintaxis (node --check, cargo check), actualización estricta de versiones a 2.0.5, compilación del instalador NSIS y lanzamiento de la suite.
---

# Skill: QA Release Builder & Validation

## Capacidades y Responsabilidades
1. **Auditoría Técnica Pre-Release**:
   - `node --check` en cada archivo JavaScript modificado.
   - `cargo check` en `src-tauri` para garantizar 0 warnings/errores de tipos y dependencias.
2. **Sincronización Estricta de Versión 2.0.5**:
   - `package.json`: `version: "2.0.5"`.
   - `src-tauri/Cargo.toml`: exclusivamente `version = "2.0.5"` en `[package]`.
   - `src-tauri/tauri.conf.json`: `version: "2.0.5"`.
   - `ui/src/modules/auto-updater.js`: `const CURRENT_VERSION = '2.0.5'`.
   - Badges visuales en `ui/index.html`.
3. **Compilación y Empaquetado NSIS**:
   - Detención previa de procesos bloqueantes (`gz7live.exe`, `java.exe` huérfanos).
   - Generación de instalador: `npx.cmd @tauri-apps/cli build --config '{"bundle":{"createUpdaterArtifacts":false}}'`.
4. **Despliegue Local**:
   - Ejecución automatizada del instalador para actualizar la suite instalada.
