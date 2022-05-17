import { EventBase } from '../event/EventBase';
import { Dict, EventJson, SaveDataType } from '../type/JsonType';
import { SerializableMap } from './SerializableMap';

export class EventMap extends SerializableMap<EventBase> {
  public toJson(as: SaveDataType): Dict<EventJson> {
    return super.toJson(as) as Dict<EventJson>;
  }
  public loadJson(json: Dict<EventJson>) {
    Object.entries(json).forEach(([key, value]) =>
      this.set(key, (this.get(key) ?? new EventBase(key)).loadJson(value))
    );
    console.log('provinces loaded:', this);
    return this;
  }
}
