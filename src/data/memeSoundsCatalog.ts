export interface MemeSound {
  id: string;
  name: string;
  filename: string;
  category: 'viral' | 'gaming' | 'reactions' | 'epic';
  durationTag: string;
  emoji: string;
}

export const getMemeSoundUrl = (filename: string): string =>
  `http://127.0.0.1:4000/s2e_media/audio/public/${filename}`;

export const MEME_SOUNDS_CATALOG: MemeSound[] = [
  { id: 'the-boys', name: 'The Boys (Homelander)', filename: '1701805304266_the-boys.mp3', category: 'viral', durationTag: '12s', emoji: '🕶️' },
  { id: 'drip-goku', name: 'Drip Goku (Clash of Gods)', filename: '1702224976485_drip-goku-meme-song-original-dragon-ball-super-music-clash-of-gods.mp3', category: 'viral', durationTag: '5s', emoji: '🔥' },
  { id: 'prowler', name: 'Prowler Sound Effect', filename: '1701804736796_prowler-sound-effect.mp3', category: 'epic', durationTag: '4s', emoji: '🕷️' },
  { id: 'spiderman-2099', name: 'Spider-Man 2099 Theme', filename: '1789983882687_spiderman-2099-theme-sound-effect.mp3', category: 'epic', durationTag: '6s', emoji: '🚨' },
  { id: 'vine-boom', name: 'Vine Boom', filename: '1708877312612_vine-boom.mp3', category: 'reactions', durationTag: '2s', emoji: '💥' },
  { id: 'taco-bell', name: 'Taco Bell Bong', filename: '1708877384604_taco-bell-bong-sfx.mp3', category: 'reactions', durationTag: '2s', emoji: '🔔' },
  { id: 'chipi-chipi', name: 'Chipi Chipi Chapa Chapa', filename: '1708877415194_chipi-chipi-chapa-chapa.mp3', category: 'viral', durationTag: '8s', emoji: '🐱' },
  { id: 'gigachad', name: 'Gigachad Theme', filename: '1789983835573_gigachad-theme-music-sound-effect.mp3', category: 'viral', durationTag: '8s', emoji: '🗿' },
  { id: 'run', name: 'AWOLNATION - Run', filename: '1699559815847_run.mp3', category: 'viral', durationTag: '6s', emoji: '🏃' },
  { id: 'batman', name: 'Batman (Something in the Way)', filename: '1701803076040_batman.mp3', category: 'epic', durationTag: '5s', emoji: '🦇' },
  { id: 'epic-sax', name: 'Epic Sax Guy (15s)', filename: '1699892196736_epic-sax-15s.mp3', category: 'viral', durationTag: '15s', emoji: '🎷' },
  { id: 'wow-anime', name: 'Anime Wow', filename: '1699892960228_wow-anime.mp3', category: 'reactions', durationTag: '2s', emoji: '✨' },
  { id: 'roblox-oof', name: 'Roblox Oof Death', filename: '1708877497810_roblox-death-sound_1.mp3', category: 'gaming', durationTag: '1s', emoji: '💀' },
  { id: 'minecraft-zombie', name: 'Minecraft Zombie Groan', filename: '1699891800834_zombie-minecraft.mp3', category: 'gaming', durationTag: '2s', emoji: '🧟' },
  { id: 'minecraft-tnt', name: 'Minecraft TNT Fuse', filename: '1699518576778_tnt.mp3', category: 'gaming', durationTag: '3s', emoji: '🧨' },
  { id: 'gta-wasted', name: 'GTA V Wasted Sound', filename: '1715074355891_gta-v-death-sound-effect-102.mp3', category: 'gaming', durationTag: '4s', emoji: '⭐' },
  { id: 'gta-sa', name: 'GTA San Andreas Theme', filename: '1715074326895_gta-san-andreas-.mp3', category: 'gaming', durationTag: '10s', emoji: '🔫' },
  { id: 'emotional-damage', name: 'Emotional Damage!', filename: '1717178049420_emotional damage.mp3', category: 'reactions', durationTag: '3s', emoji: '💔' },
  { id: 'pedro-pedro', name: 'Pedro Pedro Pe (Racoon)', filename: '1715074454519_pedro-pedro-pe.mp3', category: 'viral', durationTag: '8s', emoji: '🦝' },
  { id: 'coffin-dance', name: 'Coffin Dance (Astronomica)', filename: '1712241505415_Coffin Dance Meme.mp3', category: 'viral', durationTag: '10s', emoji: '⚰️' },
  { id: 'clown-horn', name: 'Bocina de Payaso', filename: '1708877598165_clown-horn-sound-effect_1.mp3', category: 'reactions', durationTag: '2s', emoji: '🤡' },
  { id: 'wrong-buzzer', name: 'Wrong Buzzer (Error)', filename: '1708877687386_wrong-buzzer.mp3', category: 'reactions', durationTag: '2s', emoji: '❌' },
  { id: 'deja-vu', name: 'Deja Vu (Initial D Drift)', filename: '1702224870406_deja-vu.mp3', category: 'viral', durationTag: '7s', emoji: '🏎️' },
  { id: 'what-is-love', name: 'What is Love (Mike O\'Hearn)', filename: '1789983862528_what-is-love-mike-o-hearn-sound-effect.mp3', category: 'viral', durationTag: '8s', emoji: '💪' },
  { id: 'sad-violin', name: 'Sad Violin Solo', filename: '1789983864093_sad-violin-sound-effect.mp3', category: 'reactions', durationTag: '6s', emoji: '🎻' },
  { id: 'dorime', name: 'Dorime Ameno', filename: '1789988367379_dorime-sound-effect.mp3', category: 'epic', durationTag: '9s', emoji: '🙏' },
  { id: 'this-is-sparta', name: 'This Is Sparta!', filename: '1789988365343_this-is-sparta-sound-effect.mp3', category: 'epic', durationTag: '4s', emoji: '⚔️' },
  { id: 'mortal-kombat', name: 'Mortal Kombat - Round 1', filename: '1789988357412_mortal-kombat-round-one-sound effect.mp3', category: 'gaming', durationTag: '3s', emoji: '🐉' },
  { id: 'bombastic-side-eye', name: 'Bombastic Side Eye', filename: '1789997700993_bombastic-side-eye-sound-effect.mp3', category: 'reactions', durationTag: '3s', emoji: '👀' },
  { id: 'wiwiwi-cat', name: 'Wiwiwi Gato Llorando', filename: '1789983879125_wiwiwi-cat-meme-sound-effect.mp3', category: 'reactions', durationTag: '5s', emoji: '😿' },
  { id: 'illuminati', name: 'Illuminati X-Files Theme', filename: '1717177596767_Illuminati sound effect.mp3', category: 'epic', durationTag: '6s', emoji: '👁️' },
  { id: 'shrek-swamp', name: 'What are you doing in my swamp', filename: '1717177828167_WHAT ARE YOU DOING IN MY SWAMP.mp3', category: 'reactions', durationTag: '4s', emoji: '🧅' }
];
