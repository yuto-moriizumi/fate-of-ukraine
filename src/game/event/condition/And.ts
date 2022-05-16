import { Country } from '../../data/Country';
import Condition from './Condition';
import ConditionCreator from './ConditionCreator';

export default class And extends Condition {
  private _conditions: Condition[] = [];

  public set conditions(conditions: { type: string }[]) {
    this._conditions = conditions.map((condition) =>
      ConditionCreator.createCondition(condition)
    );
  }
  public isValid(country: Country, date: Date): boolean {
    return this._conditions.every((condition) =>
      condition.isValid(country, date)
    );
  }
}
