import Effect from "./Effect";
import Country from "../../Country";
import GameManager from "../../GameManager";
import MainScene from "../../Scenes/MainScene";
import JsonType from "../../Utils/JsonType";

export default class ChangeName extends Effect {
  private type = this.constructor.name;
  private _country: Country;
  private name: string;

  public activate() {
    this._country.name = this.name;
  }

  set country(countryId: string) {
    this._country = GameManager.instance.data.getCountry(countryId);
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    return [key, value];
  }
}
