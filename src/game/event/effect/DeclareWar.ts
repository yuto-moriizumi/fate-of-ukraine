import Effect from './Effect';

import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import {
  DeclareWarJson,
  DIPLOMACY_TYPE,
  EFFECT_TYPE,
  SaveDataType,
} from '../../type/JsonType';
import { War } from '../../diplomacy/War';

export default class DeclareWar extends Effect {
  private _root!: string;
  private _target!: string;
  public get root() {
    return data().countries.get(this._root);
  }
  public get target() {
    return data().countries.get(this._target);
  }

  public activate() {
    if (this.target) this.root?.declareWar(this.target);
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
