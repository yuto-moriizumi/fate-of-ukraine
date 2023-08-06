import Effect from './Effect';
import { data } from '../../GameManager';
import { ChangeNameJson, EFFECT_TYPE } from '../../type/JsonType';

export default class ChangeName extends Effect {
  private _country!: string;
  private name!: string;

  public get country() {
    return data().countries.get(this._country);
  }

  public activate() {
    if (this.country) this.country.name.val = this.name;
  }

  public toJson(): ChangeNameJson {
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
