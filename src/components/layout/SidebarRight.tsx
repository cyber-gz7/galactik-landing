import React, { useState } from 'react';
import { useAppConfigStore } from '@/stores/useAppConfigStore';
import { UpdateNotificationPill } from '@/features/auto-updater/components/UpdateNotificationPill';
import {
  Wifi,
  Activity,
  Monitor,
  Settings,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const SidebarRight: React.FC = () => {
  const streamerUsername = useAppConfigStore((s) => s.streamerUsername);
  const isConnected = useAppConfigStore((s) => s.isConnectedTikTok);
  const setConnectedTikTok = useAppConfigStore((s) => s.setConnectedTikTok);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [inputUser, setInputUser] = useState(streamerUsername);
  const setStreamerUsername = useAppConfigStore((s) => s.setStreamerUsername);

  const handleToggle = () => {
    setConnectedTikTok(!isConnected);
  };

  const handleSaveUser = () => {
    if (inputUser.trim()) {
      setStreamerUsername(inputUser.replace(/^@/, '').trim());
      setIsConfigOpen(false);
    }
  };

  return (
    <aside className="w-[320px] shrink-0 border-l border-[rgba(0,240,255,0.15)] bg-[#070E1A] p-5 flex flex-col gap-5 h-full overflow-y-auto select-none [scrollbar-width:thin] z-20">
      {/* ================= TARJETA 1: MOTOR TIKTOK LIVE ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,240,255,0.2)] bg-gradient-to-b from-[#091322] to-[#050A14] p-5 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
        {/* Glow de esquina */}
        <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-[#00F0FF]/15 blur-2xl pointer-events-none" />

        {/* Encabezado y Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xs tracking-wider text-white uppercase">
              MOTOR TIKTOK LIVE
            </span>
          </div>

          {/* Switch Deslizable Gaming */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isConnected}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#162232] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]"></div>
          </label>
        </div>

        {/* Badge de Estado y Usuario */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/40 text-[#00FFA3]">
            <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_#00FFA3]" />
            <span className="font-bold">{isConnected ? 'CONECTADO' : 'EN ESPERA'}</span>
          </div>

          <span className="font-mono text-xs font-black text-white">
            @{streamerUsername || 'Webcast GZ7'}
          </span>
        </div>

        {/* 3 Mini-Cajas de Métricas Tácticas */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-[rgba(0,240,255,0.12)] bg-[#040812] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#94A3B8] font-bold">
              <Wifi className="h-3 w-3 text-[#00FFA3]" />
              <span>Ping</span>
            </div>
            <div className="font-mono font-black text-sm text-white mt-0.5">24 ms</div>
          </div>

          <div className="rounded-2xl border border-[rgba(0,240,255,0.12)] bg-[#040812] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#94A3B8] font-bold">
              <Activity className="h-3 w-3 text-[#00F0FF]" />
              <span>Estable</span>
            </div>
            <div className="font-mono font-black text-sm text-[#00F0FF] mt-0.5">99%</div>
          </div>

          <div className="rounded-2xl border border-[rgba(0,240,255,0.12)] bg-[#040812] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#94A3B8] font-bold">
              <Monitor className="h-3 w-3 text-[#FFE600]" />
              <span>Calidad</span>
            </div>
            <div className="font-mono font-black text-sm text-[#FFE600] mt-0.5">1080p</div>
          </div>
        </div>

        {/* Botón Configurar Conexión */}
        <div className="mt-4">
          {isConfigOpen ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
                placeholder="@tu_usuario"
                className="flex-1 rounded-xl border border-[#00F0FF] bg-[#040812] px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveUser}
                className="rounded-xl bg-[#00F0FF] px-3 py-1.5 text-xs font-black text-black hover:brightness-110 cursor-pointer"
              >
                Guardar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[rgba(0,240,255,0.25)] bg-[#0A1424] py-2 text-xs font-bold text-[#94A3B8] hover:border-[#00F0FF] hover:text-white transition-all cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>⚙ Configurar Conexión</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TARJETA 2: ESTADO DEL SISTEMA ================= */}
      <div className="rounded-3xl border border-[rgba(0,240,255,0.15)] bg-[#091322] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgba(0,240,255,0.1)] pb-3">
          <span className="font-display font-black text-xs tracking-wider text-white uppercase">
            ESTADO DEL SISTEMA
          </span>
          <span className="h-2 w-2 rounded-full bg-[#00FFA3] animate-pulse shadow-[0_0_8px_#00FFA3]" />
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050A14] border border-[rgba(0,240,255,0.08)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00FFA3] shadow-[0_0_6px_#00FFA3]" />
              <span className="text-[#94A3B8]">Servicios Online</span>
            </div>
            <span className="font-bold text-[#00FFA3]">Operativo</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#050A14] border border-[rgba(0,240,255,0.08)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00FFA3] shadow-[0_0_6px_#00FFA3]" />
              <span className="text-[#94A3B8]">Actualizaciones</span>
            </div>
            <UpdateNotificationPill />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050A14] border border-[rgba(0,240,255,0.08)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
              <span className="text-[#94A3B8]">Licencia PRO</span>
            </div>
            <span className="font-bold text-[#00F0FF]">Activa (Ilimitada)</span>
          </div>
        </div>
      </div>

      {/* ================= TARJETA 3: NOVEDADES & BETA ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#FF2A85]/30 bg-gradient-to-br from-[#091322] to-[#12081C] p-5 shadow-[0_0_20px_rgba(255,42,133,0.15)]">
        <div className="flex items-center justify-between">
          <span className="font-display font-black text-xs tracking-wider text-white uppercase flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-[#FF2A85] fill-current" />
            NOVEDADES
          </span>
          <span className="rounded-full border border-[#FF2A85]/50 bg-[#FF2A85]/15 px-2.5 py-0.5 font-mono text-[10px] font-black text-[#FF2A85]">
            v2.2.2 PRO
          </span>
        </div>

        <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
          Nueva suite con React 19 y Zustand a 60 FPS: Drag &amp; Drop de regalos, Catálogo virtual de 1,770 items y PaperMC 1.20.1 sin lag.
        </p>

        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#00F0FF]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#00FFA3]" />
          <span>Actualización Instantánea (2s)</span>
        </div>
      </div>
    </aside>
  );
};
