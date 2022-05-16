import Condition from './Condition';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { Dayjs } from 'dayjs';
import { SaveDataType } from '../../type/JsonType';

/**
 * イベント発火者が指定した国であることを確認します
 * 同時に、国が存在している（領土を1つ以上持っている）ことを確認します
 * @export
 * @class CountryIs
 * @extends {Condition}
 */
export default class CountryIs extends Condition {
  private country!: Country;

  public isValid(country: Country, date: Dayjs): boolean {
    return (
      this.country == country &&
      Array.from(data().provinces.values()).some((p) => p.owner == country)
    );
  }

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      country: this.country.id,
    };
  }

  public loadJson(json: any) {
    const country = data().countries.get(json.country);
    if (country) this.country = country;
  }
}
