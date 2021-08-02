import CharacterFinder from './lib/anilist';
import Waifu from './lib/waifu';

(async () => {
  const cf = new CharacterFinder();
  const char = await cf.getRandomCharacter();
  const animes = await cf.getCharacterAnime(char.id);

  console.log(animes);

  const waifu = new Waifu(char);
  console.log(waifu);
})();
