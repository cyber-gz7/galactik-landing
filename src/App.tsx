import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Zap,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Gamepad2,
  Box,
  Flame,
  Volume2,
  Mic,
  MessageSquare,
  Gift,
  Trophy,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Users,
  Clock,
  Layers,
  ArrowRight,
  Play,
  Share2,
  CheckCheck,
  Radio,
  Sliders,
  Disc3
} from 'lucide-react';

// Enlaces oficiales configurados según solicitud
const WHATSAPP_URL = 'https://wa.me/@cybergz7';
// Cada release sube también una copia sin número de versión: el botón siempre baja la última.
const DOWNLOAD_URL = 'https://github.com/cyber-gz7/galactik-landing/releases/latest/download/Galactik.Live_x64-setup.exe';
const DISCORD_USER = 'cj7_tutoriales';

export default function App() {
  const [currency, setCurrency] = useState<'USD' | 'PEN'>('USD');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [duelSide, setDuelSide] = useState<'left' | 'right'>('left');
  const [simWins, setSimWins] = useState(14);

  const handleCopyDemoRef = () => {
    navigator.clipboard.writeText('REF-GZ7PRO');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09080F] text-[#E6EDF3] font-sans overflow-x-hidden selection:bg-[#8B5CF6]/30">
      {/* ================= 1. NAVEGACIÓN SUPERIOR ================= */}
      <header className="sticky top-0 z-50 border-b border-[#8B5CF6]/25 bg-[#09080F]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <img
                src="./galactk-logo.png"
                alt="Galactik Live Logo"
                className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = './favicon.png';
                }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-wider text-white">
                    GALACTIK <span className="bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#818CF8] bg-clip-text text-transparent">LIVE</span>
                  </span>
                  <span className="rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-2 py-0.2 font-mono text-[10px] font-bold text-[#C4B5FD]">
                    v2.9.3
                  </span>
                </div>
                <span className="text-[10px] text-[#A78BFA] font-medium tracking-wide">
                  Suite Obsidian Neon para TikTok Live
                </span>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#B8B2C8]">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#roblox" className="hover:text-[#F472B6] transition-colors">Roblox GvG</a>
            <a href="#minecraft" className="hover:text-[#34D399] transition-colors">Minecraft 1.20.1</a>
            <a href="#alerts" className="hover:text-[#818CF8] transition-colors">Croma Key</a>
            <a href="#tts" className="hover:text-[#FBBF24] transition-colors">Voz TTS</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planes & Precios</a>
            <a href="#referrals" className="hover:text-[#34D399] transition-colors">Referidos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Discord: aún sin servidor, se atiende por mensaje directo */}
            <div
              title={`Escríbenos por Discord a ${DISCORD_USER}. Servidor oficial próximamente.`}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/10 px-3 py-2 text-xs font-bold text-[#818CF8] cursor-default"
            >
              <Disc3 className="h-3.5 w-3.5 text-[#5865F2] animate-spin" />
              <span>Discord: {DISCORD_USER}</span>
            </div>

            {/* Botón WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-[#34D399]/40 bg-[#34D399]/15 px-3 py-2 text-xs font-bold text-[#34D399] hover:bg-[#34D399]/25 transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Descarga Directa */}
            <a
              href={DOWNLOAD_URL}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Descargar</span>
            </a>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO PRINCIPAL OBSIDIAN NEON ================= */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-18 md:pb-32">
        {/* Banner de fondo oficial obsidian con overlay gradiente */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="./assets/hero-banner-bg.png"
            alt="Hero Background"
            className="w-full h-full object-cover object-center opacity-30 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09080F]/80 via-[#09080F]/95 to-[#09080F]" />
        </div>

        {/* Luces y destellos neón */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#8B5CF6]/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/6 w-[350px] h-[350px] bg-[#F472B6]/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/6 w-[350px] h-[350px] bg-[#34D399]/15 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
          {/* Logo Central Gigante con Glow */}
          <div className="flex justify-center mb-6">
            <div className="relative p-2">
              <img
                src="./assets/galactik-mark.png"
                alt="Galactik Mark"
                className="h-16 w-auto object-contain drop-shadow-[0_0_35px_rgba(139,92,246,0.85)]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = './galactk-logo.png';
                }}
              />
            </div>
          </div>

          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/50 bg-[#14111D]/80 px-4 py-1.5 text-xs font-bold text-[#C4B5FD] shadow-[0_0_25px_rgba(139,92,246,0.3)] backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
            <span>Versión 2.9.3 Oficial · Motor Rust en Tiempo Real · Compatible con OBS y TikTok Studio</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
            Transforma tu directo de TikTok en un{' '}
            <span className="bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#818CF8] bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(139,92,246,0.55)]">
              espectáculo interactivo
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#B8B2C8] max-w-3xl mx-auto leading-relaxed">
            La suite integral para streamers: automatiza duelos de <strong className="text-white">Roblox Obby GvG</strong>, eventos cinemáticos en <strong className="text-white">Minecraft PaperMC 1.20.1</strong>, alertas con <strong className="text-white">Croma Key GPU</strong>, 60+ sonidos memes virales y <strong className="text-white">Voz TTS ultra natural</strong> sin latencia.
          </p>

          {/* Botones de acción Hero */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={DOWNLOAD_URL}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#6D28D9] px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="h-5 w-5" />
              <span>Descargar para Windows (64-bit)</span>
            </a>

            <a
              href="#pricing"
              className="flex items-center gap-2 rounded-2xl border border-[#8B5CF6]/50 bg-[#14111D]/90 px-6 py-4 text-sm font-black text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-all shadow-lg"
            >
              <Crown className="h-5 w-5 text-[#FBBF24]" />
              <span>Ver Planes & Precios (Desde $0 / $9 / $15)</span>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl border border-[#34D399]/40 bg-[#34D399]/15 px-6 py-4 text-sm font-bold text-[#34D399] hover:bg-[#34D399]/25 transition-all"
            >
              <MessageSquare className="h-5 w-5" />
              <span>wa.me/@cybergz7</span>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8E87A0]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> 1h / 2h Diarias Gratis sin tarjeta
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> 100% Seguro (solo tu @nick de TikTok)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Actualizaciones silenciosas en 2s
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Windows 10 & 11 (85 MB)
            </span>
          </div>

          {/* ================= MOCKUP DE LA SUITE EN ACCIÓN ================= */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-[#8B5CF6]/40 bg-[#14111D]/95 p-4 sm:p-7 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(139,92,246,0.3)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#F43F5E]" />
                <span className="h-3 w-3 rounded-full bg-[#FBBF24]" />
                <span className="h-3 w-3 rounded-full bg-[#34D399]" />
                <span className="font-mono text-xs font-bold text-white flex items-center gap-2 ml-1">
                  <Laptop className="h-4 w-4 text-[#C4B5FD]" />
                  Galactik Live v2.9.3 &bull; Panel de Control Activo
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-[#34D399] font-bold flex items-center gap-1.5 rounded-full bg-[#34D399]/15 border border-[#34D399]/40 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-[#34D399] animate-ping" />
                  SERVIDOR OBS HTTP :4000
                </span>
                <span className="text-[#C4B5FD] font-bold">@streamer_oficial</span>
              </div>
            </div>

            {/* Arena de Duelo Roblox GvG Interactiva */}
            <div className="rounded-2xl border border-[#8B5CF6]/30 bg-[#09080F] p-4 sm:p-6 shadow-inner">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-2">
                <span className="text-[#F472B6] flex items-center gap-2">
                  🌹 VILLANOS: ROSAS (2,450 PTS)
                </span>
                <div className="flex items-center gap-2 bg-[#14111D] border border-white/10 px-3 py-1 rounded-xl">
                  <Trophy className="h-4 w-4 text-[#FBBF24]" />
                  <span className="font-mono text-xs font-bold text-white">META WINS: {simWins}</span>
                </div>
                <span className="text-[#818CF8] flex items-center gap-2">
                  HÉROES: GGs (3,120 PTS) ⚡
                </span>
              </div>

              {/* Barra de progreso interactiva */}
              <div className="relative h-7 w-full rounded-full bg-[#1A1429] overflow-hidden p-1 border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F472B6] via-[#8B5CF6] to-[#818CF8] transition-all duration-700 shadow-[0_0_25px_rgba(139,92,246,0.7)]"
                  style={{ width: '56%' }}
                />
              </div>

              {/* Regalos interactivos activos en el duelo */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div
                  onClick={() => setSimWins(Math.max(0, simWins - 15))}
                  className="rounded-xl border border-[#F472B6]/40 bg-[#14111D] p-3 flex items-center gap-3 cursor-pointer hover:border-[#F472B6] transition-all"
                  title="Haz clic para simular donación de Gatito León"
                >
                  <img src="./gifts/leon-the-kitten-4888-coins.webp" alt="Gatito León" className="h-11 w-11 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">Gatito León</div>
                    <div className="font-mono text-[11px] font-black text-[#F472B6]">-15 WINs</div>
                  </div>
                </div>

                <div
                  className="rounded-xl border border-[#F472B6]/40 bg-[#14111D] p-3 flex items-center gap-3"
                >
                  <img src="./gifts/rose-1-coins.webp" alt="Rosa" className="h-11 w-11 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">Rosa TikTok</div>
                    <div className="font-mono text-[11px] font-black text-[#F472B6]">+10 Pts</div>
                  </div>
                </div>

                <div
                  className="rounded-xl border border-[#818CF8]/40 bg-[#14111D] p-3 flex items-center gap-3"
                >
                  <img src="./gifts/gg-1-coins.webp" alt="GG" className="h-11 w-11 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">GG Gamer</div>
                    <div className="font-mono text-[11px] font-black text-[#818CF8]">+10 Pts</div>
                  </div>
                </div>

                <div
                  onClick={() => setSimWins(simWins + 15)}
                  className="rounded-xl border border-[#818CF8]/40 bg-[#14111D] p-3 flex items-center gap-3 cursor-pointer hover:border-[#34D399] transition-all"
                  title="Haz clic para simular donación de Jets"
                >
                  <img src="./gifts/flying-jets-5000-coins.webp" alt="Jets" className="h-11 w-11 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">Jets 5000</div>
                    <div className="font-mono text-[11px] font-black text-[#34D399]">+15 WINs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. STATS STRIP ================= */}
      <section className="border-y border-white/10 bg-[#0D0B14] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#34D399]">0 ms</div>
              <div className="text-xs text-[#B8B2C8] mt-1 font-semibold">Latencia Webcast & RCON</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#C4B5FD]">+1,770</div>
              <div className="text-xs text-[#B8B2C8] mt-1 font-semibold">Regalos de TikTok Mapeados</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#FBBF24]">60 FPS</div>
              <div className="text-xs text-[#B8B2C8] mt-1 font-semibold">Aceleración GPU en OBS Studio</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#818CF8]">2 seg</div>
              <div className="text-xs text-[#B8B2C8] mt-1 font-semibold">Actualizaciones In-Place NSIS</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. SHOWCASE DE MÓDULOS CON GRÁFICOS OFICIALES ================= */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#A78BFA]">
              Módulos Profesionales
            </span>
            <h2 className="mt-2 font-extrabold text-3xl sm:text-5xl text-white">
              Todo el poder para tu transmisión en un solo panel
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#B8B2C8]">
              Sin suscripciones web dispersas ni software lento. Galactik Live corre nativo en Windows y levanta tus overlays locales en milisegundos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Roblox Obby GvG con Banner Oficial */}
            <div id="roblox" className="group rounded-3xl border border-[#8B5CF6]/35 bg-[#14111D] overflow-hidden shadow-2xl hover:border-[#8B5CF6] transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-[#09080F]">
                  <img
                    src="./assets/banner-roblox-duel-pro.png"
                    alt="Roblox GvG Banner"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = './assets/card-roblox-bg.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14111D] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-[#8B5CF6] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-white shadow-lg">
                    ★ MÁS POPULAR
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-xl text-white">Roblox Obby GvG (Gift vs Gift)</h3>
                  <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                    Duelo interactivo en vivo: barra central Rosa vs GG, 2 columnas arrastrables con regalos asignados, contador de victorias (WINs), meta de likes y 8 modos de overlay listos para OBS (720x1080).
                  </p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                    <li className="flex items-center gap-2">• <strong className="text-white">18+ Regalos interactivos</strong> en pantalla</li>
                    <li className="flex items-center gap-2">• Efectos de sonido meme automáticos</li>
                    <li className="flex items-center gap-2">• Reordenamiento drag & drop instantáneo</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a
                  href="#pricing"
                  className="flex items-center justify-between rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-2.5 text-xs font-bold text-[#C4B5FD] hover:bg-[#8B5CF6]/20 transition-colors"
                >
                  <span>Incluido en todos los planes</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Card 2: Minecraft Studio 1.20.1 con Banner Oficial */}
            <div id="minecraft" className="group rounded-3xl border border-[#34D399]/35 bg-[#14111D] overflow-hidden shadow-2xl hover:border-[#34D399] transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-[#09080F]">
                  <img
                    src="./assets/minecraft-banner-steve.png"
                    alt="Minecraft Banner"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = './assets/card-minecraft-bg.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14111D] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-[#34D399] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-lg">
                    PAPER 1.20.1
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-xl text-white">Minecraft Studio & Plugin SurvivalGZ7</h3>
                  <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                    Conexión nativa por socket RCON a PaperMC. Invocación de jefes cinematográficos por regalos (Warden, Titanes, Rayos, Hoyos), tótems de salvación y visión nocturna infinita en segundo plano.
                  </p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                    <li className="flex items-center gap-2">• Plugin oficial <strong className="text-white">SurvivalGZ7.jar</strong> integrado</li>
                    <li className="flex items-center gap-2">• Hasta 30 reglas personalizables (PRO)</li>
                    <li className="flex items-center gap-2">• Kit Inicial configurable en 1 clic (PLUS)</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a
                  href="#pricing"
                  className="flex items-center justify-between rounded-xl border border-[#34D399]/30 bg-[#34D399]/10 px-4 py-2.5 text-xs font-bold text-[#34D399] hover:bg-[#34D399]/20 transition-colors"
                >
                  <span>Vanilla Free · Plugins en PLUS & PRO</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Card 3: Alertas con Croma Key GPU con Banner Oficial */}
            <div id="alerts" className="group rounded-3xl border border-[#818CF8]/35 bg-[#14111D] overflow-hidden shadow-2xl hover:border-[#818CF8] transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-[#09080F]">
                  <img
                    src="./assets/banner-alerts-pro.png"
                    alt="Alertas Croma Banner"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14111D] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-[#818CF8] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-white shadow-lg">
                    CHROMA GPU
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-xl text-white">Alertas con Croma Key GPU</h3>
                  <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                    Elimina el fondo verde, azul, negro o morado de cualquier video en tiempo real sin sobrecargar el procesador. Compatible con videos propios .mp4 y .webm en formato 9:16 y 16:9.
                  </p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                    <li className="flex items-center gap-2">• Shaders WebGL acelerados por tarjeta de video</li>
                    <li className="flex items-center gap-2">• Mensajes dinámicos: <code className="text-[#C4B5FD]">&#123;user&#125; envió &#123;gift&#125;</code></li>
                    <li className="flex items-center gap-2">• Botonera de clips manuales para MVP y sustos</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a
                  href="#pricing"
                  className="flex items-center justify-between rounded-xl border border-[#818CF8]/30 bg-[#818CF8]/10 px-4 py-2.5 text-xs font-bold text-[#818CF8] hover:bg-[#818CF8]/20 transition-colors"
                >
                  <span>Exclusivo Plan PRO ($15) / Pase 24h ($1)</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Card 4: Voz TTS Neural & Personajes */}
            <div id="tts" className="group rounded-3xl border border-[#F472B6]/35 bg-[#14111D] overflow-hidden shadow-2xl hover:border-[#F472B6] transition-all flex flex-col justify-between">
              <div>
                <div className="p-6 pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F472B6]/20 text-[#F472B6] border border-[#F472B6]/40 mb-4">
                    <Mic className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#F472B6]">Cero Robótico</span>
                  <h3 className="mt-1 font-extrabold text-xl text-white">Voz TTS Natural & Personajes</h3>
                  <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                    Lector de chat con voz humana real en español. Incluye presets de personajes (<strong className="text-white">Anime/Kawaii, Ardilla/Stitch, Locutor Épico, Titán Grave</strong>), anunciador de regalos y filtro anti-insultos.
                  </p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                    <li className="flex items-center gap-2">• Permisos por Quiéreme, Suscriptores y Mods</li>
                    <li className="flex items-center gap-2">• Prioridad automática en cola para donadores</li>
                    <li className="flex items-center gap-2">• Filtro de palabras prohibidas estricto</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a
                  href="#pricing"
                  className="flex items-center justify-between rounded-xl border border-[#F472B6]/30 bg-[#F472B6]/10 px-4 py-2.5 text-xs font-bold text-[#F472B6] hover:bg-[#F472B6]/20 transition-colors"
                >
                  <span>2 Voces Free · Personajes en PRO</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Card 5: Overlays & 5 Tops para OBS con Banner Oficial */}
            <div className="group rounded-3xl border border-[#FBBF24]/35 bg-[#14111D] overflow-hidden shadow-2xl hover:border-[#FBBF24] transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-[#09080F]">
                  <img
                    src="./assets/banner-tops-pro.png"
                    alt="Tops Overlays Banner"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14111D] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-[#FBBF24] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-lg">
                    5 OVERLAYS
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-xl text-white">Overlays de Tops & Reloj Subathon</h3>
                  <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                    Widgets dinámicos para motivar donaciones: Top Donadores con coronas, Duelo por la Corona, Top Tap Taps, Top 3 Regalos y el <strong className="text-white">Reloj Extensible</strong> que suma tiempo automáticamente cuando envían regalos.
                  </p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                    <li className="flex items-center gap-2">• Reloj Extensible para directos 24 horas</li>
                    <li className="flex items-center gap-2">• Animaciones de corona para el Top 1</li>
                    <li className="flex items-center gap-2">• Personalización de colores, fondos y estilos</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a
                  href="#pricing"
                  className="flex items-center justify-between rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-4 py-2.5 text-xs font-bold text-[#FBBF24] hover:bg-[#FBBF24]/20 transition-colors"
                >
                  <span>Reloj y Top 3 en PLUS y PRO</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Card 6: Botonera de Memes con Banner Oficial */}
            <div className="group rounded-3xl border border-[#C4B5FD]/35 bg-[#14111D] overflow-hidden shadow-2xl hover:border-[#C4B5FD] transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-[#09080F]">
                  <img
                    src="./assets/banner-sounds-pro.png"
                    alt="Sounds Memes Banner"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14111D] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-[#C4B5FD] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-lg">
                    60+ MEMES
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-xl text-white">Botonera de Memes & Audios Propios</h3>
                  <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                    Dispara sonidos virales con latencia cero (Taco Bell, Vine Boom, Wow Anime, Pedro Pedro, etc.) o sube tus propios audios (.mp3/.wav) para vincularlos a cualquier regalo o comando del chat.
                  </p>
                  <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                    <li className="flex items-center gap-2">• Catálogo gratuito de memes 100% libre</li>
                    <li className="flex items-center gap-2">• Subida de audios propios (PLUS y PRO)</li>
                    <li className="flex items-center gap-2">• Control de volumen y mezclador maestro</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a
                  href="#pricing"
                  className="flex items-center justify-between rounded-xl border border-[#C4B5FD]/30 bg-[#C4B5FD]/10 px-4 py-2.5 text-xs font-bold text-[#C4B5FD] hover:bg-[#C4B5FD]/20 transition-colors"
                >
                  <span>Subida de audios en PLUS ($9) y PRO ($15)</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SECCIÓN DE PLANES Y PRECIOS ================= */}
      <section id="pricing" className="py-20 md:py-32 border-t border-white/10 bg-[#0D0B14]/90 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#8B5CF6]/15 blur-[150px] pointer-events-none rounded-full" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#34D399]">
              Tarifas Claras y Flexibles
            </span>
            <h2 className="mt-2 font-extrabold text-3xl sm:text-5xl text-white">
              Elige el plan ideal para tu canal
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#B8B2C8]">
              Comienza hoy sin poner tarjeta en el modo Invitado, o desbloquea todo el potencial de tu stream con nuestros planes mensuales y pases express.
            </p>

            {/* Selector de Moneda USD / PEN */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#14111D] p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`rounded-xl px-5 py-2 text-xs font-black transition-all ${
                  currency === 'USD'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg'
                    : 'text-[#B8B2C8] hover:text-white'
                }`}
              >
                Dólares (USD $)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('PEN')}
                className={`rounded-xl px-5 py-2 text-xs font-black transition-all ${
                  currency === 'PEN'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg'
                    : 'text-[#B8B2C8] hover:text-white'
                }`}
              >
                Soles (PEN S/)
              </button>
            </div>
          </div>

          {/* Grid de 4 Planes Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* 1. Invitado Demo */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#14111D] p-6 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8E87A0]">Prueba Sin Registro</span>
                <h3 className="font-extrabold text-xl text-white mt-1">Invitado</h3>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-[#8E87A0] font-sans">USD / gratis</span>
                </div>
                <p className="text-xs text-[#B8B2C8] mt-2">Descarga y prueba hoy mismo sin crearte cuenta.</p>

                <ul className="mt-6 flex flex-col gap-2.5 text-xs text-[#D4D4D8]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-white">1 hora / día</strong> de directo activo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-white">6 eventos</strong> en Roblox GvG</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-white">6 reglas</strong> en Minecraft Vanilla</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>Catálogo de memes gratis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>2 voces TTS estándar</span>
                  </li>
                </ul>
              </div>

              <a
                href={DOWNLOAD_URL}
                className="mt-8 block w-full rounded-2xl border border-white/15 bg-[#09080F] py-3 text-center text-xs font-black uppercase tracking-wider text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-all"
              >
                Descargar y Probar
              </a>
            </div>

            {/* 2. Free Registrado */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#34D399]/40 bg-[#14111D] p-6 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#34D399] px-3.5 py-0.5 text-[10px] font-black uppercase text-black shadow-md">
                Doble de tiempo
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#34D399]">Solo con tu Correo</span>
                <h3 className="font-extrabold text-xl text-white mt-1">FREE Registrado</h3>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-[#8E87A0] font-sans">USD / gratis</span>
                </div>
                <p className="text-xs text-[#B8B2C8] mt-2">Regístrate en Inicio y duplica tu tiempo diario automáticamente.</p>

                <ul className="mt-6 flex flex-col gap-2.5 text-xs text-[#D4D4D8]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-[#34D399]">2 horas / día</strong> de directo activo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>Código de referidos <strong className="text-white">REF-XXXXXX</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>6 eventos Roblox GvG</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>6 reglas en Minecraft Vanilla</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>Widgets básicos para OBS</span>
                  </li>
                </ul>
              </div>

              <a
                href={DOWNLOAD_URL}
                className="mt-8 block w-full rounded-2xl bg-[#34D399]/15 border border-[#34D399]/40 py-3 text-center text-xs font-black uppercase tracking-wider text-[#34D399] hover:bg-[#34D399]/25 transition-all"
              >
                Crear Cuenta Gratis
              </a>
            </div>

            {/* 3. Plan PLUS $9 */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#818CF8]/40 bg-[#14111D] p-6 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#818CF8]">Streamer en Crecimiento</span>
                <h3 className="font-extrabold text-xl text-white mt-1 flex items-center gap-1.5">
                  <Zap className="h-5 w-5 text-[#818CF8]" /> Plan PLUS
                </h3>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">
                    {currency === 'USD' ? '$9' : 'S/ 34'}
                  </span>
                  <span className="text-xs text-[#8E87A0] font-sans">
                    {currency === 'USD' ? 'USD / mes' : 'PEN / mes'}
                  </span>
                </div>
                <p className="text-xs text-[#C4B5FD] mt-2">Roblox GvG completo, sonidos propios y hasta 10h de directo.</p>

                <ul className="mt-6 flex flex-col gap-2.5 text-xs text-[#D4D4D8]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#818CF8] shrink-0" />
                    <span><strong className="text-white">10 horas / día</strong> de directo continuo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#818CF8] shrink-0" />
                    <span><strong className="text-white">Roblox GvG ILIMITADO</strong> (18+ eventos)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#818CF8] shrink-0" />
                    <span><strong className="text-white">12 reglas MC + Kit Inicial</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#818CF8] shrink-0" />
                    <span><strong className="text-white">Subir audios propios</strong> (.mp3/.wav)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#818CF8] shrink-0" />
                    <span>Widgets exclusivos (Reloj Subathon, Top 3)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#818CF8] shrink-0" />
                    <span>Sin marca de agua en overlays</span>
                  </li>
                </ul>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block w-full rounded-2xl bg-[#818CF8] py-3 text-center text-xs font-black uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-lg"
              >
                Elegir PLUS ({currency === 'USD' ? '$9 USD' : 'S/ 34 PEN'})
              </a>
            </div>

            {/* 4. Plan PRO $15 - RECOMENDADO */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-[#8B5CF6] bg-gradient-to-b from-[#1C142C] to-[#14111D] p-6 shadow-[0_0_35px_rgba(139,92,246,0.4)] relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] px-3.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-lg">
                ★ RECOMENDADO
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FBBF24]">Suite Completa</span>
                <h3 className="font-extrabold text-xl text-white mt-1 flex items-center gap-1.5">
                  <Crown className="h-5 w-5 text-[#FBBF24]" /> Plan PRO
                </h3>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">
                    {currency === 'USD' ? '$15' : 'S/ 56'}
                  </span>
                  <span className="text-xs text-[#8E87A0] font-sans">
                    {currency === 'USD' ? 'USD / mes' : 'PEN / mes'}
                  </span>
                </div>
                <p className="text-xs text-[#FBBF24] mt-2">Horas ilimitadas 24/7, Croma Key, Videos propios y Plugins.</p>

                <ul className="mt-6 flex flex-col gap-2.5 text-xs text-white">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-[#34D399]">HORAS ILIMITADAS 24/7</strong> sin cortes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-white">Croma Key GPU</strong> + Subir videos (.mp4/.webm)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-white">Plugins Minecraft</strong> (SurvivalGZ7 + Jefes)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>Hasta <strong className="text-white">30 reglas activas</strong> en Minecraft</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-white">Voces TTS Personajes</strong> (Anime, Stitch, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span><strong className="text-[#FBBF24]">Regala 5 Pases PRO 24h al mes</strong> a amigos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                    <span>Soporte prioritario VIP por WhatsApp</span>
                  </li>
                </ul>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block w-full rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] py-3 text-center text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all"
              >
                Activar Plan PRO ({currency === 'USD' ? '$15 USD' : 'S/ 56 PEN'})
              </a>
            </div>
          </div>

          {/* Tarjeta de Pases PRO Express */}
          <div className="mt-8 rounded-3xl border border-[#FBBF24]/35 bg-[#14111D] p-6 shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/40 px-3 py-1 text-[10px] font-black uppercase text-[#FBBF24]">
                  Pases PRO Express
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">
                  ¿Solo vas a transmitir un fin de semana? Adquiere un Pase PRO
                </h3>
                <p className="text-xs text-[#B8B2C8] mt-1 max-w-xl">
                  Accede a todas las funciones PRO (Croma Key, Plugins Minecraft, TTS de Personajes y horas ilimitadas) sin atarte a una mensualidad.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[#34D399]/40 bg-[#34D399]/15 px-5 py-3 text-xs font-black text-[#34D399] hover:bg-[#34D399]/25 transition-all text-center"
                >
                  ⚡ Pase 24h &bull; {currency === 'USD' ? '$1 USD' : 'S/ 3.80 PEN'}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[#FBBF24]/40 bg-[#FBBF24]/15 px-5 py-3 text-xs font-black text-[#FBBF24] hover:bg-[#FBBF24]/25 transition-all text-center"
                >
                  🔥 Pase 7 Días &bull; {currency === 'USD' ? '$5 USD' : 'S/ 19 PEN'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. PROGRAMA DE REFERIDOS ================= */}
      <section id="referrals" className="py-20 border-t border-white/10 bg-[#09080F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[#8B5CF6]/35 bg-gradient-to-r from-[#14111D] to-[#0D0B14] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#34D399]/40 bg-[#34D399]/15 px-3.5 py-1 text-xs font-bold text-[#34D399] mb-4">
                <Users className="h-4 w-4" />
                <span>Programa de Referidos Galactik</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Gana días gratis recomendando la app a tus amigos streamers
              </h2>
              <p className="mt-4 text-sm text-[#B8B2C8] leading-relaxed">
                Si cuentas con un plan mensual PLUS o PRO activo, comparte tu código personal <strong className="text-white">REF-XXXXXX</strong>. Cada amigo nuevo que active un plan mensual con tu código te otorga <strong className="text-[#34D399]">+2 días extra automáticos</strong> a tu fecha de corte (hasta 5 amigos por mes = <strong className="text-white">+10 días gratis al mes</strong>).
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#09080F] px-4 py-2.5 font-mono text-xs text-[#C4B5FD]">
                  <span>Ejemplo:</span>
                  <strong className="text-white">REF-GZ7PRO</strong>
                  <button
                    type="button"
                    onClick={handleCopyDemoRef}
                    className="ml-2 text-[11px] text-[#34D399] hover:underline cursor-pointer"
                  >
                    {copiedCode ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <span className="text-xs text-[#8E87A0]">
                  Tu código único se genera solo al registrarte en la app.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. PREGUNTAS FRECUENTES (FAQ) ================= */}
      <section id="faq" className="py-20 md:py-28 border-t border-white/10 bg-[#0D0B14]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#818CF8]">
              Resolución de Dudas
            </span>
            <h2 className="mt-2 font-extrabold text-3xl sm:text-4xl text-white">Preguntas Frecuentes</h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                q: '¿Necesito ingresar la contraseña de mi cuenta de TikTok?',
                a: 'No, bajo ninguna circunstancia. Galactik Live solo requiere tu @usuario público para escuchar los eventos de la sala en vivo mediante Webcast oficial. Tu cuenta está 100% protegida.'
              },
              {
                q: '¿Cómo agrego los duelos y alertas a OBS Studio o TikTok Live Studio?',
                a: 'Galactik Live levanta un servidor HTTP ultrarrápido en tu PC (http://127.0.0.1:4000). En OBS agregas una fuente de navegador con la URL del widget (por ejemplo roblox.html o alerta.html) y listo.'
              },
              {
                q: '¿Cómo funcionan las actualizaciones automáticas?',
                a: 'La aplicación actualiza silenciosamente en 2 segundos desde adentro. Nunca tienes que desinstalar ni reinstalar, y tu sesión, configuraciones y mundos se conservan intactos.'
              },
              {
                q: '¿Necesito una computadora potente para usar Galactik Live?',
                a: 'No. El núcleo del sistema fue construido en Rust con aceleración por hardware en GPU para los overlays. Consume menos del 2% de CPU en un procesador estándar.'
              },
              {
                q: '¿Qué medios de pago aceptan?',
                a: 'Aceptamos tarjetas de débito y crédito internacionales (Visa, Mastercard), PayPal, y billeteras digitales como Yape y Plin en Perú, además de Lemon Cash y Cripto.'
              },
              {
                q: '¿Puedo regalar pases a mis amigos?',
                a: 'Sí. Los usuarios con Plan PRO mensual real ($15 USD) tienen habilitada la función para regalar hasta 5 Pases PRO de 24 horas cada mes a sus amigos registrados.'
              }
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className="rounded-2xl border border-white/10 bg-[#14111D] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-white hover:text-[#C4B5FD] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#8B5CF6]' : 'text-[#8E87A0]'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-[#B8B2C8] leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#09080F] py-12 text-xs text-[#8E87A0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="./galactk-logo.png"
              alt="Galactik Live Logo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = './favicon.png';
              }}
            />
            <div>
              <span className="font-bold text-white">Galactik Live &bull; Suite Interactiva</span>
              <p className="text-[11px] text-[#8E87A0]">Desarrollado para la comunidad de creadores de TikTok Live.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planes</a>
            <a href={DOWNLOAD_URL} className="hover:text-white transition-colors">Descarga Directa</a>
            <span className="text-[#818CF8] flex items-center gap-1 cursor-default">
              <Disc3 className="h-3.5 w-3.5 text-[#5865F2]" /> Discord: {DISCORD_USER}
            </span>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-[#34D399] hover:underline flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> wa.me/@cybergz7
            </a>
          </div>

          <div className="text-center md:text-right text-[11px]">
            <p>&copy; {new Date().getFullYear()} Galactik Live. Todos los derechos reservados.</p>
            <p className="mt-0.5 text-[#52525B]">TikTok, Roblox y Minecraft son marcas de sus respectivos titulares.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
