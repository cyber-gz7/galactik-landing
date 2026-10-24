import React, { useState } from 'react';
import {
  Tv,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Volume2,
  Clock,
  Send,
  Eye,
  RefreshCw,
  Layers,
  Zap
} from 'lucide-react';
import { invokeTyped } from '@/api/tauri-bridge';

const BG_BANNER_PATH = '/assets/card-universal-bg.png';
const OVERLAY_URL = 'http://127.0.0.1:4000/alerta.html';

export const AlertsChromaWorkspace: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [similarity, setSimilarity] = useState(38);
  const [smoothness, setSmoothness] = useState(14);
  const [volume, setVolume] = useState(85);
  const [duration, setDuration] = useState(6);
  const [chromaMode, setChromaMode] = useState<'auto' | 'green' | 'magenta' | 'off'>('auto');

  // Formulario de prueba
  const [testUser, setTestUser] = useState('GZ7_Streamer');
  const [testGift, setTestGift] = useState('León Épico');
  const [testCoins, setTestCoins] = useState(5509);
  const [testTemplate, setTestTemplate] = useState('¡{user} ha enviado {gift}!');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Key de recarga para iframe preview
  const [iframeKey, setIframeKey] = useState(1);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(OVERLAY_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleOpenBrowser = () => {
    window.open(OVERLAY_URL, '_blank');
  };

  const handleTriggerAlert = async (customPayload?: Record<string, unknown>) => {
    setIsSending(true);
    setSendSuccess(false);

    const payload = customPayload ?? {
      type: 'CUSTOM_ALERT',
      user: testUser,
      gift: testGift,
      giftName: testGift,
      coins: testCoins,
      diamondCount: testCoins,
      template: testTemplate,
      video: '/s2e_media/videos/public/any/1778416829646_zombie-face-burst.webm',
      audioUrl: '/s2e_media/audio/public/1701804736796_prowler-sound-effect.mp3',
      audioVolume: volume,
      duration,
      chromaKeyEnabled: chromaMode !== 'off',
      similarity,
      smoothness,
      skip_cooldown: true
    };

    try {
      await invokeTyped('emit_custom_alert', {
        alert_json: JSON.stringify(payload)
      });
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2500);
    } catch {
      try {
        await fetch('http://127.0.0.1:4000/api/alerta/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 2500);
      } catch (err) {
        console.error('Error al enviar alerta:', err);
      }
    } finally {
      setIsSending(false);
    }
  };

  const triggerPreset = (type: 'lion' | 'bear' | 'supercar' | 'zombie') => {
    switch (type) {
      case 'lion':
        handleTriggerAlert({
          type: 'CUSTOM_ALERT',
          user: 'Donador_VIP',
          gift: 'León Salvaje',
          giftName: 'León Salvaje',
          coins: 29999,
          template: '👑 ¡{user} soltó un {gift} ({coins} 💎)!',
          video: '/s2e_media/videos/public/any/1778416811923_banana-turret-boss.webm',
          audioUrl: '/s2e_media/audio/public/1701803248248_lion-king-funny.mp3',
          audioVolume: volume,
          duration: 7,
          chromaKeyEnabled: chromaMode !== 'off',
          similarity,
          smoothness,
          skip_cooldown: true
        });
        break;
      case 'bear':
        handleTriggerAlert({
          type: 'CUSTOM_ALERT',
          user: 'Fan_NumeroUno',
          gift: 'Oso con Rosa',
          giftName: 'Oso con Rosa',
          coins: 5663,
          template: '🌹 ¡{user} regaló un {gift}!',
          video: '/s2e_media/videos/public/any/1778416834892_fat-raccoon-screen-thief.webm',
          audioUrl: '/s2e_media/audio/public/1702221560354_love-moment.mp3',
          audioVolume: volume,
          duration: 6,
          chromaKeyEnabled: chromaMode !== 'off',
          similarity,
          smoothness,
          skip_cooldown: true
        });
        break;
      case 'supercar':
        handleTriggerAlert({
          type: 'CUSTOM_ALERT',
          user: 'Speed_Runner',
          gift: 'Supercar Galáctico',
          giftName: 'Supercar Galáctico',
          coins: 10000,
          template: '🏎️ ¡{user} aceleró con un {gift}!',
          video: '/s2e_media/videos/public/any/1778416817343_device-magnet-pull-crash.webm',
          audioUrl: '/s2e_media/audio/public/1702224870406_deja-vu.mp3',
          audioVolume: volume,
          duration: 6,
          chromaKeyEnabled: chromaMode !== 'off',
          similarity,
          smoothness,
          skip_cooldown: true
        });
        break;
      case 'zombie':
        handleTriggerAlert({
          type: 'CUSTOM_ALERT',
          user: 'Gamer_NivelMax',
          gift: 'Zombie Face Burst',
          giftName: 'Zombie Face Burst',
          coins: 1500,
          template: '💀 ¡{user} activó {gift}!',
          video: '/s2e_media/videos/public/any/1778416829646_zombie-face-burst.webm',
          audioUrl: '/s2e_media/audio/public/1699891800834_zombie-minecraft.mp3',
          audioVolume: volume,
          duration: 5,
          chromaKeyEnabled: chromaMode !== 'off',
          similarity,
          smoothness,
          skip_cooldown: true
        });
        break;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* ================= HERO BANNER ÉPICO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,240,255,0.25)] bg-[#040812] shadow-2xl min-h-[190px]">
        <img
          src={BG_BANNER_PATH}
          alt="Alerts Banner"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none z-0 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-[#040812]/80 to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-3.5 py-1 text-xs font-bold text-[#00F0FF] mb-3">
              <Tv className="h-3.5 w-3.5" />
              <span>MOTOR OVERLAY VERTICAL &bull; PUERTO :4000</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
              Alertas &amp;{' '}
              <span className="text-[#00F0FF] [text-shadow:0_0_25px_rgba(0,240,255,0.65)]">
                Croma Key OBS
              </span>
            </h1>

            <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
              Overlay transparente 9:16 con supresión de fondo automática en GPU, reproducción sin lag y cola de regalos prioritarios para OBS Studio o TikTok Live Studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0077FF] font-black text-xs uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? '¡URL Copiada!' : 'Copiar URL OBS'}</span>
            </button>
            <button
              onClick={handleOpenBrowser}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[rgba(0,240,255,0.3)] bg-[#070F1E]/80 text-[#00F0FF] font-bold text-xs hover:bg-[#00F0FF]/10 active:scale-95 transition-all cursor-pointer"
              title="Abrir en navegador externo"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Probar en OBS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= GRID PRINCIPAL DE CONFIGURACIÓN ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Columna Izquierda / Centro: Ajustes y Pruebas (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Card 1: URL & Datos de Integración OBS */}
          <div className="rounded-2xl border border-[rgba(0,240,255,0.15)] bg-[#070F1E]/90 backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Navegador OBS (Browser Source)</h3>
                  <p className="text-xs text-[#94A3B8]">Copia y pega este enlace directo en tu escena de OBS</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/30">
                <span className="h-2 w-2 rounded-full bg-[#00FFA3] animate-pulse" />
                ACTIVO
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#040812] border border-[rgba(0,240,255,0.2)] rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={OVERLAY_URL}
                className="bg-transparent text-sm font-mono text-[#00F0FF] outline-none flex-1 px-2 select-all"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold hover:bg-[#00F0FF]/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
              <div className="rounded-xl border border-[rgba(0,240,255,0.1)] bg-[#040812]/50 p-2.5">
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Ancho sugerido</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">720 px</div>
              </div>
              <div className="rounded-xl border border-[rgba(0,240,255,0.1)] bg-[#040812]/50 p-2.5">
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Alto sugerido</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">1280 px</div>
              </div>
              <div className="rounded-xl border border-[rgba(0,240,255,0.1)] bg-[#040812]/50 p-2.5">
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Tasa de cuadros</div>
                <div className="text-sm font-mono font-bold text-[#00FFA3] mt-0.5">60 FPS</div>
              </div>
              <div className="rounded-xl border border-[rgba(0,240,255,0.1)] bg-[#040812]/50 p-2.5">
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Fondo Transparente</div>
                <div className="text-sm font-mono font-bold text-[#00F0FF] mt-0.5">Automático</div>
              </div>
            </div>
          </div>

          {/* Card 2: Calibración Croma Key en Tiempo Real */}
          <div className="rounded-2xl border border-[rgba(0,240,255,0.15)] bg-[#070F1E]/90 backdrop-blur-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CFF]/10 text-[#8B5CFF]">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Calibración de Croma Key &amp; Filtros</h3>
                <p className="text-xs text-[#94A3B8]">Ajuste fino de tolerancia para eliminar pantalla verde o magenta en GPU</p>
              </div>
            </div>

            {/* Selector de Modo */}
            <div className="mb-5">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-2">
                Fondo Croma a Suprimir
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'auto', label: 'Auto (Muestreo)', color: 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF]' },
                  { id: 'green', label: 'Pantalla Verde', color: 'border-[#00FFA3] bg-[#00FFA3]/15 text-[#00FFA3]' },
                  { id: 'magenta', label: 'Pantalla Magenta', color: 'border-[#FF2A85] bg-[#FF2A85]/15 text-[#FF2A85]' },
                  { id: 'off', label: 'Sin Croma', color: 'border-slate-500 bg-slate-500/15 text-slate-300' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setChromaMode(item.id as typeof chromaMode)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      chromaMode === item.id
                        ? item.color + ' shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[#040812] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders de Calibración */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#040812]/60 rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#94A3B8] font-bold">Tolerancia (Similarity)</span>
                  <span className="font-mono font-bold text-[#00F0FF]">{similarity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={similarity}
                  onChange={(e) => setSimilarity(Number(e.target.value))}
                  className="w-full accent-[#00F0FF] cursor-pointer"
                />
              </div>

              <div className="bg-[#040812]/60 rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#94A3B8] font-bold">Suavizado (Smoothness)</span>
                  <span className="font-mono font-bold text-[#00FFA3]">{smoothness}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={smoothness}
                  onChange={(e) => setSmoothness(Number(e.target.value))}
                  className="w-full accent-[#00FFA3] cursor-pointer"
                />
              </div>

              <div className="bg-[#040812]/60 rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#94A3B8] font-bold flex items-center gap-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-[#FFE600]" />
                    Volumen de Alerta
                  </span>
                  <span className="font-mono font-bold text-[#FFE600]">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-[#FFE600] cursor-pointer"
                />
              </div>

              <div className="bg-[#040812]/60 rounded-xl p-3 border border-[rgba(255,255,255,0.06)]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#94A3B8] font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#FF2A85]" />
                    Duración en Pantalla
                  </span>
                  <span className="font-mono font-bold text-[#FF2A85]">{duration} s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-[#FF2A85] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Disparadores de Prueba Rápida (Presets) */}
          <div className="rounded-2xl border border-[rgba(0,240,255,0.15)] bg-[#070F1E]/90 backdrop-blur-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE600]/10 text-[#FFE600]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Disparadores de Prueba Rápida</h3>
                <p className="text-xs text-[#94A3B8]">Lanza alertas simuladas a OBS para comprobar sonido, video y croma</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <button
                onClick={() => triggerPreset('lion')}
                disabled={isSending}
                className="p-3 rounded-xl border border-[rgba(255,230,0,0.3)] bg-[#FFE600]/10 hover:bg-[#FFE600]/20 text-white flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span className="text-2xl">🦁</span>
                <span className="text-xs font-bold text-[#FFE600]">León Épico</span>
                <span className="text-[10px] text-[#94A3B8]">29,999 💎</span>
              </button>

              <button
                onClick={() => triggerPreset('bear')}
                disabled={isSending}
                className="p-3 rounded-xl border border-[rgba(255,42,133,0.3)] bg-[#FF2A85]/10 hover:bg-[#FF2A85]/20 text-white flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span className="text-2xl">🌹</span>
                <span className="text-xs font-bold text-[#FF2A85]">Oso con Rosa</span>
                <span className="text-[10px] text-[#94A3B8]">5,663 💎</span>
              </button>

              <button
                onClick={() => triggerPreset('supercar')}
                disabled={isSending}
                className="p-3 rounded-xl border border-[rgba(0,240,255,0.3)] bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-white flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span className="text-2xl">🏎️</span>
                <span className="text-xs font-bold text-[#00F0FF]">Supercar</span>
                <span className="text-[10px] text-[#94A3B8]">10,000 💎</span>
              </button>

              <button
                onClick={() => triggerPreset('zombie')}
                disabled={isSending}
                className="p-3 rounded-xl border border-[rgba(0,255,163,0.3)] bg-[#00FFA3]/10 hover:bg-[#00FFA3]/20 text-white flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span className="text-2xl">💀</span>
                <span className="text-xs font-bold text-[#00FFA3]">Zombie Burst</span>
                <span className="text-[10px] text-[#94A3B8]">1,500 💎</span>
              </button>
            </div>

            {/* Formulario Personalizado */}
            <div className="bg-[#040812]/80 border border-[rgba(0,240,255,0.15)] rounded-xl p-4">
              <div className="text-xs font-bold text-white mb-3 flex items-center justify-between">
                <span>Alerta Manual Personalizada</span>
                {sendSuccess && (
                  <span className="text-[#00FFA3] flex items-center gap-1 text-[11px] animate-pulse">
                    <Check className="h-3 w-3" /> ¡Enviada a OBS!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Usuario</label>
                  <input
                    type="text"
                    value={testUser}
                    onChange={(e) => setTestUser(e.target.value)}
                    className="w-full bg-[#070F1E] border border-[rgba(255,255,255,0.1)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Nombre de Regalo</label>
                  <input
                    type="text"
                    value={testGift}
                    onChange={(e) => setTestGift(e.target.value)}
                    className="w-full bg-[#070F1E] border border-[rgba(255,255,255,0.1)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00F0FF] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Diamantes (Monedas)</label>
                  <input
                    type="number"
                    value={testCoins}
                    onChange={(e) => setTestCoins(Number(e.target.value))}
                    className="w-full bg-[#070F1E] border border-[rgba(255,255,255,0.1)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00F0FF] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                  Plantilla de Mensaje <span className="text-[#00F0FF]">(soporta {'{user}'}, {'{gift}'}, {'{coins}'})</span>
                </label>
                <input
                  type="text"
                  value={testTemplate}
                  onChange={(e) => setTestTemplate(e.target.value)}
                  placeholder="¡{user} ha enviado {gift}!"
                  className="w-full bg-[#070F1E] border border-[rgba(255,255,255,0.1)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#00F0FF] outline-none"
                />
              </div>

              <button
                onClick={() => handleTriggerAlert()}
                disabled={isSending}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0077FF] font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSending ? 'Transmitiendo alerta...' : 'Disparar Alerta a OBS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa Interactiva en Vivo (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-[rgba(0,240,255,0.2)] bg-[#070F1E]/95 backdrop-blur-md p-5 flex flex-col h-full min-h-[560px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(0,240,255,0.1)]">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#00F0FF]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Simulador 9:16 en Vivo</span>
              </div>
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-[11px] font-bold hover:bg-[#00F0FF]/20 transition-all cursor-pointer"
                title="Recargar vista previa"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Recargar</span>
              </button>
            </div>

            {/* Marco de Simulación Vertical */}
            <div className="flex-1 relative rounded-xl border border-[rgba(0,240,255,0.25)] bg-[#040812] overflow-hidden flex items-center justify-center shadow-inner">
              {/* Patrón de cuadrícula / transparencia sutil */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #00F0FF 1px, transparent 1px)`,
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Iframe conectado al overlay real */}
              <iframe
                key={iframeKey}
                src={OVERLAY_URL}
                title="OBS Alert Overlay Preview"
                className="w-full h-full border-0 relative z-10"
                style={{ background: 'transparent' }}
              />

              {/* Guía de Enfoque */}
              <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-[#94A3B8] pointer-events-none">
                PREVIEW 60 FPS
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#94A3B8] text-center">
              💡 Haz clic en los botones de prueba de la izquierda para ver aparecer la alerta animada aquí mismo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};