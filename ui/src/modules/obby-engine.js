import { giftsEquivalentes } from '../gifts.js';
import { soundManager } from '../sounds.js';

export async function handleRobloxGiftVsGift(giftName, coins, repeatCount, donor = '', giftId = 0, isLocalSimulation = false) {
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
    const allRules = [
      ...(this.robloxOverlayConfig.left_rules || []).map(r => ({ ...r, side: 'RED' })),
      ...(this.robloxOverlayConfig.right_rules || []).map(r => ({ ...r, side: 'BLUE' }))
    ];

    const matchedRule = allRules.find(r => giftsEquivalentes(r.gift_name, giftName, giftId, r.tiktokGiftId));
    const centerRed = String(this.robloxOverlayConfig.center_red_name || 'Rose').trim();
    const centerBlue = String(this.robloxOverlayConfig.center_blue_name || 'GG').trim();
    const matchesCenterRed = Boolean(centerRed && giftsEquivalentes(centerRed, giftName, giftId));
    const matchesCenterBlue = Boolean(centerBlue && giftsEquivalentes(centerBlue, giftName, giftId));

    let soundPlayed = false;
    const playSlotAudio = (sUrl, sName, sVol = 1.0, fallbackFaction = 'BUENOS') => {
      const volPct = Math.round((Number(sVol) || 1) * 100);
      if (sUrl) {
        soundManager.playUrl(sUrl, { volume: volPct, repeatCount });
        return true;
      }
      if (sName) {
        soundManager.playSound(sName, volPct);
        return true;
      }
      if (this.activeProfile === 'roblox') {
        soundManager.playForGift(giftName, coins, fallbackFaction);
        return true;
      }
      return false;
    };

    // 1. PRIORIDAD: REGALOS CENTRALES DEL DUELO (Rosa vs GG) -> Suman exactamente +1 punto por moneda
    if (matchesCenterRed) {
      soundPlayed = playSlotAudio(
        this.robloxOverlayConfig.center_red_sound_url,
        this.robloxOverlayConfig.center_red_sound_name,
        1.0,
        'MALOS'
      );
      if (isLocalSimulation && invoke) {
        const pts = Math.max(1, Number(this.robloxOverlayConfig.center_red_coins) || 1) * repeatCount;
        await invoke('add_gvg_points', { team: 'RED', points: pts });
      }
      return soundPlayed;
    }

    if (matchesCenterBlue) {
      soundPlayed = playSlotAudio(
        this.robloxOverlayConfig.center_blue_sound_url,
        this.robloxOverlayConfig.center_blue_sound_name,
        1.0,
        'BUENOS'
      );
      if (isLocalSimulation && invoke) {
        const pts = Math.max(1, Number(this.robloxOverlayConfig.center_blue_coins) || 1) * repeatCount;
        await invoke('add_gvg_points', { team: 'BLUE', points: pts });
      }
      return soundPlayed;
    }

    // 2. REGLAS LATERALES (Héroes y Villanos)
    if (matchedRule) {
      const fallbackUrl = matchesCenterRed
        ? this.robloxOverlayConfig.center_red_sound_url
        : (matchesCenterBlue ? this.robloxOverlayConfig.center_blue_sound_url : '');
      const fallbackName = matchesCenterRed
        ? this.robloxOverlayConfig.center_red_sound_name
        : (matchesCenterBlue ? this.robloxOverlayConfig.center_blue_sound_name : '');

      soundPlayed = playSlotAudio(
        matchedRule.sound_url || fallbackUrl,
        matchedRule.sound_name || fallbackName,
        matchedRule.sound_volume ?? 1.0,
        matchedRule.side === 'RED' ? 'MALOS' : 'BUENOS'
      );
      if (isLocalSimulation && invoke) {
        const val = Number(matchedRule.value) || 0;
        if (String(matchedRule.action_type).toUpperCase() === 'WIN') {
          await invoke('modify_gvg_win', { delta: val * repeatCount });
        } else {
          const pts = Math.max(1, Math.abs(val)) * repeatCount;
          await invoke('add_gvg_points', {
            team: matchedRule.side === 'RED' ? 'RED' : 'BLUE',
            points: pts
          });
        }
      }
      return soundPlayed;
    }

    return false;
  }

