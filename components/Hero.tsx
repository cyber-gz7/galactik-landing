import Link from 'next/link';
import {
  Download,
  Terminal,
  MonitorPlay,
  Flame,
  Gamepad2,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="flex flex-col items-center text-center">
          {/* Creator Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.15)] mb-8 transition-transform hover:scale-105">
            <span className="flex h-2 w-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="font-semibold text-white">By @bygerardguzman</span>
            <span className="text-zinc-400">·</span>
            <span className="text-[#fbbf24] font-bold">GZ7 Suite v1.0 Beta</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.1]">
            <span className="block mb-2">Control total para tu stream en</span>
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff2a5f] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
              Galactic Live
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-xl sm:text-2xl font-semibold text-zinc-200 max-w-3xl">
            La suite profesional de overlays y automatización para TikTok Live
          </p>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Overlays de OBS en 60 FPS acelerados por GPU, sincronización de regalos de TikTok al
            milisegundo e integración RCON para Minecraft. Todo empacado en un software nativo de
            escritorio ligero y seguro.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="/api/download"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a5f] px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(255,42,95,0.5)]"
            >
              <Download className="h-5 w-5 stroke-[2.5]" />
              <span>⬇ Descargar Galactic Live Beta</span>
            </a>

            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-slate-900/70 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-slate-800/80 hover:text-[#00f0ff] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]"
            >
              <Terminal className="h-5 w-5 text-[#00f0ff]" />
              <span>Iniciar Sesión / Registrarse</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#00f0ff]" />
              <span>Latencia ultra-baja (&lt;40ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#ff2a5f]" />
              <span>Compatible con OBS Studio 29+</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#fbbf24]" />
              <span>Licencia vinculada a tu HWID</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Telemetry Preview Card */}
        <div className="mt-16 sm:mt-20">
          <div className="relative rounded-3xl border border-white/10 bg-slate-950/80 p-2 sm:p-4 shadow-[0_0_50px_rgba(0,240,255,0.1)] backdrop-blur-2xl">
            {/* Window titlebar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-zinc-400">
                  galacticlive.exe · Stream Engine v1.0.0
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                  60 FPS · GPU ACCELERATED
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6">
              {/* Box 1: TikTok Ingestion */}
              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-[#ff2a5f]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      TikTok Live Engine
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#ff2a5f] bg-[#ff2a5f]/10 px-2 py-0.5 rounded">
                    Protobuf v3
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Estado:</span>
                    <span className="text-emerald-400">Conectado a la sala</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Último Regalo:</span>
                    <span className="text-[#fbbf24] font-semibold">Rosa x50 (@viewer10)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cola de Eventos:</span>
                    <span className="text-[#00f0ff]">0 eventos pendientes</span>
                  </div>
                </div>
              </div>

              {/* Box 2: OBS Studio WebSocket */}
              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MonitorPlay className="h-4 w-4 text-[#00f0ff]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      OBS Browser Source
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded">
                    WebSocket 5.0
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Puerto Local:</span>
                    <span className="text-white">localhost:3000/overlay</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Tasa de Refresco:</span>
                    <span className="text-[#00f0ff]">60 FPS Fluid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Renderizado:</span>
                    <span className="text-emerald-400">WebGL / GPU Canvas</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Minecraft RCON */}
              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-[#fbbf24]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      RCON Minecraft Trigger
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded">
                    TCP Socket
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Acción:</span>
                    <span className="text-[#fbbf24]">/summon creeper ~ ~ ~</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Disparador:</span>
                    <span className="text-white">Regalo Corazón TikTok</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Latencia RCON:</span>
                    <span className="text-emerald-400">12 ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Glassmorphism Feature Cards Section */}
        <div id="features" className="mt-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00f0ff]">
              Arquitectura de Vanguardia
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
              Diseñado exclusivamente para la era TikTok Live
            </p>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base">
              Tres pilares fundamentales integrados de extremo a extremo sin saturar tu CPU ni tu
              conexión a internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Overlays OBS */}
            <div className="group relative rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-slate-900/90 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-transform group-hover:scale-110">
                <MonitorPlay className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                Overlays OBS Studio
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Widgets interactivos Browser Source a 60 FPS con animaciones fluidas. Alertas de
                cofres, metas de likes en vivo, ruletas personalizadas y barras de objetivos sin
                lag.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00f0ff]" />
                  <span>Personalización CSS modular en tiempo real</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00f0ff]" />
                  <span>Soporte de sonidos e impactos visuales HD</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00f0ff]" />
                  <span>Integración de browser source en 1 clic</span>
                </li>
              </ul>
            </div>

            {/* Card 2: TikTok Live Engine */}
            <div className="group relative rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-[#ff2a5f]/50 hover:bg-slate-900/90 hover:shadow-[0_0_30px_rgba(255,42,95,0.2)]">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff2a5f]/40 bg-[#ff2a5f]/10 text-[#ff2a5f] shadow-[0_0_20px_rgba(255,42,95,0.25)] transition-transform group-hover:scale-110">
                <Flame className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#ff2a5f] transition-colors">
                TikTok Live Engine
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Ingesta ultra rápida mediante Webcast Protobuf directo a tu cliente. Recibe
                comentarios, regalos, follows, shares y batallas al instante con reconexión
                automática blindada.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#ff2a5f]" />
                  <span>Detección de combo gifts en milisegundos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#ff2a5f]" />
                  <span>Filtro anti-spam y censura inteligente</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#ff2a5f]" />
                  <span>Historial estructurado y métricas del directo</span>
                </li>
              </ul>
            </div>

            {/* Card 3: RCON Minecraft */}
            <div className="group relative rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl transition-all duration-300 hover:border-[#fbbf24]/50 hover:bg-slate-900/90 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-transform group-hover:scale-110">
                <Gamepad2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#fbbf24] transition-colors">
                RCON Minecraft & Triggers
              </h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Conecta tu servidor Spigot, Paper o Fabric mediante RCON nativo. Transforma regalos
                de TikTok en mobs hostiles, explosiones de dinamita, lluvias de diamantes o
                modificaciones climáticas.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />
                  <span>Mapeo configurable por cada regalo (ID y nombre)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />
                  <span>Comandos secuenciales con delay seguro</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />
                  <span>Compatible con servidores locales y hosts externos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
