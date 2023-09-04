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
import { DisplayObject } from 'pixi.js';

export class MainScene extends Scene {
  private map!: MapViewport;
  public readonly playAs: Country;
  public readonly selectedProvince = new Observable<Province>();
  public readonly datetime = new Observable<dayjs.Dayjs>(
    dayjs('1917/11/07 1:00')
  );
  public readonly MAX_SPEED = 5;
  public readonly speed = new Observable<number>(3);
  public readonly pause = new Observable<boolean>(true);
  public selectedDivision?: Division;
  public eventHandler!: eventHandler;

  constructor(playAs: Country) {
    super();
    this.playAs = playAs;
    playAs.handler = new CountryPlayerHandler(playAs, (e) => {
      this.eventHandler(e);
      console.log('mainscene');
    });
    MapViewport.create(this.selectedProvince).then((mv) => {
      this.map = mv;
      this.addChild(mv as unknown as DisplayObject);
      mv.provinceAtRightClick.addObserver((p) => {
        if (this.selectedDivision)
          this.selectedDivision.setDestination(p, MOVE_TYPE.MOVE);
      });
    });
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
