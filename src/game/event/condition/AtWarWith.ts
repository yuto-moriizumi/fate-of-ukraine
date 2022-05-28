import { Dayjs } from 'dayjs';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import {
  AtWarWithJson,
  CONDITION_TYPE,
  SaveDataType,
} from '../../type/JsonType';
import Condition from './Condition';

export class AtWarWith extends Condition {
  private target!: string; //Country

  public isValid(country: Country, date: Dayjs): boolean {
    const target = data().countries.get(this.target);
    if (target === undefined) return false;
    return country.hasWar(target);
  }

  public toJson(as: SaveDataType): AtWarWithJson {
    return {
      type: CONDITION_TYPE.AT_WAR_WITH,
      country: this.target,
    };
  }

  public loadJson(json: AtWarWithJson) {
    this.target = json.country;
    return this;
  }
}
