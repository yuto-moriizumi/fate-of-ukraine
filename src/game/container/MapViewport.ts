import { data, GameManager } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
import {
  Assets,
  FederatedPointerEvent,
  Point,
  Sprite,
  Texture,
  utils,
} from 'pixi.js';
import { ReducedColorMapFilter } from '../multi-color-replace-filter/ReducedColorMapFilter';
import { hex2rgb } from '../util/Util';
import { EditableTexture } from '../util/Texture';

const PROVINCE_TEXTURE_SRC = 'provinces.png';
const REMAP_TEXTURE_SRC = 'remapped-provinces.png';
const PALETTE_TEXTURE_SRC = 'color-map.png';
const INITIAL_SCALE = 5;

export class MapViewport extends Viewport {
  private static _instance: MapViewport;
  public readonly provinceAtRightClick = new Observable<Province>();
  private provinceAtLeftClick: Observable<Province>;

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

  public static async create(provinceRef: Observable<Province>) {
    const assets = await Assets.load<Texture>([
      PROVINCE_TEXTURE_SRC,
      REMAP_TEXTURE_SRC,
      PALETTE_TEXTURE_SRC,
    ]);
    return new MapViewport(provinceRef, {
      province: assets[PROVINCE_TEXTURE_SRC],
      remap: assets[REMAP_TEXTURE_SRC],
      palette: assets[PALETTE_TEXTURE_SRC],
    });
  }

  private constructor(
    provinceRef: Observable<Province>,
    textures: {
      province: Texture;
      remap: Texture;
      palette: Texture;
    }
  ) {
    const { renderer } = GameManager.instance.game;
    super({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,
      events: renderer.events,
    });

    const remapTexture = textures.remap;
    MapViewport._instance = this;
    this.provinceAtLeftClick = provinceRef;
    this.provinceTexture = new EditableTexture(textures.province);
    this.remapTexture = new EditableTexture(remapTexture);
    this.remapSprite = new Sprite(remapTexture);
    this.addChild(this.remapSprite);
    this.paletteTexture = new EditableTexture(textures.palette);
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
      if (p) this.provinceAtLeftClick.val = p;
    });
    this.on('rightclick', (e) => {
      const p = this.getClickedProvince(e);
      if (p) this.provinceAtRightClick.val = p;
    });
  }

  public updateMap() {
    Array.from(data().provinces.values()).forEach((p) => {
      if (!p.owner) return;
      const [indexR, indexG] = this.remapTexture.getColor(new Point(p.x, p.y));
      this.paletteTexture.setColor(
        new Point(indexR, indexG),
        hex2rgb(utils.string2hex(p.owner.color).toString(16))
      );
    });
    this.remapSprite.filters = [
      new ReducedColorMapFilter(this.paletteTexture.getTexture()),
    ];
  }

  private getProvinceIdFromPoint(position: Point): string {
    const [r, g, b] = this.provinceTexture.getColor(position);
    //プロヴィンスIDに変換
    const provinceId = utils.hex2string(
      utils.rgb2hex([r / 255, g / 255, b / 255])
    );
    return provinceId;
  }

  private getClickedProvince(e: FederatedPointerEvent) {
    //Uinit8Array上でのインデックスを算出
    const position = e.getLocalPosition(this);
    const province = this.getProvinceByPoint(position);
    console.log('clicked point', position.x, position.y);
    if (!province) return; //プロヴィンスが存在しなければ何もしない

    console.log('selected province', province);
    console.log('targetColor', province.owner && hex2rgb(province.owner.color));
    return province;
  }

  private getProvinceByPoint(position: Point): Province {
    const provinceId = this.getProvinceIdFromPoint(position);
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
    canvas.toBlob((blob: any) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'remapTexture.png';
      a.click();
    });
  }
}
