import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import {
  AndJson,
  ConditionJson,
  CONDITION_TYPE,
  SaveDataType,
} from '../../type/JsonType';
import Condition from './Condition';
import ConditionFactory from './ConditionFactory';

export default class And extends Condition {
  private conditions: Condition[] = [];

  public isValid(country: Country, date: Dayjs): boolean {
    return this.conditions.every((condition) =>
      condition.isValid(country, date)
    );
  }
  public toJson(as: SaveDataType): AndJson {
    return {
      type: CONDITION_TYPE.AND,
      conditions: this.conditions.map((c) => c.toJson(as)),
    };
  }

  public loadJson(json: AndJson) {
    this.conditions = json.conditions.map((condition: ConditionJson) =>
      ConditionFactory.fromJson(condition)
    );
    return this;
  }
}
