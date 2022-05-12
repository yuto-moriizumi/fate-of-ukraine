import * as PIXI from 'pixi.js';
import { GameManager } from '../GameManager';
import { Province } from '../data/Provice';
import { Viewport } from 'pixi-viewport';
import { Observable } from '../util/Observable';

export class MapViewport extends Viewport {
  private static readonly BORDER_COLOR = '#000000'; //プロヴィンス境界の色
  private static readonly BORDER_WIDTH = 5; //境界線のだいたいの太さ
  private spritePixelArray!: Uint8Array;
  private pressKeys: Set<string> = new Set<string>();
  private static readonly INITIAL_SCALE = 5;
  private provinceRef!: Observable<Province>;
  private sprite!: PIXI.Sprite;

  constructor(source: string, provinceRef: Observable<Province>) {
    super();
    this.provinceRef = provinceRef;

    const loader = PIXI.Loader.shared;
    loader.add(source).load(() => {
      this.sprite = new PIXI.Sprite(loader.resources[source].texture);
      const renderer = GameManager.instance.game.renderer;
      this.spritePixelArray = renderer.plugins.extract.pixels(this.sprite);
      this.addChild(this.sprite);
      const { width, height } = renderer;

      this
        .drag()
        .pinch()
        .wheel()
        .clampZoom({
          maxScale: 10,
          minScale: Math.min(width / this.sprite.width, height / this.sprite.height),
        })
        .clamp({ direction: 'all' })
        .setZoom(MapViewport.INITIAL_SCALE)
        .moveCenter(3200, 500);
    });

    // this.interactive = true;
    this.on("click", this.getClickedProvince);
  }

  private getProvinceIdFromPoint(position: PIXI.Point): string {
    console.log(position);

    const idx =
      (Math.floor(Math.max(0, position.y)) * this.sprite.width +
        Math.floor(Math.max(0, position.x))) *
      4;

    //プロヴィンスIDに変換
    //console.log(this.provinceMap[idx + 0]);
    let provinceId;
    try {
      provinceId = PIXI.utils.hex2string(
        PIXI.utils.rgb2hex([
          this.spritePixelArray[idx + 0] / 255,
          this.spritePixelArray[idx + 1] / 255,
          this.spritePixelArray[idx + 2] / 255,
        ])
      );
    } catch (error) {
      console.log(error);
      console.log(
        position.x,
        position.y,
        idx,
        this.spritePixelArray.length,
        this.sprite.width,
        this.sprite.height
      );
      throw new Error('停止');
    }
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

  /**
   * 指定した座標を含むプロヴィンスの重心座標を返します
   *
   * @private
   * @param {PIXI.Point} point
   * @returns
   * @memberof MyMap
   */
  private getBarycenter(point: PIXI.Point) {
    // const provinceId = this.getProvinceIdFromPoint(point);
    // if (!provinceId) return null; //provinceIdがnullの時は何もしない
    // const data = GameManager.instance.data;
    // const province = data.getProvinces().get(provinceId);
    // if (!province) return null; //provinceがnullの時は何もしない

    // //BFSで探索
    // let x = 0;
    // let y = 0;
    // let count = 0;
    // const candidates = new Array<object>(); //{x: number, y: number,over:number} 形式
    // const already = new Set<number>();
    // candidates.push({ x: point.x, y: point.y, over: 0 });
    // while (candidates.length > 0) {
    //   const searchPoint = candidates.shift();
    //   const idx =
    //     (Math.floor(searchPoint['y']) * this.defaultWidth +
    //       Math.floor(searchPoint['x'])) *
    //     4;
    //   if (already.has(idx)) {
    //     //すでに探索済みだったら何もしない
    //     continue;
    //   }
    //   already.add(idx);
    //   const provinceId2 = this.getProvinceIdFromPoint(
    //     new PIXI.Point(searchPoint['x'], searchPoint['y'])
    //   );
    //   if (provinceId2 == Atlas.BORDER_COLOR) searchPoint['over']++;
    //   //黒線であれば超える
    //   else if (
    //     searchPoint['over'] > Atlas.BORDER_WIDTH + 5 || //上限以上黒線を辿っている場合
    //     provinceId !== provinceId2 //色が異なる場合
    //   )
    //     continue; //provinceIdが異なる（=色が異なる）場合は何もしない
    //   if (provinceId2 !== Atlas.BORDER_COLOR) {
    //     //境界線でなければ重心にカウント
    //     x += searchPoint['x'];
    //     y += searchPoint['y'];
    //     count += 1;
    //   }

    //   if (0 <= searchPoint['x'] - 1)
    //     candidates.push(new PIXI.Point(searchPoint['x'] - 1, searchPoint['y']));
    //   if (searchPoint['x'] + 1 < this.defaultWidth)
    //     candidates.push(new PIXI.Point(searchPoint['x'] + 1, searchPoint['y']));
    //   if (0 <= searchPoint['y'] - 1)
    //     candidates.push(new PIXI.Point(searchPoint['x'], searchPoint['y'] - 1));
    //   if (searchPoint['y'] + 1 < this.defaultHeight)
    //     candidates.push(new PIXI.Point(searchPoint['x'], searchPoint['y'] + 1));
    // }

    // return new PIXI.Point(Math.floor(x / count), Math.floor(y / count));
    return null as unknown as PIXI.Point;
  }

  public calculateBarycenterOfAll() {
    // const already = new Set<Province>();
    // //全てのピクセルを走査し、重心座標を設定します
    // for (let i = 0; i < this.defaultHeight; i++) {
    //   for (let j = 0; j < this.defaultWidth; j++) {
    //     const province = this.getProvince(new PIXI.Point(j, i));
    //     if (!already.has(province) && province != null) {
    //       province.setCoord(this.getBarycenter(new PIXI.Point(j, i)));
    //       already.add(province);
    //     }
    //   }
    // }
    // console.log('重心走査終了');
  }

  private getProvinceByPoint(position: PIXI.Point): Province | null {
    const provinceId = this.getProvinceIdFromPoint(position);
    const data = GameManager.instance.data;

    if (!provinceId) return null; //provinceIdがnullの時は何もしない

    const provinces = data.getProvinces();
    let province = provinces.get(provinceId);

    if (!province) {
      //プロビンスデータが無かったら新規作成(データを事前に用意したのでここが実行されることはないはず)
      province = new Province(provinceId);
      provinces.set(provinceId, province);
      const countries = data.getCountries();
      const owner = countries.get('Rebels');
      if (!owner) return province;
      province.setOwner(owner);
    } else {
      //もし選択したプロヴィンスに座標情報が用意されていなかったら追加する
      // const point = province.getCoord();
      // if (point.x == 0 && point.y == 0)
      //   province.setCoord(this.getBarycenter(position));
    }
    return province;
  }

  public getNeighborProvinces(province: Province) {
    // const provincePoint = province.getCoord();

    // //BFSで探索
    // const candidates = new Array<object>();
    // const answer = new ExtendedSet<Province>();
    // //{x:number,y:number,over:number(黒線を超えた回数)}
    // const already = new Set<number>();
    // candidates.push({ x: provincePoint.x, y: provincePoint.y, over: 0 });
    // while (candidates.length > 0) {
    //   const searchPoint = candidates.shift();
    //   const idx =
    //     (Math.floor(searchPoint['y']) * this.defaultWidth +
    //       Math.floor(searchPoint['x'])) *
    //     4;
    //   if (already.has(idx)) {
    //     //すでに探索済みだったら何もしない
    //     continue;
    //   }
    //   already.add(idx);
    //   const provinceId2 = this.getProvinceIdFromPoint(
    //     new PIXI.Point(searchPoint['x'], searchPoint['y'])
    //   );
    //   let over = searchPoint['over'];

    //   if (
    //     provinceId2 !== province.getId() &&
    //     provinceId2 !== Atlas.BORDER_COLOR
    //   )
    //     //スタートのプロヴィンスでも境界線でもないなら
    //     answer.add(GameManager.instance.data.getProvinces().get(provinceId2));

    //   if (provinceId2 == Atlas.BORDER_COLOR) {
    //     //境界線であるならば
    //     over++; //境界線であるのでoverをカウント
    //   } else if (provinceId2 != province.getId()) continue; //探索開始プロヴィンスと異なり、境界線でないならば探索しない
    //   if (over > Atlas.BORDER_WIDTH) continue; //3ピクセル以上超えていれば境界線を辿っていると判断してcontinue

    //   if (0 < searchPoint['x'])
    //     candidates.push({
    //       x: searchPoint['x'] - 1,
    //       y: searchPoint['y'],
    //       over: over,
    //     });
    //   if (searchPoint['x'] < this.defaultWidth - 1)
    //     candidates.push({
    //       x: searchPoint['x'] + 1,
    //       y: searchPoint['y'],
    //       over: over,
    //     });
    //   if (0 < searchPoint['y'])
    //     candidates.push({
    //       x: searchPoint['x'],
    //       y: searchPoint['y'] - 1,
    //       over: over,
    //     });
    //   if (searchPoint['y'] < this.defaultHeight - 1)
    //     candidates.push({
    //       x: searchPoint['x'],
    //       y: searchPoint['y'] + 1,
    //       over: over,
    //     });
    // }
    // return answer;
    return;
  }

  public isNextTo(province1: Province, province2: Province): boolean {
    // if (province1 == province2) return true;
    // return this.getNeighborProvinces(province1).some(
    //   (province) => province == province2
    // );
    return true;
  }

  //   public setMode(mode: MapMode) {
  //     if (this.mode) this.mode.destroy();
  //     this.mode = mode;
  //     this.mode.addObserver(this);
  //     this.mode.update();
  //   }

  //   public generateProvinceGraph() {
  //     console.log('Generating Province Graph...');
  //     GameManager.instance.data.getProvinces().forEach((province) => {
  //       province.neighbours = this.getNeighborProvinces(province);
  //     });
  //     console.log('Province Graph Generated');
  //   }

  //   public switchProvinceGraph() {
  //     if (this.graphArrows.length > 0) {
  //       this.graphArrows.forEach((graphArrow) => graphArrow.destroy());
  //       this.graphArrows = [];
  //       return;
  //     }
  //     GameManager.instance.data.getProvinces().forEach((province) => {
  //       province.getNeighbours().forEach((neighbour) => {
  //         const province2 = GameManager.instance.data
  //           .getProvinces()
  //           .get(neighbour);
  //         const arrow = new Arrow(province, province2, 1, 0xffff00);
  //         this.graphArrows.push(arrow);
  //         this.addChild(arrow);
  //       });
  //     });
  //   }
}
