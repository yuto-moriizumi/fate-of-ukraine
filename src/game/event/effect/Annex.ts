import Effect from './Effect';
import JsonType from '../../Utils/JsonType';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { SaveDataType } from '../../type/JsonType';

export default class Annex extends Effect {
  private type = this.constructor.name;
  private _root!: Country;
  private _target!: Country;

  public activate() {
    data().provinces.forEach((province) => {
      if (province.owner !== this._target) return;
      province.owner = this._root;
    });
  }

  public toJson(as: SaveDataType) {
    return {
      ...super.toJson(as),
      root: this._root.id,
      target: this._target.id,
    };
  }

  public loadJson(json: any) {
    this._root = json.root;
    this._target = json.target;
  }
}
