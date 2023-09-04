import dayjs from 'dayjs';
import { Division } from '../container/Division';
import { MapViewport } from '../container/MapViewport';
import type { Country } from '../data/Country';
import { MOVE_TYPE } from '../data/DivisionMovement';
import type { Province } from '../data/Provice';
import { data } from '../GameManager';
import { CountryPlayerHandler, eventHandler } from '../handler/handlers';
import { Observable } from '../util/Observable';
import { Scene } from './Scene';

const START_DATE = '1917/11/07 1:00';

export class MainScene extends Scene {
  public readonly playAs: Country;
  public readonly selectedProvince: Observable<Province>;
  public readonly datetime = new Observable<dayjs.Dayjs>(dayjs(START_DATE));
  public readonly MAX_SPEED = 5;
  public readonly speed = new Observable<number>(3);
  public readonly pause = new Observable<boolean>(true);
  public selectedDivision?: Division;

  public static async create(playAs: Country) {
    const selectedProvince = new Observable<Province>();
    const map = await MapViewport.create(selectedProvince);
    return new MainScene(playAs, map, selectedProvince);
  }

  constructor(
    playAs: Country,
    map: MapViewport,
    selectedProvince: Observable<Province>
  ) {
    super();
    this.selectedProvince = selectedProvince;
    this.playAs = playAs;

    this.addChild(map);
    map.provinceAtRightClick.addObserver((p) =>
      this.selectedDivision?.setDestination(p, MOVE_TYPE.MOVE)
    );
  }

  public setEventHandler(handler: eventHandler): void {
    this.playAs.handler = new CountryPlayerHandler(this.playAs, handler);
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
