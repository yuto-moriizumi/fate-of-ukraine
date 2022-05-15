import Condition from "./Condition";
import GameManager from "../../GameManager";
import Country from "../../Country";

export default class AtWarWith extends Condition {
  private country: string; //Country

  public isValid(country: Country, date: Date): boolean {
    const target = GameManager.instance.data.getCountries().get(this.country);
    return country.getWarInfoWith(target) != null;
  }
}
