import * as PIXI from 'pixi.js';
import { MapSprite } from '../container/MapSprite';
import { GameManager } from '../GameManager';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  constructor() {
    super();
    const MAP_SRC = 'provinces.bmp';
    this.addChild(MapSprite.from(MAP_SRC));
  }

  update() {
    return;
  }
}
