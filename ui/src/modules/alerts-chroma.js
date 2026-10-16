import { initS2EStudio, renderAlertasChromaStudio } from '../s2e-studio.js';
import { createLinkHub } from '../core/shell.js';
export function initAlertsChroma() {
  initS2EStudio();
  const pane = document.getElementById('tab-alertas');
  if (!pane) return { render: renderAlertasChromaStudio };
  const intro = document.createElement('div'); intro.className = 'module-hero';
  intro.innerHTML = '<span class="eyebrow">VIDEO & CHROMA KEY</span><h1>Alertas de pantalla <span class="module-badge">BETA</span></h1><p>Un regalo, una reacción. Elige un video y ajusta su fondo.</p>';
  pane.prepend(createLinkHub('http://127.0.0.1:4000/alerta.html', 'Dale vida a cada regalo'));
  pane.prepend(intro);
  const presets = document.createElement('div'); presets.className = 'beta-banner';
  presets.innerHTML = 'Croma rápido · <button class="btn-micro" data-key="#00ff00">Verde</button> <button class="btn-micro" data-key="#0000ff">Azul</button> <button class="btn-micro" data-key="#000000">Negro</button> <span>Selecciona una alerta y ajusta la tolerancia en su editor.</span>';
  pane.querySelector('.link-hub')?.after(presets);
  presets.onclick = event => {
    const key = event.target.closest('[data-key]')?.dataset.key; if (!key) return;
    const mode = document.getElementById('al-edit-chroma-mode');
    const color = document.getElementById('al-edit-chroma-color');
    if (mode) { mode.value = 'manual'; mode.dispatchEvent(new Event('change')); }
    if (color) { color.value = key; color.dispatchEvent(new Event('input')); color.dispatchEvent(new Event('change')); }
  };
  return { render: renderAlertasChromaStudio };
}
