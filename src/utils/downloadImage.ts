import request from 'node-superfetch';
import { promises as fs } from 'fs';
import path from 'path';
import createLogger from 'logging';

const logger = createLogger('downloadImage');

export default function downloadImage(
  url: string,
  charName: string,
  type: 'media' | 'characters',
  fileName: string
): Promise<void> {
  const imgFullPath = path.join(__dirname, '../img');

  return new Promise(async (resolve, reject) => {
    try {
      const res = await request.get(url);
      const buffer = res.raw;

      await fs.writeFile(`${imgFullPath}/${type}/${fileName}.jpg`, buffer!);
      logger.info(`success ${charName} ${fileName}`);
      resolve();
    } catch (e) {
      logger.error(`failed download ${fileName}.jpg`);
      reject(e);
    }
  });
}
