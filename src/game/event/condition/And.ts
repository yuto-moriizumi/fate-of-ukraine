import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { SaveDataType, SAVEDATA_TYPE } from '../../type/JsonType';
import Condition from './Condition';
import ConditionCreator from './ConditionCreator';

export default class And extends Condition {
  private conditions: Condition[] = [];

  public isValid(country: Country, date: Dayjs): boolean {
    return this.conditions.every((condition) =>
      condition.isValid(country, date)
    );
  }
  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      conditions: this.conditions.map((c) => c.toJson(as)),
    };
  }

  public loadJson(json: any) {
    this.conditions = json.conditions.map((condition: any) =>
      ConditionCreator.createCondition(condition)
    );
  }
}
