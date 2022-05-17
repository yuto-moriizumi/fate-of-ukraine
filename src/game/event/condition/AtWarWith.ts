import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { AtWarWithJson, CONDITION_TYPE, SaveDataType } from '../../type/JsonType';
import Condition from './Condition';

export class AtWarWith extends Condition {
  private country!: string; //Country

  public isValid(country: Country, date: Dayjs): boolean {
    // const target = data().countries.get(this.country);
    // return country.getWarInfoWith(target) != null;
    return true;
  }

  public toJson(as: SaveDataType): AtWarWithJson {
    return {
      type: CONDITION_TYPE.AT_WAR_WITH,
      country: this.country,
    };
  }

  public loadJson(json: AtWarWithJson) {
    this.country = json.country;
    return this;
  }
}
