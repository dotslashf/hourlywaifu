import Waifu from './waifu';

export default class Formatter {
  private waifu: Waifu;
  public topMedia: string;

  constructor(waifu: Waifu) {
    this.waifu = waifu;
    this.topMedia = this.flattenMedia();
  }

  private flattenMedia() {
    const topMedia = this.waifu.media.reduce((acc, media, index) => {
      return `${acc}${index + 1}. ${
        media.type === 'ANIME' ? '[Anime]' : '[Manga]'
      } ${media.title.userPreferred}\nTotal Favourites: ${
        media.favourites
      }\n\n`;
    }, '');

    return `Top Media:\n${topMedia}`;
  }
}
