import Effect from './Effect';
import * as PIXI from 'pixi.js';
import JsonType from '../../Utils/JsonType';
import JsonObject from '../../Utils/JsonObject';
import { Country } from '../../data/Country';
import { Province } from '../../data/Provice';
import { data } from '../../GameManager';

export default class SetOwner extends Effect {
  private type = this.constructor.name;
  private _root!: Country;
  private _provinces = new Array<Province>();

  public activate() {
    this._provinces.forEach((province) => {
      province.owner = this._root;
    });
  }

  set root(countryId: string) {
    const country = data().countries.get(countryId);
    if (country) this._root = country;
  }

  set provinces(provinceIds: Array<string>) {
    this._provinces = provinceIds
      .map((provinceId) => {
        if (provinceId.substr(0, 1) != '#') provinceId = '#' + provinceId; //#ついてないやつにつける data.json更新後削除
        const province = data().provinces.get(provinceId);
        //console.log(province);
        return province;
      })
      .filter((p) => p !== undefined) as Province[];
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    if (value instanceof Array) {
      for (const i in value)
        if (value[i] instanceof Province) value[i] = value[i].getId();
    }
    return [key, value];
  }
}
