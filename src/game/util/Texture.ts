import { Texture, Point, Sprite, utils } from 'pixi.js';
import { GameManager } from '../GameManager';

export class EditableTexture {
  private readonly data: Uint8Array;
  private readonly width: number;
  private readonly height: number;

  constructor(texture: Texture) {
    this.data = GameManager.instance.game.renderer.plugins.extract.pixels(
      new Sprite(texture)
    );
    this.width = texture.width;
    this.height = texture.height;
  }

  public getColor(point: Point) {
    const index = this.getIndex(point);
    return Array.from(this.data.slice(index, index + 3)) as Rgb;
  }

  /** set color against the given position. position should be given as Point or serialized index */
  public setColor(position: Point | number, color: Rgb) {
    const index =
      typeof position === 'number' ? position : this.getIndex(position);
    this.data[index] = color[0];
    this.data[index + 1] = color[1];
    this.data[index + 2] = color[2];
  }

  public getTexture() {
    return Texture.fromBuffer(this.data, this.width, this.height);
  }

  /** Generate reduced colored texture, used for creating remap image */
  public generateRemapTexture() {
    const main2remap = new Map<string, string>();
    let idx = 0;

    function toHexString(rgb: number[]) {
      return utils.hex2string(utils.rgb2hex(rgb));
    }
    function string2rgb(str: string) {
      return utils.hex2rgb(utils.string2hex(str));
    }
    const remapTextue = new EditableTexture(this.getTexture());
    for (let i = 0; i < this.data.length; i += 4) {
      const mainColor = Array.from(this.data.slice(i, i + 3)).map(
        (v) => v / 255
      );
      const key = toHexString(mainColor);
      if (!main2remap.has(key)) {
        const r = idx % 256;
        const g = Math.floor(idx / 256);
        const b = 0;
        main2remap.set(key, toHexString([r / 255, g / 255, b / 255]));
        idx++;
      }
      const remapColor = main2remap.get(key);
      const rgb = string2rgb(remapColor ?? '#ffff00');
      remapTextue.setColor(i, [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255]);
    }
    return new Sprite(remapTextue.getTexture());
  }

  /**
   * get serialized index from point
   * see also: https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
   */
  private getIndex(point: Point) {
    return (Math.floor(point.y) * this.width + Math.floor(point.x)) * 4;
  }
}

/** Color in RGB, ranging [0, 256) */
export type Rgb = [number, number, number];
