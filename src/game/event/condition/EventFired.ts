import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { SaveDataType } from '../../type/JsonType';
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

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      id: this.id,
    };
  }

  public loadJson(json: any) {
    this.id = json.id;
  }
}
