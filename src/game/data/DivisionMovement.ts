import { Division } from '../container/Division';
import { Province } from './Provice';

export class DivisionMovement {
  private readonly division: Division;
  private readonly type: MoveType;
  private readonly destination: Province;
  private progress = 0;

  constructor(division: Division, type: MoveType, destination: Province) {
    this.division = division;
    this.type = type;
    this.destination = destination;
  }

  public update() {
    this.progress += 1;
    if (this.progress >= 1) {
      this.division.at = this.destination;
      this.division.destination = undefined;
    }
  }
}

export const MOVE_TYPE = {
  MOVE: 'MOVE',
  RETREAT: 'RETREAT',
} as const;

export type MoveType = typeof MOVE_TYPE[keyof typeof MOVE_TYPE];
