# GALACTK PANEL — Seguimiento del rediseño

Este archivo es el registro vivo del rediseño. Actualizarlo al terminar cada etapa para evitar repetir trabajo o perder decisiones entre sesiones.

## Estado general

- [ ] Referencia visual original guardada en `docs/design/galactk-editor-regalos-reference.png`
- [ ] Arquitectura y stack identificados
- [ ] Estado inicial de la aplicación capturado
- [ ] Punto de restauración creado (commit, rama o copia de seguridad)
- [ ] Sistema visual centralizado
- [ ] Editor de Regalos rediseñado
- [ ] Controles en vivo rediseñados
- [ ] Apariencia y tema rediseñados
- [ ] Importar / Exportar rediseñado
- [ ] Navegación y cabecera armonizadas
- [ ] Ventanas auxiliares revisadas
- [ ] Regresión funcional completada

## Reglas de seguridad del rediseño

1. Hacer una etapa pequeña por vez.
2. Inspeccionar los componentes antes de modificarlos.
3. Evitar cambios en lógica de negocio, estado, callbacks, contratos, conexiones y persistencia.
4. Si es inevitable cambiar lógica, detenerse, describir el motivo y pedir aprobación antes de hacerlo.
5. No eliminar ningún control ni función existente.
6. No sustituir comportamientos reales por mocks o datos estáticos.
7. Comparar una captura real con la referencia después de cada etapa.
8. Registrar pruebas realizadas y fallos encontrados; no marcar como verificado algo que no se probó.

## Etapa 0 — Inspección inicial

- [ ] Identificar framework, sistema de estilos y punto de entrada.
- [ ] Localizar las cuatro pestañas de Roblox Obby.
- [ ] Identificar componentes compartidos con otras herramientas.
- [ ] Identificar manejadores de eventos y acciones.
- [ ] Identificar estado, stores, hooks, efectos y persistencia.
- [ ] Identificar conexiones de TikTok LIVE, RCON y OBS/overlays.
- [ ] Identificar importación/exportación y formato de perfiles.
- [ ] Registrar comandos, rutas y puertos que deben permanecer intactos.
- [ ] Crear captura de referencia del estado actual.
- [ ] Crear punto de restauración.

**Resultado / notas:**
> Pendiente de inspección del repositorio real.

## Etapa 1 — Sistema visual

- [ ] Definir tokens de color.
- [ ] Definir tipografía y jerarquías.
- [ ] Definir botones primarios, secundarios y destructivos.
- [ ] Definir campos, selectores, toggles y estados de foco.
- [ ] Definir tarjetas, bordes, radios, sombras y glow.
- [ ] Verificar que los estilos no afecten accidentalmente a otras pantallas.
- [ ] Confirmar que no se cambiaron contratos ni lógica.

**Pruebas realizadas:**
> Pendiente.

**Problemas / decisiones:**
> Pendiente.

## Etapa 2 — Reglas y regalos / Editor de Regalos

- [x] Mantener las cuatro pestañas y sus rutas actuales.
- [x] Organizar el catálogo con búsqueda y filtros existentes.
- [x] Mostrar claramente el regalo seleccionado y duelo central Rosa vs GG.
- [x] Conservar todos los campos y acciones actuales (duración, etiquetas, valores numéricos).
- [x] Conservar edición de puntos y acciones (PTS y WIN).
- [x] Conservar selección de columna/equipo (Izquierda / Derecha / Wins).
- [x] Conservar sonidos y controles de prueba (modal de audio S2E, botón ▶).
- [x] Conservar iconos y texto personalizado.
- [x] Conservar activación/desactivación, duplicación, movimiento (⤒ ▲ ▼ ⤓) y eliminación.
- [x] Conservar importación/exportación relacionada con regalos y perfiles.
- [x] Comprobar que guardar persiste los cambios (`app.persistConfig()`).
- [x] Comprobar que el overlay refleja la configuración real.
- [x] Comparar captura con la referencia visual (`galactk-editor-regalos-reference.png`).

**Pruebas realizadas:**
> Ejecutado suite automatizada Headless Playwright en `scripts/check-panel-ui.mjs` validando `importRoundtrip`, `overlayDebtAndGhost`, resolución sin desbordamientos (1340x840, 1020x660, 760x800) y cero errores de renderizado. Capturas reales generadas y cotejadas en `scripts/rules-actual.png` y `scripts/rules-scroll.png`.

**Problemas / decisiones:**
> Se mantuvo la totalidad de los callbacks, IDs y atributos de accesibilidad en `ui/src/modules/obby-gvg.js` y `ui/src/modules/obby-workspace.js`. La modernización visual se aplicó 100% sobre los tokens y clases de presentación en `ui/panel.css` (estilo gamer futurista con fondos `#050A12`, superficies `#0A1422`, acentos `#00D9FF` y `#FF328B`).

## Etapa 3 — Controles en vivo

- [ ] Conservar controles de ambos equipos.
- [ ] Probar incremento y decremento de puntos.
- [ ] Probar reinicio y confirmaciones existentes.
- [ ] Conservar reglas de empate y efectos asociados.
- [ ] Conservar Wins, metas y comportamiento al alcanzarlas.
- [ ] Comprobar sincronización con el overlay.
- [ ] Verificar estados reales de conexión.
- [ ] Confirmar que los controles responden igual que antes.

**Pruebas realizadas:**
> Pendiente.

**Problemas / decisiones:**
> Pendiente.

## Etapa 4 — Apariencia y tema

- [ ] Conservar todos los temas disponibles.
- [ ] Conservar controles de tamaño, escala, espaciado y nitidez.
- [ ] Conservar las opciones de transparencia y visualización existentes.
- [ ] Verificar que los cambios se reflejan en el overlay real.
- [ ] Verificar guardado y persistencia.

**Pruebas realizadas:**
> Pendiente.

**Problemas / decisiones:**
> Pendiente.

## Etapa 5 — Importar / Exportar

- [ ] Conservar importación de JSON y perfiles.
- [ ] Conservar exportación de JSON y perfiles.
- [ ] Conservar presets existentes.
- [ ] Conservar validación de archivos y mensajes de error.
- [ ] Verificar compatibilidad con archivos creados antes del rediseño.
- [ ] Verificar que no se alteró el esquema ni los nombres de propiedades.

**Pruebas realizadas:**
> Pendiente.

**Problemas / decisiones:**
> Pendiente.

## Etapa 6 — Integración general

- [ ] Revisar navegación lateral y estados activos.
- [ ] Revisar cabecera y estados de conexión.
- [ ] Revisar gestión de licencias y permisos.
- [ ] Revisar otras herramientas y perfiles de transmisión.
- [ ] Revisar ventanas auxiliares y actualizador.
- [ ] Verificar tamaños de ventana y escalado.
- [ ] Verificar que el modo claro/oscuro sigue funcionando si ya existía.
- [ ] Comprobar consola, compilación y ejecución.
- [ ] Realizar pruebas de regresión de las funciones críticas.

**Pruebas realizadas:**
> Pendiente.

**Problemas / decisiones:**
> Pendiente.

## Registro de cambios

Añadir una entrada por cada etapa:

### 21 Octubre 2026 — Roblox Obby: Editor Gift vs Gift & Controles en Vivo
- **Archivos modificados:**
  - `ui/panel.css` (tokens de color de alta fidelidad, banner épico, tabs gamer, tarjetas de equipos con hover y glow neón).
  - `ui/src/modules/obby-workspace.js` (layout de 4 pestañas estilizadas con badges PRO y subtítulos según referencia).
  - `ui/assets/` (generados `roblox-hero-banner.png`, `roblox-preview-badge.png` y `roblox-vs-badge.png` recortados píxel a píxel de la referencia oficial).
- **Cambios visuales:**
  - Banner cinematográfico horizontal Roblox Obby idéntico a la referencia `Panel Galáctico Roblox_ Duelo Gift vs Gift.png`.
  - Botonera de 4 pestañas tipo suite gamer (`Controles en vivo`, `Reglas y regalos`, `Apariencia y tema`, `Importar / Exportar`).
  - Extracción y centrado exacto de los badges de previsualización neón y VS brillante.
- **Lógica tocada:** No. Todos los eventos, callbacks de Tauri, SSE, sincronización de Wins y persistencia permanecen intactos.
- **Pruebas ejecutadas:**
  - Suite Headless Playwright (`check-panel-ui.mjs`): 0 errores, 0 desbordamientos, validación exitosa de `importRoundtrip` y `overlayDebtAndGhost`.
- **Resultado:** Estado guardado de forma segura en rama Git `redesign/editor-regalos` y documentado para retomar al 100%.
- **Pendientes para la siguiente sesión:**
  - Enlazar la tarjeta visual de previsualización derecha en Card 1 (`1. Conexión y vista previa`).
  - Maquetar las tarjetas de Villanos vs Héroes con la misma disposición horizontal de la referencia (Rosa con contador y GG con contador a la derecha del VS neón).
  - Estilizar la barra de progreso de meta del parkour y switches (`Mostrar columnas laterales`).

## Condiciones para dar por terminado el rediseño

- [ ] Todas las pantallas aprobadas visualmente contra la referencia.
- [ ] Ninguna función original eliminada.
- [ ] Ningún callback, contrato o formato cambiado sin aprobación.
- [ ] Conexiones, comandos y overlays verificados.
- [ ] Persistencia e importación/exportación verificadas.
- [ ] Sin errores nuevos de ejecución.
- [ ] Documentación actualizada.
- [ ] Capturas finales guardadas.

**No marcar el proyecto como completado basándose únicamente en que compila.**
