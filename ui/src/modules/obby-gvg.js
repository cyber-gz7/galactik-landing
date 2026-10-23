import { parseObbyConfigImport } from './obby-config.js';
import { overlayEvents } from '../core/events.js';
import { showToast } from '../core/toast.js';
import { enhanceObbyWorkspace } from './obby-workspace.js';
import { copyLink } from '../core/shell.js';
import { obtenerNombreEspanol } from '../gifts.js';
export function initObbyGvg({ app, soundManager, giftUrl, openGiftModalForRobloxSlot, openS2EAudioModal }) {
const robloxLeftList = document.getElementById('roblox-left-slots-list');
const robloxRightList = document.getElementById('roblox-right-slots-list');
const targetWinsInput = document.getElementById('roblox-target-wins-input');

function updateLocalSharpnessFilter(sharpVal) {
  const mat = document.querySelector('#gz7-fullhd-filter feConvolveMatrix');
  if (!mat) return;
  const s = Math.max(100, Math.min(240, Number(sharpVal) || 140));
  const amt = ((s - 100) / 100) * 0.55;
  const center = (1 + 4 * amt).toFixed(3);
  const edge = (-amt).toFixed(3);
  mat.setAttribute('kernelMatrix', `0 ${edge} 0 ${edge} ${center} ${edge} 0 ${edge} 0`);
}

function renderRobloxEditor() {
  if (!robloxLeftList || !robloxRightList) return;
  const cfg = app.robloxOverlayConfig;
  targetWinsInput.value = cfg.target_wins || 10;

  const redImg = document.getElementById('rbx-center-red-img');
  const redName = document.getElementById('rbx-center-red-name');
  const redCoins = document.getElementById('rbx-center-red-coins');
  const redSoundBtn = document.getElementById('btn-sound-center-red');
  if (redImg) redImg.src = giftUrl(cfg.center_red_icon, cfg.center_red_name, cfg.center_red_coins);
  if (redName) redName.textContent = cfg.center_red_name || 'Rose';
  if (redCoins) redCoins.textContent = `${cfg.center_red_coins || 1} 💎`;
  if (redSoundBtn) redSoundBtn.textContent = `🔊 ${cfg.center_red_sound_name || 'Elegir sonido'}`;

  const blueImg = document.getElementById('rbx-center-blue-img');
  const blueName = document.getElementById('rbx-center-blue-name');
  const blueCoins = document.getElementById('rbx-center-blue-coins');
  const blueSoundBtn = document.getElementById('btn-sound-center-blue');
  if (blueImg) blueImg.src = giftUrl(cfg.center_blue_icon, cfg.center_blue_name, cfg.center_blue_coins);
  if (blueName) blueName.textContent = cfg.center_blue_name || 'GG';
  if (blueCoins) blueCoins.textContent = `${cfg.center_blue_coins || 1} 💎`;
  if (blueSoundBtn) blueSoundBtn.textContent = `🔊 ${cfg.center_blue_sound_name || 'Elegir sonido'}`;

  const activeTheme = (cfg.theme_style || 'GALACTIC').toUpperCase();
  document.querySelectorAll('.rbx-theme-btn').forEach(btn => {
    btn.classList.toggle('active', String(btn.getAttribute('data-theme')).toUpperCase() === activeTheme);
  });

  const winLabelInp = document.getElementById('rbx-win-label-input');
  const winThemeSel = document.getElementById('rbx-win-theme-select');
  const winSidesChk = document.getElementById('rbx-show-win-in-sides-check');
  if (winLabelInp) winLabelInp.value = cfg.win_label || 'WIN';
  if (winThemeSel) winThemeSel.value = (cfg.win_theme || 'AUTO').toUpperCase();
  if (winSidesChk) winSidesChk.checked = Boolean(cfg.show_win_in_sides);

  const setSlider = (sliderId, labelId, val, suffix) => {
    const s = document.getElementById(sliderId);
    const l = document.getElementById(labelId);
    if (s) s.value = val;
    if (l) l.textContent = `${val}${suffix}`;
  };
  setSlider('rbx-slider-icon-size', 'rbx-val-icon-size', cfg.icon_size ?? 48, 'px');
  setSlider('rbx-slider-text-size', 'rbx-val-text-size', cfg.text_size ?? 20, 'px');
  setSlider('rbx-slider-item-gap', 'rbx-val-item-gap', cfg.item_gap ?? 8, 'px');
  setSlider('rbx-slider-sharpness', 'rbx-val-sharpness', cfg.sharpness ?? 140, '%');
  setSlider('rbx-slider-win-scale', 'rbx-val-win-scale', cfg.win_scale ?? 100, '%');
  setSlider('rbx-slider-duel-scale', 'rbx-val-duel-scale', cfg.duel_scale ?? 100, '%');
  updateLocalSharpnessFilter(cfg.sharpness ?? 140);

  const likesCurrInput = document.getElementById('rbx-likes-current');
  const likesGoalInput = document.getElementById('rbx-likes-goal');
  const likesActionInput = document.getElementById('rbx-likes-action');
  if (likesCurrInput) likesCurrInput.value = cfg.likes_current ?? 25049;
  if (likesGoalInput) likesGoalInput.value = cfg.likes_goal ?? 30000;
  if (likesActionInput) likesActionInput.value = cfg.likes_action || '-1 WIN';

  const renderSlotRow = (slot, side, idx = 0, total = 1) => {
    const esSub = obtenerNombreEspanol(slot.gift_name);
    return `
    <div class="roblox-slot-row" data-slot-id="${slot.id}" data-side="${side}">
      <div style="display: flex; align-items: center; gap: 10px; min-width: 145px;">
        <img src="${giftUrl(slot.icon_file, slot.gift_name, slot.coins)}" class="roblox-slot-icon gift-hd-img" onerror="this.src='./gifts/rose-1-coins.webp'" />
        <div>
          <div style="font-weight: 800; font-size: 13px; color: #fff; line-height: 1.2;">${slot.gift_name}</div>
          ${esSub ? `<div style="font-size: 10px; color: #38bdf8; font-weight: 600;">🇪🇸 ${esSub}</div>` : ''}
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--color-gold);">${slot.coins} 💎</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
        <input type="text" class="table-input rbx-slot-label" data-id="${slot.id}" value="${slot.label}" style="width: 86px; text-align: center; font-weight: 800;" title="Etiqueta en el Overlay" />
        <select class="table-select rbx-slot-type" data-id="${slot.id}" style="width: 90px;" title="Tipo de Impacto">
          <option value="PTS" ${slot.action_type === 'PTS' ? 'selected' : ''}>⚡ Puntos</option>
          <option value="WIN" ${slot.action_type === 'WIN' ? 'selected' : ''}>🏆 Wins</option>
        </select>
        <select class="table-select rbx-slot-pos" data-id="${slot.id}" style="width: 96px;" title="Ubicación Visual en el Overlay">
          <option value="SIDE" ${!slot.is_bottom ? 'selected' : ''}>📐 Costado</option>
          <option value="BOTTOM" ${slot.is_bottom ? 'selected' : ''}>⚓ Base</option>
        </select>
        <input type="number" class="table-input rbx-slot-val" data-id="${slot.id}" value="${slot.value}" style="width: 64px; text-align: center;" title="Valor numérico (+ o -)" />
        <label style="font-size:10px;color:var(--text-muted);">s <input type="number" min="0" class="table-input rbx-slot-duration" data-id="${slot.id}" value="${slot.duration_seconds ?? 5}" style="width:48px;text-align:center;" title="Duración en segundos" /></label>
      </div>

      <div style="display: flex; gap: 5px; flex-wrap: wrap; justify-content: flex-end; align-items: center;">
        <div class="slot-reorder-group" style="display: inline-flex; align-items: center; gap: 2px; background: rgba(15,23,42,0.85); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 2px 4px; margin-right: 2px;" title="Reordenar posición">
          <button type="button" class="btn-micro btn-move-top-slot" data-slot-id="${slot.id}" title="Mover al primer lugar (inicio)" ${idx === 0 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : 'style="color:var(--galactk-cyan);font-weight:900;"'}>⤒</button>
          <button type="button" class="btn-micro btn-move-up-slot" data-slot-id="${slot.id}" title="Subir una posición" ${idx === 0 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>▲</button>
          <button type="button" class="btn-micro btn-move-down-slot" data-slot-id="${slot.id}" title="Bajar una posición" ${idx >= total - 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>▼</button>
          <button type="button" class="btn-micro btn-move-bottom-slot" data-slot-id="${slot.id}" title="Mover al final (abajo de todo)" ${idx >= total - 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>⤓</button>
        </div>
        <button type="button" class="btn-micro btn-change-roblox-gift" data-slot-id="${slot.id}">
          🔄 Regalo
        </button>
        <button type="button" class="btn-micro btn-sound-roblox-slot" data-slot-id="${slot.id}" style="color: var(--neon-cyan); border-color: rgba(0,240,255,0.4); max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="Elegir sonido del banco gratis">
          🔊 ${slot.sound_name || 'Elegir sonido'}
        </button>
        <button type="button" class="btn-micro btn-test-roblox-slot" data-slot-id="${slot.id}" title="Probar este regalo y su sonido en el overlay">
          ▶
        </button>
        <button type="button" class="btn-micro btn-duplicate-roblox-slot" data-slot-id="${slot.id}" title="Duplicar acción">📋</button>
        <button type="button" class="btn-micro btn-delete-roblox-slot" data-slot-id="${slot.id}" title="Eliminar acción" style="color:#ff6b8b;">🗑️</button>
      </div>
    </div>
  `;
};

  const query = (document.getElementById('obby-rule-search')?.value || '').toLowerCase();
  const filter = document.getElementById('obby-rule-filter')?.value || 'ALL';
  const matches = (rule, side) => `${rule.gift_name} ${rule.label}`.toLowerCase().includes(query) &&
    (filter === 'ALL' || filter === rule.action_type || (filter === side && rule.action_type === 'PTS'));
  const renderRuleCategories = (rules, side) => {
    rules = rules.filter(rule => matches(rule, side));
    if (!rules.length) return '<div class="empty-state"><img src="./galactk-logo.png" alt=""><span>No hay acciones con este filtro.</span><small>Añade un regalo o cambia la búsqueda.</small></div>';
    const sideColRules = rules.filter(r => !r.is_bottom);
    const bottomRules = rules.filter(r => Boolean(r.is_bottom));
    return `
      <div style="font-size:11px;font-weight:900;color:var(--color-gold);margin:5px 0 8px;">📐 COLUMNA COSTADO (VERTICAL) · ${sideColRules.length} REGALOS</div>
      ${sideColRules.map((s, idx) => renderSlotRow(s, side, idx, sideColRules.length)).join('')}
      <div style="font-size:11px;font-weight:900;color:#38bdf8;margin:12px 0 8px;">⚓ BASE INFERIOR (HORIZONTAL) · ${bottomRules.length} REGALOS</div>
      ${bottomRules.map((s, idx) => renderSlotRow(s, side, idx, bottomRules.length)).join('')}
    `;
  };
  robloxLeftList.innerHTML = renderRuleCategories(cfg.left_rules || [], 'LEFT');
  robloxRightList.innerHTML = renderRuleCategories(cfg.right_rules || [], 'RIGHT');
  const count = document.getElementById('obby-rule-count');
  if (count) count.textContent = `${(cfg.left_rules || []).length + (cfg.right_rules || []).length} acciones`;

  const syncSlotInputs = () => {
    const allSlots = [...app.robloxOverlayConfig.left_rules, ...app.robloxOverlayConfig.right_rules];
    document.querySelectorAll('.rbx-slot-label').forEach(inp => {
      const item = allSlots.find(x => x.id === inp.dataset.id);
      if (item) item.label = inp.value;
    });
    document.querySelectorAll('.rbx-slot-val').forEach(inp => {
      const item = allSlots.find(x => x.id === inp.dataset.id);
      if (item) item.value = Number(inp.value) || 0;
    });
    document.querySelectorAll('.rbx-slot-duration').forEach(inp => {
      const item = allSlots.find(x => x.id === inp.dataset.id);
      if (item) item.duration_seconds = Math.max(0, Number(inp.value ?? 5));
    });
  };

  document.querySelectorAll('.rbx-slot-label, .rbx-slot-val, .rbx-slot-duration').forEach(el => {
    el.addEventListener('change', async () => {
      syncSlotInputs();
      await app.persistConfig();
    });
  });

  document.querySelectorAll('.rbx-slot-type').forEach(sel => {
    sel.addEventListener('change', async () => {
      const allSlots = [...app.robloxOverlayConfig.left_rules, ...app.robloxOverlayConfig.right_rules];
      const item = allSlots.find(x => x.id === sel.dataset.id);
      if (!item) return;
      item.action_type = sel.value;
      renderRobloxEditor();
      await app.persistConfig();
    });
  });

  document.querySelectorAll('.rbx-slot-pos').forEach(sel => {
    sel.addEventListener('change', async () => {
      const allSlots = [...app.robloxOverlayConfig.left_rules, ...app.robloxOverlayConfig.right_rules];
      const item = allSlots.find(x => x.id === sel.dataset.id);
      if (!item) return;
      item.is_bottom = sel.value === 'BOTTOM';
      renderRobloxEditor();
      await app.persistConfig();
    });
  });

  document.querySelectorAll('#tab-roblox .btn-change-roblox-gift').forEach(btn => {
    btn.onclick = () => {
      const slotId = btn.getAttribute('data-slot-id');
      openGiftModalForRobloxSlot(slotId);
    };
  });

  document.querySelectorAll('#tab-roblox .btn-sound-roblox-slot').forEach(btn => {
    btn.onclick = () => {
      const slotId = btn.getAttribute('data-slot-id');
      let currentSound = null;
      if (slotId === 'CENTER_RED') {
        if (cfg.center_red_sound_name) {
          currentSound = { name: cfg.center_red_sound_name, url: cfg.center_red_sound_url || '' };
        }
      } else if (slotId === 'CENTER_BLUE') {
        if (cfg.center_blue_sound_name) {
          currentSound = { name: cfg.center_blue_sound_name, url: cfg.center_blue_sound_url || '' };
        }
      } else {
        const allSlots = [...(cfg.left_rules || []), ...(cfg.right_rules || [])];
        const slot = allSlots.find(x => x.id === slotId);
        if (slot && slot.sound_name) {
          currentSound = { name: slot.sound_name, url: slot.sound_url || '' };
        }
      }

      const picker = window.gz7S2EStudio?.openAudioPickerModal || openS2EAudioModal;
      picker(currentSound, async chosen => {
        if (slotId === 'CENTER_RED') {
          cfg.center_red_sound_name = chosen ? chosen.name : '';
          cfg.center_red_sound_url = chosen ? (chosen.url || '') : '';
          if (cfg.center_red_name) {
            soundManager.assignSoundToGift(cfg.center_red_name, cfg.center_red_sound_name, cfg.center_red_sound_url);
          }
        } else if (slotId === 'CENTER_BLUE') {
          cfg.center_blue_sound_name = chosen ? chosen.name : '';
          cfg.center_blue_sound_url = chosen ? (chosen.url || '') : '';
          if (cfg.center_blue_name) {
            soundManager.assignSoundToGift(cfg.center_blue_name, cfg.center_blue_sound_name, cfg.center_blue_sound_url);
          }
        } else {
          const allSlots = [...(cfg.left_rules || []), ...(cfg.right_rules || [])];
          const slot = allSlots.find(x => x.id === slotId);
          if (slot) {
            slot.sound_name = chosen ? chosen.name : '';
            slot.sound_url = chosen ? (chosen.url || '') : '';
            slot.sound_volume = 1.0;
            if (slot.gift_name) {
              soundManager.assignSoundToGift(slot.gift_name, slot.sound_name, slot.sound_url);
            }
          }
        }
        renderRobloxEditor();
        await app.persistConfig();
        showToast(chosen ? `🔊 Sonido "${chosen.name}" asignado a ${slotId}` : `🔇 Sonido quitado de ${slotId}`);
      });
    };
  });

  document.querySelectorAll('.btn-test-roblox-slot').forEach(btn => {
    btn.onclick = () => {
      const slotId = btn.getAttribute('data-slot-id');
      const allSlots = [...app.robloxOverlayConfig.left_rules, ...app.robloxOverlayConfig.right_rules];
      const slot = allSlots.find(x => x.id === slotId);
      if (slot) {
        app.handleGiftEvent({
          giftName: slot.gift_name,
          diamondCount: slot.coins,
          repeatCount: 1,
          nickname: 'GZ7_Tester',
          isLocalSimulation: true
        });
      }
    };
  });

  document.querySelectorAll('.btn-duplicate-roblox-slot').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.slotId;
      const isLeft = (cfg.left_rules || []).some(x => x.id === id);
      const source = [...(cfg.left_rules || []), ...(cfg.right_rules || [])].find(x => x.id === id);
      if (!source) return;
      const copy = { ...source, id: `${isLeft ? 'L' : 'R'}_${Date.now()}` };
      (isLeft ? cfg.left_rules : cfg.right_rules).push(copy);
      renderRobloxEditor();
      await app.persistConfig();
      showToast(`📋 Acción "${source.gift_name}" duplicada`);
    };
  });

  document.querySelectorAll('.btn-delete-roblox-slot').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.slotId;
      cfg.left_rules = (cfg.left_rules || []).filter(x => x.id !== id);
      cfg.right_rules = (cfg.right_rules || []).filter(x => x.id !== id);
      renderRobloxEditor();
      await app.persistConfig();
      showToast('🗑️ Acción eliminada');
    };
  });

  const moveSlot = async (slotId, direction) => {
    const isLeft = (cfg.left_rules || []).some(x => x.id === slotId);
    const sideKey = isLeft ? 'left_rules' : 'right_rules';
    const rules = cfg[sideKey] || [];
    const item = rules.find(x => x.id === slotId);
    if (!item) return;

    const isBottom = Boolean(item.is_bottom);
    const categoryRules = rules.filter(r => Boolean(r.is_bottom) === isBottom);
    const otherCategoryRules = rules.filter(r => Boolean(r.is_bottom) !== isBottom);

    const currIdx = categoryRules.findIndex(x => x.id === slotId);
    if (currIdx === -1) return;

    if (direction === 'top') {
      if (currIdx === 0) return;
      categoryRules.splice(currIdx, 1);
      categoryRules.unshift(item);
    } else if (direction === 'up') {
      if (currIdx === 0) return;
      const prev = categoryRules[currIdx - 1];
      categoryRules[currIdx - 1] = item;
      categoryRules[currIdx] = prev;
    } else if (direction === 'down') {
      if (currIdx >= categoryRules.length - 1) return;
      const next = categoryRules[currIdx + 1];
      categoryRules[currIdx + 1] = item;
      categoryRules[currIdx] = next;
    } else if (direction === 'bottom') {
      if (currIdx >= categoryRules.length - 1) return;
      categoryRules.splice(currIdx, 1);
      categoryRules.push(item);
    }

    const newSideRules = !isBottom ? categoryRules : otherCategoryRules;
    const newBottomRules = isBottom ? categoryRules : otherCategoryRules;
    cfg[sideKey] = [...newSideRules, ...newBottomRules];

    renderRobloxEditor();
    await app.persistConfig();
    const dirMap = {
      top: 'al primer lugar ⤒',
      up: 'una posición arriba ▲',
      down: 'una posición abajo ▼',
      bottom: 'al final ⤓'
    };
    showToast(`↕️ "${item.gift_name}" movido ${dirMap[direction] || ''}`);
  };

  document.querySelectorAll('.btn-move-top-slot').forEach(btn => {
    btn.onclick = () => moveSlot(btn.dataset.slotId, 'top');
  });
  document.querySelectorAll('.btn-move-up-slot').forEach(btn => {
    btn.onclick = () => moveSlot(btn.dataset.slotId, 'up');
  });
  document.querySelectorAll('.btn-move-down-slot').forEach(btn => {
    btn.onclick = () => moveSlot(btn.dataset.slotId, 'down');
  });
  document.querySelectorAll('.btn-move-bottom-slot').forEach(btn => {
    btn.onclick = () => moveSlot(btn.dataset.slotId, 'bottom');
  });
}

document.querySelectorAll('.btn-add-obby-action').forEach(btn => {
  btn.addEventListener('click', async () => {
    const kind = btn.dataset.kind;
    const isRight = kind === 'RIGHT';
    const isWins = kind === 'WINS';
    const id = `${isRight ? 'R' : 'L'}_${Date.now()}`;
    const rule = {
      id,
      gift_name: isRight ? 'Heart Me' : (isWins ? 'Bear with Rose' : 'Doughnut'),
      icon_file: isRight ? 'heart-me-1-coins.webp' : (isWins ? 'bear-with-rose-400-coins.webp' : 'doughnut-30-coins.webp'),
      coins: isRight ? 1 : (isWins ? 400 : 30),
      label: isWins ? '-1 WIN' : (isRight ? '+10 PTS' : '+30 PTS'),
      action_type: isWins ? 'WIN' : 'PTS',
      value: isWins ? -1 : (isRight ? 10 : 30),
      duration_seconds: 5,
      is_bottom: isWins,
      sound_name: '', sound_url: '', sound_volume: 1
    };
    (isRight ? app.robloxOverlayConfig.right_rules : app.robloxOverlayConfig.left_rules).push(rule);
    renderRobloxEditor();
    await app.persistConfig();
    openGiftModalForRobloxSlot(id);
  });
});

document.querySelectorAll('.rbx-theme-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const theme = btn.getAttribute('data-theme') || 'GALACTIC';
    app.robloxOverlayConfig.theme_style = theme;
    document.querySelectorAll('.rbx-theme-btn').forEach(b => b.classList.toggle('active', b === btn));
    await app.persistConfig();
    showToast(`🎨 Estilo visual activado en Overlays: ${theme}`);
  });
});

document.getElementById('rbx-win-label-input')?.addEventListener('input', (e) => {
  app.robloxOverlayConfig.win_label = (e.target.value || 'WIN').trim().toUpperCase() || 'WIN';
  app.syncRobloxOverlayToBackend();
});
document.getElementById('rbx-win-label-input')?.addEventListener('change', () => {
  app.persistConfig();
});
document.getElementById('rbx-win-theme-select')?.addEventListener('change', async (e) => {
  app.robloxOverlayConfig.win_theme = e.target.value || 'AUTO';
  await app.persistConfig();
  showToast(`🏆 Estilo del WIN actualizado: ${app.robloxOverlayConfig.win_theme}`);
});
document.getElementById('rbx-show-win-in-sides-check')?.addEventListener('change', async (e) => {
  app.robloxOverlayConfig.show_win_in_sides = Boolean(e.target.checked);
  await app.persistConfig();
});

const bindRobloxSlider = (sliderId, labelId, cfgKey, suffix) => {
  const el = document.getElementById(sliderId);
  const lbl = document.getElementById(labelId);
  if (!el) return;
  el.addEventListener('input', () => {
    const v = Number(el.value);
    if (lbl) lbl.textContent = `${v}${suffix}`;
    app.robloxOverlayConfig[cfgKey] = v;
    if (cfgKey === 'sharpness') updateLocalSharpnessFilter(v);
    app.syncRobloxOverlayToBackend();
  });
  el.addEventListener('change', () => {
    app.persistConfig();
  });
};

bindRobloxSlider('rbx-slider-icon-size', 'rbx-val-icon-size', 'icon_size', 'px');
bindRobloxSlider('rbx-slider-text-size', 'rbx-val-text-size', 'text_size', 'px');
bindRobloxSlider('rbx-slider-item-gap', 'rbx-val-item-gap', 'item_gap', 'px');
bindRobloxSlider('rbx-slider-sharpness', 'rbx-val-sharpness', 'sharpness', '%');
bindRobloxSlider('rbx-slider-win-scale', 'rbx-val-win-scale', 'win_scale', '%');
bindRobloxSlider('rbx-slider-duel-scale', 'rbx-val-duel-scale', 'duel_scale', '%');

document.getElementById('btn-save-target-wins')?.addEventListener('click', async () => {
  app.robloxOverlayConfig.target_wins = Math.max(1, Number(targetWinsInput.value) || 10);
  await app.persistConfig();
  showToast(`✔ Meta de WINS fijada en ${app.robloxOverlayConfig.target_wins}`);
});

async function applyImportedObbyConfig(source) {
  const imported = parseObbyConfigImport(source);
  app.robloxOverlayConfig = imported;
  renderRobloxEditor();
  await app.persistConfig();
  showToast(`📥 Perfil Obby importado: ${(imported.left_rules?.length || 0) + (imported.right_rules?.length || 0)} acciones`);
}

document.getElementById('btn-export-obby-json')?.addEventListener('click', () => {
  const payload = {
    format: 'galactic-live-obby-v3',
    exported_at: new Date().toISOString(),
    robloxOverlayConfig: app.robloxOverlayConfig
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'galactic-obby-config.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('📤 Configuración Obby exportada');
});

const obbyJsonFile = document.getElementById('obby-json-file');
document.getElementById('btn-import-obby-json')?.addEventListener('click', () => obbyJsonFile?.click());
obbyJsonFile?.addEventListener('change', async () => {
  const file = obbyJsonFile.files?.[0];
  if (!file) return;
  try { await applyImportedObbyConfig(await file.text()); }
  catch (err) { showToast(`⚠️ No se pudo importar: ${err.message}`); }
  obbyJsonFile.value = '';
});
document.getElementById('btn-import-obby-code')?.addEventListener('click', async () => {
  const code = document.getElementById('obby-profile-code')?.value || '';
  if (!code.trim()) return showToast('⚠️ Pega primero un JSON o Código de Perfil');
  try { await applyImportedObbyConfig(code); }
  catch (err) { showToast(`⚠️ No se pudo importar: ${err.message}`); }
});

document.getElementById('btn-save-roblox-overlay')?.addEventListener('click', async () => {
  await app.persistConfig();
  showToast('✔ ¡Overlays 720:1080 y Gift vs Gift actualizados en vivo en OBS!');
});

document.getElementById('btn-load-official-gvg')?.addEventListener('click', async () => {
  const { DEFAULT_ROBLOX_CONFIG } = await import('./obby-config.js');
  app.robloxOverlayConfig = JSON.parse(JSON.stringify(DEFAULT_ROBLOX_CONFIG));
  renderRobloxEditor();
  await app.persistConfig();
  showToast('⭐ ¡Configuración Oficial 1:1 (Imagen Duelo) cargada con éxito!');
});

document.getElementById('btn-save-likes-goal')?.addEventListener('click', async () => {
  const cfg = app.robloxOverlayConfig;
  cfg.likes_current = Math.max(0, Number(document.getElementById('rbx-likes-current')?.value) || 0);
  cfg.likes_goal = Math.max(1, Number(document.getElementById('rbx-likes-goal')?.value) || 30000);
  cfg.likes_action = (document.getElementById('rbx-likes-action')?.value || '-1 WIN').trim();
  await app.persistConfig();
  showToast(`✔ Meta de Likes guardada: ${cfg.likes_action} - ${cfg.likes_current.toLocaleString()} / ${cfg.likes_goal.toLocaleString()}`);
});

document.getElementById('btn-reset-roblox-overlay')?.addEventListener('click', async () => {
  const { DEFAULT_ROBLOX_CONFIG } = await import('./obby-config.js');
  app.robloxOverlayConfig = JSON.parse(JSON.stringify(DEFAULT_ROBLOX_CONFIG));
  renderRobloxEditor();
  await app.persistConfig();
  showToast('✔ Configuración original restaurada');
});

document.querySelectorAll('.btn-gvg-action').forEach(btn => {
  btn.addEventListener('click', async () => {
    const act = btn.getAttribute('data-action');
    if (act === 'add_win') await sendGvgControl({ action: 'add_wins', value: 1 }, true);
    if (act === 'sub_win') await sendGvgControl({ action: 'add_wins', value: -1 }, true);
    if (act === 'reset_wins') await sendGvgControl({ action: 'reset_wins' }, true);
    if (act === 'reset_ronda') await sendGvgControl({ action: 'reset_points' }, true);
    showToast(`🎮 Acción ejecutada en Overlay Roblox: ${btn.textContent.trim()}`);
  });
});

document.getElementById('btn-test-roblox-red')?.addEventListener('click', async () => {
  const cfg = app.robloxOverlayConfig;
  if (cfg.center_red_sound_url) {
    soundManager.playUrl(cfg.center_red_sound_url, 1.0, cfg.center_red_sound_name || 'center_red');
  } else if (cfg.center_red_sound_name) {
    soundManager.playSound(cfg.center_red_sound_name, 100);
  } else {
    soundManager.playForGift(cfg.center_red_name || 'Rose');
  }
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  if (invoke) await invoke('add_gvg_points', { team: 'RED', points: 10 });
  showToast(`🌹 +10 Puntos enviados a ${cfg.center_red_name || 'Rojo'}`);
});

document.getElementById('btn-test-roblox-blue')?.addEventListener('click', async () => {
  const cfg = app.robloxOverlayConfig;
  if (cfg.center_blue_sound_url) {
    soundManager.playUrl(cfg.center_blue_sound_url, 1.0, cfg.center_blue_sound_name || 'center_blue');
  } else if (cfg.center_blue_sound_name) {
    soundManager.playSound(cfg.center_blue_sound_name, 100);
  } else {
    soundManager.playForGift(cfg.center_blue_name || 'GG');
  }
  const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
  if (invoke) await invoke('add_gvg_points', { team: 'BLUE', points: 10 });
  showToast(`🎮 +10 Puntos enviados a ${cfg.center_blue_name || 'Azul'}`);
});

// -----------------------------------------------------------------
// CONTROL MANUAL EN VIVO DESDE DASHBOARD (RESPALDO & PRUEBAS)
// -----------------------------------------------------------------
async function triggerDashboardManualGift(side, coins = 1, giftName = null) {
  const cfg = app.robloxOverlayConfig;
  const gName = giftName || (side === 'LEFT' ? (cfg.center_red_name || 'Rose') : (cfg.center_blue_name || 'GG'));
  const effectiveCoins = Math.max(1, Number(coins) || 1);

  // Reproducir sonido de slot
  if (side === 'LEFT') {
    if (cfg.center_red_sound_url) soundManager.playUrl(cfg.center_red_sound_url, 1.0, cfg.center_red_sound_name || gName);
    else if (cfg.center_red_sound_name) soundManager.playSound(cfg.center_red_sound_name, 100);
    else soundManager.playForGift(gName, effectiveCoins, 'MALOS');
  } else if (side === 'RIGHT') {
    if (cfg.center_blue_sound_url) soundManager.playUrl(cfg.center_blue_sound_url, 1.0, cfg.center_blue_sound_name || gName);
    else if (cfg.center_blue_sound_name) soundManager.playSound(cfg.center_blue_sound_name, 100);
    else soundManager.playForGift(gName, effectiveCoins, 'BUENOS');
  }

  if (side === 'LEFT') await sendGvgControl({ action: 'add_points', team: 'RED', value: effectiveCoins }, true);
  else if (side === 'RIGHT') await sendGvgControl({ action: 'add_points', team: 'BLUE', value: effectiveCoins }, true);
  else if (side === 'RESET') await sendGvgControl({ action: 'reset_points' }, true);

  if (side === 'RESET') showToast('🔄 Duelo reiniciado (0 - 0) en Overlays');
  else showToast(`⚡ Inyectado a Overlay: +${effectiveCoins} ${gName} (${side === 'LEFT' ? 'Bando Rojo' : 'Bando Azul'})`);
}

const gvgInputs = {
  red: document.getElementById('gvg-red-points'), blue: document.getElementById('gvg-blue-points'),
  wins: document.getElementById('gvg-current-wins'), target: document.getElementById('gvg-target-wins'),
  goal: document.getElementById('gvg-goal-action'), columns: document.getElementById('gvg-show-columns')
};
async function sendGvgControl(payload, quiet = false) {
  try {
    const res = await fetch('http://127.0.0.1:4000/api/gvg/control', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Error de control');
    document.getElementById('gvg-live-status').textContent = '🟢 SINCRONIZADO POR SSE';
    if (!quiet) showToast('✅ Overlay Gift vs Gift actualizado en vivo');
  } catch (err) {
    document.getElementById('gvg-live-status').textContent = '🔴 SERVIDOR LOCAL DESCONECTADO';
    showToast(`⚠️ ${err.message}`);
  }
}
document.getElementById('btn-gvg-copy-url')?.addEventListener('click', event => copyLink(document.getElementById('gvg-overlay-url').value, event.currentTarget));
document.getElementById('btn-gvg-open-overlay')?.addEventListener('click', () => window.open(document.getElementById('gvg-overlay-url').value, '_blank'));
document.getElementById('btn-gvg-reset-points')?.addEventListener('click', () => sendGvgControl({ action: 'reset_points' }));
document.getElementById('btn-gvg-reset-wins')?.addEventListener('click', () => sendGvgControl({ action: 'reset_wins' }));
document.querySelectorAll('.gvg-point-delta').forEach(btn => btn.addEventListener('click', () => sendGvgControl({ action: 'add_points', team: btn.dataset.team, value: Number(btn.dataset.delta) })));
document.querySelectorAll('.gvg-win-delta').forEach(btn => btn.addEventListener('click', () => sendGvgControl({ action: 'add_wins', value: Number(btn.dataset.delta) })));
gvgInputs.red?.addEventListener('change', () => sendGvgControl({ action: 'set_points', team: 'RED', value: Number(gvgInputs.red.value) }));
gvgInputs.blue?.addEventListener('change', () => sendGvgControl({ action: 'set_points', team: 'BLUE', value: Number(gvgInputs.blue.value) }));
gvgInputs.wins?.addEventListener('change', () => sendGvgControl({ action: 'set_wins', value: Number(gvgInputs.wins.value) }));
gvgInputs.target?.addEventListener('change', () => sendGvgControl({ action: 'set_target', value: Number(gvgInputs.target.value) }));
gvgInputs.goal?.addEventListener('change', async () => { app.robloxOverlayConfig.goal_action = gvgInputs.goal.value; await app.persistConfig(); sendGvgControl({ action: 'set_goal_action', goal_action: gvgInputs.goal.value }, true); });
gvgInputs.columns?.addEventListener('change', async () => { app.robloxOverlayConfig.show_side_columns = gvgInputs.columns.checked; await app.persistConfig(); sendGvgControl({ action: 'set_side_columns', visible: gvgInputs.columns.checked }, true); });
function syncGvgControlInputs(gvg) {
  if (!gvg) return;
  const redInp = document.getElementById('gvg-red-points') || gvgInputs.red;
  const blueInp = document.getElementById('gvg-blue-points') || gvgInputs.blue;
  const winsInp = document.getElementById('gvg-current-wins') || gvgInputs.wins;
  const targetInp = document.getElementById('gvg-target-wins') || gvgInputs.target;
  const goalInp = document.getElementById('gvg-goal-action') || gvgInputs.goal;
  const colsInp = document.getElementById('gvg-show-columns') || gvgInputs.columns;

  if (redInp && document.activeElement !== redInp) redInp.value = gvg.red_points ?? 0;
  if (blueInp && document.activeElement !== blueInp) blueInp.value = gvg.blue_points ?? 0;
  if (winsInp && document.activeElement !== winsInp) {
    winsInp.value = gvg.wins ?? 0;
    winsInp.classList.toggle('wins-negative', Number(gvg.wins) < 0);
  }
  if (targetInp && document.activeElement !== targetInp) targetInp.value = gvg.target_wins ?? 10;
  if (goalInp) goalInp.value = gvg.goal_action || 'INCREASE_TARGET';
  if (colsInp) colsInp.checked = gvg.show_side_columns !== false;
}
overlayEvents.subscribe(payload => syncGvgControlInputs(payload.gift_vs_gift));

document.getElementById('btn-manual-rose-left')?.addEventListener('click', () => {
  const cfg = app.robloxOverlayConfig;
  triggerDashboardManualGift('LEFT', cfg.center_red_coins || 1, cfg.center_red_name || 'Rose');
});

document.getElementById('btn-manual-gg-right')?.addEventListener('click', () => {
  const cfg = app.robloxOverlayConfig;
  triggerDashboardManualGift('RIGHT', cfg.center_blue_coins || 1, cfg.center_blue_name || 'GG');
});

document.getElementById('btn-manual-plus10-left')?.addEventListener('click', () => {
  const cfg = app.robloxOverlayConfig;
  triggerDashboardManualGift('LEFT', 10, cfg.center_red_name || 'Rose');
});

document.getElementById('btn-manual-plus10-right')?.addEventListener('click', () => {
  const cfg = app.robloxOverlayConfig;
  triggerDashboardManualGift('RIGHT', 10, cfg.center_blue_name || 'GG');
});

document.getElementById('btn-manual-reset-duel')?.addEventListener('click', () => {
  triggerDashboardManualGift('RESET', 0);
});


enhanceObbyWorkspace({ app, render: renderRobloxEditor });
renderRobloxEditor();
return { render: renderRobloxEditor };
}
