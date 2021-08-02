import CharacterFinder from './lib/anilist';
import Formatter from './lib/formatter';
import Twitter from './lib/twitter';
import Waifu from './lib/waifu';

(async () => {
  const tw = new Twitter();

  const cf = new CharacterFinder();
  const char = await cf.getRandomCharacter();
  const topMedia = await cf.getCharacterMedia(char.id);

  const waifu = new Waifu(char, topMedia);
  const idMal = await waifu.getIdMal();
  await waifu.getImgFromMal(idMal);
  await waifu.downloadAllImage();

  const f = new Formatter(waifu);
  const waifuSource = f.waifuSource;
  const waifuTopMedia = f.topMedia;

  if (waifu.img.others === []) {
    tw.tweetWaifu(waifuSource).then(async tweet => {
      await tw.tweetTopMedia(waifuTopMedia, tweet.id_str, waifu.media);
    });
  } else {
    tw.tweetWaifu(waifuSource).then(async tweet => {
      await tw
        .tweetImgFromMal(tweet.id_str, waifu.img.others, waifu.name)
        .then(async secondTweet => {
          await tw.tweetTopMedia(
            waifuTopMedia,
            secondTweet.id_str,
            waifu.media
          );
        });
    });
  }
})();
