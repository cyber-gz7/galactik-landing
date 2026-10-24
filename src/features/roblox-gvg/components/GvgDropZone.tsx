import React, { useState } from 'react';
import type { GvgSlotRule, GvgColumnSide, GvgSlotPosition } from '@/types/roblox.types';
import { GvgSlotCard } from './GvgSlotCard';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';

interface GvgDropZoneProps {
  side: GvgColumnSide;
  position: GvgSlotPosition;
  title: string;
  subtitle: string;
  colorHex: string;
  slots: GvgSlotRule[];
  onOpenGiftModal?: (slotId: string) => void;
  onOpenSoundModal?: (slotId: string) => void;
  onTestSlot?: (slotId: string) => void;
}

export const GvgDropZone: React.FC<GvgDropZoneProps> = ({
  side,
  position,
  title,
  subtitle,
  colorHex,
  slots,
  onOpenGiftModal,
  onOpenSoundModal,
  onTestSlot
}) => {
  const moveSlot = useRobloxGvgStore((s) => s.moveSlot);
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('.roblox-slot-row')) {
      setIsOver(false);
      return;
    }
    e.preventDefault();
    setIsOver(false);

    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId) return;

    moveSlot({
      sourceId,
      targetSide: side,
      targetPos: position,
      appendToCategory: true
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border p-3 transition-all ${
        isOver
          ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_24px_rgba(0,217,255,0.25)]'
          : 'border-[#24374B]/70 bg-[#050A12]/40'
      }`}
    >
      {/* Cabecera de la sección */}
      <div className="mb-2.5 flex items-center justify-between">
        <span style={{ color: colorHex }} className="font-extrabold text-xs tracking-wider">
          {title} &bull; {slots.length} REGALOS
        </span>
        <span className="text-[10px] text-[#9FB2C8] opacity-75">{subtitle}</span>
      </div>

      {/* Lista de tarjetas o Placeholder vacío */}
      <div className="flex flex-col gap-2 min-h-[44px]">
        {slots.length > 0 ? (
          slots.map((slot) => (
            <GvgSlotCard
              key={slot.id}
              slot={slot}
              side={side}
              onOpenGiftModal={onOpenGiftModal}
              onOpenSoundModal={onOpenSoundModal}
              onTestSlot={onTestSlot}
            />
          ))
        ) : (
          <div
            className={`flex h-16 items-center justify-center rounded-xl border border-dashed text-xs transition-colors ${
              isOver ? 'border-[#00D9FF] text-[#00D9FF] bg-[#00D9FF]/10' : 'border-[#24374B] text-[#64748B]'
            }`}
          >
            Arrastra un regalo aquí para colocarlo en esta sección
          </div>
        )}
      </div>
    </div>
  );
};
