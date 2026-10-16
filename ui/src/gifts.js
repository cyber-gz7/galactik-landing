import { CATALOGO_GIFTS } from './gifts-data.js';

export function limpiarArchivoGift(raw) {
  const clean = String(raw || '').trim().replace(/^(\.?\/)?(gifts\/)+/i, '');
  return clean || 'rose-1-coins.webp';
}

export function normalizarTextoGift(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const GIFT_CANONICAL_GROUPS = [
  {
    key: 'rose',
    tiktokGiftIds: [5655],
    defaultCoins: 1,
    defaultFile: 'rose-1-coins.webp',
    names: ['rose', 'rosa', 'rosa oscura', 'rosa de luz', '🌹 empuje rojo (rosa)', 'empuje rojo (rosa)', 'gift#5655', '5655']
  },
  {
    key: 'gg',
    tiktokGiftIds: [6064, 6093, 7214],
    defaultCoins: 1,
    defaultFile: 'gg-1-coins.webp',
    names: ['gg', 'gg bendicion', 'gg 2025', '🎮 empuje azul (gg)', 'empuje azul (gg)', 'gift#6064', 'gift#6093', 'gift#7214', '6064', '6093', '7214']
  },
  {
    key: 'heart_me',
    tiktokGiftIds: [7934],
    defaultCoins: 1,
    defaultFile: 'heart-me-1-coins.webp',
    names: ['heart me', 'me gusta', 'corazon de equipo', 'team heart', 'gift#7934', '7934']
  },
  {
    key: 'heart',
    tiktokGiftIds: [5585],
    defaultCoins: 1,
    defaultFile: 'heart-1-coins.webp',
    names: ['heart', 'corazon', 'gift#5585', '5585']
  },
  {
    key: 'finger_heart',
    tiktokGiftIds: [5487],
    defaultCoins: 5,
    defaultFile: 'finger-heart-5-coins.webp',
    names: ['finger heart', 'corazon con dedos', 'dedos corazon', 'mini corazon', 'gift#5487', '5487']
  },
  {
    key: 'doughnut',
    tiktokGiftIds: [5879],
    defaultCoins: 30,
    defaultFile: 'doughnut-30-coins.webp',
    names: ['doughnut', 'donut', 'dona', 'rosquilla', 'gift#5879', '5879']
  },
  {
    key: 'ice_cream_cone',
    tiktokGiftIds: [5827],
    defaultCoins: 1,
    defaultFile: 'ice-cream-cone-1-coins.webp',
    names: ['ice cream cone', 'ice cream', 'helado', 'cono de helado', 'gift#5827', '5827']
  },
  {
    key: 'youre_awesome',
    tiktokGiftIds: [15232],
    defaultCoins: 1,
    defaultFile: 'youre-awesome-1-coins.webp',
    names: ["you're awesome", 'youre awesome', 'eres increible', 'gift#15232', '15232']
  },
  {
    key: 'love_you_so_much',
    tiktokGiftIds: [15233],
    defaultCoins: 1,
    defaultFile: 'love-you-so-much-1-coins.webp',
    names: ['love you so much', 'te quiero mucho', 'te amo mucho', 'gift#15233', '15233']
  },
  {
    key: 'capybara',
    tiktokGiftIds: [6562],
    defaultCoins: 30,
    defaultFile: 'capybara-30-coins.webp',
    names: ['capybara', 'capibara', 'carpincho', 'gift#6562', '6562']
  },
  {
    key: 'paper_crane',
    tiktokGiftIds: [5659],
    defaultCoins: 99,
    defaultFile: 'paper-crane-99-coins.webp',
    names: ['paper crane', 'grulla de papel', 'grulla', 'gift#5659', '5659']
  },
  {
    key: 'little_crown',
    tiktokGiftIds: [5658],
    defaultCoins: 99,
    defaultFile: 'little-crown-99-coins.webp',
    names: ['little crown', 'coronita', 'corona pequena', 'gift#5658', '5658']
  },
  {
    key: 'cap',
    tiktokGiftIds: [5660],
    defaultCoins: 99,
    defaultFile: 'cap-99-coins.webp',
    names: ['cap', 'gorra', 'cachucha', 'gift#5660', '5660']
  },
  {
    key: 'hat_and_mustache',
    tiktokGiftIds: [5890],
    defaultCoins: 99,
    defaultFile: 'hat-and-mustache-99-coins.webp',
    names: ['hat and mustache', 'sombrero y bigote', 'bigote']
  },
  {
    key: 'game_controller',
    tiktokGiftIds: [6070],
    defaultCoins: 100,
    defaultFile: 'game-controller-100-coins.webp',
    names: ['game controller', 'mando', 'control', 'control de juego']
  },
  {
    key: 'hand_hearts',
    tiktokGiftIds: [5586],
    defaultCoins: 100,
    defaultFile: 'hand-hearts-100-coins.webp',
    names: ['hand hearts', 'manos corazon', 'corazon con manos']
  },
  {
    key: 'money_gun',
    tiktokGiftIds: [7168],
    defaultCoins: 500,
    defaultFile: 'money-gun-500-coins.webp',
    names: ['money gun', 'pistola de billetes', 'pistola de dinero', 'lluvia de dinero']
  },
  {
    key: 'galaxy',
    tiktokGiftIds: [5994],
    defaultCoins: 1000,
    defaultFile: 'galaxy-1000-coins.webp',
    names: ['galaxy', 'galaxia', 'gift#5994', '5994']
  },
  {
    key: 'whale_diving',
    tiktokGiftIds: [6267],
    defaultCoins: 2150,
    defaultFile: 'whale-diving-2150-coins.webp',
    names: ['whale diving', 'ballena', 'ballena buceando']
  },
  {
    key: 'lion',
    tiktokGiftIds: [5509],
    defaultCoins: 29999,
    defaultFile: 'lion-29999-coins.webp',
    names: ['lion', 'leon', 'gift#5509', '5509']
  },
  {
    key: 'falcon',
    tiktokGiftIds: [6427],
    defaultCoins: 10999,
    defaultFile: 'falcon-10999-coins.webp',
    names: ['falcon', 'halcon']
  },
  {
    key: 'treasure_chest',
    tiktokGiftIds: [6150],
    defaultCoins: 1500,
    defaultFile: 'treasure-chest-1500-coins.webp',
    names: ['treasure chest', 'cofre del tesoro', 'cofre']
  },
  {
    key: 'fireworks',
    tiktokGiftIds: [5995],
    defaultCoins: 1088,
    defaultFile: 'fireworks-1088-coins.webp',
    names: ['fireworks', 'fuegos artificiales']
  }
];

const SPANISH_SEARCH_MAP = {
  rosa: ['rose', 'rosa', 'white rose', 'glowing rose', 'eternal rose'],
  rosas: ['rose', 'rosa', 'roses'],
  gg: ['gg', 'gg 2025', 'good game'],
  ggs: ['gg', 'gg 2025'],
  corazon: ['heart', 'heart me', 'finger heart', 'hand hearts', 'heart gaze', 'heart hood', 'love'],
  corazones: ['heart', 'hearts', 'hand hearts', 'heart me'],
  'me gusta': ['heart me', 'like', 'thumbs up'],
  dedo: ['finger heart', 'thumbs up', 'finger'],
  dedos: ['finger heart', 'hand hearts'],
  dona: ['doughnut', 'donut'],
  rosquilla: ['doughnut', 'donut'],
  helado: ['ice cream', 'ice cream cone', 'popsicle', 'gelato'],
  cono: ['ice cream cone'],
  ballena: ['whale', 'whale diving'],
  leon: ['lion', 'lion cub'],
  galaxia: ['galaxy', 'universe', 'planet', 'star'],
  universo: ['universe', 'tiktok universe', 'galaxy'],
  capibara: ['capybara'],
  carpincho: ['capybara'],
  gorra: ['cap', 'hat'],
  sombrero: ['hat', 'hat and mustache', 'cowboy hat', 'witch hat', 'top hat'],
  bigote: ['mustache', 'hat and mustache'],
  corona: ['crown', 'little crown', 'balloon crown', 'sun crown', 'king'],
  coronita: ['little crown', 'crown'],
  pistola: ['money gun', 'gun', 'water gun', 'bubble gun', 'laser'],
  dinero: ['money', 'money gun', 'cash', 'coin', 'gold'],
  billetes: ['money gun', 'money', 'cash'],
  fuegos: ['fireworks', 'fire', 'sparkler'],
  artificiales: ['fireworks'],
  halcon: ['falcon', 'eagle', 'hawk'],
  aguila: ['eagle', 'falcon'],
  cofre: ['treasure chest', 'chest', 'box'],
  tesoro: ['treasure chest', 'treasure'],
  oso: ['bear', 'mishka bear', 'bear with rose', 'teddy', 'panda'],
  osito: ['bear', 'teddy', 'mishka'],
  panda: ['panda'],
  gato: ['cat', 'kitty', 'kitten', 'paws'],
  gatito: ['cat', 'kitty', 'kitten'],
  perro: ['dog', 'corgi', 'puppy', 'pug', 'husky', 'shiba'],
  perrito: ['dog', 'puppy', 'corgi'],
  pato: ['duck', 'ducky'],
  patito: ['duck', 'ducky'],
  zorro: ['fox'],
  lobo: ['wolf'],
  tigre: ['tiger'],
  fenix: ['phoenix'],
  dragon: ['dragon', 'rising dragon', 'flame dragon'],
  mariposa: ['butterfly'],
  cisne: ['swan'],
  unicornio: ['unicorn'],
  caballo: ['horse', 'carousel', 'pegasus'],
  carrusel: ['carousel'],
  conejo: ['rabbit', 'bunny'],
  rana: ['frog'],
  tiburon: ['shark'],
  delfin: ['dolphin'],
  pulpo: ['octopus'],
  pez: ['fish', 'anglerfish', 'goldfish', 'koi'],
  grulla: ['paper crane', 'crane'],
  flor: ['flower', 'rose', 'sunflower', 'tulip', 'daisy', 'blossom', 'lotus', 'orchid'],
  flores: ['flowers', 'bouquet', 'rose', 'floral'],
  ramo: ['bouquet', 'flowers'],
  girasol: ['sunflower'],
  tulipan: ['tulip'],
  pastel: ['cake', 'birthday cake', 'cupcake'],
  torta: ['cake', 'birthday cake'],
  dulce: ['candy', 'lollipop', 'sweet', 'cotton candy'],
  caramelo: ['candy', 'lollipop'],
  chocolate: ['chocolate'],
  pizza: ['pizza'],
  hamburguesa: ['burger', 'hamburger'],
  taco: ['taco'],
  cafe: ['coffee', 'latte', 'espresso'],
  cerveza: ['beer', 'cheers'],
  vino: ['wine', 'champagne'],
  fresa: ['strawberry'],
  sandia: ['watermelon'],
  limon: ['lemon'],
  cereza: ['cherry'],
  aguacate: ['avocado'],
  palta: ['avocado'],
  palomitas: ['popcorn'],
  yate: ['yacht', 'cruiser', 'boat', 'ship'],
  barco: ['cruiser', 'ship', 'boat', 'pirate ship', 'yacht'],
  crucero: ['cruiser', 'yacht'],
  carro: ['car', 'sports car', 'race car', 'sunset speedway', 'lamborghini', 'ferrari'],
  auto: ['car', 'sports car', 'sunset speedway'],
  coche: ['car', 'sports car'],
  moto: ['motorcycle', 'bike', 'scooter'],
  bicicleta: ['bike', 'bicycle'],
  tren: ['train', 'express'],
  avion: ['plane', 'airplane', 'private jet', 'jet'],
  jet: ['jet', 'private jet', 'airplane'],
  helicoptero: ['helicopter'],
  cohete: ['rocket', 'spaceship'],
  nave: ['spaceship', 'ufo', 'rocket'],
  ovni: ['ufo', 'alien'],
  planeta: ['planet', 'earth', 'galaxy'],
  luna: ['moon', 'crescent'],
  sol: ['sun', 'sun crown', 'suncatcher', 'sunset'],
  estrella: ['star', 'shooting star', 'superstar'],
  castillo: ['castle', 'palace'],
  isla: ['island'],
  playa: ['beach', 'palm', 'coconut'],
  arcoiris: ['rainbow'],
  nube: ['cloud'],
  lluvia: ['rain', 'umbrella', 'money rain'],
  paraguas: ['umbrella'],
  rayo: ['thunder', 'lightning', 'bolt'],
  trueno: ['thunder', 'thunder hammer'],
  fuego: ['fire', 'flame', 'fireball', 'phoenix'],
  hielo: ['ice', 'snow', 'snowflake', 'frozen'],
  nieve: ['snow', 'snowflake', 'snowman'],
  diamante: ['diamond', 'power of diamond', 'gem', 'crystal'],
  anillo: ['ring', 'diamond ring'],
  collar: ['necklace', 'pearl'],
  reloj: ['watch', 'clock'],
  bolso: ['bag', 'handbag', 'purse'],
  zapato: ['shoe', 'heels', 'sneaker'],
  lentes: ['glasses', 'sunglasses', 'goggles'],
  gafas: ['sunglasses', 'glasses'],
  mascara: ['masquerade', 'mask'],
  antifaz: ['masquerade', 'mask'],
  perfume: ['perfume'],
  beso: ['kiss', 'lips', 'love bang'],
  labios: ['lips', 'kiss'],
  abrazo: ['hug'],
  mano: ['hand', 'hand hearts', 'wave', 'clap', 'thumbs up'],
  pesa: ['dumbbell', 'weight', 'gym'],
  mancuerna: ['dumbbell'],
  guante: ['boxing', 'gloves', 'glove'],
  boxeo: ['boxing', 'gloves'],
  futbol: ['soccer', 'football', 'ball', 'goal'],
  balon: ['ball', 'football', 'basketball', 'soccer'],
  trofeo: ['trophy', 'cup', 'champion'],
  copa: ['trophy', 'cup', 'wine'],
  medalla: ['medal'],
  mando: ['game controller', 'controller', 'gamepad', 'gaming'],
  control: ['game controller', 'controller', 'gamepad'],
  consola: ['game controller', 'console', 'gaming'],
  microfono: ['mic', 'microphone'],
  guitarra: ['guitar'],
  musica: ['music', 'note', 'dj', 'piano', 'guitar', 'drum'],
  camara: ['camera'],
  regalo: ['gift', 'gift box', 'mystery box'],
  caja: ['box', 'gift box', 'treasure chest'],
  globo: ['balloon', 'balloon crown'],
  fiesta: ['party', 'confetti', 'celebration'],
  fantasma: ['ghost', 'boo'],
  calavera: ['skull', 'skeleton'],
  zombie: ['zombie', 'thunder hammer'],
  creeper: ['creeper'],
  bruja: ['witch'],
  calabaza: ['pumpkin', 'halloween'],
  angel: ['angel', 'angel road', 'wings', 'feather'],
  alas: ['wings', 'fairy wings', 'angel'],
  hada: ['fairy', 'fairy wings'],
  espada: ['sword', 'blade'],
  martillo: ['hammer', 'thunder hammer', 'thor'],
  bomba: ['bomb', 'fireball', 'tnt'],
  robot: ['robot', 'mecha'],
  alien: ['alien', 'ufo'],
  rey: ['king', 'crown', 'throne'],
  reina: ['queen', 'crown'],
  pirata: ['pirate'],
  vaquero: ['cowboy']
};

const POPULAR_GIFT_PRIORITY = new Map([
  ['rose', 100],
  ['gg', 99],
  ['heart me', 98],
  ['rosa', 97],
  ['finger heart', 96],
  ['ice cream cone', 95],
  ["you're awesome", 94],
  ['love you so much', 93],
  ['doughnut', 92],
  ['capybara', 91],
  ['paper crane', 90],
  ['little crown', 89],
  ['cap', 88],
  ['hat and mustache', 87],
  ['game controller', 86],
  ['hand hearts', 85],
  ['cruiser', 84],
  ['cat', 83],
  ['bear with rose', 82],
  ['coral', 81],
  ['money gun', 80],
  ['galaxy', 79],
  ['fireworks', 78],
  ['treasure chest', 77],
  ['whale diving', 76],
  ['sunset speedway', 75],
  ['falcon', 74],
  ['lion', 73],
  ['tiktok universe', 72]
]);

const KNOWN_GIFT_IDS_BY_NAME = new Map();
for (const grp of GIFT_CANONICAL_GROUPS) {
  for (const nm of grp.names) {
    KNOWN_GIFT_IDS_BY_NAME.set(normalizarTextoGift(nm), grp.tiktokGiftIds[0]);
  }
}

for (const item of CATALOGO_GIFTS) {
  if (item && item.archivo) {
    item.archivo = limpiarArchivoGift(item.archivo);
  }
  if (item && !item.id) {
    const knownId = KNOWN_GIFT_IDS_BY_NAME.get(normalizarTextoGift(item.nombre));
    if (knownId) item.id = knownId;
  }
}

export { CATALOGO_GIFTS };

export function tiktokGiftIdDeNombre(nombre, fallbackId = 5655) {
  const norm = normalizarTextoGift(nombre);
  if (!norm) return fallbackId;
  for (const grp of GIFT_CANONICAL_GROUPS) {
    if (grp.names.some(n => normalizarTextoGift(n) === norm)) {
      return grp.tiktokGiftIds[0];
    }
  }
  const hit = CATALOGO_GIFTS.find(g => normalizarTextoGift(g.nombre) === norm);
  if (hit && hit.id) return Number(hit.id);
  return fallbackId;
}

export function encontrarGrupoCanonicoGift(nameOrId, giftId = null) {
  const numId = Number(giftId || nameOrId);
  if (Number.isFinite(numId) && numId > 0) {
    const byId = GIFT_CANONICAL_GROUPS.find(g => g.tiktokGiftIds.includes(numId));
    if (byId) return byId;
  }
  const norm = normalizarTextoGift(nameOrId);
  if (!norm) return null;
  return GIFT_CANONICAL_GROUPS.find(g =>
    g.names.some(alias => {
      const a = normalizarTextoGift(alias);
      return a === norm || (norm.length >= 2 && a.length >= 2 && (norm === a || norm.split(/[^a-z0-9]+/).includes(a)));
    })
  ) || null;
}

export function giftsEquivalentes(targetName, incomingName, incomingId = null, targetId = null) {
  const numTargetId = Number(targetId);
  const numIncomingId = Number(incomingId);
  if (Number.isFinite(numTargetId) && numTargetId > 0 && Number.isFinite(numIncomingId) && numIncomingId > 0) {
    if (numTargetId === numIncomingId) return true;
    const grpA = encontrarGrupoCanonicoGift('', numTargetId);
    const grpB = encontrarGrupoCanonicoGift('', numIncomingId);
    if (grpA && grpB && grpA.key === grpB.key) return true;
  }

  const tNorm = normalizarTextoGift(targetName);
  const iNorm = normalizarTextoGift(incomingName);

  if (tNorm && iNorm) {
    if (tNorm === iNorm) return true;
    if (tNorm.length >= 3 && iNorm.length >= 3 && (tNorm.includes(iNorm) || iNorm.includes(tNorm))) {
      return true;
    }
  }

  const targetGroup = encontrarGrupoCanonicoGift(targetName, targetId);
  const incomingGroup = encontrarGrupoCanonicoGift(incomingName, incomingId);
  if (targetGroup && incomingGroup && targetGroup.key === incomingGroup.key) {
    return true;
  }

  if (tNorm && SPANISH_SEARCH_MAP[tNorm] && iNorm) {
    if (SPANISH_SEARCH_MAP[tNorm].some(en => normalizarTextoGift(en) === iNorm)) {
      return true;
    }
  }
  if (iNorm && SPANISH_SEARCH_MAP[iNorm] && tNorm) {
    if (SPANISH_SEARCH_MAP[iNorm].some(en => normalizarTextoGift(en) === tNorm)) {
      return true;
    }
  }

  return false;
}

export const PAISES = Object.freeze([
  { id: 'todos', etiqueta: 'Todos los países 🌍' },
  { id: 'PE', etiqueta: 'Perú 🇵🇪' },
  { id: 'MX', etiqueta: 'México 🇲🇽' },
  { id: 'ES', etiqueta: 'España 🇪🇸' },
  { id: 'AR', etiqueta: 'Argentina 🇦🇷' },
  { id: 'CO', etiqueta: 'Colombia 🇨🇴' },
  { id: 'CL', etiqueta: 'Chile 🇨🇱' },
  { id: 'EC', etiqueta: 'Ecuador 🇪🇨' },
  { id: 'BO', etiqueta: 'Bolivia 🇧🇴' },
  { id: 'PY', etiqueta: 'Paraguay 🇵🇾' },
  { id: 'UY', etiqueta: 'Uruguay 🇺🇾' },
  { id: 'GT', etiqueta: 'Guatemala 🇬🇹' },
  { id: 'CR', etiqueta: 'Costa Rica 🇨🇷' },
  { id: 'DO', etiqueta: 'Rep. Dominicana 🇩🇴' },
  { id: 'PA', etiqueta: 'Panamá 🇵🇦' },
  { id: 'US', etiqueta: 'Estados Unidos 🇺🇸' },
  { id: 'BR', etiqueta: 'Brasil 🇧🇷' },
  { id: 'GB', etiqueta: 'Reino Unido 🇬🇧' },
  { id: 'FR', etiqueta: 'Francia 🇫🇷' },
  { id: 'DE', etiqueta: 'Alemania 🇩🇪' },
  { id: 'IT', etiqueta: 'Italia 🇮🇹' },
  { id: 'JP', etiqueta: 'Japón 🇯🇵' },
  { id: 'PH', etiqueta: 'Filipinas 🇵🇭' },
  { id: 'ID', etiqueta: 'Indonesia 🇮🇩' },
  { id: 'IN', etiqueta: 'India 🇮🇳' },
]);

export const FILTROS_COINS = Object.freeze([
  { id: 'todos', etiqueta: 'Todos', min: 0, max: 999999 },
  { id: '1-10', etiqueta: '1–10 🪙', min: 1, max: 10 },
  { id: '11-99', etiqueta: '11–99 🪙', min: 11, max: 99 },
  { id: '100-499', etiqueta: '100–499 🪙', min: 100, max: 499 },
  { id: '500-999', etiqueta: '500–999 🪙', min: 500, max: 999 },
  { id: '1000+', etiqueta: '1000+ 🪙', min: 1000, max: 999999 },
]);

export function buscarGifts({ q = '', filtro = 'todos', pais = 'todos' } = {}) {
  const texto = normalizarTextoGift(q);
  const f = FILTROS_COINS.find(x => x.id === filtro) || FILTROS_COINS[0];
  const codigo = String(pais || 'todos');

  const expandedTerms = new Set();
  if (texto) {
    expandedTerms.add(texto);
    if (SPANISH_SEARCH_MAP[texto]) {
      for (const term of SPANISH_SEARCH_MAP[texto]) {
        expandedTerms.add(normalizarTextoGift(term));
      }
    }
    const words = texto.split(/\s+/).filter(Boolean);
    for (const w of words) {
      if (SPANISH_SEARCH_MAP[w]) {
        for (const term of SPANISH_SEARCH_MAP[w]) {
          expandedTerms.add(normalizarTextoGift(term));
        }
      }
    }
    for (const [esKey, enList] of Object.entries(SPANISH_SEARCH_MAP)) {
      if (texto.length >= 3 && esKey.startsWith(texto)) {
        for (const term of enList) {
          expandedTerms.add(normalizarTextoGift(term));
        }
      }
    }
    const grp = encontrarGrupoCanonicoGift(texto);
    if (grp) {
      for (const nm of grp.names) {
        expandedTerms.add(normalizarTextoGift(nm));
      }
    }
  }

  const termsArr = Array.from(expandedTerms);

  const filtered = CATALOGO_GIFTS.filter(g => {
    if (g.coins < f.min || g.coins > f.max) return false;
    if (codigo !== 'todos') {
      const regs = Array.isArray(g.regiones) ? g.regiones : [];
      const gNormName = normalizarTextoGift(g.nombre);
      const isCanonicalOrPopular = POPULAR_GIFT_PRIORITY.has(gNormName) || GIFT_CANONICAL_GROUPS.some(grp => grp.names.includes(gNormName));
      const latamCodes = ['PE', 'MX', 'AR', 'CO', 'CL', 'EC', 'BO', 'PY', 'UY', 'GT', 'CR', 'DO', 'PA', 'US', 'ES', 'GLOBAL', 'ALL'];
      const matchesRegion = regs.length === 0 || regs.includes(codigo) || isCanonicalOrPopular || (latamCodes.includes(codigo) && (regs.some(r => latamCodes.includes(String(r).toUpperCase())) || regs.length >= 5));
      if (!matchesRegion) return false;
    }
    if (!texto) return true;

    const gNorm = normalizarTextoGift(g.nombre);
    const gFileNorm = normalizarTextoGift(g.archivo || '');
    const gCoinsStr = String(g.coins);
    const gIdStr = g.id ? String(g.id) : '';

    if (gCoinsStr === texto || (gIdStr && gIdStr === texto)) return true;

    for (const term of termsArr) {
      if (gNorm.includes(term) || gFileNorm.includes(term)) return true;
    }
    return false;
  });

  return filtered.sort((a, b) => {
    const aNorm = normalizarTextoGift(a.nombre);
    const bNorm = normalizarTextoGift(b.nombre);

    if (texto) {
      const aExact = aNorm === texto || termsArr.includes(aNorm) ? 1 : 0;
      const bExact = bNorm === texto || termsArr.includes(bNorm) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;

      const aStarts = termsArr.some(t => aNorm.startsWith(t)) ? 1 : 0;
      const bStarts = termsArr.some(t => bNorm.startsWith(t)) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
    }

    const aPop = POPULAR_GIFT_PRIORITY.get(aNorm) || 0;
    const bPop = POPULAR_GIFT_PRIORITY.get(bNorm) || 0;
    if (aPop !== bPop) return bPop - aPop;

    if (a.coins !== b.coins) return a.coins - b.coins;
    return aNorm.localeCompare(bNorm);
  });
}

export function coinsDeGift(nombre) {
  const n = normalizarTextoGift(nombre);
  if (!n) return 1;
  const grp = encontrarGrupoCanonicoGift(n);
  const hit = CATALOGO_GIFTS.find(g => normalizarTextoGift(g.nombre) === n);
  if (hit) return hit.coins;
  if (grp) return grp.defaultCoins;
  if (SPANISH_SEARCH_MAP[n]) {
    for (const en of SPANISH_SEARCH_MAP[n]) {
      const enHit = CATALOGO_GIFTS.find(g => normalizarTextoGift(g.nombre) === normalizarTextoGift(en));
      if (enHit) return enHit.coins;
    }
  }
  return 1;
}

const ALIAS_ICONOS = {
  'rosa': 'rose-1-coins.webp',
  'rose': 'rose-1-coins.webp',
  'rosa oscura': 'rose-1-coins.webp',
  'rosa de luz': 'white-rose-1-coins.webp',
  'gg': 'gg-1-coins.webp',
  'gg bendición': 'gg-2025-1-coins.webp',
  'gg bendicion': 'gg-2025-1-coins.webp',
  'heart me': 'heart-me-1-coins.webp',
  'me gusta': 'heart-me-1-coins.webp',
  'corazon': 'heart-me-1-coins.webp',
  'corazón': 'heart-me-1-coins.webp',
  'dona': 'doughnut-30-coins.webp',
  'doughnut': 'doughnut-30-coins.webp',
  'helado': 'ice-cream-cone-1-coins.webp',
  'capibara': 'capybara-30-coins.webp',
  'capybara': 'capybara-30-coins.webp',
  'galaxia': 'galaxy-1000-coins.webp',
  'galaxy': 'galaxy-1000-coins.webp',
  'leon': 'lion-29999-coins.webp',
  'león': 'lion-29999-coins.webp',
  'lion': 'lion-29999-coins.webp',
  'ballena': 'whale-diving-2150-coins.webp',
  'haikai lluvia': 'umbrella-1-coins.webp',
  'haikai sagrado': 'rainbow-1-coins.webp',
  'carrusel infierno': 'carousel-1999-coins.webp',
  'carrusel tótems': 'carousel-1999-coins.webp',
  'carrusel totems': 'carousel-1999-coins.webp',
  'dragón invocación': 'rising-dragon-999-coins.webp',
  'dragon invocacion': 'rising-dragon-999-coins.webp',
  'fénix renaciente': 'phoenix-25999-coins.webp',
  'fenix renaciente': 'phoenix-25999-coins.webp',
  'la parka (instakill)': 'firelight-beast-4000-coins.webp',
  'la parka': 'firelight-beast-4000-coins.webp',
  'arcángel serafín': 'angel-road-6999-coins.webp',
  'arcangel serafin': 'angel-road-6999-coins.webp',
  'sol cruel (mega)': 'sun-crown-199-coins.webp',
  'sol cruel': 'sun-crown-199-coins.webp',
  'deidad solar (mega)': 'suncatcher-800-coins.webp',
  'deidad solar': 'suncatcher-800-coins.webp',
  'zombie': 'thunder-hammer-1-coins.webp',
  'creeper': 'creeper-1-coins.webp',
  'diamantes de ayuda': 'power-of-diamond-1-coins.webp',
  'lluvia tnt': 'fireball-5-coins.webp',
  'warden destructor': 'firelight-beast-4000-coins.webp',
  'kit dios celestial': 'fairy-wings-1000-coins.webp'
};

export function archivoDeGift(nombre, coins) {
  const rawLower = String(nombre ?? '').trim().toLowerCase();
  const norm = normalizarTextoGift(nombre);
  if (!norm) return 'rose-1-coins.webp';
  if (ALIAS_ICONOS[rawLower]) return ALIAS_ICONOS[rawLower];
  if (ALIAS_ICONOS[norm]) return ALIAS_ICONOS[norm];

  const grp = encontrarGrupoCanonicoGift(norm);
  if (grp && (!coins || Number(coins) === grp.defaultCoins)) {
    return grp.defaultFile;
  }

  const mismos = CATALOGO_GIFTS.filter(g => normalizarTextoGift(g.nombre) === norm);
  if (!mismos.length) {
    if (SPANISH_SEARCH_MAP[norm]) {
      for (const en of SPANISH_SEARCH_MAP[norm]) {
        const hitEn = CATALOGO_GIFTS.find(g => normalizarTextoGift(g.nombre) === normalizarTextoGift(en));
        if (hitEn) return limpiarArchivoGift(hitEn.archivo);
      }
    }
    const partial = CATALOGO_GIFTS.find(g => normalizarTextoGift(g.nombre).includes(norm))?.archivo;
    return partial ? limpiarArchivoGift(partial) : (grp ? grp.defaultFile : 'rose-1-coins.webp');
  }
  if (coins != null && Number.isFinite(Number(coins))) {
    const exacto = mismos.find(g => g.coins === Number(coins));
    if (exacto) return limpiarArchivoGift(exacto.archivo);
  }
  return limpiarArchivoGift(mismos[0].archivo);
}

export const PRESETS = {
  minecraft_bm: {
    id: 'minecraft_bm',
    nombre: 'Minecraft: Buenos vs Malos (Tótems)',
    juego: 'minecraft',
    descripcion: 'Guerra de donaciones con Tótems, ángeles, La Parka y animaciones en Paper 1.20.1',
    reglas: [
      { id: 'rosa_oscura', name: 'Rosa', icon_file: 'rose-1-coins.webp', tiktokGiftId: 5655, coins: 1, faction: 'MALOS', command: '/bm gift rosa_oscura {donador}', totemDelta: 0 },
      { id: 'gg_maldicion', name: 'GG', icon_file: 'gg-1-coins.webp', tiktokGiftId: 6064, coins: 1, faction: 'MALOS', command: '/bm gift gg_maldicion {donador}', totemDelta: -1 },
      { id: 'hackai_lluvia', name: 'Haikai Lluvia', icon_file: 'umbrella-1-coins.webp', tiktokGiftId: 5034, coins: 15, faction: 'MALOS', command: '/bm gift hackai_lluvia {donador}', totemDelta: -3 },
      { id: 'carrusel_inf', name: 'Carrusel Infierno', icon_file: 'carousel-1999-coins.webp', tiktokGiftId: 8913, coins: 20, faction: 'MALOS', command: '/bm gift carrusel_infierno {donador}', totemDelta: -2 },
      { id: 'dragon_inv', name: 'Dragón Invocación', icon_file: 'rising-dragon-999-coins.webp', tiktokGiftId: 7521, coins: 50, faction: 'MALOS', command: '/bm gift dragon_invocacion {donador}', totemDelta: -5 },
      { id: 'la_parka', name: 'La Parka (Instakill)', icon_file: 'firelight-beast-4000-coins.webp', tiktokGiftId: 6748, coins: 99, faction: 'MALOS', command: '/bm gift la_parka {donador}', totemDelta: -20 },
      { id: 'sol_cruel', name: 'Sol Cruel (Mega)', icon_file: 'sun-crown-199-coins.webp', tiktokGiftId: 9234, coins: 199, faction: 'MALOS', command: '/bm gift sol_cruel {donador}', totemDelta: -20 },

      { id: 'rosa_luz', name: 'Rosa de Luz', icon_file: 'white-rose-1-coins.webp', tiktokGiftId: 5655, coins: 1, faction: 'BUENOS', command: '/bm gift rosa_luz {donador}', totemDelta: 0 },
      { id: 'gg_bendicion', name: 'GG Bendición', icon_file: 'gg-2025-1-coins.webp', tiktokGiftId: 6064, coins: 1, faction: 'BUENOS', command: '/bm gift gg_bendicion {donador}', totemDelta: 1 },
      { id: 'hackai_sag', name: 'Haikai Sagrado', icon_file: 'rainbow-1-coins.webp', tiktokGiftId: 5034, coins: 15, faction: 'BUENOS', command: '/bm gift hackai_sagrado {donador}', totemDelta: 3 },
      { id: 'carrusel_tot', name: 'Carrusel Tótems', icon_file: 'carousel-1999-coins.webp', tiktokGiftId: 8913, coins: 20, faction: 'BUENOS', command: '/bm gift carrusel_totems {donador}', totemDelta: 5 },
      { id: 'fenix', name: 'Fénix Renaciente', icon_file: 'phoenix-25999-coins.webp', tiktokGiftId: 7521, coins: 50, faction: 'BUENOS', command: '/bm gift fenix_renaciente {donador}', totemDelta: 8 },
      { id: 'arcangel', name: 'Arcángel Serafín', icon_file: 'angel-road-6999-coins.webp', tiktokGiftId: 6748, coins: 99, faction: 'BUENOS', command: '/bm gift arcangel_serafin {donador}', totemDelta: 20 },
      { id: 'deidad_solar', name: 'Deidad Solar (Mega)', icon_file: 'suncatcher-800-coins.webp', tiktokGiftId: 9234, coins: 199, faction: 'BUENOS', command: '/bm gift deidad_solar {donador}', totemDelta: 20 }
    ]
  },

  roblox_duelo: {
    id: 'roblox_duelo',
    nombre: 'Roblox: Duelo Bicicleta Royale (Gift vs Gift)',
    juego: 'roblox',
    descripcion: 'Duelo por equipos en Roblox/OBS: Rosa empuja a la Izquierda, GG empuja a la Derecha',
    reglas: [
      { id: 'team_rojo_rosa', name: '🌹 Empuje Rojo (Rosa)', icon_file: 'rose-1-coins.webp', tiktokGiftId: 5655, coins: 1, faction: 'MALOS', side: 'LEFT', power: 5, command: 'ROBLOX_EVENT:PUSH_LEFT:5', totemDelta: -1 },
      { id: 'team_azul_gg', name: '🎮 Empuje Azul (GG)', icon_file: 'gg-1-coins.webp', tiktokGiftId: 6064, coins: 1, faction: 'BUENOS', side: 'RIGHT', power: 15, command: 'ROBLOX_EVENT:PUSH_RIGHT:15', totemDelta: 1 },
      { id: 'team_rojo_carrusel', name: '🎠 Turbo Rojo (Carrusel)', icon_file: 'carousel-1999-coins.webp', tiktokGiftId: 8913, coins: 20, faction: 'MALOS', side: 'LEFT', power: 50, command: 'ROBLOX_EVENT:PUSH_LEFT:50', totemDelta: -5 },
      { id: 'team_azul_carrusel', name: '🏆 Turbo Azul (Carrusel)', icon_file: 'carousel-1999-coins.webp', tiktokGiftId: 8913, coins: 20, faction: 'BUENOS', side: 'RIGHT', power: 50, command: 'ROBLOX_EVENT:PUSH_RIGHT:50', totemDelta: 5 },
      { id: 'team_rojo_nuke', name: '💀 Nuke Rojo (Parka)', icon_file: 'firelight-beast-4000-coins.webp', tiktokGiftId: 6748, coins: 99, faction: 'MALOS', side: 'LEFT', power: 200, command: 'ROBLOX_EVENT:PUSH_LEFT:200', totemDelta: -20 },
      { id: 'team_azul_nuke', name: '👼 Guardián Azul (Arcángel)', icon_file: 'angel-road-6999-coins.webp', tiktokGiftId: 6748, coins: 99, faction: 'BUENOS', side: 'RIGHT', power: 200, command: 'ROBLOX_EVENT:PUSH_RIGHT:200', totemDelta: 20 }
    ]
  },

  minecraft_chaos: {
    id: 'minecraft_chaos',
    nombre: 'Minecraft: Caos Clásico (Spawns Directos)',
    juego: 'minecraft',
    descripcion: 'Likes spawnean Zombies, Rosas Creepers y Regalos grandes TNT o Wardens',
    reglas: [
      { id: 'spawn_zombie', name: 'Rosa', icon_file: 'rose-1-coins.webp', tiktokGiftId: 5655, coins: 1, faction: 'MALOS', command: 'execute at {donador} run summon zombie ~ ~ ~', totemDelta: -1 },
      { id: 'spawn_creeper', name: 'GG', icon_file: 'gg-1-coins.webp', tiktokGiftId: 6064, coins: 1, faction: 'MALOS', command: 'execute at {donador} run summon creeper ~ ~ ~', totemDelta: -2 },
      { id: 'give_diamond', name: 'Diamantes de Ayuda', icon_file: 'power-of-diamond-1-coins.webp', tiktokGiftId: 5034, coins: 15, faction: 'BUENOS', command: 'give {donador} diamond 5', totemDelta: 3 },
      { id: 'spawn_tnt', name: 'Lluvia TNT', icon_file: 'fireball-5-coins.webp', tiktokGiftId: 8913, coins: 20, faction: 'MALOS', command: 'execute at {donador} run summon tnt ~ ~3 ~', totemDelta: -5 },
      { id: 'spawn_warden', name: 'Warden Destructor', icon_file: 'firelight-beast-4000-coins.webp', tiktokGiftId: 6748, coins: 99, faction: 'MALOS', command: 'execute at {donador} run summon warden ~ ~ ~', totemDelta: -20 },
      { id: 'give_netherite', name: 'Kit Dios Celestial', icon_file: 'fairy-wings-1000-coins.webp', tiktokGiftId: 9234, coins: 199, faction: 'BUENOS', command: 'give {donador} netherite_chestplate', totemDelta: 20 }
    ]
  }
};

export const DEFAULT_GIFTS = PRESETS.minecraft_bm.reglas;

export class GiftRegistry {
  constructor(initialGifts = null) {
    this.currentPreset = 'minecraft_bm';
    this.gifts = initialGifts ? [...initialGifts] : [...DEFAULT_GIFTS];
  }

  loadPreset(presetId) {
    if (PRESETS[presetId]) {
      this.currentPreset = presetId;
      this.gifts = [...PRESETS[presetId].reglas];
      return PRESETS[presetId];
    }
    return null;
  }

  getAll() {
    return this.gifts;
  }

  setAll(newGifts) {
    if (Array.isArray(newGifts)) {
      this.gifts = [...newGifts];
    }
  }

  resetDefaults() {
    this.gifts = [...DEFAULT_GIFTS];
    this.currentPreset = 'minecraft_bm';
  }

  resolveGift(giftIdOrName, faction = 'BUENOS', explicitGiftName = '') {
    const incomingId = !isNaN(Number(giftIdOrName)) ? Number(giftIdOrName) : null;
    const incomingName = explicitGiftName || (incomingId === null ? String(giftIdOrName || '') : '');

    const matchWithFaction = (requireFaction) => {
      return this.gifts.find(g => {
        const factionOk = !requireFaction || g.faction === faction || g.faction === 'AMBOS';
        if (!factionOk) return false;

        if (incomingName && (normalizarTextoGift(g.id) === normalizarTextoGift(incomingName) || normalizarTextoGift(g.name) === normalizarTextoGift(incomingName))) {
          return true;
        }
        return giftsEquivalentes(g.name, incomingName, incomingId, g.tiktokGiftId);
      }) || null;
    };

    return matchWithFaction(true) || matchWithFaction(false);
  }

  applyGift(giftIdOrName, donador, activeFaction, storeState, explicitGiftName = '') {
    const gift = this.resolveGift(giftIdOrName, activeFaction, explicitGiftName);
    const fallbackName = explicitGiftName || (isNaN(Number(giftIdOrName)) ? String(giftIdOrName || 'Regalo') : 'Regalo');

    if (!gift) {
      const grp = encontrarGrupoCanonicoGift(fallbackName, !isNaN(Number(giftIdOrName)) ? Number(giftIdOrName) : null);
      return {
        giftName: fallbackName,
        command: null,
        totemDelta: 0,
        shouldFire: false,
        coins: grp ? grp.defaultCoins : 1,
        side: grp?.key === 'rose' ? 'LEFT' : (grp?.key === 'gg' ? 'RIGHT' : (activeFaction === 'MALOS' ? 'LEFT' : 'RIGHT')),
        faction: activeFaction
      };
    }

    const cleanDonor = String(donador).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 16) || 'Donador';
    const rawCommand = gift.command || '';
    const command = rawCommand
      .replace(/{donador}/g, cleanDonor)
      .replace(/{donor}/g, cleanDonor)
      .replace(/{faccion}/g, activeFaction)
      .replace(/{delta}/g, String(gift.totemDelta));

    return {
      giftId: gift.id,
      giftName: explicitGiftName || gift.name,
      tiktokGiftId: gift.tiktokGiftId,
      coins: gift.coins || 1,
      faction: gift.faction === 'AMBOS' ? activeFaction : gift.faction,
      totemDelta: Number(gift.totemDelta) || 0,
      side: gift.side || (gift.faction === 'MALOS' ? 'LEFT' : 'RIGHT'),
      power: gift.power || gift.coins || 1,
      command,
      shouldFire: Boolean(command.trim().length > 0),
      rawGift: gift
    };
  }
}

export const giftRegistry = new GiftRegistry();

