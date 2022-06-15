import { Graphics } from 'pixi.js';
import { Province } from '../data/Provice';

export class ProgressArrow extends Graphics {
  private static readonly WIDTH = 10;
  constructor(from: Province, to: Province) {
    super();
    const length = Math.sqrt((to.y - from.y) ** 2 + (to.x - from.x) ** 2);
    this.beginFill(0xffffff);
    console.log(length);
    this.drawRect(0, 0, length, ProgressArrow.WIDTH);
    this.endFill();
    this.rotation = Math.atan2(to.y - from.y, to.x - from.x);
    // this.x -= (Math.cos(this.rotation) * ProgressArrow.WIDTH) / 2;
    // this.y -= (Math.sin(this.rotation) * ProgressArrow.WIDTH) / 2;
  }
}
