import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { MapViewport } from '../container/MapViewport';
import { Province } from '../data/Provice';
import { Observable } from '../util/Observable';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  private map: MapViewport;
  private selectedProvince = new Observable<Province>();

  constructor() {
    super();
    const MAP_SRC = 'assets/provinces.png';
    this.map = new MapViewport(MAP_SRC, this.selectedProvince);
    this.addChild(this.map);
  }

  public getSelectedProvince(): Observable<Province> {
    return this.selectedProvince;
  }

  update() {
    return;
  }
}
