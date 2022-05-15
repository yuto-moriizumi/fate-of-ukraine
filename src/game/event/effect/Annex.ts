import Effect from "./Effect";
import Country from "../../Country";
import GameManager from "../../GameManager";
import MainScene from "../../Scenes/MainScene";
import JsonType from "../../Utils/JsonType";

export default class Annex extends Effect {
  private type = this.constructor.name;
  private _root: Country;
  private _target: Country;

  public activate() {
    GameManager.instance.data.getProvinces().forEach((province) => {
      if (province.getOwner() !== this._target) return;
      province.setOwner(this._root);
    });
  }

  set root(countryId: string) {
    this._root = GameManager.instance.data.getCountry(countryId);
  }

  set target(countryId: string) {
    this._target = GameManager.instance.data.getCountry(countryId);
  }

  replacer(key: string, value: any, type: JsonType) {
    if (value instanceof Country) return [key, value.id];
    return [key, value];
  }
}
