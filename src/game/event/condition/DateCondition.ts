import dayjs, { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { CONDITION_TYPE, DateConditionJson } from '../../type/JsonType';
import Condition from './Condition';

export default class DateCondition extends Condition {
  private date!: Dayjs;

  public isValid(country: Country, date: Dayjs): boolean {
    return date.isAfter(this.date);
  }

  public toJson(): DateConditionJson {
    return {
      type: CONDITION_TYPE.DATE_CONDITION,
      date: this.date.format('YYYY-MM-DD hh:00'),
    };
  }

  public loadJson(json: DateConditionJson) {
    this.date = dayjs(json.date);
    return this;
  }
}
