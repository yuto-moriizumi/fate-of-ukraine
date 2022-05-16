import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { SaveDataType } from '../../type/JsonType';
import Condition from './Condition';

export default class DateCondition extends Condition {
  private date!: Dayjs;

  public isValid(country: Country, date: Dayjs): boolean {
    return date.isAfter(this.date);
  }

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      date: this.date.format('YYYY-MM-DD'),
    };
  }

  public loadJson(json: any) {
    this.date = new Dayjs(json.date);
  }
}
