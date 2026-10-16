import { S2E_PUBLIC_AUDIOS } from './s2e-catalog.js';

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function renderWaveformSvg(peaksBase64 = '', seedName = 'sound', barCount = 38, height = 24) {
  const isPlaying = typeof seedName === 'boolean' ? seedName : false;
  const effectiveSeed = typeof seedName === 'string' && seedName ? seedName : (String(peaksBase64 || 'sound'));
  const values = [];
  if (typeof peaksBase64 === 'string' && peaksBase64.length >= 24 && /^[A-Za-z0-9+/=]+$/.test(peaksBase64)) {
    try {
      const raw = atob(peaksBase64);
      for (let i = 0; i < barCount; i++) {
        const idx = Math.floor((i / barCount) * raw.length);
        const code = raw.charCodeAt(idx) || 40;
        const norm = Math.max(0.12, Math.min(1, code / 255));
        values.push(norm);
      }
    } catch (e) {}
  }
  if (values.length === 0) {
    let h = 2166136261;
    for (let i = 0; i < effectiveSeed.length; i++) {
      h ^= effectiveSeed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    for (let i = 0; i < barCount; i++) {
      h ^= (i + 1) * 73;
      h = Math.imul(h, 16777619);
      const env = Math.sin((i / barCount) * Math.PI);
      const v = 0.14 + ((Math.abs(h) % 100) / 100) * 0.85 * (0.35 + 0.65 * env);
      values.push(Math.min(1, v));
    }
  }
  const barW = 2.2;
  const gap = 1.8;
  const totalW = barCount * (barW + gap);
  const midY = height / 2;
  const rects = values.map((v, i) => {
    const bh = Math.max(3, Math.round(v * (height - 2)));
    const y = (midY - bh / 2).toFixed(1);
    const x = (i * (barW + gap)).toFixed(1);
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="1" fill="currentColor" opacity="${(0.45 + v * 0.55).toFixed(2)}" />`;
  }).join('');
  const color = isPlaying ? '#00f0ff' : '#4f8ff7';
  return `<svg viewBox="0 0 ${totalW.toFixed(0)} ${height}" width="100%" height="${height}" style="display:block;color:${color};overflow:visible;">${rects}</svg>`;
}

export const DEFAULT_SOUND_LIBRARY = [
  {
    id: 'vine_boom',
    name: '💥 Vine Boom (Retumbe Meme)',
    category: 'memes',
    durationType: 'corto',
    duration: 0.8,
    durationFormatted: '00:00.800',
    durationLabel: '0.8s • Meme Sintetizado',
    tags: ['memes', 'synth', 'boom'],
    url: 'http://localhost:4000/s2e_media/audio/public/1708877462401_crack_the_whip.mp3',
    isSynth: true
  },
  {
    id: 'airhorn_mlg',
    name: '📢 Corneta MLG (Airhorn)',
    category: 'memes',
    durationType: 'corto',
    duration: 1.2,
    durationFormatted: '00:01.200',
    durationLabel: '1.2s • Meme Sintetizado',
    tags: ['memes', 'synth', 'airhorn'],
    url: '',
    isSynth: true
  },
  {
    id: 'metal_pipe',
    name: '🔧 Tubo Metálico (Metal Pipe)',
    category: 'memes',
    durationType: 'corto',
    duration: 1.4,
    durationFormatted: '00:01.400',
    durationLabel: '1.4s • Meme Sintetizado',
    tags: ['memes', 'synth', 'metal'],
    url: '',
    isSynth: true
  },
  {
    id: 'taco_bell',
    name: '🔔 Campana Taco Bell Bong',
    category: 'memes',
    durationType: 'corto',
    duration: 1.3,
    durationFormatted: '00:01.300',
    durationLabel: '1.3s • Meme Sintetizado',
    tags: ['memes', 'synth', 'bell'],
    url: '',
    isSynth: true
  },
  {
    id: 'phonk_drift',
    name: '🏎️ Phonk Drift Cowbell (Tendencia)',
    category: 'musica',
    durationType: 'largo',
    duration: 3.5,
    durationFormatted: '00:03.500',
    durationLabel: '3.5s • Música Sintetizada',
    tags: ['musica', 'synth', 'phonk'],
    url: '',
    isSynth: true
  },
  {
    id: 'victoria_epica',
    name: '🏆 Fanfarria Victoria Royale',
    category: 'musica',
    durationType: 'largo',
    duration: 3.2,
    durationFormatted: '00:03.200',
    durationLabel: '3.2s • Fanfarria Sintetizada',
    tags: ['musica', 'synth', 'victory'],
    url: '',
    isSynth: true
  },
  {
    id: 'sirena_nuclear',
    name: '🚨 Sirena Nuclear / Alerta Roja',
    category: 'alertas',
    durationType: 'largo',
    duration: 3.0,
    durationFormatted: '00:03.000',
    durationLabel: '3.0s • Alerta Sintetizada',
    tags: ['alertas', 'synth', 'siren'],
    url: 'http://localhost:4000/s2e_media/audio/public/1791367188643_police-siren-sound-effect.mp3',
    isSynth: true
  },
  {
    id: 'mario_coin',
    name: '🪙 Moneda Arcade 8-Bits',
    category: 'juegos',
    durationType: 'corto',
    duration: 0.5,
    durationFormatted: '00:00.500',
    durationLabel: '0.5s • Arcade Sintetizado',
    tags: ['juegos', 'synth', 'coin'],
    url: '',
    isSynth: true
  }
];

class SoundManager {
  constructor() {
    const s2eConverted = S2E_PUBLIC_AUDIOS.map(a => ({
      id: a.id,
      name: a.name,
      category: (a.tags || []).includes('music') ? 'musica' : ((a.tags || []).includes('alert') ? 'alertas' : 'memes'),
      durationType: (a.duration || 2) > 4 ? 'largo' : 'corto',
      durationLabel: `${a.durationFormatted || '00:02.000'} • Gratis S2E`,
      duration: a.duration || 2,
      durationFormatted: a.durationFormatted || '00:02.000',
      tags: a.tags || ['sound-effect'],
      peaks: a.peaks || '',
      path: a.path,
      url: a.url,
      isS2E: true
    }));
    this.sounds = [...DEFAULT_SOUND_LIBRARY, ...s2eConverted];
    this.customCloudSounds = [];
    this.activeAudios = new Set();
    this.activePlayingId = null;
    this.playbackListeners = new Set();
    this.synthStopTimer = null;
    this.currentPriority = 0;
    this.giftSoundMap = {
      'Rosa': 'mario_coin',
      'Rose': 'mario_coin',
      'GG': 'vine_boom',
      'Doughnut': 'taco_bell',
      'Game Controller': 'airhorn_mlg',
      'Lion': 'sirena_nuclear',
      'Falcon': 'victoria_epica',
      'Galaxy': 'phonk_drift'
    };
    this.masterVolume = 0.85;
    this.loadFromStorage();
  }

  onPlaybackChange(cb) {
    if (typeof cb === 'function') this.playbackListeners.add(cb);
    return () => this.playbackListeners.delete(cb);
  }

  notifyPlaybackChange() {
    this.playbackListeners.forEach(cb => {
      try { cb(this.activePlayingId); } catch (e) {}
    });
  }

  loadFromStorage() {
    try {
      const savedCustom = localStorage.getItem('galactic_custom_sounds');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(this.sounds.map(s => s.id));
          parsed.forEach(cs => {
            if (cs.isCustom) {
              this.customCloudSounds.push(cs);
            }
            if (!existingIds.has(cs.id)) {
              this.sounds.unshift(cs);
            }
          });
        }
      }
      const savedMap = localStorage.getItem('galactic_gift_sound_map');
      if (savedMap) {
        this.giftSoundMap = { ...this.giftSoundMap, ...JSON.parse(savedMap) };
      }
    } catch (err) {
      console.warn('Error cargando sonidos personalizados:', err);
    }
  }

  saveToStorage() {
    try {
      const customOnly = this.sounds.filter(s => s.isCustom);
      localStorage.setItem('galactic_custom_sounds', JSON.stringify(customOnly));
      localStorage.setItem('galactic_gift_sound_map', JSON.stringify(this.giftSoundMap));
    } catch (err) {}
  }

  getAllSounds() {
    return this.sounds;
  }

  getPublicCatalog() {
    return S2E_PUBLIC_AUDIOS;
  }

  getSynthSounds() {
    return this.sounds.filter(s => s.isSynth);
  }

  getCustomSounds() {
    return this.sounds.filter(s => s.isCustom);
  }

  getGiftSoundMap() {
    return { ...this.giftSoundMap };
  }

  setGiftSoundMap(mapObj) {
    if (!mapObj || typeof mapObj !== 'object') return;
    this.giftSoundMap = { ...this.giftSoundMap, ...mapObj };
    this.saveToStorage();
  }

  resolveSound(ref) {
    if (!ref) return null;
    const q = String(ref).trim();
    if (!q) return null;
    const lower = q.toLowerCase();
    return this.sounds.find(s => {
      if (s.id === q || s.name === q || s.url === q) return true;
      if (s.id.toLowerCase() === lower || (s.name && s.name.toLowerCase() === lower)) return true;
      if (s.path && (s.path === q || s.path.toLowerCase() === lower)) return true;
      if (s.url && s.url.toLowerCase().endsWith(lower)) return true;
      if (s.path && s.path.toLowerCase().endsWith(lower)) return true;
      return false;
    }) || null;
  }

  addOrUpdateSound({ id, name, category = 'memes', durationType = 'corto', url = '', duration = 2.5 }) {
    const cleanId = id || 'custom_' + Date.now();
    const durationLabel = durationType === 'largo' ? 'Largo • Mi Nube' : 'Corto • Mi Nube';
    const existingIdx = this.sounds.findIndex(s => s.id === cleanId);
    const entry = {
      id: cleanId,
      name: name || 'Sonido Personalizado',
      category,
      durationType,
      durationLabel,
      duration,
      durationFormatted: `00:0${Math.min(9, Math.round(duration))}.000`,
      tags: ['custom', category],
      peaks: '',
      url: url.trim(),
      isCustom: true
    };
    if (existingIdx >= 0) {
      this.sounds[existingIdx] = entry;
    } else {
      this.sounds.unshift(entry);
    }
    this.saveToStorage();
    return entry;
  }

  assignSoundToGift(giftName, soundId) {
    if (!giftName) return;
    if (!soundId) {
      delete this.giftSoundMap[giftName];
    } else {
      this.giftSoundMap[giftName] = soundId;
    }
    this.saveToStorage();
  }

  getSoundForGift(giftName) {
    return this.giftSoundMap[giftName] || null;
  }

  stopAll() {
    if (this.synthStopTimer) {
      clearTimeout(this.synthStopTimer);
      this.synthStopTimer = null;
    }
    this.activeAudios.forEach(a => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });
    this.activeAudios.clear();
    this.currentPriority = 0;
    if (this.activePlayingId !== null) {
      this.activePlayingId = null;
      this.notifyPlaybackChange();
    }
  }

  toggleSound(soundId, volumePct = 100) {
    const item = this.resolveSound(soundId);
    const targetKey = item ? item.id : soundId;
    if (this.activePlayingId && this.activePlayingId === targetKey) {
      this.stopAll();
      return false;
    }
    this.stopAll();
    this.playSound(soundId, volumePct);
    return true;
  }

  playUrl(url, optsOrVol = 100, trackIdArg = null) {
    if (!url) return null;
    const isObj = optsOrVol && typeof optsOrVol === 'object';
    const rawVol = isObj ? (optsOrVol.volume ?? 100) : Number(optsOrVol);
    const volume = rawVol <= 1 && rawVol > 0 ? rawVol * 100 : (rawVol || 100);
    const playerType = isObj ? (optsOrVol.playerType || 'priority') : 'priority';
    const priority = isObj ? (optsOrVol.priority ?? 5) : 5;
    const multiplier = isObj ? Boolean(optsOrVol.multiplier) : false;
    const repeatCount = isObj ? (optsOrVol.repeatCount ?? 1) : 1;
    const trackId = isObj ? (optsOrVol.trackId || trackIdArg) : trackIdArg;

    const pType = String(playerType || 'priority').toLowerCase();
    const prio = Number(priority) || 5;

    if (pType === 'once' && this.activeAudios.size > 0) {
      return null;
    }
    if (pType === 'priority' && this.activeAudios.size > 0) {
      if (prio >= this.currentPriority) {
        this.stopAll();
      }
    }

    const times = multiplier ? Math.min(5, Math.max(1, Number(repeatCount) || 1)) : 1;
    let firstAudio = null;
    const matchedItem = this.resolveSound(trackId || url);
    if (matchedItem) {
      this.activePlayingId = matchedItem.id;
      this.notifyPlaybackChange();
    }

    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        try {
          const audio = new Audio(url);
          const effVol = Math.max(0.02, Math.min(1, (Number(volume) / 100) * this.masterVolume));
          audio.volume = effVol;
          this.activeAudios.add(audio);
          this.currentPriority = Math.max(this.currentPriority, prio);
          audio.onended = () => {
            this.activeAudios.delete(audio);
            if (this.activeAudios.size === 0) {
              this.currentPriority = 0;
              this.activePlayingId = null;
              this.notifyPlaybackChange();
            }
          };
          audio.onerror = () => {
            this.activeAudios.delete(audio);
            if (this.activeAudios.size === 0) {
              this.activePlayingId = null;
              this.notifyPlaybackChange();
            }
          };
          audio.play().catch(() => {
            this.activeAudios.delete(audio);
            if (this.activeAudios.size === 0) {
              this.activePlayingId = null;
              this.notifyPlaybackChange();
            }
          });
          if (i === 0) firstAudio = audio;
        } catch (e) {}
      }, i * 350);
    }
    return firstAudio;
  }

  playForGift(giftName, coins = 1, faction = 'BUENOS') {
    const mappedId = this.giftSoundMap[giftName];
    if (mappedId) {
      this.playSound(mappedId);
      return;
    }
    const tier = getTierFromCoins(coins);
    playTierSound(tier, faction);
  }

  playSound(soundId, volumePct = 100) {
    if (!soundId) return null;
    const item = this.resolveSound(soundId);
    const resolvedId = item ? item.id : soundId;
    if (item && item.url) {
      try {
        const audio = new Audio(item.url);
        audio.volume = Math.max(0.05, Math.min(1, (volumePct / 100) * this.masterVolume));
        this.activeAudios.add(audio);
        this.activePlayingId = resolvedId;
        this.notifyPlaybackChange();
        audio.onended = () => {
          this.activeAudios.delete(audio);
          if (this.activeAudios.size === 0) {
            this.activePlayingId = null;
            this.notifyPlaybackChange();
          }
        };
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.activeAudios.delete(audio);
            this.playSynthesizedPreset(resolvedId);
          });
          return audio;
        }
      } catch (e) {
        this.playSynthesizedPreset(resolvedId);
        return null;
      }
    }
    if (typeof soundId === 'string' && (soundId.startsWith('http://') || soundId.startsWith('https://') || soundId.startsWith('data:'))) {
      return this.playUrl(soundId, { volume: volumePct });
    }
    this.activePlayingId = resolvedId;
    this.notifyPlaybackChange();
    const durMs = Math.round(((item && item.duration) || 1.2) * 1000);
    if (this.synthStopTimer) clearTimeout(this.synthStopTimer);
    this.synthStopTimer = setTimeout(() => {
      if (this.activePlayingId === resolvedId && this.activeAudios.size === 0) {
        this.activePlayingId = null;
        this.notifyPlaybackChange();
      }
    }, durMs);
    this.playSynthesizedPreset(resolvedId);
    return null;
  }

  playSynthesizedPreset(soundId) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = this.masterVolume;

    switch (soundId) {
      case 'vine_boom': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.65);
        gain.gain.setValueAtTime(0.65 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.78);
        break;
      }

      case 'airhorn_mlg': {
        [390, 466.16, 587.33].forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f * 0.92, now);
          osc.frequency.linearRampToValueAtTime(f, now + 0.08);
          gain.gain.setValueAtTime(0.22 * vol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.88);
        });
        break;
      }

      case 'metal_pipe': {
        [620, 1140, 1780, 2410, 3120].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'square' : 'triangle';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime((0.25 / (idx + 1)) * vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.15);
        });
        break;
      }

      case 'taco_bell': {
        [311.13, 622.25, 933.38, 1396.91].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime((0.3 / (idx + 1)) * vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.45);
        });
        break;
      }

      case 'phonk_drift': {
        // Phonk Cowbell 808 Melody (Largo)
        const notes = [587.33, 587.33, 698.46, 587.33, 523.25, 466.16, 587.33, 783.99];
        notes.forEach((f, idx) => {
          const start = now + idx * 0.22;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'square';
          osc2.type = 'sawtooth';
          osc1.frequency.setValueAtTime(f, start);
          osc2.frequency.setValueAtTime(f * 1.498, start);
          gain.gain.setValueAtTime(0.22 * vol, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(start);
          osc2.start(start);
          osc1.stop(start + 0.2);
          osc2.stop(start + 0.2);
        });
        break;
      }

      case 'sirena_nuclear': {
        for (let i = 0; i < 3; i++) {
          const start = now + i * 0.85;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(420, start);
          osc.frequency.linearRampToValueAtTime(880, start + 0.42);
          osc.frequency.linearRampToValueAtTime(420, start + 0.82);
          gain.gain.setValueAtTime(0.25 * vol, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + 0.84);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.85);
        }
        break;
      }

      case 'victoria_epica': {
        const fanfare = [
          { f: 523.25, t: 0, d: 0.16 },
          { f: 523.25, t: 0.18, d: 0.16 },
          { f: 523.25, t: 0.36, d: 0.16 },
          { f: 523.25, t: 0.54, d: 0.42 },
          { f: 415.30, t: 0.98, d: 0.42 },
          { f: 466.16, t: 1.42, d: 0.42 },
          { f: 523.25, t: 1.86, d: 0.25 },
          { f: 466.16, t: 2.15, d: 0.18 },
          { f: 523.25, t: 2.35, d: 0.75 }
        ];
        fanfare.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, now + n.t);
          gain.gain.setValueAtTime(0.28 * vol, now + n.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.t);
          osc.stop(now + n.t + n.d + 0.02);
        });
        break;
      }

      case 'mario_coin': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.22 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
        break;
      }

      case 'sad_violin': {
        const notes = [659.25, 622.25, 587.33, 523.25, 493.88];
        notes.forEach((f, i) => {
          const start = now + i * 0.55;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.18 * vol, start);
          gain.gain.exponentialRampToValueAtTime(0.005, start + 0.52);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.54);
        });
        break;
      }

      default: {
        playTierSound(3, 'BUENOS');
        break;
      }
    }
  }
}

export const soundManager = new SoundManager();

export function getTierFromCoins(coins) {
  if (coins >= 99) return 5;
  if (coins >= 20) return 4;
  if (coins >= 15) return 3;
  if (coins >= 5) return 2;
  return 1;
}

export function playTierSound(tier, faction = 'BUENOS') {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (tier) {
    case 1: {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(faction === 'BUENOS' ? 659.25 : 392.0, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }

    case 2: {
      const notes = faction === 'BUENOS' ? [523.25, 659.25, 783.99] : [587.33, 493.88, 440.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.26);
      });
      break;
    }

    case 3: {
      const freqs = faction === 'BUENOS' ? [440, 554.37, 659.25, 880] : [554.37, 493.88, 415.3, 329.63];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.09;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.36);
      });
      break;
    }

    case 4: {
      const chords = faction === 'BUENOS'
        ? [[523.25, 659.25, 783.99], [659.25, 783.99, 1046.50]]
        : [[440.0, 523.25, 659.25], [392.0, 466.16, 587.33]];

      chords.forEach((chord, step) => {
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + step * 0.2;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.56);
        });
      });
      break;
    }

    case 5: {
      if (faction === 'MALOS') {
        const oscLow = ctx.createOscillator();
        const gainLow = ctx.createGain();
        oscLow.type = 'sawtooth';
        oscLow.frequency.setValueAtTime(140, now);
        oscLow.frequency.exponentialRampToValueAtTime(32, now + 0.85);

        gainLow.gain.setValueAtTime(0.35, now);
        gainLow.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        oscLow.connect(gainLow);
        gainLow.connect(ctx.destination);
        oscLow.start(now);
        oscLow.stop(now + 1.2);
      } else {
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.08;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.95);
        });
      }
      break;
    }

    default:
      break;
  }
}
