import * as PIXI from 'pixi.js';
import { GameManager } from '../GameManager';
import { Scene } from './Scene';

export class SelectionScene extends Scene {
  constructor() {
    super();
    GameManager.instance.game.loader.add('provinces.bmp').load(() => {
      console.log("load ened")
      return;
    });
  }

  update() {
    return;
  }
}
