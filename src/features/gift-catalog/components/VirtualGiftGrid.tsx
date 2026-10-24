import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { GiftCard } from './GiftCard';
import type { CatalogGift } from '../data/gifts-database';
import { PackageOpen } from 'lucide-react';

interface VirtualGiftGridProps {
  gifts: CatalogGift[];
  columns?: number;
  selectedGiftId?: string;
  onSelectGift?: (gift: CatalogGift) => void;
  onQuickAssign?: (gift: CatalogGift) => void;
  rowHeight?: number;
  compact?: boolean;
}

export const VirtualGiftGrid: React.FC<VirtualGiftGridProps> = ({
  gifts,
  columns = 5,
  selectedGiftId,
  onSelectGift,
  onQuickAssign,
  rowHeight = 220,
  compact = false
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const actualCols = Math.max(1, columns);
  const rowCount = Math.ceil(gifts.length / actualCols);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (compact ? 68 : rowHeight),
    overscan: 4
  });

  if (gifts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#24374B] p-8 text-center">
        <PackageOpen className="h-10 w-10 text-[#64748B]" />
        <h3 className="mt-3 font-bold text-sm text-white">No se encontraron regalos</h3>
        <p className="mt-1 text-xs text-[#9FB2C8]">
          Intenta con otro término de búsqueda (ej. &quot;Rosa&quot;, &quot;GG&quot;, &quot;Corazón&quot; o monedas).
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:#24374B_transparent]"
    >
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * actualCols;
          const rowItems = gifts.slice(startIndex, startIndex + actualCols);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <div
                className="grid gap-3 pb-3"
                style={{
                  gridTemplateColumns: `repeat(${actualCols}, minmax(0, 1fr))`
                }}
              >
                {rowItems.map((gift) => (
                  <GiftCard
                    key={`${gift.name}_${gift.coins}_${gift.id}`}
                    gift={gift}
                    compact={compact}
                    isSelected={selectedGiftId === gift.id || selectedGiftId === gift.name}
                    onSelect={onSelectGift}
                    onQuickAssign={onQuickAssign}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
