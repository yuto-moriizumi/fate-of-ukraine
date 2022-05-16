import Effect from './Effect';
import * as PIXI from 'pixi.js';
import JsonType from '../../Utils/JsonType';
import JsonObject from '../../Utils/JsonObject';
import { Country } from '../../data/Country';
import { Province } from '../../data/Provice';
import { data } from '../../GameManager';
import { SaveDataType } from '../../type/JsonType';

export default class SetOwner extends Effect {
  private type = this.constructor.name;
  private _root!: Country;
  private _provinces = new Array<Province>();

  public activate() {
    this._provinces.forEach((province) => {
      province.owner = this._root;
    });
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    if (value instanceof Array) {
      for (const i in value)
        if (value[i] instanceof Province) value[i] = value[i].getId();
    }
    return [key, value];
  }

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      root: this._root.id,
      provinces: this._provinces,
    };
  }

  public loadJson(json: any) {
    this._root = json.root;
    this._provinces = json.provinces;
  }
}
