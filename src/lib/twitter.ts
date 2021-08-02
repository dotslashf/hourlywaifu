import { Media } from './../common/anilist.interface';
import {
  TwitterMediaResponse,
  TwitterTweetResponse,
} from '../common/twitter.interface';
import Twit from 'twit';
import dotenv from 'dotenv';
import createLogger from 'logging';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

export default class Twitter {
  private readonly client: Twit;
  public readonly imgSrc: string;
  private logger: createLogger.Logger;
  private imgFullPath: string;

  constructor() {
    this.client = new Twit({
      consumer_key: process.env.TWITTER_API_KEY!,
      consumer_secret: process.env.TWITTER_API_SECRET!,
      access_token: process.env.TWITTER_API_ACCESS_TOKEN!,
      access_token_secret: process.env.TWITTER_API_ACCESS_SECRET!,
    });
    this.logger = createLogger('Twitter');
    this.imgFullPath = path.join(__dirname, '../img');
  }

  private async uploadImage(
    filePath: string,
    type: 'characters' | 'media'
  ): Promise<TwitterMediaResponse> {
    const media64 = await fs.readFile(
      `${this.imgFullPath}/${type}/${filePath}.jpg`,
      { encoding: 'base64' }
    );
    return new Promise((resolve, reject) => {
      this.client.post(
        'media/upload',
        {
          media_data: media64,
        },
        (err, data) => {
          if (err) {
            this.logger.error('uploadImage', err);
            reject(err);
          } else {
            this.logger.info(`uploadImage success ${type}/${filePath}`);
            resolve(data as TwitterMediaResponse);
          }
        }
      );
    });
  }

  public async tweetImgFromMal(
    tweetIdStr: string,
    media: string[],
    name: string
  ): Promise<TwitterTweetResponse> {
    const mediaIds: string[] = [];
    for (let i = 0; i < media.length; i++) {
      const media = await this.uploadImage(`${i}`, 'characters');
      mediaIds.push(media.media_id_string);
    }

    return new Promise((resolve, reject) => {
      this.client.post(
        'statuses/update',
        {
          status: `More images of ${name}`,
          in_reply_to_status_id: tweetIdStr,
          auto_populate_reply_metadata: true,
          media_ids: mediaIds,
        },
        (err, data) => {
          if (err) {
            this.logger.error('tweetImgFromMal', err);
            reject(err);
          } else {
            resolve(data as TwitterTweetResponse);
          }
        }
      );
    });
  }

  public async tweetWaifu(status: string): Promise<TwitterTweetResponse> {
    const mediaAnilist = await this.uploadImage('anilist', 'characters');

    return new Promise((resolve, reject) => {
      this.client.post(
        'statuses/update',
        {
          status,
          media_ids: [mediaAnilist.media_id_string],
        },
        (err, data) => {
          if (err) {
            this.logger.error('tweetWaifu', err);
            reject(err);
          } else {
            this.logger.info('tweetWaifu', status);
            resolve(data as TwitterTweetResponse);
          }
        }
      );
    });
  }

  public async tweetTopMedia(
    status: string,
    tweetIdStr: string,
    media: Media[]
  ) {
    const mediaIds: string[] = [];
    for (let i = 0; i < media.length; i++) {
      const media = await this.uploadImage(`cover_${i}`, 'media');
      mediaIds.push(media.media_id_string);
    }

    await this.client.post('statuses/update', {
      status,
      in_reply_to_status_id: tweetIdStr,
      media_ids: mediaIds,
      auto_populate_reply_metadata: true,
    });
  }
}
