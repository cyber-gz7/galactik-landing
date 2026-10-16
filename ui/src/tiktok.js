import { EventEmitter } from './store.js';

export class TikTokBridge extends EventEmitter {
  constructor() {
    super();
    this.username = '';
    this.connection = null;
    this.wsBridge = null;
    this.sseSource = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.explicitDisconnect = false;
    this.recentEventKeys = new Set();
  }

  normalizeUsername(raw) {
    let s = String(raw || '').trim();
    const urlMatch = s.match(/tiktok\.com\/@([^/?#\s]+)/i);
    if (urlMatch) {
      s = urlMatch[1];
    }
    return s
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@/i, '')
      .split(/[/?#\s]/)[0]
      .replace(/^@+/, '')
      .toLowerCase()
      .trim();
  }

  isDuplicate(eventName, data) {
    if (!data) return false;
    const msgId = String(data.msgId || data.common?.msgId || '');
    const user = String(data.uniqueId || data.userId || data.nickname || '');
    const gift = String(data.giftId || data.giftName || '');
    const count = Number(data.repeatCount || data.likeCount || data.count || 1);
    const end = data.repeatEnd ? 1 : 0;
    const timeWindow = Math.floor(Date.now() / 1500);

    const sig = msgId
      ? `${eventName}:${msgId}:${count}:${end}`
      : `${eventName}:${user}:${gift}:${count}:${end}:${timeWindow}`;

    if (this.recentEventKeys.has(sig)) {
      return true;
    }
    this.recentEventKeys.add(sig);
    if (this.recentEventKeys.size > 2500) {
      const first = this.recentEventKeys.values().next().value;
      this.recentEventKeys.delete(first);
    }
    return false;
  }

  emitDeduplicated(eventName, data) {
    if (this.isDuplicate(eventName, data)) {
      return;
    }
    this.emit(eventName, data);
  }

  async connect(username) {
    const clean = this.normalizeUsername(username);
    if (!clean) {
      throw new Error('Debe proporcionar un nombre de usuario de TikTok');
    }

    this.explicitDisconnect = false;
    this.username = clean;
    this.isConnecting = true;
    this.recentEventKeys.clear();
    this.emit('connecting', { username: this.username });

    this.cleanupCurrentConnection();

    try {
      const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
      if (invoke) {
        invoke('start_tiktok_sidecar', { username: this.username }).catch(() => {});
      }
    } catch (_) {}

    this.startSseEventStream();
    return { ok: true, username: this.username };
  }

  startSseEventStream() {
    try {
      if (typeof EventSource === 'undefined') return;
      if (this.sseSource) {
        this.sseSource.close();
      }
      this.sseSource = new EventSource('http://127.0.0.1:4000/api/eventos');
      this.sseSource.onmessage = evt => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload?.type === 'tiktok_event' && payload.event) {
            const ev = payload.event;
            const data = payload.data || {};
            if (ev === 'live_room_connected') {
              this.handleConnected({
                username: data.username || this.username,
                roomId: data.roomId || '',
                mode: 'gz7-direct-engine'
              });
              this.emit('room_verified', data);
            } else if (ev === 'live_room_offline' || ev === 'standby_ready') {
              this.handleOffline(data);
            } else if (ev === 'tiktok_disconnected') {
              this.handleDisconnected(data.reason || 'Desconectado');
            } else {
              this.emitDeduplicated(ev, data);
            }
          }
        } catch (_) {}
      };
      this.sseSource.onerror = () => {};
    } catch (_) {}
  }

  tryPassiveLocalRelay() {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:21213/?username=${encodeURIComponent(this.username)}`);
      this.wsBridge = ws;

      ws.onmessage = evt => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload.event && payload.data) {
            this.emitDeduplicated(payload.event, payload.data);
          }
        } catch (_) {}
      };

      ws.onerror = () => {};
      ws.onclose = () => {
        if (this.wsBridge === ws) {
          this.wsBridge = null;
        }
      };
    } catch (_) {}
  }

  handleOffline(info) {
    this.isConnecting = false;
    this.isConnected = false;
    this.emit('offline', {
      username: info?.username || this.username,
      reason: info?.reason || 'El streamer no está transmitiendo en vivo actualmente.'
    });
  }

  handleConnected(info) {
    this.isConnecting = false;
    this.isConnected = true;
    this.reconnectAttempts = 0;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.emit('connected', { username: this.username, info });
  }

  handleDisconnected(reason) {
    const wasConnected = this.isConnected;
    this.isConnected = false;
    this.isConnecting = false;
    this.emit('disconnected', { reason, wasConnected });
  }

  disconnect() {
    this.explicitDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.cleanupCurrentConnection();
    this.isConnected = false;
    this.isConnecting = false;
    this.emit('disconnected', { reason: 'Desconexión manual por usuario', wasConnected: true });
  }

  cleanupCurrentConnection() {
    if (this.connection) {
      try {
        this.connection.disconnect();
      } catch (_) {}
      this.connection = null;
    }
    if (this.wsBridge) {
      try {
        this.wsBridge.onclose = null;
        this.wsBridge.onerror = null;
        this.wsBridge.close();
      } catch (_) {}
      this.wsBridge = null;
    }
    if (this.sseSource) {
      try {
        this.sseSource.close();
      } catch (_) {}
        this.sseSource = null;
    }
  }

  injectEvent(eventName, data) {
    this.emitDeduplicated(eventName, data);
  }
}

export const tikTokBridge = new TikTokBridge();
