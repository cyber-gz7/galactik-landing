import React, { useState } from 'react';
import { useMinecraftStudioStore } from './stores/useMinecraftStudioStore';
import { MinecraftRuleRow } from './components/MinecraftRuleRow';
import { MinecraftRconConsole } from './components/MinecraftRconConsole';
import type { MinecraftEventType } from './types';
import {
  Copy,
  Eye,
  Plus,
  Save,
  Check,
  Terminal,
  Sparkles
} from 'lucide-react';

const MINECRAFT_BANNER_STEVE_PATH = '/assets/minecraft-banner-steve.png';
const STYLE_CARRUSEL_PATH = '/assets/mc-style-carrusel.png';
const STYLE_CUADRICULA_PATH = '/assets/mc-style-cuadricula.png';
const STYLE_PLANO_PATH = '/assets/mc-style-plano.png';

export const MinecraftWorkspace: React.FC = () => {
  const rules = useMinecraftStudioStore((s) => s.rules);
  const overlaySettings = useMinecraftStudioStore((s) => s.overlaySettings);
  const isSaving = useMinecraftStudioStore((s) => s.isSaving);

  const setOverlaySettings = useMinecraftStudioStore((s) => s.setOverlaySettings);
  const toggleNightVision = useMinecraftStudioStore((s) => s.toggleNightVision);
  const addRule = useMinecraftStudioStore((s) => s.addRule);
  const syncToBackend = useMinecraftStudioStore((s) => s.syncToBackend);

  const selectedStyle = overlaySettings.style;
  const nightVision = overlaySettings.nightVision;

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRconOpen, setIsRconOpen] = useState(false);
  const [newEventType, setNewEventType] = useState<MinecraftEventType>('gift');

  const handleCopyOverlayUrl = async () => {
    const url = 'http://127.0.0.1:17173/mc_overlay.html';
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleStyleChange = (style: 'carousel' | 'static' | 'flat') => {
    setOverlaySettings({ style });
  };

  const handleAddEvent = () => {
    const newRule = {
      id: `rule_${Date.now()}`,
      type: newEventType,
      name: newEventType === 'gift' ? 'Rose' : `Evento ${newEventType}`,
      icon_file: 'rose-1-coins.webp',
      action_label: 'Nueva Acción',
      command: 'say ¡Gracias {donador}! {jugador}',
      coins: 1,
      enabled: true
    };
    addRule(newRule);
  };

  const handleSaveAll = async () => {
    await syncToBackend(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* ================= 1. BANNER SUPERIOR CON TEMÁTICA MINECRAFT (3 LAYERS) ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,255,163,0.3)] bg-[#040812] shadow-[0_0_30px_rgba(0,255,163,0.15)] min-h-[200px]">
        {/* Capa 0: Fondo Real con Steve en armadura de diamante y tótems */}
        <img
          src={MINECRAFT_BANNER_STEVE_PATH}
          alt="Steve Diamond Banner"
          className="absolute top-0 right-0 h-full w-auto max-w-[55%] object-cover object-right z-0 opacity-90 pointer-events-none"
        />

        {/* Capa 1: Vignette / Filtro de legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-[#040812]/85 to-transparent z-10 pointer-events-none" />

        {/* Capa 2: UI Interactiva */}
        <div className="relative z-20 p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] font-black tracking-widest text-[#00FFA3] uppercase">
              MINECRAFT &bull; CENTRO DE CONTROL
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white mt-1 [text-shadow:0_0_20px_rgba(0,255,163,0.4)]">
              OVERLAY Y EVENTOS
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-lg">
              Elige el estilo visual para OBS, configura disparadores y edita sus comandos RCON para PaperMC 1.20.1 en un solo lugar.
            </p>

            {/* Toggles y Botones Rápidos en el Banner */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2.5 rounded-xl border border-[rgba(0,255,163,0.3)] bg-[#091322]/90 px-3.5 py-2 text-xs font-bold text-white shadow-md cursor-pointer hover:border-[#00FFA3] transition-all">
                <Eye className="h-4 w-4 text-[#00FFA3]" />
                <span>Visión nocturna</span>
                <input
                  type="checkbox"
                  checked={nightVision}
                  onChange={(e) => toggleNightVision(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#162232] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#00FFA3]"></div>
              </label>

              <button
                type="button"
                onClick={handleCopyOverlayUrl}
                className="flex items-center gap-2 rounded-xl bg-[#00FFA3] px-4 py-2 text-xs font-black text-black shadow-[0_0_15px_rgba(0,255,163,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedUrl ? '¡URL Copiada!' : 'Copiar URL para OBS'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. CONFIGURACIÓN VISUAL DEL OVERLAY (ESTILOS REALES 3D) ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Selector de Estilos con Arte 3D Real (8 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[rgba(0,240,255,0.15)] bg-[#091322] p-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-black text-xs tracking-wider text-white uppercase">
                ESTILO DEL OVERLAY
              </h3>
              <span className="font-mono text-[11px] text-[#00FFA3] font-bold">OBS Live Browser</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Carrusel (3 Layers) */}
              <button
                type="button"
                onClick={() => handleStyleChange('carousel')}
                className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all min-h-[140px] flex flex-col justify-end cursor-pointer ${
                  selectedStyle === 'carousel'
                    ? 'border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)]'
                    : 'border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF]/50'
                }`}
              >
                {/* Capa 0: Fondo Real 3D */}
                <img
                  src={STYLE_CARRUSEL_PATH}
                  alt="Estilo Carrusel 3D"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 group-hover:opacity-90 transition-all pointer-events-none"
                />
                {/* Capa 1: Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/50 to-transparent z-10 pointer-events-none" />

                {/* Capa 2: UI */}
                <div className="relative z-20">
                  <div className="font-bold text-sm text-white">Carrusel</div>
                  <div className="text-[11px] text-[#94A3B8]">Regalos en movimiento</div>
                </div>
                {selectedStyle === 'carousel' && (
                  <div className="absolute top-3 right-3 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#00F0FF] text-[10px] font-black text-black shadow-[0_0_8px_#00F0FF]">
                    ✓
                  </div>
                )}
              </button>

              {/* Cuadrícula (3 Layers) */}
              <button
                type="button"
                onClick={() => handleStyleChange('static')}
                className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all min-h-[140px] flex flex-col justify-end cursor-pointer ${
                  selectedStyle === 'static'
                    ? 'border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)]'
                    : 'border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF]/50'
                }`}
              >
                {/* Capa 0: Fondo Real 3D */}
                <img
                  src={STYLE_CUADRICULA_PATH}
                  alt="Estilo Cuadrícula 3D"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 group-hover:opacity-90 transition-all pointer-events-none"
                />
                {/* Capa 1: Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/50 to-transparent z-10 pointer-events-none" />

                {/* Capa 2: UI */}
                <div className="relative z-20">
                  <div className="font-bold text-sm text-white">Cuadrícula</div>
                  <div className="text-[11px] text-[#94A3B8]">Todos a la vista</div>
                </div>
                {selectedStyle === 'static' && (
                  <div className="absolute top-3 right-3 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#00F0FF] text-[10px] font-black text-black shadow-[0_0_8px_#00F0FF]">
                    ✓
                  </div>
                )}
              </button>

              {/* Plano (3 Layers) */}
              <button
                type="button"
                onClick={() => handleStyleChange('flat')}
                className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all min-h-[140px] flex flex-col justify-end cursor-pointer ${
                  selectedStyle === 'flat'
                    ? 'border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)]'
                    : 'border border-[rgba(0,240,255,0.15)] hover:border-[#00F0FF]/50'
                }`}
              >
                {/* Capa 0: Fondo Real 3D */}
                <img
                  src={STYLE_PLANO_PATH}
                  alt="Estilo Plano 3D"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 group-hover:opacity-90 transition-all pointer-events-none"
                />
                {/* Capa 1: Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/50 to-transparent z-10 pointer-events-none" />

                {/* Capa 2: UI */}
                <div className="relative z-20">
                  <div className="font-bold text-sm text-white">Plano</div>
                  <div className="text-[11px] text-[#94A3B8]">Cinta compacta</div>
                </div>
                {selectedStyle === 'flat' && (
                  <div className="absolute top-3 right-3 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#00F0FF] text-[10px] font-black text-black shadow-[0_0_8px_#00F0FF]">
                    ✓
                  </div>
                )}
              </button>
            </div>

            {/* Tira de Elementos Reales del Carrusel */}
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
              {/* Rosa */}
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[rgba(0,240,255,0.2)] bg-[#040812] px-3 py-2 shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF2A85]/40 bg-[#FF2A85]/10 p-0.5">
                  <img src="/gifts/rose-1-coins.webp" alt="Rosa" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs text-white">
                    <span>⚡ Rayo Trueno</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#FFE600]">
                    <span>💎 1</span>
                  </div>
                </div>
                <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-[#00FFA3]">x1</span>
              </div>

              {/* TNT Box */}
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[rgba(0,240,255,0.2)] bg-[#040812] px-3 py-2 shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF3366]/40 bg-[#FF3366]/10 p-0.5">
                  <img src="/assets/icon-gift-tnt.png" alt="TNT" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs text-white">
                    <span>🧨 TNT 100%</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#FFE600]">
                    <span>💎 1</span>
                  </div>
                </div>
                <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-[#00FFA3]">x1</span>
              </div>

              {/* +5 Totems */}
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#00FFA3]/50 bg-[#040812] px-3 py-2 shadow-[0_0_12px_rgba(0,255,163,0.2)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00FFA3]/40 bg-[#00FFA3]/10 p-0.5">
                  <img src="/assets/icon-gift-totem.png" alt="Totem" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs text-[#00FFA3]">
                    <span>🛡️ +5 Tótems</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#FFE600]">
                    <span>💎 1</span>
                  </div>
                </div>
                <span className="rounded bg-[#00FFA3]/20 px-1.5 py-0.5 font-mono text-[10px] text-[#00FFA3] font-bold">+5</span>
              </div>

              {/* Creeper */}
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[rgba(0,240,255,0.2)] bg-[#040812] px-3 py-2 shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00FFA3]/40 bg-[#00FFA3]/10 p-0.5">
                  <img src="/assets/icon-gift-creeper.png" alt="Creeper" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs text-white">
                    <span>💥 Creeper</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#FFE600]">
                    <span>💎 50</span>
                  </div>
                </div>
                <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-[#00FFA3]">x50</span>
              </div>

              {/* Esqueleto */}
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[rgba(0,240,255,0.2)] bg-[#040812] px-3 py-2 shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00D9FF]/40 bg-[#00D9FF]/10 p-0.5">
                  <img src="/assets/icon-gift-esqueleto.png" alt="Esqueleto" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs text-white">
                    <span>🏹 Esqueleto</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#FFE600]">
                    <span>💎 1</span>
                  </div>
                </div>
                <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-[#00FFA3]">x1</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Sliders Compactos de Ajustes de Overlay (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-[rgba(0,240,255,0.15)] bg-[#091322] p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 font-display font-black text-xs tracking-wider text-white uppercase mb-4">
              <Sparkles className="h-4 w-4 text-[#00F0FF]" />
              <span>AJUSTES DEL OVERLAY</span>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Escala:</span>
                  <span className="font-mono text-[#00F0FF]">{overlaySettings.scale}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="160"
                  step="5"
                  value={overlaySettings.scale}
                  onChange={(e) => setOverlaySettings({ scale: Number(e.target.value) })}
                  className="w-full accent-[#00F0FF]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Velocidad del carrusel:</span>
                  <span className="font-mono text-[#00F0FF]">{overlaySettings.speed} s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="2"
                  value={overlaySettings.speed}
                  onChange={(e) => setOverlaySettings({ speed: Number(e.target.value) })}
                  className="w-full accent-[#00F0FF]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Tamaño del texto:</span>
                  <span className="font-mono text-[#00F0FF]">{overlaySettings.fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="18"
                  step="0.5"
                  value={overlaySettings.fontSize}
                  onChange={(e) => setOverlaySettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-[#00F0FF]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Fondo de las tarjetas:</span>
                  <span className="font-mono text-[#00F0FF]">{overlaySettings.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={overlaySettings.opacity}
                  onChange={(e) => setOverlaySettings({ opacity: Number(e.target.value) })}
                  className="w-full accent-[#00F0FF]"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-[#64748B]">
            Los ajustes aplican automáticamente a los 3 estilos sin reiniciar el browser source de OBS.
          </div>
        </div>
      </div>

      {/* ================= 3. TABLA DE EVENTOS Y DISPARADORES ================= */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[rgba(0,255,163,0.2)] bg-[#091322] p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(0,240,255,0.12)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#00FFA3]" />
              <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                EVENTOS CONFIGURADOS
              </h3>
              <span className="rounded-full border border-[#00FFA3]/40 bg-[#00FFA3]/15 px-2.5 py-0.5 font-mono text-[11px] font-black text-[#00FFA3]">
                {rules.length} Reglas
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#94A3B8]">
              Una fila por disparador. Ajusta regalo, acción visible, comando RCON y sonido.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value as MinecraftEventType)}
              className="rounded-xl border border-[rgba(0,240,255,0.25)] bg-[#040812] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00FFA3]"
            >
              <option value="gift">🎁 Regalo de TikTok</option>
              <option value="follow">➕ Nuevo Seguidor</option>
              <option value="likes_total">💗 Meta global de Likes</option>
              <option value="likes_user">❤️ Likes por persona</option>
              <option value="share">↗ Compartido</option>
              <option value="subscribe">⭐ Suscripción</option>
              <option value="comment">💬 Comentario con texto</option>
            </select>

            <button
              type="button"
              onClick={handleAddEvent}
              className="flex items-center gap-1.5 rounded-xl border border-[#00FFA3] bg-[#00FFA3]/20 px-4 py-2 text-xs font-bold text-[#00FFA3] hover:bg-[#00FFA3]/30 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Añadir evento</span>
            </button>
          </div>
        </div>

        {/* Encabezado Táctico de Columnas */}
        <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2 text-[10px] font-mono font-bold tracking-widest text-[#64748B] uppercase border-b border-white/5">
          <div className="col-span-3">DISPARADOR</div>
          <div className="col-span-5">ACCIÓN Y COMANDO RCON</div>
          <div className="col-span-2">SONIDO</div>
          <div className="col-span-2 text-right">PROBAR / EDITAR</div>
        </div>

        {/* Lista de Filas Tácticas de Eventos */}
        <div className="flex flex-col gap-2.5">
          {rules.map((rule) => (
            <MinecraftRuleRow key={rule.id} rule={rule} />
          ))}
        </div>

        {/* Footer con Botón Guardar Sincronizado */}
        <div className="flex items-center justify-between border-t border-[rgba(0,240,255,0.12)] pt-4 mt-2">
          <span className="text-xs text-[#94A3B8]">Configuración lista y sincronizada con el motor nativo</span>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="flex items-center gap-2 rounded-2xl border border-[#00FFA3] bg-gradient-to-r from-[#00FFA3] to-[#0077FF] px-7 py-3 font-black text-xs text-black shadow-[0_0_20px_rgba(0,255,163,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{savedSuccess ? '¡Guardado con Éxito!' : 'Guardar y actualizar overlay'}</span>
          </button>
        </div>
      </div>

      {/* ================= 4. CONSOLA RCON COLAPSABLE ================= */}
      <div className="rounded-3xl border border-[rgba(0,240,255,0.15)] bg-[#091322] overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setIsRconOpen(!isRconOpen)}
          className="w-full flex items-center justify-between p-4 px-6 text-left hover:bg-[#0D1B2A] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="h-4 w-4 text-[#00FFA3]" />
            <span className="font-display font-black text-xs tracking-wider text-white uppercase">
              TERMINAL &amp; COMANDOS RCON MANUALES (PAPERMC 1.20.1)
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-[#00F0FF]">
            {isRconOpen ? '▲ Ocultar Consola' : '▼ Expandir Consola'}
          </span>
        </button>

        {isRconOpen && (
          <div className="p-6 pt-2 border-t border-[rgba(0,240,255,0.1)]">
            <MinecraftRconConsole />
          </div>
        )}
      </div>
    </div>
  );
};
