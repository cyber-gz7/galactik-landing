# Galactik Live · Landing Page Oficial & Distribución

Landing page oficial y repositorio público de distribución de releases para **Galactik Live** — la suite interactiva para streamers de TikTok Live (Roblox Obby GvG, Minecraft Studio 1.20.1 con PaperMC, Alertas con Croma Key GPU, Sonidos Memes y Lector de Chat con Voz TTS Neural).

---

## 🚀 Características de la Web

- **Tecnología moderna:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4.
- **Diseño Obsidian Neon:** Estética oscura optimizada para streamers, con glassmorphism y aceleración por GPU.
- **Catálogo de Planes & Precios:** Desglose completo de planes **Invitado ($0)**, **Free Registrado ($0)**, **PLUS ($9/mes)**, **PRO ($15/mes)** y **Pases PRO Express ($1 y $5)** en dólares (USD) y soles peruanos (PEN).
- **Despliegue automatizado:**
  - **GitHub Pages:** Flujo CI/CD con GitHub Actions en `.github/workflows/deploy.yml`.
  - **Vercel / Netlify:** Compatible de forma nativa (`npm run build` -> `dist/`).

---

## 📦 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## ⚡ Releases & Actualizador Automático de la App

Este repositorio público aloja las descargas públicas y el manifiesto criptográfico `latest.json` consumido por el auto-actualizador de la aplicación de escritorio (`tauri-plugin-updater`):

- **Descarga directa:** `https://github.com/cyber-gz7/galactik-landing/releases/latest/download/Galactik.Live_2.9.0_x64-setup.exe`
- **Manifiesto de actualización:** `https://github.com/cyber-gz7/galactik-landing/releases/latest/download/latest.json`

---

## 📄 Licencia

Propiedad de **Galactik Live**. Desarrollado para la comunidad de creadores de contenido de TikTok.
