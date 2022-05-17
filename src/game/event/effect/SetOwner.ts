import Effect from './Effect';
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
