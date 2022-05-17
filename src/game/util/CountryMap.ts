import { Country } from '../data/Country';
import { CountryJson, Dict, SaveDataType } from '../type/JsonType';
import { SerializableMap } from './SerializableMap';

export class CountryMap extends SerializableMap<Country> {
  public toJson(as: SaveDataType): Dict<CountryJson> {
    return super.toJson(as) as Dict<CountryJson>;
  }
  public loadJson(json: Dict<CountryJson>) {
    Object.entries(json).forEach(([key, value]) =>
      this.set(key, (this.get(key) ?? new Country(key)).loadJson(value))
    );
    console.log('countries loaded:', this);
    return this;
  }
}
