---
name: skill-mc-plugins-rcon
description: Sub-Agente 1 - Ingeniería Minecraft & Plugins Pagos. Gestiona el ciclo de vida de PaperMC, desbloqueo de procesos java.exe / session.lock, visión nocturna persistente anti-tótem, tótems unificados y escalado de eventos en Minecraft 1.20.1.
---

# Skill: Minecraft Plugins & RCON Engineering

## Capacidades y Responsabilidades
1. **Auditoría e inventario de plugins**: Mapear comandos y sintaxis de todos los plugins ubicados en `C:\Proyectos\GalacticLive\minecraft_server_1.20.1\plugins`.
2. **Unificación de Tótems**: Configurar exclusivamente la acción unificada `🛡️ Tótems de Inmortalidad (Stackeables)` con `/totems dar {jugador} totems={cantidad}`.
3. **Mapeo de recompensas de alto impacto**:
   - `🐺 Perro Guardián con Nick`: `execute at {jugador} run summon minecraft:wolf ~ ~ ~ {Tame:1b,Owner:"{jugador}",CollarColor:11b,CustomName:'{"text":"🐺 {donador}","color":"aqua","bold":true}',CustomNameVisible:1b}`
   - `⚔️ Kit Armadura OP` y `⛏️ Survival Tools`.
   - Jefes y eventos especiales: Dragón, La Parka, Sol Cruel, Rayo/Thunder, Láser, Kaboom, TNT, Horda Zombies, Escudo.
4. **Resiliencia PaperMC**: Liberar bloqueos de proceso (`java.exe`/`javaw.exe`), eliminar archivos `session.lock` y asegurar inicio limpio de `paper.jar`.
5. **Visión Nocturna Infinita**: Loop automatizado cada 2.5s y tras eventos RCON para aplicar `effect give {jugador} minecraft:night_vision infinite 0 true`.
