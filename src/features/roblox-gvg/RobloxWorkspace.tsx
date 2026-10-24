import React from 'react';
import { GvgHeader } from './components/GvgHeader';
import { DuelLiveArena } from './components/DuelLiveArena';
import { GvgColumnList } from './components/GvgColumnList';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';
import { useGiftCatalogStore } from '@/features/gift-catalog/stores/useGiftCatalogStore';
import { invokeTyped } from '@/api/tauri-bridge';

interface RobloxWorkspaceProps {
  onOpenGiftModal?: (slotId: string) => void;
  onOpenSoundModal?: (slotId: string) => void;
}

export const RobloxWorkspace: React.FC<RobloxWorkspaceProps> = ({
  onOpenGiftModal,
  onOpenSoundModal
}) => {
  const updateSlot = useRobloxGvgStore((s) => s.updateSlot);
  const openGiftSelectorModal = useGiftCatalogStore((s) => s.openGiftSelectorModal);

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

  const handleTestSlot = async (slotId: string) => {
    try {
      await invokeTyped('send_gvg_control', {
        action_json: JSON.stringify({ action: 'test_slot', slot_id: slotId })
      });
    } catch (err) {
      console.warn('Error probando slot:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Cabecera, Botón Oficial 1:1 y Filtros */}
      <GvgHeader />

      {/* 2. Marcador en Vivo del Duelo con Likes */}
      <DuelLiveArena />

      {/* 3. Columnas de Regalos con Drag & Drop Bidireccional */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GvgColumnList
          side="LEFT"
          onOpenGiftModal={handleOpenGiftModal}
          onOpenSoundModal={onOpenSoundModal}
          onTestSlot={handleTestSlot}
        />

        <GvgColumnList
          side="RIGHT"
          onOpenGiftModal={handleOpenGiftModal}
          onOpenSoundModal={onOpenSoundModal}
          onTestSlot={handleTestSlot}
        />
      </div>
    </div>
  );
};
