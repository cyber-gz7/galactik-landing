import React, { useState } from 'react';
import { GvgHeader } from './components/GvgHeader';
import { DuelLiveArena } from './components/DuelLiveArena';
import { GvgColumnList } from './components/GvgColumnList';
import { SoundSelectorModal } from './components/SoundSelectorModal';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';
import { useGiftCatalogStore } from '@/features/gift-catalog/stores/useGiftCatalogStore';
import { invokeTyped } from '@/api/tauri-bridge';
import type { MemeSound } from '@/data/memeSoundsCatalog';
import {
  Tv,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Zap
} from 'lucide-react';

const OBS_OVERLAY_URL = 'http://127.0.0.1:4000/duelo.html';

interface RobloxWorkspaceProps {
  onOpenGiftModal?: (slotId: string) => void;
  onOpenSoundModal?: (slotId: string) => void;
}

export const RobloxWorkspace: React.FC<RobloxWorkspaceProps> = ({
  onOpenGiftModal,
  onOpenSoundModal: externalOpenSoundModal
}) => {
  const updateSlot = useRobloxGvgStore((s) => s.updateSlot);
  const config = useRobloxGvgStore((s) => s.config);
  const openGiftSelectorModal = useGiftCatalogStore((s) => s.openGiftSelectorModal);

  // Estados de OBS y Vista Previa
  const [copied, setCopied] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  // Estado del Modal de Sonidos
  const [soundModalSlotId, setSoundModalSlotId] = useState<string | null>(null);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(OBS_OVERLAY_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso
    }
  };

  const handleOpenBrowser = () => {
    window.open(OBS_OVERLAY_URL, '_blank');
  };

  const handleReloadPreview = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenGiftModal = (slotId: string) => {
    if (onOpenGiftModal) {
      onOpenGiftModal(slotId);
      return;
    }

    openGiftSelectorModal(slotId, (gift) => {
      updateSlot(slotId, {
        gift_name: gift.name,
        coins: gift.coins,
        icon_file: gift.iconFile,
        tiktokGiftId: String(gift.numericId || gift.id)
      });
    });
  };

  const handleOpenSoundModal = (slotId: string) => {
    if (externalOpenSoundModal) {
      externalOpenSoundModal(slotId);
      return;
    }
    setSoundModalSlotId(slotId);
  };

  const handleSelectSound = (sound: MemeSound | null) => {
    if (!soundModalSlotId) return;

    if (sound) {
      updateSlot(soundModalSlotId, {
        sound_name: sound.name,
        sound_url: `http://127.0.0.1:4000/s2e_media/audio/public/${sound.filename}`
      });
    } else {
      updateSlot(soundModalSlotId, {
        sound_name: '',
        sound_url: ''
      });
    }
    setSoundModalSlotId(null);
  };

  const handleTestSlot = async (slotId: string) => {
    try {
      setTestFeedback(`Probando slot ${slotId}...`);
      await invokeTyped('send_gvg_control', {
        action_json: JSON.stringify({ action: 'test_slot', slot_id: slotId })
      });
      setTimeout(() => setTestFeedback(null), 1800);
    } catch (err) {
      console.warn('Error probando slot:', err);
      setTestFeedback(null);
    }
  };

  // Encontrar el slot actual para el modal de sonidos
  const allSlots = [...config.left_rules, ...config.right_rules];
  const activeSoundSlot = allSlots.find((s) => s.id === soundModalSlotId);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Cabecera, Botón Oficial 1:1 y Filtros */}
      <GvgHeader />

      {/* 2. Tarjeta Táctica de Integración OBS & Vista Previa en Vivo */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,240,255,0.25)] bg-[#070F1E]/95 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Tv className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-sm text-white tracking-wide">
                  OBS BROWSER SOURCE &bull; OVERLAY EN VIVO
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00FFA3]/15 text-[#00FFA3] border border-[#00FFA3]/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                  PUERTO 4000
                </span>
                {testFeedback && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 animate-pulse">
                    <Zap className="h-3 w-3" />
                    {testFeedback}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8]">
                Inserta esta URL transparente en OBS o visualiza el duelo en tiempo real
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0088FF] font-black text-xs uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? '¡URL Copiada!' : 'Copiar URL OBS'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenBrowser}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[rgba(0,240,255,0.3)] bg-[#0A1424] text-[#00F0FF] font-bold text-xs hover:bg-[#00F0FF]/10 active:scale-95 transition-all cursor-pointer"
              title="Abrir overlay en pantalla completa"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Abrir Navegador</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                showLivePreview
                  ? 'border-[#00FFA3] bg-[#00FFA3]/20 text-[#00FFA3] shadow-[0_0_15px_rgba(0,255,163,0.3)]'
                  : 'border-[#24374B] bg-[#101D2E] text-[#94A3B8] hover:border-[#00D9FF] hover:text-white'
              }`}
            >
              {showLivePreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showLivePreview ? 'Ocultar Preview' : 'Ver Overlay en Vivo'}</span>
            </button>
          </div>
        </div>

        {/* Input con URL exacta y botón de recarga rápida */}
        <div className="mt-3 flex items-center gap-2 bg-[#040812] border border-[rgba(0,240,255,0.15)] rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={OBS_OVERLAY_URL}
            className="flex-1 bg-transparent text-xs font-mono text-[#00F0FF] focus:outline-none select-all px-2"
          />
          <button
            type="button"
            onClick={handleReloadPreview}
            title="Recargar overlay en memoria"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#24374B] bg-[#0A1424] text-xs font-bold text-[#94A3B8] hover:text-white hover:border-[#00F0FF] transition-all cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Recargar</span>
          </button>
        </div>

        {/* Contenedor Desplegable de Vista Previa en Vivo 60 FPS */}
        {showLivePreview && (
          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-[#00F0FF]/30 bg-[#040812] p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] border-b border-[#24374B] pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00FFA3] animate-ping" />
                <span className="font-bold text-white">VISTA PREVIA EN VIVO &bull; 60 FPS</span>
              </div>
              <span>http://127.0.0.1:4000/duelo.html</span>
            </div>

            {/* Iframe con Fondo a Cuadros para Ver Transparencia */}
            <div
              className="relative w-full h-[380px] rounded-xl overflow-hidden border border-[#24374B]"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #090e18 25%, transparent 25%), linear-gradient(-45deg, #090e18 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #090e18 75%), linear-gradient(-45deg, transparent 75%, #090e18 75%)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
              }}
            >
              <iframe
                key={iframeKey}
                src={`${OBS_OVERLAY_URL}?preview=1&t=${iframeKey}`}
                title="Roblox Obby Duelo Live Preview"
                className="w-full h-full border-0 bg-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Marcador en Vivo del Duelo con Likes & Wins */}
      <DuelLiveArena />

      {/* 4. Columnas de Regalos con Drag & Drop Bidireccional */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GvgColumnList
          side="LEFT"
          onOpenGiftModal={handleOpenGiftModal}
          onOpenSoundModal={handleOpenSoundModal}
          onTestSlot={handleTestSlot}
        />

        <GvgColumnList
          side="RIGHT"
          onOpenGiftModal={handleOpenGiftModal}
          onOpenSoundModal={handleOpenSoundModal}
          onTestSlot={handleTestSlot}
        />
      </div>

      {/* 5. Modal Selector de Sonidos Virales */}
      <SoundSelectorModal
        isOpen={Boolean(soundModalSlotId)}
        onClose={() => setSoundModalSlotId(null)}
        onSelectSound={handleSelectSound}
        currentSoundName={activeSoundSlot?.sound_name}
        slotLabel={activeSoundSlot ? `${activeSoundSlot.gift_name} (${activeSoundSlot.label})` : undefined}
      />
    </div>
  );
};
