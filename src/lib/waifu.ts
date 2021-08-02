import { CharacterStructure } from './../common/anilist.interface';
import JikanTS from "jikants";

export default class Waifu {
  public id: number;
  public name: string;
  public img: {
    anilist: string;
    others: string[];
  };

  constructor(char: CharacterStructure) {
    this.id = char.id;
    this.name = char.name.full;
    this.img = { anilist: char.image.large, others: [] };
  }

  public async getOtherImg(): Promise<void> {
    const data = await JikanTS.Character.pictures(this.id);
    const pictures = data!.pictures;
    const limit = data!.pictures.length > 4 ? 4 : data?.pictures.length;
    for (let i = 0; i < limit!; i++) {
      this.img.others.push(pictures[i].large);
    }    
  }
}
