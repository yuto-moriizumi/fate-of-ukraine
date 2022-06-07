import { EventBase } from '../event/EventBase';
import { EventFactory } from '../event/EventFactory';
import {
  Dict,
  EventJson,
  SaveDataEventJson,
  SaveDataType,
} from '../type/JsonType';
import { SerializableMap } from './SerializableMap';

export class EventMap extends SerializableMap<EventBase> {
  private savedataMap = new Map<string, SaveDataEventJson>();
  public toJson(as: SaveDataType): Dict<EventJson> {
    return super.toJson(as) as Dict<EventJson>;
  }
  public loadJson(json: Dict<EventJson>) {
    Object.entries(json).forEach(([key, value]) => {
      const stored = this.get(key);
      if ('fired' in value) {
        if (stored !== undefined)
          // セーブデータでかつ事前にイベントデータがロードされていた場合
          stored.loadJson(value);
        else this.savedataMap.set(key, value); //セーブデータでかつ事前にイベントデータがロードされていなかった場合、セーブデータを仮保存
      } else {
        //セーブデータでなくかつ事前にイベントデータがロードされていた場合…上書き
        if (stored !== undefined) stored.loadJson(value);
        else {
          const event = EventFactory.fromJson(key, value);
          this.set(key, event); //新規作成
          const savedata = this.savedataMap.get(key);
          if (savedata) event.loadJson(savedata); //先にセーブデータがロードされていた場合は読み込む
        }
      }
    });
    console.log('provinces loaded:', this);
    return this;
  }
}
