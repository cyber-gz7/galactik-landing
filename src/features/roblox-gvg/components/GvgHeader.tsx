import React from 'react';
import { useRobloxGvgStore } from '@/stores/useRobloxGvgStore';
import { Sparkles, Save, Star, Search } from 'lucide-react';
import type { GvgThemeStyle } from '@/types/roblox.types';

export const GvgHeader: React.FC = () => {
  const isSyncing = useRobloxGvgStore((s) => s.isSyncing);
  const themeStyle = useRobloxGvgStore((s) => s.config.theme_style || 'TRANSPARENT');
  const filterQuery = useRobloxGvgStore((s) => s.filterQuery);
  const filterType = useRobloxGvgStore((s) => s.filterType);

  const setFilterQuery = useRobloxGvgStore((s) => s.setFilterQuery);
  const setFilterType = useRobloxGvgStore((s) => s.setFilterType);
  const updateSetting = useRobloxGvgStore((s) => s.updateSetting);
  const loadOfficialPreset = useRobloxGvgStore((s) => s.loadOfficialPreset);
  const syncToBackend = useRobloxGvgStore((s) => s.syncToBackend);

  const themes: { id: GvgThemeStyle; label: string }[] = [
    { id: 'TRANSPARENT', label: '100% Transparente' },
    { id: 'GALACTIC', label: 'Galáctico Neón' },
    { id: 'CYBERPUNK', label: 'Cyberpunk 2077' },
    { id: 'MINIMAL', label: 'Minimalista' }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Fila Principal de Título y Botones de Acción (3 Layers: Fondo real + Vignette + UI) */}
      <div className="relative overflow-hidden rounded-2xl border border-[#24374B] bg-[#040812] p-4 shadow-lg min-h-[90px]">
        {/* Capa 0: Fondo Real con Avatares Roblox en Duelo */}
        <img
          src="/assets/banner-roblox-duel-pro.png"
          alt="Roblox Duelo Art"
          className="absolute inset-0 h-full w-full object-cover object-center z-0 opacity-45 pointer-events-none"
        />

        {/* Capa 1: Vignette / Filtro de legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-[#040812]/85 to-transparent z-10 pointer-events-none" />

        {/* Capa 2: UI Interactiva */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white">Roblox Obby &bull; Editor Gift vs Gift</h1>
              <span className="rounded-full border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#00D9FF]">
                1:1 OVERLAY REPLICA
              </span>
            </div>
            <p className="text-xs text-[#9FB2C8]">
              Configura y arrastra las acciones entre columnas para reordenar en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadOfficialPreset}
              className="flex items-center gap-2 rounded-xl border border-[#FFE600]/40 bg-[#FFE600]/10 px-3.5 py-2 font-bold text-xs text-[#FFE600] shadow-[0_0_12px_rgba(255,230,0,0.15)] transition-all hover:bg-[#FFE600]/20 cursor-pointer"
            >
              <Star className="h-4 w-4 fill-current" />
              ⭐ Configuración Oficial (Imagen Duelo)
            </button>

            <button
              type="button"
              onClick={() => syncToBackend(true)}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-xl border border-[#00D9FF]/50 bg-gradient-to-r from-[#00D9FF] to-[#168BFF] px-4 py-2 font-bold text-xs text-[#050A12] shadow-lg shadow-[#00D9FF]/20 transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSyncing ? 'Guardando en OBS...' : 'Guardar Todo en Vivo'}
            </button>
          </div>
        </div>
      </div>

      {/* Fila Secundaria: Filtro y Selector de Tema Visual */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#24374B]/70 bg-[#0A1422]/70 p-3">
        {/* Buscador de acciones */}
        <div className="flex flex-1 items-center gap-2 min-w-[260px] rounded-lg border border-[#24374B] bg-[#050A12] px-3 py-1.5">
          <Search className="h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Buscar por regalo o etiqueta (ej. Rosa, -20 WIN, GG)..."
            className="w-full bg-transparent text-xs text-white placeholder-[#64748B] focus:outline-none"
          />
        </div>

        {/* Filtro por tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-[#24374B] bg-[#050A12] px-3 py-1.5 text-xs font-bold text-white focus:border-[#00D9FF] focus:outline-none"
        >
          <option value="ALL">Todas las acciones</option>
          <option value="PTS">⚡ Solo Puntos</option>
          <option value="WIN">🏆 Solo WINS</option>
        </select>

        {/* Selector de Tema */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#24374B] bg-[#050A12] p-1">
          <Sparkles className="ml-1 h-3.5 w-3.5 text-[#00D9FF]" />
          <span className="text-[10px] font-bold text-[#9FB2C8] mr-1">TEMA:</span>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => updateSetting('theme_style', t.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                themeStyle === t.id
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                  : 'text-[#64748B] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
