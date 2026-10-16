let toastTimer = null;
export function showToast(msg) {
  const el = document.getElementById('galactic-toast');
  const txt = document.getElementById('galactic-toast-text');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.style.display = 'flex';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.display = 'none';
  }, 2800);
}

