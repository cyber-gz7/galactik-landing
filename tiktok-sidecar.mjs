import net from 'node:net';

// Servidor de firma dual con Failover automático:
// Primario: Servidor dedicado S2E (100% libre, sin registro, sin cuotas)
// Secundario: EulerStream (Oficial / con o sin API key)
if (!process.env.SIGN_API_URL) {
  process.env.SIGN_API_URL = 'https://api.streamtoearn.io/apiserver/tiktok-signature';
}

const { TikTokLiveConnection } = await import('tiktok-live-connector');

const rawUser = process.argv[2] || '';
const apiKeyArg = process.argv[3] || process.env.SIGN_API_KEY || process.env.EULER_API_KEY || '';
const cleanApiKey = String(apiKeyArg).trim();

const cleanUser = (() => {
  let s = String(rawUser).trim();
  const urlMatch = s.match(/tiktok\.com\/@([^/?#\s]+)/i);
  if (urlMatch) {
    s = urlMatch[1];
  }
  return s
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@/i, '')
    .split(/[/?#\s]/)[0]
    .replace(/^@+/, '')
    .toLowerCase()
    .trim();
})();

if (!cleanUser) {
  process.exit(0);
}

const GIFT_ID_CATALOG = {
  5655: { name: 'Rose', coins: 1 },
  6064: { name: 'GG', coins: 1 },
  6093: { name: 'GG', coins: 1 },
  7214: { name: 'GG', coins: 1 },
  7934: { name: 'Heart Me', coins: 1 },
  5585: { name: 'Heart', coins: 1 },
  5879: { name: 'Doughnut', coins: 30 },
  5827: { name: 'Ice Cream Cone', coins: 1 },
  15232: { name: "You're awesome", coins: 1 },
  5487: { name: 'Finger Heart', coins: 5 },
  5658: { name: 'TikTok', coins: 1 }
};

// Control de instancia y comando de cambio de sala para evitar colisiones
const singleInstanceServer = net.createServer((sock) => {
  sock.on('data', (buf) => {
    try {
      const msg = JSON.parse(buf.toString('utf8'));
      if (msg.cmd === 'switch' && msg.user && msg.user !== cleanUser) {
        // Ceder el paso a la nueva sesión
        process.exit(0);
      }
    } catch (_) {}
  });
});
singleInstanceServer.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Si ya hay un sidecar corriendo, le enviamos aviso para que actualice o ceda el paso
    try {
      const client = net.createConnection({ port: 21219, host: '127.0.0.1' }, () => {
        client.write(JSON.stringify({ cmd: 'switch', user: cleanUser }));
        client.end();
      });
      client.on('error', () => {});
    } catch (_) {}
    process.exit(0);
  }
});
singleInstanceServer.listen(21219, '127.0.0.1');

function postEvent(event, data) {
  try {
    const bodyBuf = Buffer.from(JSON.stringify({ event, data }), 'utf8');
    const headerStr =
      'POST /api/tiktok-webhook HTTP/1.1\r\n' +
      'Host: 127.0.0.1:4000\r\n' +
      'Content-Type: application/json; charset=utf-8\r\n' +
      `Content-Length: ${bodyBuf.length}\r\n` +
      'Connection: close\r\n\r\n';
    const packet = Buffer.concat([Buffer.from(headerStr, 'utf8'), bodyBuf]);

    const sock = net.createConnection({ host: '127.0.0.1', port: 4000 }, () => {
      sock.setNoDelay(true);
      sock.end(packet);
    });
    sock.setTimeout(1200);
    sock.on('timeout', () => {
      sock.destroy();
    });
    sock.on('error', () => {});
  } catch (_) {}
}

function extractUser(data) {
  const u = data?.user || {};
  const uniqueId = u.displayId || u.uniqueId || data?.uniqueId || 'viewer';
  const nickname = u.nickname || data?.nickname || uniqueId || 'Viewer';
  const userId = String(u.idStr || u.id || u.userId || data?.userId || uniqueId);
  const avatarUrls =
    u.avatarLarge?.urlList ||
    u.profilePicture?.url ||
    u.profilePicture?.urlList ||
    [];
  const profilePictureUrl =
    data?.profilePictureUrl ||
    (Array.isArray(avatarUrls) && avatarUrls.length > 0 ? avatarUrls[0] : '');
  return { userId, uniqueId, nickname, profilePictureUrl };
}

const activeStreaks = new Map();
const closedStreaks = new Map();
const seenMsgIds = new Set();

function resolveGiftPayload(data) {
  const gift = data?.gift || {};
  const det = data?.giftDetails || {};
  const ext = data?.extendedGiftInfo || {};
  const giftId = Number(data?.giftId ?? gift.id ?? gift.gift_id ?? 0);
  const fallback = GIFT_ID_CATALOG[giftId] || null;

  const rawName =
    gift.name ||
    det.giftName ||
    ext.name ||
    data?.giftName ||
    fallback?.name ||
    (giftId ? `Gift#${giftId}` : 'Rose');

  let coinsVal = Number(
    gift.diamondCount ??
      det.diamondCount ??
      ext.diamond_count ??
      data?.diamondCount ??
      fallback?.coins ??
      1
  );

  const cleanName = String(rawName).trim();
  const lowerName = cleanName.toLowerCase();
  if (lowerName.includes('gigante') || lowerName.includes('giant rose') || lowerName === 'rosa gigante') {
    if (!Number.isFinite(coinsVal) || coinsVal <= 1) {
      coinsVal = 10;
    }
  } else if (lowerName.includes('super gg') || lowerName.includes('supergg') || lowerName.includes('súper gg')) {
    if (!Number.isFinite(coinsVal) || coinsVal <= 1) {
      coinsVal = 100;
    }
  }

  const giftType = Number(
    gift.type ?? det.giftType ?? ext.type ?? data?.giftType ?? (gift.combo ? 1 : 0)
  );
  const isCombo = giftType === 1 || gift.combo === true;
  const repeatCount = Math.max(1, Number(data?.repeatCount ?? gift.repeat_count ?? 1));
  const repeatEnd = Boolean(Number(data?.repeatEnd ?? gift.repeat_end ?? 0)) || data?.repeatEnd === true;

  return {
    giftId,
    giftName: cleanName,
    diamondCount: Math.max(1, Number.isFinite(coinsVal) ? coinsVal : 1),
    isCombo,
    repeatCount,
    repeatEnd,
    groupId: String(data?.groupId ?? '')
  };
}

function handleRawGift(data) {
  const rawMsgId = String(data?.common?.msgId ?? data?.msgId ?? '');
  const rCount = Math.max(1, Number(data?.repeatCount ?? data?.gift?.repeat_count ?? 1));
  const rEnd = Boolean(Number(data?.repeatEnd ?? data?.gift?.repeat_end ?? 0)) || data?.repeatEnd === true;

  if (rawMsgId) {
    const dedupeKey = `${rawMsgId}:${rCount}:${rEnd ? 1 : 0}`;
    if (seenMsgIds.has(dedupeKey)) return;
    seenMsgIds.add(dedupeKey);
    if (seenMsgIds.size > 3000) {
      seenMsgIds.delete(seenMsgIds.values().next().value);
    }
  }

  const { userId, uniqueId, nickname, profilePictureUrl } = extractUser(data);
  const { giftId, giftName, diamondCount, isCombo, repeatCount, repeatEnd, groupId } = resolveGiftPayload(data);

  const rawIconUrl =
    data?.giftPictureUrl ||
    data?.gift?.image?.url_list?.[0] ||
    data?.giftDetails?.giftImage?.url_list?.[0] ||
    data?.extendedGiftInfo?.icon?.url_list?.[0] ||
    data?.extendedGiftInfo?.image?.url_list?.[0] ||
    '';

  const emitOne = () => {
    postEvent('gift', {
      giftId,
      giftName,
      diamondCount,
      repeatCount: 1,
      repeatEnd,
      uniqueId,
      nickname,
      profilePictureUrl,
      giftPictureUrl: rawIconUrl
    });
  };

  if (!isCombo) {
    for (let i = 0; i < repeatCount; i++) {
      emitOne();
    }
    return;
  }

  const streakKey = `${userId}:${giftId}:${groupId || 'def'}`;
  let prev = activeStreaks.get(streakKey);

  if (!prev) {
    prev = { delivered: 0, timer: null };
  }

  if (repeatCount < prev.delivered) {
    prev.delivered = 0;
  }

  if (prev.timer) clearTimeout(prev.timer);

  const delta = repeatCount - prev.delivered;
  if (delta > 0) {
    prev.delivered = repeatCount;
    for (let i = 0; i < delta; i++) {
      emitOne();
    }
  }

  if (repeatEnd) {
    activeStreaks.delete(streakKey);
  } else {
    prev.timer = setTimeout(() => {
      activeStreaks.delete(streakKey);
    }, 4000);
    activeStreaks.set(streakKey, prev);
  }
}

let currentConnection = null;
let isReconnecting = false;
let reconnectTimer = null;
let reconnectAttempts = 0;

function isOfflineError(err) {
  const msg = String(err?.message || err || '').toLowerCase();
  return (
    msg.includes('live has ended') ||
    msg.includes('not currently live') ||
    msg.includes("the requested user isn't online") ||
    msg.includes('user not online') ||
    msg.includes('offline') ||
    msg.includes('empty room')
  );
}

function isRateLimitError(err) {
  const msg = String(err?.message || err || '').toLowerCase();
  const name = String(err?.name || '').toLowerCase();
  return (
    name.includes('ratelimit') ||
    msg.includes('rate limit') ||
    msg.includes('rate_limit') ||
    msg.includes('too many connections') ||
    msg.includes('sign server message')
  );
}

function scheduleReconnect(reason = 'unknown', customDelay = null) {
  if (isReconnecting) return;
  isReconnecting = true;
  reconnectAttempts++;

  const isRateLimit = typeof reason === 'string' && reason.startsWith('rate_limit');
  const isOffline = isOfflineError(reason);

  if (!isRateLimit) {
    postEvent(isOffline ? 'live_room_offline' : 'standby_ready', {
      username: cleanUser,
      reason: isOffline
        ? `El usuario @${cleanUser} no está en directo actualmente.`
        : `Reconectando (${reason}). Intento #${reconnectAttempts}...`
    });
  }

  if (currentConnection) {
    try {
      currentConnection.removeAllListeners();
      currentConnection.disconnect();
    } catch (_) {}
    currentConnection = null;
  }

  if (reconnectTimer) clearTimeout(reconnectTimer);

  const delayMs = customDelay !== null
    ? customDelay
    : (isOffline ? 15000 : Math.min(30000, 3000 + reconnectAttempts * 2000));

  reconnectTimer = setTimeout(() => {
    isReconnecting = false;
    connectWithRetry();
  }, delayMs);
}

function bindConnectionEvents(conn) {
  conn.on('gift', data => handleRawGift(data));

  conn.on('like', data => {
    const { uniqueId, nickname } = extractUser(data);
    const likeCount = Math.max(1, Number(data?.count ?? data?.likeCount ?? 1));
    const totalLikeCount = Math.max(1, Number(data?.total ?? data?.totalLikeCount ?? likeCount));
    postEvent('like', { likeCount, totalLikeCount, uniqueId, nickname });
  });

  conn.on('chat', data => {
    const { uniqueId, nickname } = extractUser(data);
    const comment = String(data?.content ?? data?.comment ?? '');
    postEvent('chat', { comment, uniqueId, nickname });
  });

  conn.on('follow', data => {
    const { uniqueId, nickname } = extractUser(data);
    postEvent('follow', { uniqueId, nickname });
  });

  conn.on('share', data => {
    const { uniqueId, nickname } = extractUser(data);
    postEvent('share', { uniqueId, nickname });
  });

  conn.on('subscribe', data => {
    const { uniqueId, nickname } = extractUser(data);
    postEvent('subscribe', { uniqueId, nickname });
  });

  conn.on('disconnected', () => {
    scheduleReconnect('stream_disconnected');
  });

  conn.on('streamEnd', () => {
    scheduleReconnect('LIVE has ended');
  });

  conn.on('error', err => {
    if (isRateLimitError(err)) {
      const waitMs = Number(err?.retryAfter) > 0 ? Number(err.retryAfter) : 1800000;
      const mins = Math.max(1, Math.ceil(waitMs / 60000));
      postEvent('rate_limited', {
        username: cleanUser,
        minutes: mins,
        retryAfterMs: waitMs,
        message: `Límite horario de firmas de EulerStream alcanzado (${mins} min). Ingresa una API Key gratuita de EulerStream en Configuración para conectar sin límites.`
      });
      scheduleReconnect(`rate_limit_wait_${mins}m`, waitMs);
      return;
    }
    scheduleReconnect(err?.message || 'socket_error');
  });
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Referer': 'https://www.tiktok.com/'
};

async function connectWithRetry() {
  const connOptions = {
    processInitialData: false,
    fetchRoomInfoOnConnect: true,
    enableExtendedGiftInfo: false,
    requestOptions: {
      timeout: 10000,
      headers: BROWSER_HEADERS
    },
    websocketOptions: {
      timeout: 10000,
      headers: BROWSER_HEADERS
    }
  };
  if (cleanApiKey) {
    connOptions.signApiKey = cleanApiKey;
  }

  try {
    const conn = new TikTokLiveConnection(cleanUser, connOptions);
    bindConnectionEvents(conn);
    currentConnection = conn;

    const state = await conn.connect();
    reconnectAttempts = 0;
    postEvent('live_room_connected', {
      username: cleanUser,
      roomId: String(state?.roomId || conn.roomId || '')
    });
  } catch (err) {
    if (isRateLimitError(err)) {
      const waitMs = Number(err?.retryAfter) > 0 ? Number(err.retryAfter) : 1800000;
      const mins = Math.max(1, Math.ceil(waitMs / 60000));
      postEvent('rate_limited', {
        username: cleanUser,
        minutes: mins,
        retryAfterMs: waitMs,
        message: `Límite horario de EulerStream alcanzado (${mins} min). Agrega una API Key gratuita de EulerStream en Configuración para conectar sin límite de peticiones.`
      });
      scheduleReconnect(`rate_limit_wait_${mins}m`, waitMs);
      return;
    }

    if (isOfflineError(err)) {
      scheduleReconnect(err?.message || 'User is not currently live', 15000);
      return;
    }

    try {
      const fallbackOptions = {
        processInitialData: false,
        fetchRoomInfoOnConnect: false,
        enableExtendedGiftInfo: false,
        requestOptions: {
          timeout: 12000,
          headers: BROWSER_HEADERS
        },
        websocketOptions: {
          timeout: 12000,
          headers: BROWSER_HEADERS
        }
      };
      if (cleanApiKey) {
        fallbackOptions.signApiKey = cleanApiKey;
      }
      const fallbackConn = new TikTokLiveConnection(cleanUser, fallbackOptions);
      bindConnectionEvents(fallbackConn);
      currentConnection = fallbackConn;

      const st2 = await fallbackConn.connect();
      reconnectAttempts = 0;
      postEvent('live_room_connected', {
        username: cleanUser,
        roomId: String(st2?.roomId || fallbackConn.roomId || '')
      });
    } catch (err2) {
      if (isRateLimitError(err2)) {
        const waitMs2 = Number(err2?.retryAfter) > 0 ? Number(err2.retryAfter) : 1800000;
        const mins2 = Math.max(1, Math.ceil(waitMs2 / 60000));
        postEvent('rate_limited', {
          username: cleanUser,
          minutes: mins2,
          retryAfterMs: waitMs2,
          message: `Límite horario de EulerStream alcanzado (${mins2} min). Agrega una API Key gratuita de EulerStream en Configuración.`
        });
        scheduleReconnect(`rate_limit_wait_${mins2}m`, waitMs2);
        return;
      }
      scheduleReconnect(err2?.message || err?.message || 'connect_failed');
    }
  }
}

connectWithRetry();
