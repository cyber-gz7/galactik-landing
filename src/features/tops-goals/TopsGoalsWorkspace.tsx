import React, { useState } from 'react';
import {
  Trophy,
  Heart,
  Crown,
  Target,
  Clock,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Plus,
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';
import { invokeTyped } from '@/api/tauri-bridge';

const BANNER_BG = '/assets/banner-inicio.png';

interface OverlayWidgetInfo {
  id: 'donors' | 'likes' | 'mvp' | 'counter' | 'timer';
  title: string;
  tag: string;
  url: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgGlow: string;
  suggestedSize: string;
  description: string;
}

const WIDGETS: OverlayWidgetInfo[] = [
  {
    id: 'donors',
    title: 'Top Donadores VIP',
    tag: 'RANKING EN VIVO',
    url: 'http://127.0.0.1:4000/top_donadores.html',
    icon: Trophy,
    color: 'text-[#FFE600]',
    bgGlow: 'bg-[#FFE600]/10 border-[#FFE600]/30',
    suggestedSize: '360 x 500 px',
    description: 'Tabla de clasificación en tiempo real con avatares, coronas doradas y totales de diamantes.'
  },
  {
    id: 'likes',
    title: 'Top Taps & Likes',
    tag: 'RÉCORD DE LIKES',
    url: 'http://127.0.0.1:4000/top_likes.html',
    icon: Heart,
    color: 'text-[#FF2A85]',
    bgGlow: 'bg-[#FF2A85]/10 border-[#FF2A85]/30',
    suggestedSize: '320 x 420 px',
    description: 'Ranking de los espectadores con mayor cantidad de toques en pantalla durante el directo.'
  },
  {
    id: 'mvp',
    title: 'MVP de la Sesión',
    tag: 'MÁXIMO DONADOR',
    url: 'http://127.0.0.1:4000/mvp.html',
    icon: Crown,
    color: 'text-[#00F0FF]',
    bgGlow: 'bg-[#00F0FF]/10 border-[#00F0FF]/30',
    suggestedSize: '400 x 90 px',
    description: 'Píldora flotante ultra-limpia que destaca al mayor donador activo de toda la transmisión.'
  },
  {
    id: 'counter',
    title: 'Contador de Victorias',
    tag: 'METAS & MARCADOR',
    url: 'http://127.0.0.1:4000/contador.html',
    icon: Target,
    color: 'text-[#00FFA3]',
    bgGlow: 'bg-[#00FFA3]/10 border-[#00FFA3]/30',
    suggestedSize: '350 x 100 px',
    description: 'Marcador visual de victorias vs derrotas para retos de Roblox, Minecraft o TikTok.'
  },
  {
    id: 'timer',
    title: 'Cronómetro Supervivencia',
    tag: 'SUBATHÓN & RETOS',
    url: 'http://127.0.0.1:4000/cronometro.html',
    icon: Clock,
    color: 'text-[#8B5CFF]',
    bgGlow: 'bg-[#8B5CFF]/10 border-[#8B5CFF]/30',
    suggestedSize: '300 x 90 px',
    description: 'Reloj en tiempo real para transmisiones maratónicas, subathones o partidas por tiempo.'
  }
];

export const TopsGoalsWorkspace: React.FC = () => {
  const [activePreview, setActivePreview] = useState<OverlayWidgetInfo['id']>('donors');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(1);

  // Estados de simulación de MVP
  const [mvpUser, setMvpUser] = useState('Titan_Gamer_VIP');
  const [mvpGift, setMvpGift] = useState('León Legendario');
  const [mvpCoins, setMvpCoins] = useState(29999);
  const [mvpSuccess, setMvpSuccess] = useState(false);

  // Estado del contador de victorias
  const [counterStatus, setCounterStatus] = useState<string | null>(null);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleOpenBrowser = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSetMvp = async () => {
    try {
      await invokeTyped('emit_session_mvp', {
        username: mvpUser,
        gift_name: mvpGift,
        coins: mvpCoins
      });
      setMvpSuccess(true);
      setTimeout(() => setMvpSuccess(false), 2500);
    } catch {
      try {
        await fetch('http://127.0.0.1:4000/api/session-mvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: mvpUser,
            giftName: mvpGift,
            coins: mvpCoins
          })
        });
        setMvpSuccess(true);
        setTimeout(() => setMvpSuccess(false), 2500);
      } catch (err) {
        console.error('Error al actualizar MVP:', err);
      }
    }
  };

  const handleAddWin = async (delta: number) => {
    try {
      await invokeTyped('modify_gvg_win', { delta });
      setCounterStatus(delta > 0 ? '+1 Victoria sumada' : '-1 Derrota descontada');
      setTimeout(() => setCounterStatus(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleResetWins = async () => {
    try {
      await invokeTyped('reset_gvg_wins');
      setCounterStatus('Marcador reiniciado a 0');
      setTimeout(() => setCounterStatus(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSimulateDonation = async (user: string, title: string, coins: number) => {
    try {
      await invokeTyped('emit_custom_alert', {
        alert_json: JSON.stringify({
          type: 'gift',
          user,
          gift: title,
          giftName: title,
          coins,
          diamondCount: coins,
          video: '/s2e_media/videos/public/any/1778416811923_banana-turret-boss.webm',
          duration: 4
        })
      });
      setCounterStatus(`Donación simulada: ${user} (${coins} 💎)`);
      setTimeout(() => setCounterStatus(null), 2000);
    } catch {
      // Fallback
    }
  };

  const activeWidget = WIDGETS.find((w) => w.id === activePreview) ?? WIDGETS[0];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* ================= HERO BANNER ÉPICO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,240,255,0.25)] bg-[#040812] shadow-2xl min-h-[190px]">
        <img
          src={BANNER_BG}
          alt="Tops Banner"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none z-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-[#040812]/80 to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFE600]/30 bg-[#FFE600]/10 px-3.5 py-1 text-xs font-bold text-[#FFE600] mb-3">
              <Trophy className="h-3.5 w-3.5" />
              <span>TABLAS DE CLASIFICACIÓN &bull; STREAM OVERLAYS</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
              Tops, Metas &amp;{' '}
              <span className="text-[#FFE600] [text-shadow:0_0_25px_rgba(255,230,0,0.65)]">
                Líderes en Vivo
              </span>
            </h1>

            <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
              Widgets visuales listos para OBS: Top donadores VIP, récord de toques en vivo, insignia de MVP de la sesión, marcador de victorias y cronómetro de retos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCopy(activeWidget.url)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFE600] to-[#FF8800] font-black text-xs uppercase tracking-wider text-black shadow-[0_0_20px_rgba(255,230,0,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {copiedUrl === activeWidget.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedUrl === activeWidget.url ? '¡Enlace Copiado!' : 'Copiar URL Actual'}</span>
            </button>
            <button
              onClick={() => handleOpenBrowser(activeWidget.url)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[rgba(255,230,0,0.3)] bg-[#070F1E]/80 text-[#FFE600] font-bold text-xs hover:bg-[#FFE600]/10 active:scale-95 transition-all cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Abrir Widget</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= GRID DE WIDGETS Y CONTROLES ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Columna Izquierda: Tarjetas de Widgets (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8]">
              Widgets Disponibles ({WIDGETS.length})
            </h2>
            {counterStatus && (
              <span className="text-xs font-bold text-[#00FFA3] animate-pulse">
                {counterStatus}
              </span>
            )}
          </div>

          {/* Lista de Widgets */}
          {WIDGETS.map((w) => {
            const Icon = w.icon;
            const isSelected = activePreview === w.id;
            const isCopied = copiedUrl === w.url;

            return (
              <div
                key={w.id}
                onClick={() => setActivePreview(w.id)}
                className={`rounded-2xl border p-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#00F0FF] bg-[#070F1E] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'border-[rgba(0,240,255,0.12)] bg-[#070F1E]/70 hover:border-[rgba(0,240,255,0.3)] hover:bg-[#070F1E]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${w.bgGlow}`}>
                      <Icon className={`h-5 w-5 ${w.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-white">{w.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[#94A3B8]">
                          {w.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{w.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(w.url);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold hover:bg-[#00F0FF]/25 transition-all cursor-pointer"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? 'Copiado' : 'Copiar URL'}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBrowser(w.url);
                      }}
                      className="p-1.5 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      title="Abrir en pestaña"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)] text-xs">
                  <span className="font-mono text-[#00F0FF]/80 text-[11px] truncate max-w-[280px]">
                    {w.url}
                  </span>
                  <span className="text-[#94A3B8] text-[11px]">
                    Tamaño sugerido: <strong className="text-white font-mono">{w.suggestedSize}</strong>
                  </span>
                </div>

                {/* Controles Específicos según el Widget Seleccionado */}
                {isSelected && w.id === 'donors' && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] bg-[#040812]/60 rounded-xl p-3">
                    <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#FFE600]" />
                      <span>Simulador de Donación para Leaderboard</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateDonation('Gamer_King', 'León', 29999);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FFE600]/15 border border-[#FFE600]/30 text-[#FFE600] text-xs font-bold hover:bg-[#FFE600]/25 transition-all cursor-pointer"
                      >
                        🦁 Enviar León (29,999 💎)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateDonation('Ana_Stream', 'Oso con Rosa', 5663);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FF2A85]/15 border border-[#FF2A85]/30 text-[#FF2A85] text-xs font-bold hover:bg-[#FF2A85]/25 transition-all cursor-pointer"
                      >
                        🌹 Enviar Oso (5,663 💎)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateDonation('Top_Fan', 'Rosa', 1);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00FFA3]/15 border border-[#00FFA3]/30 text-[#00FFA3] text-xs font-bold hover:bg-[#00FFA3]/25 transition-all cursor-pointer"
                      >
                        🌱 Enviar Rosa (1 💎)
                      </button>
                    </div>
                  </div>
                )}

                {isSelected && w.id === 'mvp' && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] bg-[#040812]/60 rounded-xl p-3">
                    <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Crown className="h-3.5 w-3.5 text-[#00F0FF]" />
                        <span>Fijar MVP de la Sesión en Tiempo Real</span>
                      </span>
                      {mvpSuccess && (
                        <span className="text-[#00FFA3] text-[11px] animate-pulse">
                          ¡MVP Actualizado!
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        value={mvpUser}
                        onChange={(e) => setMvpUser(e.target.value)}
                        placeholder="Usuario MVP"
                        className="bg-[#070F1E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00F0FF]"
                      />
                      <input
                        type="text"
                        value={mvpGift}
                        onChange={(e) => setMvpGift(e.target.value)}
                        placeholder="Regalo Enviado"
                        className="bg-[#070F1E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00F0FF]"
                      />
                      <input
                        type="number"
                        value={mvpCoins}
                        onChange={(e) => setMvpCoins(Number(e.target.value))}
                        placeholder="Monedas"
                        className="bg-[#070F1E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00F0FF] font-mono"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetMvp();
                      }}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#0077FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Crown className="h-3.5 w-3.5" />
                      <span>Proclamar Nuevo MVP</span>
                    </button>
                  </div>
                )}

                {isSelected && w.id === 'counter' && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] bg-[#040812]/60 rounded-xl p-3">
                    <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-[#00FFA3]" />
                      <span>Control Manual del Marcador de Victorias</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddWin(1);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00FFA3]/15 border border-[#00FFA3]/30 text-[#00FFA3] text-xs font-bold hover:bg-[#00FFA3]/25 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>+1 Victoria</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddWin(-1);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FF2A85]/15 border border-[#FF2A85]/30 text-[#FF2A85] text-xs font-bold hover:bg-[#FF2A85]/25 transition-all cursor-pointer"
                      >
                        <span>-1 Derrota</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetWins();
                        }}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-[#94A3B8] text-xs font-bold hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reiniciar Marcador</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Vista Previa en Vivo del Widget Activo (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-[rgba(0,240,255,0.2)] bg-[#070F1E]/95 backdrop-blur-md p-5 flex flex-col h-full min-h-[560px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(0,240,255,0.1)]">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#00F0FF]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Vista Previa: {activeWidget.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-[11px] font-bold hover:bg-[#00F0FF]/20 transition-all cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Recargar</span>
              </button>
            </div>

            {/* Selector Rápido de Pestaña de Preview */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {WIDGETS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActivePreview(w.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activePreview === w.id
                      ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-[#040812] text-[#94A3B8] hover:text-white border border-white/5'
                  }`}
                >
                  {w.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Contenedor Iframe con fondo Gamer */}
            <div className="flex-1 relative rounded-xl border border-[rgba(0,240,255,0.2)] bg-[#040812] overflow-hidden flex items-center justify-center shadow-inner min-h-[380px]">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #00F0FF 1px, transparent 1px)`,
                  backgroundSize: '16px 16px'
                }}
              />

              <iframe
                key={`${activePreview}-${previewKey}`}
                src={activeWidget.url}
                title={activeWidget.title}
                className="w-full h-full border-0 relative z-10"
                style={{ background: 'transparent' }}
              />

              <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-[#94A3B8] pointer-events-none">
                {activeWidget.suggestedSize}
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#94A3B8] text-center">
              💡 Para agregarlo en OBS: Agrega una fuente de tipo <strong>Navegador</strong> y pega la URL copiada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};