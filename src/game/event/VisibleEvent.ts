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
  private immediate: Effect[] | undefined;
  private _options!: Option[];

  public get options() {
    return this._options;
  }

  public toJson(
    as: SaveDataType
  ): VisibleEventJson | SaveDataEventJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.EVENTDATA:
        return {
          title: this.title,
          desc: this.desc,
          triggeredOnly: this.triggeredOnly,
          condition: this.condition.toJson(as),
          immediate: this.immediate?.map((i) => i.toJson(as)),
          options: this._options.map((o) => o.toJson(as)),
          isGlobal: this.isGlobal,
        };
      case SAVEDATA_TYPE.SAVEDATA:
        return { fired: this.fired };
      default:
        return undefined;
    }
  }

  public loadJson(json: VisibleEventJson | SaveDataEventJson) {
    if ('fired' in json) {
      this.fired = json.fired;
    } else {
      this.triggeredOnly = json.triggeredOnly;
      this.condition = ConditionFactory.fromJson(json.condition);
      this.isGlobal = json.isGlobal;
      if (json.immediate)
        this.immediate = json.immediate.map((i) => EffectFactory.fromJson(i));
      this.title = json.title;
      this.desc = json.desc;
      this._options = json.options.map((o) => new Option().loadJson(o));
    }

    return this;
  }
}
