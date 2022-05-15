import Condition from "./Condition";
import DateAdapter from "../../DateAdapter";
import Country from "../../Country";
import ConditionCreator from "./ConditionCreator";

export default class And extends Condition {
  private _conditions: Condition[] = [];

  public set conditions(conditions: object[]) {
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
