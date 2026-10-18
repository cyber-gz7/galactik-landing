import { EventEmitter } from '../store.js';

export class SongQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.currentTrack = null;
    this.maxDurationSeconds = 300; // 5 minutos máximo por canción
    this.volume = 80;
    this.isPlaying = false;
    this.player = null;
    this.isApiReady = false;
    this.containerId = 'yt-player-frame';

    this.initYouTubeApi();
  }

  initYouTubeApi() {
    if (window.YT && window.YT.Player) {
      this.isApiReady = true;
      this.mountPlayer();
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      this.isApiReady = true;
      this.mountPlayer();
    };

    if (!document.getElementById('yt-iframe-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  mountPlayer() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.style.width = '100%';
      container.style.height = '100%';
      const mountParent = document.getElementById('music-player-container');
      if (mountParent) {
        mountParent.appendChild(container);
      } else {
        document.body.appendChild(container);
      }
    }

    try {
      this.player = new window.YT.Player(this.containerId, {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 0,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            if (this.player && typeof this.player.setVolume === 'function') {
              this.player.setVolume(this.volume);
            }
            if (this.currentTrack && !this.isPlaying) {
              this.loadTrack(this.currentTrack);
            }
          },
          onStateChange: (event) => {
            this.handlePlayerStateChange(event.data);
          },
          onError: (err) => {
            console.warn('Error en YouTube IFrame Player:', err);
            this.skip('Error reproduciendo video');
          }
        }
      });
    } catch (e) {
      console.warn('No se pudo inicializar YT.Player aún:', e);
    }
  }

  handlePlayerStateChange(state) {
    if (!window.YT) return;

    if (state === window.YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      const dur = this.player?.getDuration ? this.player.getDuration() : 0;
      if (dur > this.maxDurationSeconds) {
        this.emit('song:rejected', {
          track: this.currentTrack,
          reason: `Canción de ${Math.round(dur / 60)} min supera el límite de 5 minutos permitidos.`
        });
        this.skip('Duración máxima superada (5 min)');
        return;
      }
      this.broadcastNowPlaying(this.currentTrack);
      this.emit('playback:state', { state: 'playing', track: this.currentTrack });
    } else if (state === window.YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.emit('playback:state', { state: 'paused', track: this.currentTrack });
    } else if (state === window.YT.PlayerState.ENDED) {
      this.isPlaying = false;
      this.playNext();
    }
  }

  extractVideoId(query) {
    if (!query || typeof query !== 'string') return null;
    const clean = query.trim();

    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }

    const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    return null;
  }

  async fetchVideoMetadata(videoId, fallbackTitle) {
    try {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          return {
            title: data.title,
            author: data.author_name || 'YouTube',
            thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          };
        }
      }
    } catch (_) {}

    return {
      title: fallbackTitle || `Canción ${videoId}`,
      author: 'YouTube Music',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  async addRequest(rawQuery, requester = 'Viewer') {
    const cleanUser = String(requester).replace(/^@+/, '');
    const cleanQuery = String(rawQuery || '').trim();

    if (!cleanQuery) {
      return { ok: false, error: 'Proporciona un link o nombre de YouTube. Ej: !sr https://youtu.be/...' };
    }

    let videoId = this.extractVideoId(cleanQuery);
    let trackTitle = cleanQuery;

    if (!videoId) {
      try {
        const ddgUrl = `https://api.duckduckgo.com/?q=!ducky+site:youtube.com+${encodeURIComponent(cleanQuery)}&format=json&no_redirect=1`;
        const res = await fetch(ddgUrl);
        if (res.ok) {
          const loc = res.headers.get('location') || '';
          videoId = this.extractVideoId(loc);
        }
      } catch (_) {}

      if (!videoId) {
        return {
          ok: false,
          error: 'Por favor pega el link de YouTube directamente (ej: !sr https://youtu.be/dQw4w9WgXcQ)'
        };
      }
    }

    const meta = await this.fetchVideoMetadata(videoId, trackTitle);

    const track = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      videoId,
      title: meta.title,
      author: meta.author,
      thumbnail: meta.thumbnail,
      requestedBy: cleanUser,
      addedAt: Date.now()
    };

    this.queue.push(track);
    this.emit('queue:updated', { queue: this.queue, current: this.currentTrack });

    if (!this.currentTrack && !this.isPlaying) {
      this.playNext();
      return { ok: true, queued: false, playing: true, track };
    }

    return {
      ok: true,
      queued: true,
      position: this.queue.length,
      track
    };
  }

  playNext() {
    if (this.queue.length === 0) {
      this.currentTrack = null;
      this.isPlaying = false;
      this.broadcastNowPlaying(null);
      this.emit('queue:ended');
      this.emit('queue:updated', { queue: [], current: null });
      return null;
    }

    this.currentTrack = this.queue.shift();
    this.loadTrack(this.currentTrack);
    this.emit('queue:updated', { queue: this.queue, current: this.currentTrack });
    return this.currentTrack;
  }

  loadTrack(track) {
    if (!track || !track.videoId) return;

    if (this.player && typeof this.player.loadVideoById === 'function') {
      try {
        this.player.loadVideoById({
          videoId: track.videoId,
          startSeconds: 0
        });
        if (typeof this.player.setVolume === 'function') {
          this.player.setVolume(this.volume);
        }
        this.player.playVideo();
        this.isPlaying = true;
      } catch (err) {
        console.warn('Error al cargar video en reproductor:', err);
      }
    }

    this.broadcastNowPlaying(track);
  }

  pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
    this.isPlaying = false;
    this.emit('playback:state', { state: 'paused', track: this.currentTrack });
    return { ok: true, state: 'paused' };
  }

  resume() {
    if (this.player && typeof this.player.playVideo === 'function') {
      this.player.playVideo();
      this.isPlaying = true;
    }
    this.emit('playback:state', { state: 'playing', track: this.currentTrack });
    return { ok: true, state: 'playing' };
  }

  skip(reason = 'Comando !skip') {
    const skipped = this.currentTrack;
    if (this.player && typeof this.player.stopVideo === 'function') {
      try { this.player.stopVideo(); } catch (_) {}
    }
    const next = this.playNext();
    this.emit('song:skipped', { skipped, next, reason });
    return { ok: true, skipped, next };
  }

  setVolume(vol) {
    const clamped = Math.max(0, Math.min(100, Number(vol) || 0));
    this.volume = clamped;
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(clamped);
    }
    this.emit('volume:changed', { volume: clamped });
    return { ok: true, volume: clamped };
  }

  removeTrack(trackId) {
    const idx = this.queue.findIndex(t => t.id === trackId);
    if (idx !== -1) {
      const removed = this.queue.splice(idx, 1)[0];
      this.emit('queue:updated', { queue: this.queue, current: this.currentTrack });
      return { ok: true, removed };
    }
    return { ok: false, error: 'Canción no encontrada en cola' };
  }

  clearQueue() {
    this.queue = [];
    this.emit('queue:updated', { queue: [], current: this.currentTrack });
    return { ok: true };
  }

  async broadcastNowPlaying(track) {
    const payload = track ? {
      title: track.title,
      author: track.author,
      thumbnail: track.thumbnail,
      requestedBy: track.requestedBy,
      videoId: track.videoId,
      status: 'playing'
    } : null;

    try {
      await fetch('http://127.0.0.1:4000/api/music/now-playing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: payload })
      });
    } catch (_) {}

    this.emit('now_playing', payload);
  }
}

export const songQueue = new SongQueue();
