import { CharacterStructure } from './../common/anilist.interface';
export default class Waifu {
  public id: number;
  public name: string;
  public img: {
    anilist: string;
    others?: string[];
  };

  constructor(char: CharacterStructure) {
    this.id = char.id;
    this.name = char.name.full;
    this.img = { anilist: char.image.large };
  }
}
