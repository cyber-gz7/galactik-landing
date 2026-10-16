import { showToast } from '../core/toast.js';
import { createLinkHub } from '../core/shell.js';
export function initSoundboard({ app, soundManager, giftRegistry, giftUrl, renderWaveformSvg, renderRobloxEditor, renderGiftsTable, syncGiftWithActivePreset }) {
const pane = document.getElementById('tab-sounds');
if (pane) {
  const intro = document.createElement('div'); intro.className = 'module-hero';
  intro.innerHTML = '<span class="eyebrow">EL SONIDO DE TU STREAM</span><h1>Soundboard <span class="module-badge">BETA</span></h1><p>Busca, escucha y asigna un audio a los momentos de tu comunidad.</p><label class="rcon-command-bar">Reproducir en <select id="sound-output" class="table-select"><option value="local">Este equipo</option><option value="overlay">Overlay de alertas</option></select></label>';
  pane.prepend(createLinkHub('http://127.0.0.1:4000/alerta.html', 'Audio en tu escena'));
  pane.prepend(intro);
}
let currentSoundFilter = 'todos';

function openAssignSoundTargetModal(soundObj) {
  const targetModal = document.getElementById('modal-assign-sound-target');
  if (!targetModal || !soundObj) return;
  const sub = document.getElementById('assign-sound-target-subtitle') || document.getElementById('assign-sound-target-title');
  if (sub) sub.textContent = `🔊 Sonido: "${soundObj.name}" (${soundObj.durationFormatted || soundObj.durationLabel || '00:02'})`;

  const obbyList = document.getElementById('assign-target-obby-list');
  const mcList = document.getElementById('assign-target-mc-list');
  const cfg = app.robloxOverlayConfig;

  const obbyItems = [
    { id: 'CENTER_RED', title: 'Duelo Central ROJO', giftName: cfg.center_red_name || 'Rose', coins: cfg.center_red_coins || 1, icon: cfg.center_red_icon, curSound: cfg.center_red_sound_name },
    { id: 'CENTER_BLUE', title: 'Duelo Central AZUL', giftName: cfg.center_blue_name || 'GG', coins: cfg.center_blue_coins || 1, icon: cfg.center_blue_icon, curSound: cfg.center_blue_sound_name },
    ...(cfg.left_rules || []).map(r => ({ id: r.id, title: `Izquierda ${r.id} (${r.label})`, giftName: r.gift_name, coins: r.coins, icon: r.icon_file, curSound: r.sound_name })),
    ...(cfg.right_rules || []).map(r => ({ id: r.id, title: `Derecha ${r.id} (${r.label})`, giftName: r.gift_name, coins: r.coins, icon: r.icon_file, curSound: r.sound_name }))
  ];

  obbyList.innerHTML = obbyItems.map(item => `
    <button type="button" class="btn-secondary btn-assign-obby-slot" data-slot="${item.id}" style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:7px 10px; font-size:12px;">
      <span style="display:flex; align-items:center; gap:8px;">
        <img src="${giftUrl(item.icon, item.giftName, item.coins)}" style="width:22px; height:22px; object-fit:contain;" onerror="this.src='./gifts/rose-1-coins.webp'" />
        <span><strong>${item.title}:</strong> ${item.giftName}</span>
      </span>
      <span style="font-size:10px; color:var(--neon-cyan);">${item.curSound ? '🔊 ' + item.curSound : 'Asignar'}</span>
    </button>
  `).join('');

  const mcGifts = giftRegistry.getAll();
  mcList.innerHTML = mcGifts.map((g, idx) => {
    const curSnd = g.audioName || soundManager.getSoundForGift(g.name) || '';
    return `
      <button type="button" class="btn-secondary btn-assign-mc-gift" data-idx="${idx}" style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:7px 10px; font-size:12px;">
        <span style="display:flex; align-items:center; gap:8px;">
          <img src="${giftUrl(g.icon_file, g.name, g.coins)}" style="width:22px; height:22px; object-fit:contain;" onerror="this.src='./gifts/rose-1-coins.webp'" />
          <span><strong>${g.name}</strong> (${g.coins} 💎)</span>
        </span>
        <span style="font-size:10px; color:#22c55e;">${curSnd ? '🔊 ' + curSnd : 'Asignar'}</span>
      </button>
    `;
  }).join('');

  obbyList.querySelectorAll('.btn-assign-obby-slot').forEach(btn => {
    btn.onclick = async () => {
      const slotId = btn.getAttribute('data-slot');
      const sUrl = soundObj.url || '';
      if (slotId === 'CENTER_RED') {
        cfg.center_red_sound_name = soundObj.name;
        cfg.center_red_sound_url = sUrl;
        soundManager.assignSoundToGift(cfg.center_red_name || 'Rose', soundObj.name, sUrl);
      } else if (slotId === 'CENTER_BLUE') {
        cfg.center_blue_sound_name = soundObj.name;
        cfg.center_blue_sound_url = sUrl;
        soundManager.assignSoundToGift(cfg.center_blue_name || 'GG', soundObj.name, sUrl);
      } else {
        const allSlots = [...(cfg.left_rules || []), ...(cfg.right_rules || [])];
        const slot = allSlots.find(x => x.id === slotId);
        if (slot) {
          slot.sound_name = soundObj.name;
          slot.sound_url = sUrl;
          slot.sound_volume = 1.0;
          soundManager.assignSoundToGift(slot.gift_name, soundObj.name, sUrl);
        }
      }
      renderRobloxEditor();
      await app.persistConfig();
      targetModal.style.display = 'none';
      showToast(`🔊 "${soundObj.name}" asignado a ${slotId} en OBBY`);
    };
  });

  mcList.querySelectorAll('.btn-assign-mc-gift').forEach(btn => {
    btn.onclick = async () => {
      const idx = Number(btn.getAttribute('data-idx'));
      const list = giftRegistry.getAll();
      const g = list[idx];
      if (g) {
        g.audioName = soundObj.name;
        g.audioUrl = soundObj.url || '';
        soundManager.assignSoundToGift(g.name, soundObj.name, soundObj.url || '');
        giftRegistry.setAll(list);
        syncGiftWithActivePreset(g);
        renderGiftsTable();
        await app.persistConfig();
        targetModal.style.display = 'none';
        showToast(`🔊 "${soundObj.name}" asignado a "${g.name}" en Minecraft`);
      }
    };
  });

  targetModal.style.display = 'flex';
}

document.getElementById('btn-close-assign-sound-target')?.addEventListener('click', () => {
  document.getElementById('modal-assign-sound-target').style.display = 'none';
});

function renderSoundboard() {
  const container = document.getElementById('soundboard-grid-container');
  if (!container) return;
  const q = (document.getElementById('soundboard-search-input')?.value || '').trim().toLowerCase();
  let sounds = soundManager.getAllSounds();

  if (currentSoundFilter === 's2e') {
    sounds = sounds.filter(s => s.isS2E);
  } else if (currentSoundFilter === 'synth') {
    sounds = sounds.filter(s => s.isSynth);
  } else if (currentSoundFilter === 'custom') {
    sounds = sounds.filter(s => s.isCustom);
  } else if (currentSoundFilter === 'memes' || currentSoundFilter === 'musica' || currentSoundFilter === 'alertas') {
    sounds = sounds.filter(s => s.category === currentSoundFilter);
  } else if (currentSoundFilter === 'corto' || currentSoundFilter === 'largo') {
    sounds = sounds.filter(s => s.durationType === currentSoundFilter);
  }

  if (q) {
    sounds = sounds.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (Array.isArray(s.tags) && s.tags.some(t => String(t).toLowerCase().includes(q))) ||
      String(s.category || '').toLowerCase().includes(q)
    );
  }

  const countBadge = document.getElementById('soundboard-count-badge');
  if (countBadge) countBadge.textContent = `${sounds.length} sonidos disponibles`;

  const activeId = soundManager.activePlayingId;

  container.innerHTML = sounds.map(s => {
    const isPlaying = activeId && (activeId === s.id || activeId === s.name);
    const sourceBadge = s.isSynth ? '⚡ SINTETIZADO' : (s.isCustom ? '📂 CUSTOM' : '🎵 S2E GRATIS');
    const tagsHtml = Array.isArray(s.tags) && s.tags.length
      ? `<div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:4px;">${s.tags.slice(0, 3).map(t => `<span style="font-size:10px; padding:1px 6px; border-radius:99px; background:rgba(0,240,255,0.09); color:#94a3b8;">#${t}</span>`).join('')}</div>`
      : '';
    return `
      <div class="sound-card" data-card-sid="${s.id}" style="${isPlaying ? 'border-color: var(--neon-cyan); box-shadow: 0 0 18px rgba(0,240,255,0.28);' : ''}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="btn-micro" style="font-family: var(--font-mono);">${s.durationFormatted || s.durationLabel || '00:02'}</span>
            <span style="font-size: 10px; color: var(--neon-cyan); font-weight: 800;">${sourceBadge}</span>
          </div>
          <div style="font-weight: 800; font-size: 14px; color: #fff; margin-top: 4px; word-break: break-word;">${s.name}</div>
          ${tagsHtml}
          <div class="sound-waveform-slot" style="margin: 8px 0 4px;">
            ${renderWaveformSvg(s.id || s.name, isPlaying)}
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button type="button" class="${isPlaying ? 'btn-danger' : 'btn-primary'} btn-play-sound" data-sid="${s.id}" style="flex: 1; padding: 7px 10px; font-size: 12px;">
            ${isPlaying ? '⏹ Parar' : '▶ Probar'}
          </button>
          <button type="button" class="btn-secondary btn-assign-sound-selected" data-sid="${s.id}" style="padding: 7px 10px; font-size: 12px;" title="Asignar a un regalo de OBBY o Minecraft">
            🎁 Asignar
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-play-sound').forEach(btn => {
    btn.addEventListener('click', () => {
      const sid = btn.getAttribute('data-sid');
      if (document.getElementById('sound-output').value === 'overlay') {
        const sound = soundManager.resolveSound(sid);
        const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
        if (!invoke || !sound?.url) return showToast('La salida a overlay requiere la app y un audio con archivo.');
        invoke('emit_custom_alert', { alert_json: JSON.stringify({ audioOnly:true, audioUrl:sound.url, audioVolume:Math.round(soundManager.masterVolume * 100), duration:30 }) }).catch(error => showToast(`No se pudo reproducir: ${error}`));
      } else soundManager.toggleSound(sid);
    });
  });

  container.querySelectorAll('.btn-assign-sound-selected').forEach(btn => {
    btn.addEventListener('click', () => {
      const sid = btn.getAttribute('data-sid');
      const sObj = soundManager.resolveSound(sid);
      if (sObj) openAssignSoundTargetModal(sObj);
    });
  });
}

soundManager.onPlaybackChange(() => {
  const tabSounds = document.getElementById('tab-sounds');
  if (tabSounds && tabSounds.classList.contains('active')) {
    renderSoundboard();
  }
});

document.getElementById('soundboard-search-input')?.addEventListener('input', renderSoundboard);
document.getElementById('btn-stop-all-sounds')?.addEventListener('click', () => {
  soundManager.stopAll();
  showToast('⏹ Reproducción de sonidos detenida');
});

document.querySelectorAll('#sound-filter-pills button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSoundFilter = btn.getAttribute('data-sfilter');
    document.querySelectorAll('#sound-filter-pills button').forEach(b => {
      const isAct = b === btn;
      b.style.borderColor = isAct ? 'var(--neon-cyan)' : '';
      b.style.color = isAct ? 'var(--neon-cyan)' : '';
    });
    renderSoundboard();
  });
});

document.getElementById('custom-sound-file')?.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('custom-sound-url').value = reader.result;
    if (!document.getElementById('custom-sound-name').value) {
      document.getElementById('custom-sound-name').value = file.name.replace(/\.[^.]+$/, '');
    }
    showToast(`📂 Audio cargado: ${file.name}`);
  };
  reader.readAsDataURL(file);
});

document.getElementById('btn-add-custom-sound')?.addEventListener('click', () => {
  const name = document.getElementById('custom-sound-name').value.trim();
  const category = document.getElementById('custom-sound-cat').value;
  const durationType = document.getElementById('custom-sound-dur').value;
  const url = document.getElementById('custom-sound-url').value.trim();
  if (!name) {
    showToast('⚠️ Escribe un nombre para el sonido');
    return;
  }
  soundManager.addOrUpdateSound({ name, category, durationType, url });
  document.getElementById('custom-sound-name').value = '';
  document.getElementById('custom-sound-url').value = '';
  renderSoundboard();
  showToast(`✔ Sonido "${name}" guardado en tu biblioteca`);
});

document.getElementById('sound-master-vol')?.addEventListener('input', e => {
  const val = Number(e.target.value);
  soundManager.masterVolume = val / 100;
  const lbl = document.getElementById('sound-master-vol-label');
  if (lbl) lbl.textContent = `${val}%`;
});


renderSoundboard();
return { render: renderSoundboard };
}
