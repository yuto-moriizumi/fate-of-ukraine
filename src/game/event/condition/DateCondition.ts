import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { CONDITION_TYPE, DateConditionJson, SaveDataType } from '../../type/JsonType';
import Condition from './Condition';

export default class DateCondition extends Condition {
  private date!: Dayjs;

  public isValid(country: Country, date: Dayjs): boolean {
    return date.isAfter(this.date);
  }

  public toJson(as: SaveDataType): DateConditionJson {
    return {
      type: CONDITION_TYPE.DATE_CONDITION,
      date: this.date.format('YYYY-MM-DD'),
    };
  }

  public loadJson(json: DateConditionJson) {
    this.date = new Dayjs(json.date);
    return this;
  }
}
