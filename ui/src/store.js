export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    this.events.get(eventName).add(listener);
    return () => this.off(eventName, listener);
  }

  off(eventName, listener) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).delete(listener);
    }
  }

  emit(eventName, ...args) {
    if (this.events.has(eventName)) {
      for (const listener of this.events.get(eventName)) {
        try {
          listener(...args);
        } catch (err) {
          console.error(`Error in listener for event ${eventName}:`, err);
        }
      }
    }
  }
}

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = {
      totems: 10,
      maxTotems: 20,
      minTotems: 0,
      activeFaction: 'BUENOS',
      isLive: false,
      tiktokStatus: 'DESCONECTADO', // CONECTADO | DESCONECTADO | CONECTANDO
      tikTokUsername: '',
      rconStatus: 'DESCONECTADO',   // CONECTADO | DESCONECTADO | ERROR
      rconConfig: {
        host: '127.0.0.1',
        port: 25575,
        password: ''
      },
      stats: {
        likes: 0,
        gifts: 0,
        coins: 0,
        followers: 0
      },
      giftHistory: []
    };
  }

  getState() {
    return this.state;
  }

  setTotems(val) {
    const clamped = Math.max(this.state.minTotems, Math.min(this.state.maxTotems, Number(val)));
    const prev = this.state.totems;
    this.state.totems = clamped;
    this.emit('totems:change', { totems: clamped, prev, delta: clamped - prev });
  }

  modifyTotems(delta) {
    this.setTotems(this.state.totems + Number(delta));
  }

  setFaction(faction) {
    const valid = faction === 'MALOS' ? 'MALOS' : 'BUENOS';
    this.state.activeFaction = valid;
    this.emit('faction:change', valid);
  }

  toggleFaction() {
    this.setFaction(this.state.activeFaction === 'BUENOS' ? 'MALOS' : 'BUENOS');
  }

  setTikTokStatus(status, username = null) {
    this.state.tiktokStatus = status;
    this.state.isLive = status === 'CONECTADO';
    if (username !== null) {
      this.state.tikTokUsername = username;
    }
    this.emit('tiktok:status', { status, username: this.state.tikTokUsername, isLive: this.state.isLive });
  }

  setRconStatus(status) {
    this.state.rconStatus = status;
    this.emit('rcon:status', status);
  }

  setRconConfig(config) {
    this.state.rconConfig = { ...this.state.rconConfig, ...config };
    this.emit('rcon:config', this.state.rconConfig);
  }

  incrementStats({ likes = 0, gifts = 0, coins = 0, followers = 0 } = {}) {
    this.state.stats.likes += likes;
    this.state.stats.gifts += gifts;
    this.state.stats.coins += coins;
    this.state.stats.followers += followers;
    this.emit('stats:change', { ...this.state.stats });
  }

  addHistory(entry) {
    const item = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      ...entry
    };
    this.state.giftHistory.unshift(item);
    if (this.state.giftHistory.length > 50) {
      this.state.giftHistory.pop();
    }
    this.emit('history:entry', item);
    this.emit('history:change', this.state.giftHistory);
  }

  clearHistory() {
    this.state.giftHistory = [];
    this.emit('history:change', this.state.giftHistory);
  }
}

export const store = new Store();
