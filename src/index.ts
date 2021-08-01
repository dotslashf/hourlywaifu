import CharacterFinder from './lib/anilist';
import Waifu from './lib/waifu';

(async () => {
  const cf = new CharacterFinder();
  const char = await cf.getRandomCharacter();

  const waifu = new Waifu(char.name.full, char.image.large);
  console.log(waifu);
})();
