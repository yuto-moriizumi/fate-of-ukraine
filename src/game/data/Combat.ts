import { Division } from '../container/Division';
import { data } from '../GameManager';

export class Combat {
  private readonly attacker = new Set<Division>();
  private readonly defenders = new Set<Division>();

  constructor() {
    data().combats.add(this);
  }

  public update() {
    if (this.attacker.getOrganization() <= 0) {
      if (this.defender.getOrganization() <= 0) {
        //引き分けである
        this.attacker.stopMove();
        this.defender.stopMove();
        this.endCombat();
        return;
      } else {
        //防衛側の勝ち
        this.attacker.stopMove(); //攻撃側は移動を停止
        this.endCombat();
        return;
      }
    } else if (this.defender.getOrganization() <= 0) {
      //攻撃側の勝ち
      this.defender.retreat(); //防衛側は撤退
      this.endCombat();
      return;
    }
    //戦闘は継続する
    this.attacker.attack(this.defender);
    this.defender.attack(this.attacker);
  }

  private endCombat() {
    GameManager.instance.data.removeCombat(this);
    this.attacker.removeCombat(this);
    this.defender.removeCombat(this);
  }

  public getRoot(): DivisionInfo {
    return this.attacker;
  }

  public getTarget(): DivisionInfo {
    return this.defender;
  }

  public getOpponent(division: DivisionInfo) {
    return this.getRoot() === division ? this.getTarget() : this.getRoot();
  }
}
