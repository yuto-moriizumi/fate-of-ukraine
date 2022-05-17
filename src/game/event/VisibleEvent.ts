import Option from './Option';
import Condition from './condition/Condition';
import { data } from '../GameManager';
import { Country } from '../data/Country';
import Effect from './effect/Effect';
import { Dayjs } from 'dayjs';
import { Serializable } from '../util/Serializable';
import {
  EventJson,
  SaveDataEventJson,
  SaveDataType,
  SAVEDATA_TYPE,
  VisibleEventJson,
} from '../type/JsonType';
import EffectFactory from './effect/EffectFactory';
import ConditionFactory from './condition/ConditionFactory';
import { EventBase } from './EventBase';

export class VisibleEvent extends EventBase {
  private title!: string;
  private desc!: string;
  private immediate?: Effect[] | undefined;
  private _options!: Option[];

  public get options() {
    return this._options;
  }

  public dispatch(country: Country, date: Dayjs) {
    if (!this.isDispatchable(country, date)) return; //発火可能でないなら発火しない
    this.fired = true;
    console.log('visible event dispatched', { id: this.id, at: country });
    if (this.immediate) this.immediate.forEach((e) => e.activate());
    if (this.isGlobal) {
      //グローバルイベントの場合は全ての国で発火します
      data().countries.forEach((country) => country.onEvent(this));
    } else country.onEvent(this); //そうでない場合は発火国でのみ発火します
  }

  public toJson(
    as: SaveDataType
  ): VisibleEventJson | SaveDataEventJson | undefined {
    const base = super.toCommonJson(as);
    if (base === undefined) return;
    if ('fired' in base) return base;
    return {
      ...base,
      title: this.title,
      desc: this.desc,
      immediate: this.immediate?.map((i) => i.toJson(as)),
      options: this._options.map((o) => o.toJson(as)),
    };
  }

  public loadJson(json: VisibleEventJson | SaveDataEventJson) {
    super.loadJson(json);
    if ('title' in json) {
      if ('immediate' in json)
        this.immediate = json.immediate?.map((i) => EffectFactory.fromJson(i));
      this.title = json.title;
      this.desc = json.desc;
      this._options = json.options.map((o) => new Option().loadJson(o));
    }
    return this;
  }
}
