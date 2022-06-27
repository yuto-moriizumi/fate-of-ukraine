import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';
import { Container, Graphics, ProjectionSystem } from 'pixi.js';
import { MoveType, MOVE_TYPE } from '../data/DivisionMovement';
import { Province } from '../data/Provice';

export class ProgressArrow extends Container {
  private static readonly WIDTH = 5;
  private static readonly TRIANGLE_DEFAULT_HEIGHT = ProgressArrow.WIDTH;
  private static readonly COLOR: Record<MoveType, number> = {
    MOVE: 0xff0000,
    RETREAT: 0xcfcfcf,
  };
  private _progress = 0; // 0-1
  private arrow: Graphics;
  private arrowForMask: Graphics;
  private progressRect?: Graphics;
  private readonly length: number;
  private readonly type: MoveType;

  constructor(from: Province, to: Province, type: MoveType) {
    super();
    this.type = type;
    this.length = Math.sqrt((to.y - from.y) ** 2 + (to.x - from.x) ** 2);
    const triangleHeight = Math.min(
      this.length,
      ProgressArrow.TRIANGLE_DEFAULT_HEIGHT
    );
    const rectangleLength = this.length - triangleHeight;

    // draw rectangle
    this.arrow = new Graphics();
    this.arrow.beginFill(0xffffff);
    this.arrow.drawRect(0, 0, rectangleLength, ProgressArrow.WIDTH);
    this.arrow.endFill();

    // set basic settings
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
    this.arrow.moveTo(currentX, currentY);
    this.arrow.beginFill(0xffffff);
    currentY += triangleWidth * 0.5;
    this.arrow.lineTo(currentX, currentY);
    currentX += triangleHeight;
    currentY -= triangleWidth * 0.5;
    this.arrow.lineTo(currentX, currentY);
    currentX -= triangleHeight;
    currentY -= triangleWidth * 0.5;
    this.arrow.lineTo(currentX, currentY);
    currentY += triangleWidth * 0.5;
    this.arrow.lineTo(currentX, currentY);
    this.arrow.endFill();
    this.addChild(this.arrow);

    this.arrowForMask = this.arrow.clone();
    this.arrowForMask.rotation = this.arrow.rotation;
    this.arrowForMask.position = this.arrow.position;
    this.addChild(this.arrowForMask);
  }

  get progress() {
    return this._progress;
  }

  set progress(value: number) {
    this._progress = value;
    if (this.progressRect) this.progressRect.destroy();

    this.progressRect = new Graphics();
    this.progressRect.beginFill(ProgressArrow.COLOR[this.type]);
    this.progressRect.drawRect(
      0,
      -ProgressArrow.WIDTH * 0.5,
      this.length * value,
      ProgressArrow.WIDTH * 2
    );
    this.progressRect.endFill();

    this.progressRect.mask = this.arrowForMask;
    this.addChild(this.progressRect);
  }
}
