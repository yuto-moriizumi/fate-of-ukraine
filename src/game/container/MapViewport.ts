import { data, GameManager } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
import { Assets, FederatedPointerEvent, Point, Sprite, Texture } from 'pixi.js';
import { ReducedColorMapFilter } from '../filter/ReducedColorMapFilter';
import { EditableTexture } from '../util/Texture';
import { Color } from '../util/Color';

const PROVINCE_TEXTURE_SRC = 'provinces.png';
const REMAP_TEXTURE_SRC = 'remapped-provinces.png';
const PALETTE_TEXTURE_SRC = 'color-map.png';
const INITIAL_SCALE = 5;

export class MapViewport extends Viewport {
  private static _instance: MapViewport;
  public readonly provinceAtRightClick = new Observable<Province>();

  /** province image data, which is colored uniquely for each province with using various colors */
  private provinceTexture: EditableTexture;
  /** province image data, which is colored uniquely for each province with using reduced colors (blue color must not be included) */
  private remapTexture: EditableTexture;
  /** palette image, which is colored differently by pixels for mapping each coordinate to target colors */
  private paletteTexture: EditableTexture;

  private remapSprite: Sprite;

  public static get instance(): MapViewport {
    return this._instance;
  }

  public static async create() {
    const assets = await Assets.load<Texture>([
      PROVINCE_TEXTURE_SRC,
      REMAP_TEXTURE_SRC,
      PALETTE_TEXTURE_SRC,
    ]);
    return new MapViewport(
      assets[PROVINCE_TEXTURE_SRC],
      assets[REMAP_TEXTURE_SRC],
      assets[PALETTE_TEXTURE_SRC]
    );
  }

  private constructor(province: Texture, remap: Texture, palette: Texture) {
    const { renderer } = GameManager.instance.game;
    super({
      events: renderer.events,
    });

    const remapTexture = remap;
    MapViewport._instance = this;
    this.provinceTexture = new EditableTexture(province);
    this.remapTexture = new EditableTexture(remapTexture);
    this.remapSprite = new Sprite(remapTexture);
    this.addChild(this.remapSprite);
    this.paletteTexture = new EditableTexture(palette);
    const { width, height } = renderer;
    this.drag()
      .pinch()
      .wheel()
      .clampZoom({
        maxScale: 10,
        minScale: Math.min(
          width / remapTexture.width,
          height / remapTexture.height
        ),
      })
      .clamp({ direction: 'all' })
      .setZoom(INITIAL_SCALE)
      .moveCenter(3200, 500);

    this.updateMap();

    this.on('moved', () => {
      if (!this.dirty) return;
      this.dirty = false;
    });

    this.on('click', (e) => {
      const p = this.getClickedProvince(e);
      if (p) GameManager.instance.store.getState().province.set(p);
    });
    this.on('rightclick', (e) => {
      const p = this.getClickedProvince(e);
      if (p) this.provinceAtRightClick.val = p;
    });
  }

  public updateMap() {
    Array.from(data().provinces.values()).forEach((p) => {
      if (!p.owner) return;
      const [indexR, indexG] = this.remapTexture
        .getColor(new Point(p.x, p.y))
        .toUint8RgbArray();
      this.paletteTexture.setColor(
        new Point(indexR, indexG),
        new Color(p.owner.color)
      );
    });
    this.remapSprite.filters = [
      new ReducedColorMapFilter(this.paletteTexture.getTexture()),
    ];
  }

  private getClickedProvince(e: FederatedPointerEvent) {
    //Uinit8Array上でのインデックスを算出
    const position = e.getLocalPosition(this);
    const province = this.getProvinceByPoint(position);
    console.log('clicked point', position.x, position.y);
    if (!province) return; //プロヴィンスが存在しなければ何もしない

    console.log('selected province', province);
    return province;
  }

  private getProvinceByPoint(position: Point): Province {
    const provinceId = this.provinceTexture.getColor(position).toHex();
    console.log({ provinceId });
    const provinces = data().provinces;

    let province = provinces.get(provinceId);

    if (!province) {
      console.error('Province was not found on the given point');
      //プロビンスデータが無かったら新規作成(データを事前に用意したのでここが実行されることはないはず)
      province = new Province(provinceId);
      provinces.set(provinceId, province);
    }
    return province;
  }

  /** Generate and download remap texture from the province texture */
  public downloadRemapTexture() {
    const canvas = GameManager.instance.game.renderer.plugins.extract.canvas(
      this.provinceTexture.generateRemapTexture()
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.toBlob?.((blob: any) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'remapTexture.png';
      a.click();
    });
  }
}
