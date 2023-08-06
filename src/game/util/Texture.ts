import { Texture, Point, Sprite } from 'pixi.js';
import { GameManager } from '../GameManager';
import { Color } from './Color';

export class EditableTexture {
  private readonly data: Uint8Array;
  private readonly width: number;
  private readonly height: number;

  constructor(texture: Texture) {
    this.data = GameManager.instance.game.renderer.plugins.extract.pixels(
      new Sprite(texture)
    ) as Uint8Array;
    this.width = texture.width;
    this.height = texture.height;
  }

  public getColor(point: Point) {
    const index = this.getIndex(point);
    return new Color(this.data.slice(index, index + 3));
  }

  /** set color against the given position. position should be given as Point or serialized index */
  public setColor(position: Point | number, color: Color) {
    const index =
      typeof position === 'number' ? position : this.getIndex(position);
    const [r, g, b] = color.toUint8RgbArray();
    this.data[index] = r;
    this.data[index + 1] = g;
    this.data[index + 2] = b;
  }

  public getTexture() {
    return Texture.fromBuffer(this.data, this.width, this.height);
  }

  /** Generate reduced colored texture, used for creating remap image */
  public generateRemapTexture() {
    const main2remap = new Map<string, Color>();
    let idx = 0;

    const remapTextue = new EditableTexture(this.getTexture());
    for (let i = 0; i < this.data.length; i += 4) {
      const key = new Color(Array.from(this.data.slice(i, i + 3))).toHex();
      if (!main2remap.has(key)) {
        const r = idx % 256;
        const g = Math.floor(idx / 256);
        const b = 0;
        main2remap.set(key, new Color([r / 255, g / 255, b / 255]));
        idx++;
      }
      const remapColor = main2remap.get(key) ?? new Color('#ffff00');
      remapTextue.setColor(i, remapColor);
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
