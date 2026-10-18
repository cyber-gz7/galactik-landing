export { EventEmitter } from '../store.js';

// A single reconnecting stream for all modules. Subscribers receive the latest snapshot.
const subscribers = new Set();
let stream;
let snapshot;
function publish(payload) {
  if (payload.gift_vs_gift) snapshot = { ...snapshot, ...payload };
  for (const fn of subscribers) {
    try { fn(payload); } catch (error) { console.error('Overlay subscriber:', error); }
  }
}
function status(connected) {
  document.body.classList.toggle('overlay-connected', connected);
  document.querySelectorAll('[data-overlay-status]').forEach(el => {
    el.textContent = connected ? 'Overlay conectado' : 'Esperando servidor';
    el.dataset.connected = String(connected);
  });
}
export const overlayEvents = {
  subscribe(fn) { subscribers.add(fn); if (snapshot) fn(snapshot); return () => subscribers.delete(fn); },
  start() {
    if (stream) return;
    status(false);
    stream = new EventSource('http://127.0.0.1:4000/api/eventos');
    stream.onopen = () => status(true);
    stream.onerror = () => status(false);
    stream.onmessage = event => {
      try { publish(JSON.parse(event.data)); } catch (error) { console.warn('Invalid overlay event:', error); }
    };
    window.addEventListener('pagehide', () => this.stop(), { once: true });
  },
  stop() { stream?.close(); stream = null; status(false); }
};
