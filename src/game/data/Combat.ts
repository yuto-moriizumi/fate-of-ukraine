import { Division } from '../container/Division';
import { data } from '../GameManager';
import { Province } from './Provice';

export class Combat {
  private readonly attackers: Set<Division>;
  private readonly defenders: Set<Division>;

  constructor(attackers: Division[], defenders: Division[]) {
    this.attackers = new Set<Division>(attackers);
    this.defenders = new Set<Division>(defenders);
    data().combats.add(this);
  }

  public static get(from: Province, to: Province) {
    return to.incomingCombats.find((c) => c.attackFrom === from);
  }

  public get attackFrom() {
    return [...this.attackers][0].at;
  }

  public get defenceAt() {
    return [...this.defenders][0].at;
  }

  public contains(division: Division) {
    return this.attackers.has(division) || this.defenders.has(division);
  }

  public addAttacker(division: Division) {
    this.attackers.add(division);
  }

  public addDefender(division: Division) {
    this.defenders.add(division);
  }

  public update() {
    [...this.attackers]
      .filter((d) => d.hp <= 0)
      .forEach((d) => this.attackers.delete(d) && d.retreat());
    [...this.defenders]
      .filter((d) => d.hp <= 0)
      .forEach((d) => this.defenders.delete(d) && d.retreat());
    if (this.attackers.size === 0 || this.defenders.size === 0) {
      // 攻撃側もしくは防衛側がいなくなったら戦闘は終了する
      data().combats.delete(this);
      return;
    }
    //戦闘は継続する
    this.attackers.forEach((attacker) =>
      this.defenders.forEach((defender) => {
        attacker.attack(
          defender,
          1 / this.defenders.size / attacker.combats.length
        );
        defender.attack(
          attacker,
          1 / this.attackers.size / defender.combats.length
        );
      })
    );
  }
}
