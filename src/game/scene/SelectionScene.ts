import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { MapSprite } from '../container/MapSprite';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  private map: Viewport;
  constructor() {
    super();
    const MAP_SRC = 'provinces.bmp';
    this.map = MapSprite.createViewport(MAP_SRC);
    this.addChild(this.map);
  }

  update() {
    return;
  }
}
