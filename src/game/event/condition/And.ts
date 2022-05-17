import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { AndJson, CONDITION_TYPE, SaveDataType, SAVEDATA_TYPE } from '../../type/JsonType';
import Condition from './Condition';
import ConditionCreator from './ConditionCreator';

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
    this.conditions = json.conditions.map((condition: any) =>
      ConditionCreator.createCondition(condition)
    );
    return this;
  }
}
