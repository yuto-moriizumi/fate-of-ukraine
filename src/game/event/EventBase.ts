import Option from './Option';
import Condition from './condition/Condition';
import { data } from '../GameManager';
import ConditionCreator from './condition/ConditionCreator';
import { Country } from '../data/Country';
import Effect from './effect/Effect';
import { CountryHandler } from './handler/CountryHandler';

export class EventBase {
  private readonly id!: string;
  private readonly title!: string;
  private readonly desc!: string;
  private readonly hidden = false;
  private readonly triggeredOnly = false;
  private fired = false;
  private readonly condition!: Condition;
  private readonly immediate!: Option;
  public readonly options = new Array<Option>();
  /**
   * グローバルイベントであるかどうか
   * グローバルイベントは、いずれかの国で発火されたときに、全ての国で発火します
   * ニュース的イベントに使用して下さい
   * @private
   * @memberof Event
   */
  private readonly isGlobal = false;

  public isDispatchable(country: Country, date: Date): boolean {
    if (this.fired) return false; //発火済なら発火しない
    if (this.triggeredOnly) return false; //受動的イベントなら発火しない
    if (this.condition.isValid(country, date)) return true; //受動的イベントではなく、条件を満たしている場合は発火
    return false; //基本は発火しない
  }

  public dispatch(country: Country, date: Date) {
    if (!this.isDispatchable(country, date)) return; //発火可能でないなら発火しない
    this.fired = true;
    console.log('event dispatched', this.id);
    if (this.immediate) this.immediate.takeEffects();
    if (this.isGlobal) {
      //グローバルイベントの場合は全ての国で発火します
      data().countries.forEach((country) => country.onEvent(this));
    } else country.onEvent(this); //そうでない場合は発火国でのみ発火します
  }
}
