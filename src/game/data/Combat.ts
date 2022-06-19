import { Division } from '../container/Division';
import { data } from '../GameManager';

export class Combat {
  public readonly attackers = new Set<Division>();
  public readonly defenders = new Set<Division>();

  constructor() {
    data().combats.add(this);
  }

  public get defenceAt() {
    return [...this.defenders][0].at;
  }

  public update() {
    [...this.attackers].filter((d) => d.hp <= 0).forEach((d) => d.retreat());
    [...this.defenders].filter((d) => d.hp <= 0).forEach((d) => d.retreat());
    //戦闘は継続する
    this.attackers.forEach((attacker) =>
      this.defenders.forEach((defender) => {
        attacker.attack(defender, 1 / this.defenders.size);
        defender.attack(attacker, 1 / this.attackers.size);
      })
    );
  }
}
