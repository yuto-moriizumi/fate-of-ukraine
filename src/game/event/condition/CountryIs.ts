import Condition from './Condition';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';

/**
 * イベント発火者が指定した国であることを確認します
 * 同時に、国が存在している（領土を1つ以上持っている）ことを確認します
 * @export
 * @class CountryIs
 * @extends {Condition}
 */
export default class CountryIs extends Condition {
  private _country!: Country;

  public isValid(country: Country, date: Date): boolean {
    return (
      this._country == country &&
      Array.from(data().provinces.values()).some((p) => p.owner == country)
    );
  }

  private set country(countryId: string) {
    const country = data().countries.get(countryId);
    if (country) this._country = country;
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) value = value.id;
    return [key, value];
  }
}
