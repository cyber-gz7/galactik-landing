// Pestaña "Servidor": asistente para crear un servidor de Minecraft con los plugins de MineLive.
// Usa $, api, appendLog, hora, escapeHtml, pintarEstadoRcon y carpetaEl de renderer.js.

const PASOS_CREAR = [
  { id: 'java', texto: 'Java' },
  { id: 'apagar', texto: 'Apagar el servidor actual' },
  { id: 'paper', texto: 'Descargar Paper' },
  { id: 'archivos', texto: 'Configuración' },
  { id: 'plugins', texto: 'Plugins' },
  { id: 'arrancar', texto: 'Encender y conectar' },
]

let csInfo = null
let csCarpetaOk = false
let csCreando = false

function csEstado(el, texto, clase) {
  el.className = 'totems-estado'
  if (clase) el.classList.add(clase)
  el.textContent = texto
}

function csValor(nombre) {
  return document.querySelector(`input[name="${nombre}"]:checked`)?.value
}

// Qué falta para poder crear (se muestra al lado del botón).
function csActualizarBoton() {
  let motivo = ''
  if (!csInfo) motivo = 'Cargando…'
  else if (!csInfo.java?.ok) motivo = 'Falta Java 17 o más nuevo.'
  else if (!csCarpetaOk) motivo = 'Elige una carpeta nueva o vacía.'
  else if (!$('cs-eula').checked) motivo = 'Acepta el EULA de Minecraft.'
  $('cs-crear').disabled = Boolean(motivo) || csCreando
  $('cs-motivo').textContent = csCreando ? '' : motivo
  $('cs-aviso-apagar').classList.toggle('hidden', !($('cs-encender').checked && csInfo?.conectado))
}

async function csComprobarCarpeta() {
  const carpeta = $('cs-carpeta').value.trim()
  const res = await api().crearComprobarCarpeta(carpeta)
  csCarpetaOk = Boolean(res?.ok)
  csEstado($('cs-carpeta-estado'), res?.ok ? 'Carpeta válida.' : res?.error || 'Carpeta no válida.', res?.ok ? 'ok' : 'error')
  csActualizarBoton()
}

function csPintarBiomas(grupos) {
  for (const g of grupos) {
    const og = document.createElement('optgroup')
    og.label = g.grupo
    for (const b of g.biomas) og.append(new Option(b.nombre, b.id))
    $('cs-bioma').append(og)
  }
}

function csPintarPlugins(lista) {
  $('cs-plugins').innerHTML = lista.length
    ? lista
        .map(
          (p) => `<label class="inline cs-plugin"><input type="checkbox" value="${escapeHtml(p.archivo)}"${p.marcado ? ' checked' : ''} />
            <span><strong>${escapeHtml(p.nombre)}</strong><small>${escapeHtml(p.descripcion)}</small></span></label>`,
        )
        .join('')
    : '<p class="hint">No se encontraron los plugins incluidos en la app.</p>'
}

function csPintarRam(total) {
  // Se deja memoria para Windows, la app y OBS: como mucho el total menos 4 GB.
  const max = Math.max(1, Math.min(16, total - 4))
  const r = $('cs-ram')
  r.max = String(max)
  if (Number(r.value) > max) r.value = String(max)
  $('cs-ram-v').textContent = `${r.value} GB`
  $('cs-ram-nota').textContent = `Tu PC tiene ${total} GB. Con 2–4 GB va bien para jugar y hacer el live.`
}

async function cargarAsistenteServidor() {
  try {
    csInfo = await api().crearInfo()
  } catch (err) {
    $('cs-java').textContent = err?.message ?? String(err)
    return
  }
  $('cs-version').textContent = csInfo.version
  csPintarNick()
  $('cs-actual').innerHTML = csInfo.actual
    ? `Servidor actual: <strong>${escapeHtml(csInfo.actual.carpeta)}</strong>${csInfo.conectado ? ' · conectado' : ''}. Crear uno nuevo no borra el actual.`
    : 'Todavía no tienes servidor: créalo aquí.'
  $('cs-abrir-carpeta').classList.toggle('hidden', !csInfo.actual)
  const j = csInfo.java
  $('cs-java').innerHTML = j.ok
    ? `<span class="cs-ok">✓</span> Java ${j.mayor} instalado.`
    : `<span class="cs-mal">✗</span> ${escapeHtml(j.mayor ? `Tienes Java ${j.mayor}; hace falta ${csInfo.javaMinimo} o más nuevo.` : j.error || 'No se encontró Java.')}`
  $('cs-java-bajar').classList.toggle('hidden', j.ok)
  if (!$('cs-carpeta').value) $('cs-carpeta').value = csInfo.carpetaSugerida
  if (!$('cs-nombre').value) $('cs-nombre').value = 'Servidor MineLive'
  if (!$('cs-plugins').children.length) csPintarPlugins(csInfo.plugins || [])
  if ($('cs-bioma').options.length === 1) csPintarBiomas(csInfo.biomas || [])
  csPintarRam(csInfo.ramTotalGB)
  await csComprobarCarpeta()
}

function csPintarPaso(p) {
  const lista = $('cs-pasos')
  lista.classList.remove('hidden')
  let li = lista.querySelector(`[data-paso="${p.id}"]`)
  if (!li) {
    li = document.createElement('li')
    li.dataset.paso = p.id
    lista.append(li)
  }
  li.className = `cs-paso ${p.estado}`
  const titulo = PASOS_CREAR.find((x) => x.id === p.id)?.texto || 'Error'
  li.innerHTML = `<strong>${escapeHtml(titulo)}</strong><span>${escapeHtml(p.detalle || '')}</span>`
  const barra = $('cs-barra')
  if (p.id === 'paper' && p.estado === 'en-curso' && p.progreso != null) {
    barra.classList.remove('hidden')
    barra.firstElementChild.style.width = `${Math.round(p.progreso * 100)}%`
  } else if (p.id === 'paper' && p.estado !== 'en-curso') {
    barra.classList.add('hidden')
  }
}

async function crearServidorDesdeAsistente() {
  if (csCreando) return
  csCreando = true
  csActualizarBoton()
  $('cs-pasos').innerHTML = ''
  csEstado($('cs-resultado'), 'Creando…')
  const datos = {
    carpeta: $('cs-carpeta').value.trim(),
    eula: $('cs-eula').checked,
    encender: $('cs-encender').checked,
    opNick: $('cs-op').checked ? nickEl.value.trim() : '',
    plugins: [...$('cs-plugins').querySelectorAll('input:checked')].map((x) => x.value),
    opciones: {
      nombre: $('cs-nombre').value,
      modo: csValor('cs-modo'),
      dificultad: csValor('cs-dificultad'),
      mundo: csValor('cs-mundo'),
      bioma: $('cs-bioma').value,
      jugadores: Number($('cs-jugadores').value),
      semilla: $('cs-semilla').value,
      ramGB: Number($('cs-ram').value),
    },
  }
  appendLog(`<span class="ts">[${hora()}]</span> Creando servidor en ${escapeHtml(datos.carpeta)}…`)
  try {
    const res = await api().crearServidor(datos)
    if (!res?.ok) {
      csEstado($('cs-resultado'), res?.error || 'No se pudo crear.', 'error')
      appendLog(`<span class="ts">[${hora()}]</span> <span class="err">${escapeHtml(res?.error || 'No se pudo crear el servidor.')}</span>`)
      return
    }
    const puerto = res.puertoJuego && res.puertoJuego !== 25565 ? `:${res.puertoJuego}` : ''
    // res.mensaje: el texto que manda la nube (el servidor es un ZIP que se abre en el PC).
    csEstado(
      $('cs-resultado'),
      typeof res.mensaje === 'string' && res.mensaje
        ? res.mensaje
        : res.encendido
          ? `¡Listo! Servidor encendido y conectado. Para entrar en Minecraft: Multijugador → Añadir servidor → localhost${puerto}`
          : `¡Listo! Servidor creado. Pulsa Activar (abajo a la izquierda) para encenderlo. Dirección: localhost${puerto}`,
      'ok',
    )
    appendLog(`<span class="ts">[${hora()}]</span> Servidor creado en ${escapeHtml(res.carpeta)}.`)
    if (typeof carpetaEl !== 'undefined') carpetaEl.value = res.carpeta
    if (res.encendido && typeof pintarEstadoRcon === 'function') pintarEstadoRcon(res)
    csInfo = null
    await cargarAsistenteServidor()
  } catch (err) {
    csEstado($('cs-resultado'), err?.message ?? String(err), 'error')
  } finally {
    csCreando = false
    csActualizarBoton()
  }
}

// El OP va al nick de arriba (el de Minecraft).
function csPintarNick() {
  const nick = nickEl.value.trim()
  $('cs-op-nick').textContent = nick || 'tu nick (escríbelo arriba)'
  $('cs-dar-op').textContent = nick ? `Darme OP (${nick})` : 'Darme OP'
  $('cs-dar-op').disabled = !nick
  $('cs-op').disabled = !nick
}

$('cs-dar-op').addEventListener('click', async () => {
  const nick = nickEl.value.trim()
  if (!nick) return
  csEstado($('cs-op-estado'), 'Dando OP…')
  const res = await api().darOp(nick)
  csEstado(
    $('cs-op-estado'),
    res?.ok ? `${nick} ya es administrador. Si estás dentro, los comandos funcionan al momento.` : `No se pudo: ${res?.error || 'error'}`,
    res?.ok ? 'ok' : 'error',
  )
})
nickEl.addEventListener('input', csPintarNick)

$('cs-abrir-carpeta').addEventListener('click', async () => {
  const res = await api().abrirCarpetaServidor()
  if (!res?.ok) csEstado($('cs-op-estado'), `No se pudo abrir la carpeta: ${res?.error || 'error'}`, 'error')
})

api().onLive('crear:progreso', csPintarPaso)
api().onLive('servidor:cambiado', () => {
  if (csInfo && !csCreando) cargarAsistenteServidor()
})
$('cs-carpeta').addEventListener('change', csComprobarCarpeta)
$('cs-elegir').addEventListener('click', async () => {
  const res = await api().crearElegirCarpeta()
  if (!res?.elegida) return
  $('cs-carpeta').value = res.carpeta
  await csComprobarCarpeta()
})
$('cs-ram').addEventListener('input', () => {
  $('cs-ram-v').textContent = `${$('cs-ram').value} GB`
})
$('cs-bioma').addEventListener('change', () => $('cs-bioma-nota').classList.toggle('hidden', !$('cs-bioma').value))
$('cs-eula').addEventListener('change', csActualizarBoton)
$('cs-encender').addEventListener('change', csActualizarBoton)
$('cs-eula-leer').addEventListener('click', () => api().abrirEnlace('https://aka.ms/MinecraftEULA'))
$('cs-java-bajar').addEventListener('click', () => api().abrirEnlace('https://adoptium.net/es/temurin/releases/?version=21'))
$('cs-todos').addEventListener('click', () => {
  const cajas = [...$('cs-plugins').querySelectorAll('input')]
  const marcar = cajas.some((c) => !c.checked)
  for (const c of cajas) c.checked = marcar
})
$('cs-crear').addEventListener('click', crearServidorDesdeAsistente)
$('tab-servidor').addEventListener('click', () => {
  if (!csCreando) cargarAsistenteServidor()
})
