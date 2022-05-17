import Option from './Option';
import Condition from './condition/Condition';
import { data } from '../GameManager';
import { Country } from '../data/Country';
import Effect from './effect/Effect';
import { Dayjs } from 'dayjs';
import { Serializable } from '../util/Serializable';
import { EventJson, SaveDataType, SAVEDATA_TYPE } from '../type/JsonType';
import EffectFactory from './effect/EffectFactory';
import ConditionFactory from './condition/ConditionFactory';

export class EventBase implements Serializable {
  private readonly id: string;
  private title: string | undefined;
  private desc: string | undefined;
  private triggeredOnly = false;
  private fired = false;
  private condition!: Condition;
  private immediate = new Array<Effect>();
  private _options = new Array<Option>();
  /**
   * グローバルイベントであるかどうか
   * グローバルイベントは、いずれかの国で発火されたときに、全ての国で発火します
   * ニュース的イベントに使用して下さい
   * @private
   * @memberof Event
   */
  private isGlobal = false;

  public get options() {
    return this._options;
  }

  constructor(id: string) {
    this.id = id;
  }

  public isDispatchable(country: Country, date: Dayjs): boolean {
    if (this.fired) return false; //発火済なら発火しない
    if (this.triggeredOnly) return false; //受動的イベントなら発火しない
    if (this.condition.isValid(country, date)) return true; //受動的イベントではなく、条件を満たしている場合は発火
    return false; //基本は発火しない
  }

  public dispatch(country: Country, date: Dayjs) {
    if (!this.isDispatchable(country, date)) return; //発火可能でないなら発火しない
    this.fired = true;
    console.log('event dispatched', this.id);
    if (this.immediate) this.immediate.forEach((e) => e.activate());
    if (this.isGlobal) {
      //グローバルイベントの場合は全ての国で発火します
      data().countries.forEach((country) => country.onEvent(this));
    } else country.onEvent(this); //そうでない場合は発火国でのみ発火します
  }

  public toJson(as: SaveDataType): EventJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.EVENTDATA:
        return {
          title: this.title,
          desc: this.desc,
          triggeredOnly: this.triggeredOnly,
          condition: this.condition.toJson(as),
          immediate: this.immediate.map((i) => i.toJson(as)),
          options: this._options.map((o) => o.toJson(as)),
          isGlobal: this.isGlobal,
        };
      case SAVEDATA_TYPE.SAVEDATA:
        return { fired: this.fired };
      default:
        return undefined;
    }
  }

  public loadJson(json: EventJson) {
    if ('fired' in json) {
      this.fired = json.fired;
    } else {
      this.triggeredOnly = json.triggeredOnly;
      this.condition = ConditionFactory.fromJson(json.condition);
      if ('isGlobal' in json) this.isGlobal = json.isGlobal;
      else this.isGlobal = false;
      if (json.immediate)
        this.immediate = json.immediate.map((i) => EffectFactory.fromJson(i));
      if ('title' in json) {
        this.title = json.title;
        this.desc = json.desc;
        this._options = json.options.map((o) => new Option().loadJson(o));
      }
    }

    return this;
  }
}
