import { Country } from '../../data/Country';
import Condition from './Condition';
import ConditionCreator from './ConditionCreator';

export default class Always extends Condition {
  private always = true;
  public isValid(country: Country, date: Date): boolean {
    return this.always;
  }
}
