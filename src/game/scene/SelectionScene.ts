import { MapViewport } from '../container/MapViewport';
import { Province } from '../data/Provice';
import { data, GameManager } from '../GameManager';
import { Observable } from '../util/Observable';
import { MainScene } from './MainScene';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  private readonly map: MapViewport;
  public readonly selectedProvince = new Observable<Province>();

  constructor() {
    super();
    this.map = new MapViewport(this.selectedProvince);
    this.addChild(this.map);

    console.log(data().events.get('donets_leaves_ukraine'));
  }

  update(delta: number) {
    super.update(delta);
  }

  public play() {
    const playAs = this.selectedProvince.val.owner;
    if (playAs) GameManager._instance.loadScene(new MainScene(playAs));
  }
}
