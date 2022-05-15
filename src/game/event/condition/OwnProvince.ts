import Condition from "./Condition";
import GameManager from "../../GameManager";
import Country from "../../Country";

export default class OwnProvince extends Condition {
  private province: string;

  public isValid(country: Country, date: Date): boolean {
    const province = GameManager.instance.data
      .getProvinces()
      .get(this.province);
    return province.getOwner() == country;
  }
}
