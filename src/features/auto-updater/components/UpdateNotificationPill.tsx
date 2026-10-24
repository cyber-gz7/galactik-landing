import React from 'react';
import { useAutoUpdaterStore } from '../stores/useAutoUpdaterStore';
import { RefreshCw, Sparkles } from 'lucide-react';

export const UpdateNotificationPill: React.FC = () => {
  const currentVersion = useAutoUpdaterStore((s) => s.currentVersion);
  const updateInfo = useAutoUpdaterStore((s) => s.updateInfo);
  const isChecking = useAutoUpdaterStore((s) => s.isChecking);
  const checkForUpdates = useAutoUpdaterStore((s) => s.checkForUpdates);
  const openModal = useAutoUpdaterStore((s) => s.openModal);

  if (updateInfo?.available) {
    return (
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-1.5 rounded-full border border-[#00D9FF] bg-gradient-to-r from-[#00D9FF]/20 to-[#8B5CFF]/20 px-3 py-1 font-mono text-[11px] font-black text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.3)] animate-pulse hover:brightness-125 transition-all"
        title="Nueva actualización lista para instalar al instante"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#00D9FF]" />
        <span>v{updateInfo.version} Disponible</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => checkForUpdates(true)}
      className="flex items-center gap-1.5 rounded-xl border border-[#24374B] bg-[#050A12] px-2.5 py-1 font-mono text-[11px] font-bold text-[#9FB2C8] hover:border-[#00D9FF] hover:text-white transition-all"
      title={`Versión actual v${currentVersion} • Clic para buscar actualizaciones`}
    >
      <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin text-[#00D9FF]' : ''}`} />
      <span>v{currentVersion}</span>
    </button>
  );
};
