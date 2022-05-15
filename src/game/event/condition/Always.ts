import Condition from "./Condition";
import DateAdapter from "../../DateAdapter";
import Country from "../../Country";
import ConditionCreator from "./ConditionCreator";

export default class Always extends Condition {
  private always = true;
  public isValid(country: Country, date: Date): boolean {
    return this.always;
  }
}
