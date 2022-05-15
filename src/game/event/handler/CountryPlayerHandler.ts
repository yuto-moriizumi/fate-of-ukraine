import { Country } from "../../data/Country";
import { CountryHandler } from "./CountryHandler";

export class CountryPlayerHandler extends CountryHandler {
  country: Country;

  constructor(country: Country) {
    super();
    this.country = country;
  }

  dispatchEvents() {
    //イベント発火処理
    data().getEvents().forEach((event: Event) => {
      event.dispatch(this, MainScene.instance.getDate());
    });
  }

  onEvent(event: Event) {
    event.showDialog();
  }

  public update() {
    this.dispatchEvents();
  }
}
