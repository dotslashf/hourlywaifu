import CharacterFinder from './lib/anilist';
import Formatter from './lib/formatter';
import Twitter from './lib/twitter';
import Waifu from './lib/waifu';
import sleep from './utils/sleep';

(async () => {
  const tw = new Twitter();

  while (true) {
    const cf = new CharacterFinder();
    const char = await cf.getRandomCharacter();
    const topMedia = await cf.getCharacterMedia(char.id);

    const waifu = new Waifu(char, topMedia);
    const idMal = await waifu.getIdMal();
    idMal !== undefined ? await waifu.getImgFromMal(idMal) : null;
    await waifu.downloadAllImage();

    const f = new Formatter(waifu);
    const waifuSource = f.waifuSource;
    const waifuTopMedia = f.topMedia;

    const waifuTweet = await tw.tweetWaifu(waifuSource);
    const moreWaifuTweet =
      idMal === undefined
        ? waifuTweet
        : await tw.tweetImgFromMal(
            waifuTweet.id_str,
            waifu.img.others,
            waifu.name
          );

    if (waifuTopMedia.topMediaLength > 270) {
      const firstTweet = waifuTopMedia.listTopmedia.slice(0, 2);
      const secondTweet = waifuTopMedia.listTopmedia.slice(
        2,
        waifuTopMedia.listTopmedia.length
      );

      const firstMediaTweet = await tw.tweetTopMedia(
        firstTweet.join('\n'),
        moreWaifuTweet.id_str,
        waifu.media
      );

      await tw.tweetThread(secondTweet.join('\n'), {
        tweetIdStr: firstMediaTweet.id_str,
      });
    } else {
      await tw.tweetTopMedia(
        waifuTopMedia.listTopmedia.join('\n'),
        moreWaifuTweet.id_str,
        waifu.media
      );
    }

    await sleep(60);
  }
})();
