// Opciones que cada plugin acepta al final de su comando:
//   <prefijo> {nick} {quien} clave=valor clave="texto" ...
// El plugin las lee; la app solo las edita. Defectos = comportamiento del plugin
// sin opciones, así que solo se escriben en el comando las que cambian.
//
// tipo 'numero': defecto, min, max, paso, unidad. tipo 'texto': colores &,
// {donador} y {jugador}. estimado(valores) opcional: línea de aviso bajo los números.

function estimadoMuerte(corazonesPorSeg, duracionSeg) {
  if (corazonesPorSeg <= 0) return { texto: 'No quita vida.', clase: 'vive' }
  const muereEn = 10 / corazonesPorSeg
  if (muereEn < duracionSeg) {
    return {
      texto: `Sin armadura muere hacia los ${Math.max(1, Math.round(muereEn))} s. Con armadura aguanta más.`,
      clase: 'mata',
    }
  }
  const pierde = Math.min(10, corazonesPorSeg * duracionSeg)
  return { texto: `Sin armadura sobrevive: pierde unos ${pierde.toFixed(1)} de 10 corazones.`, clase: 'vive' }
}

window.OPCIONES_PLUGINS = [
  {
    prefijo: 'marcador',
    nombre: 'Marcador',
    opciones: [
      { clave: 'cantidad', etiqueta: 'Cuántas suma o resta', tipo: 'numero', defecto: 1, min: 1, max: 100, paso: 1, descripcion: 'Cuánto cambia el contador cada vez que salta esta fila. Con un regalo que se manda en racha, salta una vez por cada regalo.' },
    ],
    estimado: () => ({ texto: 'No toca Minecraft: solo cambia el contador del live. Funciona aunque el servidor esté apagado.', clase: 'vive' }),
  },
  {
    prefijo: 'carrusel',
    aliases: ['creeper'],
    nombre: 'Carrusel',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'dps', etiqueta: 'Daño creepers (♥ por segundo)', tipo: 'numero', defecto: 2, min: 0, max: 10, paso: 0.25 },
      { clave: 'rayo', etiqueta: 'Daño del rayo (♥ cada 3 s)', tipo: 'numero', defecto: 1.5, min: 0, max: 20, paso: 0.25 },
      { clave: 'duracion', etiqueta: 'Duración (segundos)', tipo: 'numero', defecto: 20, min: 3, max: 120, paso: 1 },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&b&l⚡ CARRUSEL ⚡' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&9&ode {donador}' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&b{donador} lanzó Carrusel → {jugador}' },
      { clave: 'final', etiqueta: 'Título al terminar', tipo: 'texto', defecto: '&a&l¡Sobreviviste!' },
    ],
    estimado: (v) => estimadoMuerte(v.dps + v.rayo / 3, v.duracion),
  },
  {
    prefijo: 'dragon',
    nombre: 'Dragón',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'dragones', etiqueta: 'Cantidad de dragones', tipo: 'numero', defecto: 3, min: 1, max: 6, paso: 1, descripcion: 'El primero sale enfrente; el resto rodea al jugador. Vacían los bloques del círculo desde los pies hacia arriba (no el suelo ni los cofres).' },
      { clave: 'dps', etiqueta: 'Daño de cada dragón (♥ por segundo)', tipo: 'numero', defecto: 0.5, min: 0, max: 10, paso: 0.25, descripcion: 'Cada dragón muerde una vez por segundo, por turnos. Respeta los tótems.' },
      { clave: 'duracion', etiqueta: 'Tiempo encadenado (segundos)', tipo: 'numero', defecto: 6, min: 3, max: 60, paso: 1, descripcion: 'El jugador no puede moverse ni saltar; la cámara queda libre.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&5&l[DRAGONES]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&dNo puedes escapar' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&5{donador} invocó dragones → {jugador}' },
      { clave: 'final', etiqueta: 'Título al terminar', tipo: 'texto', defecto: '&a&l¡Te soltaron!' },
    ],
    estimado: (v) => estimadoMuerte(v.dps * v.dragones, v.duracion),
  },
  {
    prefijo: 'hakai',
    aliases: ['esfera'],
    nombre: 'Hakai',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varias, salen todas juntas. Con un número, las que sobren esperan su turno.' },
      { clave: 'dps', etiqueta: 'Daño al empujar (♥ por segundo)', tipo: 'numero', defecto: 4, min: 0, max: 20, paso: 0.5, descripcion: 'Mientras la esfera lo lleva por los aires, 4 golpes por segundo. Respeta los tótems.' },
      { clave: 'duracion', etiqueta: 'Tiempo de empuje (segundos)', tipo: 'numero', defecto: 3, min: 1, max: 60, paso: 1, descripcion: 'Cuánto lo lleva volando. Al final la esfera explota y cae con caída lenta.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&8&l[HAKAI]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&7Algo oscuro sale del suelo…' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&7{donador} lanzó Hakai → {jugador}' },
      { clave: 'final', etiqueta: 'Título al terminar', tipo: 'texto', defecto: '&a&l¡Sobreviviste!' },
    ],
    estimado: (v) => estimadoMuerte(v.dps, v.duracion),
  },
  {
    prefijo: 'ml rayo',
    nombre: 'Rayo',
    opciones: [
      { clave: 'rayos', etiqueta: 'Número de rayos', tipo: 'numero', defecto: 6, min: 1, max: 12, paso: 1, descripcion: 'Rayos que caen cerca del jugador (daño vanilla del rayo).' },
      { clave: 'duracion', etiqueta: 'Duración de la tormenta (s)', tipo: 'numero', defecto: 8, min: 5, max: 20, paso: 0.5, descripcion: 'Segundos hasta que vuelve el clima original.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&e&l[RAYO]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&cSe te viene la tormenta encima.' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&b{donador} cayó rayos → {jugador}' },
    ],
  },
  {
    prefijo: 'aliado',
    aliases: ['aliados'],
    nombre: 'Orbe aliado',
    opciones: [
      { clave: 'tipo', etiqueta: 'Tipo (orbe o mago)', tipo: 'texto', defecto: 'orbe', descripcion: 'orbe = gira alrededor del jugador y lanza rayos a los monstruos cercanos durante unos segundos, con una barra arriba. mago = el esqueleto mago con el ritual del invocador (usa las opciones de mago de abajo).' },
      { clave: 'duracion', etiqueta: 'Segundos que dura el orbe', tipo: 'numero', defecto: 30, min: 3, max: 600, paso: 1, descripcion: 'Arriba sale una barra que se vacía con el tiempo que le queda.' },
      { clave: 'radio', etiqueta: 'Alcance de los rayos del orbe (bloques)', tipo: 'numero', defecto: 5, min: 1.5, max: 16, paso: 0.5, descripcion: 'Cada vez lanza rayos a los monstruos a esta distancia (hasta 6 a la vez). Además hiere a los que atraviesa al girar.' },
      { clave: 'orbita', etiqueta: 'Distancia a la que gira el orbe (bloques)', tipo: 'numero', defecto: 2.2, min: 1, max: 5, paso: 0.1 },
      { clave: 'invocador', etiqueta: 'Ritual del invocador (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1: delante del jugador se abre un gran círculo mágico, aparece flotando un nigromante que alza el báculo e invoca a los magos, y luego desaparece. Con 0: el mago sale solo a su lado.' },
      { clave: 'cantidad', etiqueta: 'Magos por regalo', tipo: 'numero', defecto: 1, min: 1, max: 10, paso: 1, descripcion: 'Cuántos magos invoca el ritual (salen repartidos por el círculo).' },
      { clave: 'vida', etiqueta: 'Vida del mago', tipo: 'numero', defecto: 60, min: 1, max: 1024, paso: 1, descripcion: '60 = 30 corazones. Los monstruos de alrededor van a por él; si se le acaba la vida, muere.' },
      { clave: 'armadura', etiqueta: 'Armadura del mago', tipo: 'numero', defecto: 10, min: 0, max: 30, paso: 1, descripcion: 'Puntos de armadura, como los del jugador (10 ≈ hierro casi completo, 20 = diamante completo). Cuanta más, menos daño le hacen.' },
      { clave: 'golpes', etiqueta: 'Golpes para matar un monstruo', tipo: 'numero', defecto: 2, min: 1, max: 20, paso: 1, descripcion: 'Cada golpe (rayo del orbe o hechizo del mago) le quita esa parte de su vida, lleve la armadura que lleve: con 2, cualquier zombie muere de dos golpes.' },
      { clave: 'mejorado', etiqueta: 'Cada cuántos hechizos sale el mejorado', tipo: 'numero', defecto: 3, min: 0, max: 20, paso: 1, descripcion: 'El mejorado estalla en área: el mismo daño a todos los monstruos de alrededor. 0 = nunca.' },
      { clave: 'area', etiqueta: 'Radio del mejorado (bloques)', tipo: 'numero', defecto: 4, min: 1, max: 12, paso: 0.5 },
      { clave: 'cadencia', etiqueta: 'Segundos entre rayos o hechizos', tipo: 'numero', defecto: 1, min: 0.2, max: 10, paso: 0.1 },
      { clave: 'alcance', etiqueta: 'Alcance (bloques)', tipo: 'numero', defecto: 18, min: 4, max: 48, paso: 1, descripcion: 'Va a por monstruos a esta distancia del jugador. Primero a los que atacan al jugador o a él.' },
      { clave: 'objetivos', etiqueta: 'A quién ataca (monstruos o zombies)', tipo: 'texto', defecto: 'monstruos', descripcion: 'monstruos = cualquier monstruo. zombies = solo zombie, husk, ahogado, aldeano zombie y piglin zombificado.' },
      { clave: 'max', etiqueta: 'Máximo de magos por jugador', tipo: 'numero', defecto: 10, min: 1, max: 50, paso: 1, descripcion: 'Si ya tiene tantos, el más antiguo se va para dejar sitio al nuevo. Si el jugador muere, se van todos.' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&b{donador} &7le mandó a &f{jugador} &7un &d✦ Orbe aliado' },
    ],
  },
  {
    prefijo: 'solcruel',
    aliases: ['sol'],
    nombre: 'Sol cruel',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del titán (bloques de alto)', tipo: 'numero', defecto: 18, min: 8, max: 30, paso: 1, descripcion: 'Cae del cielo delante del jugador.' },
      { clave: 'carga', etiqueta: 'Tiempo que crece el sol (segundos)', tipo: 'numero', defecto: 8, min: 3, max: 15, paso: 0.5, descripcion: 'Con la mano en alto, el sol nace en su dedo y crece despacio y luego cada vez más rápido, mientras el cielo se pone naranja.' },
      { clave: 'sol', etiqueta: 'Radio final del sol (bloques)', tipo: 'numero', defecto: 12, min: 3, max: 20, paso: 0.5, descripcion: 'Hasta dónde crece. 12 = 24 bloques de diámetro, más grande que el titán.' },
      { clave: 'duracion', etiqueta: 'Segundos arrastrándolo', tipo: 'numero', defecto: 5, min: 1, max: 15, paso: 0.5, descripcion: 'Como el Hakai: el sol se le pega a la espalda y lo lleva por el aire. Mientras tanto no le hacen daño la caída, el fuego ni las explosiones.' },
      { clave: 'golpes', etiqueta: 'Golpes mientras lo arrastra', tipo: 'numero', defecto: 5, min: 1, max: 15, paso: 1, descripcion: 'Estallidos repartidos por el arrastre; el último es la supernova que lo remata.' },
      { clave: 'dps', etiqueta: 'Daño mientras lo arrastra (♥ por segundo)', tipo: 'numero', defecto: 6, min: 0, max: 40, paso: 0.5, descripcion: 'Como el Hakai: le quema todo el rato mientras el sol lo lleva (4 toques por segundo). La armadura lo reduce y los tótems lo salvan.' },
      { clave: 'dano', etiqueta: 'Daño extra de los golpes (♥ en total)', tipo: 'numero', defecto: 10, min: 0, max: 50, paso: 0.5, descripcion: 'Se reparte entre los golpes y la supernova final.' },
      { clave: 'totems', etiqueta: 'Tótems que quema al final', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Tras la supernova, golpes mortales seguidos; cada uno le gasta un tótem. 0 = ninguno.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 0 (normal): hace daño y los tótems lo salvan; al acabar baja planeando. Con 1: el arrastre no hace daño y en la supernova le quema TODOS los tótems y muere al instante.' },
      { clave: 'romper', etiqueta: 'Romper bloques (1 = sí)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'El sol ara el terreno por donde pasa y abre paso al jugador. Con 0 atraviesa sin romper nada.' },
      { clave: 'cielo', etiqueta: 'Cielo naranja (1 = sí)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Atardecer y calima naranja para los que están cerca. Vuelve solo al acabar.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6&l[Sol Cruel] &eEl cielo se abre sobre &f{jugador}&e.' },
    ],
  },
  {
    prefijo: 'buda',
    aliases: ['buddha', 'palma'],
    nombre: 'Buda',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos (cada Buda se sienta en un sitio distinto alrededor del jugador). Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del Buda', tipo: 'numero', defecto: 1, min: 0.5, max: 2, paso: 0.1, descripcion: 'Con 1 mide unos 24 bloques de alto, y el abanico de las mil manos que se abre detrás, casi el doble. Los puños miden unos 8 bloques. Más grande, se sienta más lejos.' },
      { clave: 'carga', etiqueta: 'Segundos que carga energía antes de atacar', tipo: 'numero', defecto: 2.6, min: 0, max: 10, paso: 0.1, descripcion: 'Tras despertar, alza la mano, el halo acelera y la luz acude a su palma mientras un cerco se cierra sobre el jugador; al estallar empieza la lluvia de golpes. 0 = ataca nada más despertar.' },
      { clave: 'empuje', etiqueta: 'Empuje de los golpes (0 = nada, 1 = fuerte)', tipo: 'numero', defecto: 0.6, min: 0, max: 1, paso: 0.1, descripcion: 'Cuánto mueve cada puño al jugador. Con 0 no lo mueve; con 1 lo lanza fuerte.' },
      { clave: 'puno', etiqueta: 'Tamaño de los puños', tipo: 'numero', defecto: 0.55, min: 0.2, max: 1.5, paso: 0.05, descripcion: 'Con 0.55 miden unos 4 bloques y caen al lado del jugador, sin taparle la pantalla. Con 1 miden unos 8 bloques, como antes.' },
      { clave: 'despejar', etiqueta: 'Borrar el terreno de alrededor (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Al empezar quita árboles, cerros y construcciones en unos 30 bloques alrededor del Buda y en el pasillo hasta el jugador, sin cavar por debajo. Los cofres sueltan lo que llevan. No se deshace.' },
      { clave: 'mobs', etiqueta: 'Eliminar los mobs de alrededor (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Mientras dura, desaparecen los mobs cercanos (animales incluidos), sin soltar nada.' },
      { clave: 'particulas', etiqueta: 'Partículas (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 0 (normal) no sale ninguna partícula y al Buda se le ve entero: la luz son piezas. Con 1 vuelven el polvo de oro, las chispas y las estelas.' },
      { clave: 'golpes', etiqueta: 'Puños de la lluvia de golpes', tipo: 'numero', defecto: 22, min: 0, max: 40, paso: 1, descripcion: 'Cuántos puños gigantes salen del abanico de las mil manos, unos siete por segundo, antes de la andanada final (tres oleadas, la última con dos puños enormes). Cada uno alarga el show. Con 0 solo hay andanada.' },
      { clave: 'golpe', etiqueta: 'Daño de cada puño (♥)', tipo: 'numero', defecto: 1, min: 0, max: 10, paso: 0.5, descripcion: 'Lo que le quita cada puño si le cae cerca (puede esquivar alguno corriendo). La armadura lo reduce y los tótems lo salvan.' },
      { clave: 'dano', etiqueta: 'Daño del golpe final (♥)', tipo: 'numero', defecto: 10, min: 0, max: 50, paso: 0.5, descripcion: 'Lo que le quita la andanada final, cuando todos los puños caen a la vez. La armadura lo reduce y los tótems lo salvan.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Tras el golpe final, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 1: los puños sueltos no hacen daño y el golpe final le arranca TODOS los tótems y muere al instante.' },
      { clave: 'romper', etiqueta: 'Romper bloques (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1: cada puño deja su boquete en el terreno. Con 0 no rompe nada.' },
      { clave: 'potencia', etiqueta: 'Explosión del golpe final', tipo: 'numero', defecto: 0, min: 0, max: 10, paso: 0.5, descripcion: 'Una explosión extra al caer la andanada (la TNT es 4, sin fuego). Con 0 no hay: solo los boquetes de los puños.' },
      { clave: 'noche', etiqueta: 'Se hace de noche (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Anochece (solo para los que están cerca) para que el oro y la luz resalten. Al acabar, vuelve la hora de antes.' },
      { clave: 'subir', etiqueta: 'Subirlo a la superficie si está bajo tierra (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Si el jugador está en una mina, una cueva o bajo techo, una luz lo alza y lo deja en la superficie, justo encima de donde estaba, y ahí se construye el Buda. Con 0 se queda donde está (y bajo tierra no lo vería).' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&6&l☸ BUDA ☸' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&eDespierta para juzgarte' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6&l[Buda] &eUn Buda gigante despierta ante &f{jugador}&e.' },
    ],
    estimado: (v) => {
      if (v.matar >= 1) return { texto: 'Insta kill: muere con el golpe final.', clase: 'mata' }
      if (v.totems >= 1) return { texto: `Le quita ${v.totems} tótems; si no tiene tantos, muere.`, clase: 'mata' }
      const total = v.golpes * v.golpe + v.dano
      if (total <= 0) return { texto: 'No quita vida.', clase: 'vive' }
      return total >= 10
        ? { texto: `Sin armadura no sobrevive: hasta ${total.toFixed(1)} ♥ entre los puños y el golpe final. Con armadura aguanta más.`, clase: 'mata' }
        : { texto: `Sin armadura sobrevive: pierde como mucho ${total.toFixed(1)} de 10 corazones.`, clase: 'vive' }
    },
  },
  {
    prefijo: 'cortes',
    aliases: ['milcortes', 'santuario'],
    nombre: 'Mil cortes divinos',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del santuario', tipo: 'numero', defecto: 1, min: 0.6, max: 1.5, paso: 0.1, descripcion: 'Con 1 mide unos 19 bloques de ancho y 24 de alto (con los cuernos). Sale de la tierra delante del jugador.' },
      { clave: 'duracion', etiqueta: 'Segundos de cortes', tipo: 'numero', defecto: 6, min: 2, max: 20, paso: 0.5, descripcion: 'Lo que dura la lluvia de cortes, desde que el santuario abre la boca hasta el remate.' },
      { clave: 'cortes', etiqueta: 'Cortes por segundo', tipo: 'numero', defecto: 18, min: 4, max: 40, paso: 1, descripcion: 'Tajos que se ven cada segundo: unos cruzan al jugador y otros, lo que tiene alrededor. El contador de la pantalla llega siempre a mil.' },
      { clave: 'dps', etiqueta: 'Daño de los cortes (♥ por segundo)', tipo: 'numero', defecto: 5, min: 0, max: 40, paso: 0.5, descripcion: 'Le quita vida todo el rato mientras lo cortan. La armadura lo reduce y los tótems lo salvan.' },
      { clave: 'dano', etiqueta: 'Daño del remate (♥)', tipo: 'numero', defecto: 10, min: 0, max: 50, paso: 0.5, descripcion: 'Los dos tajos enormes en cruz del final.' },
      { clave: 'potencia', etiqueta: 'Explosión del remate', tipo: 'numero', defecto: 4, min: 0, max: 10, paso: 0.5, descripcion: 'La TNT es 4. Sin fuego. 0 = sin explosión.' },
      { clave: 'totems', etiqueta: 'Tótems que corta al final', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Tras el remate, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 1: los cortes no hacen daño y el remate le corta TODOS los tótems y muere al instante.' },
      { clave: 'romper', etiqueta: 'Romper bloques (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1: el santuario despeja el sitio por donde sale, los cortes trocean el terreno y el remate deja cráter. Con 0 no rompe nada.' },
      { clave: 'despejar', etiqueta: 'Despejar el terreno alrededor (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Al empezar, el dominio borra lo que taparía el show: árboles, cerros y construcciones en unos 32 bloques alrededor del santuario y en el pasillo hasta el jugador. No cava: deja el suelo. Los cofres sueltan lo que llevan. Con 0 no quita nada (solo lo que pisa el santuario, si «Romper bloques» está en 1).' },
      { clave: 'noche', etiqueta: 'Oscuridad (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'El cielo se cierra en negro alrededor y se hace de noche para los que están cerca; el santuario queda a plena luz. Mientras dura se les quita la visión nocturna y al acabar la recuperan.' },
      { clave: 'subir', etiqueta: 'Subirlo a la superficie si está bajo tierra (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Si el jugador está en una mina, una cueva o bajo techo, antes de empezar se le sube a la superficie, justo encima de donde estaba.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&4&lMIL CORTES DIVINOS' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&c{donador} abrió su santuario' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&4&l[Mil cortes divinos] &f{donador} &7abrió su santuario sobre &f{jugador}&7.' },
    ],
    estimado: (v) => {
      if (v.matar >= 1) return { texto: 'Insta kill: muere en el remate.', clase: 'mata' }
      const total = v.dps * v.duracion + v.dano
      if (total <= 0) return { texto: 'No quita vida.', clase: 'vive' }
      return total >= 10
        ? { texto: `Sin armadura no sobrevive: son ${total.toFixed(1)} ♥ entre los cortes y el remate. Con armadura aguanta más.`, clase: 'mata' }
        : { texto: `Sin armadura sobrevive: pierde unos ${total.toFixed(1)} de 10 corazones.`, clase: 'vive' }
    },
  },
  {
    prefijo: 'angel',
    aliases: ['arcangel', 'ofanin', 'serafin'],
    nombre: 'Arcángel',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del arcángel', tipo: 'numero', defecto: 1, min: 0.4, max: 2, paso: 0.1, descripcion: 'Con 1, el ojo central mide unos 11 bloques, los aros unos 28 y las alas abiertas unos 60 de punta a punta. Flota en el cielo delante del jugador y lo sigue.' },
      { clave: 'carga', etiqueta: 'Segundos encadenado antes del rayo', tipo: 'numero', defecto: 3, min: 1.5, max: 10, paso: 0.5, descripcion: 'Los aros se ponen de cara al jugador y de ellos salen cadenas de oro que lo atan: no puede moverse. Los ojos se encienden y la luz se junta en el ojo central.' },
      { clave: 'duracion', etiqueta: 'Segundos de rayo divino', tipo: 'numero', defecto: 3, min: 1, max: 20, paso: 0.5, descripcion: 'Un rayo enorme (unos 13 bloques de grueso) sale del ojo central y cae sobre el jugador encadenado. Al acabar, las cadenas revientan, estalla y se alza una cruz de luz.' },
      { clave: 'dps', etiqueta: 'Daño del rayo (♥ por segundo)', tipo: 'numero', defecto: 8, min: 0, max: 50, paso: 0.5, descripcion: 'Mientras el rayo le cae encima (4 toques por segundo); el estallido final hace el doble de golpe. La armadura lo reduce y los tótems lo salvan. 0 = solo efecto.' },
      { clave: 'potencia', etiqueta: 'Explosión final', tipo: 'numero', defecto: 4, min: 0, max: 10, paso: 0.5, descripcion: 'Donde cae el rayo final y se alza la cruz de luz. Rompe bloques, sin fuego. 0 = sin explosión.' },
      { clave: 'romper', etiqueta: 'El rayo rompe bloques (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1, el rayo va abriendo un cráter donde pega (los cofres sueltan lo que llevan). Con 0 solo rompe la explosión final.' },
      { clave: 'subir', etiqueta: 'Subirlo a la superficie si está bajo tierra (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Si el jugador está en una mina, una cueva o bajo techo, una luz lo alza y lo deja en la superficie, justo encima de donde estaba, y ahí aparece el Ángel. Con 0 se queda donde está (y bajo tierra no lo vería).' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&e&lNO TEMAS' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&fUn arcángel desciende del cielo…' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&e{donador} invocó un Arcángel → {jugador}' },
    ],
    estimado: (v) => estimadoMuerte(v.dps, v.duracion),
  },
  {
    prefijo: 'nuclear',
    aliases: ['nuke', 'bombanuclear'],
    nombre: 'Bomba nuclear',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varias, caen todas. Con un número, las que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del hongo', tipo: 'numero', defecto: 1, min: 0.5, max: 2, paso: 0.1, descripcion: 'Con 1 el hongo sube unos 70 bloques y la seta mide unos 50 de ancho. Con 2, el doble.' },
      { clave: 'distancia', etiqueta: 'A cuántos bloques cae', tipo: 'numero', defecto: 42, min: 20, max: 90, paso: 1, descripcion: 'La bomba cae delante del jugador, a esta distancia, para que vea el hongo entero antes de que le llegue la onda.' },
      { clave: 'cuenta', etiqueta: 'Segundos de alerta', tipo: 'numero', defecto: 4, min: 2, max: 15, paso: 0.5, descripcion: 'Sirena y cuenta atrás antes de que el bombardero suelte la bomba (que tarda otros dos segundos y pico en caer).' },
      { clave: 'camara', etiqueta: 'La cámara sigue al avión (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Durante la pasada del bombardero el jugador lo ve desde atrás, como en una película; al soltar la bomba vuelve a su sitio para ver la explosión. Con 0 lo ve todo desde el suelo.' },
      { clave: 'dano', etiqueta: 'Daño de la onda expansiva (♥)', tipo: 'numero', defecto: 20, min: 0, max: 50, paso: 0.5, descripcion: 'El golpe cuando la onda alcanza al jugador. La armadura lo reduce y los tótems lo salvan.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Tras la onda, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 1, la onda lo mata sin más: ni la armadura ni los tótems lo salvan.' },
      { clave: 'empuje', etiqueta: 'Empuje de la onda (0 = nada)', tipo: 'numero', defecto: 1, min: 0, max: 2, paso: 0.1, descripcion: 'Cuánto lo lanza hacia atrás la onda expansiva.' },
      { clave: 'radiacion', etiqueta: 'Segundos de radiación', tipo: 'numero', defecto: 0, min: 0, max: 30, paso: 1, descripcion: 'Si sobrevive, queda envenenado y con hambre este tiempo. 0 = sin radiación.' },
      { clave: 'romper', etiqueta: 'Arrasa el terreno (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1 deja un cráter en la zona cero, quema el suelo y se lleva los árboles en unos 30 bloques a la redonda. Los cofres sueltan lo que llevan. No se deshace.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&4&l☢ ALERTA NUCLEAR ☢' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&cBusca refugio… si puedes' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&4☢ &c{donador} lanzó una bomba nuclear sobre {jugador}' },
    ],
    estimado: (v) => {
      if (v.matar >= 1) return { texto: 'La onda expansiva lo mata, tenga lo que tenga.', clase: 'mata' }
      if (v.totems >= 1) return { texto: `Le quita ${v.totems} tótems; si no tiene tantos, muere.`, clase: 'mata' }
      return { texto: `Onda expansiva de ${v.dano} ♥${v.dano >= 10 ? ': sin armadura ni tótem, muere.' : '.'}`, clase: v.dano >= 10 ? 'mata' : '' }
    },
  },
  {
    prefijo: 'wukong',
    aliases: ['reymono', 'monkeyking'],
    nombre: 'Wukong',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Altura de Wukong (bloques)', tipo: 'numero', defecto: 11, min: 5, max: 24, paso: 1, descripcion: 'Con 11 mide unos once bloques; su bastón llega a doblarlo en el torbellino y se hace una columna en el golpe final.' },
      { clave: 'giro', etiqueta: 'Segundos de torbellino', tipo: 'numero', defecto: 4.5, min: 1.5, max: 12, paso: 0.5, descripcion: 'Gira como una peonza con el bastón extendido, cada vez más largo, persiguiendo al jugador.' },
      { clave: 'dps', etiqueta: 'Daño del torbellino (♥ por segundo)', tipo: 'numero', defecto: 2, min: 0, max: 20, paso: 0.5, descripcion: 'Mientras el bastón lo alcanza. El torbellino nunca remata: lo deja con medio corazón como mucho. 0 = solo lo lanza.' },
      { clave: 'empuje', etiqueta: 'Empuje de los golpes (0 = nada, 1 = fuerte)', tipo: 'numero', defecto: 0.4, min: 0, max: 1.5, paso: 0.1, descripcion: 'Cuánto lo lanza por los aires cada golpe del torbellino. Con 0.4 lo mueve sin mandarlo lejos; el tornado además tira de él hacia dentro.' },
      { clave: 'totemsgolpe', etiqueta: 'Tótems que quita cada golpe del torbellino', tipo: 'numero', defecto: 0, min: 0, max: 20, paso: 1, descripcion: 'Cada vez que el bastón lo alcanza girando (unos cuatro golpes por segundo si lo tiene a tiro), le gasta esta cantidad de tótems. Si se queda sin tótems, muere. 0 = el torbellino no toca los tótems.' },
      { clave: 'dano', etiqueta: 'Daño del golpe final (♥)', tipo: 'numero', defecto: 10, min: 0, max: 50, paso: 0.5, descripcion: 'El bastón gigante cayendo sobre él. La armadura lo reduce.' },
      { clave: 'totems', etiqueta: 'Tótems que quita el golpe final', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Tras el golpe final, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 1, el golpe final lo mata sin más: ni la armadura ni los tótems lo salvan.' },
      { clave: 'romper', etiqueta: 'Rompe bloques (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1, el torbellino arrasa lo que pilla a su altura y el golpe final deja un cráter y una zanja. Los cofres sueltan lo que llevan. No se deshace.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&6&l孫悟空 · WUKONG' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&eEl Rey Mono viene por ti' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6{donador} invocó a Wukong → {jugador}' },
    ],
    estimado: (v) => {
      if (v.matar >= 1) return { texto: 'El golpe final lo mata, tenga lo que tenga.', clase: 'mata' }
      if (v.totems >= 1) return { texto: `Le quita ${v.totems} tótems; si no tiene tantos, muere.`, clase: 'mata' }
      return { texto: `Torbellino + golpe final de ${v.dano} ♥.` }
    },
  },
  {
    prefijo: 'escudo',
    nombre: 'Escudo',
    opciones: [
      { clave: 'vida', etiqueta: 'Vida del escudo (♥)', tipo: 'numero', defecto: 50, min: 1, max: 100000, paso: 1, descripcion: 'Cuánto daño aguanta antes de romperse, en corazones. Mientras dura, al jugador no le baja la vida ni gasta tótems. La barra de arriba muestra lo que le queda.' },
      { clave: 'tope', etiqueta: 'Máximo que le quita un solo golpe (♥)', tipo: 'numero', defecto: 10, min: 0, max: 100000, paso: 1, descripcion: 'Un golpe enorme (insta kill, golpes que quitan tótems) solo le cuenta esto al escudo. 0 = sin tope: un golpe mortal lo rompe de una.' },
      { clave: 'duracion', etiqueta: 'Segundos que dura (0 = hasta que lo rompan)', tipo: 'numero', defecto: 0, min: 0, max: 36000, paso: 1, descripcion: 'Con un número, el escudo se apaga solo al pasar ese tiempo aunque le quede vida.' },
      { clave: 'sumar', etiqueta: 'Si ya tiene escudo, sumar la vida (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1, cada regalo le añade vida al escudo que ya tiene. Con 0, lo deja otra vez en la vida de arriba.' },
      { clave: 'tamano', etiqueta: 'Tamaño de la burbuja', tipo: 'numero', defecto: 1, min: 0.6, max: 3, paso: 0.1, descripcion: '1 = unos 3 bloques de ancho.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&b&lESCUDO' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo ({vida} = corazones)', tipo: 'texto', defecto: '&f{vida} ♥ de energía' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat (vacío = ninguno)', tipo: 'texto', defecto: '' },
    ],
    estimado: (v) => ({ texto: v.tope > 0 ? `Aguanta ${v.vida} ♥ de daño: al menos ${Math.ceil(v.vida / v.tope)} golpes fuertes.` : `Aguanta ${v.vida} ♥ de daño.` }),
  },
  {
    prefijo: 'totems dar',
    nombre: 'Dar tótems',
    opciones: [
      { clave: 'cantidad', etiqueta: 'Tótems que da', tipo: 'numero', defecto: 1, min: 1, max: 2000, paso: 1, descripcion: 'Cuántos tótems recibe el jugador cada vez que llega el regalo. Si no caben en el inventario, los que sobran caen a sus pies.' },
      { clave: 'aviso', etiqueta: 'Aviso «+N tótems» en pantalla (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Un texto dorado sobre la barra de objetos al recibirlos.' },
      { clave: 'sonido', etiqueta: 'Sonido al recibirlos (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'El sonido de recoger un objeto.' },
      { clave: 'juntar', etiqueta: 'Juntarlos en pilas después (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 1, tras darlos reúne todos los tótems del jugador en las menos pilas posibles.' },
    ],
    estimado: (v) => ({ texto: `Cada regalo le da ${v.cantidad} ${v.cantidad === 1 ? 'tótem' : 'tótems'}.` }),
  },
  {
    prefijo: 'rinnegan',
    aliases: ['ojo', 'amaterasu'],
    nombre: 'Rinnegan',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del ojo', tipo: 'numero', defecto: 1.5, min: 0.6, max: 3, paso: 0.1, descripcion: 'Ojo en 3D con forma de almendra: con 1.5 mide unos 36 bloques de ancho; con 3, unos 72. Flota en el cielo delante del jugador, lo sigue y lo mira.' },
      { clave: 'carga', etiqueta: 'Segundos cerrado antes de abrirse', tipo: 'numero', defecto: 3, min: 1, max: 10, paso: 0.5, descripcion: 'El ojo aparece cerrado y late cada vez más rápido hasta que se abre con el Rinnegan.' },
      { clave: 'duracion', etiqueta: 'Segundos que arde en el jugador', tipo: 'numero', defecto: 6, min: 2, max: 30, paso: 0.5, descripcion: 'El ojo enfoca al jugador y las llamas negras brotan de él (nada viaja por el aire): nacen a sus pies, crecen y lo siguen este tiempo.' },
      { clave: 'llama', etiqueta: 'Tamaño de la llama sobre el jugador', tipo: 'numero', defecto: 1, min: 0.3, max: 3, paso: 0.1, descripcion: '1 = normal (unos 3 bloques de alto). 2 = el doble. 0.5 = la mitad.' },
      { clave: 'dps', etiqueta: 'Daño de las llamas (♥ por segundo)', tipo: 'numero', defecto: 3, min: 0, max: 40, paso: 0.5, descripcion: 'Mientras arde (4 toques por segundo). La armadura lo reduce y los tótems lo salvan. 0 = solo efecto.' },
      { clave: 'totems', etiqueta: 'Tótems que consume al final', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al cerrarse el ojo, toques seguidos; cada uno le gasta un tótem. 0 = ninguno.' },
      { clave: 'romper', etiqueta: 'Las llamas consumen bloques (1 = sí)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 0 (normal) no rompe nada. Con 1, al prenderse desaparecen los bloques de alrededor del jugador (no los cofres).' },
      { clave: 'noche', etiqueta: 'Se hace de noche (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Medianoche para los que están cerca mientras dura; al irse vuelve la hora de antes.' },
      { clave: 'titulo', etiqueta: 'Título (al abrirse)', tipo: 'texto', defecto: '&5&lRINNEGAN' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&5&l[Rinnegan] &dUn ojo se abre en el cielo sobre &f{jugador}&d.' },
    ],
    estimado: (v) => estimadoMuerte(v.dps, v.duracion),
  },
  {
    prefijo: 'sagitario',
    aliases: ['constelacion', 'arquero'],
    nombre: 'Sagitario',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos (cada constelación a un lado del cielo). Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño del arquero', tipo: 'numero', defecto: 5, min: 2, max: 8, paso: 0.5, descripcion: 'Con 5, el centauro de oro mide unos 67 bloques de alto y la rueda del zodiaco que lo rodea, unos 95. Aparece en el cielo delante del jugador: primero la rueda y el símbolo ♐, luego la constelación y sobre ella el cuerpo, soltando polvo de oro.' },
      { clave: 'flechas', etiqueta: 'Flechas de luz', tipo: 'numero', defecto: 3, min: 1, max: 10, paso: 1, descripcion: 'El centauro tensa el arco y las dispara una a una; cada una cruza el cielo y cae sobre el jugador.' },
      { clave: 'cadencia', etiqueta: 'Segundos entre flechas', tipo: 'numero', defecto: 2.5, min: 1, max: 10, paso: 0.5 },
      { clave: 'totems', etiqueta: 'Tótems que quita cada flecha', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Cada flecha le quita exactamente esta cantidad de tótems (golpes mortales seguidos; cada uno le gasta uno). Si se queda sin tótems, muere. Con 0 las flechas no tocan los tótems y hacen el daño en corazones de abajo.' },
      { clave: 'dano', etiqueta: 'Daño de cada flecha (♥) si no quita tótems', tipo: 'numero', defecto: 8, min: 0, max: 50, paso: 0.5, descripcion: 'Solo si «Tótems que quita cada flecha» = 0. La armadura lo reduce y los tótems lo salvan. Las explosiones no le hacen daño aparte: el daño es este.' },
      { clave: 'potencia', etiqueta: 'Explosión de cada flecha', tipo: 'numero', defecto: 7, min: 0, max: 10, paso: 0.5, descripcion: 'La del impacto (la TNT es 4). Sin fuego. 0 = sin explosiones de verdad (siguen la luz y el rayo).' },
      { clave: 'explosiones', etiqueta: 'Explosiones en cadena por flecha', tipo: 'numero', defecto: 4, min: 0, max: 12, paso: 1, descripcion: 'Estallan una tras otra en espiral alrededor del impacto, cada una a 3/4 de la potencia.' },
      { clave: 'romper', etiqueta: 'Romper bloques (1 = sí)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 0 las explosiones empujan pero no rompen nada.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 0, min: 0, max: 1, paso: 1, descripcion: 'Con 1: las flechas no hacen daño ni quitan tótems una a una; la última le quema TODOS los tótems y muere al instante.' },
      { clave: 'noche', etiqueta: 'Cielo negro (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'El cielo se cierra en negro total alrededor del jugador y dentro se enciende el suyo: cientos de estrellas que titilan, una vía láctea de colores y estrellas fugaces. Se hace de noche para los que están cerca. Mientras dura se les quita la visión nocturna, que aclararía el cielo; al irse el arquero se abre, vuelve la hora de antes y recuperan la visión nocturna.' },
      { clave: 'subir', etiqueta: 'Subirlo a la superficie si está bajo tierra (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Si el jugador está en una mina, una cueva o bajo techo, una luz dorada lo alza y lo deja en la superficie, justo encima de donde estaba, y ahí aparece Sagitario. Con 0 se queda donde está (y bajo tierra no lo vería).' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&6&l♐ SAGITARIO ♐' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&e&ode {donador}' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6&l[Sagitario] &f{donador} &7despertó al arquero dorado sobre &f{jugador}&7.' },
    ],
    estimado: (v) => {
      if (v.matar >= 1) return { texto: 'Insta kill: muere con la última flecha.', clase: 'mata' }
      if (v.totems >= 1) return { texto: `${v.flechas} flechas × ${v.totems} = le quita ${v.flechas * v.totems} tótems en total. Si tiene menos, muere.`, clase: 'mata' }
      const total = v.dano * v.flechas
      if (total <= 0) return { texto: 'No quita vida.', clase: 'vive' }
      return total >= 10
        ? { texto: `Sin armadura muere con la flecha ${Math.ceil(10 / v.dano)} de ${v.flechas}. Con armadura aguanta más.`, clase: 'mata' }
        : { texto: `Sin armadura sobrevive: pierde ${total.toFixed(1)} de 10 corazones.`, clase: 'vive' }
    },
  },
  {
    prefijo: 'esqueleto',
    aliases: ['segador', 'guadana'],
    nombre: 'Esqueleto gigante',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, salen todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'tamano', etiqueta: 'Tamaño (bloques de alto)', tipo: 'numero', defecto: 20, min: 6, max: 30, paso: 1, descripcion: 'La guadaña es aún más alta que él.' },
      { clave: 'noche', etiqueta: 'Se hace de noche (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Noche y rayos mientras está la Parka; al irse vuelve la hora de antes.' },
      { clave: 'matar', etiqueta: 'Insta kill (1 = sí, 0 = no)', tipo: 'numero', defecto: 1, min: 0, max: 1, paso: 1, descripcion: 'Con 1: si el golpe le da, le arranca TODOS los tótems (vuelan uno a uno a la guadaña con un contador de almas cosechadas) y muere al instante. Con 0: usa el daño y los tótems que arranca de abajo.' },
      { clave: 'dano', etiqueta: 'Daño del golpe (♥) sin insta kill', tipo: 'numero', defecto: 20, min: 0, max: 50, paso: 0.5, descripcion: 'Solo si Insta kill = 0. La armadura lo reduce y los tótems lo salvan.' },
      { clave: 'potencia', etiqueta: 'Explosión del golpe', tipo: 'numero', defecto: 6, min: 0, max: 10, paso: 0.5, descripcion: 'La del centro. Rompe bloques, sin fuego. 0 = ninguna explosión rompe bloques (siguen los rayos, la onda y los escombros).' },
      { clave: 'explosiones', etiqueta: 'Explosiones en cadena', tipo: 'numero', defecto: 10, min: 0, max: 20, paso: 1, descripcion: 'Estallan una tras otra alrededor del golpe (5 cerca y el resto más lejos), cada una a 3/4 de la potencia. Más = más bloques reventados.' },
      { clave: 'totems', etiqueta: 'Tótems que arranca sin insta kill', tipo: 'numero', defecto: 20, min: 0, max: 120, paso: 1, descripcion: 'Solo si Insta kill = 0: tras el golpe, golpes mortales seguidos; cada uno le hace saltar un tótem. Si se queda sin tótems, muere.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&f&l[ESQUELETO GIGANTE]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&7La guadaña te busca…' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&7{donador} lanzó Esqueleto gigante → {jugador}' },
    ],
  },
  {
    prefijo: 'ml planetario',
    aliases: ['ml caos'],
    nombre: 'Planetario',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'dano', etiqueta: 'Daño por impacto (♥)', tipo: 'numero', defecto: 1, min: 0, max: 20, paso: 0.5, descripcion: 'Cada uno de los 5 planetas que se estrellan contra el jugador le quita esto a él y a lo que esté cerca.' },
      { clave: 'potencia', etiqueta: 'Potencia de explosión', tipo: 'numero', defecto: 4.2, min: 0, max: 10, paso: 0.1, descripcion: 'Explosión de cada impacto. Rompe bloques.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&5&l[PLANETARIO]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&d&oEl mundo se rompe' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&b{donador} lanzó Planetario → {jugador}' },
    ],
    estimado: (v) => (v.dano > 0 ? { texto: `5 impactos: hasta ${(v.dano * 5).toFixed(1)} corazones de daño directo, más la explosión.`, clase: v.dano * 5 >= 10 ? 'mata' : 'vive' } : null),
  },
  {
    prefijo: 'corona',
    aliases: ['espada'],
    nombre: 'Corona de espadas',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'potencia', etiqueta: 'Potencia de explosión', tipo: 'numero', defecto: 2.8, min: 0, max: 6, paso: 0.1, descripcion: 'Cada una de las 15 espadas explota al clavarse. Rompe bloques, sin fuego.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&b&l[CORONA DE ESPADAS]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&e&oTe rodean' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6{donador} lanzó Corona de espadas → {jugador}' },
    ],
  },
  {
    prefijo: 'atomica',
    nombre: 'Atómica',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'potencia', etiqueta: 'Potencia de explosión', tipo: 'numero', defecto: 8, min: 0, max: 10, paso: 0.5, descripcion: 'Cada explosión del bombardeo. Rompe bloques y prende fuego.' },
      { clave: 'radio', etiqueta: 'Radio del bombardeo', tipo: 'numero', unidad: 'bloques', defecto: 22, min: 4, max: 26, paso: 1, descripcion: 'Zona donde caen las explosiones. Más radio = muchas más explosiones.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&6&l[ATÓMICA]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&c&oHongo nuclear' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6{donador} lanzó Bomba atómica → {jugador}' },
    ],
    estimado: (v) => {
      let n = 0
      const r = Math.round(v.radio)
      for (let dx = -r; dx <= r; dx += 4) for (let dy = -Math.trunc(r / 2); dy <= Math.trunc(r / 3); dy += 4) for (let dz = -r; dz <= r; dz += 4) if (dx * dx + dy * dy + dz * dz <= r * r) n++
      return { texto: `≈${n} explosiones de potencia ${v.potencia}. Destruye mucho terreno.`, clase: 'mata' }
    },
  },
  {
    prefijo: 'agujero',
    nombre: 'Agujero negro',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'dano', etiqueta: 'Daño por succión (♥ cada 0,5 s)', tipo: 'numero', defecto: 0.5, min: 0, max: 20, paso: 0.5, descripcion: 'Daño cada medio segundo mientras te succiona.' },
      { clave: 'duracion', etiqueta: 'Duración de la succión (s)', tipo: 'numero', defecto: 5, min: 1, max: 15, paso: 0.5, descripcion: 'Tiempo que te jala antes de explotar.' },
      { clave: 'potencia', etiqueta: 'Potencia de la explosión final', tipo: 'numero', defecto: 4, min: 0, max: 10, paso: 0.5, descripcion: 'Rompe bloques.' },
      { clave: 'radio', etiqueta: 'Radio del cráter', tipo: 'numero', unidad: 'bloques', defecto: 8, min: 0, max: 16, paso: 1, descripcion: 'Esfera de bloques que se borran tras la explosión.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&8&l[AGUJERO NEGRO]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&0Te está tragando' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&5{donador} lanzó Agujero negro → {jugador}' },
    ],
    estimado: (v) => {
      const bloques = Math.round((4 / 3) * Math.PI * v.radio ** 3)
      const succion = v.dano * Math.floor((v.duracion * 20 - 1) / 10)
      const vida = succion >= 10 ? 'La succión sola mata sin armadura.' : `La succión quita ≈${succion.toFixed(1)} corazones.`
      return { texto: `${vida} Cráter ≈${bloques} bloques.`, clase: succion >= 10 ? 'mata' : 'vive' }
    },
  },
  {
    prefijo: 'trueno',
    nombre: 'Trueno',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'rayos', etiqueta: 'Número de rayos', tipo: 'numero', defecto: 3, min: 1, max: 6, paso: 1, descripcion: 'Cada rayo trae su explosión, uno cada 1,2 s.' },
      { clave: 'potencia', etiqueta: 'Potencia de explosión', tipo: 'numero', defecto: 3.5, min: 0, max: 10, paso: 0.5, descripcion: 'Explosión tras cada rayo. Rompe bloques.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&e&l[TRUENO]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo', tipo: 'texto', defecto: '&f&oEl cielo se parte' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&6{donador} lanzó Trueno → {jugador}' },
    ],
  },
  {
    prefijo: 'superrayo',
    nombre: 'Super rayo',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'dano', etiqueta: 'Daño del impacto (♥)', tipo: 'numero', defecto: 8, min: 0, max: 20, paso: 0.5, descripcion: 'Daño directo cuando cae el rayo, además de las explosiones.' },
      { clave: 'potencia', etiqueta: 'Potencia de la explosión central', tipo: 'numero', defecto: 6, min: 0, max: 10, paso: 0.5, descripcion: 'Rompe bloques. Las 4 explosiones de alrededor no cambian.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título de aviso', tipo: 'texto', defecto: '&4&l[SUPER RAYO]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo de aviso', tipo: 'texto', defecto: '&7&oEl cielo se apaga' },
      { clave: 'titulofinal', etiqueta: 'Título al caer el rayo', tipo: 'texto', defecto: '&f&l¡SUPER RAYO!' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&c{donador} lanzó Super rayo → {jugador}' },
    ],
    estimado: (v) => (v.dano >= 10
      ? { texto: 'El impacto solo mata a un jugador sin armadura.', clase: 'mata' }
      : { texto: `El impacto quita ${v.dano} corazones, más las explosiones.`, clase: 'vive' }),
  },
  {
    prefijo: 'cruz',
    nombre: 'Cruz (Raya)',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite: si llegan varios, se lanzan todos juntos. Con un número, los que sobren esperan su turno.' },
      { clave: 'potencia', etiqueta: 'Potencia de la explosión final', tipo: 'numero', defecto: 5.8, min: 0, max: 10, paso: 0.5, descripcion: 'Rompe bloques. Las 4 explosiones de alrededor no cambian.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título de aviso', tipo: 'texto', defecto: '&e&l[RAYA]' },
      { clave: 'subtitulo', etiqueta: 'Subtítulo de aviso', tipo: 'texto', defecto: '&a&oLa luz te sigue' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&e{donador} lanzó Raya → {jugador}' },
    ],
  },
  {
    prefijo: 'carcel',
    nombre: 'Cárcel',
    opciones: [
      { clave: 'max', etiqueta: 'Máximo de cárceles a la vez', tipo: 'numero', defecto: 0, min: 0, max: 50, paso: 1, descripcion: '0 = sin límite. Una cárcel por jugador: si repiten sobre el mismo, se suma tiempo a su condena.' },
      { clave: 'duracion', etiqueta: 'Tiempo encerrado (s)', tipo: 'numero', defecto: 15, min: 1, max: 120, paso: 1, descripcion: 'Si ya está encerrado, se suma al tiempo que le queda.' },
      { clave: 'totems', etiqueta: 'Tótems que le quita al terminar', tipo: 'numero', defecto: 0, min: 0, max: 120, paso: 1, descripcion: 'Al acabar el show, golpes mortales seguidos; cada uno le gasta exactamente un tótem. Si se queda sin tótems, muere. 0 = ninguno.' },
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', defecto: '&8&l[CÁRCEL]' },
      { clave: 'chat', etiqueta: 'Mensaje en el chat', tipo: 'texto', defecto: '&7{donador} lanzó Cárcel → {jugador}' },
    ],
  },
]
