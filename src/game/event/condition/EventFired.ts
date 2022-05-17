import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { CONDITION_TYPE, EventFiredJson, SaveDataType } from '../../type/JsonType';
import Condition from './Condition';

export default class EventFired extends Condition {
  private id!: string;

  public isValid(country: Country, date: Dayjs): boolean {
    const ans = false;
    // data().getEvents().forEach((event) => {
    //   if (event.getId() != this.id) return;
    //   ans = event.isFired();
    // });
    return ans;
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
