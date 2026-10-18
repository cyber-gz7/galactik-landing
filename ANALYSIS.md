# REVERSE ENGINEERING ANALYSIS: STREAM TO EARN (1.21.11 / 1.21) & MINELIVE ECOSYSTEM

## 1. Resumen Ejecutivo y Rutas de Instalación

El análisis de ingeniería inversa de la plataforma **Stream To Earn** y su comparativa con la arquitectura de **MineLive / GalacticLive** revela una arquitectura cliente-servidor híbrida basada en Electron, WebSockets locales, túneles RCON y plugins nativos Bukkit/Paper.

### 1.1 Localización de Archivos en el Entorno
- **Directorio de Instalación (Binarios Electron):**  
  `C:\Program Files\Stream To Earn\`
  - Paquete principal: `resources\app.asar` (45.4 MB, 6,216 archivos internos)
- **Almacenamiento Local y Caché de Presets (LevelDB):**  
  `C:\Users\GZ7\AppData\Roaming\Stream To Earn\Local Storage\leveldb\`
  - Claves críticas: `presets_cache_v1:anonymous:*`, `s2e_custom_gifts`
- **Servidor Minecraft Generado y Descargas:**  
  `C:\Users\GZ7\Videos\minecraftServer\`
  - Archivos de núcleo: `paper-1.21-130.jar`
  - Plugins descargados: `plugins\s2e-survival.jar`, `plugins\ViaVersion-5.8.0.jar`
- **Carpeta de Extracción Dedicada (Workspace):**  
  `./extracted_stream_to_earn_1.21.11/`

---

## 2. Topología de Red y Puertos Locales

Stream To Earn opera mediante una serie de servicios interconectados en bucle local (`127.0.0.1` / LAN):

| Puerto | Protocolo | Servicio / Componente | Función Técnica |
|---|---|---|---|
| `7704` | WebSocket (WS) | `src/socket/socketConnector.js` | Canal IPC bidireccional entre la UI de Stream To Earn, el launcher y el controlador móvil. Recibe comandos `mc_command`, envía logs y sincroniza estado. |
| `7705` | HTTP / Express | `src/webServer/appStaticServer.js` | Servidor estático en LAN para la SPA del controlador móvil y proxy inverso de medios S3 (`/media/*` -> `streamtoearnprod1.s3.eu-central-1.amazonaws.com`). |
| `25565` | TCP (Minecraft) | Servidor PaperMC 1.21 | Puerto de juego estándar donde se conectan el streamer y los jugadores. |
| `25575` | TCP (RCON) | Minecraft Remote Console | Protocolo de ejecución remota de comandos de consola mediante autenticación con contraseña. |

### 2.1 Protocolo de Mensajería WebSocket (Puerto 7704)
El servidor WebSocket de Stream To Earn autentica clientes con los siguientes tipos de mensajes:
- `launcher_connect` / `handshake`: Registra clientes tipo `launcher` o `mobile-controller`.
- `mc_command`: Ejecuta un comando directamente en `stdin` del proceso de Minecraft (`minecraftProcess.stdin.write(command + '\n')`).
- `get_minecraft_status`: Retorna estado `{ isRunning, serverPath, serverXmx, serverXms }`.
- `win` / `lose`: Notificaciones de fin de partida.

---

## 3. Análisis Forense de `s2e-survival.jar`

El plugin central de Stream To Earn para Minecraft es `s2e-survival.jar` (98.3 KB).

### 3.1 Manifiesto del Plugin (`plugin.yml`)
- **Nombre:** `s2e-survival`
- **Versión:** `1.1.0`
- **Clase Principal:** `io.streamtoearn.s2e_survival.S2e_survival`
- **API Version:** `1.21`
- **Ofuscación:** Bytecode ofuscado con algoritmo de renombrado Allatori/ZKM (`llllIlIIII...`, `IllIll...`).

### 3.2 Canal de Mensajería Saliente (Plugin Messaging Channel)
Al iniciar (`onEnable`), el plugin registra el siguiente canal nativo de Minecraft:
```java
getServer().getMessenger().registerOutgoingPluginChannel(this, "livetiktok:overlay");
```
Este canal transmite paquetes de bytes personalizados a mods de cliente o overlays conectados que escuchen el namespace `livetiktok:overlay`.

### 3.3 Eventos de Minecraft Interceptados (Listeners)
El plugin implementa `org.bukkit.event.Listener` y captura los siguientes eventos del ciclo de juego:
1. `EntityDamageByEntityEvent`: Detecta daño entre entidades (jugador vs monstruos o PvP de donadores).
2. `PlayerDeathEvent`: Registra la muerte del jugador y resetea rachas o metas.
3. `EntityExplodeEvent`: Controla la destrucción de bloques producida por TNT y creepers generados por donaciones.
4. `PlayerRespawnEvent`: Re-aplica efectos o equipamiento inicial tras reaparecer.
5. `EntityDeathEvent`: Captura la muerte de monstruos o jefes (Warden, Wither, zombies de donador) para premiar o actualizar contadores.
6. `FoodLevelChangeEvent`: Gestiona la pérdida de hambre (`/survival regeneat`).

### 3.4 Registro Completo de Comandos (`/survival`)
El plugin centraliza todas sus acciones bajo el comando `/survival <subcomando> [parámetros]`:

```
/survival apple_enchanted <name>       - Entrega manzana dorada encantada
/survival bow <name>                   - Entrega arco con encantamiento Infinidad
/survival random_sword <name>          - Entrega espada aleatoria con Filo III
/survival totem <name>                 - Entrega Tótem de la Inmortalidad
/survival random_armor <name>          - Entrega armadura aleatoria con Protección III
/survival tools <name>                 - Entrega herramientas de netherite
/survival random_food <name>           - Entrega 10 carnes cocinadas aleatorias
/survival enderpearls <name>           - Entrega 16 perlas de ender
/survival creeper <name>               - Spawnea creeper hostil hacia el jugador
/survival creeper_charged <name>       - Spawnea creeper eléctrico
/survival evoker <name>                - Spawnea un invocador
/survival ghast <name>                 - Spawnea un ghast hostil
/survival random_boss <name>           - Spawnea jefe aleatorio
/survival skeleton <name>              - Spawnea esqueleto con arco
/survival witch <name>                 - Spawnea bruja hostil
/survival zombie <armor> <name>        - Spawnea zombie con armadura especificada
/survival bee <name>                   - Spawnea abeja hostil
/survival blaze <name>                 - Spawnea blaze
/survival ravager <name>               - Spawnea devastador (ravager)
/survival piglin <name>                - Spawnea piglin hostil
/survival pit <width> <height> <name>  - Genera un pozo bajo el jugador
/survival clear_inventory <name>       - Vacía el inventario
/survival trap <name>                  - Encierra al jugador en estructura 4x4 de telarañas
/survival kill <name>                  - Mata a los jugadores en el servidor
/survival lightning <name>             - Invoca un rayo sobre los jugadores
/survival raid <name>                  - Inicia una invasión (raid) completa
/survival tntbox <name>                - Caja de TNT con creepers alrededor
/survival water_drop <name>            - Teletransporta al jugador 200 bloques arriba con cubeta de agua
/survival bee_cage <name>              - Jaula de miel con abejas agresivas
/survival obsidian_box <name>          - Caja de obsidiana alrededor del streamer
/survival stopmove <name>              - Congela el movimiento durante 10 segundos
/survival lavapit <name>               - Genera foso de lava bajo los pies
/survival spider <name>                - Spawnea araña hostil
/survival zombiegiant <name>           - Spawnea gigante zombie
/survival tnt <timer> <force> <radius> <name> - TNT parametrizada con tiempo, potencia y radio
/survival hidebanner                   - Oculta banner de presentación
/survival start <timer/zombie/sheep> <cant> - Inicia reto de donaciones
/survival stop                         - Detiene retos
/survival wither                       - Invoca al jefe Wither
/survival warden                       - Invoca al jefe Warden
/survival dog                          - Spawnea perro aliado protector
/survival set                          - Equipa equipamiento base predeterminado
/survival regeneat                     - Desactiva el hambre
/survival chest / chest_super          - Cofres con recompensas estándar o legendarias
/survival chest-effect                 - Alterna efectos de aparición de cofres
/survival armob / rmob <radius> <name> - Spawnea monstruos aleatorios en radio
/survival speed / jump_boost / strength / regeneration <segundos> - Buffs de pociones
/survival skeleton_trap                - Trampa de jinetes esqueleto
/survival meteors <count> <name>       - Lluvia de meteoritos explosivos
```

### 3.5 Archivo de Configuración (`config.yml`)
```yaml
player_name: 'null'
permanently_visible_mob_names: true
gift_send_text: sent you
```

---

## 4. Comparativa Arquitectónica: Stream To Earn Monolítico vs MineLive Modular

| Criterio | Stream To Earn (`s2e-survival`) | MineLive Ecosystem (18 Plugins) |
|---|---|---|
| **Estructura** | Un único plugin monolítico (`s2e-survival.jar`). | 18 micro-plugins especializados desacoplados. |
| **Animaciones & Visuales** | Mecánicas Spigot estándar (summon de mobs nativos). | Animaciones cinemáticas avanzadas mediante Display Entities, ArmorStands y partículas Math 3D (`BuenosMalos`, `La Parca`, `Hakai`, `Titán Sol`). |
| **Versión Nativa** | 1.21 (requiere Paper 1.21). | 1.20.1 nativo (alta estabilidad de tick rate en servidores de producción). |
| **Consumo de Memoria** | Monolito de ~100 KB pero rígido. | Modular: se pueden activar o desactivar plugins individualmente según el formato del stream. |
| **Pila de Tótems** | Límite vanilla estándar (1 por slot). | Sistema `MiniLiveTotems` con soporte de hasta 124 tótems apilables por casilla. |

---

## 5. Conclusiones y Recomendaciones para GalacticLive
1. Para el entorno de producción local 1.20.1, la suite modular de **MineLive** junto a **ViaVersion 5.8.0** ofrece mayor fidelidad gráfica, personalización por RCON y estabilidad de ticks (20.0 TPS).
2. Los subcomandos de `s2e-survival` pueden ser replicados o mapeados directamente mediante comandos vanilla (`/summon`, `/effect`, `/fill`) o mediante los plugins de `MiniLive` ya compilados.
