import { Country } from '../../data/Country';
import { data } from '../../GameManager';
import { CountryHandler } from './CountryHandler';
import { EventBase } from '../EventBase';
import { MainScene } from '../../scene/MainScene';
import { Dayjs } from 'dayjs';

export class CountryPlayerHandler extends CountryHandler {
  country: Country;

  constructor(country: Country) {
    super();
    this.country = country;
  }

  dispatchEvents(date: Dayjs) {
    //イベント発火処理
    data().events.forEach((event: EventBase) => {
      // event.dispatch(this, MainScene.);
    });
  }

  onEvent(event: EventBase) {
    // event.showDialog();
  }
}
