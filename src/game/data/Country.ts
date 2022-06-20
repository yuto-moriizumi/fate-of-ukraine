import type { CountryJson, SaveDataType } from '../type/JsonType';
import { SAVEDATA_TYPE } from '../type/JsonType';
import type { Serializable } from '../util/Serializable';
import type { EventBase } from '../event/EventBase';
import type { Dayjs } from 'dayjs';
import type { CountryHandler } from '../handler/CountryHandler';
import { CountryAIHandler } from '../handler/handlers';
import { data } from '../GameManager';
import { War } from '../diplomacy/War';
import { Division } from '../container/Division';
import Util from '../util/Util';
import { Access } from '../diplomacy/Access';
import { Alliance } from '../diplomacy/Alliance';
import { Province } from './Provice';
import { Observable } from '../util/Observable';

export class Country implements Serializable {
  /**
   * 国を一意に特定するID、基本英数字3文字(INDなど)
   * @private
   * @type {string}
   * @memberof Country
   */
  public readonly id!: string;
  public readonly name = new Observable<string>('');
  private _color!: string;
  private money = 0;
  public readonly divisions = new Set<Division>();
  private _handler: CountryHandler = new CountryAIHandler(this);

  public get flagPath(): string {
    return `assets/flags/${this.id}.png`;
  }

  public get color() {
    return this._color;
  }

  public set handler(handler: CountryHandler) {
    this._handler = handler;
  }

  public get diplomacy() {
    return new Set([...data().diplomacy].filter((d) => d.has(this)));
  }

  public get provinces() {
    return Array.from(data().provinces.values()).filter(
      (p) => p.owner === this
    );
  }

  get enemies() {
    return [...this.diplomacy]
      .filter((d) => d instanceof War)
      .map((d: War) => d.getOpponent(this));
  }

  constructor(id: string) {
    this.id = id;
  }

  public buildDivision() {
    const provinces = this.provinces;
    const division = new Division(this, Util.getRandom(provinces));
    this.divisions.add(division);
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
    const balance = this.provinces.length;
    return balance - this.calcMaintanance();
  }

  public calcMaintanance() {
    return this.divisions.size;
  }

  public update(date: Dayjs) {
    this._handler.update(date);
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

  /**
   * この国が指定の国に対して軍事通行権を有しているか
   * @param {Country} country
   * @memberof Country
   */
  public hasAccessTo(target: Country | Province, peacefully = false) {
    let targetCountry: Country;
    if (target instanceof Province) {
      if (target.owner === undefined) return false;
      targetCountry = target.owner;
    } else targetCountry = target;
    if (targetCountry === this) return true;
    return [...this.diplomacy].some(
      (d) =>
        (d instanceof Alliance && d.getOpponent(this) === targetCountry) ||
        (d instanceof Access && d.root == this && d.target == targetCountry) ||
        (!peacefully &&
          d instanceof War &&
          d.getOpponent(this) === targetCountry)
    );
  }

  public hasWar(target?: Country) {
    if (target === undefined) {
      if (this.enemies.length > 0) return true;
      return false;
    }
    return this.enemies.some((c) => c === target);
  }

  public onEvent(event: EventBase): void {
    this._handler.onEvent(event);
  }

  public toJson(as: SaveDataType): CountryJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.GAMEDATA:
        return { name: this.name.val, color: this._color };
      case SAVEDATA_TYPE.SAVEDATA:
        return { money: this.money };
    }
    return undefined;
  }

  public loadJson(json: CountryJson) {
    if ('name' in json) {
      this.name.val = json.name;
      this._color = json.color;
    } else if ('money' in json) this.money = json.money;
    return this;
  }
}
