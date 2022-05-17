import Effect from './Effect';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { EFFECT_TYPE, GainAccessJson, SaveDataType } from '../../type/JsonType';

export default class GainAccess extends Effect {
  private type = this.constructor.name;
  private _root!: string;
  private _target!: string;

  public get root() {
    return data().countries.get(this._root);
  }
  public get target() {
    return data().countries.get(this._root);
  }

  public activate() {
    // const access = new Access(this._root, this._target);
    // access.activate();
  }

  public toJson(as: SaveDataType): GainAccessJson {
    return {
      type: EFFECT_TYPE.GAIN_ACCESS,
      root: this._root,
      target: this._target,
    };
  }

  public loadJson(json: GainAccessJson) {
    this._root = json.root;
    this._target = json.target;
    return this;
  }
}
