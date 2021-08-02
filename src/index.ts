import CharacterFinder from './lib/anilist';
import Formatter from './lib/formatter';
import Waifu from './lib/waifu';

(async () => {
  const cf = new CharacterFinder();
  const char = await cf.getRandomCharacter();
  const topMedia = await cf.getCharacterMedia(char.id);

  const waifu = new Waifu(char, topMedia);
  const idMal = await waifu.getIdMal();
  await waifu.getImgFromMal(idMal);
  await waifu.downloadCharImg();
  await waifu.downloadCharMedia();

  const f = new Formatter(waifu);
  console.log(f.topMedia);
})();
