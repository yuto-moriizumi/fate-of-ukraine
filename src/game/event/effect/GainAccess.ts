import Effect from './Effect';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';

export default class GainAccess extends Effect {
  private type = this.constructor.name;
  private _root!: Country;
  private _target!: Country;

  public activate() {
    // const access = new Access(this._root, this._target);
    // access.activate();
  }

  set root(countryId: string) {
    const country = data().countries.get(countryId);
    if (country) this._root = country;
  }

  set target(countryId: string) {
    const country = data().countries.get(countryId);
    if (country) this._target = country;
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    return [key, value];
  }
}
