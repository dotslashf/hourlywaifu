import Waifu from './waifu';

export default class Formatter {
  private waifu: Waifu;
  public topMedia: {
    listTopmedia: string[];
    topMediaLength: number;
  };
  public waifuSource: string;

  constructor(waifu: Waifu) {
    this.waifu = waifu;
    this.topMedia = this.flattenMedia();
    this.waifuSource = this.waifuFrom();
  }

  private flattenMedia() {
    const topMedia = this.waifu.media.reduce((acc, media, index) => {
      const fav =
        media.favourites > 10
          ? `Total Favourites: ${media.favourites}\n\n`
          : null;

      return `${acc}${index + 1}. [${media.type}] ${
        media.title.userPreferred
      }\n${fav}`;
    }, '');

    return {
      listTopmedia: topMedia.split(/\n\n/g),
      topMediaLength: topMedia.length,
    };
  }

  private waifuFrom() {
    return `${this.waifu.name} from ${this.waifu.media[0].title.userPreferred}`;
  }
}
