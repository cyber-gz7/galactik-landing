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
  Heart,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Users,
  Clock,
  Laptop,
  Layers,
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';

const DOWNLOAD_URL = 'https://github.com/cyber-gz7/galactik-landing/releases/latest/download/Galactik.Live_2.9.0_x64-setup.exe';
const WHATSAPP_BASE = 'https://wa.me/51983234444?text=';

export default function App() {
  const [currency, setCurrency] = useState<'USD' | 'PEN'>('USD');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const getWaUrl = (planText: string) => {
    return `${WHATSAPP_BASE}${encodeURIComponent(`Hola Galactik Live, deseo activar el ${planText}`)}`;
  };

  const handleCopyDemoRef = () => {
    navigator.clipboard.writeText('REF-PRO2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09080F] text-[#E6EDF3] font-sans overflow-x-hidden selection:bg-[#8B5CF6]/30">
      {/* ================= 1. BARRA DE NAVEGACIÓN ================= */}
      <header className="sticky top-0 z-50 border-b border-[#8B5CF6]/20 bg-[#09080F]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#6D28D9] p-0.5 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09080F]">
                  <Sparkles className="h-5 w-5 text-[#C4B5FD] group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
                  GALACTIK <span className="bg-gradient-to-r from-[#C4B5FD] to-[#8B5CF6] bg-clip-text text-transparent">LIVE</span>
                </span>
                <span className="font-mono text-[10px] text-[#A78BFA] font-semibold tracking-wider">SUITE v2.9.0</span>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#B8B2C8]">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#roblox" className="hover:text-[#C4B5FD] transition-colors">Roblox GvG</a>
            <a href="#minecraft" className="hover:text-[#34D399] transition-colors">Minecraft</a>
            <a href="#alerts" className="hover:text-[#818CF8] transition-colors">Croma & Alertas</a>
            <a href="#tts" className="hover:text-[#F472B6] transition-colors">Voz TTS</a>
            <a href="#pricing" className="hover:text-[#FBBF24] transition-colors">Planes</a>
            <a href="#referrals" className="hover:text-[#34D399] transition-colors">Referidos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={DOWNLOAD_URL}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar App</span>
              <span className="sm:hidden">Descargar</span>
            </a>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO PRINCIPAL OBSIDIAN NEON ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Glow de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#8B5CF6]/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#34D399]/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-[#818CF8]/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/40 bg-[#14111D]/80 px-4 py-1.5 text-xs font-bold text-[#C4B5FD] shadow-[0_0_20px_rgba(139,92,246,0.25)] backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
            <span>Versión 2.9.0 Oficial · Motor Nativo Rust a 60 FPS</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
            Multiplica las donaciones en tu directo de{' '}
            <span className="bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#818CF8] bg-clip-text text-transparent [text-shadow:0_0_35px_rgba(139,92,246,0.4)]">
              TikTok Live
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#B8B2C8] max-w-3xl mx-auto leading-relaxed">
            La suite interactiva definitiva para streamers: automatiza duelos de <strong className="text-white">Roblox GvG</strong>, eventos de <strong className="text-white">Minecraft PaperMC 1.20.1</strong>, alertas con <strong className="text-white">Croma Key GPU</strong>, botonera de memes y <strong className="text-white">Voz TTS humana</strong> para OBS Studio y TikTok Live Studio.
          </p>

          {/* Botones de acción Hero */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={DOWNLOAD_URL}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#6D28D9] px-7 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="h-5 w-5" />
              <span>Descargar para Windows (64-bit)</span>
            </a>

            <a
              href="#pricing"
              className="flex items-center gap-2 rounded-2xl border border-[#8B5CF6]/40 bg-[#14111D] px-6 py-4 text-sm font-black text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/15 transition-all"
            >
              <Crown className="h-5 w-5 text-[#FBBF24]" />
              <span>Ver Planes & Precios (Desde $0 / $9 / $15)</span>
            </a>

            <a
              href={getWaUrl('información y activación')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl border border-[#34D399]/40 bg-[#34D399]/10 px-5 py-4 text-sm font-bold text-[#34D399] hover:bg-[#34D399]/20 transition-all"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Soporte WhatsApp</span>
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8E87A0]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> 100% seguro (sin contraseñas)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Actualizaciones silenciosas en 2s
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" /> Windows 10 & 11 (85 MB)
            </span>
          </div>

          {/* ================= MOCKUP INTERACTIVO DEL DUELO GVG ================= */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-[#8B5CF6]/35 bg-[#14111D]/90 p-4 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-[#F43F5E]" />
                <span className="h-3 w-3 rounded-full bg-[#FBBF24]" />
                <span className="h-3 w-3 rounded-full bg-[#34D399]" />
                <span className="ml-2 font-mono text-xs text-[#B8B2C8]">Galactik Live v2.9.0 · Conexión WebSocket OBS :4000</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="rounded-full bg-[#34D399]/20 border border-[#34D399]/40 px-2.5 py-0.5 text-[#34D399] font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-ping" />
                  LIVE ACTIVO
                </span>
              </div>
            </div>

            {/* Arena de Duelo Visual */}
            <div className="rounded-2xl border border-white/10 bg-[#09080F] p-4 sm:p-6">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-2">
                <span className="text-[#F472B6] flex items-center gap-1.5">
                  🌹 VILLANOS (ROSAS) &bull; 1,480 PTS
                </span>
                <span className="text-[#FBBF24] font-mono text-sm">VS</span>
                <span className="text-[#818CF8] flex items-center gap-1.5">
                  HÉROES (GGs) &bull; 2,120 PTS ⚡
                </span>
              </div>

              {/* Barra de tira y afloja */}
              <div className="relative h-6 w-full rounded-full bg-[#1E1A2B] overflow-hidden p-1 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F472B6] via-[#8B5CF6] to-[#818CF8] transition-all duration-500 shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                  style={{ width: '58%' }}
                />
              </div>

              {/* Grid de regalos interactivos en la preview */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="rounded-xl border border-[#F472B6]/30 bg-[#14111D] p-3 flex items-center gap-3">
                  <img src="./gifts/leon-the-kitten-4888-coins.webp" alt="Leon" className="h-10 w-10 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">Gatito León</div>
                    <div className="font-mono text-[11px] font-black text-[#F472B6]">-15 WINS</div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#F472B6]/30 bg-[#14111D] p-3 flex items-center gap-3">
                  <img src="./gifts/rose-1-coins.webp" alt="Rose" className="h-10 w-10 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">Rosa TikTok</div>
                    <div className="font-mono text-[11px] font-black text-[#F472B6]">+10 PUNTOS</div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#818CF8]/30 bg-[#14111D] p-3 flex items-center gap-3">
                  <img src="./gifts/gg-1-coins.webp" alt="GG" className="h-10 w-10 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">GG Gamer</div>
                    <div className="font-mono text-[11px] font-black text-[#818CF8]">+10 PUNTOS</div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#818CF8]/30 bg-[#14111D] p-3 flex items-center gap-3">
                  <img src="./gifts/flying-jets-5000-coins.webp" alt="Jets" className="h-10 w-10 object-contain drop-shadow" />
                  <div>
                    <div className="font-bold text-xs text-white">Jets 5000</div>
                    <div className="font-mono text-[11px] font-black text-[#34D399]">+15 WINS</div>
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
              <div className="text-xs text-[#B8B2C8] mt-1">Latencia en eventos y RCON</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#C4B5FD]">+1,770</div>
              <div className="text-xs text-[#B8B2C8] mt-1">Regalos de TikTok mapeados</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#FBBF24]">60 FPS</div>
              <div className="text-xs text-[#B8B2C8] mt-1">Overlays GPU fluidos en OBS</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl font-black text-[#818CF8]">2 seg</div>
              <div className="text-xs text-[#B8B2C8] mt-1">Actualización in-place sin desinstalar</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. MÓDULOS DE LA SUITE ================= */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#A78BFA]">Módulos Profesionales</span>
            <h2 className="mt-2 font-extrabold text-3xl sm:text-5xl text-white">
              Todo lo que necesitas para tu canal en una sola app
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#B8B2C8]">
              Olvídate de pagar 4 suscripciones distintas de páginas web lentas. Galactik Live corre nativamente en tu computadora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Roblox Obby GvG */}
            <div id="roblox" className="group rounded-3xl border border-[#8B5CF6]/30 bg-[#14111D] p-6 shadow-xl hover:border-[#8B5CF6] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40 mb-5">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F472B6]">Módulo Principal</span>
              <h3 className="mt-1 font-extrabold text-xl text-white">Roblox Obby GvG (Gift vs Gift)</h3>
              <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                El modo más viral de TikTok: barra de duelo Rosa vs GG en tiempo real, 2 columnas arrastrables (Villanos y Héroes), contador de victorias (WINs), meta de likes automática y visor OBS 720x1080.
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                <li className="flex items-center gap-2">• <strong className="text-white">18+ Regalos configurables</strong> con drag & drop</li>
                <li className="flex items-center gap-2">• Sonidos de meme automáticos por regalo</li>
                <li className="flex items-center gap-2">• 8 modos modulares de overlay para OBS</li>
              </ul>
            </div>

            {/* Card 2: Minecraft Studio */}
            <div id="minecraft" className="group rounded-3xl border border-[#34D399]/30 bg-[#14111D] p-6 shadow-xl hover:border-[#34D399] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 mb-5">
                <Box className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#34D399]">PaperMC 1.20.1</span>
              <h3 className="mt-1 font-extrabold text-xl text-white">Minecraft Studio & Plugin SurvivalGZ7</h3>
              <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                Conexión instantánea por RCON con PaperMC. Invocación de jefes por donaciones, tótems cinemáticos, rayos, creepers y visión nocturna infinita en segundo plano (anti-wipe).
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                <li className="flex items-center gap-2">• Plugin oficial <strong className="text-white">SurvivalGZ7.jar</strong> integrado</li>
                <li className="flex items-center gap-2">• Hasta 30 reglas y kits configurables</li>
                <li className="flex items-center gap-2">• Descarga e instalación de servidor en 1 clic</li>
              </ul>
            </div>

            {/* Card 3: Alertas Croma Key */}
            <div id="alerts" className="group rounded-3xl border border-[#818CF8]/30 bg-[#14111D] p-6 shadow-xl hover:border-[#818CF8] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/40 mb-5">
                <Tv className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#818CF8]">Hardware GPU</span>
              <h3 className="mt-1 font-extrabold text-xl text-white">Alertas con Croma Key GPU</h3>
              <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                Quita el fondo verde, azul, negro o morado de cualquier video automáticamente. Muestra alertas de regalos en 9:16 vertical u horizontal, y sube tus propios videos .mp4 y .webm.
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                <li className="flex items-center gap-2">• Recorte Croma Key por shaders WebGL</li>
                <li className="flex items-center gap-2">• Textos dinámicos: <code className="text-[#C4B5FD]">&#123;user&#125; envió &#123;gift&#125;</code></li>
                <li className="flex items-center gap-2">• Clips manuales de MVP, entrada y victoria</li>
              </ul>
            </div>

            {/* Card 4: Voz TTS Neural */}
            <div id="tts" className="group rounded-3xl border border-[#F472B6]/30 bg-[#14111D] p-6 shadow-xl hover:border-[#F472B6] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F472B6]/20 text-[#F472B6] border border-[#F472B6]/40 mb-5">
                <Mic className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F472B6]">Zero Robótica</span>
              <h3 className="mt-1 font-extrabold text-xl text-white">Voz TTS Natural & Personajes</h3>
              <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                Lee los comentarios del chat con voz humana real. Incluye presets de personajes (<strong className="text-white">Anime/Kawaii, Ardilla/Stitch, Locutor Épico</strong>), filtro anti-insultos y permisos especiales.
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                <li className="flex items-center gap-2">• Permisos para Quiéreme, Suscriptores y Mods</li>
                <li className="flex items-center gap-2">• Anuncio en voz alta de regalos y seguidores</li>
                <li className="flex items-center gap-2">• Filtro estricto OWASP contra palabras tóxicas</li>
              </ul>
            </div>

            {/* Card 5: Overlays & 5 Tops */}
            <div className="group rounded-3xl border border-[#FBBF24]/30 bg-[#14111D] p-6 shadow-xl hover:border-[#FBBF24] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40 mb-5">
                <Trophy className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FBBF24]">OBS Studio</span>
              <h3 className="mt-1 font-extrabold text-xl text-white">Overlays de Tops & Reloj Subathon</h3>
              <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                Coloca marcadores dinámicos que motivan al público a donar: Top Donadores, Duelo por la Corona, Top Tap Taps, Top 3 Regalos y el famoso Reloj Extensible que suma tiempo con regalos.
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                <li className="flex items-center gap-2">• Reloj Extensible para directos 24 horas</li>
                <li className="flex items-center gap-2">• Podio de donadores y animaciones de corona</li>
                <li className="flex items-center gap-2">• Personalización completa de colores y bordes</li>
              </ul>
            </div>

            {/* Card 6: Botonera de Sonidos & Memes */}
            <div className="group rounded-3xl border border-[#C4B5FD]/30 bg-[#14111D] p-6 shadow-xl hover:border-[#C4B5FD] transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C4B5FD]/20 text-[#C4B5FD] border border-[#C4B5FD]/40 mb-5">
                <Volume2 className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C4B5FD]">Instantáneo</span>
              <h3 className="mt-1 font-extrabold text-xl text-white">Botonera de Memes & Audios Propios</h3>
              <p className="mt-2 text-xs text-[#B8B2C8] leading-relaxed">
                Dispara más de 60 memes virales al instante o sube tus propios archivos de audio (.mp3, .wav, .ogg) para vincularlos a tus regalos y comandos del chat sin retraso.
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[#D4D4D8]">
                <li className="flex items-center gap-2">• Catálogo gratuito de sonidos de memes virales</li>
                <li className="flex items-center gap-2">• Subida de audios personalizados (.mp3/.wav)</li>
                <li className="flex items-center gap-2">• Control de volumen maestro independiente</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SECCIÓN DE PLANES Y PRECIOS ================= */}
      <section id="pricing" className="py-20 md:py-32 border-t border-white/10 bg-[#0D0B14]/80 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#8B5CF6]/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#34D399]">Planes Transparentes</span>
            <h2 className="mt-2 font-extrabold text-3xl sm:text-5xl text-white">
              Elige el plan ideal para tu canal
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#B8B2C8]">
              Empieza 100% gratis con nuestro modo invitado o adquiere el plan que impulse tus donaciones al siguiente nivel.
            </p>

            {/* Selector de moneda USD / PEN */}
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#14111D] p-1.5">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                  currency === 'USD'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-md'
                    : 'text-[#B8B2C8] hover:text-white'
                }`}
              >
                Dólares (USD $)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('PEN')}
                className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                  currency === 'PEN'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-md'
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
                <p className="text-xs text-[#B8B2C8] mt-2">Para descargar y probar al instante sin crearte cuenta.</p>

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
                className="mt-8 block w-full rounded-2xl border border-white/15 bg-[#09080F] py-3 text-center text-xs font-black uppercase tracking-wider text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all"
              >
                Descargar y Probar
              </a>
            </div>

            {/* 2. Free Registrado */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#34D399]/40 bg-[#14111D] p-6 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#34D399] px-3 py-0.5 text-[10px] font-black uppercase text-black">
                Doble de tiempo
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#34D399]">Con Cuenta Creada</span>
                <h3 className="font-extrabold text-xl text-white mt-1">FREE Registrado</h3>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-[#8E87A0] font-sans">USD / gratis</span>
                </div>
                <p className="text-xs text-[#B8B2C8] mt-2">Solo ingresa tu correo en Inicio para duplicar tu tiempo diario.</p>

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
                <p className="text-xs text-[#C4B5FD] mt-2">Roblox GvG completo y hasta 10 horas de directo al día.</p>

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
                href={getWaUrl('Plan PLUS ($9 USD/mes)')}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block w-full rounded-2xl bg-[#818CF8] py-3 text-center text-xs font-black uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-lg"
              >
                Elegir PLUS ({currency === 'USD' ? '$9 USD' : 'S/ 34 PEN'})
              </a>
            </div>

            {/* 4. Plan PRO $15 - RECOMENDADO */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-[#8B5CF6] bg-gradient-to-b from-[#1C142C] to-[#14111D] p-6 shadow-[0_0_35px_rgba(139,92,246,0.35)] relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] px-3.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-lg">
                ★ RECOMENDADO
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FBBF24]">Todo Desbloqueado</span>
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
                href={getWaUrl('Plan PRO ($15 USD/mes)')}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block w-full rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] py-3 text-center text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all"
              >
                Activar Plan PRO ({currency === 'USD' ? '$15 USD' : 'S/ 56 PEN'})
              </a>
            </div>
          </div>

          {/* Tarjeta de Pases PRO Express */}
          <div className="mt-8 rounded-3xl border border-[#FBBF24]/30 bg-[#14111D] p-6 shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/40 px-3 py-1 text-[10px] font-black uppercase text-[#FBBF24]">
                  Pases PRO Express
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">
                  ¿Solo vas a transmitir este fin de semana? Usa un Pase PRO
                </h3>
                <p className="text-xs text-[#B8B2C8] mt-1 max-w-xl">
                  Accede a todas las funciones PRO (Croma Key, Plugins Minecraft, TTS de Personajes y horas ilimitadas) sin atarte a un mes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={getWaUrl('Pase PRO 24 Horas ($1 USD)')}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[#34D399]/40 bg-[#34D399]/10 px-5 py-3 text-xs font-black text-[#34D399] hover:bg-[#34D399]/20 transition-all text-center"
                >
                  ⚡ Pase 24h &bull; {currency === 'USD' ? '$1 USD' : 'S/ 3.80 PEN'}
                </a>
                <a
                  href={getWaUrl('Pase PRO 7 Días ($5 USD)')}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-5 py-3 text-xs font-black text-[#FBBF24] hover:bg-[#FBBF24]/20 transition-all text-center"
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
                Gana días gratis recomendando la app a tus amigos
              </h2>
              <p className="mt-4 text-sm text-[#B8B2C8] leading-relaxed">
                Si cuentas con un plan mensual PLUS o PRO activo, comparte tu código personal <strong className="text-white">REF-XXXXXX</strong>. Cada amigo nuevo que active un plan mensual con tu código te otorga <strong className="text-[#34D399]">+2 días extra automáticos</strong> a tu fecha de corte (hasta 5 amigos por mes = <strong className="text-white">+10 días gratis</strong>).
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#09080F] px-4 py-2.5 font-mono text-xs text-[#C4B5FD]">
                  <span>Ejemplo:</span>
                  <strong className="text-white">REF-PRO2026</strong>
                  <button
                    type="button"
                    onClick={handleCopyDemoRef}
                    className="ml-2 text-[11px] text-[#34D399] hover:underline"
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
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#818CF8]">Dudas Frecuentes</span>
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
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-white hover:text-[#C4B5FD] transition-colors"
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white">Galactik Live &bull; Suite Interactiva</span>
              <p className="text-[11px] text-[#8E87A0]">Desarrollado para la comunidad de streamers de TikTok Live.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Funciones</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planes</a>
            <a href={DOWNLOAD_URL} className="hover:text-white transition-colors">Descarga Directa</a>
            <a href={getWaUrl('soporte general')} target="_blank" rel="noreferrer" className="text-[#34D399] hover:underline">WhatsApp Oficial</a>
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
