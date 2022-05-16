import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { CountryHandler } from './CountryHandler';
import { EventBase } from '../EventBase';
import { MainScene } from '../../scene/MainScene';

export class CountryPlayerHandler extends CountryHandler {
  country: Country;

  constructor(country: Country) {
    super();
    this.country = country;
  }

  dispatchEvents() {
    //イベント発火処理
    data().events.forEach((event: EventBase) => {
      // event.dispatch(this, MainScene.);
    });
  }

  onEvent(event: EventBase) {
    // event.showDialog();
  }

  public update() {
    this.dispatchEvents();
  }
}
