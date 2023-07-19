import * as PIXI from 'pixi.js';
import { data, GameManager, loader } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
// import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';
import { Simple } from 'pixi-cull';
import { Point } from 'pixi.js';
import { MultiColorReplaceFilter } from '../multi-color-replace-filter/MultiColorReplaceFilter';

export class MapViewport extends Viewport {
  private static _instance: MapViewport;
  private static readonly MAP_SRC = 'provinces.png';
  private spritePixelArray!: Uint8Array;
  private static readonly INITIAL_SCALE = 5;
  private provinceAtLeftClick: Observable<Province>;
  public readonly provinceAtRightClick = new Observable<Province>();
  private sprite!: PIXI.Sprite;

  public static get instance(): MapViewport {
    return this._instance;
  }

  constructor(provinceRef: Observable<Province>) {
    super();
    MapViewport._instance = this;
    this.provinceAtLeftClick = provinceRef;

    loader().load(MapViewport.MAP_SRC, (resource) => {
      this.sprite = new PIXI.Sprite(resource.texture);
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
    const arr = Array.from(data().provinces.values())
      .filter((p) => p.owner)
      .map((p) => {
        if (p.owner)
          return [
            PIXI.utils.string2hex(p.id),
            PIXI.utils.string2hex(p.owner.color),
          ];
      }) as [number, number][];

    if (this.sprite !== undefined)
      this.sprite.filters = this.getColorReplaceFilters(arr, 0.005);
  }

  private getColorReplaceFilters(
    replacements: [Color, Color][],
    epsilon?: number
  ) {
    // return [new MultiColorReplaceFilter(replacements, epsilon ?? 0.005)];
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
    const index =
      (Math.floor(position.y) * this.sprite.width + Math.floor(position.x)) * 4;

    //プロヴィンスIDに変換
    const provinceId = PIXI.utils.hex2string(
      PIXI.utils.rgb2hex([
        this.spritePixelArray[index + 0] / 255,
        this.spritePixelArray[index + 1] / 255,
        this.spritePixelArray[index + 2] / 255,
      ])
    );
    return provinceId;
  }

  private getClickedProvince(e: PIXI.InteractionEvent) {
    //Uinit8Array上でのインデックスを算出
    const position = e.data.getLocalPosition(this);
    const province = this.getProvinceByPoint(position);
    console.log('clicked point', position.x, position.y);
    if (!province) return; //プロヴィンスが存在しなければ何もしない
    // プロヴィンスの中心座標がおかしい場合は再計算
    if (
      province.x === 100 ||
      province.y === 100 ||
      Math.abs(province.x - position.x) > 300 ||
      Math.abs(province.x - position.x) > 300
    ) {
      const { x, y } = this.calcCenter(position) as Point;
      province.x = x;
      province.y = y;
    }
    console.log('selected province', province);
    return province;
  }

  private getProvinceByPoint(position: PIXI.Point): Province {
    const provinceId = this.getProvinceIdFromPoint(position);
    const provinces = data().provinces;
    let province = provinces.get(provinceId);

    if (!province) {
      //プロビンスデータが無かったら新規作成(データを事前に用意したのでここが実行されることはないはず)
      province = new Province(provinceId);
      provinces.set(provinceId, province);
    }
    return province;
  }

  // 指定した座標を含むプロヴィンスの中心座標を計算します
  private calcCenter(point: Point) {
    const provinceId = this.getProvinceIdFromPoint(point);
    const province = data().provinces.get(provinceId);
    if (!province) return undefined; //provinceがnullの時は何もしない

    //BFSで探索
    let x = 0;
    let y = 0;
    let count = 0;
    const candidates: Point[] = []; //{x: number, y: number,over:number} 形式
    const already = new Set<number>();
    candidates.push(point);
    while (candidates.length > 0) {
      const searchPoint = candidates.shift() as Point;
      const idx =
        (Math.floor(searchPoint.y) * this.sprite.width +
          Math.floor(searchPoint.x)) *
        4;
      if (already.has(idx)) continue; //すでに探索済みだったら何もしない
      already.add(idx);
      const provinceId2 = this.getProvinceIdFromPoint(
        new Point(searchPoint.x, searchPoint.y)
      );
      //黒線であれば超える
      if (provinceId !== provinceId2) continue; // 色が異なる場合は何もしない
      x += searchPoint.x;
      y += searchPoint.y;
      count += 1;

      if (0 <= searchPoint.x - 1)
        candidates.push(new Point(searchPoint.x - 1, searchPoint.y));
      if (searchPoint.x + 1 < this.sprite.width)
        candidates.push(new Point(searchPoint.x + 1, searchPoint.y));
      if (0 <= searchPoint.y - 1)
        candidates.push(new Point(searchPoint.x, searchPoint.y - 1));
      if (searchPoint.y + 1 < this.sprite.height)
        candidates.push(new Point(searchPoint.x, searchPoint.y + 1));
    }

    return new Point(Math.floor(x / count), Math.floor(y / count));
  }
}

type Color = number | number[] | Float32Array;
