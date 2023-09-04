import { MapViewport } from '../container/MapViewport';
import type { Province } from '../data/Provice';
import { data, GameManager } from '../GameManager';
import { Observable } from '../util/Observable';
import { MainScene } from './MainScene';
import { Scene } from './Scene';
import { DisplayObject } from 'pixi.js';

export class SelectionScene extends Scene {
  private map: MapViewport;
  public readonly selectedProvince;

  public static async create() {
    const selectedProvince = new Observable<Province>();
    const mv = await MapViewport.create(selectedProvince);
    return new SelectionScene(mv, selectedProvince);
  }

  constructor(map: MapViewport, selectedProvince: Observable<Province>) {
    super();
    this.map = map;
    this.selectedProvince = selectedProvince;
    this.addChild(this.map as unknown as DisplayObject);

    console.log(data().events.get('donets_leaves_ukraine'));
  }

  public play() {
    const playAs = this.selectedProvince.val.owner;
    if (!playAs) return;
    MainScene.create(playAs).then((scene) =>
      GameManager.instance.loadScene(scene)
    );
  }
}
