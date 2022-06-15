import { Division } from '../container/Division';
import { ProgressArrow } from '../container/ProgressArrow';
import { Province } from './Provice';

export class DivisionMovement {
  private readonly division: Division;
  private readonly type: MoveType;
  private readonly destination: Province;
  private readonly arrow: ProgressArrow;
  private progress = 0;

  constructor(division: Division, type: MoveType, destination: Province) {
    this.division = division;
    this.type = type;
    this.destination = destination;
    this.arrow = new ProgressArrow(division.at, destination);
    division.addChild(this.arrow);
  }

  public update() {
    this.progress += 1;
    if (this.progress >= 1) {
      this.division.at = this.destination;
      this.division.destination = undefined;
    }
  }

  public destroy() {
    this.arrow.destroy();
  }
}

export const MOVE_TYPE = {
  MOVE: 'MOVE',
  RETREAT: 'RETREAT',
} as const;

export type MoveType = typeof MOVE_TYPE[keyof typeof MOVE_TYPE];
