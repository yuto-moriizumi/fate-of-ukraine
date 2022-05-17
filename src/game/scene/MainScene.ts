import dayjs from 'dayjs';
import { MapViewport } from '../container/MapViewport';
import { Country } from '../data/Country';
import { Province } from '../data/Provice';
import { data } from '../GameManager';
import { CountryPlayerHandler } from '../handler/CountryPlayerHandler';
import { Observable } from '../util/Observable';
import { Scene } from './Scene';

export class MainScene extends Scene {
  private readonly map: MapViewport;
  public readonly playAs: Country;
  public readonly selectedProvince = new Observable<Province>();
  public readonly datetime = new Observable<dayjs.Dayjs>(
    dayjs('1917/11/07 1:00')
  );
  public readonly MAX_SPEED = 5;
  public readonly speed = new Observable<number>(3);
  public readonly pause = new Observable<boolean>(true);

  constructor(playAs: Country) {
    super();
    this.playAs = playAs;
    playAs.handler = new CountryPlayerHandler(playAs);
    this.map = new MapViewport(this.selectedProvince);
    this.addChild(this.map);
  }

  update(delta: number) {
    super.update(delta);
    if (this.pause.val) return;
    if (
      this.elapsedFrameCount % (2 ** (this.MAX_SPEED - this.speed.val) * 3) !==
      0
    )
      return;
    this.datetime.val = this.datetime.val.add(1, 'hour');
    data().countries.forEach((c) => c.update(this.datetime.val)); //国ハンドラを稼働させる
    data().events.forEach((e) => e.countFoward()); //イベントタイマーを進める
  }
}
