import * as PIXI from 'pixi.js';
import { data, GameManager, loader } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';
import { Simple } from 'pixi-cull';
export class MapViewport extends Viewport {
  public static _instance: MapViewport;
  private static readonly MAP_SRC = 'provinces.png';
  private spritePixelArray!: Uint8Array;
  private static readonly INITIAL_SCALE = 5;
  private provinceRef!: Observable<Province>;
  private sprite!: PIXI.Sprite;

  public static get instance(): MapViewport {
    return this.instance;
  }

  constructor(provinceRef: Observable<Province>) {
    super();
    MapViewport._instance = this;
    this.provinceRef = provinceRef;

    const resource = loader().resources[MapViewport.MAP_SRC];
    const onLoaded = () => {
      this.sprite = new PIXI.Sprite(
        loader().resources[MapViewport.MAP_SRC].texture
      );
      const renderer = GameManager.instance.game.renderer;
      this.spritePixelArray = renderer.plugins.extract.pixels(this.sprite);
      this.addChild(this.sprite);
      const { width, height } = renderer;

      this.drag()
        .pinch()
        .wheel()
        .clampZoom({
          maxScale: 10,
          minScale: Math.min(
            width / this.sprite.width,
            height / this.sprite.height
          ),
        })
        .clamp({ direction: 'all' })
        .setZoom(MapViewport.INITIAL_SCALE)
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
    };
    if (!resource) loader().add(MapViewport.MAP_SRC).load(onLoaded);
    else onLoaded();

    this.on('click', this.getClickedProvince);
  }

  public updateMap() {
    const arr = Array.from(data().provinces.values())
      .filter((p) => p.owner)
      .map((p) => {
        if (p.owner)
          return [
            PIXI.utils.string2hex(p.id),
            PIXI.utils.string2hex(p.owner.color),
          ];
      }) as [number, number][];

    this.sprite.filters = this.getColorReplaceFilters(arr, 0.005);
  }

  private getColorReplaceFilters(
    replacements: [Color, Color][],
    epsilon?: number
  ) {
    const CHUNK_SIZE = 500;
    const sliceCount = Math.ceil(replacements.length / CHUNK_SIZE);
    const filters = [];
    for (let i = 0; i < sliceCount; i++) {
      const replacement = replacements.slice(
        CHUNK_SIZE * i,
        Math.min(CHUNK_SIZE * (i + 1), replacements.length)
      );
      filters.push(new MultiColorReplaceFilter(replacement, epsilon ?? 0.005));
    }
    return filters;
  }

  private getProvinceIdFromPoint(position: PIXI.Point): string {
    console.log(position);

    const idx =
      (Math.floor(Math.max(0, position.y)) * this.sprite.width +
        Math.floor(Math.max(0, position.x))) *
      4;

    //プロヴィンスIDに変換
    const provinceId = PIXI.utils.hex2string(
      PIXI.utils.rgb2hex([
        this.spritePixelArray[idx + 0] / 255,
        this.spritePixelArray[idx + 1] / 255,
        this.spritePixelArray[idx + 2] / 255,
      ])
    );
    return provinceId;
  }

  private getClickedProvince(e: PIXI.InteractionEvent): void {
    //Uinit8Array上でのインデックスを算出
    const position = e.data.getLocalPosition(this);
    const province = this.getProvinceByPoint(position);
    console.log('clicked point', position.x, position.y);
    if (!province) return; //プロヴィンスが存在しなければ何もしない
    console.log('selected province', province);

    this.provinceRef.val = province;
  }

  private getProvinceByPoint(position: PIXI.Point): Province | null {
    const provinceId = this.getProvinceIdFromPoint(position);

    if (!provinceId) return null; //provinceIdがnullの時は何もしない

    const provinces = data().provinces;
    let province = provinces.get(provinceId);

    if (!province) {
      //プロビンスデータが無かったら新規作成(データを事前に用意したのでここが実行されることはないはず)
      province = new Province(provinceId);
      provinces.set(provinceId, province);
      const countries = data().countries;
      const owner = countries.get('Rebels');
      if (!owner) return province;
      province.owner = owner;
    }
    return province;
  }
}

type Color = number | number[] | Float32Array;
