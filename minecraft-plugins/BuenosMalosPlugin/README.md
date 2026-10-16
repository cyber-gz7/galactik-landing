# ⚡ BuenosMalosPlugin

Sistema interactivo **Buenos vs Malos** para directos de TikTok Live en Minecraft 1.20.1 — por **GZ7 / CJ7TEC**.

## Estructura del Proyecto

```
BuenosMalosPlugin/
├── src/main/java/com/gz7/ruletabm/
│   ├── BuenosMalosMain.java      ← Plugin principal
│   ├── GiftHandler.java          ← Interface de gifts
│   ├── GiftRegistry.java         ← Catálogo de 14 gifts
│   ├── GameState.java            ← Estado: tótems, inmunidad
│   ├── TotemManager.java         ← BossBar + ActionBar + muerte
│   ├── AnimationUtils.java       ← Utilidades de partículas y Display Entities
│   ├── malos/
│   │   ├── RosaOscura.java       ← 1 moneda
│   │   ├── GGMaldicion.java      ← 5 monedas
│   │   ├── HackaiLluvia.java     ← 15 monedas
│   │   ├── CarruselInfierno.java ← 20 monedas
│   │   ├── DragonInvocacion.java ← 50 monedas
│   │   ├── LaParka.java          ← 99 monedas (INSTAKILL)
│   │   └── SolCruel.java         ← 199 monedas (MEGA INSTAKILL)
│   └── buenos/
│       ├── RosaLuz.java          ← 1 moneda
│       ├── GGBendicion.java      ← 5 monedas
│       ├── HackaiSagrado.java    ← 15 monedas
│       ├── CarruselTotems.java   ← 20 monedas
│       ├── FenixRenaciente.java  ← 50 monedas
│       ├── ArcangelSerafin.java  ← 99 monedas (INSTASAVE)
│       └── DeidadSolar.java      ← 199 monedas (MEGA SAVE + Inmunidad 30s)
├── src/main/resources/plugin.yml
├── pom.xml
└── compilar.bat
```

## Requisitos

- **Java 17** (LTS)
- **Paper 1.20.1** (recomendado) o Spigot 1.20.1
- **Maven 3.9+** para compilar
- `paper-api 1.20.1-R0.1-SNAPSHOT` (se descarga automáticamente desde repo.papermc.io)

## Compilar

```bash
mvn clean package
```

O doble clic en `compilar.bat`.

El JAR se genera en `target/BuenosMalosPlugin-1.0.0.jar`.

## Instalar

Copiar el JAR a la carpeta `plugins/` del servidor Paper y reiniciar.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/bm totem <0-20>` | Setea los tótems directamente |
| `/bm gift <nombre> [donador]` | Simula un regalo (para testing) |
| `/bm target [jugador]` | Define o consulta el jugador objetivo |
| `/bm reset` | Resetea a 10 tótems |
| `/bm list` | Lista todos los gifts registrados |

## Gifts Disponibles

### Team MALOS 💀

| ID | Monedas | Efecto |
|----|---------|--------|
| `rosa_oscura` | 1 | Partículas oscuras (cosmético) |
| `gg_maldicion` | 5 | Ceguera + Wither, -1 tótem |
| `hackai_lluvia` | 15 | Lluvia ácida, -3 tótems |
| `carrusel_infierno` | 20 | Giro forzado + mareo, -2 tótems |
| `dragon_invocacion` | 50 | Aliento de dragón + mobs enraged, -5 tótems |
| `la_parka` | 99 | **INSTAKILL** animación 7s, -20 tótems |
| `sol_cruel` | 199 | **MEGA INSTAKILL** solar, -20 tótems |

### Team BUENOS 👼

| ID | Monedas | Efecto |
|----|---------|--------|
| `rosa_luz` | 1 | Partículas doradas (cosmético) |
| `gg_bendicion` | 5 | Cura vida + quita efectos, +1 tótem |
| `hackai_sagrado` | 15 | Lluvia sagrada + Regen, +3 tótems |
| `carrusel_totems` | 20 | Animación tótem masivo, +5 tótems |
| `fenix_renaciente` | 50 | Cura completa + quita efectos, +8 tótems |
| `arcangel_serafin` | 99 | **INSTASAVE** anillos, +20 tótems, mata mobs |
| `deidad_solar` | 199 | **MEGA SAVE** inmunidad 30s, +20 tótems, mata mobs |

## Panel Web

Ver `../BuenosMalosPanel/` — panel independiente Node.js en `localhost:3000`.

## Integración TikTok → Minecraft

El plugin acepta comandos `/bm gift` desde consola, que el bridge Node.js puede ejecutar vía RCON o TCP al socket del servidor.

---

*GZ7 / CJ7TEC — Huaraz, Ancash, Perú 🇵🇪*
