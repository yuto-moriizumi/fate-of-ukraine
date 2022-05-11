import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { MapViewport } from '../container/MapViewport';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  private map: MapViewport;
  constructor() {
    super();
    const MAP_SRC = 'provinces.bmp';
    this.map = new MapViewport(MAP_SRC);
    this.addChild(this.map);
  }

  update() {
    this.map.update();
  }
}
