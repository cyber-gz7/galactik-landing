import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Play,
  Square,
  Search,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { invokeTyped } from '@/api/tauri-bridge';

const BANNER_BG = '/assets/card-universal-bg.png';

interface MemeSound {
  id: string;
  name: string;
  filename: string;
  category: 'viral' | 'gaming' | 'reactions' | 'epic';
  durationTag: string;
  emoji: string;
}

const MEME_SOUNDS: MemeSound[] = [
  { id: 'the-boys', name: 'The Boys (Homelander)', filename: '1701805304266_the-boys.mp3', category: 'viral', durationTag: '12s', emoji: '🕶️' },
  { id: 'drip-goku', name: 'Drip Goku (Clash of Gods)', filename: '1702224976485_drip-goku-meme-song-original-dragon-ball-super-music-clash-of-gods.mp3', category: 'viral', durationTag: '5s', emoji: '🔥' },
  { id: 'prowler', name: 'Prowler Sound Effect', filename: '1701804736796_prowler-sound-effect.mp3', category: 'epic', durationTag: '4s', emoji: '🕷️' },
  { id: 'spiderman-2099', name: 'Spider-Man 2099 Theme', filename: '1789983882687_spiderman-2099-theme-sound-effect.mp3', category: 'epic', durationTag: '6s', emoji: '🚨' },
  { id: 'vine-boom', name: 'Vine Boom', filename: '1708877312612_vine-boom.mp3', category: 'reactions', durationTag: '2s', emoji: '💥' },
  { id: 'taco-bell', name: 'Taco Bell Bong', filename: '1708877384604_taco-bell-bong-sfx.mp3', category: 'reactions', durationTag: '2s', emoji: '🔔' },
  { id: 'chipi-chipi', name: 'Chipi Chipi Chapa Chapa', filename: '1708877415194_chipi-chipi-chapa-chapa.mp3', category: 'viral', durationTag: '8s', emoji: '🐱' },
  { id: 'gigachad', name: 'Gigachad Theme', filename: '1789983835573_gigachad-theme-music-sound-effect.mp3', category: 'viral', durationTag: '8s', emoji: '🗿' },
  { id: 'run', name: 'AWOLNATION - Run', filename: '1699559815847_run.mp3', category: 'viral', durationTag: '6s', emoji: '🏃' },
  { id: 'batman', name: 'Batman (Something in the Way)', filename: '1701803076040_batman.mp3', category: 'epic', durationTag: '5s', emoji: '🦇' },
  { id: 'epic-sax', name: 'Epic Sax Guy (15s)', filename: '1699892196736_epic-sax-15s.mp3', category: 'viral', durationTag: '15s', emoji: '🎷' },
  { id: 'wow-anime', name: 'Anime Wow', filename: '1699892960228_wow-anime.mp3', category: 'reactions', durationTag: '2s', emoji: '✨' },
  { id: 'roblox-oof', name: 'Roblox Oof Death', filename: '1708877497810_roblox-death-sound_1.mp3', category: 'gaming', durationTag: '1s', emoji: '💀' },
  { id: 'minecraft-zombie', name: 'Minecraft Zombie Groan', filename: '1699891800834_zombie-minecraft.mp3', category: 'gaming', durationTag: '2s', emoji: '🧟' },
  { id: 'minecraft-tnt', name: 'Minecraft TNT Fuse', filename: '1699518576778_tnt.mp3', category: 'gaming', durationTag: '3s', emoji: '🧨' },
  { id: 'gta-wasted', name: 'GTA V Wasted Sound', filename: '1715074355891_gta-v-death-sound-effect-102.mp3', category: 'gaming', durationTag: '4s', emoji: '⭐' },
  { id: 'gta-sa', name: 'GTA San Andreas Theme', filename: '1715074326895_gta-san-andreas-.mp3', category: 'gaming', durationTag: '10s', emoji: '🔫' },
  { id: 'emotional-damage', name: 'Emotional Damage!', filename: '1717178049420_emotional damage.mp3', category: 'reactions', durationTag: '3s', emoji: '💔' },
  { id: 'pedro-pedro', name: 'Pedro Pedro Pe (Racoon)', filename: '1715074454519_pedro-pedro-pe.mp3', category: 'viral', durationTag: '8s', emoji: '🦝' },
  { id: 'coffin-dance', name: 'Coffin Dance (Astronomica)', filename: '1712241505415_Coffin Dance Meme.mp3', category: 'viral', durationTag: '10s', emoji: '⚰️' },
  { id: 'clown-horn', name: 'Bocina de Payaso', filename: '1708877598165_clown-horn-sound-effect_1.mp3', category: 'reactions', durationTag: '2s', emoji: '🤡' },
  { id: 'wrong-buzzer', name: 'Wrong Buzzer (Error)', filename: '1708877687386_wrong-buzzer.mp3', category: 'reactions', durationTag: '2s', emoji: '❌' },
  { id: 'deja-vu', name: 'Deja Vu (Initial D Drift)', filename: '1702224870406_deja-vu.mp3', category: 'viral', durationTag: '7s', emoji: '🏎️' },
  { id: 'what-is-love', name: 'What is Love (Mike O\'Hearn)', filename: '1789983862528_what-is-love-mike-o-hearn-sound-effect.mp3', category: 'viral', durationTag: '8s', emoji: '💪' },
  { id: 'sad-violin', name: 'Sad Violin Solo', filename: '1789983864093_sad-violin-sound-effect.mp3', category: 'reactions', durationTag: '6s', emoji: '🎻' },
  { id: 'dorime', name: 'Dorime Ameno', filename: '1789988367379_dorime-sound-effect.mp3', category: 'epic', durationTag: '9s', emoji: '🙏' },
  { id: 'this-is-sparta', name: 'This Is Sparta!', filename: '1789988365343_this-is-sparta-sound-effect.mp3', category: 'epic', durationTag: '4s', emoji: '⚔️' },
  { id: 'mortal-kombat', name: 'Mortal Kombat - Round 1', filename: '1789988357412_mortal-kombat-round-one-sound effect.mp3', category: 'gaming', durationTag: '3s', emoji: '🐉' },
  { id: 'bombastic-side-eye', name: 'Bombastic Side Eye', filename: '1789997700993_bombastic-side-eye-sound-effect.mp3', category: 'reactions', durationTag: '3s', emoji: '👀' },
  { id: 'wiwiwi-cat', name: 'Wiwiwi Gato Llorando', filename: '1789983879125_wiwiwi-cat-meme-sound-effect.mp3', category: 'reactions', durationTag: '5s', emoji: '😿' },
  { id: 'illuminati', name: 'Illuminati X-Files Theme', filename: '1717177596767_Illuminati sound effect.mp3', category: 'epic', durationTag: '6s', emoji: '👁️' },
  { id: 'shrek-swamp', name: 'What are you doing in my swamp', filename: '1717177828167_WHAT ARE YOU DOING IN MY SWAMP.mp3', category: 'reactions', durationTag: '4s', emoji: '🧅' }
];

export const SoundsMemesWorkspace: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [volume, setVolume] = useState(85);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [obsTriggeredId, setObsTriggeredId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlaySound = (sound: MemeSound) => {
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

    const soundUrl = `http://127.0.0.1:4000/s2e_media/audio/public/${sound.filename}`;
    const audio = new Audio(soundUrl);
    audio.volume = volume / 100;

    audio.onended = () => {
      setPlayingId(null);
    };

    audio.onerror = () => {
      console.warn('No se pudo reproducir el archivo:', sound.filename);
      setPlayingId(null);
    };

    audio.play().catch((err) => {
      console.warn('Error al reproducir audio:', err);
      setPlayingId(null);
    });

    audioRef.current = audio;
    setPlayingId(sound.id);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
  };

  const handleCopyUrl = async (sound: MemeSound) => {
    const url = `http://127.0.0.1:4000/s2e_media/audio/public/${sound.filename}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(sound.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSendToObs = async (sound: MemeSound) => {
    const soundUrl = `/s2e_media/audio/public/${sound.filename}`;
    try {
      await invokeTyped('emit_custom_alert', {
        alert_json: JSON.stringify({
          type: 'CUSTOM_ALERT',
          user: 'Meme_Soundboard',
          gift: sound.name,
          coins: 100,
          audioUrl: soundUrl,
          audioVolume: volume,
          duration: 6,
          skip_cooldown: true
        })
      });
      setObsTriggeredId(sound.id);
      setTimeout(() => setObsTriggeredId(null), 2000);
    } catch {
      // Fallback HTTP
      try {
        await fetch('http://127.0.0.1:4000/api/alerta/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CUSTOM_ALERT',
            user: 'Meme_Soundboard',
            gift: sound.name,
            coins: 100,
            audioUrl: soundUrl,
            audioVolume: volume,
            duration: 6,
            skip_cooldown: true
          })
        });
        setObsTriggeredId(sound.id);
        setTimeout(() => setObsTriggeredId(null), 2000);
      } catch (err) {
        console.error('Error al enviar sonido a OBS:', err);
      }
    }
  };

  const filteredSounds = MEME_SOUNDS.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* ================= HERO BANNER ÉPICO ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,240,255,0.25)] bg-[#040812] shadow-2xl min-h-[190px]">
        <img
          src={BANNER_BG}
          alt="Soundboard Banner"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none z-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-[#040812]/80 to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/10 px-3.5 py-1 text-xs font-bold text-[#00FFA3] mb-3">
              <Volume2 className="h-3.5 w-3.5" />
              <span>SOUNDBOARD INTERACTIVO &bull; BANCO LOCAL S2E</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
              Sonidos, Memes &amp;{' '}
              <span className="text-[#00FFA3] [text-shadow:0_0_25px_rgba(0,255,163,0.65)]">
                Efectos Virales
              </span>
            </h1>

            <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
              Dispara audios virales al instante en tu directo, asocia efectos a alertas de regalos o pruébalos con un solo clic con preescucha local y envío a OBS.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#070F1E]/90 border border-[rgba(0,240,255,0.2)] rounded-2xl p-4 backdrop-blur-md">
            <Volume2 className="h-5 w-5 text-[#00FFA3]" />
            <div className="flex flex-col gap-1 w-36">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#94A3B8]">Volumen</span>
                <span className="font-mono text-[#00FFA3]">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-[#00FFA3] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BARRA DE BÚSQUEDA Y FILTROS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#070F1E]/80 border border-[rgba(0,240,255,0.15)] rounded-2xl p-4">
        {/* Input de Búsqueda */}
        <div className="flex items-center gap-2.5 bg-[#040812] border border-[rgba(255,255,255,0.1)] rounded-xl px-3.5 py-2 w-full sm:w-80">
          <Search className="h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar sonido o meme..."
            className="bg-transparent text-xs text-white placeholder-[#94A3B8] outline-none flex-1"
          />
        </div>

        {/* Píldoras de Categoría */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'viral', label: '🔥 Virales TikTok' },
            { id: 'gaming', label: '🎮 Juegos (MC/Roblox)' },
            { id: 'reactions', label: '😂 Reacciones' },
            { id: 'epic', label: '⚡ Épicos & Tensión' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#00FFA3] to-[#00F0FF] text-black shadow-[0_0_12px_rgba(0,255,163,0.3)]'
                  : 'bg-[#040812] text-[#94A3B8] hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= GRID DE TARJETAS DE SONIDO ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSounds.map((sound) => {
          const isPlaying = playingId === sound.id;
          const isCopied = copiedId === sound.id;
          const isTriggered = obsTriggeredId === sound.id;

          return (
            <div
              key={sound.id}
              className={`rounded-2xl border p-4 transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                isPlaying
                  ? 'border-[#00FFA3] bg-[#070F1E] shadow-[0_0_20px_rgba(0,255,163,0.25)] ring-1 ring-[#00FFA3]'
                  : 'border-[rgba(0,240,255,0.12)] bg-[#070F1E]/80 hover:border-[rgba(0,240,255,0.3)] hover:bg-[#070F1E]'
              }`}
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{sound.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white leading-tight">
                      {sound.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
                      {sound.category} &bull; {sound.durationTag}
                    </span>
                  </div>
                </div>

                {/* Badge animado de reproducción */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-[#00FFA3] animate-[bounce_0.8s_infinite] h-4 rounded-full" />
                    <span className="w-1 bg-[#00FFA3] animate-[bounce_0.6s_infinite] h-2 rounded-full" />
                    <span className="w-1 bg-[#00FFA3] animate-[bounce_1.0s_infinite] h-3 rounded-full" />
                  </div>
                )}
              </div>

              {/* Botonera de Acciones */}
              <div className="flex items-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                {/* Botón Play / Stop Principal */}
                <button
                  onClick={() => handlePlaySound(sound)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#FF2A85] text-white shadow-[0_0_12px_rgba(255,42,133,0.4)]'
                      : 'bg-gradient-to-r from-[#00FFA3] to-[#00F0FF] text-black hover:brightness-110 active:scale-95'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="h-3.5 w-3.5 fill-current" />
                      <span>Detener</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Reproducir</span>
                    </>
                  )}
                </button>

                {/* Botón Disparar a OBS */}
                <button
                  onClick={() => handleSendToObs(sound)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isTriggered
                      ? 'border-[#00FFA3] bg-[#00FFA3]/20 text-[#00FFA3]'
                      : 'border-[rgba(0,240,255,0.2)] bg-[#040812] text-[#00F0FF] hover:bg-[#00F0FF]/15'
                  }`}
                  title="Disparar sonido en directo a OBS"
                >
                  {isTriggered ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </button>

                {/* Botón Copiar URL para Stream Deck */}
                <button
                  onClick={() => handleCopyUrl(sound)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isCopied
                      ? 'border-[#FFE600] bg-[#FFE600]/20 text-[#FFE600]'
                      : 'border-white/10 bg-[#040812] text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                  title="Copiar URL directa del MP3 para Stream Deck"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSounds.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#070F1E]/50 p-12 text-center text-[#94A3B8]">
          <p className="text-sm">No se encontraron sonidos con el término "{search}".</p>
        </div>
      )}
    </div>
  );
};