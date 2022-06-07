import Effect from './Effect';
import { data } from '../../GameManager';
import { EFFECT_TYPE, PeaceJson } from '../../type/JsonType';

export default class Peace extends Effect {
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

  public toJson(): PeaceJson {
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
