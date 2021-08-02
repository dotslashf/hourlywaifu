import {
  Media,
  AnimeInterface,
  CharactersInterface,
  CharacterStructure,
} from './../common/anilist.interface';
import { GET_CHARACTER_ANIME, GET_RANDOM_CHARACTER } from '../graphql/query';
import request from 'node-superfetch';
import dotenv from 'dotenv';
import createLogger from 'logging';

dotenv.config();

export default class CharacterFinder {
  private anilistEndpoint: string;
  private logger: createLogger.Logger;

  public constructor() {
    this.anilistEndpoint = process.env.ANILIST_GRAPHQL_ENDPOINT!;
    this.logger = createLogger('Anilist');
  }

  public getRandomCharacter(): Promise<CharacterStructure> {
    const nPage = Math.floor(Math.random() * 30 + 1);
    const index = Math.floor(Math.random() * 200);

    return new Promise((resolve, reject) => {
      request
        .post(this.anilistEndpoint)
        .send(
          Object.assign({
            variables: {
              page: nPage,
            },
            query: GET_RANDOM_CHARACTER,
          })
        )
        .then(async data => {
          const chars = data.body as CharactersInterface;
          let char = chars.data.Page.characters[index];

          if (char.gender === 'Female') {
            this.logger.info(`${char.name.userPreferred} selected as waifu`);
            resolve(char);
          } else {
            this.logger.info(`${char.name.userPreferred} is not a waifu`);
            char = await this.getRandomCharacter();
            resolve(char);
          }
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  }

  public getCharacterMedia(characterId: number): Promise<Media[]> {
    return new Promise((resolve, reject) => {
      request
        .post(this.anilistEndpoint)
        .send(
          Object.assign({
            variables: { id: characterId },
            query: GET_CHARACTER_ANIME,
          })
        )
        .then(data => {
          const _data = data.body as AnimeInterface;
          const animes = _data.data.Character.media.nodes;
          animes.sort((a, b) => {
            return b.favourites - a.favourites;
          });

          const topAnime =
            animes.length > 4
              ? animes.slice(0, 4)
              : animes.slice(0, animes.length);

          resolve(topAnime);
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  }
}
