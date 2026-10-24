import React, { useState } from 'react';
import { useGiftCatalogStore, type CoinFilterKey, type SortOption } from './stores/useGiftCatalogStore';
import { VirtualGiftGrid } from './components/VirtualGiftGrid';
import {
  Sparkles,
  Search,
  Coins,
  Filter,
  Copy,
  Check,
  Globe2,
  TrendingUp,
  Layers,
  Crown
} from 'lucide-react';

export const GiftCatalogWorkspace: React.FC = () => {
  const searchQuery = useGiftCatalogStore((s) => s.searchQuery);
  const setSearchQuery = useGiftCatalogStore((s) => s.setSearchQuery);
  const coinFilter = useGiftCatalogStore((s) => s.coinFilter);
  const setCoinFilter = useGiftCatalogStore((s) => s.setCoinFilter);
  const sortBy = useGiftCatalogStore((s) => s.sortBy);
  const setSortBy = useGiftCatalogStore((s) => s.setSortBy);

  const selectedGift = useGiftCatalogStore((s) => s.selectedGift);
  const setSelectedGift = useGiftCatalogStore((s) => s.setSelectedGift);
  const getFilteredGifts = useGiftCatalogStore((s) => s.getFilteredGifts);

  const [copiedId, setCopiedId] = useState(false);
  const [columns, setColumns] = useState<number>(5);

  const filteredGifts = getFilteredGifts();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const coinFilters: { id: CoinFilterKey; label: string }[] = [
    { id: 'all', label: 'Todos (1,770)' },
    { id: '1-10', label: '1–10 🪙' },
    { id: '11-99', label: '11–99 🪙' },
    { id: '100-499', label: '100–499 🪙' },
    { id: '500-999', label: '500–999 🪙' },
    { id: '1000+', label: '1000+ 🪙' }
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      {/* 1. Header con KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00D9FF]/10 text-[#00D9FF]">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9FB2C8] uppercase tracking-wider">
              Total Catálogo
            </div>
            <div className="font-black text-2xl text-white">1,770</div>
            <div className="text-[10px] text-[#23E6A8]">Oficiales TikTok Live</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFE600]/10 text-[#FFE600]">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9FB2C8] uppercase tracking-wider">
              Rango de Valor
            </div>
            <div className="font-black text-2xl text-white">1 &ndash; 44,999</div>
            <div className="text-[10px] text-[#FFE600]">Monedas / Diamantes</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#23E6A8]/10 text-[#23E6A8]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9FB2C8] uppercase tracking-wider">
              Populares Stream
            </div>
            <div className="font-black text-2xl text-white">Rosa, GG &amp; Donut</div>
            <div className="text-[10px] text-[#23E6A8]">Top Frecuencia Live</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF328B]/10 text-[#FF328B]">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#9FB2C8] uppercase tracking-wider">
              Regalos Míticos
            </div>
            <div className="font-black text-2xl text-white">Universo &amp; León</div>
            <div className="text-[10px] text-[#FF328B]">+29,999 Monedas</div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Herramientas: Buscador, Filtros y Orden */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-xl">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre (ej. Rosa, GG, León, Halcón, Capybara) o valor..."
            className="w-full rounded-xl border border-[#24374B] bg-[#050A12] py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-[#64748B] focus:border-[#00D9FF] focus:outline-none"
          />
        </div>

        {/* Chips de Filtros de Monedas */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-4 w-4 text-[#64748B]" />
          {coinFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCoinFilter(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                coinFilter === f.id
                  ? 'border border-[#00D9FF]/60 bg-[#00D9FF]/20 text-[#00D9FF] shadow-sm'
                  : 'border border-[#24374B] bg-[#050A12] text-[#9FB2C8] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Select de Orden */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-[#24374B] bg-[#050A12] px-3 py-2 text-xs font-bold text-white focus:border-[#00D9FF] focus:outline-none"
          >
            <option value="popular">🔥 Más Populares</option>
            <option value="coins_asc">🪙 Monedas (Menor a Mayor)</option>
            <option value="coins_desc">💎 Monedas (Mayor a Menor)</option>
            <option value="name_asc">🔤 Nombre (A &ndash; Z)</option>
          </select>

          {/* Toggle de Columnas */}
          <div className="flex items-center gap-1 rounded-xl border border-[#24374B] bg-[#050A12] p-1">
            {[4, 5, 6].map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => setColumns(cols)}
                className={`rounded-lg px-2 py-1 text-xs font-mono font-bold transition-all ${
                  columns === cols
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                {cols}C
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Área Principal: Grilla Virtualizada y Drawer Lateral */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4 overflow-hidden min-h-[500px]">
        {/* Grilla Principal (3 columnas en lg) */}
        <div className="lg:col-span-3 rounded-2xl border border-[#24374B] bg-[#0A1422] p-4 shadow-xl overflow-hidden h-[620px]">
          <div className="mb-3 flex items-center justify-between text-xs text-[#9FB2C8]">
            <span>
              Mostrando <strong className="text-white">{filteredGifts.length}</strong> de 1,770 regalos
            </span>
            <span className="font-mono text-[11px] text-[#00D9FF]">60 FPS Virtualized</span>
          </div>

          <div className="h-[560px] overflow-hidden">
            <VirtualGiftGrid
              gifts={filteredGifts}
              columns={columns}
              selectedGiftId={selectedGift?.id}
              onSelectGift={(gift) => setSelectedGift(gift)}
            />
          </div>
        </div>

        {/* Drawer Lateral de Detalle del Regalo (1 columna en lg) */}
        <div className="rounded-2xl border border-[#24374B] bg-[#0A1422] p-5 shadow-xl flex flex-col justify-between">
          {selectedGift ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#00D9FF] uppercase tracking-wider">
                  {selectedGift.category}
                </span>
                <div className="flex items-center gap-1 font-mono text-sm font-black text-[#FFE600]">
                  <Coins className="h-4 w-4" />
                  <span>{selectedGift.coins.toLocaleString()}</span>
                </div>
              </div>

              {/* Imagen Grande con Neón */}
              <div className="my-6 flex items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-[#24374B] bg-[#050A12] p-4 shadow-[0_0_30px_rgba(0,217,255,0.15)]">
                  <img
                    src={`/gifts/${selectedGift.iconFile}`}
                    alt={selectedGift.name}
                    className="h-full w-full object-contain drop-shadow-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
                    }}
                  />
                </div>
              </div>

              {/* Títulos y Metadatos */}
              <div className="text-center">
                <h3 className="font-black text-lg text-white">{selectedGift.name}</h3>
                <p className="text-xs text-[#9FB2C8]">
                  {selectedGift.nameEs || 'Regalo Oficial de TikTok Live'}
                </p>
              </div>

              {/* Ficha Técnica */}
              <div className="mt-6 flex flex-col gap-2.5 rounded-xl border border-[#24374B] bg-[#050A12] p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#9FB2C8]">TikTok ID:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                    <span>{selectedGift.numericId || selectedGift.id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(String(selectedGift.numericId || selectedGift.id))}
                      className="text-[#00D9FF] hover:text-white"
                      title="Copiar ID"
                    >
                      {copiedId ? <Check className="h-3 w-3 text-[#23E6A8]" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#24374B]/50 pt-2">
                  <span className="text-[#9FB2C8]">Archivo Ícono:</span>
                  <span className="truncate max-w-[140px] font-mono text-[10px] text-white" title={selectedGift.iconFile}>
                    {selectedGift.iconFile}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#24374B]/50 pt-2">
                  <span className="text-[#9FB2C8]">Regiones:</span>
                  <div className="flex items-center gap-1 text-[11px] text-white">
                    <Globe2 className="h-3 w-3 text-[#00D9FF]" />
                    <span>
                      {selectedGift.regions.length > 0
                        ? `${selectedGift.regions.length} Países`
                        : 'Global 🌍'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-[#64748B]">
              <Sparkles className="h-10 w-10 text-[#24374B]" />
              <p className="mt-3 text-xs font-semibold">
                Selecciona un regalo para ver sus detalles técnicos y metadatos
              </p>
            </div>
          )}

          {/* Tips de Uso Streamer */}
          <div className="mt-4 rounded-xl border border-[#00D9FF]/20 bg-[#00D9FF]/5 p-3 text-[11px] text-[#9FB2C8]">
            <strong className="text-white">Tip de Transmisión:</strong> Puedes asignar cualquiera de estos 1,770 regalos directamente en tus duelos de Roblox o eventos de Minecraft desde el botón &quot;Regalo&quot;.
          </div>
        </div>
      </div>
    </div>
  );
};
