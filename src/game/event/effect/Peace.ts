import Effect from './Effect';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { EFFECT_TYPE, PeaceJson, SaveDataType } from '../../type/JsonType';

export default class Peace extends Effect {
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
    // const war = this._root.getWarInfoWith(this._target);
    // if (war) {
    //   war.deactivate();
    // }
  }

  public toJson(as: SaveDataType): PeaceJson {
    return {
      type: EFFECT_TYPE.PEACE,
      root: this._root,
      target: this._target,
    };
  }

  public loadJson(json: PeaceJson) {
    this._root = json.root;
    this._target = json.target;
    return this;
  }
}
