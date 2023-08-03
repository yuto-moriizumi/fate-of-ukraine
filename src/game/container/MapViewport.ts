import * as PIXI from 'pixi.js';
import { data, GameManager, loader } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
import { Simple } from 'pixi-cull';
import { Point } from 'pixi.js';
import { ReducedColorMapFilter } from '../multi-color-replace-filter/ReducedColorMapFilter';
import { hex2rgb } from '../util/Util';

export class MapViewport extends Viewport {
  private static _instance: MapViewport;
  private static readonly PROVINCE_SRC = 'provinces.png';
  private static readonly MAP_SRC = 'remapped-provinces.png';
  private static readonly COLOR_MAP_SRC = 'color-map.png';
  private provincePixelArray!: Uint8Array;
  private spritePixelArray!: Uint8Array;
  private static readonly INITIAL_SCALE = 5;
  private provinceAtLeftClick: Observable<Province>;
  public readonly provinceAtRightClick = new Observable<Province>();
  private sprite!: PIXI.Sprite;
  private colorMapPixels!: Uint8Array;

  public static get instance(): MapViewport {
    return this._instance;
  }

  constructor(provinceRef: Observable<Province>) {
    super();
    MapViewport._instance = this;
    this.provinceAtLeftClick = provinceRef;

    loader()
      .loader.add(MapViewport.PROVINCE_SRC)
      .add(MapViewport.MAP_SRC)
      .add(MapViewport.COLOR_MAP_SRC)
      .load((rawLoader) => {
        const colorMap = rawLoader.resources[MapViewport.COLOR_MAP_SRC].texture;
        if (!colorMap) throw new Error('Failed to load ColorMap image');
        const resource = rawLoader.resources[MapViewport.MAP_SRC];
        const sprite = new PIXI.Sprite(resource.texture);
        const renderer = GameManager.instance.game.renderer;
        this.provincePixelArray = renderer.plugins.extract.pixels(
          new PIXI.Sprite(rawLoader.resources[MapViewport.PROVINCE_SRC].texture)
        );
        this.spritePixelArray = renderer.plugins.extract.pixels(sprite);
        this.colorMapPixels = renderer.plugins.extract.pixels(
          new PIXI.Sprite(colorMap)
        );
        this.sprite = new PIXI.Sprite(
          PIXI.Texture.fromBuffer(
            this.spritePixelArray,
            sprite.width,
            sprite.height
          )
        );
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
    Array.from(data().provinces.values())
      .filter((p) => p.owner)
      .forEach((p) => {
        const index =
          (Math.floor(p.y) * this.sprite.width + Math.floor(p.x)) * 4;

        const r = this.spritePixelArray[index + 0];
        const g = this.spritePixelArray[index + 1];

        p.remapColor =
          '#' + Number(r).toString(16) + Number(g).toString(16) + '00';

        if (!p.owner) return;
        p.targetColor = p.owner.color;
        console.log({ p });

        const colorMapIndex = (r + g * 256) * 4;
        const [or, og, ob] = hex2rgb(
          PIXI.utils.string2hex(p.owner.color).toString(16)
        );
        this.colorMapPixels[colorMapIndex] = or;
        this.colorMapPixels[colorMapIndex + 1] = og;
        this.colorMapPixels[colorMapIndex + 2] = ob;
      });

    const colorMap = PIXI.Texture.fromBuffer(this.colorMapPixels, 256, 256);
    this.sprite.filters = [new ReducedColorMapFilter(colorMap)];
  }

  private getProvinceIdFromPoint(position: PIXI.Point): string {
    const index =
      (Math.floor(position.y) * this.sprite.width + Math.floor(position.x)) * 4;

    const dataSource = this.provincePixelArray;
    //プロヴィンスIDに変換
    const provinceId = PIXI.utils.hex2string(
      PIXI.utils.rgb2hex([
        dataSource[index + 0] / 255,
        dataSource[index + 1] / 255,
        dataSource[index + 2] / 255,
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

  private fillColor(point: Point) {
    const provinceId = this.getProvinceIdFromPoint(point);
    const province = data().provinces.get(provinceId);
    if (!province) return undefined; //provinceがnullの時は何もしない

    //BFSで探索
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
      this.spritePixelArray[idx] = 255;
      this.spritePixelArray[idx + 1] = 0;
      this.spritePixelArray[idx + 2] = 0;

      if (0 <= searchPoint.x - 1)
        candidates.push(new Point(searchPoint.x - 1, searchPoint.y));
      if (searchPoint.x + 1 < this.sprite.width)
        candidates.push(new Point(searchPoint.x + 1, searchPoint.y));
      if (0 <= searchPoint.y - 1)
        candidates.push(new Point(searchPoint.x, searchPoint.y - 1));
      if (searchPoint.y + 1 < this.sprite.height)
        candidates.push(new Point(searchPoint.x, searchPoint.y + 1));
    }

    return;
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

  public generateRemapTexture() {
    // const image = new ImageData(this.sprite.width, this.sprite.height);

    const remapArr = this.spritePixelArray.slice();

    const main2remap = new Map<string, string>();
    let idx = 0;

    function toHexString(rgb: number[]) {
      return PIXI.utils.hex2string(PIXI.utils.rgb2hex(rgb));
    }
    function string2rgb(str: string) {
      return PIXI.utils.hex2rgb(PIXI.utils.string2hex(str));
    }

    for (let i = 0; i < remapArr.length; i += 4) {
      const mainColor = Array.from(remapArr.slice(i, i + 3)).map(
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
      if (remapColor === undefined) {
        new Error('remapColor was undefined');
      }
      const rgb = string2rgb(remapColor ?? '#ffff00');
      remapArr[i] = Math.floor(rgb[0] * 255);
      remapArr[i + 1] = Math.floor(rgb[1] * 255);
      remapArr[i + 2] = Math.floor(rgb[2] * 255);
    }

    const sprite = new PIXI.Sprite(
      PIXI.Texture.fromBuffer(remapArr, this.sprite.width, this.sprite.height)
    );
    this.addChild(sprite);

    //ダウンロード

    const canvas =
      GameManager.instance.game.renderer.plugins.extract.canvas(sprite);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.toBlob((blob: any) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'remapTexture.png';
      a.click();
    });
  }
}
