import Effect from './Effect';
import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { ChangeNameJson, EFFECT_TYPE, SaveDataType } from '../../type/JsonType';

export default class ChangeName extends Effect {
  private type = this.constructor.name;
  private _country!: string;
  private name!: string;

  public get country() {
    return data().countries.get(this._country);
  }

  public activate() {
    // this._country.name = this.name;
  }

  public toJson(as: SaveDataType): ChangeNameJson {
    return {
      type: EFFECT_TYPE.CHANGE_NAME,
      country: this._country,
      name: this.name,
    };
  }

  public loadJson(json: ChangeNameJson) {
    this._country = json.country;
    this.name = json.name;
    return this;
  }
}
