// Motor TTS Híbrido Avanzado — GALACTK PANEL by GZ7
// Soporte para Voces Virales TikTok (Cloud Base64) + Filtro Inteligente Neural WebSpeech + SAPI Nativo
// Robustecido con Sanitizador Léxico Anti-Locuras y Control de Rendimiento

/**
 * Voces Virales de TikTok y Presets Neurales
 */
export const TIKTOK_VOICES = [
  { id: 'tiktok:es_mx_002', name: '🎵 Voz TikTok Latam (Viral - Clásica)', code: 'es_mx_002', lang: 'es-MX', type: 'tiktok' },
  { id: 'tiktok:es_002', name: '🎙️ Voz TikTok Masculina (Viral)', code: 'es_002', lang: 'es-ES', type: 'tiktok' },
  { id: 'tiktok:es_mx_001', name: '🎙️ Voz TikTok Femenina (Viral)', code: 'es_mx_001', lang: 'es-MX', type: 'tiktok' },
  { id: 'system:natural_male', name: '⚡ Narrador Natural Masculino (Edge / Alvaro / Jorge)', code: 'system_male', lang: 'es', type: 'system' },
  { id: 'system:natural_female', name: '⚡ Narradora Natural Femenina (Edge / Dalia / Elvira)', code: 'system_female', lang: 'es', type: 'system' }
];

/**
 * Sanitizador Léxico Anti-Locuras
 * Normaliza y purifica texto antes de enviarlo a la síntesis de voz:
 * - Remueve emojis y pictogramas de TikTok que traban o distorsionan la voz.
 * - Limpia caracteres zalgo, marcas combinadas apiladas y símbolos invisibles.
 * - Colapsa cadenas repetitivas spam ('aaaaaaa' -> 'aa', '!!!!!' -> '!').
 * - Preserva y pronuncia fluidamente palabras largas reales ('esternocleidomastoideo')
 *   mientras fragmenta o acorta keyboard-smashing malicioso.
 * - Soporte limpio para cualquier idioma (español, inglés, portugués, etc.).
 */
export function sanitizeTtsText(raw, options = {}) {
  if (!raw) return '';
  let str = String(raw);

  // 1. Normalización canónica Unicode (NFC)
  try {
    str = str.normalize('NFC');
  } catch (_) {}

  // 2. Limpieza de URLs y enlaces web
  str = str.replace(/https?:\/\/\S+/gi, ' enlace ');
  str = str.replace(/www\.[a-z0-9\-]+(?:\.[a-z0-9\-]+)+(?:\/\S*)?/gi, ' enlace ');
  str = str.replace(/tiktok\.com\/@?\S+/gi, ' enlace ');

  // 3. Normalizar menciones y hashtags
  str = str.replace(/@([a-zA-Z0-9_\.\-]+)/g, '$1');
  str = str.replace(/#([a-zA-Z0-9_\-]+)/g, '$1');

  // 4. Adaptar expresiones de moneda regionales para fonética limpia
  str = str.replace(/\bS\/\.?\s*(\d+(?:[.,]\d+)?)/gi, '$1 soles');
  str = str.replace(/\$\s*(\d+(?:[.,]\d+)?)/g, '$1 dólares');
  str = str.replace(/\bR\$\s*(\d+(?:[.,]\d+)?)/gi, '$1 reales');

  // 5. Remover emojis y pictogramas de TikTok
  str = str.replace(/[\p{Extended_Pictographic}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{200D}\u{FE0E}\u{FE0F}]/gu, ' ');

  // Emotes textuales o tags entre corchetes usados en directos
  str = str.replace(/\[(?:rose|rosa|heart|corazon|gift|regalo|gg|cheer|follow|tiktok|sub|emote|kiss|like)\]/gi, ' ');

  // Kaomojis y caritas ASCII complejas que confunden al sintetizador
  str = str.replace(/\((?:づ|｡|◕|‿|•|°|╯|□|눈|¯|ツ)[^)]*\)/gu, ' ');

  // 6. Remover caracteres Zalgo y marcas diacríticas excesivas apiladas
  str = str.replace(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]{2,}/gu, '');

  // 7. Remover caracteres invisibles, separadores ocultos, BiDi overrides y caracteres de control
  str = str.replace(/[\u200B-\u200D\uFEFF\u2060\u200E\u200F\u202A-\u202E\u2066-\u2069]/gu, '');
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  // 8. Colapso de spam de caracteres repetidos
  str = str.replace(/(.)\1{2,}/gu, '$1$1');
  str = str.replace(/([!?.,;:\-_~*#^])\1+/g, '$1');

  // 9. Colapso de palabras repetidas consecutivas
  str = str.replace(/\b(\S+)(?:\s+\1){2,}\b/gi, '$1 $1');

  // 10. Protección de palabras largas reales vs keyboard-smash malicioso
  str = str.split(/\s+/).map(word => {
    if (word.length > 32) {
      return word.match(/.{1,24}/g)?.join(' ') || word.slice(0, 32);
    }
    return word;
  }).join(' ');

  // 11. Normalización de espacios y limitación de longitud razonable
  str = str.replace(/\s+/g, ' ').trim();

  const maxLen = options.maxLength || 220;
  if (str.length > maxLen) {
    str = str.substring(0, maxLen).trim() + '...';
  }

  return str;
}

export class TtsEngine {
  constructor() {
    this.config = {
      enabled: true,                       // Interruptor maestro ON/OFF
      engine: 'tiktok',                    // 'tiktok' (Cloud Viral), 'edge' (Neural), 'local' (SAPI Windows)
      language: 'es-MX',                   // Idioma de síntesis
      voiceName: 'tiktok:es_mx_002',       // Voz por defecto: Voz TikTok Latam Clásica
      randomVoice: false,                  // Voz aleatoria
      speed: 1.0,                          // Velocidad (0.5x a 2.0x)
      pitch: 1.0,                          // Tono (0.5 a 1.5)
      volume: 85,                          // Volumen (0% a 100%)
      readGifts: true,                     // Anunciar regalos
      allowAll: true,
      allowFollowers: true,
      allowSuperFans: true,
      allowMods: true,
      allowTeamMembers: false,
      teamMemberLevel: 1,
      allowTopGifters: false,
      topGifterRank: 1,
      topGiftLimit: 10,
      topLikesLimit: 10
    };
    this.queue = [];
    this.isSpeaking = false;
    this.availableVoices = [];
    this.listeners = new Set();
    this.audioEl = null;
    this.loadFromStorage();
    this.initVoices();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('galactic_tts_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.speed === 'number' && parsed.speed > 5) {
          parsed.speed = Math.max(0.5, Math.min(2.0, Math.round((0.5 + (parsed.speed / 100) * 1.5) * 10) / 10));
        }
        if (typeof parsed.volume === 'number') {
          parsed.volume = Math.max(0, Math.min(100, Math.round(parsed.volume)));
        }
        if (typeof parsed.pitch === 'number') {
          parsed.pitch = Math.max(0.5, Math.min(1.5, parsed.pitch));
        } else {
          parsed.pitch = 1.0;
        }
        this.config = { ...this.config, ...parsed };
        if (this.config.enabled === undefined) this.config.enabled = true;
      }
    } catch (_) {}
  }

  saveToStorage() {
    try {
      localStorage.setItem('galactic_tts_config', JSON.stringify(this.config));
    } catch (_) {}
  }

  notifyChange() {
    for (const fn of this.listeners) {
      try { fn(this.config); } catch (_) {}
    }
  }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  updateConfig(partial) {
    const wasEnabled = this.config.enabled;
    this.config = { ...this.config, ...partial };

    if (partial.volume !== undefined) {
      this.config.volume = Math.max(0, Math.min(100, Number(partial.volume) || 0));
    }
    if (partial.speed !== undefined) {
      this.config.speed = Math.max(0.5, Math.min(2.0, Number(partial.speed) || 1.0));
    }
    if (partial.pitch !== undefined) {
      this.config.pitch = Math.max(0.5, Math.min(1.5, Number(partial.pitch) || 1.0));
    }

    if (wasEnabled && this.config.enabled === false) {
      this.stop();
    }

    this.saveToStorage();
    this.notifyChange();

    if (typeof window !== 'undefined' && window.gz7App?.persistConfig) {
      window.gz7App.persistConfig().catch(() => {});
    }
  }

  initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        this.availableVoices = window.speechSynthesis.getVoices() || [];
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  getVoicesList() {
    if (!this.availableVoices.length && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices() || [];
    }
    return this.availableVoices;
  }

  sanitizeText(raw) {
    return sanitizeTtsText(raw);
  }

  shouldReadUser(chatEvent) {
    if (!this.config.enabled) return false;
    if (this.config.allowAll) return true;
    if (this.config.allowMods && chatEvent.isModerator) return true;
    if (this.config.allowSuperFans && chatEvent.isSubscriber) return true;
    if (this.config.allowFollowers && chatEvent.followRole > 0) return true;
    return false;
  }

  speakChat(user, comment, chatEvent = {}) {
    if (!this.shouldReadUser(chatEvent)) return;
    const cleanComment = this.sanitizeText(comment);
    if (!cleanComment) return;
    const cleanUser = String(user || 'Usuario').replace(/^@/, '').substring(0, 24);
    this.speak(`${cleanUser} dice: ${cleanComment}`);
  }

  speakGift(user, giftName, coins = 1) {
    if (!this.config.enabled || !this.config.readGifts) return;
    if (coins < 5) return;
    const cleanUser = String(user || 'Donador').replace(/^@/, '').substring(0, 24);
    this.speak(`¡Gracias ${cleanUser} por enviar ${giftName}!`, true);
  }

  stop() {
    this.queue = [];
    this.isSpeaking = false;
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioEl.src = '';
      } catch (_) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
  }

  async speak(text, priority = false) {
    if (!this.config.enabled || this.config.volume <= 0) return;
    const clean = this.sanitizeText(text);
    if (!clean) return;

    if (priority) {
      this.queue.unshift(clean);
    } else {
      if (this.queue.length >= 10) {
        this.queue.shift();
      }
      this.queue.push(clean);
    }

    this.processQueue();
  }

  async fetchTikTokAudio(text, voiceCode) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch('https://tiktok-tts.weilnet.dev/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          voice: voiceCode || 'es_mx_002'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success && data.data) {
        return data.data;
      }
      throw new Error(data?.error || 'Sin audio en respuesta TikTok');
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  playAudioBase64(base64Data, onFinished) {
    if (!this.audioEl && typeof document !== 'undefined') {
      this.audioEl = document.getElementById('galactk-tts-audio');
      if (!this.audioEl) {
        this.audioEl = document.createElement('audio');
        this.audioEl.id = 'galactk-tts-audio';
        this.audioEl.style.display = 'none';
        document.body.appendChild(this.audioEl);
      }
    }

    if (!this.audioEl) {
      onFinished();
      return;
    }

    const vol = Math.max(0, Math.min(1.0, (Number(this.config.volume) || 85) / 100));
    this.audioEl.volume = vol;
    this.audioEl.playbackRate = Math.max(0.5, Math.min(2.0, Number(this.config.speed) || 1.0));

    let completed = false;
    const finishOnce = () => {
      if (completed) return;
      completed = true;
      if (this.audioEl) {
        this.audioEl.onended = null;
        this.audioEl.onerror = null;
      }
      onFinished();
    };

    this.audioEl.onended = finishOnce;
    this.audioEl.onerror = finishOnce;

    const safetyTimeout = setTimeout(() => {
      finishOnce();
    }, 12000);

    this.audioEl.src = `data:audio/mp3;base64,${base64Data}`;
    this.audioEl.play().catch(e => {
      clearTimeout(safetyTimeout);
      finishOnce();
    });
  }

  resolveSmartVoice(voices) {
    if (!voices || !voices.length) return null;

    const targetName = this.config.voiceName || 'tiktok:es_mx_002';

    // 1. Narrador Natural Masculino
    if (targetName === 'system:natural_male') {
      const naturalMale = voices.find(v => {
        const n = v.name.toLowerCase();
        const isSpanish = v.lang.toLowerCase().startsWith('es');
        const isNatural = n.includes('natural') || n.includes('online') || n.includes('neural');
        const isMale = n.includes('alvaro') || n.includes('jorge') || n.includes('alonso') || n.includes('male') || n.includes('david');
        return isSpanish && isNatural && isMale;
      });
      if (naturalMale) return naturalMale;

      const anyMaleSpanish = voices.find(v => {
        const n = v.name.toLowerCase();
        return v.lang.toLowerCase().startsWith('es') && (n.includes('alvaro') || n.includes('jorge') || n.includes('david') || n.includes('pablo'));
      });
      if (anyMaleSpanish) return anyMaleSpanish;
    }

    // 2. Narradora Natural Femenina
    if (targetName === 'system:natural_female') {
      const naturalFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        const isSpanish = v.lang.toLowerCase().startsWith('es');
        const isNatural = n.includes('natural') || n.includes('online') || n.includes('neural');
        const isFemale = n.includes('dalia') || n.includes('elvira') || n.includes('paloma') || n.includes('female') || n.includes('sabina') || n.includes('helena');
        return isSpanish && isNatural && isFemale;
      });
      if (naturalFemale) return naturalFemale;

      const anyFemaleSpanish = voices.find(v => {
        const n = v.name.toLowerCase();
        return v.lang.toLowerCase().startsWith('es') && (n.includes('dalia') || n.includes('elvira') || n.includes('sabina') || n.includes('helena'));
      });
      if (anyFemaleSpanish) return anyFemaleSpanish;
    }

    // 3. Voz instalada por nombre exacto
    const exact = voices.find(v => v.name === targetName);
    if (exact) return exact;

    // 4. Voz aleatoria
    if (this.config.randomVoice) {
      const langPrefix = (this.config.language || 'es').slice(0, 2).toLowerCase();
      const pool = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
      if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
    }

    // 5. Filtro Inteligente de Prioridad: Edge Online Natural > Google > SAPI
    const langPrefix = (this.config.language || 'es').slice(0, 2).toLowerCase();
    const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));

    const edgeNatural = langVoices.find(v => {
      const n = v.name.toLowerCase();
      return (n.includes('online (natural)') || n.includes('natural')) && !n.includes('desktop');
    });
    if (edgeNatural) return edgeNatural;

    const googleVoice = langVoices.find(v => v.name.toLowerCase().includes('google'));
    if (googleVoice) return googleVoice;

    if (langVoices.length) return langVoices[0];

    return voices[0] || null;
  }

  playWebSpeech(text, onFinished) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.playNativeTauri(text, onFinished);
      return;
    }

    try {
      const voices = this.getVoicesList();
      if (!voices.length) {
        this.playNativeTauri(text, onFinished);
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.volume = Math.max(0.01, Math.min(1.0, (Number(this.config.volume) || 85) / 100));
      utter.rate = Math.max(0.5, Math.min(2.0, (Number(this.config.speed) || 1.0) * 1.05));
      utter.pitch = Math.max(0.5, Math.min(1.5, Number(this.config.pitch) || 1.0));
      utter.lang = this.config.language || 'es-MX';

      const chosenVoice = this.resolveSmartVoice(voices);
      if (chosenVoice) {
        utter.voice = chosenVoice;
      }

      let ended = false;
      const completeOnce = () => {
        if (ended) return;
        ended = true;
        onFinished();
      };

      utter.onend = completeOnce;
      utter.onerror = completeOnce;

      setTimeout(() => {
        if (!ended) completeOnce();
      }, 9000);

      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.warn('[TTS] Error en WebSpeech, fallback nativo:', err);
      this.playNativeTauri(text, onFinished);
    }
  }

  async playNativeTauri(text, onFinished) {
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    if (invoke) {
      try {
        const rate = Math.round((Number(this.config.speed) - 1.0) * 5);
        await invoke('speak_tts_native', {
          text,
          rate,
          volume: Number(this.config.volume) || 85
        });
      } catch (e) {
        console.warn('Error en speak_tts_native:', e);
      }
    }
    onFinished();
  }

  async processQueue() {
    if (this.isSpeaking || !this.queue.length) return;
    if (!this.config.enabled || this.config.volume <= 0) {
      this.queue = [];
      return;
    }

    const nextText = this.queue.shift();
    this.isSpeaking = true;

    const onFinished = () => {
      this.isSpeaking = false;
      setTimeout(() => this.processQueue(), 90);
    };

    const currentVoice = this.config.voiceName || 'tiktok:es_mx_002';
    const isTikTokVoice = currentVoice.startsWith('tiktok:') || this.config.engine === 'tiktok';

    if (isTikTokVoice) {
      const code = currentVoice.startsWith('tiktok:') ? currentVoice.replace('tiktok:', '') : 'es_mx_002';
      try {
        const base64Audio = await this.fetchTikTokAudio(nextText, code);
        if (base64Audio) {
          this.playAudioBase64(base64Audio, onFinished);
          return;
        }
      } catch (err) {
        console.warn('[TTS] TikTok Cloud no disponible, activando fallback neural de respaldo:', err?.message || err);
      }
    }

    this.playWebSpeech(nextText, onFinished);
  }
}

export const ttsEngine = new TtsEngine();
if (typeof window !== 'undefined') {
  window.gz7TtsEngine = ttsEngine;
  window.sanitizeTtsText = sanitizeTtsText;
  window.TIKTOK_VOICES = TIKTOK_VOICES;
}
