---
name: skill-qa-release-builder
description: Sub-Agente 4 - Auditoría, Testing & Release Incremental. Ejecuta validaciones de sintaxis (node --check, cargo check), incremento estricto de versión SemVer por cada corrección, compilación del instalador NSIS y despliegue.
---

# Skill: QA Release Builder & Validation

## Capacidades y Responsabilidades
1. **Auditoría Técnica Pre-Release**:
   - `node --check` en cada archivo JavaScript modificado.
   - `cargo check` en `src-tauri` para garantizar 0 warnings/errores de tipos y dependencias.
2. **Regla de Oro de Versionado Incremental (Cero Reutilización)**:
   - **Cada corrección o cambio genera una nueva versión**: Queda prohibido reutilizar el mismo número de versión una vez compilada o distribuida. Si se aplica un parche, arreglo o modificación, se incrementa obligatoriamente la versión (`2.0.5` -> `2.0.6` -> `2.0.7`).
   - Sincronización atómica en:
     - `package.json`: `version: "x.y.z"`.
     - `src-tauri/Cargo.toml`: exclusivamente `version = "x.y.z"` en `[package]`.
     - `src-tauri/tauri.conf.json`: `version: "x.y.z"`.
     - `ui/src/modules/auto-updater.js`: `const CURRENT_VERSION = 'x.y.z'`.
     - Badges visuales en `ui/index.html`.
3. **Compilación y Empaquetado NSIS**:
   - Detención previa de procesos bloqueantes (`gz7live.exe`, `java.exe` huérfanos).
   - Generación de instalador NSIS de producción con la versión exacta.
4. **Despliegue Local**:
   - Reemplazo y verificación del ejecutable en la instalación local del usuario.
