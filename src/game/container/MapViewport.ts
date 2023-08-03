import * as PIXI from 'pixi.js';
import { data, GameManager, loader } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
import { Simple } from 'pixi-cull';
import { Point } from 'pixi.js';
import { ReducedColorMapFilter } from '../multi-color-replace-filter/ReducedColorMapFilter';
import { hex2rgb } from '../util/Util';
import { Texture } from '../util/Texture';

const PROVINCE_TEXTURE_SRC = 'provinces.png';
const REMAP_TEXTURE_SRC = 'remapped-provinces.png';
const PALETTE_TEXTURE_SRC = 'color-map.png';
const INITIAL_SCALE = 5;

export class MapViewport extends Viewport {
  private static _instance: MapViewport;
  public readonly provinceAtRightClick = new Observable<Province>();
  private provinceAtLeftClick: Observable<Province>;

  /** province image data, which is colored uniquely for each province with using various colors */
  private provinceTexture!: Texture;
  /** province image data, which is colored uniquely for each province with using reduced colors (blue color must not be included) */
  private remapTexture!: Texture;
  /** palette image, which is colored differently by pixels for mapping each coordinate to target colors */
  private paletteTexture!: Texture;

  private remapSprite!: PIXI.Sprite;

  public static get instance(): MapViewport {
    return this._instance;
  }

  constructor(provinceRef: Observable<Province>) {
    super();
    MapViewport._instance = this;
    this.provinceAtLeftClick = provinceRef;

    loader()
      .loader.add(PROVINCE_TEXTURE_SRC)
      .add(REMAP_TEXTURE_SRC)
      .add(PALETTE_TEXTURE_SRC)
      .load((rawLoader) => {
        const colorMap = rawLoader.resources[PALETTE_TEXTURE_SRC].texture;
        if (!colorMap) throw new Error('Failed to load ColorMap image');

        const { renderer } = GameManager.instance.game;

        this.provinceTexture = new Texture(
          rawLoader.resources[PROVINCE_TEXTURE_SRC].texture as PIXI.Texture
        );

        const remapTexture = rawLoader.resources[REMAP_TEXTURE_SRC]
          .texture as PIXI.Texture;
        this.remapTexture = new Texture(remapTexture);
        this.remapSprite = new PIXI.Sprite(remapTexture);
        this.addChild(this.remapSprite);

        this.paletteTexture = new Texture(
          rawLoader.resources[PALETTE_TEXTURE_SRC].texture as PIXI.Texture
        );

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

        const cull = new Simple();
        cull.addList(
          (this.children as PIXI.Container[])
            .map((layer) => {
              return layer.children;
            })
            .flat()
        );
        cull.cull(this.getVisibleBounds());

        this.on('moved', () => {
          if (this.dirty) {
            cull.cull(this.getVisibleBounds());
            this.dirty = false;
          }
        });

        this.updateMap();
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
        hex2rgb(PIXI.utils.string2hex(p.owner.color).toString(16))
      );
    });
    this.remapSprite.filters = [
      new ReducedColorMapFilter(this.paletteTexture.getTexture()),
    ];
  }

  private getProvinceIdFromPoint(position: PIXI.Point): string {
    const [r, g, b] = this.provinceTexture.getColor(position);
    //プロヴィンスIDに変換
    const provinceId = PIXI.utils.hex2string(
      PIXI.utils.rgb2hex([r / 255, g / 255, b / 255])
    );
    return provinceId;
  }

  private getClickedProvince(e: PIXI.InteractionEvent) {
    //Uinit8Array上でのインデックスを算出
    const position = e.data.getLocalPosition(this);
    const province = this.getProvinceByPoint(position);
    console.log('clicked point', position.x, position.y);
    if (!province) return; //プロヴィンスが存在しなければ何もしない

    console.log('selected province', province);
    console.log('targetColor', province.owner && hex2rgb(province.owner.color));
    return province;
  }

  private getProvinceByPoint(position: PIXI.Point): Province {
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
