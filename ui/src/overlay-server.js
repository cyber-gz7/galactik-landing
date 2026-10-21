// Cliente y puente de Superposiciones (Overlays) para OBS y TikTok LIVE Studio
// Comunica el estado de escala, regalos, likes y duelos con el backend nativo de GZ7Live (localhost:4000)

import { store } from './store.js';

export class OverlayBridge {
  constructor() {
    this.currentScale = 100;

    store.on('duel:push', event => {
      this.pushDuel(event.side, event.power, event.donor, event.giftName);
    });

    store.on('history:entry', entry => {
      if (entry.type === 'gift') {
        this.emitGift(entry.user, entry.title, entry.coins || 1);
      }
    });

    store.on('stats:change', stats => {
      // stats update if needed
    });
  }

  getInvoke() {
    return window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke || null;
  }

  async setGiftScale(scale) {
    this.currentScale = Math.max(40, Math.min(300, Number(scale) || 100));
    const invoke = this.getInvoke();
    if (invoke) {
      try {
        await invoke('set_gift_scale', { scale: this.currentScale });
      } catch (err) {
        console.warn('Error llamando set_gift_scale:', err);
      }
    }
  }

  async pushDuel(side, power, donor, giftName) {
    const invoke = this.getInvoke();
    if (invoke) {
      try {
        await invoke('push_duel', {
          side: side || 'LEFT',
          power: Number(power) || 1.0,
          donor: donor || 'Donador',
          giftName: giftName || 'Regalo'
        });
      } catch (err) {
        console.warn('Error llamando push_duel:', err);
      }
    }
  }

  async emitGift(user, title, coins = 1) {
    const invoke = this.getInvoke();
    if (invoke) {
      try {
        await invoke('emit_overlay_gift', {
          user: user || 'Donador',
          title: title || 'Regalo',
          coins: Number(coins) || 1
        });
      } catch (err) {
        console.warn('Error llamando emit_overlay_gift:', err);
      }
    }
  }

  async emitLike(user, count = 1) {
    const invoke = this.getInvoke();
    if (invoke) {
      try {
        await invoke('emit_overlay_like', {
          user: user || 'Viewer',
          count: Number(count) || 1
        });
      } catch (err) {
        console.warn('Error llamando emit_overlay_like:', err);
      }
    }
  }

  async updateMcOverlay(config) {
    const invoke = this.getInvoke();
    const config_json = typeof config === 'string' ? config : JSON.stringify(config);
    if (invoke) {
      try {
        await invoke('update_mc_overlay_config', { config_json });
      } catch (err) {
        try {
          await invoke('update_mc_overlay_config', { configJson: config_json });
        } catch (e) {
          console.warn('Error llamando update_mc_overlay_config:', e);
        }
      }
    }
  }
}

export const overlayServer = new OverlayBridge();
