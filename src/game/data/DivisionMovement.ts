import { Province } from './Provice';

export class DivisionMovement {
  private readonly type: MoveType;
  private readonly destination: Province;
  private readonly progress = 0;

  constructor(type: MoveType, destination: Province) {
    this.type = type;
    this.destination = destination;
  }
}

export const MOVE_TYPE = {
  MOVE: 'MOVE',
  RETREAT: 'RETREAT',
} as const;

export type MoveType = typeof MOVE_TYPE[keyof typeof MOVE_TYPE];
