import React, { useState, useMemo } from 'react';
import { useGiftCatalogStore, type CoinFilterKey } from '../stores/useGiftCatalogStore';
import { VirtualGiftGrid } from './VirtualGiftGrid';
import type { CatalogGift } from '../data/gifts-database';
import { Search, X, Sparkles, Coins, Filter } from 'lucide-react';

export const GiftSelectorModal: React.FC = () => {
  const isModalOpen = useGiftCatalogStore((s) => s.isModalOpen);
  const closeGiftSelectorModal = useGiftCatalogStore((s) => s.closeGiftSelectorModal);
  const onGiftSelectedCallback = useGiftCatalogStore((s) => s.onGiftSelectedCallback);
  const modalTargetSlotId = useGiftCatalogStore((s) => s.modalTargetSlotId);

  const [modalSearch, setModalSearch] = useState('');
  const [modalCoinFilter, setModalCoinFilter] = useState<CoinFilterKey>('all');
  const [selectedGift, setSelectedGift] = useState<CatalogGift | null>(null);

  const getFilteredGifts = useGiftCatalogStore((s) => s.getFilteredGifts);

  // Filtro específico para el modal
  const filteredGifts = useMemo(() => {
    // Si no hay búsqueda local ni filtro local, usar el getter global
    const all = getFilteredGifts();
    const clean = modalSearch.toLowerCase().trim();

    return all.filter((g) => {
      if (modalCoinFilter === '1-10' && (g.coins < 1 || g.coins > 10)) return false;
      if (modalCoinFilter === '11-99' && (g.coins < 11 || g.coins > 99)) return false;
      if (modalCoinFilter === '100-499' && (g.coins < 100 || g.coins > 499)) return false;
      if (modalCoinFilter === '500-999' && (g.coins < 500 || g.coins > 999)) return false;
      if (modalCoinFilter === '1000+' && g.coins < 1000) return false;

      if (!clean) return true;
      const haystack = `${g.name} ${g.nameEs} ${g.coins} ${g.id}`.toLowerCase();
      return haystack.includes(clean);
    });
  }, [getFilteredGifts, modalSearch, modalCoinFilter]);

  if (!isModalOpen) return null;

  const handleConfirmSelection = (gift: CatalogGift) => {
    if (onGiftSelectedCallback) {
      onGiftSelectedCallback(gift);
    }
    closeGiftSelectorModal();
  };

  const coinFilters: { id: CoinFilterKey; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: '1-10', label: '1–10 🪙' },
    { id: '11-99', label: '11–99 🪙' },
    { id: '100-499', label: '100–499 🪙' },
    { id: '500-999', label: '500–999 🪙' },
    { id: '1000+', label: '1000+ 🪙' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-3xl border border-[#24374B] bg-[#0A1422] shadow-2xl overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-[#24374B] px-6 py-4 bg-[#050A12]/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE600] to-[#FF328B] p-0.5 shadow-lg shadow-[#FFE600]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#050A12]">
                <Sparkles className="h-5 w-5 text-[#FFE600]" />
              </div>
            </div>
            <div>
              <h2 className="font-black text-base tracking-wide text-white">
                Catálogo Oficial &bull; 1,770 Regalos
              </h2>
              <p className="text-xs text-[#9FB2C8]">
                {modalTargetSlotId
                  ? `Asignando al slot: ${modalTargetSlotId}`
                  : 'Selecciona un regalo para tu configuración'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGiftSelectorModal}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#24374B] bg-[#101D2E] text-[#9FB2C8] hover:border-white hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Barra de Filtros y Buscador */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#24374B]/70 bg-[#0A1422] px-6 py-3">
          {/* Buscador Rápido */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              autoFocus
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              placeholder="Buscar por nombre en inglés, español o monedas (ej. Rosa, GG, León)..."
              className="w-full rounded-xl border border-[#24374B] bg-[#050A12] py-2 pl-9 pr-8 text-xs font-medium text-white placeholder-[#64748B] focus:border-[#00D9FF] focus:outline-none"
            />
            {modalSearch && (
              <button
                type="button"
                onClick={() => setModalSearch('')}
                className="absolute right-2.5 top-2.5 text-[#64748B] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Chips de Filtro por Monedas */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-[#64748B]" />
            {coinFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setModalCoinFilter(f.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  modalCoinFilter === f.id
                    ? 'border border-[#00D9FF]/60 bg-[#00D9FF]/20 text-[#00D9FF]'
                    : 'border border-[#24374B] bg-[#050A12] text-[#9FB2C8] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo: Grilla Virtualizada de Alto Rendimiento */}
        <div className="flex-1 overflow-hidden p-6">
          <VirtualGiftGrid
            gifts={filteredGifts}
            columns={4}
            selectedGiftId={selectedGift?.id}
            onSelectGift={(gift) => setSelectedGift(gift)}
            onQuickAssign={handleConfirmSelection}
          />
        </div>

        {/* Footer con Resumen del Regalo Seleccionado */}
        <div className="flex items-center justify-between border-t border-[#24374B] bg-[#050A12] px-6 py-3.5">
          {selectedGift ? (
            <div className="flex items-center gap-3">
              <img
                src={`/gifts/${selectedGift.iconFile}`}
                alt={selectedGift.name}
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
                }}
              />
              <div>
                <div className="font-extrabold text-xs text-white">
                  {selectedGift.name} {selectedGift.nameEs ? `(${selectedGift.nameEs})` : ''}
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#FFE600]">
                  <Coins className="h-3 w-3" />
                  <span>{selectedGift.coins.toLocaleString()} Monedas</span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs text-[#64748B]">
              Mostrando <strong>{filteredGifts.length}</strong> de 1,770 regalos disponibles
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeGiftSelectorModal}
              className="rounded-xl border border-[#24374B] bg-[#101D2E] px-4 py-2 text-xs font-bold text-[#9FB2C8] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selectedGift}
              onClick={() => selectedGift && handleConfirmSelection(selectedGift)}
              className="flex items-center gap-1.5 rounded-xl border border-[#00D9FF] bg-gradient-to-r from-[#00D9FF] to-[#168BFF] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#00D9FF]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Asignar Regalo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
