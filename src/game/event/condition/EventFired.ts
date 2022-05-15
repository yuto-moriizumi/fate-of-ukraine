import Condition from "./Condition";
import GameManager from "../../GameManager";
import Country from "../../Country";

export default class EventFired extends Condition {
  private id: string;

  public isValid(country: Country, date: Date): boolean {
    let ans = false;
    GameManager.instance.data.getEvents().forEach((event) => {
      if (event.getId() != this.id) return;
      ans = event.isFired();
    });
    return ans;
  }
}
