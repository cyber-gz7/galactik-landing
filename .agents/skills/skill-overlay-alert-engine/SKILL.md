---
name: skill-overlay-alert-engine
description: Sub-Agente 2 - Motor Visual de Overlays & Croma. Rediseña mc_overlay.html (100% transparente, cajas con artes de plugins y corazón SVG con 50 likes) y blinda alerta.html con filtrado estricto de silencio y ejecución simultánea RCON + Alerta Prioritaria.
---

# Skill: Overlay & Alert Engine

## Capacidades y Responsabilidades
1. **mc_overlay.html Transparente y Moderno**:
   - Fondo 100% transparente (`background: transparent !important;`).
   - Cajas flotantes estilo cristal sutil con bordes neón y `text-shadow` de alto contraste legibles sobre cualquier bioma.
   - Corazón Vectorial SVG con número `50` en el centro para likes.
   - Arte e imagen destacada dentro de la caja de cada plugin (`Dragón`, `La Parka`, `Sol`, `Rayo`, `Tótems`, etc.) con multiplicadores visibles (`x10`, `x32`, `x124`, `x500`).
2. **Blindaje de alerta.html**:
   - Silencio absoluto para eventos no configurados (cero texto basura de likes o follows sin alerta).
   - Activación exclusiva para:
     a) Croma Key de moderadores.
     b) Regalos configurados explícitamente con alerta/sonido.
     c) Pruebas manuales desde el panel.
3. **Ejecución Simultánea Dual**:
   - En regalos como Quiéreme (`Heart Me`), disparar simultáneamente el comando RCON al servidor y la alerta prioritaria en pantalla.
