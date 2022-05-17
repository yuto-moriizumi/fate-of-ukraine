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

export class InvisibleEvent extends EventBase {
  immediate = new Array<Effect>();
  public toJson(
    as: SaveDataType
  ): InvisibleEventJson | SaveDataEventJson | undefined {
    switch (as) {
      case SAVEDATA_TYPE.EVENTDATA:
        return {
          triggeredOnly: this.triggeredOnly,
          condition: this.condition.toJson(as),
          immediate: this.immediate.map((i) => i.toJson(as)),
          isGlobal: this.isGlobal,
        };
      case SAVEDATA_TYPE.SAVEDATA:
        return { fired: this.fired };
      default:
        return undefined;
    }
  }

  public loadJson(json: InvisibleEventJson | SaveDataEventJson) {
    if ('fired' in json) {
      this.fired = json.fired;
    } else {
      this.triggeredOnly = json.triggeredOnly;
      this.condition = ConditionFactory.fromJson(json.condition);
      this.isGlobal = json.isGlobal;
      if (json.immediate)
        this.immediate = json.immediate.map((i) => EffectFactory.fromJson(i));
    }
    return this;
  }
}
