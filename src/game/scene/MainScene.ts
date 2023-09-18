import { MAX_SPEED } from '../../store';
import { Division } from '../container/Division';
import { MapViewport } from '../container/MapViewport';
import { MOVE_TYPE } from '../data/DivisionMovement';
import { data, getStore } from '../GameManager';
import { CountryPlayerHandler } from '../handler/handlers';
import { Scene } from './Scene';

export class MainScene extends Scene {
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
    const { pause, speed, current } = getStore().timer;
    if (pause.val) return;
    if (this.elapsedFrameCount % (2 ** (MAX_SPEED - speed.val) * 3) !== 0)
      return;
    current.set(current.val.add(1, 'hour'));
    data().countries.forEach((c) => c.update(current.val)); //国ハンドラを稼働させる
    data().events.forEach((e) => e.countFoward()); //イベントタイマーを進める
    data().combats.forEach((c) => c.update()); // 戦闘を進める
  }
}
