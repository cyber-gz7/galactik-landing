import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Search, X, Trash2, Music } from 'lucide-react';
import { MEME_SOUNDS_CATALOG, getMemeSoundUrl, type MemeSound } from '@/data/memeSoundsCatalog';

interface SoundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSound: (sound: MemeSound | null) => void;
  currentSoundName?: string;
  slotLabel?: string;
}

export const SoundSelectorModal: React.FC<SoundSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectSound,
  currentSoundName,
  slotLabel
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      setSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayPreview = (e: React.MouseEvent, sound: MemeSound) => {
    e.stopPropagation();

    if (playingId === sound.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(getMemeSoundUrl(sound.filename));
    audio.volume = 0.85;

    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);

    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(sound.id);
  };

  const filteredSounds = MEME_SOUNDS_CATALOG.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-[#00D9FF]/30 bg-[#070F1E] shadow-[0_0_50px_rgba(0,217,255,0.2)] overflow-hidden">
        {/* Cabecera Táctica */}
        <div className="flex items-center justify-between border-b border-[#24374B] bg-[#0A1424] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF]">
              <Music className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Asignar Sonido Viral
                {slotLabel && (
                  <span className="rounded-full bg-[#00D9FF]/15 px-2.5 py-0.5 text-xs text-[#00D9FF] font-mono">
                    {slotLabel}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Escucha previamente y selecciona el sonido que sonará en el overlay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentSoundName && (
              <button
                type="button"
                onClick={() => {
                  onSelectSound(null);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-[#FF4568]/40 bg-[#FF4568]/10 px-3 py-1.5 text-xs font-bold text-[#FF4568] hover:bg-[#FF4568]/20 transition-all cursor-pointer"
                title="Quitar sonido de esta acción"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Quitar Sonido
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#24374B] bg-[#101D2E] p-2 text-[#94A3B8] hover:text-white transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col gap-3 border-b border-[#24374B] bg-[#081220] p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar sonido viral, meme o reacción..."
              className="w-full rounded-xl border border-[#24374B] bg-[#050A12] py-2 pl-10 pr-4 text-xs text-white placeholder-[#64748B] focus:border-[#00D9FF] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'viral', label: '🔥 Virales' },
              { id: 'gaming', label: '🎮 Gaming' },
              { id: 'reactions', label: '✨ Reacciones' },
              { id: 'epic', label: '⚔️ Épicos' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border border-[#00D9FF] bg-[#00D9FF]/20 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                    : 'border border-[#24374B] bg-[#0A1424] text-[#94A3B8] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Sonidos */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[50vh]">
          {filteredSounds.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No se encontraron sonidos con ese criterio
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredSounds.map((sound) => {
                const isCurrent = currentSoundName === sound.name;
                const isPlaying = playingId === sound.id;

                return (
                  <div
                    key={sound.id}
                    onClick={() => {
                      onSelectSound(sound);
                      onClose();
                    }}
                    className={`group flex items-center justify-between rounded-xl border p-3 transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                        : 'border-[#24374B] bg-[#0A1424]/80 hover:border-[#00D9FF]/50 hover:bg-[#0D1C33]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-xl shrink-0 select-none">{sound.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-white truncate group-hover:text-[#00D9FF] transition-colors">
                          {sound.name}
                        </div>
                        <div className="font-mono text-[10px] text-[#64748B]">
                          {sound.durationTag} &bull; {sound.category.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handlePlayPreview(e, sound)}
                        title={isPlaying ? 'Detener preview' : 'Escuchar preview'}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                          isPlaying
                            ? 'border-[#00FFA3] bg-[#00FFA3]/20 text-[#00FFA3] animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.4)]'
                            : 'border-[#24374B] bg-[#101D2E] text-[#94A3B8] hover:border-[#00D9FF] hover:text-[#00D9FF]'
                        }`}
                      >
                        {isPlaying ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
                      </button>

                      <span className="rounded-md border border-[#24374B] bg-[#050A12] px-2 py-1 text-[10px] font-bold text-[#94A3B8] group-hover:border-[#00D9FF] group-hover:text-white">
                        {isCurrent ? 'Activo' : 'Elegir'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie Informativo */}
        <div className="flex items-center justify-between border-t border-[#24374B] bg-[#0A1424] px-6 py-3 text-[11px] text-[#64748B]">
          <span>{filteredSounds.length} sonidos disponibles en el banco multimedia</span>
          <span className="font-mono text-[#00D9FF]">GALACTK AUDIO ENGINE</span>
        </div>
      </div>
    </div>
  );
};
