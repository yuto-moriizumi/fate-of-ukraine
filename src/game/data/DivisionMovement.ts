import { Division } from '../container/Division';
import { ProgressArrow } from '../container/ProgressArrow';
import { Combat } from './Combat';
import { Province } from './Provice';

export class DivisionMovement {
  private readonly division: Division;
  public readonly type: MoveType;
  public readonly destination: Province;
  private readonly arrow: ProgressArrow;
  private progress = 0; //0-1

  constructor(division: Division, type: MoveType, destination: Province) {
    this.division = division;
    this.type = type;
    this.destination = destination;
    this.arrow = new ProgressArrow(division.at, destination, type);
    division.addChild(this.arrow);

    // 移動先に敵師団がいたら戦闘開始/参加
    if (type === MOVE_TYPE.RETREAT) return;
    const enemies = destination.divisions.filter(
      (d) => !d.isRetreating && d.owner.hasWar(this.division.owner)
    );
    if (enemies.length === 0) return;
    const combat = Combat.get(this.division.at, destination);
    if (combat === undefined) new Combat([this.division], enemies);
    else combat.addAttacker(this.division);
  }

  public update() {
    if (this.division.combats.length > 0) return; // 戦闘中は移動が進まない
    if (
      this.type === MOVE_TYPE.RETREAT &&
      !this.division.owner.hasAccessTo(this.destination, true)
    ) {
      // 撤退先が敵国などに占領されたら撤退やりなおし
      this.division.retreat();
      return;
    }
    this.progress = Math.min(
      (this.type === MOVE_TYPE.MOVE ? 0.1 : 0.2) * (this.division.speed / 10),
      1
    );
    this.arrow.progress = this.progress;
    if (this.progress >= 1) {
      this.division.at = this.destination;
      this.division.stop();
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
