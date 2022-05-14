import { CountryJson, SaveDataType, SAVEDATA_TYPE } from '../type/JsonType';
import { Serializable } from '../util/Serializable';

export class Country implements Serializable {
  /**
   * 国を一意に特定するID、基本英数字3文字(INDなど)
   * @private
   * @type {string}
   * @memberof Country
   */
  private id!: string;
  private name!: string;
  private color!: string;
  private money!: number;

  public get flagPath(): string {
    return `assets/flags/${this.id}.png`;
  }

  constructor(id: string) {
    this.id = id;
  }
  //   private __diplomaticRelations: Array<DiplomaticTie> = new Array<DiplomaticTie>();
  //   private divisions = new Array<DivisionData>();

  //   public addDiplomaticRelation(relation: DiplomaticRelation) {
  //     this.diplomaticRelations.push(relation);
  //   }

  //   public removeDiplomaticRelation(tie: DiplomaticTie) {
  //     this.__diplomaticTies = this.__diplomaticTies.filter((tie2) => {
  //       return tie !== tie2;
  //     });
  //   }

  /**
   * 時間単位の利益を計算します
   * @returns
   * @memberof Country
   */
  public calcBalance() {
    // let balance = 0;
    // GameManager.instance.data.getProvinces().forEach((province) => {
    //   if (province.getOwner() == this) {
    //     balance += 1; //領土につき1
    //     if (province.getCulture() == province.getOwner().getCulture())
    //       balance += 1; //自国と同じ文化ならさらに+1
    //   }
    // });
    // return balance - this.calcMaintanance();
    return 0;
  }

  public update() {
    //金を更新
    // this.__money.setMoney(this.__money.getMoney() + this.calcBalance());
    // this._divisions.forEach((division) => division.update());
    // if (this.__id !== Country.SEA_ID) this.__handler.update(); //海でないならAIを呼び出す
  }

  //   public getDivisions() {
  //     return this._divisions;
  //   }

  //   public addDivision(division: DivisionInfo) {
  //     this._divisions.push(division);
  //   }

  //   public removeDivision(division: DivisionInfo) {
  //     this._divisions = this._divisions.filter((d) => d != division);
  //   }

  //   /**
  //    * 何らかの理由で国が消滅する場合に呼ぶ
  //    * オブジェクトが消えるわけではない
  //    * @memberof Country
  //    */
  //   public destroy() {
  //     this.__diplomaticTies.forEach((diplomacy) => {
  //       //全ての外交関係を削除
  //       this.__observers.forEach((o) => o.onDiplomacyChange(diplomacy, false));
  //       diplomacy.deactivate();
  //     });
  //     this._divisions.forEach((d) => d.destroy());
  //   }

  public hasWar() {
    // return this.__diplomaticTies.some((tie: DiplomaticTie) => {
    //   if (tie instanceof War) return true;
    //   return false;
    // });
    return true;
  }

  /**
   * この国が指定の国に対して軍事通行権を有しているか
   * @param {Country} country
   * @memberof Country
   */
  public hasAccessTo(country: Country) {
    // return this.__diplomaticTies.some((d) => {
    //   return (
    //     d instanceof Access && d.getRoot() == this && d.getTarget() == country
    //   );
    // });
    return true;
  }

  /**
   * この国が引数の国と同盟しているか
   * @param {Country} target
   * @returns
   * @memberof Country
   */
  public isAlliedWith(target: Country): boolean {
    // return this.__diplomaticTies.some(
    //   (d) => d instanceof Alliance && d.getOpponent(this) == target
    // );
    return true;
  }

  public toJson(as: SaveDataType): CountryJson {
    return { name: this.name, color: this.color };
    // if (as === SAVEDATA_TYPE.GAMEDATA)
    //   return { name: this.name, color: this.color };
    // else if (as === SAVEDATA_TYPE.SAVEDATA) return { money: this.money };
    // return {};
  }

  public loadJson(json: CountryJson) {
    this.name = json.name;
    this.color = json.color;
    return this;
  }
}
