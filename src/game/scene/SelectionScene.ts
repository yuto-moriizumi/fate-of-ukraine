import { MapViewport } from '../container/MapViewport';
import { data, GameManager, getStore } from '../GameManager';
import { MainScene } from './MainScene';
import { Scene } from './Scene';
import { DisplayObject } from 'pixi.js';

export class SelectionScene extends Scene {
  private map: MapViewport;

  public static async create() {
    return new SelectionScene(await MapViewport.create());
  }

  constructor(map: MapViewport) {
    super();
    this.map = map;
    this.addChild(this.map as unknown as DisplayObject);
    console.log(data().events.get('donets_leaves_ukraine'));
  }

  public play() {
    const playAs = getStore().province.val?.owner;
    if (!playAs) return;
    getStore().country.root.set(playAs);
    MainScene.create().then((scene) => GameManager.instance.loadScene(scene));
  }
}
