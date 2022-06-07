import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import {
  CONDITION_TYPE,
  EventFiredJson,
  SaveDataType,
} from '../../type/JsonType';
import Condition from './Condition';

export default class EventFired extends Condition {
  private id!: string;

  public isValid(country: Country, date: Dayjs): boolean {
    const event = data().events.get(this.id);
    return event !== undefined && event.fired;
  }

  public toJson(as: SaveDataType): EventFiredJson {
    return {
      type: CONDITION_TYPE.EVENT_FIRED,
      id: this.id,
    };
  }

  public loadJson(json: EventFiredJson) {
    this.id = json.id;
    return this;
  }
}
