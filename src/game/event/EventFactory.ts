import { InvisibleEventJson, VisibleEventJson } from '../type/JsonType';
import { VisibleEvent } from './VisibleEvent';
import { InvisibleEvent } from './InvisibleEvent';

export class EventFactory {
  public static fromJson(
    id: string,
    json: VisibleEventJson | InvisibleEventJson
  ) {
    if ('title' in json) {
      return new VisibleEvent(id).loadJson(json);
    }
    return new InvisibleEvent(id).loadJson(json);
  }
}
