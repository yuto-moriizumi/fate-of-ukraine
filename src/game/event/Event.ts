import Option from './Option';
import Condition from './condition/Condition';
import { data } from '../GameManager';
import ConditionCreator from './condition/ConditionCreator';
import { Country } from '../data/Country';
import Effect from './effect/Effect';
import { CountryHandler } from './handler/CountryHandler';

export class Event {
  private id!: string;
  private title!: string;
  private desc!: string;
  private hidden = false;
  private triggeredOnly = false;
  private fired = false;
  private _condition!: Condition;
  private _immediate!: Option;
  private _options = new Array<Option>();
  /**
   * グローバルイベントであるかどうか
   * グローバルイベントは、いずれかの国で発火されたときに、全ての国で発火します
   * ニュース的イベントに使用して下さい
   * @private
   * @memberof Event
   */
  private isGlobal = false;

  public isDispatchable(country: Country, date: Date): boolean {
    if (this.fired) return false; //発火済なら発火しない
    if (this.triggeredOnly) return false; //受動的イベントなら発火しない
    if (this._condition.isValid(country, date)) return true; //受動的イベントではなく、条件を満たしている場合は発火
    return false; //基本は発火しない
  }

  public dispatch(dispatcher: CountryHandler, date: Date) {
    if (!this.isDispatchable(dispatcher.getCountry(), date)) return; //発火可能でないなら発火しない
    this.fired = true;
    console.log('event dispatched', this.id);
    if (this._immediate) this._immediate.takeEffects();

    if (this.isGlobal) {
      //グローバルイベントの場合は全ての国で発火します
      data().countries.forEach((country) => country.onEvent(this));
    } else dispatcher.onEvent(this); //そうでない場合は発火国でのみ発火します
  }

  set condition(condition: { type: string }) {
    this._condition = ConditionCreator.createCondition(condition);
  }

  set options(options: Array<any>) {
    this._options = options.map((option) =>
      Object.assign(new Option(), option)
    );
  }

  public getOptions() {
    return this._options;
  }

  public getId() {
    return this.id;
  }

  public isFired() {
    return this.fired;
  }

  public getDesc() {
    return this.desc;
  }

  public getTitle() {
    return this.title;
  }

  private set immediate(immediate: object) {
    this._immediate = Object.assign(new Option(), immediate);
  }
}
