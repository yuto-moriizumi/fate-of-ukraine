import { Graphics, ProjectionSystem } from 'pixi.js';
import { Province } from '../data/Provice';

export class ProgressArrow extends Graphics {
  private static readonly WIDTH = 5;
  private static readonly TRIANGLE_DEFAULT_HEIGHT = ProgressArrow.WIDTH;
  constructor(from: Province, to: Province) {
    super();
    const length = Math.sqrt((to.y - from.y) ** 2 + (to.x - from.x) ** 2);
    const triangleHeight = Math.min(
      length,
      ProgressArrow.TRIANGLE_DEFAULT_HEIGHT
    );
    const rectangleLength = length - triangleHeight;
    this.beginFill(0xffffff);
    // console.log(length);
    this.drawRect(0, 0, rectangleLength, ProgressArrow.WIDTH);
    this.endFill();
    this.rotation = Math.atan2(to.y - from.y, to.x - from.x);
    const centerX = 0;
    const centerY = ProgressArrow.WIDTH * 0.5;
    this.x -=
      centerX * Math.cos(this.rotation) - centerY * Math.sin(this.rotation);
    this.y -=
      centerX * Math.sin(this.rotation) + centerY * Math.cos(this.rotation);
    this.zIndex = -1;

    // draw triangle
    const triangleWidth = ProgressArrow.WIDTH * 2;
    let currentX = rectangleLength,
      currentY = ProgressArrow.WIDTH * 0.5;
    this.moveTo(currentX, currentY);
    this.beginFill(0xffffff);
    currentY += triangleWidth * 0.5;
    this.lineTo(currentX, currentY);
    currentX += triangleHeight;
    currentY -= triangleWidth * 0.5;
    this.lineTo(currentX, currentY);
    currentX -= triangleHeight;
    currentY -= triangleWidth * 0.5;
    this.lineTo(currentX, currentY);
    currentY += triangleWidth * 0.5;
    this.lineTo(currentX, currentY);
    this.endFill();
  }
}
