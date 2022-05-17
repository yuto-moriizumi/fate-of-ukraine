import { Province } from '../data/Provice';
import {
  Dict,
  ProvinceJson,
  SaveDataType,
  SAVEDATA_TYPE,
} from '../type/JsonType';
import { SerializableMap } from './SerializableMap';

export class ProvinceMap extends SerializableMap<Province> {
  public toJson(as: SaveDataType): Dict<ProvinceJson> | undefined {
    if (as === SAVEDATA_TYPE.EVENTDATA) return undefined;
    return super.toJson(as) as Dict<ProvinceJson>;
  }
  public loadJson(json: Dict<ProvinceJson>) {
    Object.entries(json).forEach(([key, value]) =>
      this.set(key, (this.get(key) ?? new Province(key)).loadJson(value))
    );
    console.log('provinces loaded:', this);
    return this;
  }
}
