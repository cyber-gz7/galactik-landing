'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  Terminal,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Shield,
  Activity,
  Layers,
  Zap,
  ArrowRight,
  Radio,
  Swords,
  Boxes,
  Heart,
  Gift,
  Coins,
  Users
} from 'lucide-react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'roblox' | 'universal'>('minecraft');

  return (
    <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            1. HERO HEADLINE & CTA (Apple Master Tier)
           ========================================================= */}
        <div className="flex flex-col items-center text-center">
          {/* Creator & Version Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full glass-thin px-4 py-1.5 text-xs font-medium text-zinc-300 border border-white/[0.1] shadow-[0_2px_12px_rgba(0,0,0,0.3)] mb-8 transition-all hover:border-[#00f0ff]/40 hover:bg-white/[0.05]">
            <span className="flex h-2 w-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="font-semibold text-white">CyberGZ7 · CJ7TEC</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#00f0ff] font-mono font-bold">Galactik Live v2.1.2</span>
            <span className="rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/30 px-2 py-0.2 text-[10px] font-semibold text-[#fbbf24]">
              Estable
            </span>
          </div>

          {/* Headline with optical sizing */}
          <h1 className="apple-headline text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white max-w-5xl tracking-[-0.035em]">
            La suite definitiva de overlays para{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff2a85] bg-clip-text text-transparent">
              TikTok Live
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 apple-subheadline text-lg sm:text-xl text-zinc-400 max-w-3xl leading-relaxed">
            Overlays ultra-fluidos en 60 FPS acelerados por GPU, sincronización de regalos de TikTok al milisegundo,
            integración nativa RCON para Minecraft 1.20.1 y Arena de Duelos Roblox en tiempo real.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="/api/download"
              className="apple-shine-btn w-full sm:w-auto inline-flex items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a85] px-8 py-4 text-base font-bold text-black shadow-[0_4px_24px_-4px_rgba(0,240,255,0.45)] hover:shadow-[0_8px_32px_-4px_rgba(255,42,133,0.5)]"
            >
              <Download className="h-5 w-5 stroke-[2.5]" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">Descargar Galactik Live v2.1.2</span>
                <span className="text-[11px] font-medium text-black/75">Instalador Oficial Windows x64 · 54.4 MB</span>
              </div>
            </a>

            <a
              href="#perfiles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl glass-regular border border-white/[0.12] px-7 py-4 text-sm font-semibold text-white hover:border-[#00f0ff]/40 hover:bg-white/[0.08] transition-all"
            >
              <span>Explorar Perfiles</span>
              <ArrowRight className="h-4 w-4 text-[#00f0ff]" />
            </a>
          </div>

          {/* Apple Trust Micro-Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#00f0ff]" />
              <span>Firma Authenticode CyberGZ7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#ff2a85]" />
              <span>Tailwind CSS v4 & OBS 60 FPS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#fbbf24]" />
              <span>Latencia ultra-baja &lt;40ms</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. INTERACTIVE APP SHOWCASE WINDOW (macOS/Win Native Frame)
           ========================================================= */}
        <div id="telemetria" className="mt-16 sm:mt-24">
          <div className="relative rounded-3xl glass-thick border border-white/[0.12] p-3 sm:p-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8),0_0_48px_-8px_rgba(0,240,255,0.15)] edge-light">
            
            {/* Window Titlebar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 px-2 sm:px-3">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/40" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/40" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/40" />
                </div>
                <span className="ml-2 text-xs font-mono text-zinc-400 hidden sm:inline-block">
                  Galactik Live — Pro Broadcast Suite v2.1.2
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  MOTOR ACTIVO · 60 FPS
                </span>
              </div>
            </div>

            {/* Simulated Galactik Live Dashboard Body */}
            <div className="mt-4 space-y-4">
              {/* Profile Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Minecraft Card */}
                <div
                  onClick={() => setActiveTab('minecraft')}
                  className={`cursor-pointer rounded-2xl p-4.5 transition-all text-left border ${
                    activeTab === 'minecraft'
                      ? 'bg-emerald-500/[0.08] border-emerald-400/40 shadow-[0_0_20px_rgba(35,230,168,0.2)]'
                      : 'glass-thin border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      RCON LIVE
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Minecraft Universal</h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-snug">
                    Survival, tótems automáticos, eventos masivos y visión nocturna permanente.
                  </p>
                </div>

                {/* Roblox Arena Card */}
                <div
                  onClick={() => setActiveTab('roblox')}
                  className={`cursor-pointer rounded-2xl p-4.5 transition-all text-left border ${
                    activeTab === 'roblox'
                      ? 'bg-[#ff2a85]/[0.08] border-[#ff2a85]/40 shadow-[0_0_20px_rgba(255,42,133,0.2)]'
                      : 'glass-thin border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff2a85]/15 border border-[#ff2a85]/30 text-[#ff2a85]">
                      <Swords className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#ff2a85]/10 border border-[#ff2a85]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ff2a85]">
                      DUELOS GvG
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Roblox Duelos GvG</h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-snug">
                    Arena competitiva Gift vs Gift, barra de balance en vivo y sonidos de impacto.
                  </p>
                </div>

                {/* Universal Card */}
                <div
                  onClick={() => setActiveTab('universal')}
                  className={`cursor-pointer rounded-2xl p-4.5 transition-all text-left border ${
                    activeTab === 'universal'
                      ? 'bg-[#00f0ff]/[0.08] border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'glass-thin border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff]">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00f0ff]">
                      UNIVERSAL
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Stream TTS & Chroma</h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-snug">
                    Overlays transparentes, alertas con animación cinematográfica y banco de audio.
                  </p>
                </div>
              </div>

              {/* Real-time Telemetry Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-thin rounded-2xl p-4 text-left border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                    <Heart className="h-4 w-4 text-rose-400" />
                    <span>Total Likes</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">128,450</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+480 / seg</div>
                </div>

                <div className="glass-thin rounded-2xl p-4 text-left border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                    <Gift className="h-4 w-4 text-[#00f0ff]" />
                    <span>Regalos Ingeridos</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">1,770</div>
                  <div className="text-[10px] text-[#00f0ff] font-mono mt-0.5">100% Catálogo TikTok</div>
                </div>

                <div className="glass-thin rounded-2xl p-4 text-left border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                    <Coins className="h-4 w-4 text-[#fbbf24]" />
                    <span>Monedas Acumuladas</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">45,920</div>
                  <div className="text-[10px] text-[#fbbf24] font-mono mt-0.5">Top Donador: Alex_Live</div>
                </div>

                <div className="glass-thin rounded-2xl p-4 text-left border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-1">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span>Seguidores En Vivo</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">3,892</div>
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5">Conectado a TikTok Webcast</div>
                </div>
              </div>

              {/* Bottom Quick Action Banner */}
              <div className="glass-thin rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#00f0ff] animate-ping" />
                  <span className="text-xs text-zinc-300">
                    Overlays listos para incrustar en OBS: <code className="font-mono text-[#00f0ff] bg-black/40 px-2 py-0.5 rounded">http://localhost:3000/mc_overlay.html</code>
                  </span>
                </div>
                <a
                  href="/api/download"
                  className="apple-shine-btn text-xs font-bold text-black bg-[#00f0ff] px-4 py-2 rounded-xl"
                >
                  Instalar Suite Completa
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. SECTION PERFILES & ENGINE (Architectural Deep Dive)
           ========================================================= */}
        <div id="perfiles" className="mt-28 sm:mt-36">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="apple-tag text-xs font-bold text-[#00f0ff] tracking-widest">
              Arquitectura Modular & Alto Rendimiento
            </span>
            <h2 className="mt-3 apple-headline text-3xl sm:text-5xl font-extrabold text-white">
              Tres motores especializados para dominar el algoritmo
            </h2>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed">
              Cada perfil cuenta con lógica de negocio independiente, filtrado de eventos y sincronización garantizada
              para que nunca pierdas una interacción en tu stream.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature 1: Minecraft Engine */}
            <div className="glass-regular rounded-3xl p-8 border border-white/[0.08] text-left edge-light transition-all hover:border-emerald-400/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6">
                <Boxes className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Minecraft Universal 1.20.1</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Conexión RCON directa sin caídas de TPS. Soporte para servidor Paper local con tótems automáticos,
                efectos cinemáticos, partículas de donación y protección anti-bloqueo.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Visión nocturna permanente sin parpadeos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Auto-desbloqueo de session.lock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Escalado dinámico por valor de regalo</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Roblox Duelos GvG */}
            <div id="roblox-arena" className="glass-regular rounded-3xl p-8 border border-white/[0.08] text-left edge-light transition-all hover:border-[#ff2a85]/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff2a85]/15 border border-[#ff2a85]/30 text-[#ff2a85] mb-6">
                <Swords className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Roblox Duelos Gift vs Gift</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                El formato más viral de TikTok Live: dos equipos compiten por donaciones. El sistema calcula los puntos
                al milisegundo y empuja la barra de balanceo en tiempo real.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff2a85] shrink-0" />
                  <span>Arena cinemática con pods de combate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff2a85] shrink-0" />
                  <span>Barra de poder reactiva con física Apple</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff2a85] shrink-0" />
                  <span>Soporte para 1,770 regalos de TikTok</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Engine Nativo */}
            <div className="glass-regular rounded-3xl p-8 border border-white/[0.08] text-left edge-light transition-all hover:border-[#00f0ff]/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff] mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Arquitectura Nativa en Rust</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Construido sobre Tauri v2 y Rust. Consume menos de 80 MB de memoria RAM frente a los más de 1.5 GB
                que consumen las apps basadas en Electron puro.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00f0ff] shrink-0" />
                  <span>Cero impacto en tus FPS mientras juegas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00f0ff] shrink-0" />
                  <span>Firma digital Authenticode CyberGZ7</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00f0ff] shrink-0" />
                  <span>Actualizador inteligente OTA incorporado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
