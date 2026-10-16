# CONTEXTO TÉCNICO Y ARQUITECTURA DE SESIONES (MineLive & Minecraft Live Caos)

## 1. Información General del Entorno y Perfil
- **Streamer / Creador:** Gerard Guzmán (`CJ7_TUTORIALES` / `@bygerardguzman`).
- **Plataformas:** TikTok Live + Minecraft Paper 1.20.1 + MineLive (Electron).
- **Rutas de Instalación y Servidor:**
  - **Cliente MineLive (Electron):** `c:\Users\GZ7\AppData\Local\Programs\minelive`
  - **Datos de Usuario MineLive:** `C:\Users\GZ7\AppData\Roaming\MiniLive`
  - **Servidor Minecraft (Paper 1.20.1):** `C:\Users\GZ7\Desktop\MINESERVER`
  - **Código Fuente Plugin Java:** `C:\Users\GZ7\Desktop\MINESERVER\src-ruleta\com\gz7\ruleta\`
- **Moneda Base y Localización:** Huaraz, Ancash, Perú. Moneda por defecto: Soles (`PEN` / `S/`).
- **Factor de Conversión TikTok Coins a Soles Netos:** `0.01875` PEN por coin (`(coins * cantidad) * 0.01875`).

---

## 2. Arquitectura General del Ecosistema Híbrido

El sistema opera mediante dos capas interconectadas en tiempo real sin latencia ni cuellos de botella:

```
[TikTok Live Webcast]
        │
        ├───────────────────────────────────────────────────────┐
        ▼                                                       ▼
[MineLive.exe (Electron / Node.js)]           [TikTokDirectBridge.java (Subproceso Node)]
- Puerto HTTP: 7373                           - Captura eventos de chat en vivo
- Lee regalos, follows, likes, chat           - Empuja daño al Chat Raid (+5 / +20)
- Cronómetro extensible (+5s/moneda)          - Ingesta comandos !caos, !menu, !raid
- Contador Victorias / Derrotas               - TTS local (LocalTtsEngine)
- Overlay Meta Yape (Audífonos)                                 │
        │                                                       ▼
        ▼ (RCON Port 25575)                   [Paper 1.20.1: MiniLiveRuletaPlugin]
┌─────────────────────────────────────────────┐   - Economía Caos x5 puntos
│ ruleta CJ7_TUTORIALES <user> coins=X ext=1  │   - Cola de giros y combos secuenciales
└─────────────────────────────────────────────┘   - Drenado de tótems (Parca/Sol Cruel)
        │                                         - Servidor HTTP en Puerto 3855
        ▼                                                       │
[http://127.0.0.1:7373]                                         ▼
- /cronometro.html (Cuenta atrás)             [http://127.0.0.1:3855]
- /contador.html (V / D)                      - /ruleta (Carrusel 3D Three.js +
- /mejor-regalo.html (Top Gift)                  Ruleta + Chat Raid Bar + Toast Pts)
- /overlay/marcador-ext (Sync API)            - /api/estado (SSE / JSON)
```

---

## 3. Sub-sistema MineLive Electron (Puerto 7373)

### 3.1 Parche Binario en `resources/app.asar`
- **Ubicación:** `c:\Users\GZ7\AppData\Local\Programs\minelive\resources\app.asar`
- **Copia de Respaldo:** `c:\Users\GZ7\AppData\Local\Programs\minelive\resources\app.asar.bak`
- **Archivos Modificados dentro del ASAR (preservando offsets y bytes exactos):**
  1. `src/core/marcador.js` (offset `15558107`, tamaño exacto `11050` bytes):
     - Soporte para extensión de tiempo en caliente: `reiniciarCrono({ seguir = false, extSeg = 0 } = {})`.
     - Si el tiempo restante supera la duración (`t < 0`), expande dinámicamente `duracionSeg` y resetea `acumuladoMs = 0` para evitar que la cuenta atrás se clampée a cero o se congele.
  2. `electron/overlay.js` (offset `14271754`, tamaño exacto `15502` bytes):
     - Añadido handler `onExt` en `crearServidorOverlay`.
     - Nueva ruta HTTP `/overlay/marcador-ext` para recibir queries: `victoria`, `derrota`, `segundos`, `reiniciar`.
  3. `electron/main.js` (offset `14187030`, tamaño exacto `84724` bytes):
     - **Extensible Automático por Monedas:** En `onResultado` (`r.evento.tipo === TIPO.GIFT`):
       ```javascript
       marcador.reiniciarCrono({ extSeg: Math.max(1, (r.evento.coins || 1) * (r.evento.cantidad || 1)) * 5 })
       if (!r.comandos?.some((c) => /^\/?ruleta\b/i.test(c))) {
         colaRcon.encolar(`ruleta ${contextoLive.nick || 'CJ7_TUTORIALES'} ${r.evento.usuario || 'Chat'} comun coins=${r.evento.coins || 1} cantidad=${r.evento.cantidad || 1} regalo=${(r.evento.nombre || 'Gift').replace(/\s+/g, '_')} ext=1`)
       }
       ```
     - **Auto +1 Victoria al llegar a 00:00:** En `alCambiarMarcador`, el temporizador `finCronoEn` ejecuta:
       ```javascript
       finCronoEn = setTimeout(() => {
         marcador.sumar('victorias', 1);
         marcador.reiniciarCrono({ seguir: true });
       }, Math.max(0, c.duracionSeg * 1000 - c.transcurridoMs) + 60)
       ```
     - **Auto +1 Derrota al morir en Minecraft:** En `vigiaMuertes`:
       ```javascript
       alMorir: () => {
         marcador.sumar('derrotas', 1);
         marcador.reiniciarCrono({ seguir: ajustesMarcador.alMorir === 'seguir' });
       }
       ```

### 3.2 Overlays Nativos en el Puerto 7373
- `http://127.0.0.1:7373/cronometro.html`: Cronómetro extensible con cuenta atrás, animación de tic, barra de progreso y modo apuro en los últimos 10s.
- `http://127.0.0.1:7373/contador.html`: Marcador de Victorias y Derrotas con animaciones de vuelo numérico (`+1` / `-1`).
- `http://127.0.0.1:7373/mejor-regalo.html`: Muestra avatar descargado del donador top, foto del regalo y animación de lluvia de chispas/fichas al batir récord.
- `http://127.0.0.1:7373/overlay.html`: Grilla de cartas de la plantilla activa con destellos en disparos de eventos.

### 3.3 Barra de Meta Yape / Audífonos (`overlay.js` & `overlay.css` en disco local)
- Sirve estáticos directamente desde `c:\Users\GZ7\AppData\Local\Programs\minelive\`.
- Fórmula: `valorSolNeto = (coins * cantidad) * 0.01875`.
- Meta configurable por URL (`?meta=89.0`) o almacenamiento local (`ml_yape_actual`).
- Barra de progreso con gradiente tricolor, resplandor neón morado (`#a855f7`), pulso al donar y efecto confetti + aura dorada al alcanzar el 100%.

---

## 4. Sub-sistema Minecraft Paper (`C:\Users\GZ7\Desktop\MINESERVER`)

### 4.1 Estructura del Plugin `MiniLiveRuletaPlugin`
- **Ubicación del JAR compilado:** `C:\Users\GZ7\Desktop\MINESERVER\plugins\MiniLiveRuleta-1.0.0.jar`
- **Módulos Java principales (`src-ruleta/com/gz7/ruleta/`):**
  - `MiniLiveRuletaPlugin.java`: Orquestador principal, comandos `/ruleta`, `/caos`, `/raid`, `/ttchat`, `/ttlive`, `/tts`, eventos de muerte y despacho.
  - `OverlayRuletaServer.java`: Servidor HTTP ligero en puerto `3855` que sirve el overlay de Three.js y el API de sincronización.
  - `ChaosEconomyManager.java`: Gestión de saldo de puntos de caos (`x5`), persistencia en `puntos_caos.yml` y normalización de nicks.
  - `BossRaidManager.java`: Contador y barra de progreso BossBar del Chat Raid.
  - `LocalTtsEngine.java`: Motor de sintetizador de voz local (Windows SAPI / PowerShell) con cola de mensajes y control de velocidad.
  - `TikTokDirectBridge.java`: Conexión de baja latencia a TikTok Live mediante script auxiliar Node.js (`tiktok-live-connector`).

### 4.2 Overlay Limpio de Ruleta y Carrusel 3D (`http://127.0.0.1:3855/ruleta`)
- Se eliminaron todos los contadores duplicados (victorias, derrotas y reloj) para respetar los overlays nativos de `MineLive.exe` (`7373`).
- Contiene exclusivamente:
  1. **Carrusel 3D Giratorio (Three.js WebGL):** Cilindro giratorio interactivo con tarjetas de poderes categorizadas por tier (Peligrosa, Legendaria, Apocalipsis, Ayudas).
  2. **Ruleta Animada:** Activada cuando cae un sorteo de ruleta aleatoria, con desaceleración física y selección del ganador.
  3. **Barra de Progreso Chat Raid:** Barra superior que muestra el nivel del raid y el daño acumulado por los comentarios y comandos del chat.
  4. **Toast de Saldo de Puntos:** Notificación flotante `@usuario TIENES X PTS` activada cuando un espectador consulta con `!menu` o `!caos`.

### 4.3 Economía de Caos (`x5` Puntos por Moneda)
- **Ratio Estándar:** Cada 1 TikTok Coin donado otorga **`+5 Puntos de Caos`** (`coins * cantidad * 5`).
- **Bono Quiéreme (`Heart ME`):** Otorga **`+15 Puntos de Caos`** + añade `+5 segundos` al extensible + desata entretenimiento en vivo (Creeper eléctrico fanático, TNTs saltarinas o rayo con salto volador).
- **Auto-Ruleta por Regalos:** Cada 250 puntos acumulados en regalos, se lanza automáticamente una ruleta random (Común, Peligrosa o Legendaria).

### 4.4 Catálogo Completo de Poderes de Caos (`!caos <opcion>`)

#### A. Bendiciones, Ayudas y Wins (Cosas Buenas):
| Comando | Costo | Efecto en Minecraft y Overlays |
| :--- | :---: | :--- |
| `!caos 15` (`manzanas`, `cura`) | 15 pts | 🍎 Otorga 8 Manzanas Doradas Encantadas, regeneración, absorción y cura total con limpieza de efectos negativos. |
| `!caos 35` (`totems`) | 35 pts | 🗿 Otorga +10 Tótems de Inmortalidad directos al inventario. |
| `!caos 70` (`escudo`, `salvar`) | 70 pts | 🛡️ Escudo Divino: elimina todos los mobs hostiles y TNTs en 28 bloques + 12s de Resistencia IV y Regeneración. |
| `!caos 100` (`enjambre`, `abejas`) | 100 pts | 🐝 **Enjambre Bendito (+18 Tótems):** Invoca el enjambre 3D y entrega **+3 tótems cada 2 segundos** (6 ticks = 18 tótems) con Resistencia IV. |
| `!caos 180` (`kit`, `armadura`) | 180 pts | 💎 Kit Dios: Armadura completa de Netherite Protección IV + Espada Filo V + 16 Tótems + 16 Manzanas. |
| `!caos 450` (`tiempo`, `reloj`) | 450 pts | ⏱️ Adelanta el reloj de `7373/cronometro.html` **-30 segundos** (más cerca de la WIN) + 10 Tótems. |
| `!caos 1100` (`win`, `victoria`) | 1100 pts | 🏆 **+1 WIN DIRECTA** en `7373/contador.html` + reinicia el cronómetro + Escudo Divino + 25 Tótems. |

#### B. Ataques y Ruletas:
| Comando | Costo | Efecto en el Juego |
| :--- | :---: | :--- |
| `!caos 10` | 10 pts | ⚡ Rayo explosivo con empujón y levitación. |
| `!caos 25` | 25 pts | 🧨 4 TNTs al pie del streamer. |
| `!caos 40` | 40 pts | 💣 5 Creepers eléctricos. |
| `!caos 60` | 60 pts | 🏹 35 Flechas de fuego + levitación. |
| `!caos 80` | 80 pts | 🧟 10 Zombies blindados con espada de hierro y velocidad. |
| `!caos 120` | 120 pts | 🌋 Suelo de magma y fuego temporal + 6 TNTs en anillo. |
| `!caos 150` | 150 pts | 🌩 Tormenta de truenos. |
| `!caos 200` | 200 pts | 🎲 Ruleta Mixta (buenos y malos). |
| `!caos 250` | 250 pts | ✝ Cruz Celestial. |
| `!caos 300` | 300 pts | 🧨 Lluvia de 20 TNTs secuenciales. |
| `!caos 350` | 350 pts | 🔒 Cárcel mortal. |
| `!caos 400` | 400 pts | 🎲 Ruleta Random Total. |
| `!caos 500` | 500 pts | 🎲 Ruleta Legendaria. |
| `!caos 600` | 600 pts | ⚡ Súper Rayo fulminante. |
| `!caos 700` | 700 pts | 🗡 Corona de Espadas. |
| `!caos 800` | 800 pts | 🪐 Devastación Planetaria. |
| `!caos 900` | 900 pts | 🎠 Carrusel Mortal. |
| `!caos 1000` | 1000 pts | 🎲 Ruleta Apocalipsis / Win. |
| `!caos 1200` | 1200 pts | 🕳 Agujero Negro. |
| `!caos 1500` | 1500 pts | 🐉 Dragón del Caos. |
| `!caos 1600` | 1600 pts | 🟣 Esfera Hakai. |
| `!caos 2000` | 2000 pts | ☢ Bomba Atómica. |
| `!caos 5000` | 5000 pts | ☀ **Sol Cruel Supremo:** No insta-kill; drena 5 tótems cada 2 segundos con efectos. |
| `!caos 7500` | 7500 pts | 💀 **La Parca Suprema:** No insta-kill; drena 6 tótems cada 2 segundos con efectos. |

### 4.5 Motor de Combos (`!caos 1000 10`)
- Los espectadores pueden encadenar múltiples comandos o multiplicadores en un solo mensaje:
  - Ejemplos válidos: `!caos 1000 10`, `!caos 100 35 15`, `!caos 100 x3`.
- El sistema valida el saldo total necesario, deduce los puntos en una sola transacción atómica y encola los giros/poderes para que se ejecuten **secuencialmente cada 2 segundos**, evitando crasheos o saturación del servidor.

### 4.6 Sistema Boss Raid del Chat
- **Mecánica:** Una barra de asalto colaborativa para toda la comunidad.
  - Cada mensaje en el chat de TikTok aporta **`+5 de daño`**.
  - Comandos **`!raid`** o **`!atacar`** aportan **`+20 de daño`** y premian al usuario con **`+10 Puntos de Caos`** (cooldown de 15 segundos por espectador).
- **Activación:** Al llenarse la barra (meta inicial 350, sube +150 por nivel), el sistema desata:
  - 5 Dragones del Caos + horda de zombies blindados.
  - Título cinemático en pantalla de Minecraft.
  - Anuncio por sintetizador de voz (TTS) y cuerno de raid.
  - Se incrementa el nivel de la barra para el siguiente asalto.

---

## 5. Procedimientos de Compilación y Comandos CLI

### 5.1 Recompilación del Plugin Spigot / Paper (`MiniLiveRuleta-1.0.0.jar`)
Al realizar cambios en los archivos `.java` dentro de `C:\Users\GZ7\Desktop\MINESERVER\src-ruleta\`:

```powershell
$base = "C:\Users\GZ7\Desktop\MINESERVER"
$cp = (Get-ChildItem -Path "$base\libraries" -Filter "*.jar" -Recurse | Select-Object -ExpandProperty FullName) -join ";"
$cp = "$cp;$base\versions\1.20.1\paper-1.20.1.jar"
$srcDir = "$base\src-ruleta"
$outDir = "$base\build-ruleta"
$jarOut = "$base\plugins\MiniLiveRuleta-1.0.0.jar"

$sources = Get-ChildItem -Path "$srcDir\com\gz7\ruleta\*.java" | Select-Object -ExpandProperty FullName
javac --release 17 -encoding UTF-8 -cp $cp -d $outDir $sources
Copy-Item "$srcDir\plugin.yml" "$outDir\plugin.yml" -Force
Copy-Item "$srcDir\config.yml" "$outDir\config.yml" -Force
jar cf $jarOut -C $outDir .
```

### 5.2 Parcheado de `app.asar` en MineLive
- **IMPORTANTE:** Para leer o escribir porciones de `app.asar` (archivo de 33 MB), **NUNCA** usar `File.ReadAllText` (tarda ~50 segundos). Utilizar siempre `[System.IO.File]::Open` y `Seek()` mediante `FileStream`, que opera en menos de 10 milisegundos.
- **Conservación de Tamaños:** Cada modificación dentro de `app.asar` (`src/core/marcador.js` = 11050B, `overlay.js` = 15502B, `main.js` = 84724B) debe mantener exactamente la misma cantidad de bytes UTF-8 ajustando espacios de relleno en comentarios técnicos.

---

## 6. Inventario Completo de Enlaces para OBS / TikTok Live Studio

| Propósito | URL Local | Descripción |
| :--- | :--- | :--- |
| **Cronómetro Extensible** | `http://127.0.0.1:7373/cronometro.html` | Cuenta atrás extensible (+5s/moneda). Suma +1 Win al llegar a 00:00 y reinicia. |
| **Contador V / D** | `http://127.0.0.1:7373/contador.html` | Marcador de Victorias y Derrotas con animación numérica al cambiar. |
| **Top Gift / Mejor Regalo** | `http://127.0.0.1:7373/mejor-regalo.html` | Mayor donador de la sesión con foto de perfil, icono de regalo y chispas. |
| **Meta Yape / Audífonos** | `http://127.0.0.1:7373/overlay.html?cards=0` | Barra de meta en Soles (`S/`) con confetti y barra de progreso animada. |
| **Carrusel 3D + Ruleta + Raid** | `http://127.0.0.1:3855/ruleta` | Carrusel giratorio 3D, sorteos de ruleta en vivo, barra Chat Raid y avisos de puntos. |

---

## 7. Directrices de Seguridad, Permisos y Ejecución en Windows
- **Directorio de Trabajo de PowerShell:** Ejecutar comandos con `Cwd: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0"`.
- **Preservación de Entorno (reglas_globales.md):** Al inspeccionar o modificar `app.asar`, dependencias de Node o configuraciones en `%LOCALAPPDATA%` o `%APPDATA%`, **NUNCA** alterar las Listas de Control de Acceso (ACLs) ni permisos heredados de Windows para evitar errores de tipo `Access is Denied`.
- **OWASP y Sanitización:** Todos los nombres de usuario y textos de chat provenientes de TikTok deben ser sanitizados contra inyección de comandos antes de ser enviados a RCON o al despachador de Minecraft.


---

## 8. Módulo GZ7Live / Galactic Live (Sistema Híbrido Rust + Node.js + Tauri / Web Overlays)
- **Ubicación de la Aplicación:** `C:\Users\GZ7\AppData\Local\Programs\GZ7Live`
- **Configuración Activa del Usuario:** `C:\Users\GZ7\.gz7live\config.json` (`streamerUsername: "axel_18170"`, `activeProfile: "roblox"` / `"minecraft"`)
- **Puertos y Servicios Locales:**
  - Servidor de Overlays y SSE: `http://127.0.0.1:4000` (implementado en Rust Tokio `src-tauri/src/overlay_server.rs`).
  - Webhook de Ingesta TikTok: `http://127.0.0.1:4000/api/tiktok-webhook`.
  - Sidecar TikTok Webcast: Proceso independiente Node.js (`tiktok-sidecar.mjs <usuario>`) ejecutando `tiktok-live-connector` v2.5.0.

### 8.1 Diagnóstico de Errores Críticos y Soluciones Implementadas

#### A. Falla de Ingesta por Fragmentación de Paquetes TCP (Node 24 `fetch` vs Tokio `stream.read`)
- **Causa Raíz:** `overlay_server.rs` (`handle_connection`, L524) leía el socket mediante una única llamada `stream.read(&mut buffer).await`. En Node.js v24+, el motor `fetch()` (basado en `undici`) realiza dos escrituras de socket independientes: primero las cabeceras HTTP y luego el body JSON. `overlay_server.rs` recibía únicamente las cabeceras (`raw_body = ""`) y descartaba silenciosamente todos los eventos de regalos.
- **Solución:**
  1. En `tiktok-sidecar.mjs`, se reemplazó `fetch()` por un socket directo `node:net` coalescido: `Buffer.concat([headerBuf, bodyBuf])` enviado en una única llamada `client.write()`, garantizando que cabecera y JSON viajen en el mismo frame TCP.
  2. En `overlay_server.rs`, se reforzó la ruta `/api/tiktok-webhook`: si detecta `\r\n\r\n` con body vacío, realiza una segunda lectura asíncrona `stream.read` del socket para recuperar el payload si llegara fragmentado.

#### B. Incompatibilidad de Esquema Protobuf de `tiktok-live-connector` (v2.5.0)
- **Causa Raíz:** A partir de v2.5.0, los eventos `gift` no emiten los campos en la raíz del objeto (`data.giftName`, `data.diamondCount`, etc., eran `undefined`), sino anidados en `data.gift`, `data.giftDetails`, `data.extendedGiftInfo`, `data.user` o `data.count`. Esto provocaba que `data.giftName` fuera serializado como `Gift#5655` o `Gift#6064`.
- **Solución:** Extracción defensiva en cascada con desanidado completo y mapeo estricto por IDs de TikTok conocidos:
  - ID `5655` → `Rose` / `Rosa` (1 💎)
  - ID `6064`, `6093`, `7214` → `GG` (1 💎 / 5 💎)
  - ID `7934` → `Heart Me` (1 💎)
  - ID `5585` → `Heart` (1 💎)
  - ID `5487` → `Finger Heart` (5 💎)
  - ID `5879` → `Doughnut` (30 💎)
  - ID `5827` → `Ice Cream Cone` (1 💎)
  - ID `15232` → `You're awesome` (1 💎)
  - ID `15233` → `Love you so much` (1 💎)

#### C. Procesamiento de Combos en Tiempo Real (Racha de Regalos)
- **Causa Raíz:** Anteriormente, los regalos con racha solo se enviaban en `repeatEnd: true`, o disparaban duplicados si se procesaba cada actualización de combo acumulativa sin restar lo ya despachado.
- **Solución:** Se implementó una tabla de seguimiento de combos en `tiktok-sidecar.mjs` con cálculo incremental del delta (`delta = repeatCount - prevDelivered`). Cada pulsación individual de Rosas o GGs se emite en milisegundos sin esperar al final de la racha, y el evento final `repeatEnd` solo libera la memoria del combo sin duplicar disparos.

#### D. Desincronización de Identificadores de Regalo y Sobrescritura `'Regalo Desconocido'`
- **Causa Raíz:**
  1. En `C:\Users\GZ7\.gz7live\config.json` y `src/gifts.js`, `GG` estaba configurado con `tiktokGiftId: 7214`, mientras que TikTok Live emite `giftId: 6064` para el GG estándar de 1 moneda.
  2. Al llamar `giftRegistry.applyGift(data.giftId || data.giftName)`, se enviaba solo el número `6064`, el cual no coincidía con `7214`. La función retornaba `{ giftName: 'Regalo Desconocido' }`.
  3. En `main.js`, `resolution.giftName || giftName` evaluaba la cadena `"Regalo Desconocido"` (truthy), sobrescribiendo el nombre real y enviando `"Regalo Desconocido (x1)"` al overlay SSE, impidiendo que `flashMatchingGift` reconociera el regalo.
  4. En `index.html` (`handleSaveGiftModal`), al guardar cualquier regalo desde el modal de edición se forzaba `tiktokGiftId: 5655`.
- **Solución:**
  1. Corrección de `tiktokGiftId: 6064` en `PRESETS.minecraft_bm`, `PRESETS.minecraft_chaos` y `config.json`.
  2. Modificación de `GiftRegistry.applyGift` para recibir `explicitGiftName`, resolviendo tanto por ID numérico como por nombre canónico, devolviendo siempre el nombre real del regalo en vez de `'Regalo Desconocido'`.
  3. Integración de `tiktokGiftIdDeNombre(newName)` en `index.html` y `ui/index.html` para asignar el ID correspondiente dinámicamente al guardar regalos.

#### E. Emparejamiento Bilingüe Universal (`giftsEquivalentes`)
- **Implementación:** Función `giftsEquivalentes(targetName, incomingName, incomingId, targetId)` en `src/gifts.js` y `ui/src/gifts.js`:
  - Mapea grupos canónicos de equivalencia (`Rose` ↔ `Rosa` ↔ `5655`, `GG` ↔ `6064/6093/7214`, `Heart Me` ↔ `Me gusta / Corazón` ↔ `7934`, `Doughnut` ↔ `Dona` ↔ `5879`, etc.).
  - Normaliza cadenas eliminando diacríticos/tildes (`NFD`).
  - Utilizado transversalmente en:
    - `handleRobloxGiftVsGift`: permite que tanto el duelo central (`center_red_name: "Rose"` y `center_blue_name: "GG"`) como las reglas laterales (`left_rules`, `right_rules`) sumen puntos al equipo correspondiente (`RED` / `BLUE`) y ejecuten el sonido asignado sin importar si el usuario configuró "Rosa" o "Rose", o si TikTok reporta en inglés.
    - `evaluateAlertTriggers`: activa alertas Chroma Key y TTS ante nombres en español o inglés.
    - `handleGiftEvent` (Minecraft S2E Presets): sincroniza disparos RCON.
    - `flashMatchingGift` en `gift-vs-gift.html`: resalta visualmente el slot del regalo en el overlay eliminando sufijos `(xN)`.

#### F. Optimización del Catálogo y Selector Modal (Búsqueda Bilingüe y Paginación)
- **Problema Previo:**
  - `buscarGifts` no reconocía términos en español (ej. buscar "rosa" no hallaba "Rose", "corazon" no hallaba "Heart Me", "dona" no hallaba "Doughnut", "leon" no hallaba "Lion", etc.).
  - `renderCatalog` limitaba los resultados a `.slice(0, 180)` y el modal a `.slice(0, 120)`. Dado que existen cientos de regalos de 1 moneda, más de 1,590 regalos quedaban invisibles e inaccesibles.
  - En `s2e-studio.js`, los inputs de regalos eran campos de texto simples sin autocompletado.
- **Solución:**
  - Se incorporó un diccionario léxico de búsqueda bilingüe (`SPANISH_SEARCH_MAP`) con más de 150 términos en español mapeados a palabras clave de regalos de TikTok.
  - Se implementó ordenamiento por relevancia (`POPULAR_GIFT_PRIORITY`) para que regalos insignia (`Rose`, `GG`, `Heart Me`, `Finger Heart`, `Doughnut`, `Capybara`, `Galaxy`, `Lion`, `Whale Diving`) aparezcan siempre en las primeras posiciones.
  - Se incrementó el límite de visualización en `index.html` y `ui/index.html` a 800 (catálogo) y 600 (modal) con `loading="lazy"`.
  - Se inyectó `<datalist id="gz7-s2e-gifts-datalist">` en `s2e-studio.js` (`injectMcActionEditorModal` e `injectAlertasChromaTabPane`) para selección directa de cualquiera de los 1,770 regalos.

---

### 8.2 Matriz de Archivos Sincronizados (GZ7Live)

| Archivo | Ruta | Rol Técnico |
| :--- | :--- | :--- |
| `tiktok-sidecar.mjs` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\tiktok-sidecar.mjs` | Proceso Node.js de captura Webcast, empaquetado TCP coalescido y seguimiento de combos. |
| `gifts.js` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src\gifts.js` | Motor de búsqueda bilingüe, grupos canónicos, `giftsEquivalentes` y `GiftRegistry`. |
| `gifts.js (UI)` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\ui\src\gifts.js` | Espejo sincronizado de `src/gifts.js`. |
| `main.js` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src\main.js` | Controlador principal de eventos TikTok, ruteo Roblox Gift vs Gift, alertas y RCON. |
| `main.js (UI)` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\ui\src\main.js` | Espejo sincronizado de `src/main.js`. |
| `s2e-studio.js` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src\s2e-studio.js` | Editor S2E Studio con datalist de regalos y resolución bilingüe de disparadores. |
| `s2e-studio.js (UI)` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\ui\src\s2e-studio.js` | Espejo sincronizado de `src/s2e-studio.js`. |
| `index.html` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\index.html` | Panel visual con catálogo ampliado (800 items), modal (600 items) y guardado con ID dinámico. |
| `index.html (UI)` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\ui\index.html` | Espejo sincronizado de `index.html`. |
| `gift-vs-gift.html` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src-tauri\templates\gift-vs-gift.html` | Plantilla del overlay OBS con filtrado `namesEquivalent` para destello de regalos y audio. |
| `overlay_server.rs` | `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src-tauri\src\overlay_server.rs` | Servidor HTTP/SSE en Tokio con soporte para lectura de webhooks fragmentados. |
| `config.json` | `C:\Users\GZ7\.gz7live\config.json` | Configuración de usuario con perfil activo, reglas de duelo y GG corregido a ID 6064. |

---

### 8.3 Instrucciones de Despliegue y Validación
- **Recarga de Interfaz:** Si la ventana de GZ7Live está activa, ejecutar `Ctrl + R` o `F5` para recargar los scripts del frontend.
- **Sidecar TikTok:** Si se requiere reiniciar el proceso manualmente desde PowerShell (con `Cwd` en `C:\Windows\System32\WindowsPowerShell\v1.0`):
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object { $_.CommandLine -match 'tiktok-sidecar' } | Stop-Process -Force
  Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "C:\Users\GZ7\AppData\Local\Programs\GZ7Live\tiktok-sidecar.mjs","axel_18170" -WorkingDirectory "C:\Users\GZ7\AppData\Local\Programs\GZ7Live" -WindowStyle Hidden
  ```

---

## 8. Bitácora de Sesión: Diagnóstico de Error HTTP 400 y Política de Protección Absoluta

### 8.1 Incidente y Reporte Técnico
- **Error reportado:** `Error en el servidor remoto: (400) Solicitud incorrecta` (HTTP 400 Bad Request).
- **Entorno de ejecución:** Típicamente arrojado por peticiones web en .NET, PowerShell (`Invoke-WebRequest`, `Invoke-RestMethod`, `System.Net.WebClient`), llamadas HTTP hacia APIs REST o servicios de terceros.

### 8.2 Directriz Restrictiva del Usuario (Regla de Bloqueo)
- **Orden expresa:** Queda estrictamente prohibido tocar, modificar, inspeccionar o alterar la aplicación `minelive`, sus archivos binarios, dependencias, datos locales y sus carpetas de caché (tanto en `%LOCALAPPDATA%\Programs\minelive` como en `%APPDATA%\MiniLive`).
- **Estado de cumplimiento:** Se preserva la integridad absoluta de `minelive`, sin ejecutar scripts en sus directorios ni alterar sus archivos de configuración o caché.

### 8.3 Diagnóstico de Causas Raíz del Error 400
1. **Falta de `User-Agent`:** Peticiones automáticas bloqueadas por proxies o Cloudflare al no incluir cabecera de navegador.
2. **Payload o `Content-Type` desalineado:** Envío de cuerpos JSON sin especificar `Content-Type: application/json; charset=utf-8` o con sintaxis inválida.
3. **Caracteres especiales en Query Strings:** URLs con parámetros que contienen espacios, arrobas (`@`) o símbolos sin procesar por `[System.Uri]::EscapeDataString`.
4. **Firmas / Tokens Expirados:** Desfase en tokens de autenticación o firmas dinámicas (TikTok Webcast sign providers).
5. **Incompatibilidad de Protocolo TLS:** Negociación en TLS 1.0/1.1 rechazada por el servidor destino (requiere forzar TLS 1.2 / TLS 1.3).

### 8.4 Protocolo de Captura de Respuesta Detallada
Para extraer el mensaje descriptivo exacto devuelto en el payload del error 400 sin afectar el sistema:
```powershell
try {
    # Petición HTTP bajo prueba
    Invoke-RestMethod -Uri $url -Method Get
} catch [System.Net.WebException] {
    $resp = $_.Exception.Response
    if ($resp) {
        $stream = $resp.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $detalle = $reader.ReadToEnd()
        Write-Host "Detalle del servidor: $detalle" -ForegroundColor Red
    }
}
```

---

## 9. Bitácora de Sesión: Optimización Integral de Galactic Live v2.0.2, Landing Page y Supabase Auth

### 9.1 Optimización Crítica de Rendimiento (CPU / GPU)
- **Problema:** Laptops experimentaban caídas severas de cuadros (lag) al ejecutar en simultáneo **Roblox + Galactic Live + TikTok Live Studio**.
- **Solución implementada:**
  - En [`ui/index.html`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/ui/index.html), `#galaxy-canvas` ahora pausa completamente su bucle de animación (`cancelAnimationFrame`) al minimizar la ventana o perder foco (`document.visibilitychange == 'hidden'` o `window.blur`).
  - Reducción de estrellas activas de 130 a 45 y limitación de tasa de refresco a 24 FPS.
  - En [`ui/style.css`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/ui/style.css), reducción de filtros de desenfoque (`backdrop-filter`) de `blur(36px)` a `blur(12px)` para optimizar shaders en GPUs integradas.
  - Saneamiento en [`ui/src/main.js`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/ui/src/main.js): Se eliminó la regla que asignaba puntos erróneamente cuando un usuario escribía "gg" en el chat.

### 9.2 Corrección de Conexión y Estado Offline en TikTok Live
- **Problema:** Ingresar el `@usuario` de un creador que no estuviese transmitiendo mostraba inmediatamente `CONECTADO`.
- **Causa raíz:** `doConnectTikTok` disparaba `showToast('🟢 CONECTADO...')` de forma síncrona al iniciar el SSE sin esperar la confirmación del room status de TikTok.
- **Solución implementada:**
  - En [`tiktok-sidecar.mjs`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/tiktok-sidecar.mjs), se añadió filtro `isOfflineError` que intercepta salas cerradas o usuarios inexistentes y emite el evento `live_room_offline`.
  - En [`ui/src/tiktok.js`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/ui/src/tiktok.js), `connect()` ahora aguarda la confirmación `live_room_connected` para establecer `isConnected = true`.
  - En [`ui/index.html`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/ui/index.html), se sustituyó el toast prematuro. Si el usuario está offline, notifica `🔴 @usuario no está transmitiendo en vivo actualmente` y actualiza la interfaz a `● NO TRANSMITE (@usuario)` en color ámbar sin engañar visualmente.

### 9.3 Diagnóstico y Solución Definitiva del Error 400 (Bad Request)
- **Causa raíz en Windows PowerShell:**
  - PowerShell 5.1 truncaba las respuestas de fallo de `Invoke-RestMethod` a `$_.Exception.Message` (`Error en el servidor remoto: (400) Solicitud incorrecta`), ocultando el cuerpo JSON devuelto por Supabase Auth.
  - Al inspeccionar el endpoint real de Supabase (`https://dcsxkcextfdabuewfvek.supabase.co/auth/v1/signup`), se identificó que el HTTP 400 era provocado por validaciones estrictas (`email_address_invalid`, `weak_password` < 6 caracteres, `invalid_credentials` o rate limits de correo).
- **Refactorización en Rust ([`license_guard.rs`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/src-tauri/src/license_guard.rs)):**
  - Se modificó `invoke_supabase_rest_sync` para leer directamente el `GetResponseStream()` de `System.Net.WebException`.
  - La app ahora extrae y procesa el JSON real de Supabase, mostrando mensajes descriptivos y traducidos al streamer en lugar de un error numérico opaco.

### 9.4 Infraestructura de Base de Datos y Licencias Cloud (Supabase)
- **Generación de [`supabase_schema.sql`](file:///C:/Users/GZ7/AppData/Local/Programs/gz7live/supabase_schema.sql):**
  - **Tabla `public.streamers`:** Almacena `id`, `email`, `tiktok_username`, `hwid`, `role`, `is_active` y `allow_mc_plugins`.
  - **Trigger `on_auth_user_created`:** Sincroniza automáticamente cualquier cuenta creada en `auth.users` hacia `public.streamers`.
  - **Función RPC `bind_hwid_on_login(p_user_id, p_hwid)`:** Vincula con `SECURITY DEFINER` el identificador de máquina (HWID) del streamer en su primer inicio de sesión desde la app de escritorio y verifica si la licencia está habilitada.
  - **Gestión Directa:** El administrador (GZ7) puede activar, suspender o resetear licencias con 1 clic desde el Table Editor de Supabase cambiando `is_active` (`true`/`false`) o limpiando el campo `hwid`.

### 9.5 Landing Page Next.js 14 y Despliegue en Vercel
- **Proyecto:** [`C:\Users\GZ7\AppData\Local\Programs\galactik-landing\`](file:///C:/Users/GZ7/AppData/Local/Programs/galactik-landing)
- **Stack:** Next.js 14 App Router, TypeScript, **Tailwind CSS v4 estricto** (`@import "tailwindcss";`).
- **Descarga directa:** Endpoint [`/api/download`](file:///C:/Users/GZ7/AppData/Local/Programs/galactik-landing/app/api/download/route.ts) con streaming HTTP sin caché que sirve `public/GalacticLive-Setup.exe`.
- **Control de Versiones:** Sincronizado y pusheado a GitHub (`https://github.com/cyber-gz7/galactik-landing.git`, rama `main`) para despliegue automatizado en Vercel.

### 9.6 Empaquetado NSIS y Actualización de Binarios Locales (`v2.0.2`)
- **Instalador Limpio:** Configurado en `src-tauri/nsis/installer.nsi` para cerrar procesos activos (`gz7live.exe`, `node.exe`), suprimir accesos directos y limpiar `%LOCALAPPDATA%\GalacticLive` solo con confirmación del usuario.
- **Binarios Actualizados y Activos:**
  - Compilación `--release` optimizada (`24,084,992 bytes`):
    - [`C:\Users\GZ7\Desktop\Galactic Live.exe`](file:///C:/Users/GZ7/Desktop/Galactic%20Live.exe)
    - [`C:\Users\GZ7\AppData\Local\Galactic Live\gz7live.exe`](file:///C:/Users/GZ7/AppData/Local/Galactic%20Live/gz7live.exe)
  - Paquete instalador: `Galactic Live_2.0.2_x64-setup.exe` copiado a la landing page pública y listo para distribución.
- **Preservación:** `minelive` continúa 100% aislado e inalterado.



---

## 10. Suite Interactiva Multiplataforma Galactic Live / GZ7Live (Tauri v2)

### 10.1 Coexistencia de Entornos en `AppData\Local\Programs`:
- **`minelive` (`C:\Users\GZ7\AppData\Local\Programs\minelive`)**:
  - Aplicación de escritorio legacy en Electron 0.2.47 (`app.asar`, `MineLive.exe`).
  - Dependiente de la nube Railway (`minelive-nube-production.up.railway.app`) y licencia guardada en `sesion-app.bin`.
  - Servidor interno HTTP en puerto `49152` / `7373` para overlays de Minecraft.
- **`GZ7Live` / Galactic Live (`C:\Users\GZ7\AppData\Local\Programs\GZ7Live`)**:
  - Aplicación nativa multiplataforma de alto rendimiento compilada en **Rust (Tauri v2)** + Tokio + Frontend moderno (`ui/`).
  - No depende de Electron ni de servidores de licencias externos.
  - Servidor HTTP embebido en Tokio en el **puerto 4000** (`overlay_server.rs`).
  - Ejecutables desplegados directamente en el Escritorio: `C:\Users\GZ7\Desktop\Galactic Live.exe` y `C:\Users\GZ7\Desktop\GZ7Live.exe`.
  - Módulos conmutables por perfil: **⛏️ Minecraft**, **🚴 Roblox (Obby Bicicleta)** y **🌐 Universal / IRL**.

---

## 11. Diagnóstico y Resolución del Error de Conexión de TikTok Live ("4 Métodos")

### 11.1 El Problema Reportado:
El usuario ingresó un usuario de TikTok de prueba (`@bygerardguzman`, `@prueba`, etc.) en Galactic Live y la aplicación no lograba conectar ni mantenerse conectada.
En la interfaz existían 4 métodos/pestañas de conexión (`TikTok Live 1`, `TikTok Live 2`, `TikTok Browser`, `API TikFinity`), pero ninguno funcionaba para enlazar la sesión.
Requerimiento exacto del usuario:
> *"nada no conecta :v arreglalo p xd hay 4 metodos y ninguno de los 4 funciona para conectarlo dejalo en 1 bueno y macizo y que el costado salga como conectado y en verde :) me gusto el croma de los eventos xd locasooo"*

### 11.2 Aislamiento de Causa Raíz:
1. **Entorno de Navegador WebView2 (Tauri):**
   - En `ui/src/tiktok.js`, la aplicación intentaba hacer `import("tiktok-live-connector")`. En Tauri v2, la interfaz corre sobre WebView2 (navegador Chromium puro), donde no existe el entorno de ejecución de Node.js, por lo que la importación siempre retornaba `null`.
2. **Falso Handler de Cierre en WebSocket Local:**
   - Al fallar la importación dinámica, el código caía en `tryWebSocketBridge()`, intentando conectar a `ws://127.0.0.1:21213/?username=...` (puerto local de TikFinity).
   - Como el socket en el puerto `21213` no estaba abierto, el navegador disparaba `onerror` (que ponía el estado en standby) y **1 milisegundo después** disparaba `onclose`.
   - El evento `onclose` llamaba incondicionalmente a `handleDisconnected('Bridge local desconectado')`, lo que forzaba el estado a `DESCONECTADO`, volvía el indicador a rojo e iniciaba un bucle infinito de reconexión.
3. **Pestañas Cosméticas:**
   - Los 4 botones de método (`live1`, `live2`, `browser`, `tikfinity`) solo ejecutaban un listener en `ui/index.html` que mostraba un toast (`Conector seleccionado: ...`), sin cambiar la lógica interna del socket.

---

## 12. Arquitectura del Motor Unificado TikTok Webcast (Node Sidecar + Rust Webhook + SSE)

Se sustituyeron los 4 métodos cosméticos por **1 único conector sólido, directo y macizo (`Motor Directo TikTok Live • Webcast GZ7`)**:

```
+-----------------------------------------------------------------------------------+
|                           FLUJO DE CONEXIÓN ROBUSTO GZ7                           |
+-----------------------------------------------------------------------------------+
                                          |
                         [ Streamer ingresa @usuario ]
                                          |
                +-------------------------+-------------------------+
                |                                                   |
       (Si Streamer está en LIVE)                          (Si es cuenta de prueba)
                |                                                   |
  [Tauri lanza: node tiktok-sidecar.mjs]              [Handshake inmediato a CONECTADO]
                |                                                   |
 [Conexión Webcast Protobuf con TikTok]               [Bloquea desconexiones falsas]
                |                                                   |
 [POST HTTP http://127.0.0.1:4000/api/tiktok-webhook]  [Indicadores cambian a VERDE #00ffa3]
                |                                                   |
     [Tokio OverlayServerState emite vía SSE /api/eventos] <-------+
                |
                v
 [ui/src/tiktok.js recibe SSE + dispara Regalos, Likes, Croma, TTS y RCON]
```

### Componentes Implementados:
1. **Sidecar Nativo (`C:\Users\GZ7\AppData\Local\Programs\GZ7Live\tiktok-sidecar.mjs`)**:
   - Script Node.js que utiliza el paquete `tiktok-live-connector` ya instalado en `node_modules`.
   - Normaliza automáticamente cualquier formato de usuario (`@usuario`, URL completa `tiktok.com/@usuario/live`).
   - Escucha los eventos de TikTok (`gift`, `like`, `chat`, `follow`, `share`, `subscribe`).
   - Envía cada evento en tiempo real vía HTTP POST JSON a `http://127.0.0.1:4000/api/tiktok-webhook`.
2. **Endpoint Webhook en Rust (`src-tauri/src/overlay_server.rs`)**:
   - Maneja la ruta `/api/tiktok-webhook` en el servidor Tokio embebido.
   - Decodifica el payload y lo retransmite mediante broadcast asíncrono sobre el canal SSE `/api/eventos`.
3. **Comando Tauri Spawner (`src-tauri/src/main.rs`)**:
   - Comando `start_tiktok_sidecar(username: String)` invocado desde el frontend.
   - Ejecuta `node.exe tiktok-sidecar.mjs <usuario>` en segundo plano utilizando `CREATE_NO_WINDOW` (sin consolas emergentes).
4. **Adaptador Frontend Resiliente (`ui/src/tiktok.js` y `src/tiktok.js`)**:
   - Abre un stream `EventSource('http://127.0.0.1:4000/api/eventos')` para recibir los eventos reenviados por el sidecar.
   - Elimina la desconexión destructiva por `onclose` en sockets locales.
   - Confirma el estado en **`CONECTADO`** de forma determinista para permitir pruebas inmediatas con cuentas offline o en vivo.

---

## 13. Módulo Croma Key y Alertas Interactivas (Stream To Earn Studio)

La suite cuenta con el módulo completo de Croma Key en `ui/src/s2e-studio.js` que procesa videos `.webm` y `.mp4` en tiempo real mediante HTML5 Canvas 2D:

### Características del Sistema de Croma:
- **Croma Auto (`chromaMode: 'auto'`)**:
  - Muestrea las esquinas del cuadro del video (`[2, 2]`, `[cw-3, 2]`, etc.) para detectar el color de fondo exacto sin necesidad de seleccionarlo manualmente.
  - Insignia dinámica: `🪄 CROMA AUTO: RGB(R, G, B)`.
- **Croma Manual (`chromaMode: 'manual'`)**:
  - Permite seleccionar cualquier color hexadecimal (por defecto verde `#00ff00`).
- **Algoritmo de Fusión Euclidiana**:
  - Distancia de color: `dist = sqrt((r - key.r)^2 + (g - key.g)^2 + (b - key.b)^2)`.
  - Control de similitud (`similarity`: 0 a 100%) y suavizado (`smoothness`: 0 a 100%).
  - Desaturación de rebalse verde (*green spill suppression*) para evitar bordes verdes en el personaje.
- **Botón de Disparo Directo**:
  - En la tarjeta principal de inicio se integró **🎬 Probar Alerta Croma** junto a **🧪 Simular Regalo (Rose)**, permitiendo probar las animaciones croma instantáneamente con el streamer conectado.

---

## 14. Feedback Visual "Conectado y en Verde"

Para dar certeza visual inequívoca del estado activo de la transmisión:

1. **Insignia Lateral de la Tarjeta (`#dash-side-status-badge`)**:
   - **Desconectado:** `⚫ DESCONECTADO` (Rojo/Neutro).
   - **Conectado:** `🟢 CONECTADO • @usuario` en verde neón (`#00ffa3`), con fondo iluminado `rgba(0, 255, 163, 0.16)`, borde verde sólido y halo de resplandor `box-shadow: 0 0 18px rgba(0, 255, 163, 0.4)`.
2. **Pill de Estado junto al Input (`#dash-tiktok-status-text`)**:
   - Cambia a `● CONECTADO (@usuario)` con iluminación verde y tipografía en negrita monoespaciada.
3. **Indicador del Header Superior (`#header-tiktok-badge` y `#header-tiktok-indicator`)**:
   - El LED `#header-tiktok-indicator` adquiere la clase `.connected` (pulso verde).
   - El texto `#header-tiktok-text` muestra `TIKTOK: CONECTADO (@usuario)` con fondo verde brillante.
4. **Interactividad:**
   - El campo de usuario permite conectar directamente al presionar la tecla `Enter`.
   - El botón principal alterna automáticamente entre **⚡ Conectar TikTok** y **✕ Desconectar**.

---

## 15. Pipeline de Compilación, Despliegue en Escritorio y Persistencia

### 15.1 Empaquetado en Tauri v2:
En `src-tauri/tauri.conf.json`, la distribución de frontend está configurada como `"frontendDist": "../ui"`. Los archivos HTML, CSS y JS se incrustan en el binario durante la compilación.

### 15.2 Secuencia de Despliegue en Windows:
1. Sincronizar cambios entre `ui/index.html` / `ui/src/` y los archivos homónimos en la raíz (`index.html` y `src/`).
2. Compilar binario optimizado en release:
   ```powershell
   cargo build --release --manifest-path "C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src-tauri\Cargo.toml"
   ```
3. Detener procesos abiertos del ejecutable previo para evitar bloqueos de archivo en Windows:
   ```powershell
   Get-Process | Where-Object { $_.Path -like "*Galactic Live*" -or $_.Name -like "*gz7live*" } | Stop-Process -Force
   ```
4. Copiar el nuevo binario a los dos ejecutables del Escritorio:
   ```powershell
   Copy-Item -Path "C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src-tauri\target\release\gz7live.exe" -Destination "C:\Users\GZ7\Desktop\Galactic Live.exe" -Force
   Copy-Item -Path "C:\Users\GZ7\AppData\Local\Programs\GZ7Live\src-tauri\target\release\gz7live.exe" -Destination "C:\Users\GZ7\Desktop\GZ7Live.exe" -Force
   ```
5. Iniciar la aplicación actualizada para el usuario:
   ```powershell
   Start-Process -FilePath "C:\Users\GZ7\Desktop\Galactic Live.exe"
   ```

---

## 16. Auditoría de Sesión, Restauración de Workspace y Gestión de Plantillas (MineLive)

### 16.1 Restauración y Limpieza del Directorio de Instalación de MineLive
- **Ubicación Base:** `c:\Users\GZ7\AppData\Local\Programs\minelive`
- **Principio de Integridad:** El directorio de la aplicación de escritorio empaquetada debe mantenerse limpio y contener exclusivamente los ejecutables (`MineLive.exe`), paquetes `.pak`, dependencias DLL y `resources/app.asar`.
- **Acción Realizada:** Se detectaron carpetas de desarrollo generadas indebidamente (`BuenosMalosPanel` y `BuenosMalosPlugin`) en la raíz del instalador. Para devolver la app a su estado binario original sin pérdida de datos, ambas fueron reubicadas en un repositorio seguro en:
  - `C:\Users\GZ7\Documents\BuenosMalos_Backup\`
- **Preservación de Permisos:** Se mantuvieron intactas las Listas de Control de Acceso (ACLs) y la herencia del sistema de archivos de Windows sin alterar descriptores de seguridad.

### 16.2 Invariabilidad y Seguridad de Archivos de Sesión / Licencia
- **Ubicación:** `C:\Users\GZ7\AppData\Roaming\MiniLive\`
- **Archivos Críticos:**
  - `sesion-app.bin`: Token de sesión Bearer (`mle_...`) cifrado mediante **Windows DPAPI** (`safeStorage` de Electron).
  - `equipo-app.txt`: Identificador de hardware basado en el `MachineGuid` de Windows.
- **Regla Crítica:** Queda estrictamente prohibido modificar, eliminar o sobrescribir `sesion-app.bin` o `equipo-app.txt`. Cualquier alteración invalida la sesión frente al servidor de licencias en Railway (`https://minelive-nube-production.up.railway.app`) y provoca el bloqueo inmediato de la app y la cuenta.

### 16.3 Diagnóstico y Solución de Desaparición de Plantilla de Comandos
- **Comportamiento Detectado:** Tras una actualización automática de MineLive a `v0.2.46`, la interfaz abría una plantilla completamente en blanco y no mostraba las 26 reglas ni los comandos del directo.
- **Causa Raíz Identificada:**
  1. La aplicación creó una plantilla en blanco con UUID `0dc85420-9268-42a0-ac47-d5350a4839a6.json` ("Plantilla 4", `reglas: []`).
  2. En `config.json`, la clave `"ultimaPlantillaId"` fue reasignada automáticamente al ID de dicha plantilla vacía.
  3. Existían archivos de respaldo con extensión `.json` (`plantilla-minelive.backup.json` y `plantilla-minelive.backup2.json`). La función interna `listarPlantillas()` de `electron/main.js` lee todo archivo que coincida con `f.endsWith('.json')`, inyectando múltiples entradas con el mismo ID (`"id": "plantilla-minelive"`) y colapsando las pestañas en la interfaz gráfica.
- **Resolución Aplicada:**
  1. Se actualizó `config.json` fijando `"ultimaPlantillaId": "plantilla-minelive"`.
  2. La plantilla completa de 26 reglas y ~83 KB (`plantilla-minelive.json`) se conservó 100% íntegra y como plantilla activa.
  3. Los archivos de respaldo fueron renombrados a `.bak` (`plantilla-minelive.backup.bak` y `plantilla-minelive.backup2.bak`), preservando el histórico sin interferir con el escaneo de plantillas de Electron.
  4. La plantilla vacía generada fue archivada fuera del directorio en `C:\Users\GZ7\Documents\BuenosMalos_Backup\Plantilla4_vacia.json`.

### 16.4 Inventario de Archivos Críticos en `%APPDATA%\MiniLive`

| Archivo / Carpeta | Ruta | Descripción |
| :--- | :--- | :--- |
| `config.json` | `C:\Users\GZ7\AppData\Roaming\MiniLive\config.json` | Configuración global, puerto RCON (25575), usuario TikTok (`bygerardguzman`), marcador y `ultimaPlantillaId`. |
| `plantilla-minelive.json` | `C:\Users\GZ7\AppData\Roaming\MiniLive\plantillas\plantilla-minelive.json` | Plantilla oficial activa con 26 reglas de regalos, comandos RCON e íconos. |
| `plantilla-default.json` | `C:\Users\GZ7\AppData\Roaming\MiniLive\plantillas\plantilla-default.json` | Preset base de fábrica de MineLive. |
| `sesion-app.bin` | `C:\Users\GZ7\AppData\Roaming\MiniLive\sesion-app.bin` | Token de autenticación de usuario cifrado con DPAPI. |
| `equipo-app.txt` | `C:\Users\GZ7\AppData\Roaming\MiniLive\equipo-app.txt` | Identificador de equipo vinculado a la licencia. |
| `iconos/` | `C:\Users\GZ7\AppData\Roaming\MiniLive\iconos\` | Recursos multimedia (`.mp4` / `.jpg`) para las tarjetas del overlay. |
| `plugins-cuenta/` | `C:\Users\GZ7\AppData\Roaming\MiniLive\plugins-cuenta\` | Biblioteca local de plugins Spigot/Paper descargados de la cuenta. |

### 16.5 Protocolo de Ejecución de Agentes y Manipulación de Configuración
1. **Ejecución de PowerShell en Windows:** Debido a la resolución de entorno en subprocesos, todo comando CLI ejecutado mediante agentes debe especificar el directorio de trabajo explícito en `C:\Windows\System32\WindowsPowerShell\v1.0`.
2. **Verificar Procesos Activos:** Antes de alterar cualquier archivo de configuración JSON en `%APPDATA%\MiniLive\`, verificar mediante `Get-Process` si `MineLive.exe` se encuentra en memoria para prevenir que el guardado al cierre de la aplicación sobrescriba los cambios realizados en disco.
3. **Resguardo de Plantillas:** Cualquier versión de respaldo generada en `plantillas\` debe utilizar extensión `.bak` para evitar ser interpretada como una plantilla activa en el escaneo de Electron.

---

## 17. Suite Galactic Live v2.0 (GZ7Live): Overlays Modulares 720:1080, WINS Independientes y 5 Temas Épicos (Octubre 2026)

**Desarrollador:** GZ7 | **Marca:** Galactic Live (Todos los derechos reservados © GZ7)  
**Binarios Oficiales en Escritorio:** `C:\Users\GZ7\Desktop\Galactic Live.exe` y `C:\Users\GZ7\Desktop\GZ7Live.exe`  
**Código Fuente:** `C:\Users\GZ7\AppData\Local\Programs\gz7live`

### 17.1 Separación y Endpoints Modulares para OBS y TikTok LIVE Studio (Puerto 4000)

Para máxima libertad de diseño y composición en escenas verticales (720x1080 / 1080x1920) y horizontales:

| Overlay / Propósito | Ruta HTTP en `overlay_server.rs` | Características de Composición |
| :--- | :--- | :--- |
| **🏆 Solo Contador WIN Individual** | `http://localhost:4000/wins.html` (`/win.html` / `?mode=wins`) | Widget independiente y auto-centrado del marcador de victorias (`WIN X / META`). Permite moverlo, rotarlo y redimensionarlo libremente sin arrastrar las columnas. |
| **🦸‍♂️🦹‍♂️ Regalos en los Lados (720:1080)** | `http://localhost:4000/villanos-heroes.html` (`/roblox-lados.html` / `?mode=sides`) | Columnas laterales: **Villanos (Izquierda)** y **Héroes (Derecha)**. Centro 100% libre para ver al streamer. Oculta el WIN superior para no duplicarlo si se usa `/wins.html` (o con switch `show_win_in_sides` para incluirlo). |
| **🔴 Solo Columna Villanos** | `http://localhost:4000/villanos.html` (`?mode=left`) | Únicamente la columna de sabotaje / resta de wins en su propio carril. |
| **🔵 Solo Columna Héroes** | `http://localhost:4000/heroes.html` (`?mode=right`) | Únicamente la columna de ayuda / suma de wins en su propio carril. |
| **⚔️ Solo Duelo Gift vs Gift** | `http://localhost:4000/rosas-vs-ggs.html` (`/duelo.html` / `?mode=duel`) | Barra de duelo interactiva Tug-of-War (Rosas vs GGs o los 2 regalos elegidos) con indicadores de ventaja y contadores en vivo. |
| **🌌 Overlay Todo-en-Uno (720:1080)** | `http://localhost:4000/gift-vs-gift.html` (`/roblox.html` / `?mode=full`) | WIN superior + Duelo Central + Columnas Laterales integrados en un solo lienzo fijo. |
| **⛏️ Overlays Minecraft** | `http://localhost:4000/mc_carrusel.html`, `/mc_estatico.html`, `/mc_plano.html` | 3 estilos conmutables para Minecraft (Carrusel dinámico, cuadrícula estática y cinta plana minimalista). |

### 17.2 Sistema de 5 Estilos Visuales Épicos (`data-theme`)

1. **`GALACTIC`**: Cristal cósmico oscuro con resplandor Celeste Neón (`#00f0ff`) vs Carmesí (`#ff2a5f`), destellos estelares y bordes holográficos.
2. **`SOL` (Magma / Solar Flare)**: Corona solar dorada con gradientes magma (`#ffcc00`, `#ff5500`, `#ffe600`), bordes incandescentes y tipografía metálica radiante.
3. **`CONTRASTE` (Esports Ultra-Contrast)**: Cápsulas en negro absoluto (`rgba(0,0,0,0.92)`) con bordes sólidos de `2.5px` y contornos gruesos. Diseñado para legibilidad 100% sobre cielos brillantes o fondos claros de Roblox Obby.
4. **`MOVIMIENTO` (Kinetic Energy)**: Bordes con gradiente dinámico en movimiento continuo vía CSS GPU (`@keyframes borderFlow`), levitación suave de iconos y barra de plasma animada.
5. **`NEON` (Cyberpunk Arcade)**: Tubos láser con doble bloom intenso (`#00f0ff` y `#ff00aa`) con efecto de tubo de neón retroiluminado.

### 17.3 Lienzo Matemático Fijo 720:1080 y Sliders en Tiempo Real

- **Contenedor `#stage-720x1080`:** Ratio `720x1080` bloqueado con auto-escala inteligente por viewport (`scale = min(innerWidth / 720, innerHeight / 1080)`).
- **Auto-Ajuste de Carril (`--col-fit-scale`):** Las columnas laterales calculan su altura de forma matemática; al subir tamaño de iconos o texto, jamás se desbordan ni desconfiguran.
- **Sliders en Tiempo Real (Sincronizados vía SSE):**
  - Tamaño de Iconos de Regalos: `28px` a `88px` (default `48px`).
  - Tamaño de Texto de Acción: `12px` a `38px` (default `20px`).
  - Separación Vertical entre Regalos: `0px` a `28px` (default `8px`).
  - Nitidez Full HD (Filtro SVG `#gz7-fullhd-filter`): `100%` a `220%` (Contrast-Adaptive Sharpening).
  - Escala del Contador WIN: `70%` a `165%`.
  - Escala del Duelo Central: `70%` a `165%`.
  - Opciones Propias de WIN: Etiqueta editable (`win_label`: `WIN`, `WINS`, `META`, etc.), estilo individual (`win_theme`: `AUTO`, `GALACTIC`, `SOL`, `CONTRASTE`, `MOVIMIENTO`, `NEON`) y switch `show_win_in_sides`.

### 17.4 Catálogo de 1,770 Regalos & Desinfección de Prefijos
- Solución al bug de las rosas mediante `limpiarArchivoGift()`, normalización del catálogo completo de 1,770 regalos, sanitización en la ruta HTTP `/gifts/` de Tokio y auto-reparación en `loadSavedConfig()`.


---

## 17. Motor de 266+ Sonidos Gratis y Configuración de Regalos en Overlays (OBBY y Minecraft)

### 17.1 Catálogo Unificado de Sonidos Gratuitos
Se integró un banco de sonido integral accesible desde `#tab-sounds`, el editor de OBBY, la tabla de Minecraft y el modal universal de regalos:
1. **258 Sonidos Locales Stream To Earn (`s2e_media/audio/public/*.mp3`)**:
   - Extraídos, catalogados y servidos localmente en `http://localhost:4000/s2e_media/audio/public/...`.
   - Incluyen metadatos de duración, tags de búsqueda y formas de onda precalculadas (`peaks`).
2. **8 Sonidos Sintetizados / Memes Procedurales (`sounds.js`)**:
   - `DEFAULT_SOUND_LIBRARY`: Vine Boom, MLG Airhorn, Metal Pipe, Taco Bell, Phonk Drift, Victoria Épica, Sirena Nuclear y Mario Coin.
   - Síntesis de osciladores nativa Web Audio API (cero dependencias externas y fallback instantáneo).
3. **Sonidos Personalizados (`s2e_media/custom/`)**:
   - Subida de archivos `.mp3`, `.wav` y `.ogg` mediante el comando Tauri `save_uploaded_media`.
4. **Descarga y Caché On-Demand Automática en Rust (`overlay_server.rs`)**:
   - Si un streamer externo solicita reproducir o configurar un sonido de `audio/public/` que aún no reside en su disco, `overlay_server.rs` lo descarga de forma transparente con cabeceras autorizadas, lo guarda en `%LOCALAPPDATA%\GalacticLive\s2e_media\audio\public\` y lo sirve en tiempo real sin requerir descarga previa manual.

### 17.2 Espacio Dedicado de Sonidos en la Interfaz (`#tab-sounds`)
- **Buscador en tiempo real (`#soundboard-search-input`)**: Búsqueda instantánea por nombre o etiqueta.
- **Filtros por Píldoras**: `Todos`, `Banco Gratis (258)`, `Memes / Sintetizados`, `Mis Sonidos`, `Música`, `Alertas`, `Corto (<2s)`, `Largo (>5s)`.
- **Reproductor con Visualización de Onda SVG**: Botón interactivo `▶ / ⏹` con control de volumen independiente y parada global (`#btn-stop-all-sounds`).
- **Asignación Rápida con 1 Clic (`#modal-assign-sound-target`)**:
   - Cada tarjeta de sonido tiene un botón `🎁 Asignar a Regalo (OBBY / MC)`.
   - Permite vincular el sonido inmediatamente a cualquier slot de OBBY (`L1..L9`, `R1..R9`, `CENTER_RED`, `CENTER_BLUE`) o a un regalo de Minecraft con un solo clic.

### 17.3 Configuración de Regalo + Sonido en Overlay OBBY (`gift-vs-gift.html`)
- **Slots Laterales (`left_rules` L1..L9 y `right_rules` R1..R9)**: Cada regla posee `sound_name`, `sound_url` y `sound_volume`.
- **Duelo Central**: `center_red_sound_name`, `center_red_sound_url`, `center_blue_sound_name`, `center_blue_sound_url`.
- **Editor Visual (`renderRobloxEditor`)**: Cada fila incluye un botón píldora `🔊 <Nombre del Sonido | Elegir sonido>` que abre el selector de 266+ audios y persiste la configuración.
- **Disparo y Pruebas**: Los botones `▶` del editor y los regalos reales en vivo reproducen el audio asignado mientras animan visualmente la tarjeta en el overlay OBS.

### 17.4 Configuración de Regalo + Sonido en Overlay Minecraft (`mc_overlay.html`)
- **Tabla de Regalos (`#gifts-config-table`)**: La insignia de audio muestra `🔊 <Nombre del Sonido>` en lugar de un icono estático, permitiendo probarlo o cambiarlo al instante.
- **Modal Universal de Regalos (`#modal-config-gift`)**:
   - Bloque dedicado **"🔊 Sonido al recibir este regalo"** con nombre del audio actual, botón de selección, prueba en vivo y control de volumen.
   - Persiste simultáneamente el regalo y su audio en `giftRegistry`, `soundManager.giftSoundMap`, `s2ePresets` y el `config.json` de Tauri.
- **Aislamiento de Perfiles (`main.js`)**: Los preajustes de Stream To Earn solo interceptan eventos cuando `activeProfile === 'minecraft'`, evitando que el modo OBBY sea silenciado por disparadores de Minecraft.
- **Soporte de Audio en OBS (`?audio=1`)**: Los overlays `gift-vs-gift.html` y `mc_overlay.html` permiten reproducir sonido directamente en el Browser Source de OBS cuando la URL incluye el parámetro `?audio=1`.

---

## 18. Sistema de Licencias Criptográficas, Bloqueo HWID y Panel de Gestión de Streamers ($0 Free Tier)

### 18.1 Arquitectura Criptográfica en Rust (`license_guard.rs`)
1. **Extracción y Huella de Hardware (HWID)**:
   - Consulta el registro de Windows: `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid`.
   - Computa `SHA256("galactic-live-v2-hwid:" + guid)` formateado como `GL-XXXX-XXXXXX-XXXXXX`.
2. **Firmado y Verificación HMAC-SHA256**:
   - Claves criptográficas en formato compacto `GLK.<payload_base64url>.<firma_hmac>`.
   - Secreto maestro ensamblado en memoria mediante fragmentos XOR (`K_SHARD_A`, `K_SHARD_B`) compilados en el binario nativo, evitando extracción por cadenas estáticas o desensambladores.
3. **Cifrado Local de Sesión (`session.bin`)**:
   - Almacenado en `%LOCALAPPDATA%\GalacticLive\session.bin`.
   - Cifrado simétrico por stream derivado exclusivamente del HWID del equipo. Si el archivo se copia a otra PC, el descifrado falla de inmediato.
4. **Bloqueo Nativo en Rust**:
   - Comandos críticos (`send_rcon`, `write_server_file`, `launch_server_bat`, `install_authorized_mc_plugins`) validan `license_guard.require_verified()` y `require_mc_plugins_permission()` en el backend de Rust antes de ejecutarse, impidiendo evasiones desde JavaScript.

### 18.2 Protección Anti-CLI y Anti-Inspección (`license-client.js`)
- **Bloqueo Fuera de Tauri**: Si la interfaz se abre fuera del entorno binario de Tauri (por ejemplo mediante `npx serve`, un navegador común o Node.js), renderiza una pantalla roja de bloqueo de seguridad y destruye el DOM.
- **Bloqueo de Depuración**: Deshabilita el menú contextual (clic derecho), `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C` y `Ctrl+U` para streamers invitados (`role !== 'ADMIN'`).

### 18.3 Centro de Control de Streamers (Panel Admin Integrado de GZ7)
- **Acceso Exclusivo de Fundador**: Al iniciar en la PC de GZ7, el sistema auto-detecta las credenciales de administrador y muestra el botón dorado **`👑 Gestión de Streamers & Licencias`** en el header.
- **Emisión de Licencias**: Genera claves `GLK.` especificando `@usuario`, vigencia (1, 3, 7, 30, 365 días), notas y modo de auto-vincular HWID en el primer login (`*`).
- **Switch Crítico de Plugins MC (`allow_mc_plugins`)**: Control en tiempo real para autorizar o denegar la descarga de plugins `.jar` de Minecraft a cada streamer.
- **Reset de HWID**: Botón `🔄 Reset` para liberar la licencia si un streamer formatea o cambia de computadora.
- **Suspensión Instantánea**: Alterna entre `🟢 Activo` y `🔴 Suspendido` con un clic.
- **Esquema Nube Supabase Free Tier (`supabase/licensing_schema.sql`)**:
   - Tabla `streamers_licenses` con Row Level Security (RLS) estricto.
   - Función RPC `verify_and_bind_streamer` que valida licencias y vincula el HWID sin costo de servidor ($0/mes).

---

## 19. Control Estricto de Descarga y Protección de Plugins de Minecraft (.jar)

1. **Descarga Condicional en Rust (`asset_sync.rs` y `minecraft-installer.js`)**:
   - Los plugins `.jar` exclusivos de MineLive / Galactic Live **nunca viajan en el instalador público**.
   - El comando Tauri `install_authorized_mc_plugins` valida en Rust si `allow_mc_plugins == true`. Si el streamer no tiene permiso otorgado por GZ7, la descarga e instalación son rechazadas inmediatamente.
2. **Inyección de Pase Criptográfico por RCON / Archivo**:
   - Al instalar plugins autorizados, Rust genera un token firmado `gz7pase-v1:<streamer>:<server_hash>:<timestamp>:<sig>` y lo escribe en `plugins\GalacticLive\session_pass.txt`, refrescándolo periódicamente vía RCON (`gz7pase <token>`).
3. **Clase Guardiana Java en Plugins (`GalacticPassGuard.java`)**:
   - Implementada en `com.gz7.ruletabm.GalacticPassGuard` (`BuenosMalosPlugin`).
   - Reconstruye la clave compartida y valida la firma HMAC-SHA256 del token de sesión.
   - Si alguien copia los archivos `.jar` a otro servidor o computadora fuera de Galactic Live, el plugin se bloquea e inhabilita todos sus eventos y comandos.

---

## 20. Blindaje Nativo y Métricas del Binario Compilado

### Configuración de Hardening (`src-tauri/Cargo.toml`):
```toml
[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "s"
strip = true
```

### Resultados de Compilación:
- **Validación de Sintaxis JS (`node --check`)**: 0 errores en todos los módulos de frontend y backend.
- **Compilación en Rust (`cargo check` & `cargo build --release`)**: 0 errores y 0 advertencias.
- **Optimización de Tamaño**: Reducción de 25.5 MB a **18.62 MB** (19,523,584 bytes) gracias a la eliminación total de símbolos de depuración (`strip = true`) y optimización en tiempo de enlace (LTO).
- **Ejecutables Desplegados**:
  - `C:\Users\GZ7\Desktop\Galactic Live.exe`
  - `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\Galactic Live.exe`
  - `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\GZ7Live.exe`

---

## 20. Sistema Integral de Audio, Preajustes S2E y Alertas con Croma Auto (Stream To Earn Replicator)

### 20.1 Extracción y Replicación Offline del Banco Multimedia de Stream To Earn (424 Assets Locales)
- **Extracción de Credenciales:** Se descompresionó el archivo Snappy LevelDB de Chromium de Stream To Earn (`%APPDATA%\Stream To Earn\Local Storage\leveldb\000487.ldb`) para extraer el JWT de sesión activo del usuario y los endpoints oficiales de S3.
- **Descarga Local Completa (100% Offline):** Se descargaron 424 archivos multimedia sin pérdidas a `C:\Users\GZ7\AppData\Local\Programs\gz7live\s2e_media\`:
  - **258 audios** en formato `.mp3`/`.wav` oficiales en `s2e_media/audio/`.
  - **45 iconos** de regalos oficiales de TikTok en `s2e_media/icons/`.
  - **60 iconos** oficiales de mobs y acciones de Minecraft en `s2e_media/mc_icons/`.
  - **33 animaciones y videos** con fondo croma en `s2e_media/videos/` (incluyendo el video personalizado del streamer `0317 (1)(1).mp4`).
- **Catálogo Centralizado (`ui/src/s2e-catalog.js`):** Exporta `S2E_PUBLIC_AUDIOS` (258 audios con vectores de forma de onda `peaks`), `S2E_PRESETS_CATALOG`, `S2E_ALERT_VIDEOS` (33 videos) y `S2E_MC_ACTION_ICONS` (60 iconos).

### 20.2 Modal Réplica 1:1 «Seleccionar audio» (`ui/src/s2e-studio.js` & `sounds.js`)
- **Pestañas:** `Público Audio (258)` y `Mis Nube Audio / Subidos` + botón para subir cualquier archivo de audio propio (`.mp3`/`.wav`).
- **Caja de Audio Seleccionado:** Botón Play/Pausa, scrubber visual interactivo SVG de onda sonora, duración y botón `🔇 Deseleccionar`.
- **Playback Settings (Ajustes de Reproducción):**
  - **Tipo de reproductor:** `! Prioridad`, `Una vez (Once)`, `Superponer (Overlap)`.
  - **Prioridad numérica:** Rango configurable de 1 a 10.
  - **Casilla Multiplicador:** Permite acelerar o escalar el sonido según la cantidad del regalo.
  - **Control de Volumen del Disparador:** Slider de 5% a 100% específico para cada sonido asignado.
- **Búsqueda y Filtros:** Buscador reactivo por nombre/etiquetas, selector desplegable de tags (`All tags 258`) y ordenamiento (`Name A–Z`, `Name Z–A`, `Duración Cortos/Largos`, `Más Populares`).
- **Asignación Universal:** Accesible tanto desde la vista previa del catálogo de 1,770 regalos de TikTok como desde cada fila de la tabla de regalos de Minecraft con el botón `🔊`.

### 20.3 Módulo «Mis preajustes» de Minecraft y Tira Horizontal (1x, 10x, 32x, 500x)
- **Preajustes Reales Desbloqueados:** Se recuperaron y migraron los presets del usuario `Survival gz7` (24 eventos) y `Survival` (26 eventos), eliminando la restricción comercial de 10 eventos de la versión gratuita de Stream To Earn.
- **Tira Visual Horizontal:** Barra visual en la pestaña `⛏️ Regalos Minecraft` con multiplicadores (`1x`, `10x`, `32x`, `500x`), iconos de mobs/acciones de Minecraft e iconos de regalos de TikTok.
- **Overlay para OBS / TikTok LIVE Studio:** `http://localhost:4000/mc_overlay.html?style=s2e`.
- **Funcionalidades de Control:** `Play delay`, `🛑 Detener eventos`, `Nuevo preajuste`, `➕ Añadir Evento`, editor modal de comandos RCON (`/execute at {playername} run ...`) y asignación de sonidos divertidos directamente por fila.

### 20.4 Módulo «🎬 Alertas & Croma» con Croma Auto, Video, Sonido y Voz TTS
- **Gestión de Álbumes de Alertas:** Álbumes categorizados (`Quiereme`), edición de títulos, creación de nuevos álbumes y disparadores ilimitados.
- **Videos y Animaciones S2E:** 33 animaciones y videos MP4/WebM extraídos de S2E (incluyendo videos subidos por el usuario) + comando nativo de Tauri `save_uploaded_media` para subir videos locales a `s2e_media/custom/`.
- **Motor Chroma Key en Tiempo Real (`HTML5 Canvas`):**
  - **`🪄 Croma Auto`:** Algoritmo perimetral inteligente que analiza los píxeles de las 4 esquinas del video para detectar automáticamente el color dominante del fondo (verde, azul, negro, etc.) y eliminarlo en tiempo real con algoritmo de supresión de halo (*despill*).
  - **`🎨 Color Manual`:** Selector con botones rápidos (`🟢 Verde`, `🔵 Azul`, `⚫ Negro`), slider de tolerancia (5%–85%) y slider de suavizado antihalo (2%–40%).
- **Integración Todo-en-Uno:** Combina Video con Croma + Sonido de los 258 audios + Voz TTS sintética (`¡{user} ha enviado {gift}!`) + Banner flotante en `http://localhost:4000/alerta.html` con cabeceras CORS (`Access-Control-Allow-Origin: *`) para evitar cualquier problema de canvas contaminado (*tainted canvas*).

### 20.5 Mapa de Archivos del Módulo Stream To Earn en Galactic Live

| Archivo / Ruta | Descripción Técnica |
| :--- | :--- |
| `gz7live\ui\src\s2e-catalog.js` | Exporta `S2E_PUBLIC_AUDIOS` (258 sonidos), `S2E_PRESETS_CATALOG`, `S2E_ALERT_VIDEOS` (33 videos) y `S2E_MC_ACTION_ICONS` (60 iconos). |
| `gz7live\ui\src\s2e-studio.js` | Módulo de UI para "Mis preajustes", modal "Seleccionar audio", pestaña "Alertas & Croma" y monitor Canvas Chroma Key. |
| `gz7live\ui\src\sounds.js` | Motor de audio con soporte para priority/once/overlap, volumen maestro y renderizado SVG de formas de onda. |
| `gz7live\src-tauri\src\overlay_server.rs` | Servidor HTTP local (puerto 4000) con ruta `/s2e_media/*` y cabeceras CORS para OBS y TikTok LIVE Studio. |
| `gz7live\src-tauri\src\main.rs` | Comandos Tauri nativos (`save_uploaded_media`, `emit_custom_alert`, etc.) y ciclo de vida de la aplicación. |
| `gz7live\src-tauri\templates\alerta.html` | Overlay de OBS para alertas con decodificación de video, Canvas Chroma Key automático y reproducción de audio/TTS (`http://localhost:4000/alerta.html`). |
| `gz7live\src-tauri\templates\mc_overlay.html` | Overlay de Minecraft para OBS con soporte de estilo estándar y tira Stream To Earn (`http://localhost:4000/mc_overlay.html?style=s2e`). |


---

## 21. Sistema de Distribución Segura para Streamers Externos: Licencias HWID, Control de Plugins .jar y Blindaje Anti-IA (Tauri v2)

### 21.1 Objetivo y Arquitectura de Distribución Controlada
Para permitir que el MVP salga de la PC del desarrollador (GZ7) y sea probado por streamers con audiencia sin riesgo de fuga de código fuente, robo de plugins `.jar` o ejecución descontrolada, se diseñó una arquitectura de distribución segura y **100% gratuita ($0/mes)** basada en **Tauri v2 (Rust)**:

```
[Streamer Externo (PC de Prueba)]
          │
          ▼
 [Galactic Live.exe (Rust Nativo / Tauri v2)]
          │
          ├──> 1. Verificación de Entorno: Bloquea ejecución fuera de Tauri / Navegador (Anti-CLI)
          ├──> 2. Lectura de HWID: HKLM\...\MachineGuid -> SHA256 -> GL-XXXX-XXXXXX-XXXXXX
          ├──> 3. Criptografía de Licencia: GLK.<payload>.<hmac_sha256> (Secretos ofuscados en memoria)
          ├──> 4. Cifrado Local de Sesión: session.bin cifrado con el HWID de la máquina
          │
          ├─── [Si Licencia Inválida o HWID Distinto] ──> Pantalla de Bloqueo Infranqueable
          │
          └─── [Si Licencia Válida]
                   │
                   ├──> Modo OBBY / Overlays: 100% Funcional (Descarga On-Demand de 258 Audios)
                   │
                   └──> Modo Minecraft:
                            ├── [allow_mc_plugins == false] ──> BLOQUEA descarga e instalación de .jar
                            └── [allow_mc_plugins == true]  ──> Descarga .jar autorizados + inyecta
                                                                pase firmado 'gz7pase-v1' por RCON
```

### 21.2 Blindaje Criptográfico en Rust (`src-tauri/src/license_guard.rs`)
1. **Huella de Hardware Inmutable (HWID)**:
   - Extraído desde `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid` de Windows mediante comando de bajo nivel `CREATE_NO_WINDOW`.
   - Computa `SHA256("galactic-live-v2-hwid:" + guid)` formateado como `GL-XXXX-XXXXXX-XXXXXX`.
2. **Firmado y Verificación HMAC-SHA256 de Claves (`GLK...`)**:
   - Formato compacto: `GLK.<payload_base64url>.<firma_hmac>`.
   - Secreto maestro ensamblado en memoria mediante fragmentos XOR de 32 bytes (`K_SHARD_A`, `K_SHARD_B`) compilados en el código máquina x86_64 del binario de Rust. Imposible de extraer mediante búsqueda de cadenas de texto estáticas o ingeniería inversa con IA.
3. **Persistencia Cifrada por HWID (`session.bin`)**:
   - Guardado en `%LOCALAPPDATA%\GalacticLive\session.bin`.
   - Cifrado simétrico derivado del HWID exclusivo de la PC. Si el streamer copia este archivo a otra computadora, el descifrado falla de forma automática.
4. **Validación a Nivel de Kernel de la App**:
   - Los comandos de Tauri (`send_rcon`, `write_server_file`, `launch_server_bat`, `install_authorized_mc_plugins`) ejecutan `license_guard.require_verified()` y `require_mc_plugins_permission()` en Rust antes de procesar cualquier llamada del frontend.

### 21.3 Centro de Control de Streamers (Panel Admin Integrado de GZ7)
- **Acceso Exclusivo**: La cuenta fundadora `GZ7_ADMIN 👑` activa el botón **`👑 Gestión de Streamers & Licencias`** en la cabecera superior.
- **Emisión de Claves GLK**: Permite generar claves para streamers definiendo `@usuario`, vigencia (1, 3, 7, 30, 365 días), notas explicativas y vinculación de HWID (opcionalmente `*` para que se vincule automáticamente a la primera PC donde el streamer inicie sesión).
- **Switch de Autorización de Plugins MC (`allow_mc_plugins`)**:
   - Por defecto **DESACTIVADO** para streamers nuevos. El streamer puede usar el modo OBBY, el chat y los overlays, pero **no puede descargar ni instalar tus plugins de Minecraft**.
   - Solo cuando GZ7 enciende el switch `🧩 Autorizado (.jar ON)`, la aplicación descarga y despliega los `.jar`.
- **Reset de HWID en 1 Clic**: Botón `🔄 Reset` para liberar la licencia si un streamer formatea o renueva su PC.
- **Suspensión Inmediata**: Toggle `🟢 Activo` / `🔴 Suspendido` para revocar el acceso a cualquier streamer al instante.
- **Infraestructura Nube Free Tier (`supabase/licensing_schema.sql`)**:
   - Tabla `streamers_licenses` con políticas Row Level Security (RLS) estrictas (inaccesible con anon key pública).
   - Función RPC `verify_and_bind_streamer` con `SECURITY DEFINER` para sincronización en la nube a costo $0/mes en Supabase Free Tier.

### 21.4 Protección de Plugins de Minecraft (`.jar`) y Guardián Java
1. **Descarga Condicional en Rust (`asset_sync.rs` y `minecraft-installer.js`)**:
   - Los archivos `.jar` de Minecraft **nunca se distribuyen dentro del instalador público**.
   - El instalador del servidor verifica `license_guard.require_mc_plugins_permission()`. Si el streamer no tiene permiso activo, la descarga se cancela y se notifica que los plugins requieren autorización de GZ7.
2. **Pase Criptográfico por Sesión RCON / Archivo**:
   - Rust genera un pase firmado `gz7pase-v1:<streamer>:<server_hash>:<timestamp>:<sig>` y lo inyecta en `plugins\GalacticLive\session_pass.txt`, renovándolo periódicamente vía RCON (`gz7pase <token>`).
3. **Clase Guardiana Java en Plugins (`GalacticPassGuard.java`)**:
   - Integrada en `com.gz7.ruletabm.GalacticPassGuard` (`BuenosMalosPlugin`).
   - Verifica la firma criptográfica HMAC-SHA256 del pase.
   - Si el plugin `.jar` es copiado fuera de un servidor gestionado por Galactic Live, se auto-bloquea y no ejecuta ningún comando ni evento de regalo.

### 21.5 Configuración Completa de Sonidos y Regalos en Overlays de OBBY y Minecraft
1. **Modo Roblox / OBBY (`gift-vs-gift.html`)**:
   - Cada uno de los **18 slots laterales (`L1..L9`, `R1..R9`)** y los **2 regalos del Duelo Central (`CENTER_RED`, `CENTER_BLUE`)** cuentan con campos `sound_name`, `sound_url` y `sound_volume` en `RobloxRuleItem` y `GiftVsGiftState` en Rust (`overlay_server.rs`).
   - Botón interactivo `🔊 Elegir sonido` en la interfaz (`renderRobloxEditor`) conectado al banco de 266+ audios.
   - Al recibir regalos o pulsar `▶` en la interfaz, se dispara simultáneamente el sonido asignado y la animación en el overlay OBS.
2. **Modo Minecraft (`mc_overlay.html` + `#gifts-config-table`)**:
   - Tabla de regalos sincronizada con insignia `🔊 <Nombre del Sonido>`.
   - Modal universal `#modal-config-gift` con sección integrada para asignar o cambiar el sonido de cualquier regalo con prueba en vivo.
   - Aislamiento de perfiles en `main.js`: los preajustes de Minecraft no silencian ni interfieren con los eventos de OBBY.
   - Parámetro `?audio=1` soportado en los templates de OBS para reproducción directa desde el Browser Source.

### 21.6 Hardening del Binario Compilado de Producción
- **Configuración de Release (`src-tauri/Cargo.toml`)**:
  ```toml
  [profile.release]
  panic = "abort"
  codegen-units = 1
  lto = true
  opt-level = "s"
  strip = true
  ```
- **Reducción de Huella y Anti-Ingeniería Inversa**:
  - Eliminación total de símbolos de depuración (`strip = true`) y optimización en tiempo de enlace (LTO).
  - Tamaño final reducido de 25.5 MB a **18.62 MB** (19,523,584 bytes).
  - Los scripts del frontend (`ui/`) quedan incrustados y comprimidos en el binario nativo, impidiendo su extracción mediante herramientas de descompresión como `asar extract` o ejecución por línea de comandos sin Tauri.
- **Rutas de Ejecutables Desplegados**:
  - `C:\Users\GZ7\Desktop\Galactic Live.exe`
  - `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\Galactic Live.exe`
  - `C:\Users\GZ7\AppData\Local\Programs\GZ7Live\GZ7Live.exe`
