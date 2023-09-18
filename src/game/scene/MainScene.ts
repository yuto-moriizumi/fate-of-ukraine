import dayjs from 'dayjs';
import { Division } from '../container/Division';
import { MapViewport } from '../container/MapViewport';
import { MOVE_TYPE } from '../data/DivisionMovement';
import { data, getStore } from '../GameManager';
import { CountryPlayerHandler } from '../handler/handlers';
import { Observable } from '../util/Observable';
import { Scene } from './Scene';

const START_DATE = '1917/11/07 1:00';

export class MainScene extends Scene {
  public readonly datetime = new Observable<dayjs.Dayjs>(dayjs(START_DATE));
  public readonly MAX_SPEED = 5;
  public readonly speed = new Observable<number>(3);
  public readonly pause = new Observable<boolean>(true);
  public selectedDivision?: Division;

  public static async create() {
    return new MainScene(await MapViewport.create());
  }

  constructor(map: MapViewport) {
    super();
    this.addChild(map);
    map.provinceAtRightClick.addObserver((p) =>
      this.selectedDivision?.setDestination(p, MOVE_TYPE.MOVE)
    );
    const playAs = getStore().country.root.val;
    if (playAs)
      playAs.handler = new CountryPlayerHandler(playAs, (e) =>
        getStore().events.add(e)
      );
  }

  update() {
    super.update();
    if (this.pause.val) return;
    if (
      this.elapsedFrameCount % (2 ** (this.MAX_SPEED - this.speed.val) * 3) !==
      0
    )
      return;
    this.datetime.val = this.datetime.val.add(1, 'hour');
    // console.log(data().events.get('russian_civilwar_begins_news'));
    data().countries.forEach((c) => c.update(this.datetime.val)); //国ハンドラを稼働させる
    data().events.forEach((e) => e.countFoward()); //イベントタイマーを進める
    data().combats.forEach((c) => c.update()); // 戦闘を進める
  }
}
