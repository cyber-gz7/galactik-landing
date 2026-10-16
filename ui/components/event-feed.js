import { store } from '../src/store.js';

export class EventFeedComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.feedList = this.querySelector('#feed-container');

    this.unsubscribeHistory = store.on('history:entry', entry => {
      this.prependFeedItem(entry);
    });

    this.unsubscribeChange = store.on('history:change', list => {
      if (list.length === 0) {
        this.renderEmptyState();
      }
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeHistory) this.unsubscribeHistory();
    if (this.unsubscribeChange) this.unsubscribeChange();
  }

  render() {
    this.innerHTML = `
      <div class="feed-card">
        <div class="feed-header">
          <div class="feed-title">
            <span class="live-pulse"></span>
            FEED EN VIVO
          </div>
          <button class="btn-micro" id="btn-clear-feed">Limpiar</button>
        </div>
        <div class="feed-list" id="feed-container">
          <div class="feed-empty">Esperando eventos en vivo de TikTok...</div>
        </div>
      </div>
    `;

    this.querySelector('#btn-clear-feed')?.addEventListener('click', () => {
      store.clearHistory();
    });
  }

  renderEmptyState() {
    if (this.feedList) {
      this.feedList.innerHTML = `<div class="feed-empty">Esperando eventos en vivo de TikTok...</div>`;
    }
  }

  prependFeedItem(entry) {
    if (!this.feedList) return;

    const empty = this.feedList.querySelector('.feed-empty');
    if (empty) empty.remove();

    const item = document.createElement('div');
    const isGift = entry.type === 'gift';
    const factionClass = entry.faction ? entry.faction.toLowerCase() : 'neutral';

    item.className = `feed-item ${entry.type} ${factionClass}`;
    item.innerHTML = `
      <div class="feed-item-top">
        <span class="feed-item-user">${this.escape(entry.user || 'Usuario')}</span>
        <span class="feed-item-time">${entry.timestamp || ''}</span>
      </div>
      <div class="feed-item-body">
        <span class="feed-item-title">${this.escape(entry.title || '')}</span>
        ${entry.coins ? `<span class="feed-coin-badge">${entry.coins} 🪙</span>` : ''}
        ${entry.totemDelta !== undefined && entry.totemDelta !== 0 ? `
          <span class="feed-delta-badge ${entry.totemDelta > 0 ? 'pos' : 'neg'}">
            ${entry.totemDelta > 0 ? '+' : ''}${entry.totemDelta} Tótems
          </span>
        ` : ''}
      </div>
      ${entry.command ? `
        <div class="feed-item-command" title="Comando ejecutado: ${this.escape(entry.command)}">
          <code>${this.escape(entry.command)}</code>
        </div>
      ` : ''}
    `;

    this.feedList.insertBefore(item, this.feedList.firstChild);

    while (this.feedList.children.length > 30) {
      this.feedList.removeChild(this.feedList.lastChild);
    }
  }

  escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

customElements.define('event-feed', EventFeedComponent);
