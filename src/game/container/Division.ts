import * as PIXI from 'pixi.js';
import { Combat } from '../data/Combat';
import { Country } from '../data/Country';
import { Province } from '../data/Provice';
import { data } from '../GameManager';

export class Division extends PIXI.Container {
  private readonly currentHp!: number;
  private readonly location!: Province;
  private readonly destination!: Province;
  /**
   * 移動の完了度合い
   * 0～1の百分率
   * @private
   * @memberof Division
   */
  private readonly movingProgress = 0;
  private readonly combats: Set<Combat> = new Set<Combat>();
  private readonly ownerId!: string;
  private readonly isRetreat = false;

  public get owner() {
    return data().countries.get(this.ownerId);
  }

  public setPosition(province: Province) {
    return;
  }

  public attack(target: Division) {
    // target.setOrganization(
    //   target.getOrganization() -
    //     this._template.getAttack() / this.__combats.length //攻撃に参加している数だけ弱くなる
    // );
    // this.setOrganization(
    //   this.getOrganization() -
    //     target._template.getAttack() / target.__combats.length //攻撃に参加している数だけ弱くなる
    // );
  }

  //   public getOrganization() {
  //     // return this.organization;
  //   }

  //   public setOrganization(organization: number) {
  //     this.organization = Math.min(
  //       Math.max(0, organization),
  //       this._template.getOrganization()
  //     );
  //     if (this.__sprite) {
  //       this.__sprite.setOrganizationRate(
  //         //スプライトの指揮統制率表示を更新
  //         this.organization / this._template.getOrganization()
  //       );
  //     }
  //   }

  public moveTo(destination: Province) {
    //移動先が変更なければ何もしない
    // if (this._destination == destination) return;
    // if (destination == this.getPosition()) {
    //   //目的地が今いる場所であれば移動停止
    //   this.stopMove();
    //   return;
    // }
    // //移動可能かチェック
    // if (
    //   (!MainScene.instance.cheat_move && //移動チートが無効で
    //     !this._position.isNextTo(destination)) || //隣接していないか
    //   !destination.hasAccess(this.owner) || //進入不可か
    //   this.isRetreat //撤退中の場合は
    // )
    //   return; //何もしない
    // this.stopMove(); //一度移動を停止
    // this._destination = destination;
    // this.movingProgress = 0;
    // this.__progressBar = new ArrowProgress(this.getPosition(), destination);
    // MainScene.instance.getMap().arrowLayer.addChild(this.__progressBar);
    // if (MainScene.instance.cheat_move) {
    //   //移動チート有効な場合は直ちに移動
    //   this.setPosition(this._destination);
    //   this.stopMove();
    // }
  }

  //   private hasCombatWith(target: DivisionInfo) {
  //     return GameManager.instance.data.getCombats().find((combat) => {
  //       return combat.getOpponent(this) == target;
  //     });
  //   }

  //   public addCombat(combat: Combat) {
  //     this.__combats.push(combat);
  //   }

  //   public removeCombat(combat: Combat) {
  //     this.__combats = this.__combats.filter((combat2) => {
  //       return combat != combat2;
  //     });
  //   }

  public destroy() {
    // if (this.__dead) return; //すでに死亡ならなにもしない
    // this.__dead = true;
    // if (this.__progressBar) this.__progressBar.destroy();
    // if (this._position) this._position.removeDivision(this);
    // this.__sprite.destroy();
    // this.__owner.removeDivision(this);
    // this.isRetreat = false;
  }

  public stopMove() {
    // this.movingProgress = 0;
    // if (this.__progressBar && this.__progressBar.geometry)
    //   this.__progressBar.destroy();
    // this.__progressBar = null;
    // this._destination = null;
    // this.isRetreat = false;
  }

  public isMoving(): boolean {
    return this.destination != null;
  }

  public isFighting(): boolean {
    return this.combats.size > 0;
  }

  public retreat() {
    // //撤退
    // const neighbours = this._position.getNeighbours().filter(
    //   (
    //     p //撤退可能なプロヴィンスをフィルタ
    //   ) =>
    //     GameManager.instance.data
    //       .getProvinces()
    //       .get(p)
    //       .hasPeaceAccess(this.__owner)
    // );
    // if (neighbours.length == 0) {
    //   //撤退先が無ければ破壊
    //   this.destroy();
    //   return;
    // }
    // //撤退開始
    // const destination = GameManager.instance.data
    //   .getProvinces()
    //   .get(neighbours[0]);
    // this.stopMove();
    // this._destination = destination;
    // this.movingProgress = 0;
    // this.__progressBar = new ArrowProgress(
    //   this.getPosition(),
    //   destination,
    //   0x3f3f3f //灰色
    // );
    // MainScene.instance.getMap().arrowLayer.addChild(this.__progressBar);
    // this.isRetreat = true;
  }

  public update() {
    // if (this._destination) {
    //   this.movingProgress = Math.min(
    //     100,
    //     this.movingProgress + this._template.getSpeed()
    //   );
    //   this.__progressBar.setProgress(this.movingProgress);
    //   //自滅判定 撤退先が占領されれば自滅する
    //   if (
    //     this.isRetreat &&
    //     this._destination.getOwner().getWarInfoWith(this.owner) != null
    //   ) {
    //     this.destroy();
    //     return;
    //   }
    //   //戦闘判定
    //   this._destination.getDivisons().forEach((division) => {
    //     if (!division.owner.getWarInfoWith(this.owner)) return; //戦争していないなら関係ない
    //     if (this.hasCombatWith(division)) return; //すでに戦闘が発生しているならreturn
    //     if (division.isRetreat) return; //敵師団が撤退中なら戦闘しない
    //     Combat.create(this, division);
    //   });
    //   if (this.movingProgress >= 100 && this.__combats.length == 0) {
    //     //移動終了判定
    //     this.setPosition(this._destination);
    //     this.stopMove();
    //     this.isRetreat = false;
    //   }
    //   return;
    // }
    // //移動していない場合
    // //指揮統制回復判定
    // if (this.__combats.length == 0) {
    //   this.setOrganization(
    //     this.getOrganization() + this._template.getRecoveryPerTime()
    //   );
    // }
  }
}
