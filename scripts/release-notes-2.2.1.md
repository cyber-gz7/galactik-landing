# Galactik Live v2.2.1 PRO — Activación de Módulos Alertas, Tops & Soundboard

### 🚀 Novedades y Módulos Nuevos
* **Alertas & Croma Key OBS (`/alerta.html`):**
  - Calibrador de Croma en GPU en tiempo real con eliminación automática de fondo verde/magenta.
  - Ajustes de tolerancia (*similarity*), suavizado (*smoothness*), volumen y duración de pantalla.
  - Simulador vertical 9:16 en vivo embebido en la suite.
  - Disparadores de prueba para jumpscares (León, Oso con Rosa, Supercar, Zombie).
  - Formulario de alerta manual personalizada con interpolación de plantillas.
* **Tops, Metas & Líderes (`TopsGoalsWorkspace`):**
  - 5 widgets OBS con URLs directas: **Top Donadores VIP** (`top_donadores.html`), **Top Taps & Likes** (`top_likes.html`), **MVP de la Sesión** (`mvp.html`), **Contador de Victorias / Derrotas** (`contador.html`) y **Cronómetro Supervivencia** (`cronometro.html`).
  - Fijación manual o dinámica del MVP de la transmisión en tiempo real (`emit_session_mvp`).
  - Botonera rápida para sumar/restar victorias y reiniciar marcador.
* **Soundboard de Memes & Efectos Virales (`SoundsMemesWorkspace`):**
  - Catálogo de más de 32 efectos virales (*The Boys*, *Drip Goku*, *Spider-Man 2099*, *GTA*, *Minecraft*, *Roblox Oof*, etc.) consumidos del banco local `s2e_media/audio/public/`.
  - Preescucha instantánea con ecualizador animado, control maestro de volumen y botón para proyectar audios directo a OBS.
* **Enrutamiento y Capa IPC:**
  - Desacoplamiento completo de rutas en `App.tsx` y `SidebarLeft.tsx`.
  - Nuevas definiciones seguras de comandos IPC en `tauri-bridge.ts`.
