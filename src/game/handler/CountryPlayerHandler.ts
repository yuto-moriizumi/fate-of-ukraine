import { Country } from '../data/Country';
import { data } from '../GameManager';
import { CountryHandler } from './CountryHandler';
import { EventBase } from '../event/EventBase';
import { MainScene } from '../scene/MainScene';
import { Dayjs } from 'dayjs';

export class CountryPlayerHandler extends CountryHandler {
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
