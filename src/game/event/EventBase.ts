import Option from './Option';
import Condition from './condition/Condition';
import { data } from '../GameManager';
import { Country } from '../data/Country';
import Effect from './effect/Effect';
import { Dayjs } from 'dayjs';
import { Serializable } from '../util/Serializable';
import {
  EventBaseJson,
  EventJson,
  SaveDataEventJson,
  SaveDataType,
  SAVEDATA_TYPE,
} from '../type/JsonType';
import EffectFactory from './effect/EffectFactory';
import ConditionFactory from './condition/ConditionFactory';

export abstract class EventBase implements Serializable {
  readonly id: string;
  triggeredOnly = false;
  fired = false;
  condition!: Condition;
  hours2happen: number | undefined;
  /**
   * グローバルイベントであるかどうか
   * グローバルイベントは、いずれかの国で発火されたときに、全ての国で発火します
   * ニュース的イベントに使用して下さい
   * @private
   * @memberof Event
   */
  isGlobal = false;

  constructor(id: string) {
    this.id = id;
  }

  public isDispatchable(country: Country, date: Dayjs): boolean {
    if (this.fired) return false; //発火済なら発火しない
    if (this.hours2happen && this.hours2happen <= 0) return true; //発火期限な発火
    if (this.triggeredOnly) return false; //受動的イベントなら発火しない
    if (this.condition.isValid(country, date)) return true; //条件を満たしている場合は発火
    return false; //基本は発火しない
  }

  public abstract dispatch(country: Country, date: Dayjs): void;

  public countFoward() {
    if (!this.fired && this.hours2happen) this.hours2happen -= 1; //未発火ならカウントを進める
  }

  public abstract toJson(as: SaveDataType): EventJson | undefined;

  toCommonJson(
    as: SaveDataType
  ): EventBaseJson | SaveDataEventJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.EVENTDATA:
        return {
          triggeredOnly: this.triggeredOnly,
          condition: this.condition.toJson(as),
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
    }
    return this;
  }
}
