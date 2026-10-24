import React from 'react';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';
import { invokeTyped } from '@/api/tauri-bridge';
import { Flame, Plus, Minus, RotateCcw, Heart, Trophy } from 'lucide-react';

export const DuelLiveArena: React.FC = () => {
  const currentWins = useRobloxGvgStore((s) => s.config.current_wins ?? 7);
  const targetWins = useRobloxGvgStore((s) => s.config.target_wins ?? 15);
  const likesCurrent = useRobloxGvgStore((s) => s.config.likes_current ?? 25049);
  const likesGoal = useRobloxGvgStore((s) => s.config.likes_goal ?? 30000);
  const likesAction = useRobloxGvgStore((s) => s.config.likes_action || '-1 WIN');

  const updateSetting = useRobloxGvgStore((s) => s.updateSetting);

  const handleAction = async (action: string, valueOrPayload?: unknown) => {
    try {
      const payload =
        typeof valueOrPayload === 'object' && valueOrPayload !== null
          ? { action, ...valueOrPayload }
          : { action, value: valueOrPayload ?? 0 };
      await invokeTyped('send_gvg_control', {
        action_json: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Error enviando control de duelo:', err);
    }
  };

  const likesPct = Math.min(100, Math.round((likesCurrent / Math.max(1, likesGoal)) * 100));

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#24374B] bg-gradient-to-b from-[#0A1422] to-[#050A12] p-6 shadow-2xl">
      {/* 1. Header Stack: WINS & LIKES BAR */}
      <div className="flex flex-col items-center justify-center gap-2.5">
        {/* Marcador de Wins 1:1 Oficial */}
        <div className="flex items-center gap-2 select-none">
          <Trophy className="h-6 w-6 text-[#FFE600] drop-shadow-[0_0_8px_rgba(255,230,0,0.6)]" />
          <span
            className="font-black italic text-2xl tracking-wider text-white [text-shadow:_0_2px_4px_black,_0_0_2px_black]"
            style={{
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Win <span className="text-[#FFE600]">{currentWins}</span> / {targetWins}
          </span>
        </div>

        {/* Barra de Likes Interactiva */}
        <div className="relative flex h-8 w-full max-w-md items-center justify-center overflow-hidden rounded-full border border-[#00D9FF]/40 bg-[#050A12] px-4 shadow-[0_0_15px_rgba(0,217,255,0.15)]">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00D9FF]/40 to-[#00F0FF]/60 transition-all duration-300"
            style={{ width: `${likesPct}%` }}
          />
          <div className="relative z-10 flex items-center gap-2 text-xs font-black tracking-wide text-white drop-shadow">
            <Heart className="h-3.5 w-3.5 fill-[#FF2A85] text-[#FF2A85]" />
            <span>
              {likesAction} &bull; {likesCurrent.toLocaleString()} / {likesGoal.toLocaleString()} Likes
            </span>
            <span className="font-mono text-[10px] text-[#00D9FF]">({likesPct}%)</span>
          </div>
        </div>
      </div>

      {/* 2. Duelo Central 1:1 Flotante: Rosa vs Flame VS vs GG */}
      <div className="my-2 flex items-center justify-center gap-8 py-3">
        {/* Lado Rosa (Villanos / Izquierda) */}
        <div
          onClick={() => handleAction('push_duel', { side: 'LEFT', power: 1.0, donor: 'Streamer Test', gift: 'Rosa' })}
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
          title="Haz clic para empujar a favor de Rosa en vivo"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#FF2A85]/50 bg-gradient-to-br from-[#FF2A85]/20 to-transparent p-2 shadow-[0_0_20px_rgba(255,42,133,0.2)] group-hover:scale-105 group-hover:border-[#FF2A85] transition-all">
            <img
              src="/gifts/rose-1-coins.webp"
              alt="Rose"
              className="h-14 w-14 object-contain drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
              }}
            />
          </div>
          <span className="font-black italic text-xl text-[#FFE600] [text-shadow:_0_1.5px_0_#000,_-1.5px_0_0_#000,_1.5px_0_0_#000,_0_-1.5px_0_#000]">
            1
          </span>
          <span className="text-[11px] font-bold text-[#FF2A85] group-hover:underline">Rosa (Empujar)</span>
        </div>

        {/* VS con Fuego Central */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#00D9FF]/40 bg-[#0A1422] shadow-[0_0_20px_rgba(0,217,255,0.3)]">
            <Flame className="absolute -top-2 h-7 w-7 text-[#FF9100] animate-bounce fill-[#FF9100]" />
            <span className="font-black italic text-xl tracking-widest text-white [text-shadow:_0_2px_6px_rgba(0,217,255,0.8)]">
              VS
            </span>
          </div>
          <span className="rounded-full bg-[#00D9FF]/10 px-2.5 py-0.5 font-black text-[10px] tracking-wider text-[#00D9FF] border border-[#00D9FF]/30">
            DUELO EN VIVO
          </span>
        </div>

        {/* Lado GG (Héroes / Derecha) */}
        <div
          onClick={() => handleAction('push_duel', { side: 'RIGHT', power: 1.0, donor: 'Streamer Test', gift: 'GG' })}
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
          title="Haz clic para empujar a favor de GG en vivo"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#00D9FF]/50 bg-gradient-to-br from-[#00D9FF]/20 to-transparent p-2 shadow-[0_0_20px_rgba(0,217,255,0.2)] group-hover:scale-105 group-hover:border-[#00D9FF] transition-all">
            <img
              src="/gifts/gg-1-coins.webp"
              alt="GG"
              className="h-14 w-14 object-contain drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/gifts/gg-1-coins.webp';
              }}
            />
          </div>
          <span className="font-black italic text-xl text-[#FFE600] [text-shadow:_0_1.5px_0_#000,_-1.5px_0_0_#000,_1.5px_0_0_#000,_0_-1.5px_0_#000]">
            1
          </span>
          <span className="text-[11px] font-bold text-[#00D9FF] group-hover:underline">GG (Empujar)</span>
        </div>
      </div>

      {/* 3. Botones de Control en Vivo */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#24374B]/70 pt-4">
        <button
          type="button"
          onClick={() => {
            updateSetting('current_wins', currentWins + 1);
            handleAction('add_wins', 1);
          }}
          className="flex items-center gap-1.5 rounded-xl border border-[#23E6A8]/40 bg-[#23E6A8]/10 px-4 py-2 font-bold text-xs text-[#23E6A8] transition-all hover:bg-[#23E6A8]/20 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Sumar Win (+1)
        </button>

        <button
          type="button"
          onClick={() => {
            updateSetting('current_wins', Math.max(0, currentWins - 1));
            handleAction('add_wins', -1);
          }}
          className="flex items-center gap-1.5 rounded-xl border border-[#FF4568]/40 bg-[#FF4568]/10 px-4 py-2 font-bold text-xs text-[#FF4568] transition-all hover:bg-[#FF4568]/20 active:scale-95 cursor-pointer"
        >
          <Minus className="h-4 w-4" />
          Restar Win (-1)
        </button>

        <button
          type="button"
          onClick={() => {
            updateSetting('current_wins', 0);
            handleAction('reset_wins');
          }}
          className="flex items-center gap-1.5 rounded-xl border border-[#24374B] bg-[#101D2E] px-4 py-2 font-bold text-xs text-[#9FB2C8] transition-all hover:text-white active:scale-95 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar Wins
        </button>

        <button
          type="button"
          onClick={() => handleAction('reset_points')}
          className="flex items-center gap-1.5 rounded-xl border border-[#24374B] bg-[#101D2E] px-4 py-2 font-bold text-xs text-[#9FB2C8] transition-all hover:text-white active:scale-95 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar Ronda
        </button>
      </div>
    </div>
  );
};
