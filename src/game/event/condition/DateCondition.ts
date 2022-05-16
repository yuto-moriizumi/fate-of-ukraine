import { Country } from '../../data/Country';
import Condition from './Condition';

export default class DateCondition extends Condition {
  // private _when: DateAdapter;

  public set when(date: string) {
    if (typeof date === 'string') {
      // this._when = new DateAdapter(date);
      return;
    }
    // this._when = date;
  }
  public isValid(country: Country, date: Date): boolean {
    // return date.getTime() >= this._when.getTime();
    return true;
  }
}
