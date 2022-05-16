import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { SaveDataType } from '../../type/JsonType';
import Condition from './Condition';

export default class AtWarWith extends Condition {
  private country!: string; //Country

  public isValid(country: Country, date: Dayjs): boolean {
    // const target = data().countries.get(this.country);
    // return country.getWarInfoWith(target) != null;
    return true;
  }

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      country: this.country,
    };
  }

  public loadJson(json: any) {
    this.country = json.country;
  }
}
