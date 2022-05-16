import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import Condition from './Condition';

export default class OwnProvince extends Condition {
  private province!: string;

  public isValid(country: Country, date: Date): boolean {
    const province = data().provinces.get(this.province);
    return province?.owner == country;
  }
}
