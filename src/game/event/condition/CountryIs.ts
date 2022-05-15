import Condition from "./Condition";
import DateAdapter from "../../DateAdapter";
import Country from "../../Country";
import GameManager from "../../GameManager";
import JsonType from "../../Utils/JsonType";

/**
 * イベント発火者が指定した国であることを確認します
 * 同時に、国が存在している（領土を1つ以上持っている）ことを確認します
 * @export
 * @class CountryIs
 * @extends {Condition}
 */
export default class CountryIs extends Condition {
  private _country: Country;

  public isValid(country: Country, date: Date): boolean {
    return (
      this._country == country &&
      GameManager.instance.data
        .getProvinces()
        .some((p) => p.getOwner() == country)
    );
  }

  private set country(countryId: string) {
    this._country = GameManager.instance.data.getCountry(countryId);
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) value = value.id;
    return [key, value];
  }
}
