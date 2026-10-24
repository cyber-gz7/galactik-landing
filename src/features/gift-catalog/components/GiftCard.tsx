import React from 'react';
import type { CatalogGift } from '../data/gifts-database';
import { Sparkles, Coins } from 'lucide-react';

interface GiftCardProps {
  gift: CatalogGift;
  isSelected?: boolean;
  onSelect?: (gift: CatalogGift) => void;
  onQuickAssign?: (gift: CatalogGift) => void;
  compact?: boolean;
}

export const GiftCard: React.FC<GiftCardProps> = ({
  gift,
  isSelected = false,
  onSelect,
  onQuickAssign,
  compact = false
}) => {
  const iconSrc = `/gifts/${gift.iconFile}`;

  const categoryBadgeColor = {
    popular: 'border-[#23E6A8]/40 bg-[#23E6A8]/10 text-[#23E6A8]',
    classic: 'border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF]',
    exclusive: 'border-[#8B5CFF]/40 bg-[#8B5CFF]/10 text-[#8B5CFF]',
    legendary: 'border-[#FFE600]/40 bg-[#FFE600]/10 text-[#FFE600]',
    mythic: 'border-[#FF328B]/40 bg-[#FF328B]/10 text-[#FF328B]'
  }[gift.category];

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(gift)}
        className={`group flex items-center gap-3 rounded-xl border p-2 text-left transition-all ${
          isSelected
            ? 'border-[#00D9FF] bg-[#00D9FF]/15 shadow-[0_0_12px_rgba(0,217,255,0.25)]'
            : 'border-[#24374B] bg-[#0A1422]/90 hover:border-[#00D9FF]/50 hover:bg-[#101D2E]'
        }`}
      >
        <img
          src={iconSrc}
          alt={gift.name}
          loading="lazy"
          className="h-10 w-10 shrink-0 object-contain drop-shadow"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold text-xs text-white group-hover:text-[#00D9FF]">
            {gift.name}
          </div>
          {gift.nameEs && (
            <div className="truncate text-[10px] text-[#9FB2C8]">{gift.nameEs}</div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1 font-mono text-xs font-bold text-[#FFE600]">
          <Coins className="h-3 w-3" />
          <span>{gift.coins}</span>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={() => onSelect?.(gift)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer ${
        isSelected
          ? 'border-[#00D9FF] bg-gradient-to-b from-[#00D9FF]/15 to-[#0A1422] shadow-[0_0_16px_rgba(0,217,255,0.2)]'
          : 'border-[#24374B] bg-[#0A1422]/95 hover:border-[#00D9FF]/50 hover:bg-[#0D1B2D] hover:shadow-lg'
      }`}
    >
      {/* Cabecera con Categoría y Monedas */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider ${categoryBadgeColor}`}
        >
          {gift.category}
        </span>
        <div className="flex items-center gap-1 rounded-lg bg-[#050A12] px-2 py-0.5 font-mono text-xs font-black text-[#FFE600] border border-[#24374B]">
          <Coins className="h-3 w-3" />
          <span>{gift.coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Imagen Central con Efecto Neón Suave */}
      <div className="my-3 flex items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.02] p-1.5 transition-transform group-hover:scale-110">
          <img
            src={iconSrc}
            alt={gift.name}
            loading="lazy"
            className="h-full w-full object-contain drop-shadow"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
            }}
          />
        </div>
      </div>

      {/* Título en Inglés y Español */}
      <div className="mt-1">
        <h4 className="truncate font-extrabold text-xs text-white group-hover:text-[#00D9FF] transition-colors">
          {gift.name}
        </h4>
        <p className="truncate text-[11px] text-[#9FB2C8]">
          {gift.nameEs || 'Oficial TikTok'}
        </p>
      </div>

      {/* Pie con Acciones */}
      <div className="mt-3 flex items-center justify-between border-t border-[#24374B]/60 pt-2 text-[10px] text-[#64748B]">
        <span className="font-mono">ID: {gift.numericId || gift.id}</span>
        {onQuickAssign && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAssign(gift);
            }}
            className="flex items-center gap-1 rounded-md bg-[#00D9FF]/10 px-2 py-0.5 font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20"
          >
            <Sparkles className="h-2.5 w-2.5" />
            Elegir
          </button>
        )}
      </div>
    </div>
  );
};
