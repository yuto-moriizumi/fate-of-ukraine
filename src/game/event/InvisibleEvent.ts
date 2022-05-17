import Option from './Option';
import {
  EventJson,
  InvisibleEventJson,
  SaveDataEventJson,
  SaveDataType,
  SAVEDATA_TYPE,
} from '../type/JsonType';
import EffectFactory from './effect/EffectFactory';
import ConditionFactory from './condition/ConditionFactory';
import { EventBase } from './EventBase';
import Effect from './effect/Effect';
import { Country } from '../data/Country';
import { Dayjs } from 'dayjs';
import { data } from '../GameManager';

export class InvisibleEvent extends EventBase {
  immediate = new Array<Effect>();

  public dispatch(country: Country, date: Dayjs) {
    if (!this.isDispatchable(country, date)) return; //発火可能でないなら発火しない
    this.fired = true;
    console.log('invisible event dispatched', { id: this.id, at: country });
    this.immediate.forEach((e) => e.activate());
    if (this.isGlobal) {
      //グローバルイベントの場合は全ての国で発火します
      data().countries.forEach((country) => country.onEvent(this));
    } else country.onEvent(this); //そうでない場合は発火国でのみ発火します
  }

  public toJson(
    as: SaveDataType
  ): InvisibleEventJson | SaveDataEventJson | undefined {
    const base = super.toCommonJson(as);
    if (base === undefined) return;
    if ('fired' in base) return base;
    return {
      ...base,
      immediate: this.immediate.map((i) => i.toJson(as)),
    };
  }

  public loadJson(json: InvisibleEventJson | SaveDataEventJson) {
    super.loadJson(json);
    if ('immediate' in json)
      this.immediate = json.immediate.map((i) => EffectFactory.fromJson(i));
    return this;
  }
}
