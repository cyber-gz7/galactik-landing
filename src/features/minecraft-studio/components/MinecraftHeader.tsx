import React, { useState } from 'react';
import { useMinecraftStudioStore } from '../stores/useMinecraftStudioStore';
import { Radio, Eye, Copy, Check, Terminal, Sliders } from 'lucide-react';

export const MinecraftHeader: React.FC = () => {
  const rconConfig = useMinecraftStudioStore((s) => s.rconConfig);
  const overlaySettings = useMinecraftStudioStore((s) => s.overlaySettings);
  const setPlayer = useMinecraftStudioStore((s) => s.setPlayer);
  const setOverlaySettings = useMinecraftStudioStore((s) => s.setOverlaySettings);
  const toggleNightVision = useMinecraftStudioStore((s) => s.toggleNightVision);

  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyObsUrl = () => {
    const url = 'http://localhost:17173/mc_overlay.html';
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#24374B] bg-[#0A1422] p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Lado Izquierdo: Título y Jugador Objetivo */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#23E6A8]/10 text-[#23E6A8] border border-[#23E6A8]/30 shadow-lg shadow-[#23E6A8]/10">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg tracking-wide text-white">MINECRAFT STUDIO</h2>
              <span className="flex items-center gap-1.5 rounded-full border border-[#23E6A8]/40 bg-[#23E6A8]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#23E6A8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#23E6A8] animate-ping" />
                RCON ONLINE
              </span>
            </div>
            <p className="text-xs text-[#9FB2C8]">
              PaperMC 1.20.1 &bull; Gestión de Plugins, Tótems, Jefes y Overlays
            </p>
          </div>
        </div>

        {/* Lado Derecho: Jugador Objetivo y Visión Nocturna */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Jugador Objetivo */}
          <div className="flex items-center gap-2 rounded-xl border border-[#24374B] bg-[#050A12] px-3 py-1.5">
            <span className="text-[11px] font-bold text-[#9FB2C8]">Jugador:</span>
            <input
              type="text"
              value={rconConfig.player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="CJ7_TUTORIALES"
              className="w-32 bg-transparent font-mono text-xs font-black text-[#23E6A8] focus:outline-none"
            />
          </div>

          {/* Switch de Visión Nocturna Infinita Anti-Wipe */}
          <button
            type="button"
            onClick={() => toggleNightVision(!overlaySettings.nightVision)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
              overlaySettings.nightVision
                ? 'border-[#23E6A8] bg-[#23E6A8]/20 text-[#23E6A8] shadow-[0_0_12px_rgba(35,230,168,0.2)]'
                : 'border-[#24374B] bg-[#050A12] text-[#64748B] hover:text-white'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Visión Nocturna {overlaySettings.nightVision ? 'ON' : 'OFF'}</span>
          </button>

          {/* Botón Copiar URL OBS */}
          <button
            type="button"
            onClick={handleCopyObsUrl}
            className="flex items-center gap-1.5 rounded-xl border border-[#00D9FF] bg-gradient-to-r from-[#00D9FF]/20 to-[#168BFF]/20 px-4 py-2 text-xs font-black text-[#00D9FF] shadow-sm hover:brightness-110 active:scale-95 transition-all"
          >
            {copiedUrl ? <Check className="h-4 w-4 text-[#23E6A8]" /> : <Copy className="h-4 w-4" />}
            <span>{copiedUrl ? '¡Copiado!' : 'Copiar URL OBS'}</span>
          </button>
        </div>
      </div>

      {/* Selector de Estilo de Overlay */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#24374B]/70 pt-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#9FB2C8]">
          <Sliders className="h-4 w-4 text-[#00D9FF]" />
          <span>Estilo del Overlay:</span>
        </div>

        <div className="flex items-center gap-2">
          {(['carousel', 'static', 'flat'] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setOverlaySettings({ style })}
              className={`rounded-xl px-3.5 py-1.5 font-bold transition-all ${
                overlaySettings.style === style
                  ? 'border border-[#23E6A8]/60 bg-[#23E6A8]/20 text-[#23E6A8]'
                  : 'border border-[#24374B] bg-[#050A12] text-[#9FB2C8] hover:text-white'
              }`}
            >
              {style === 'carousel' && '🎠 Carrusel Dinámico'}
              {style === 'static' && '🔲 Cuadrícula Fija'}
              {style === 'flat' && '📐 Barra Plana'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748B]">
          <Terminal className="h-3.5 w-3.5" />
          <span>RCON Port: {rconConfig.port}</span>
        </div>
      </div>
    </div>
  );
};
