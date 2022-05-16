import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import Condition from './Condition';

export default class AtWarWith extends Condition {
  private country!: string; //Country

  public isValid(country: Country, date: Date): boolean {
    // const target = data().countries.get(this.country);
    // return country.getWarInfoWith(target) != null;
    return true;
  }
}
