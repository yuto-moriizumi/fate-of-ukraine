import { Graphics, ProjectionSystem } from 'pixi.js';
import { Province } from '../data/Provice';

export class ProgressArrow extends Graphics {
  private static readonly WIDTH = 10;
  constructor(from: Province, to: Province) {
    super();
    const length = Math.sqrt((to.y - from.y) ** 2 + (to.x - from.x) ** 2);
    this.beginFill(0xffffff);
    // console.log(length);
    this.drawRect(0, 0, length, ProgressArrow.WIDTH);
    this.endFill();
    this.rotation = Math.atan2(to.y - from.y, to.x - from.x);
    const centerX = 0;
    const centerY = ProgressArrow.WIDTH * 0.5;
    this.x -=
      centerX * Math.cos(this.rotation) - centerY * Math.sin(this.rotation);
    this.y -=
      centerX * Math.sin(this.rotation) + centerY * Math.cos(this.rotation);
  }
}
