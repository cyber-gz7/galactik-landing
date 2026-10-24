import React from 'react';
import type { NavTabId } from '@/components/layout/SidebarLeft';
import {
  Sliders,
  Volume2,
  Tv,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Play
} from 'lucide-react';

const HERO_BG_PATH = '/assets/hero-banner-bg.png';
const MINECRAFT_CARD_BG_PATH = '/assets/card-minecraft-bg.png';
const ROBLOX_CARD_BG_PATH = '/assets/card-roblox-bg.png';
const UNIVERSAL_CARD_BG_PATH = '/assets/card-universal-bg.png';

interface HomeWorkspaceProps {
  onNavigateTab: (tab: NavTabId) => void;
}

export const HomeWorkspace: React.FC<HomeWorkspaceProps> = ({ onNavigateTab }) => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* ================= HERO BANNER ÉPICO (3 LAYERS) ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,240,255,0.25)] bg-[#040812] shadow-2xl min-h-[260px]">
        {/* Capa 0: Fondo Real Gamer/Espacio */}
        <img
          src={HERO_BG_PATH}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none z-0 opacity-80"
        />

        {/* Capa 1: Vignette / Filtro de legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-[#040812]/80 to-transparent z-10 pointer-events-none" />

        {/* Capa 2: UI Interactiva */}
        <div className="relative z-20 p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            {/* Tag Superior */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-3.5 py-1 text-xs font-bold text-[#00F0FF] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>GALACTK LIVE &bull; PRO BROADCAST SUITE</span>
            </div>

            {/* Título en Dos Tonos */}
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
              Tu transmisión al{' '}
              <span className="text-[#00F0FF] [text-shadow:0_0_25px_rgba(0,240,255,0.65)]">
                siguiente nivel
              </span>
            </h1>

            <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
              La suite gamer definitiva para TikTok Live: Duelos interactivos de Roblox GvG, sincronización con PaperMC 1.20.1 y overlays transparentes a 60 FPS.
            </p>

            {/* Bullets con Checks Luminosos */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-white">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00FFA3]" />
                <span>Estable (60 FPS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00FFA3]" />
                <span>Fácil de usar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#00FFA3]" />
                <span>Todo en un solo lugar</span>
              </div>
            </div>
          </div>

          {/* Botón Gigante Épico con Resplandor Exterior */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('roblox')}
              className="flex items-center justify-center gap-2.5 px-8 py-4 font-black text-black transition-all duration-200 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:shadow-[0_0_45px_rgba(0,240,255,0.85)] hover:brightness-110 active:scale-95 cursor-pointer text-sm tracking-wide"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>(()) Iniciar Transmisión &rarr;</span>
            </button>
            <span className="font-mono text-[11px] text-[#94A3B8]">
              Overlays activos en <strong className="text-[#00F0FF]">localhost:17173</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ================= 1. SELECCIONA TU PERFIL DE JUEGO (3 LAYERS) ================= */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#00F0FF]" />
              1. Selecciona tu perfil de juego
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Configura las mecánicas interactivas y overlays según el juego que vas a streamear
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tarjeta 1: Minecraft (3 Layers) */}
          <div
            onClick={() => onNavigateTab('minecraft')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#00FFA3] bg-[#040812] p-6 shadow-[0_0_25px_rgba(0,255,163,0.2)] transition-all hover:shadow-[0_0_35px_rgba(0,255,163,0.35)] cursor-pointer min-h-[220px]"
          >
            {/* Capa 0: Fondo Real */}
            <img
              src={MINECRAFT_CARD_BG_PATH}
              alt="Minecraft 3D Background"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 pointer-events-none"
            />
            {/* Capa 1: Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/75 to-transparent z-10 pointer-events-none" />

            {/* Checkmark Activo Cyan en la Esquina */}
            <div className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#00F0FF] font-black text-xs text-black shadow-[0_0_12px_#00F0FF]">
              ✓
            </div>

            {/* Capa 2: UI */}
            <div className="relative z-20 pt-16">
              <h3 className="font-black text-xl text-white group-hover:text-[#00FFA3] transition-colors">
                Minecraft
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed max-w-[220px]">
                Overlays, Tótems, RCON y Plugins de Jefes para PaperMC 1.20.1.
              </p>
            </div>

            <div className="relative z-20 mt-6 flex items-center justify-between border-t border-[rgba(0,255,163,0.2)] pt-3 text-xs">
              <span className="font-mono text-[11px] text-[#00FFA3] font-bold">16 Disparadores</span>
              <span className="flex items-center gap-1 font-bold text-white group-hover:text-[#00FFA3] group-hover:translate-x-1 transition-all">
                <span>Entrar al Estudio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Tarjeta 2: Roblox Obby (3 Layers) */}
          <div
            onClick={() => onNavigateTab('roblox')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#00F0FF] bg-[#040812] p-6 shadow-[0_0_25px_rgba(0,240,255,0.25)] transition-all hover:shadow-[0_0_35px_rgba(0,240,255,0.45)] cursor-pointer min-h-[220px]"
          >
            {/* Capa 0: Fondo Real */}
            <img
              src={ROBLOX_CARD_BG_PATH}
              alt="Roblox 3D Background"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 pointer-events-none"
            />
            {/* Capa 1: Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/75 to-transparent z-10 pointer-events-none" />

            {/* Checkmark Activo Cyan en la Esquina */}
            <div className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#00F0FF] font-black text-xs text-black shadow-[0_0_12px_#00F0FF]">
              ✓
            </div>

            {/* Capa 2: UI */}
            <div className="relative z-20 pt-16">
              <h3 className="font-black text-xl text-white group-hover:text-[#00F0FF] transition-colors">
                Roblox (Obby)
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed max-w-[220px]">
                Duelo Gift vs Gift, 2 Columnas de regalos, Drag &amp; Drop y Wins.
              </p>
            </div>

            <div className="relative z-20 mt-6 flex items-center justify-between border-t border-[rgba(0,240,255,0.2)] pt-3 text-xs">
              <span className="font-mono text-[11px] text-[#00F0FF] font-bold">18 Regalos Oficiales</span>
              <span className="flex items-center gap-1 font-bold text-white group-hover:text-[#00F0FF] group-hover:translate-x-1 transition-all">
                <span>Entrar al Duelo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Tarjeta 3: Universal / IRL (3 Layers) */}
          <div
            onClick={() => onNavigateTab('tops')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[rgba(0,240,255,0.15)] bg-[#040812] p-6 shadow-lg transition-all hover:border-[#8B5CFF]/60 hover:shadow-[0_0_25px_rgba(139,92,255,0.25)] cursor-pointer min-h-[220px]"
          >
            {/* Capa 0: Fondo Real */}
            <img
              src={UNIVERSAL_CARD_BG_PATH}
              alt="Universal 3D Background"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 pointer-events-none"
            />
            {/* Capa 1: Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/75 to-transparent z-10 pointer-events-none" />

            {/* Capa 2: UI */}
            <div className="relative z-20 pt-16">
              <h3 className="font-black text-xl text-white group-hover:text-[#8B5CFF] transition-colors">
                Universal / IRL
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed max-w-[220px]">
                Metas de likes, ranking de donadores, ruleta y sintetizador TTS.
              </p>
            </div>

            <div className="relative z-20 mt-6 flex items-center justify-between border-t border-[rgba(139,92,255,0.2)] pt-3 text-xs">
              <span className="font-mono text-[11px] text-[#8B5CFF] font-bold">1,770 Regalos</span>
              <span className="flex items-center gap-1 font-bold text-white group-hover:text-[#8B5CFF] group-hover:translate-x-1 transition-all">
                <span>Explorar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. ACCEDE A TUS HERRAMIENTAS PRINCIPALES ================= */}
      <div>
        <div className="mb-4">
          <h2 className="font-display font-black text-sm tracking-wider text-white uppercase flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FFE600]" />
            2. Accede a tus herramientas principales
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Widgets especializados con efectos de resplandor neón e integración en vivo con OBS
          </p>
        </div>

        {/* Las 5 Tarjetas de Colores Vibrantes con Glows Específicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* 1. Overlay Editor (Morado #8B5CFF) */}
          <div
            onClick={() => onNavigateTab('roblox')}
            className="group flex flex-col justify-between rounded-2xl border-2 border-[#8B5CFF]/40 bg-[#091322] p-4 shadow-[0_0_15px_rgba(139,92,255,0.15)] hover:border-[#8B5CFF] hover:shadow-[0_0_25px_rgba(139,92,255,0.4)] transition-all cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CFF]/20 text-[#8B5CFF] border border-[#8B5CFF]/40 mb-3 shadow-[0_0_10px_rgba(139,92,255,0.3)]">
                <Sliders className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[#8B5CFF] transition-colors">
                Overlay Editor
              </h4>
              <p className="mt-1 text-[11px] text-[#94A3B8]">Personaliza widgets y croma</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#8B5CFF] group-hover:translate-x-1 transition-transform">
              <span>Abrir editor</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 2. Sonidos & Memes (Ámbar / Naranja #FF9900) */}
          <div
            onClick={() => onNavigateTab('sounds')}
            className="group flex flex-col justify-between rounded-2xl border-2 border-[#FF9900]/40 bg-[#091322] p-4 shadow-[0_0_15px_rgba(255,153,0,0.15)] hover:border-[#FF9900] hover:shadow-[0_0_25px_rgba(255,153,0,0.4)] transition-all cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 mb-3 shadow-[0_0_10px_rgba(255,153,0,0.3)]">
                <Volume2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[#FF9900] transition-colors">
                Sonidos &amp; Memes
              </h4>
              <p className="mt-1 text-[11px] text-[#94A3B8]">Banco gratis de efectos</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#FF9900] group-hover:translate-x-1 transition-transform">
              <span>Reproducir</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 3. Alertas & Croma (Verde Esmeralda #00FFA3) */}
          <div
            onClick={() => onNavigateTab('alerts')}
            className="group flex flex-col justify-between rounded-2xl border-2 border-[#00FFA3]/40 bg-[#091322] p-4 shadow-[0_0_15px_rgba(0,255,163,0.15)] hover:border-[#00FFA3] hover:shadow-[0_0_25px_rgba(0,255,163,0.4)] transition-all cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FFA3]/20 text-[#00FFA3] border border-[#00FFA3]/40 mb-3 shadow-[0_0_10px_rgba(0,255,163,0.3)]">
                <Tv className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[#00FFA3] transition-colors">
                Alertas &amp; Croma
              </h4>
              <p className="mt-1 text-[11px] text-[#94A3B8]">Efectos en pantalla verde</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#00FFA3] group-hover:translate-x-1 transition-transform">
              <span>Configurar</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 4. TTS Chat en Vivo (Azul Eléctrico #00D9FF) */}
          <div
            onClick={() => onNavigateTab('catalog')}
            className="group flex flex-col justify-between rounded-2xl border-2 border-[#00D9FF]/40 bg-[#091322] p-4 shadow-[0_0_15px_rgba(0,217,255,0.15)] hover:border-[#00D9FF] hover:shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 mb-3 shadow-[0_0_10px_rgba(0,217,255,0.3)]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[#00D9FF] transition-colors">
                TTS Chat en Vivo
              </h4>
              <p className="mt-1 text-[11px] text-[#94A3B8]">Voz en vivo para comentarios</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#00D9FF] group-hover:translate-x-1 transition-transform">
              <span>Activar voz</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* 5. Plantillas / 1,770 Regalos (Rosa / Magenta #FF2A85) */}
          <div
            onClick={() => onNavigateTab('catalog')}
            className="group flex flex-col justify-between rounded-2xl border-2 border-[#FF2A85]/40 bg-[#091322] p-4 shadow-[0_0_15px_rgba(255,42,133,0.15)] hover:border-[#FF2A85] hover:shadow-[0_0_25px_rgba(255,42,133,0.4)] transition-all cursor-pointer"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF2A85]/20 text-[#FF2A85] border border-[#FF2A85]/40 mb-3 shadow-[0_0_10px_rgba(255,42,133,0.3)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[#FF2A85] transition-colors">
                Plantillas &amp; Regalos
              </h4>
              <p className="mt-1 text-[11px] text-[#94A3B8]">1,770 regalos listos</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#FF2A85] group-hover:translate-x-1 transition-transform">
              <span>Ver catálogo</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
