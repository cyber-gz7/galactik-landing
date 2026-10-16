import { store } from '../src/store.js';

export class TotemBarComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.unsubscribeStore = store.on('totems:change', ({ totems, delta }) => {
      this.updateTotems(totems, delta);
    });
    this.unsubscribeFaction = store.on('faction:change', () => {
      this.updateColors();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) this.unsubscribeStore();
    if (this.unsubscribeFaction) this.unsubscribeFaction();
  }

  render() {
    const state = store.getState();
    const count = state.totems;
    const max = state.maxTotems || 20;
    const percentage = Math.round((count / max) * 100);
    const faction = state.activeFaction;

    this.innerHTML = `
      <div class="totem-card ${faction.toLowerCase()}">
        <div class="totem-header">
          <div class="totem-title-row">
            <span class="totem-badge">ESTADO DEL JUEGO</span>
            <span class="totem-delta-badge" id="totem-delta-indicator"></span>
          </div>
          <div class="totem-count-wrapper">
            <span class="totem-current-num" id="totem-count-text">${count}</span>
            <span class="totem-max-num">/ ${max}</span>
            <span class="totem-label">TÓTEMS ACTIVOS</span>
          </div>
        </div>

        <div class="totem-meter">
          <div class="totem-meter-fill" id="totem-meter-bar" style="width: ${percentage}%"></div>
        </div>

        <div class="totem-grid" id="totem-hearts-grid">
          ${this.generateHeartsHtml(count, max)}
        </div>

        <div class="totem-manual-actions">
          <button type="button" class="btn-micro" id="btn-sub-totem">-1 Tótem</button>
          <button type="button" class="btn-micro" id="btn-reset-totem">Reset (10)</button>
          <button type="button" class="btn-micro" id="btn-add-totem">+1 Tótem</button>
        </div>
      </div>
    `;

    this.querySelector('#btn-sub-totem')?.addEventListener('click', () => store.modifyTotems(-1));
    this.querySelector('#btn-reset-totem')?.addEventListener('click', () => store.setTotems(10));
    this.querySelector('#btn-add-totem')?.addEventListener('click', () => store.modifyTotems(1));
  }

  generateHeartsHtml(count, max) {
    let html = '';
    for (let i = 1; i <= max; i++) {
      const active = i <= count ? 'active' : 'inactive';
      html += `
        <div class="totem-heart ${active}" data-index="${i}" title="Tótem ${i}">
          <svg viewBox="0 0 24 24" class="heart-icon">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      `;
    }
    return html;
  }

  updateTotems(totems, delta) {
    const max = store.getState().maxTotems || 20;
    const percentage = Math.round((totems / max) * 100);

    const countText = this.querySelector('#totem-count-text');
    if (countText) countText.textContent = totems;

    const meterBar = this.querySelector('#totem-meter-bar');
    if (meterBar) meterBar.style.width = `${percentage}%`;

    const hearts = this.querySelectorAll('.totem-heart');
    hearts.forEach((heart, idx) => {
      const index = idx + 1;
      if (index <= totems) {
        heart.classList.add('active');
        heart.classList.remove('inactive');
      } else {
        heart.classList.remove('active');
        heart.classList.add('inactive');
      }
    });

    const deltaIndicator = this.querySelector('#totem-delta-indicator');
    if (deltaIndicator && delta !== undefined && delta !== 0) {
      const sign = delta > 0 ? `+${delta}` : `${delta}`;
      deltaIndicator.textContent = sign;
      deltaIndicator.className = `totem-delta-badge show ${delta > 0 ? 'pos' : 'neg'}`;
      clearTimeout(this.deltaTimeout);
      this.deltaTimeout = setTimeout(() => {
        deltaIndicator.className = 'totem-delta-badge';
      }, 1800);
    }
  }

  updateColors() {
    const card = this.querySelector('.totem-card');
    if (card) {
      const faction = store.getState().activeFaction;
      card.className = `totem-card ${faction.toLowerCase()}`;
    }
  }
}

customElements.define('totem-bar', TotemBarComponent);
