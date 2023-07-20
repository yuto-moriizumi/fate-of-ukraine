import * as PIXI from 'pixi.js';
import { data, GameManager, loader } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';
// import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';
import { Simple } from 'pixi-cull';
import { Point } from 'pixi.js';
import { MultiColorReplaceFilter } from '../multi-color-replace-filter/MultiColorReplaceFilter';
import { ReducedColorMapFilter } from '../multi-color-replace-filter/ReducedColorMapFilter';

export class MapViewport extends Viewport {
  private static _instance: MapViewport;
  // private static readonly MAP_SRC = 'provinces.png';
  private static readonly MAP_SRC = 'remapped-provinces.png';
  private static readonly COLOR_MAP_SRC = 'color-map.png';
  private spritePixelArray!: Uint8Array;
  private static readonly INITIAL_SCALE = 5;
  private provinceAtLeftClick: Observable<Province>;
  public readonly provinceAtRightClick = new Observable<Province>();
  private sprite!: PIXI.Sprite;
  private colorMap!: PIXI.Texture;
  private colorMapPixels!: Uint8Array;

  public static get instance(): MapViewport {
    return this._instance;
  }

  constructor(provinceRef: Observable<Province>) {
    super();
    MapViewport._instance = this;
    this.provinceAtLeftClick = provinceRef;

    loader()
      .loader.add(MapViewport.MAP_SRC)
      .add(MapViewport.COLOR_MAP_SRC)
      .load((rawLoader) => {
        console.log('heloooooooooo');
        // })
        // loader().load(MapViewport.MAP_SRC, (resource) => {
        // this.sprite = new PIXI.Sprite(resource.texture);
        const colorMap = rawLoader.resources[MapViewport.COLOR_MAP_SRC].texture;
        if (!colorMap) throw new Error('Failed to load ColorMap image');
        this.colorMap = colorMap;
        const resource = rawLoader.resources[MapViewport.MAP_SRC];
        const sprite = new PIXI.Sprite(resource.texture);
        const renderer = GameManager.instance.game.renderer;
        this.spritePixelArray = renderer.plugins.extract.pixels(sprite);
        this.colorMapPixels = renderer.plugins.extract.pixels(
          new PIXI.Sprite(colorMap)
        );
        // console.log({ cmp: this.colorMapPixels });
        this.sprite = new PIXI.Sprite(
          PIXI.Texture.fromBuffer(
            this.spritePixelArray,
            sprite.width,
            sprite.height
          )
        );
        // this.sprite = new PIXI.Sprite(this.spritePixelArray);
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
    // const arr = Array.from(data().provinces.values())
    //   .filter((p) => p.owner)
    //   .map((p) => {
    //     if (p.owner)
    //       return [
    //         PIXI.utils.string2hex(p.id),
    //         PIXI.utils.string2hex(p.owner.color),
    //       ];
    //   }) as [number, number][];

    Array.from(data().provinces.values())
      .filter((p) => p.owner)
      .forEach((p) => {
        if (!p.owner) return;
        // const indexColorStr = this.getProvinceIdFromPoint(
        //   new PIXI.Point(p.x, p.y)
        // );

        const index =
          (Math.floor(p.y) * this.sprite.width + Math.floor(p.x)) * 4;

        const r = this.spritePixelArray[index + 0];
        const g = this.spritePixelArray[index + 1];

        // const indexColorHex = PIXI.utils.string2hex(indexColorStr);
        // const [r, g] = PIXI.utils.hex2rgb(indexColorHex);
        const colorMapIndex = (r + g * 256) * 4;
        const [or, og, ob] = PIXI.utils.hex2rgb(
          PIXI.utils.string2hex(p.owner.color)
        );
        this.colorMapPixels[colorMapIndex] = or * 256;
        this.colorMapPixels[colorMapIndex + 1] = og * 256;
        this.colorMapPixels[colorMapIndex + 2] = ob * 256;
        console.log({
          p: { x: p.x, y: p.y, o: p.owner.id, r, g },
          to: { r: or * 256, g: or * 256, b: or * 256 },
        });
      });

    const colorMap = PIXI.Texture.fromBuffer(this.colorMapPixels, 256, 256);
    // this.addChild(new PIXI.Sprite(colorMap));
    this.sprite.filters = [new ReducedColorMapFilter(colorMap)];
    // if (this.sprite !== undefined)
    //   this.sprite.filters = this.getColorReplaceFilters(arr, 0.005);
  }

  private getColorReplaceFilters(
    replacements: [Color, Color][],
    epsilon?: number
  ) {
    // return [];
    return [
      new ReducedColorMapFilter(
        loader().loader.resources[MapViewport.COLOR_MAP_SRC]
          .texture as PIXI.Texture
      ),
    ];
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

    //試験的にクリックした箇所を塗る
    // this.fillColor(position);
    // const idx = (position.x + position.y * this.sprite.width) * 4;
    // console.log(idx);
    // this.spritePixelArray[idx] = 255;
    // this.spritePixelArray[idx + 1] = 0;
    // this.spritePixelArray[idx + 2] = 0;
    // this.removeChild();
    // this.sprite = new PIXI.Sprite(
    //   PIXI.Texture.fromBuffer(
    //     this.spritePixelArray,
    //     this.sprite.width,
    //     this.sprite.height
    //   )
    // );
    // this.addChild(this.sprite);

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

    // const blob = new Blob([remapArr], { type: 'image/png' });
    // const a = document.createElement('a');
    // a.href = URL.createObjectURL(blob);
    // a.download = 'remapTexture.png';
    // a.click();

    const canvas =
      GameManager.instance.game.renderer.plugins.extract.canvas(sprite);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.toBlob((blob: any) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'remapTexture.png';
      a.click();
    });

    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // ctx?.putImageData(
    //   new ImageData(remapArr, this.sprite.width, this.sprite.height),
    //   0,
    //   0
    // );
    // const imageData = ctx?.createImageData(
    //   this.sprite.width,
    //   this.sprite.height
    // );
    // imageData?.data.set(remapArr);

    // const a = document.createElement('a');
    // a.href = canvas.toDataURL('image/png', 1);
    // a.download = 'image.jpg';
    // a.click();
  }
}

type Color = number | number[] | Float32Array;
