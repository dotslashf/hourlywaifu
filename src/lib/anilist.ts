import {
  CharactersInterface,
  CharacterStructure,
} from './../common/anilist.interface';
import { GET_RANDOM_CHARACTER } from '../graphql/query';
import request from 'node-superfetch';
import dotenv from 'dotenv';

dotenv.config();

export default class CharacterFinder {
  private anilistEndpoint: string;

  public constructor() {
    this.anilistEndpoint = process.env.ANILIST_GRAPHQL_ENDPOINT!;
  }

  public getRandomCharacter(): Promise<CharacterStructure> {
    const nPage = Math.floor(Math.random() * 30 + 1);
    const index = Math.floor(Math.random() * 50);

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
            resolve(char);
          } else {
            console.log('not a female');

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
}
