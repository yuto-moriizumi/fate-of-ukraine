import { Division } from '../container/Division';

export class Combat {
  private readonly attackers: Set<Division> = new Set();
  private readonly defender: Set<Division> = new Set();

  //   public static create(
  //     attackers: Iterable<Division>,
  //     defenders: Iterable<Division>
  //   ) {
  //     const combat = new Combat();
  //     combat.attacker = root;
  //     combat.defender = target;
  //     root.addCombat(combat);
  //     target.addCombat(combat);
  //     GameManager.instance.data.addCombat(combat);
  //     return combat;
  //   }

  public update() {
    // if (this.attacker.getOrganization() <= 0) {
    //   if (this.defender.getOrganization() <= 0) {
    //     //引き分けである
    //     this.attacker.stopMove();
    //     this.defender.stopMove();
    //     this.endCombat();
    //     return;
    //   } else {
    //     //防衛側の勝ち
    //     this.attacker.stopMove(); //攻撃側は移動を停止
    //     this.endCombat();
    //     return;
    //   }
    // } else if (this.defender.getOrganization() <= 0) {
    //   //攻撃側の勝ち
    //   this.defender.retreat(); //防衛側は撤退
    //   this.endCombat();
    //   return;
    // }
    // //戦闘は継続する
    // this.attacker.attack(this.defender);
    // this.defender.attack(this.attacker);
  }

  private endCombat() {
    // GameManager.instance.data.removeCombat(this);
    // this.attacker.removeCombat(this);
    // this.defender.removeCombat(this);
  }
}
