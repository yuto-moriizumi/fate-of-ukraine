import Effect from "./Effect";
import Country from "../../Country";
import War from "../../DiplomaticTies/War";
import GameManager from "../../GameManager";
import JsonType from "../../Utils/JsonType";

export default class Peace extends Effect {
  private type = this.constructor.name;
  private _root: Country;
  private _target: Country;

  public activate() {
    const war = this._root.getWarInfoWith(this._target);
    if (war) {
      war.deactivate();
    }
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
