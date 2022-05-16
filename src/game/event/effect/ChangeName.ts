import Effect from './Effect';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';

export default class ChangeName extends Effect {
  private type = this.constructor.name;
  private _country!: Country;
  private name!: string;

  public activate() {
    // this._country.name = this.name;
  }

  set country(countryId: string) {
    const country = data().countries.get(countryId);
    if (country) this._country = country;
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    return [key, value];
  }
}
