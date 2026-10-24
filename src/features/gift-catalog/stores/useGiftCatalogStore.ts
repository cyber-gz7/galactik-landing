import { create } from 'zustand';
import { CATALOG_GIFTS, type CatalogGift } from '../data/gifts-database';

export type CoinFilterKey = 'all' | '1-10' | '11-99' | '100-499' | '500-999' | '1000+';
export type SortOption = 'coins_asc' | 'coins_desc' | 'name_asc' | 'popular';

interface IndexedGift extends CatalogGift {
  _searchIndex: string;
}

// Pre-indexar tokens de búsqueda en memoria una sola vez
const INDEXED_GIFTS: IndexedGift[] = CATALOG_GIFTS.map((g) => ({
  ...g,
  _searchIndex: `${g.name} ${g.nameEs} ${g.coins} ${g.id || ''} ${g.category}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}));

const COIN_RANGES: Record<CoinFilterKey, { min: number; max: number }> = {
  all: { min: 0, max: 999999 },
  '1-10': { min: 1, max: 10 },
  '11-99': { min: 11, max: 99 },
  '100-499': { min: 100, max: 499 },
  '500-999': { min: 500, max: 999 },
  '1000+': { min: 1000, max: 999999 }
};

interface GiftCatalogState {
  searchQuery: string;
  coinFilter: CoinFilterKey;
  sortBy: SortOption;
  selectedGift: CatalogGift | null;

  // Modal de Selección de Regalo
  isModalOpen: boolean;
  modalTargetSlotId: string | null;
  onGiftSelectedCallback: ((gift: CatalogGift) => void) | null;

  setSearchQuery: (query: string) => void;
  setCoinFilter: (coinFilter: CoinFilterKey) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSelectedGift: (gift: CatalogGift | null) => void;

  openGiftSelectorModal: (slotId: string, onSelect: (gift: CatalogGift) => void) => void;
  closeGiftSelectorModal: () => void;

  // Selector computado de regalos filtrados
  getFilteredGifts: () => CatalogGift[];
}

export const useGiftCatalogStore = create<GiftCatalogState>((set, get) => ({
  searchQuery: '',
  coinFilter: 'all',
  sortBy: 'popular',
  selectedGift: CATALOG_GIFTS[0] || null,

  isModalOpen: false,
  modalTargetSlotId: null,
  onGiftSelectedCallback: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCoinFilter: (coinFilter) => set({ coinFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSelectedGift: (selectedGift) => set({ selectedGift }),

  openGiftSelectorModal: (slotId, onSelect) =>
    set({
      isModalOpen: true,
      modalTargetSlotId: slotId,
      onGiftSelectedCallback: onSelect,
      searchQuery: ''
    }),

  closeGiftSelectorModal: () =>
    set({
      isModalOpen: false,
      modalTargetSlotId: null,
      onGiftSelectedCallback: null
    }),

  getFilteredGifts: () => {
    const { searchQuery, coinFilter, sortBy } = get();
    const cleanQuery = searchQuery
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    const range = COIN_RANGES[coinFilter] || COIN_RANGES.all;

    let result = INDEXED_GIFTS.filter((g) => {
      if (g.coins < range.min || g.coins > range.max) return false;
      if (!cleanQuery) return true;
      return g._searchIndex.includes(cleanQuery);
    });

    if (sortBy === 'coins_asc') {
      result = [...result].sort((a, b) => a.coins - b.coins);
    } else if (sortBy === 'coins_desc') {
      result = [...result].sort((a, b) => b.coins - a.coins);
    } else if (sortBy === 'name_asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'popular') {
      // Priorizar regalos canónicos más frecuentes en streams
      result = [...result].sort((a, b) => {
        if (a.name === 'Rose' || a.name === 'GG') return -1;
        if (b.name === 'Rose' || b.name === 'GG') return 1;
        return a.coins - b.coins;
      });
    }

    return result;
  }
}));
