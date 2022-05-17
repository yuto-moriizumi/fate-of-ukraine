import Effect from './Effect';

import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { DeclareWarJson, EFFECT_TYPE, SaveDataType } from '../../type/JsonType';

export default class DeclareWar extends Effect {
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
    // const war = new War(this._root, this._target);
    // war.activate();
  }

  public toJson(as: SaveDataType): DeclareWarJson {
    return {
      type: EFFECT_TYPE.DECLARE_WAR,
      root: this._root,
      target: this._target,
    };
  }

  public loadJson(json: DeclareWarJson) {
    this._root = json.root;
    this._target = json.target;
    return this;
  }
}
