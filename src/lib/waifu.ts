import { MalCharacter } from './../common/waifu.interface';
import { CharacterStructure, Media } from './../common/anilist.interface';
import JikanTS from 'jikants';
import downloadImage from '../utils/downloadImage';
import createLogger from 'logging';
import request from 'node-superfetch';

export default class Waifu {
  public id: number;
  public name: string;
  public img: {
    anilist: string;
    others: string[];
  };
  public media: Media[];
  private _logger: createLogger.Logger;

  constructor(char: CharacterStructure, topMedia: Media[]) {
    this.id = char.id;
    this.name = char.name.full;
    this.img = { anilist: char.image.large, others: [] };
    this.media = topMedia;
    this._logger = createLogger('Waifu');
  }

  public async getIdMal() {
    const topMedia = this.media[0];
    const res = await request.get(
      `https://api.jikan.moe/v3/anime/${topMedia.idMal}/characters_staff`
    );
    const data = res.body as MalCharacter;
    const exact = data.characters.filter(char => {
      const name = char.name
        .split(', ')
        .reverse()
        .join(' ');

      return name === this.name;
    });
    return exact[0].mal_id;
  }

  public async getImgFromMal(idMal: number): Promise<void> {
    try {
      const data = await JikanTS.Character.pictures(idMal);
      if (data?.pictures !== undefined) {
        const pictures = data.pictures;
        const limit = data.pictures.length > 4 ? 4 : data?.pictures.length;
        for (let i = 0; i < limit; i++) {
          this.img.others.push(pictures[i].large);
        }
      }
    } catch (e) {
      this._logger.error('getImgFromMal', e);
    }
  }

  public async downloadCharImg() {
    await downloadImage(this.img.anilist, this.name, 'characters', 'anilist');
    for (let i = 0; i < this.img.others.length; i++) {
      const img = this.img.others[i];
      await downloadImage(img, this.name, 'characters', `${i}`);
    }
  }

  public async downloadCharMedia() {
    return Promise.all(
      this.media.map(async (media, i) => {
        await downloadImage(
          media.coverImage.extraLarge,
          media.title.userPreferred,
          'media',
          `cover_${i}`
        );
      })
    );
  }
}
