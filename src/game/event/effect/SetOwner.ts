import Effect from './Effect';
import * as PIXI from 'pixi.js';
import JsonType from '../../Utils/JsonType';
import JsonObject from '../../Utils/JsonObject';
import { Country } from '../../data/Country';
import { Province } from '../../data/Provice';
import { data } from '../../GameManager';
import { EFFECT_TYPE, SaveDataType, SetOwnerJson } from '../../type/JsonType';

export default class SetOwner extends Effect {
  private type = this.constructor.name;
  private _root!: string;
  private _provinces = new Array<string>();

  public get root() {
    return data().countries.get(this._root);
  }

  public activate() {
    this._provinces.forEach((province) => {
      const p = data().provinces.get(province);
      if (p) p.owner = this.root;
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

  public toJson(as: SaveDataType): SetOwnerJson {
    return {
      type: EFFECT_TYPE.SET_OWNER,
      root: this._root,
      provinces: this._provinces,
    };
  }

  public loadJson(json: SetOwnerJson) {
    this._root = json.root;
    this._provinces = json.provinces;
    return this;
  }
}
