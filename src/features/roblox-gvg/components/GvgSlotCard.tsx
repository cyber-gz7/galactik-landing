import React, { useState } from 'react';
import type { GvgSlotRule, GvgColumnSide } from '@/types/roblox.types';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';
import { Play, Copy, Trash2, Volume2, RefreshCw, GripVertical } from 'lucide-react';

interface GvgSlotCardProps {
  slot: GvgSlotRule;
  side: GvgColumnSide;
  onOpenGiftModal?: (slotId: string) => void;
  onOpenSoundModal?: (slotId: string) => void;
  onTestSlot?: (slotId: string) => void;
}

export const GvgSlotCard: React.FC<GvgSlotCardProps> = ({
  slot,
  side,
  onOpenGiftModal,
  onOpenSoundModal,
  onTestSlot
}) => {
  const updateSlot = useRobloxGvgStore((s) => s.updateSlot);
  const moveSlot = useRobloxGvgStore((s) => s.moveSlot);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverPos, setDragOverPos] = useState<'before' | 'after' | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', slot.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverPos(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDragOverPos(e.clientY < midY ? 'before' : 'after');
  };

  const handleDragLeave = () => {
    setDragOverPos(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === slot.id) {
      setDragOverPos(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const insertBefore = e.clientY < rect.top + rect.height / 2;

    moveSlot({
      sourceId,
      targetId: slot.id,
      targetSide: side,
      targetPos: slot.is_bottom ? 'BOTTOM' : 'SIDE',
      insertBefore
    });

    setDragOverPos(null);
  };

  // Helper para resolver ruta de icono
  const rawFile = slot.icon_file ? slot.icon_file.replace(/^(ui\/|\/)?gifts\//, '') : 'rose-1-coins.webp';
  const iconSrc = slot.icon_file?.startsWith('http')
    ? slot.icon_file
    : `/gifts/${rawFile}`;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#24374B] bg-[#0A1422]/90 p-3 shadow-md transition-all ${
        isDragging ? 'opacity-30 border-dashed border-[#00D9FF] scale-[0.98]' : 'hover:border-[#00D9FF]/40'
      } ${
        dragOverPos === 'before' ? 'border-t-2 border-t-[#00D9FF] shadow-[0_-4px_12px_rgba(0,217,255,0.4)]' : ''
      } ${
        dragOverPos === 'after' ? 'border-b-2 border-b-[#00D9FF] shadow-[0_4px_12px_rgba(0,217,255,0.4)]' : ''
      }`}
    >
      {/* Handle de arrastre y bloque del regalo */}
      <div className="flex items-center gap-2.5 min-w-[150px]">
        <div
          title="Arrastra para reordenar o mover entre columnas"
          className="flex cursor-grab items-center justify-center text-[#64748B] transition-colors group-hover:text-[#00D9FF] active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <img
          src={iconSrc}
          alt={slot.gift_name}
          className="h-10 w-10 object-contain drop-shadow"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
          }}
        />

        <div>
          <div className="font-extrabold text-xs text-white leading-tight">{slot.gift_name}</div>
          <div className="font-mono text-[11px] font-bold text-[#FFE600]">{slot.coins} 💎</div>
        </div>
      </div>

      {/* Selectores de Configuración: Etiqueta, Tipo, Posición y Valor */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={slot.label}
          onChange={(e) => updateSlot(slot.id, { label: e.target.value })}
          title="Etiqueta visible en el overlay"
          className="w-20 rounded-lg border border-[#24374B] bg-[#050A12] px-2 py-1 text-center font-extrabold text-xs text-white focus:border-[#00D9FF] focus:outline-none"
        />

        <select
          value={slot.action_type}
          onChange={(e) => updateSlot(slot.id, { action_type: e.target.value as 'PTS' | 'WIN' })}
          className="rounded-lg border border-[#24374B] bg-[#050A12] px-2 py-1 text-xs font-bold text-white focus:border-[#00D9FF] focus:outline-none"
        >
          <option value="PTS">⚡ Puntos</option>
          <option value="WIN">🏆 Wins</option>
        </select>

        <select
          value={slot.is_bottom ? 'BOTTOM' : 'SIDE'}
          onChange={(e) => updateSlot(slot.id, { is_bottom: e.target.value === 'BOTTOM' })}
          className="rounded-lg border border-[#24374B] bg-[#050A12] px-2 py-1 text-xs font-bold text-white focus:border-[#00D9FF] focus:outline-none"
        >
          <option value="SIDE">📐 Costado</option>
          <option value="BOTTOM">⚓ Base</option>
        </select>

        <input
          type="number"
          value={slot.value}
          onChange={(e) => updateSlot(slot.id, { value: Number(e.target.value) || 0 })}
          title="Valor numérico (+ o -)"
          className="w-16 rounded-lg border border-[#24374B] bg-[#050A12] px-2 py-1 text-center text-xs font-bold text-white focus:border-[#00D9FF] focus:outline-none"
        />

        <div className="flex items-center gap-1 text-[11px] text-[#9FB2C8]">
          <span>s</span>
          <input
            type="number"
            min={0}
            value={slot.duration_seconds ?? 5}
            onChange={(e) => updateSlot(slot.id, { duration_seconds: Math.max(0, Number(e.target.value) || 0) })}
            className="w-12 rounded-lg border border-[#24374B] bg-[#050A12] px-1.5 py-1 text-center text-xs text-white focus:border-[#00D9FF] focus:outline-none"
          />
        </div>
      </div>

      {/* Botones de acción táctica */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onOpenGiftModal?.(slot.id)}
          title="Cambiar regalo"
          className="flex items-center gap-1 rounded-lg border border-[#24374B] bg-[#101D2E] px-2 py-1 text-xs font-bold text-[#9FB2C8] hover:border-[#00D9FF] hover:text-white"
        >
          <RefreshCw className="h-3 w-3" />
          Regalo
        </button>

        <button
          type="button"
          onClick={() => onOpenSoundModal?.(slot.id)}
          title="Asignar sonido"
          className="flex max-w-[110px] items-center gap-1 truncate rounded-lg border border-[#00D9FF]/30 bg-[#101D2E] px-2 py-1 text-xs font-bold text-[#00D9FF] hover:border-[#00D9FF]"
        >
          <Volume2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{slot.sound_name || 'Sonido'}</span>
        </button>

        <button
          type="button"
          onClick={() => onTestSlot?.(slot.id)}
          title="Probar en vivo"
          className="rounded-lg border border-[#24374B] bg-[#101D2E] p-1.5 text-[#23E6A8] hover:border-[#23E6A8] hover:bg-[#23E6A8]/10"
        >
          <Play className="h-3 w-3 fill-current" />
        </button>

        <button
          type="button"
          onClick={() => {
            const copy = { ...slot, id: `${side === 'LEFT' ? 'L' : 'R'}_${Date.now()}` };
            const cfg = useRobloxGvgStore.getState().config;
            const dest = side === 'LEFT' ? [...cfg.left_rules, copy] : [...cfg.right_rules, copy];
            useRobloxGvgStore.getState().setConfig({
              ...cfg,
              [side === 'LEFT' ? 'left_rules' : 'right_rules']: dest
            });
          }}
          title="Duplicar acción"
          className="rounded-lg border border-[#24374B] bg-[#101D2E] p-1.5 text-[#9FB2C8] hover:text-white"
        >
          <Copy className="h-3 w-3" />
        </button>

        <button
          type="button"
          onClick={() => {
            const cfg = useRobloxGvgStore.getState().config;
            useRobloxGvgStore.getState().setConfig({
              ...cfg,
              left_rules: cfg.left_rules.filter((s) => s.id !== slot.id),
              right_rules: cfg.right_rules.filter((s) => s.id !== slot.id)
            });
          }}
          title="Eliminar acción"
          className="rounded-lg border border-[#24374B] bg-[#101D2E] p-1.5 text-[#FF4568] hover:border-[#FF4568] hover:bg-[#FF4568]/10"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
