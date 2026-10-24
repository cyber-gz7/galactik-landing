import React from 'react';
import type { GvgColumnSide } from '@/types/roblox.types';
import { GvgDropZone } from './GvgDropZone';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';
import { Plus, Skull, ShieldCheck } from 'lucide-react';

interface GvgColumnListProps {
  side: GvgColumnSide;
  onOpenGiftModal?: (slotId: string) => void;
  onOpenSoundModal?: (slotId: string) => void;
  onTestSlot?: (slotId: string) => void;
}

export const GvgColumnList: React.FC<GvgColumnListProps> = ({
  side,
  onOpenGiftModal,
  onOpenSoundModal,
  onTestSlot
}) => {
  const isLeft = side === 'LEFT';
  const rules = useRobloxGvgStore((s) => (isLeft ? s.config.left_rules : s.config.right_rules)) || [];
  const filterQuery = useRobloxGvgStore((s) => s.filterQuery);
  const filterType = useRobloxGvgStore((s) => s.filterType);
  const setConfig = useRobloxGvgStore((s) => s.setConfig);

  // Filtrado de reglas
  const filtered = rules.filter((r) => {
    const matchQuery = !filterQuery || `${r.gift_name} ${r.label}`.toLowerCase().includes(filterQuery.toLowerCase());
    const matchType = filterType === 'ALL' || r.action_type === filterType;
    return matchQuery && matchType;
  });

  const sideRules = filtered.filter((r) => !r.is_bottom);
  const bottomRules = filtered.filter((r) => Boolean(r.is_bottom));

  const handleAddRule = (isBottom: boolean) => {
    const id = `${isLeft ? 'L' : 'R'}_${Date.now()}`;
    const newRule = {
      id,
      gift_name: isLeft ? 'Rose' : 'GG',
      icon_file: isLeft ? 'rose-1-coins.webp' : 'gg-1-coins.webp',
      coins: 1,
      label: isBottom ? (isLeft ? '-1 WIN' : '+1 WIN') : (isLeft ? '-5 WIN' : '+5 WIN'),
      action_type: isBottom ? ('WIN' as const) : ('PTS' as const),
      value: isLeft ? -1 : 1,
      duration_seconds: 5,
      is_bottom: isBottom
    };

    const cfg = useRobloxGvgStore.getState().config;
    setConfig({
      ...cfg,
      [isLeft ? 'left_rules' : 'right_rules']: [...rules, newRule]
    });

    if (onOpenGiftModal) {
      onOpenGiftModal(id);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-xl">
      {/* Cabecera de la Columna */}
      <div className="flex items-center justify-between border-b border-[#24374B]/70 pb-3">
        <div className="flex items-center gap-2">
          {isLeft ? (
            <Skull className="h-5 w-5 text-[#FF2A85]" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-[#00D9FF]" />
          )}
          <span
            className={`font-black text-sm tracking-wide ${
              isLeft ? 'text-[#FF2A85]' : 'text-[#00D9FF]'
            }`}
          >
            {isLeft ? 'COLUMNA IZQUIERDA: VILLANOS' : 'COLUMNA DERECHA: HÉROES'}
          </span>
        </div>
        <span className="rounded-full bg-[#101D2E] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#9FB2C8]">
          {filtered.length} Acciones
        </span>
      </div>

      {/* Zonas de Regalos: Costado y Base */}
      <div className="flex flex-col gap-3">
        <GvgDropZone
          side={side}
          position="SIDE"
          title="📐 COLUMNA COSTADO (VERTICAL)"
          subtitle="⠿ Arrastra para reordenar o mover de costado"
          colorHex="#FFE600"
          slots={sideRules}
          onOpenGiftModal={onOpenGiftModal}
          onOpenSoundModal={onOpenSoundModal}
          onTestSlot={onTestSlot}
        />

        <GvgDropZone
          side={side}
          position="BOTTOM"
          title="⚓ BASE INFERIOR (HORIZONTAL)"
          subtitle="⠿ Arrastra para reordenar o mover a la base"
          colorHex="#38BDF8"
          slots={bottomRules}
          onOpenGiftModal={onOpenGiftModal}
          onOpenSoundModal={onOpenSoundModal}
          onTestSlot={onTestSlot}
        />
      </div>

      {/* Botón para añadir nueva acción */}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => handleAddRule(false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#24374B] bg-[#101D2E] py-2 text-xs font-bold text-white transition-all hover:border-[#00D9FF] hover:bg-[#00D9FF]/10"
        >
          <Plus className="h-4 w-4" />
          Añadir al Costado
        </button>
        <button
          type="button"
          onClick={() => handleAddRule(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#24374B] bg-[#101D2E] py-2 text-xs font-bold text-white transition-all hover:border-[#38BDF8] hover:bg-[#38BDF8]/10"
        >
          <Plus className="h-4 w-4" />
          Añadir a la Base
        </button>
      </div>
    </div>
  );
};
