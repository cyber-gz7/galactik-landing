import React from 'react';
import { useAutoUpdaterStore } from '../stores/useAutoUpdaterStore';
import { Sparkles, Download, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const UpdateModal: React.FC = () => {
  const isModalOpen = useAutoUpdaterStore((s) => s.isModalOpen);
  const closeModal = useAutoUpdaterStore((s) => s.closeModal);
  const updateInfo = useAutoUpdaterStore((s) => s.updateInfo);
  const isDownloading = useAutoUpdaterStore((s) => s.isDownloading);
  const downloadProgress = useAutoUpdaterStore((s) => s.downloadProgress);
  const startUpdate = useAutoUpdaterStore((s) => s.startUpdate);
  const errorMessage = useAutoUpdaterStore((s) => s.errorMessage);

  if (!isModalOpen) return null;

  const pct = downloadProgress?.percentage ?? (isDownloading ? 45 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-lg flex-col rounded-3xl border border-[#00D9FF]/40 bg-[#0A1422] p-6 shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#24374B] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D9FF] to-[#8B5CFF] p-0.5 shadow-lg shadow-[#00D9FF]/25">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#050A12]">
                <Sparkles className="h-5 w-5 text-[#00D9FF]" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-base text-white">Actualización de Suite</h3>
              <p className="font-mono text-xs text-[#00D9FF]">
                Versión {updateInfo?.version || '2.1.6'} Disponible
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#24374B] bg-[#101D2E] text-[#9FB2C8] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido / Novedades */}
        <div className="my-5 flex flex-col gap-3">
          <div className="rounded-2xl border border-[#24374B] bg-[#050A12] p-4 text-xs text-[#9FB2C8] leading-relaxed">
            <h4 className="font-black text-white mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#23E6A8]" />
              Novedades de la versión:
            </h4>
            <p className="whitespace-pre-line">
              {updateInfo?.body ||
                '• Migración completa a React 19 + TypeScript Estricto\n• Editor Roblox GvG con Drag & Drop bidireccional\n• Catálogo virtualizado de 1,770 regalos a 60 FPS\n• Actualizaciones instantáneas en 2 segundos sin desinstalación'}
            </p>
          </div>

          {isDownloading && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#9FB2C8]">Descargando e instalando...</span>
                <span className="text-[#00D9FF] font-bold">{pct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#050A12] border border-[#24374B]">
                <div
                  className="h-full bg-gradient-to-r from-[#00D9FF] to-[#23E6A8] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-[#FF4568]/40 bg-[#FF4568]/10 p-3 text-xs text-[#FF4568]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer con Acciones */}
        <div className="flex items-center justify-end gap-2 border-t border-[#24374B] pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-xl border border-[#24374B] bg-[#101D2E] px-4 py-2 text-xs font-bold text-[#9FB2C8] hover:text-white"
          >
            Posponer
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={startUpdate}
            className="flex items-center gap-2 rounded-xl border border-[#00D9FF] bg-gradient-to-r from-[#00D9FF] to-[#168BFF] px-6 py-2 text-xs font-black text-black shadow-lg shadow-[#00D9FF]/20 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? 'Instalando...' : 'Actualizar al Instante (2s)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
