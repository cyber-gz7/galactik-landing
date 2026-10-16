import { showToast } from './toast.js';
export async function copyLink(value, button) {
  try {
    await navigator.clipboard.writeText(value);
    if (button) {
      const label = button.textContent;
      button.textContent = '✓ ¡Copiado!';
      setTimeout(() => { button.textContent = label; }, 1800);
    }
    showToast('Link copiado. Pégalo en una Fuente de navegador.');
  } catch { showToast('No se pudo copiar. Selecciona la URL y usa Ctrl+C.'); }
}
export function createLinkHub(url, title = 'Tu overlay, listo para salir en vivo') {
  const hub = document.createElement('div');
  hub.className = 'link-hub';
  hub.innerHTML = `<div class="hub-heading"><div><span class="eyebrow">INICIO RÁPIDO</span><h2>${title}</h2></div><span class="module-badge">1080 × 1920</span></div><ol class="quick-steps"><li><b>1</b> Copia el link</li><li><b>2</b> Pégalo en OBS / LIVE Studio</li><li><b>3</b> Controla tu directo</li></ol><div class="link-bar"><input readonly aria-label="URL del overlay"><button type="button" class="btn-primary">Copiar link</button><a class="btn-secondary" target="_blank" rel="noopener">Previsualizar ↗</a></div><p>Fuente de navegador · Fondo transparente · Ajusta el tamaño en tu escena.</p>`;
  hub.querySelector('input').value = url;
  hub.querySelector('a').href = url;
  hub.querySelector('button').onclick = event => copyLink(url, event.currentTarget);
  return hub;
}
export function initShell() {
  const header = document.querySelector('.topbar-left');
  const logo = document.createElement('img');
  logo.src = './galactk-logo.png'; logo.alt = ''; logo.className = 'header-brand-logo';
  header?.prepend(logo);
  const decorateNav = () => {
    const beta = ['tab-sounds', 'tab-alertas', 'tab-rcon', 'tab-minecraft'];
    document.querySelectorAll('.nav-tab-btn').forEach(button => {
      button.classList.remove('hidden-by-mode');
      if (!button.querySelector('.tab-label')) {
        const label = document.createElement('span'); label.className = 'tab-label';
        label.textContent = button.textContent.trim(); button.replaceChildren(label);
      }
      if (!button.querySelector('.module-badge')) {
        const badge = document.createElement('span'); badge.className = 'module-badge';
        badge.textContent = beta.includes(button.dataset.tab) ? 'BETA' : (button.dataset.tab === 'tab-roblox' ? 'PRO' : 'LISTO');
        if (beta.includes(button.dataset.tab)) badge.classList.add('beta');
        button.append(badge);
      }
    });
  };
  decorateNav();
  document.addEventListener('galactk:ready', decorateNav);
  document.getElementById('galactic-toast')?.setAttribute('role', 'status');
  document.querySelectorAll('img.brand-logo-img').forEach(img => { img.src = './galactk-logo.png'; img.alt = 'GALACTK PANEL'; });
}
