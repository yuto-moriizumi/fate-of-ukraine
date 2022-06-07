import Condition from './Condition';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { Dayjs } from 'dayjs';
import {
  CONDITION_TYPE,
  CountryIsJson,
  SaveDataType,
} from '../../type/JsonType';

/**
 * イベント発火者が指定した国であることを確認します
 * 同時に、国が存在している（領土を1つ以上持っている）ことを確認します
 * @export
 * @class CountryIs
 * @extends {Condition}
 */
export default class CountryIs extends Condition {
  private id!: string;

  private get country() {
    return data().countries.get(this.id);
  }

  public isValid(country: Country, date: Dayjs): boolean {
    return (
      this.country == country &&
      Array.from(data().provinces.values()).some((p) => p.owner == country)
    );
  }

  public toJson(as: SaveDataType): CountryIsJson {
    return {
      type: CONDITION_TYPE.COUNTRY_IS,
      country: this.id,
    };
  }

  public loadJson(json: CountryIsJson) {
    this.id = json.country;
    return this;
  }
}
