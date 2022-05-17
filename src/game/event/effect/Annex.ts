import Effect from './Effect';
import { data } from '../../GameManager';
import { AnnexJson, EFFECT_TYPE, SaveDataType } from '../../type/JsonType';

export default class Annex extends Effect {
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
    data().provinces.forEach((province) => {
      if (province.owner !== this.target) return;
      province.owner = this.root;
    });
  }

  public toJson(as: SaveDataType): AnnexJson {
    return {
      type: EFFECT_TYPE.ANNEX,
      root: this._root,
      target: this._target,
    };
  }

  public loadJson(json: AnnexJson) {
    this._root = json.root;
    this._target = json.target;
    return this;
  }
}
