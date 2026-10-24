import React from 'react';
import type { MinecraftRule } from '../types';
import { useMinecraftStudioStore } from '../stores/useMinecraftStudioStore';
import { useGiftCatalogStore } from '@/features/gift-catalog/stores/useGiftCatalogStore';
import { Play, Trash2, RefreshCw, Volume2 } from 'lucide-react';

interface MinecraftRuleRowProps {
  rule: MinecraftRule;
}

export const MinecraftRuleRow: React.FC<MinecraftRuleRowProps> = ({ rule }) => {
  const updateRule = useMinecraftStudioStore((s) => s.updateRule);
  const deleteRule = useMinecraftStudioStore((s) => s.deleteRule);
  const sendRconCommand = useMinecraftStudioStore((s) => s.sendRconCommand);
  const openGiftSelectorModal = useGiftCatalogStore((s) => s.openGiftSelectorModal);

  const iconSrc = `/gifts/${rule.icon_file || 'rose-1-coins.webp'}`;

  const handleOpenGiftPicker = () => {
    openGiftSelectorModal(rule.id, (gift) => {
      updateRule(rule.id, {
        name: gift.name,
        coins: gift.coins,
        icon_file: gift.iconFile,
        tiktokGiftId: String(gift.numericId || gift.id)
      });
    });
  };

  const handleTest = () => {
    sendRconCommand(rule.command);
  };

  return (
    <div
      className={`group relative flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
        rule.enabled
          ? 'border-[#24374B] bg-[#0A1422]/90 hover:border-[#23E6A8]/40'
          : 'border-[#24374B]/40 bg-[#050A12]/60 opacity-60'
      }`}
    >
      {/* 1. Disparador: Contenedor Cuadrado Estilizado con Borde Brillante + Nombre + Monedas */}
      <div className="flex items-center gap-3 min-w-[190px]">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,240,255,0.3)] bg-[#040812] p-1 shadow-[0_0_12px_rgba(0,240,255,0.18)] group-hover:border-[#00F0FF] group-hover:shadow-[0_0_16px_rgba(0,240,255,0.4)] transition-all">
          <img
            src={iconSrc}
            alt={rule.name}
            className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/gifts/rose-1-coins.webp';
            }}
          />
        </div>
        <div>
          <div className="font-black text-xs text-white leading-tight">{rule.name}</div>
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#FFE600] mt-0.5">
            {rule.type === 'gift' ? (
              <span>{rule.coins ?? 1} 💎</span>
            ) : (
              <span className="text-[#00D9FF]">{rule.type.toUpperCase()}</span>
            )}
            {rule.totemDelta !== undefined && rule.totemDelta !== 0 && (
              <span className={`text-[10px] ${rule.totemDelta > 0 ? 'text-[#23E6A8]' : 'text-[#FF4568]'}`}>
                ({rule.totemDelta > 0 ? `+${rule.totemDelta}` : rule.totemDelta} Tótems)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Configuración: Etiqueta y Comando RCON */}
      <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
        <input
          type="text"
          value={rule.action_label}
          onChange={(e) => updateRule(rule.id, { action_label: e.target.value })}
          placeholder="Etiqueta en overlay..."
          title="Etiqueta visible en el overlay de Minecraft"
          className="w-40 rounded-xl border border-[#24374B] bg-[#050A12] px-2.5 py-1.5 font-bold text-xs text-white focus:border-[#23E6A8] focus:outline-none"
        />

        <input
          type="text"
          value={rule.command}
          onChange={(e) => updateRule(rule.id, { command: e.target.value })}
          placeholder="Comando RCON (usa {jugador})..."
          title="Comando RCON ejecutado en PaperMC"
          className="flex-1 min-w-[200px] rounded-xl border border-[#24374B] bg-[#050A12] px-2.5 py-1.5 font-mono text-xs text-[#23E6A8] focus:border-[#23E6A8] focus:outline-none"
        />
      </div>

      {/* 3. Acciones: Selector de Regalo, Probar, Sonido y Switch */}
      <div className="flex items-center gap-2">
        {rule.type === 'gift' && (
          <button
            type="button"
            onClick={handleOpenGiftPicker}
            className="flex items-center gap-1 rounded-lg border border-[#24374B] bg-[#101D2E] px-2.5 py-1.5 text-xs font-bold text-[#9FB2C8] hover:border-[#00D9FF] hover:text-white transition-all"
            title="Cambiar regalo asignado"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Regalo</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleTest}
          className="flex items-center gap-1 rounded-lg border border-[#23E6A8]/40 bg-[#23E6A8]/10 px-2.5 py-1.5 text-xs font-bold text-[#23E6A8] hover:bg-[#23E6A8]/20 transition-all"
          title="Probar comando RCON en vivo"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Probar</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1 rounded-lg border border-[#24374B] bg-[#101D2E] px-2 py-1.5 text-xs text-[#9FB2C8] hover:text-white"
          title={rule.soundName || 'Asignar sonido'}
        >
          <Volume2 className="h-3.5 w-3.5 text-[#00D9FF]" />
        </button>

        {/* Toggle Activo / Inactivo */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rule.enabled}
            onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-[#24374B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#23E6A8]"></div>
        </label>

        {/* Eliminar regla */}
        <button
          type="button"
          onClick={() => deleteRule(rule.id)}
          className="rounded-lg border border-[#24374B] bg-[#101D2E] p-1.5 text-[#FF4568] hover:border-[#FF4568] hover:bg-[#FF4568]/10 transition-all"
          title="Eliminar evento"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
