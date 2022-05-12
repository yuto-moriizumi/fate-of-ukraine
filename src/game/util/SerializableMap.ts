import { JsonType } from '../type/JsonType';
import { Serializable } from './Serializable';

export class SerializableMap<K, V> extends Map<K, V> implements Serializable {
  public toJson(as: JsonType) {
    return Object.entries(this).map(([key, value]: [string, V]) => {
      if (value.toJson) 
    });
  }
  public loadJson(json: GameDataJson) {
    if (json.provinces) {
      Object.entries(json.provinces).forEach(([key, value]) =>
        this.provinces.set(key, Object.assign(new Province(key), value))
      );
      console.log('gamedata provinces loaded:', this.provinces);
    }
    if (json.countries) {
      Object.entries(json.countries).forEach(([key, value]) =>
        this.countries.set(key, Object.assign(new Country(key), value))
      );
      console.log('gamedata countries loaded:', this.countries);
    }
    return this;
  }
}
